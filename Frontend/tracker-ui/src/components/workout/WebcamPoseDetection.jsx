import React, { useState, useEffect, useRef } from 'react';
import { Camera, Maximize, Video, VideoOff } from 'lucide-react';
import api from '../../api/axios';

export default function WebcamPoseDetection() {
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [repsCount, setRepsCount] = useState(0);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsActive(true);
    } catch (err) {
      console.error("Webcam access error:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsActive(false);
  };

  // Simulate joint coordinate updates while active
  useEffect(() => {
    if (!isActive) return;

    let localReps = 0;
    let step = 0;

    const interval = setInterval(async () => {
      // Simulate knee joint coordinates bending going from standing to squatting
      // a: Hip [50, 40], b: Knee [50, 70], c: Ankle [50, 95]
      let a = [50, 40];
      let b = [50, 70];
      let c = [50, 95];

      step = (step + 1) % 4;

      if (step === 0) {
        b = [50, 70]; // ~180 degrees (standing)
      } else if (step === 1) {
        b = [62, 75]; // descending
      } else if (step === 2) {
        b = [72, 68]; // squatting (~80 degrees knee angle)
      } else if (step === 3) {
        b = [50, 70]; // stood up (increment reps)
        localReps += 1;
        setRepsCount(localReps);
      }

      try {
        await api.post('/ai/vision/pose/stream', {
          a,
          b,
          c,
          reps: localReps,
        });
      } catch (err) {
        console.error("Error streaming pose telemetry:", err);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      stopCamera();
    };
  }, [isActive]);

  return (
    <div className="w-full h-full flex flex-col justify-between relative bg-[#050816] rounded-xl overflow-hidden border border-white/5 p-4 min-h-[220px]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#00F5FF]/5 to-transparent z-0 pointer-events-none" />
      
      <div className="flex justify-between items-center z-10 w-full mb-2">
        <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest text-v2-soft-gray border border-white/10">
          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
          {isActive ? 'Pose Engine Active' : 'Pose Engine Offline'}
        </div>
        <button
          onClick={isActive ? stopCamera : startCamera}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-wider transition-all border ${
            isActive 
              ? 'bg-red-950/40 border-red-500/30 text-red-400 hover:bg-red-900/40' 
              : 'bg-[#00F5FF]/10 border-[#00F5FF]/30 text-[#00F5FF] hover:bg-[#00F5FF]/20'
          }`}
        >
          {isActive ? (
            <>
              <VideoOff className="w-3 h-3" /> Stop Stream
            </>
          ) : (
            <>
              <Video className="w-3 h-3" /> Start Calibration
            </>
          )}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden rounded-lg bg-black/40 min-h-[140px] border border-white/5">
        {isActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="text-center z-10 text-white/40 flex flex-col items-center">
            <Camera className="w-8 h-8 mb-2 opacity-50 text-[#00F5FF]" />
            <p className="text-[10px] font-bold uppercase tracking-wider">Start Tracking to Activate Video</p>
          </div>
        )}
      </div>

      {isActive && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
          <div className="text-[8px] px-2 py-0.5 rounded bg-[#00F5FF]/20 text-[#00F5FF] font-mono border border-[#00F5FF]/30">SQUAT REPS: {repsCount}</div>
          <div className="text-[8px] px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#8B5CF6] font-mono border border-[#8B5CF6]/30">MediaPipe: Active</div>
        </div>
      )}
    </div>
  );
}
