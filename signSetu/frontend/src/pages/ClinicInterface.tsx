import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { predictGesture, PredictionResponse, API_URL } from "@/lib/PredictionService";
import { ArrowLeft, Camera, Activity, Shield, Brain, MessageSquare, RefreshCw } from "lucide-react";

const ClinicInterface = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [sentence, setSentence] = useState<string>("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let hands: any;
    let camera: any;

    const initializeMediapipe = async () => {
      if (!isCameraActive || !videoRef.current || !canvasRef.current) return;

      const Hands = (window as any).Hands;
      const Camera = (window as any).Camera;
      const { drawConnectors, drawLandmarks } = (window as any);
      const HAND_CONNECTIONS = (window as any).HAND_CONNECTIONS;

      if (!Hands || !Camera) {
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
          
          if (drawConnectors && HAND_CONNECTIONS) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 5 });
          }
          if (drawLandmarks) {
            drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
          }

          const flattenedLandmarks = landmarks.flatMap((lm: any) => [lm.x, lm.y, lm.z]);
          handlePrediction(flattenedLandmarks);
        } else {
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
      if (result.history) {
        setHistory(result.history);
      }
    }
  };

  const generateSentence = async () => {
    try {
      const response = await fetch(`${API_URL}/get_sentence`);
      const data = await response.json();
      setSentence(data.sentence);
    } catch (err) {
      console.error("Failed to generate sentence:", err);
    }
  };

  const clearHistory = async () => {
    try {
      await fetch(`${API_URL}/clear_history`, { method: "POST" });
      setHistory([]);
      setSentence("");
      setPrediction(null);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans selection:bg-purple-500/30">
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
        <div className="lg:col-span-2 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-zinc-900/80 border border-zinc-800/50 rounded-2xl overflow-hidden aspect-video flex items-center justify-center backdrop-blur-xl">
            {isCameraActive ? (
              <>
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" width={1280} height={720} />
              </>
            ) : (
              <div className="flex flex-col items-center gap-6 p-12 text-center">
                <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-10 h-10 text-zinc-500" />
                </div>
                <h2 className="text-2xl font-semibold">Ready to begin?</h2>
                <p className="text-zinc-400 max-w-sm">Secure, real-time sign language translation for clinical environments.</p>
                <button onClick={() => setIsCameraActive(true)} className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-all transform active:scale-95">
                  Initialize Camera
                </button>
              </div>
            )}
          </div>
        </div>

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
                  <p className="text-zinc-400 mt-2">Current Sign</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Confidence</span>
                    <span className="text-zinc-300">{(prediction.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${prediction.confidence * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-zinc-800/50">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Sequence Buffer</span>
                    <span className="text-zinc-400">{prediction.current_frames || 0}/30</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${((prediction.current_frames || 0) / 30) * 100}%` }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                <div className="w-12 h-12 border-2 border-zinc-800 border-t-zinc-500 rounded-full animate-spin mb-4" />
                <p className="text-zinc-500 text-sm italic">Tracking hand motion...</p>
              </div>
            )}
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-xl flex flex-col">
            <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Clinical Transcript
            </h3>
            
            <div className="flex-1 space-y-6">
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 min-h-[80px]">
                <div className="flex flex-wrap gap-2">
                  {history.map((word, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-[10px] font-bold border border-blue-500/30 animate-in fade-in">
                      {word}
                    </span>
                  ))}
                  {history.length === 0 && <span className="text-zinc-600 text-sm italic">Build your sentence...</span>}
                </div>
              </div>

              {sentence && (
                <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                  <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Translation</p>
                  <p className="text-lg font-medium text-white leading-tight">"{sentence}"</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button onClick={generateSentence} disabled={history.length === 0} className="py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 disabled:opacity-30 transition-all active:scale-95 flex items-center justify-center gap-2">
                  Form Sentence
                </button>
                <button onClick={clearHistory} className="py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl hover:bg-zinc-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClinicInterface;
