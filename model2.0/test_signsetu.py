import cv2
import numpy as np
import mediapipe as mp
import tensorflow as tf
import time

# =========================
# MODEL (manual rebuild)
# =========================
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(30, 84)),
    tf.keras.layers.LSTM(64, return_sequences=True),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.LSTM(32),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(11, activation='softmax')
])

model.load_weights("signsetu_model.h5")

# =========================
# LABELS
# =========================
labels = [
    'drink','head','hot','hungry','mouth',
    'no','owie','please','sick','water','yes'
]

# =========================
# MEDIAPIPE
# =========================
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=2)

# =========================
# CAMERA
# =========================
cap = cv2.VideoCapture(0)

sequence = []

# =========================
# FEATURE EXTRACTION
# =========================
def extract_features(results):
    row = []

    if results.multi_hand_landmarks:
        for i in range(2):
            if i < len(results.multi_hand_landmarks):
                hand = results.multi_hand_landmarks[i]
                coords = np.array([[lm.x, lm.y] for lm in hand.landmark], dtype=np.float32)

                coords -= coords[0]
                scale = np.max(np.abs(coords)) + 1e-6
                coords /= scale

                row.extend(coords.flatten())
            else:
                row.extend([0.0] * 42)
    else:
        row.extend([0.0] * 84)

    return row

# =========================
# STATE MACHINE
# =========================
state = "waiting"
result_text = ""

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb)

    # =========================
    # WAITING
    # =========================
    if state == "waiting":
        cv2.putText(frame, "Show sign and press SPACE",
                    (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,0), 2)

    # =========================
    # CAPTURING (FRAME BASED)
    # =========================
    elif state == "capturing":

        cv2.putText(frame, f"Capturing... {len(sequence)}/30",
                    (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,255), 2)

        features = extract_features(results)
        sequence.append(features)

        # keep max 30 frames
        if len(sequence) > 30:
            sequence.pop(0)

        # ✅ FIX: wait until 30 frames collected
        if len(sequence) >= 30:
            state = "predicting"

    # =========================
    # PREDICTING
    # =========================
    elif state == "predicting":

        input_data = np.array([sequence], dtype=np.float32)
        pred = model.predict(input_data, verbose=0)[0]

        idx = np.argmax(pred)
        conf = float(np.max(pred))
        label = labels[idx]

        result_text = f"{label} ({conf:.2f})"

        state = "show_result"

    # =========================
    # SHOW RESULT
    # =========================
    elif state == "show_result":

        cv2.putText(frame, result_text,
                    (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)

        cv2.putText(frame, "Press SPACE to try again",
                    (10, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,0), 2)

    cv2.imshow("SignSetu", frame)

    key = cv2.waitKey(1) & 0xFF

    # SPACE → start capture
    if key == 32 and state == "waiting":
        sequence = []
        time.sleep(0.3)  # small buffer
        state = "capturing"

    # SPACE → reset
    elif key == 32 and state == "show_result":
        state = "waiting"

    # ESC → exit
    elif key == 27:
        break

cap.release()
cv2.destroyAllWindows()