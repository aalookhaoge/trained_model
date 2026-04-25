import os
import numpy as np
import onnxruntime as ort
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Path to the model and labels (pointing to model1.3 as requested)
BASE_DIR = os.path.dirname(os.path.dirname(__file__)) # Go up from backend/ to signSetu/
MODEL_DIR = os.path.join(BASE_DIR, "model1.3")
MODEL_PATH = os.path.join(MODEL_DIR, "gesture_model.onnx")
LABELS_PATH = os.path.join(MODEL_DIR, "labels.json")

# Load the ONNX model
session = None
input_name = None
try:
    session = ort.InferenceSession(MODEL_PATH)
    input_details = session.get_inputs()[0]
    input_name = input_details.name

    # Load Labels
    try:
        with open(LABELS_PATH, 'r') as f:
            labels_dict = json.load(f)
            # Convert keys to int and sort to ensure correct ordering
            GESTURE_LABELS = [labels_dict[str(i)] for i in range(len(labels_dict))]
        print(f"Loaded {len(GESTURE_LABELS)} labels: {GESTURE_LABELS}")
    except Exception as e:
        print(f"Warning: Could not load labels.json: {e}")
        GESTURE_LABELS = ["Label " + str(i) for i in range(20)]

    # Model metadata
    input_shape = input_details.shape
    # Detect if the model expects 42 (X,Y) or 63 (X,Y,Z) features per frame
    EXPECTED_FEATURES = input_shape[2] 
    print(f"Model loaded successfully.")
    print(f"  Input name: {input_name}")
    print(f"  Input shape: {input_shape}")
    print(f"  Features per frame: {EXPECTED_FEATURES}")
except Exception as e:
    print(f"CRITICAL: Error loading model: {e}")

from collections import deque

import time

# Rolling buffer to store the last 30 frames
SEQUENCE_LENGTH = 30
frame_buffer = deque(maxlen=SEQUENCE_LENGTH)
last_frame_time = 0

@app.route("/predict", methods=["POST"])
def predict():
    global last_frame_time
    if session is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        # Check if we should reset the buffer due to a time gap (e.g., > 0.5 seconds)
        current_time = time.time()
        if current_time - last_frame_time > 0.5:
            frame_buffer.clear()
            print("Time gap detected - Resetting motion buffer.")
        
        last_frame_time = current_time

        data = request.json
        landmarks = data.get("landmarks")

        if not landmarks:
            return jsonify({"error": "No landmarks provided"}), 400

        # --- NORMALIZATION STEP ---
        # Make landmarks relative to the wrist (landmark 0)
        # landmarks is a flat list: [x0, y0, z0, x1, y1, z1, ...]
        wrist_x = landmarks[0]
        wrist_y = landmarks[1]
        wrist_z = landmarks[2]
        
        normalized_landmarks = []
        for i in range(0, len(landmarks), 3):
            normalized_landmarks.append(landmarks[i] - wrist_x)     # x
            normalized_landmarks.append(landmarks[i+1] - wrist_y)   # y
            # Only add Z if the model expects it
            if EXPECTED_FEATURES == 63:
                normalized_landmarks.append(landmarks[i+2] - wrist_z)   # z
        # --------------------------

        # Add normalized frame to buffer
        frame_buffer.append(normalized_landmarks)

        # Only predict if we have enough frames for a full sequence
        if len(frame_buffer) < SEQUENCE_LENGTH:
            return jsonify({
                "label": "Collecting...",
                "confidence": 0,
                "current_frames": len(frame_buffer),
                "total_frames": SEQUENCE_LENGTH,
                "status": f"Need {SEQUENCE_LENGTH - len(frame_buffer)} more frames"
            })

        # Convert buffer to numpy array and reshape to (1, 30, 63)
        input_data = np.array(list(frame_buffer), dtype=np.float32).reshape(1, SEQUENCE_LENGTH, -1)

        # Run inference
        outputs = session.run(None, {input_name: input_data})
        prediction_idx = np.argmax(outputs[0])
        
        confidence = float(np.max(outputs[0]))
        label = GESTURE_LABELS[prediction_idx] if prediction_idx < len(GESTURE_LABELS) else f"Index {prediction_idx}"

        return jsonify({
            "label": label,
            "confidence": confidence,
            "prediction_index": int(prediction_idx),
            "current_frames": len(frame_buffer),
            "total_frames": SEQUENCE_LENGTH
        })

    except Exception as e:
        import traceback
        print("PREDICTION ERROR:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": session is not None})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
