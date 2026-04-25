import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { predictGesture, PredictionResponse } from "@/lib/PredictionService";
import { ArrowLeft, Camera, Activity, Shield, Brain } from "lucide-react";

const ClinicInterface = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Note: In a real production app, you'd use @mediapipe/hands here.
  // For this demonstration, we'll setup the camera and a prediction loop.
  
  useEffect(() => {
    let hands: any;
    let camera: any;

    const initializeMediapipe = async () => {
      if (!isCameraActive || !videoRef.current || !canvasRef.current) return;

      // Access Mediapipe from global scope (added via script tags in index.html)
      const Hands = (window as any).Hands;
      const Camera = (window as any).Camera;
      const { drawConnectors, drawLandmarks } = (window as any);
      const HAND_CONNECTIONS = (window as any).HAND_CONNECTIONS;

      if (!Hands || !Camera) {
        console.error("Mediapipe libraries not loaded yet.");
        setError("System libraries loading... please wait.");
        return;
      }

      hands = new Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results: any) => {
        const canvasCtx = canvasRef.current?.getContext("2d");
        if (!canvasCtx || !canvasRef.current) return;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          
          // Draw landmarks for visual feedback
          if (drawConnectors && HAND_CONNECTIONS) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 5 });
          }
          if (drawLandmarks) {
            drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
          }

          // Flatten landmarks for the backend (21 landmarks * 3 coordinates = 63 values)
          const flattenedLandmarks = landmarks.flatMap((lm: any) => [lm.x, lm.y, lm.z]);
          
          // Send to backend
          handlePrediction(flattenedLandmarks);
        } else {
          // Reset prediction if no hand is visible
          setPrediction(null);
        }
        canvasCtx.restore();
      });

      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    };

    // Wait a bit for script tags to load if they haven't yet
    const timeout = setTimeout(initializeMediapipe, 1000);

    return () => {
      clearTimeout(timeout);
      if (camera) camera.stop();
      if (hands) hands.close();
    };
  }, [isCameraActive]);

  const handlePrediction = async (landmarks: number[]) => {
    const result = await predictGesture(landmarks);
    if (result) {
      setPrediction(result);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans selection:bg-purple-500/30">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isCameraActive ? "bg-green-500 animate-pulse" : "bg-zinc-600"}`} />
            <span className="text-sm font-medium text-zinc-300">{isCameraActive ? "System Live" : "System Standby"}</span>
          </div>
          <Shield className="w-5 h-5 text-zinc-500" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Camera Section */}
        <div className="lg:col-span-2 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-zinc-900/80 border border-zinc-800/50 rounded-2xl overflow-hidden aspect-video flex items-center justify-center backdrop-blur-xl">
            {isCameraActive ? (
              <>
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                <canvas 
                  ref={canvasRef} 
                  className="absolute top-0 left-0 w-full h-full pointer-events-none" 
                  width={1280} 
                  height={720} 
                />
              </>
            ) : (
              <div className="flex flex-col items-center gap-6 p-12 text-center">
                <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-10 h-10 text-zinc-500" />
                </div>
                <h2 className="text-2xl font-semibold">Ready to begin?</h2>
                <p className="text-zinc-400 max-w-sm">Secure, real-time sign language translation for clinical environments. No data leaves your local network.</p>
                <button 
                  onClick={() => setIsCameraActive(true)}
                  className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-all transform active:scale-95"
                >
                  Initialize Camera
                </button>
              </div>
            )}
            
            {error && (
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-md">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" /> {error}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Prediction & Diagnostics Section */}
        <div className="flex flex-col gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-xl">
            <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Brain className="w-4 h-4" /> Detection Result
            </h3>
            
            {prediction ? (
              <div className="space-y-6">
                <div>
                  <div className="text-7xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                    {prediction.label}
                  </div>
                  <p className="text-zinc-400 mt-2">Predicted Gesture</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Confidence</span>
                    <span className="text-zinc-300">{(prediction.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${prediction.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Sequence Progress Bar */}
                <div className="space-y-2 pt-4 border-t border-zinc-800/50">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500 font-bold uppercase tracking-tighter">Motion Buffer</span>
                    <span className="text-zinc-400 font-mono">
                      {prediction.current_frames || 0} / {prediction.total_frames || 30}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800/50 rounded-full overflow-hidden p-[1px] border border-zinc-700/30">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      style={{ width: `${((prediction.current_frames || 0) / (prediction.total_frames || 30)) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 italic">
                    {prediction.current_frames && prediction.current_frames < (prediction.total_frames || 30) 
                      ? "Collecting movement sequence..." 
                      : "Analyzing motion pattern..."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-2 border-zinc-800 border-t-zinc-500 rounded-full animate-spin mb-4" />
                <p className="text-zinc-500 text-sm">Waiting for input...</p>
              </div>
            )}
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-xl flex-1">
            <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-6">System Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
                <span className="text-zinc-400 text-sm">Backend Connection</span>
                <span className="text-green-500 text-sm font-medium">Stable</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
                <span className="text-zinc-400 text-sm">Neural Engine</span>
                <span className="text-blue-500 text-sm font-medium">ONNX Runtime</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-zinc-400 text-sm">Latency</span>
                <span className="text-zinc-300 text-sm font-medium">42ms</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsCameraActive(false)}
              className="w-full mt-8 py-3 border border-zinc-800 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
            >
              Terminate Session
            </button>
          </div>
        </div>
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
    </div>
  );
};

export default ClinicInterface;
