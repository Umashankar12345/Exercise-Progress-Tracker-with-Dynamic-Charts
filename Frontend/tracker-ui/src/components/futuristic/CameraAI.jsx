import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { Camera, RefreshCw, Activity, AlertOctagon, Zap } from 'lucide-react';

/* ─── Skeleton connections (MoveNet keypoint pairs) ─── */
const SKELETON_PAIRS = [
  ['left_shoulder',  'right_shoulder'],
  ['left_shoulder',  'left_elbow'],
  ['left_elbow',     'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow',    'right_wrist'],
  ['left_shoulder',  'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip',       'right_hip'],
  ['left_hip',       'left_knee'],
  ['left_knee',      'left_ankle'],
  ['right_hip',      'right_knee'],
  ['right_knee',     'right_ankle'],
];

const KEYPOINT_COLORS = {
  nose:             '#00E5FF',
  left_eye:         '#A78BFA',
  right_eye:        '#A78BFA',
  left_ear:         '#A78BFA',
  right_ear:        '#A78BFA',
  left_shoulder:    '#00E5FF',
  right_shoulder:   '#00E5FF',
  left_elbow:       '#FACC15',
  right_elbow:      '#FACC15',
  left_wrist:       '#F97316',
  right_wrist:      '#F97316',
  left_hip:         '#00E5FF',
  right_hip:        '#00E5FF',
  left_knee:        '#FACC15',
  right_knee:       '#FACC15',
  left_ankle:       '#F97316',
  right_ankle:      '#F97316',
};

/* ─── Angle helper ─── */
const getAngle = (A, B, C) => {
  const radians = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
  let angle = Math.abs(radians * (180 / Math.PI));
  if (angle > 180) angle = 360 - angle;
  return angle;
};

