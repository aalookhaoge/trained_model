import os
import sys
import numpy as np
import onnxruntime as ort
import json
import time
from collections import deque
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- PATHS ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model1.3")
MODEL_PATH = os.path.join(MODEL_DIR, "gesture_model.onnx")
LABELS_PATH = os.path.join(MODEL_DIR, "labels.json")

# Add parent directory to path to import contextModel
sys.path.append(BASE_DIR)

# --- LOAD NLP ---
try:
    from contextModel.nlp_rules import SentenceGenerator
    from contextModel.utils import clean_words
    sentence_gen = SentenceGenerator()
    print("Sentence Transformer integrated successfully.")
except Exception as e:
    print(f"Warning: Could not import contextModel: {e}")
    sentence_gen = None

# --- LOAD MODEL ---
session = None
input_name = None
GESTURE_LABELS = []
EXPECTED_FEATURES = 63

try:
    session = ort.InferenceSession(MODEL_PATH)
    input_details = session.get_inputs()[0]
    input_name = input_details.name
    input_shape = input_details.shape
    EXPECTED_FEATURES = input_shape[2]

    with open(LABELS_PATH, 'r') as f:
        labels_dict = json.load(f)
        GESTURE_LABELS = [labels_dict[str(i)] for i in range(len(labels_dict))]
    
    print(f"Model loaded: {input_shape}, Features: {EXPECTED_FEATURES}")
    print(f"Labels: {GESTURE_LABELS}")
except Exception as e:
    print(f"CRITICAL ERROR during startup: {e}")

# --- STATE ---
MIRROR_FIX = True  # Flip X coordinates for browser mirroring
SEQUENCE_LENGTH = 30
frame_buffer = deque(maxlen=SEQUENCE_LENGTH)
last_frame_time = 0
detected_words_history = []
last_added_word = None
last_word_time = 0

@app.route("/predict", methods=["POST"])
def predict():
    global last_frame_time, last_added_word, last_word_time
    if session is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        current_time = time.time()
        # Reset buffer if hand was missing for > 0.8s
        if current_time - last_frame_time > 0.8:
            frame_buffer.clear()
        
        last_frame_time = current_time

        data = request.json
        landmarks = data.get("landmarks")

        if not landmarks:
            return jsonify({"error": "No landmarks provided"}), 400

        # --- PREPROCESSING ---
        wrist_x = landmarks[0]
        wrist_y = landmarks[1]
        wrist_z = landmarks[2]
        
        # If mirror fix is on, we flip the wrist as well for the baseline
        if MIRROR_FIX:
            wrist_x = 1.0 - wrist_x

        normalized_landmarks = []
        for i in range(0, len(landmarks), 3):
            x = landmarks[i]
            y = landmarks[i+1]
            z = landmarks[i+2]
            
            if MIRROR_FIX:
                x = 1.0 - x
            
            normalized_landmarks.append(x - wrist_x)
            normalized_landmarks.append(y - wrist_y)
            if EXPECTED_FEATURES == 63:
                normalized_landmarks.append(z - wrist_z)
        # ----------------------

        frame_buffer.append(normalized_landmarks)

        if len(frame_buffer) < SEQUENCE_LENGTH:
            return jsonify({
                "label": "Collecting...",
                "confidence": 0,
                "current_frames": len(frame_buffer),
                "total_frames": SEQUENCE_LENGTH,
                "history": detected_words_history
            })

        # Inference
        input_data = np.array(list(frame_buffer), dtype=np.float32).reshape(1, SEQUENCE_LENGTH, -1)
        outputs = session.run(None, {input_name: input_data})
        prediction_idx = np.argmax(outputs[0])
        confidence = float(np.max(outputs[0]))
        label = GESTURE_LABELS[prediction_idx] if prediction_idx < len(GESTURE_LABELS) else f"Index {prediction_idx}"

        # Logic to add to history
        if confidence > 0.90: # High threshold for history
            if label != last_added_word or (current_time - last_word_time > 3.0):
                if label not in ["NONE", "WAIT", "BACKGROUND"]:
                    detected_words_history.append(label)
                    last_added_word = label
                    last_word_time = current_time

        return jsonify({
            "label": label,
            "confidence": confidence,
            "current_frames": len(frame_buffer),
            "total_frames": SEQUENCE_LENGTH,
            "history": detected_words_history
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_sentence", methods=["GET"])
def get_sentence():
    if not sentence_gen or not detected_words_history:
        return jsonify({"sentence": " ".join(detected_words_history) + ".", "words": detected_words_history})
    
    cleaned = clean_words(detected_words_history)
    sentence = sentence_gen.generate(cleaned)
    return jsonify({
        "sentence": sentence,
        "words": detected_words_history
    })

@app.route("/clear_history", methods=["POST"])
def clear_history():
    global detected_words_history, last_added_word
    detected_words_history = []
    last_added_word = None
    return jsonify({"status": "history cleared"})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": session is not None})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
