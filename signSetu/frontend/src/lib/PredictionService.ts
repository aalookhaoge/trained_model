const API_URL = "http://localhost:5000";

export interface PredictionResponse {
  label: string;
  confidence: number;
  prediction_index: number;
  current_frames?: number;
  total_frames?: number;
}

export const predictGesture = async (landmarks: number[]): Promise<PredictionResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ landmarks }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error predicting gesture:", error);
    return null;
  }
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    return data.status === "ok";
  } catch (error) {
    return false;
  }
};
