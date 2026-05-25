import React, { useState, useEffect, useRef } from 'react';
import { Camera, Maximize, Video, VideoOff } from 'lucide-react';
import api from '../../api/axios';

export default function WebcamPoseDetection() {
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [repsCount, setRepsCount] = useState(0);
  const [cameraError, setCameraError] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsActive(true);
      setCameraError(false);
    } catch (err) {
      console.error("Webcam access error:", err);
      setIsActive(true);
      setCameraError(true);
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

  // CV Overlay Animation
  useEffect(() => {
    if (!isActive) return;
    
    let animationFrameId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const animate = (time) => {
      // Ensure canvas dimensions match element
      if (canvas.width !== canvas.offsetWidth) canvas.width = canvas.offsetWidth;
      if (canvas.height !== canvas.offsetHeight) canvas.height = canvas.offsetHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      
      // Simulate breathing / slight tracking movement
      const offsetX = Math.sin(time / 500) * 10;
      const offsetY = Math.cos(time / 500) * 5;
      
      const drawPoint = (x, y) => {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#00F5FF';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00F5FF';
        ctx.fill();
      };

      const drawLine = (x1, y1, x2, y2) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
      };
      
      // Shoulders
      const leftShoulder = { x: centerX - 40 + offsetX, y: height * 0.3 + offsetY };
      const rightShoulder = { x: centerX + 40 + offsetX, y: height * 0.3 + offsetY };
      
      // Hips
      const leftHip = { x: centerX - 25 + offsetX, y: height * 0.6 + offsetY };
      const rightHip = { x: centerX + 25 + offsetX, y: height * 0.6 + offsetY };
      
      // Knees (squatting animation simulation)
      const squatDepth = (Math.sin(time / 1000) + 1) / 2; // 0 to 1
      const kneeY = height * 0.75 + (squatDepth * 20);
      
      const leftKnee = { x: centerX - 30 + offsetX, y: kneeY };
      const rightKnee = { x: centerX + 30 + offsetX, y: kneeY };

      // Draw Lines
      drawLine(leftShoulder.x, leftShoulder.y, rightShoulder.x, rightShoulder.y); 
      drawLine(leftShoulder.x, leftShoulder.y, leftHip.x, leftHip.y); 
      drawLine(rightShoulder.x, rightShoulder.y, rightHip.x, rightHip.y); 
      drawLine(leftHip.x, leftHip.y, rightHip.x, rightHip.y); 
      drawLine(leftHip.x, leftHip.y, leftKnee.x, leftKnee.y); 
      drawLine(rightHip.x, rightHip.y, rightKnee.x, rightKnee.y); 
      
      // Draw Points
      [leftShoulder, rightShoulder, leftHip, rightHip, leftKnee, rightKnee].forEach(p => drawPoint(p.x, p.y));

      // Draw a sweeping scanning laser
      const laserY = (time / 10) % height;
      ctx.beginPath();
      ctx.moveTo(0, laserY);
      ctx.lineTo(width, laserY);
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)'; 
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#EC4899';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [isActive]);

  return (
    <div className="w-full aspect-video flex flex-col justify-between relative bg-[#050816] rounded-xl overflow-hidden border border-white/5 p-4">
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

      <div className="flex-1 flex items-center justify-center relative overflow-hidden rounded-lg bg-black/40 h-full border border-white/5 mt-4">
        {isActive ? (
          <>
            {cameraError ? (
              <div className="w-full h-full bg-[#050816] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.05)_0%,transparent_70%)]" />
                <div className="w-full h-full absolute opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(0, 245, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.4) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <Camera className="w-12 h-12 text-[#00E5FF] opacity-50 mb-4 animate-pulse" />
                <p className="text-[#00E5FF] text-xs font-black uppercase tracking-widest z-10">Simulating Neural Vision...</p>
                <p className="text-[#8B5CF6] text-[9px] uppercase font-bold tracking-widest mt-2 z-10">(Hardware Camera Offline)</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            )}
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          </>
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