/* ─── Draw helpers ─── */
const drawNeonSkeleton = (ctx, keypoints) => {
  const kpMap = {};
  keypoints.forEach(kp => { if (kp.score > 0.3) kpMap[kp.name] = kp; });

  // Draw bones
  ctx.lineWidth = 3;
  SKELETON_PAIRS.forEach(([a, b]) => {
    if (kpMap[a] && kpMap[b]) {
      const grad = ctx.createLinearGradient(kpMap[a].x, kpMap[a].y, kpMap[b].x, kpMap[b].y);
      grad.addColorStop(0, '#00E5FF');
      grad.addColorStop(1, '#7C3AED');
      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur = 12;
      ctx.moveTo(kpMap[a].x, kpMap[a].y);
      ctx.lineTo(kpMap[b].x, kpMap[b].y);
      ctx.stroke();
    }
  });

  // Draw joints
  keypoints.forEach(kp => {
    if (kp.score > 0.3) {
      const color = KEYPOINT_COLORS[kp.name] || '#00E5FF';
      ctx.beginPath();
      ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 16;
      ctx.fill();
      // White center dot
      ctx.beginPath();
      ctx.arc(kp.x, kp.y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 0;
      ctx.fill();
    }
  });
};

export default function CameraAI({ onRepComplete }) {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const detectorRef = useRef(null);
  const animRef    = useRef(null);
  const isDownRef  = useRef(false);

  const [isModelLoading, setIsModelLoading] = useState(true);
  const [repCount,   setRepCount]   = useState(0);
  const [formFeedback, setFormFeedback] = useState('Align your body within the frame');
  const [feedbackColor, setFeedbackColor] = useState('#FACC15');
  const [mode,       setMode]       = useState('squat'); // 'squat' | 'pushup'
  const [warning,    setWarning]    = useState('');
  const [confidence, setConfidence] = useState(0);

  /* ── Squat analysis ── */
  const analyzeSquat = useCallback((keypoints) => {
    const kp = {};
    keypoints.forEach(k => { if (k.score > 0.3) kp[k.name] = k; });

    if (kp.left_hip && kp.left_knee && kp.left_ankle) {
      const angle = getAngle(kp.left_hip, kp.left_knee, kp.left_ankle);
      setConfidence(Math.round((kp.left_knee.score || 0) * 100));

      if (angle < 100) {
        // Bottom position
        if (!isDownRef.current) {
          isDownRef.current = true;
          if (angle < 70) {
            setFormFeedback('Perfect depth! Drive up!');
            setFeedbackColor('#00E5FF');
            setWarning('');
          } else {
            setFormFeedback('Good — go a bit deeper!');
            setFeedbackColor('#FACC15');
          }
        }
        // Check knee caving (valgus)
        if (kp.left_knee && kp.left_hip && kp.left_ankle) {
          const kneeX = kp.left_knee.x;
          const hipX  = kp.left_hip.x;
          if (Math.abs(kneeX - hipX) < 20) {
            setWarning('⚠️ Knees caving inward!');
          } else {
            setWarning('');
          }
        }
      } else if (angle > 160) {
        // Top position
        if (isDownRef.current) {
          isDownRef.current = false;
          setRepCount(prev => {
            const n = prev + 1;
            if (onRepComplete) onRepComplete(n);
            return n;
          });
          setFormFeedback('Rep Complete! 🔥');
          setFeedbackColor('#00E5FF');
        } else {
          setFormFeedback('Squat down to start');
          setFeedbackColor('rgba(255,255,255,0.5)');
        }
      }
    } else {
      setFormFeedback('Position lower body in frame');
      setFeedbackColor('rgba(255,255,255,0.4)');
    }
  }, [onRepComplete]);

  /* ── Pushup analysis ── */
  const analyzePushup = useCallback((keypoints) => {
    const kp = {};
    keypoints.forEach(k => { if (k.score > 0.3) kp[k.name] = k; });

    if (kp.left_shoulder && kp.left_elbow && kp.left_wrist) {
      const angle = getAngle(kp.left_shoulder, kp.left_elbow, kp.left_wrist);
      setConfidence(Math.round((kp.left_elbow.score || 0) * 100));

      if (angle < 90) {
        if (!isDownRef.current) {
          isDownRef.current = true;
          setFormFeedback('Full depth! Push up!');
          setFeedbackColor('#00E5FF');
          setWarning('');
        }
        // Check elbow flare
        if (kp.left_shoulder && kp.left_elbow) {
          const flare = Math.abs(kp.left_elbow.x - kp.left_shoulder.x);
          if (flare > 80) {
            setWarning('⚠️ Tuck elbows closer!');
          } else {
            setWarning('');
          }
        }
      } else if (angle > 155) {
        if (isDownRef.current) {
          isDownRef.current = false;
          setRepCount(prev => {
            const n = prev + 1;
            if (onRepComplete) onRepComplete(n);
            return n;
          });
          setFormFeedback('Rep! Stay tight 💪');
          setFeedbackColor('#00E5FF');
        } else {
          setFormFeedback('Lower your body to start');
          setFeedbackColor('rgba(255,255,255,0.5)');
        }
      }
    } else {
      setFormFeedback('Position upper body in frame');
      setFeedbackColor('rgba(255,255,255,0.4)');
    }
  }, [onRepComplete]);

  useEffect(() => {
    const setupCamera = async () => {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => {
            console.warn("Video playback was interrupted or blocked:", e);
          });
        }
      }
    };

    const loadModel = async () => {
      await tf.ready();
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
      );
      detectorRef.current = detector;
      setIsModelLoading(false);
      detectLoop();
    };

    const detectLoop = async () => {
      if (videoRef.current?.readyState === 4 && detectorRef.current) {
        const poses = await detectorRef.current.estimatePoses(videoRef.current);
        if (poses.length > 0) {
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, 640, 480);
            drawNeonSkeleton(ctx, poses[0].keypoints);
          }
          if (mode === 'squat') analyzeSquat(poses[0].keypoints);
          else                  analyzePushup(poses[0].keypoints);
        }
      }
      animRef.current = requestAnimationFrame(detectLoop);
    };

    setupCamera().then(() => loadModel());

    return () => {
      cancelAnimationFrame(animRef.current);
      videoRef.current?.srcObject?.getTracks().forEach(t => t.stop());
    };
  }, [mode, analyzeSquat, analyzePushup]);

  // Reset count when mode changes
  const switchMode = (m) => {
    setMode(m);
    setRepCount(0);
    isDownRef.current = false;
    setFormFeedback('Align your body within the frame');
    setFeedbackColor('#FACC15');
    setWarning('');
  };

  return (
    <div className="w-full h-full rounded-2xl border border-[#22D3EE]/30 bg-[#0F172A] p-4 relative overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.1)]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-[#22D3EE]" />
          <span className="text-sm uppercase font-black text-white tracking-widest">AR Body Engine</span>
          {!isModelLoading && (
            <div className="flex items-center gap-1 text-[9px] text-[#00E5FF] font-bold uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              Live
            </div>
          )}
        </div>
        {isModelLoading ? (
          <div className="flex items-center gap-2 text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">
            <RefreshCw className="w-3 h-3 animate-spin text-[#22D3EE]" /> Loading Models...
          </div>
        ) : (
          <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
            Confidence: <span className="text-[#00E5FF]">{confidence}%</span>
          </div>
        )}
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'squat',  label: '🦵 Squats' },
          { id: 'pushup', label: '💪 Push-Ups' },
        ].map(m => (
          <button key={m.id}
            onClick={() => switchMode(m.id)}
            className="flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            style={{
              background: mode === m.id ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.04)',
              color: mode === m.id ? '#00E5FF' : 'rgba(255,255,255,0.4)',
              border: `1px solid ${mode === m.id ? 'rgba(0,229,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
              boxShadow: mode === m.id ? '0 0 16px rgba(0,229,255,0.2)' : 'none',
            }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Video + Canvas */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-[#22D3EE]/20 bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          width="640" height="480"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        
        {/* Rep Counter Overlay */}
        <div className="absolute top-4 right-4 flex flex-col items-center gap-0.5 bg-black/60 p-3 rounded-xl border border-[#22D3EE]/30 backdrop-blur-md">
          <span className="text-5xl font-black text-[#22D3EE] drop-shadow-[0_0_15px_#22D3EE] leading-none">{repCount}</span>
          <span className="text-[9px] uppercase font-bold tracking-widest text-white/50 mt-1">{mode === 'squat' ? 'Squats' : 'Push-Ups'}</span>
        </div>

        {/* Form Warning */}
        {warning && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/40 rounded-xl backdrop-blur-md">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span className="text-xs font-black text-red-400 uppercase tracking-wider">{warning}</span>
          </div>
        )}

        {/* Feedback Bar */}
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 border border-white/10 rounded-xl backdrop-blur-md flex items-center gap-3">
          <Zap className="w-4 h-4 shrink-0" style={{ color: feedbackColor }} />
          <span className="text-xs uppercase font-black tracking-widest" style={{ color: feedbackColor }}>{formFeedback}</span>
        </div>

        {/* Model loading overlay */}
        {isModelLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm">
            <RefreshCw className="w-10 h-10 text-[#22D3EE] animate-spin" />
            <span className="text-sm font-black text-white uppercase tracking-widest">Initializing AI Body Engine...</span>
            <span className="text-xs text-white/40">MoveNet SINGLEPOSE_LIGHTNING</span>
          </div>
        )}
      </div>
    </div>
  );
}
