import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Play, Pause, RotateCcw, Zap, Dumbbell, Flame,
  CheckCircle, PlusCircle, Volume2, VolumeX, ChevronRight, Trophy, Heart, Activity, Bot,
  Maximize, Minimize, Watch, Wifi, WifiOff, Map, Navigation, ShieldAlert, Footprints
} from 'lucide-react';
import api from '../../api/axios';
import useStore from '../../store/useStore';
import { getEcho } from '../../lib/echo';

/* ─── Strength Phases ─────────────────────────────────────────── */
const PHASES = [
  { id: 'warmup',  label: 'Warm-Up',   duration: 300,  color: '#FACC15', colorDim: 'rgba(250,204,21,0.15)' },
  { id: 'main',    label: 'Main Set',  duration: 1800, color: '#00E5FF', colorDim: 'rgba(0,229,255,0.15)'  },
  { id: 'cooldown',label: 'Cool-Down', duration: 300,  color: '#A78BFA', colorDim: 'rgba(167,139,250,0.15)' },
];

const EXERCISES_SUGGESTIONS = ['Bench Press', 'Squat', 'Deadlift', 'Pull-Up', 'Push-Up', 'Overhead Press', 'Barbell Row', 'Dip'];

/* ─── Utilities ──────────────────────────────────────────────── */
const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const speak = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.05;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  }
};

export default function LiveWorkoutMode({ onClose }) {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useStore();

  // Mode Selection: 'strength' | 'cardio'
  const [workoutMode, setWorkoutMode] = useState('strength');
  const [cardioSubtype, setCardioSubtype] = useState('run'); // 'run' | 'cycle' | 'walk'

  /* --- Unified Timer & Session State --- */
  const [running, setRunning] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [calories, setCalories] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* --- Strength Specific State --- */
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [sets, setSets] = useState([]);
  const [exercise, setExercise] = useState('Squat');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [motivation, setMotivation] = useState('Log a set to start training');
  const [achievements, setAchievements] = useState([]);

  /* --- Cardio Specific Telemetry State --- */
  const [coords, setCoords] = useState([]);
  const [distance, setDistance] = useState(0); // in km
  const [speed, setSpeed] = useState(0); // in m/s
  const [steps, setSteps] = useState(0);
  const [cadence, setCadence] = useState(0);
  const [activityType, setActivityType] = useState('idle');
  const [heartRate, setHeartRate] = useState(72);
  const [isWatchConnected, setIsWatchConnected] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Refs for tracking and throttled API updates
  const intervalRef = useRef(null);
  const watchIdRef = useRef(null);
  const wakeLockRef = useRef(null);
  const lastStepTimeRef = useRef(0);
  const stepBufferRef = useRef(0);
  
  // Throttle references to avoid API flooding
  const lastGpsPostTime = useRef(0);
  const lastStepsPostTime = useRef(0);
  const lastHrPostTime = useRef(0);
  const lastActivityPostTime = useRef(0);

  const phase = PHASES[phaseIdx];
  const radius = 95;
  const circumf = 2 * Math.PI * radius;
  const dashOffset = circumf - (elapsed / phase.duration) * circumf;

  /* ─── Screen Wake Lock ─── */
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        console.log('[FitTrack] Wake Lock activated.');
      } catch (err) {
        console.warn('[FitTrack] Wake Lock request failed:', err);
      }
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('[FitTrack] Wake Lock released.');
      } catch (err) {
        console.error('[FitTrack] Wake Lock release failed:', err);
      }
    }
  };

  /* ─── Fullscreen Toggle ─── */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.warn(err));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  /* ─── Dynamic Biometrics & Heart Rate Simulation ─── */
  useEffect(() => {
    let int;
    if (running) {
      int = setInterval(() => {
        setHeartRate(prev => {
          let target = 72;
          if (workoutMode === 'strength') {
            target = phaseIdx === 0 ? 110 : (phaseIdx === 1 ? 145 : 95);
          } else {
            // Cardio HR varies with speed and activity
            if (activityType === 'idle') target = 75;
            else if (activityType === 'walking') target = 105;
            else if (activityType === 'running') target = 160;
            else if (activityType === 'cycling') target = 135;
          }
          const delta = Math.floor(Math.random() * 5) - 2;
          const next = prev + (prev < target ? 2 : -1) + delta;
          const finalBpm = Math.max(60, Math.min(190, next));

          // Post HR to backend (throttle: 4 seconds)
          if (sessionId && isWatchConnected && Date.now() - lastHrPostTime.current > 4000) {
            api.post('/heart-rate', { heart_rate: finalBpm }).catch(err => console.warn(err));
            lastHrPostTime.current = Date.now();
          }

          return finalBpm;
        });
      }, 2000);
    } else {
      int = setInterval(() => {
        setHeartRate(prev => {
          if (prev > 75) return prev - Math.floor(Math.random() * 2) - 1;
          return prev;
        });
      }, 2000);
    }
    return () => clearInterval(int);
  }, [running, phaseIdx, workoutMode, activityType, isWatchConnected, sessionId]);

  /* ─── Accelerometer Step Detection (DeviceMotion) ─── */
  useEffect(() => {
    const handleDeviceMotion = (event) => {
      if (!running || workoutMode !== 'cardio') return;

      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const x = acc.x ?? 0;
      const y = acc.y ?? 0;
      const z = acc.z ?? 0;
      const magnitude = Math.sqrt(x * x + y * y + z * z);

      const threshold = 12.8; // Peak threshold for acceleration bounce
      const timeNow = Date.now();

      // Peak spike filter (minimum 330ms between steps)
      if (magnitude > threshold && timeNow - lastStepTimeRef.current > 330) {
        lastStepTimeRef.current = timeNow;
        setSteps(prev => {
          const nextSteps = prev + 1;
          stepBufferRef.current = nextSteps;

          // Throttled steps post to backend (throttle: 5 seconds)
          if (sessionId && timeNow - lastStepsPostTime.current > 5000) {
            api.post('/steps', { steps: nextSteps, cadence: Math.round(60000 / (timeNow - lastStepTimeRef.current)) }).catch(err => console.warn(err));
            lastStepsPostTime.current = timeNow;
          }

          return nextSteps;
        });
      }
    };

    if (running && workoutMode === 'cardio') {
      window.addEventListener('devicemotion', handleDeviceMotion, true);
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion, true);
    };
  }, [running, workoutMode, sessionId]);

  /* ─── Geolocation Tracking ─── */
  const startGpsWatch = () => {
    if (!navigator.geolocation) {
      setErrorMsg('GPS Geolocation is not supported by your phone browser.');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed: gpsSpeed, accuracy } = position.coords;
        const currentSpeed = gpsSpeed !== null && gpsSpeed >= 0 ? gpsSpeed : 0;
        setSpeed(currentSpeed);

        const newPoint = { lat: latitude, lng: longitude, speed: currentSpeed, timestamp: Date.now() };

        setCoords(prev => {
          const updated = [...prev, newPoint];

          // Calculate distance using Haversine formula
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            // Haversine km
            const toRad = (v) => (v * Math.PI) / 180;
            const R = 6371;
            const dLat = toRad(latitude - last.lat);
            const dLng = toRad(longitude - last.lng);
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(last.lat)) *
                Math.cos(toRad(latitude)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const deltaKm = R * c;

            // Prevent GPS jitter from counting movement when static
            if (deltaKm > 0.002) {
              setDistance(dPrev => {
                const totalDist = dPrev + deltaKm;
                
                // Throttled GPS coordinates post to API (throttle: 4 seconds)
                if (sessionId && Date.now() - lastGpsPostTime.current > 4000) {
                  api.post('/gps', {
                    latitude,
                    longitude,
                    speed: currentSpeed,
                    accuracy: accuracy ?? 0,
                    distance: totalDist
                  }).catch(err => console.warn(err));
                  lastGpsPostTime.current = Date.now();
                }

                return totalDist;
              });
            }
          }
          return updated;
        });

        // Live Activity Classification
        let detectedActivity = 'idle';
        if (currentSpeed > 6.0) {
          detectedActivity = 'cycling';
        } else if (currentSpeed > 2.2) {
          detectedActivity = 'running';
        } else if (currentSpeed > 0.3) {
          detectedActivity = 'walking';
        } else {
          // Fallback to device steps motion check
          detectedActivity = Date.now() - lastStepTimeRef.current < 2000 ? 'walking' : 'idle';
        }

        setActivityType(prevType => {
          if (prevType !== detectedActivity) {
            // Post activity change to backend
            if (sessionId) {
              api.post('/activity', { activity_type: detectedActivity }).catch(err => console.warn(err));
            }
            if (voiceOn) {
              speak(`Activity detected: ${detectedActivity}`);
            }
            return detectedActivity;
          }
          return prevType;
        });
      },
      (err) => {
        console.error('[FitTrack] Geolocation watch error:', err);
        setErrorMsg('GPS Signal Weak or permission denied.');
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 0,
      }
    );
  };

  const stopGpsWatch = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  /* ─── Dynamic WebSocket Synchronization ─── */
  useEffect(() => {
    const echo = getEcho();
    if (echo && user && sessionId && sessionId !== 'demo') {
      echo.private(`user.${user.id}`)
        .listen('.App\\Events\\WorkoutTelemetryUpdated', (e) => {
          console.log('[FitTrack WS] Telemetry synced:', e);
          if (e.session && e.session.id === parseInt(sessionId)) {
            // Only sync values if we are not the active input device to prevent loops
            setDistance(e.session.distance);
            setSteps(e.session.steps);
            setCadence(e.session.cadence);
            setActivityType(e.session.activity_type);
            setHeartRate(e.session.heart_rate);
            setTotalElapsed(e.session.duration);
            setCalories(e.session.calories);
            if (e.session.gps_path && Array.isArray(e.session.gps_path)) {
              setCoords(e.session.gps_path);
            }
          }
        });
      return () => {
        echo.leave(`user.${user.id}`);
      };
    }
  }, [sessionId, user]);

  /* ─── Workout Control Triggers ─── */
  const handleStart = async () => {
    setRunning(true);
    await requestWakeLock();

    if (workoutMode === 'cardio') {
      startGpsWatch();
      if (sessionId) {
        api.post('/workout', { action: 'start', workout_type: cardioSubtype }).catch(err => console.warn(err));
      }
      if (voiceOn) speak(`Starting live ${cardioSubtype} tracking session.`);
    } else {
      if (voiceOn) speak(phaseIdx === 0 ? "Warm-up starting. Let's go!" : "Resuming strength session.");
    }
  };

  const handlePause = async () => {
    setRunning(false);
    await releaseWakeLock();

    if (workoutMode === 'cardio') {
      stopGpsWatch();
      if (sessionId) {
        api.post('/workout', { action: 'pause' }).catch(err => console.warn(err));
      }
    }
    if (voiceOn) speak("Workout paused.");
  };

  const handleResume = async () => {
    setRunning(true);
    await requestWakeLock();

    if (workoutMode === 'cardio') {
      startGpsWatch();
      if (sessionId) {
        api.post('/workout', { action: 'resume' }).catch(err => console.warn(err));
      }
    }
    if (voiceOn) speak("Workout resumed.");
  };

  /* ─── Save and Close Workout Session ─── */
  const handleSave = async () => {
    setSaving(true);
    stopGpsWatch();
    await releaseWakeLock();

    try {
      if (sessionId && sessionId !== 'demo') {
        // Post stop action to backend
        await api.post('/workout', {
          action: 'stop',
          duration: totalElapsed,
          calories: Math.round(calories),
        });
      } else {
        // Demo mode fallback
        const sessionTitle = workoutMode === 'cardio' ? `${ucfirst(cardioSubtype)} Session` : 'Strength Session';
        await api.post('/workouts', {
          name: sessionTitle,
          calories_burned: Math.round(calories),
          duration: Math.round(totalElapsed / 60),
          started_at: new Date(Date.now() - totalElapsed * 1000).toISOString(),
          ended_at: new Date().toISOString(),
          notes: workoutMode === 'cardio' 
            ? `Live cardio session. Distance: ${distance.toFixed(2)} km, Steps: ${steps}, Avg BPM: ${heartRate}` 
            : `Live Workout Session — ${sets.map(s => `${s.exercise} ${s.weight}kg×${s.reps}`).join(', ')}`,
        });
      }

      setSaved(true);
      if (voiceOn) speak('Workout saved successfully. Outstanding performance!');
      setTimeout(() => {
        if (onClose) onClose();
        else navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Failed to save session:', err);
      setErrorMsg('Failed to save workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const ucfirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  /* ─── Timer Interval Tick ─── */
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTotalElapsed(t => t + 1);

        if (workoutMode === 'strength') {
          setElapsed(prev => {
            if (prev + 1 >= phase.duration) {
              if (phaseIdx < PHASES.length - 1) {
                setPhaseIdx(p => p + 1);
                return 0;
              } else {
                setRunning(false);
                return prev;
              }
            }
            return prev + 1;
          });
          setCalories(c => c + 0.15); // strength burn estimate
        } else {
          // Cardio burns dynamically with speed
          setCalories(() => {
            // Base calories + speed multiplier
            const hourlyKcal = activityType === 'running' ? 700 : (activityType === 'cycling' ? 450 : (activityType === 'walking' ? 250 : 80));
            const perSecondKcal = hourlyKcal / 3600;
            return calories + perSecondKcal;
          });
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, phaseIdx, workoutMode, activityType, calories]);

  /* ─── Cardio SVG Route Map Projection ─── */
  const getSvgPath = () => {
    if (coords.length < 2) return '';
    const lats = coords.map(c => c.lat);
    const lngs = coords.map(c => c.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = maxLat - minLat || 0.0001;
    const lngRange = maxLng - minLng || 0.0001;

    const points = coords.map(c => {
      const x = 10 + ((c.lng - minLng) / lngRange) * 80;
      const y = 90 - ((c.lat - minLat) / latRange) * 80;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const svgPath = getSvgPath();
  const lastCoord = coords[coords.length - 1];

  const getPulsePosition = () => {
    if (coords.length < 2) return { x: 50, y: 50 };
    const lats = coords.map(c => c.lat);
    const lngs = coords.map(c => c.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = maxLat - minLat || 0.0001;
    const lngRange = maxLng - minLng || 0.0001;

    const x = 10 + ((lastCoord.lng - minLng) / lngRange) * 80;
    const y = 90 - ((lastCoord.lat - minLat) / latRange) * 80;
    return { x, y };
  };

  const pulsePos = getPulsePosition();

  // Floating Achievements Stack
  const triggerAchievement = (title, subtitle, icon) => {
    const id = Date.now();
    setAchievements(prev => [...prev, { id, title, subtitle, icon }]);
    setTimeout(() => {
      setAchievements(prev => prev.filter(a => a.id !== id));
    }, 4000);
  };

  /* ─── Strength Logger Set logic ─── */
  const addSet = useCallback(async () => {
    if (!weight || !reps) return;
    const w = parseFloat(weight);
    const r = parseInt(reps);

    if (sessionId && sessionId !== 'demo') {
      try {
        const response = await api.post(`/workout-session/${sessionId}/log-set`, {
          exercise,
          weight: w,
          reps: r,
          duration: totalElapsed
        });
        if (response.data?.session?.calories) {
          setCalories(response.data.session.calories);
        }
      } catch (err) {
        console.error(err);
      }
    }

    const newSet = { exercise, weight: w, reps: r, time: fmtTime(totalElapsed) };
    setSets(prev => {
      const next = [...prev, newSet];
      if (next.length === 3) triggerAchievement("⚡ 3 Sets Completed", "Consistency is key!", "⚡");
      else if (next.length === 5) triggerAchievement("🏆 Elite Endurance", "Overload achieved!", "🏆");
      if (voiceOn) speak(`Set logged. ${r} reps at ${w} kilograms.`);
      return next;
    });

    setWeight('');
    setReps('');
  }, [weight, reps, exercise, totalElapsed, voiceOn, sessionId]);

  // Clean Watch on Unmount
  useEffect(() => {
    return () => {
      stopGpsWatch();
      releaseWakeLock();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl relative overflow-hidden"
    >
      <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
        className="w-full max-w-5xl bg-[#060B16]/95 rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(34,211,238,0.15)] overflow-hidden flex flex-col max-h-[92vh] relative z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full animate-ping bg-[#00E5FF]" />
            <span className="text-xs font-black text-white uppercase tracking-widest">FitTrack Active Session</span>
            
            {/* Workout Mode Split Selectors */}
            <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/5">
              <button
                disabled={running}
                onClick={() => setWorkoutMode('strength')}
                className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-wider transition-colors ${
                  workoutMode === 'strength' ? 'bg-[#00E5FF] text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Strength
              </button>
              <button
                disabled={running}
                onClick={() => setWorkoutMode('cardio')}
                className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-wider transition-colors ${
                  workoutMode === 'cardio' ? 'bg-[#00E5FF] text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Cardio
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setVoiceOn(v => !v)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/60">
              {voiceOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/60">
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
            <button onClick={() => { stopGpsWatch(); releaseWakeLock(); if (onClose) onClose(); else navigate('/'); }}
              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors text-white/60">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Telemetry Layout Splits */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-auto">

          {/* LEFT: Common Timer Controls & Biometrics */}
          <div className="lg:w-[350px] shrink-0 flex flex-col items-center p-6 gap-5 border-r border-white/5 bg-white/[0.01]">
            
            {workoutMode === 'cardio' ? (
              /* Cardio Mode Type Selector */
              <div className="grid grid-cols-3 gap-2 w-full">
                {['run', 'cycle', 'walk'].map(type => (
                  <button
                    key={type}
                    disabled={running}
                    onClick={() => setCardioSubtype(type)}
                    className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors border ${
                      cardioSubtype === type 
                        ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/40' 
                        : 'bg-white/5 text-white/40 border-transparent hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            ) : (
              /* Strength Mode Phases */
              <div className="flex gap-2 w-full">
                {PHASES.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => { if (!running) { setPhaseIdx(i); setElapsed(0); } }}
                    className="flex-1 py-1 text-[8px] font-black uppercase tracking-wider rounded border transition-colors"
                    style={{
                      background: i === phaseIdx ? p.colorDim : 'rgba(255,255,255,0.03)',
                      color: i === phaseIdx ? p.color : 'rgba(255,255,255,0.3)',
                      borderColor: i === phaseIdx ? p.color + '40' : 'transparent',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {/* Circular / Large Digital Progress Timer */}
            {workoutMode === 'strength' ? (
              <div className="relative flex items-center justify-center">
                <svg width="220" height="220" className="-rotate-90">
                  <circle cx="110" cy="110" r="85" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle
                    cx="110" cy="110" r="85"
                    fill="none"
                    stroke={phase.color}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 85}
                    strokeDashoffset={(2 * Math.PI * 85) - (elapsed / phase.duration) * (2 * Math.PI * 85)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s ease', filter: `drop-shadow(0 0 10px ${phase.color})` }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-white font-mono">{fmtTime(phase.duration - elapsed)}</span>
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Remaining</span>
                </div>
              </div>
            ) : (
              <div className="w-full rounded-2xl bg-black/40 border border-white/5 p-5 flex flex-col items-center relative overflow-hidden shadow-inner">
                <span className="text-[9px] text-[#00E5FF] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Workout Active
                </span>
                <span className="text-5xl font-black text-white font-mono tracking-tighter">
                  {fmtTime(totalElapsed)}
                </span>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Elapsed Time</span>
              </div>
            )}

            {/* Telemetry Error Message */}
            {errorMsg && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold rounded-xl flex items-center gap-1 w-full">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Play/Pause control triggers */}
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => {
                  if (confirm('Reset session? Current logs will be deleted.')) {
                    setTotalElapsed(0);
                    setElapsed(0);
                    setCalories(0);
                    setSets([]);
                    setDistance(0);
                    setSteps(0);
                    setCoords([]);
                    setRunning(false);
                    stopGpsWatch();
                  }
                }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={running ? handlePause : handleStart}
                className="w-16 h-16 rounded-full flex items-center justify-center font-black text-black shadow-2xl transition-transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #00E5FF, #3B82F6)',
                  boxShadow: '0 0 25px rgba(0, 229, 255, 0.4)'
                }}
              >
                {running ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-0.5" />}
              </button>
            </div>

            {/* Smartwatch Simulator integration */}
            <div className={`w-full rounded-2xl border transition-all duration-300 p-4 ${
              isWatchConnected ? 'border-[#EC4899]/20 bg-[#EC4899]/5' : 'border-white/5 bg-[#0F172A]/40'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Watch className={`w-4 h-4 ${isWatchConnected ? 'text-[#EC4899]' : 'text-white/30'}`} />
                  <span className="text-[9px] uppercase font-bold text-white tracking-wider">Wearable Link</span>
                </div>
                <button
                  onClick={() => setIsWatchConnected(prev => !prev)}
                  className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border transition-colors ${
                    isWatchConnected 
                      ? 'border-[#EC4899]/30 text-[#EC4899] bg-[#EC4899]/10' 
                      : 'border-white/10 text-white/30 hover:text-white hover:border-white/20'
                  }`}
                >
                  {isWatchConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>

              {isWatchConnected ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" style={{ animationDuration: heartRate > 120 ? '0.5s' : '0.9s' }} />
                    <span className="text-sm font-black text-white">{heartRate} <span className="text-[9px] font-normal text-white/40">BPM</span></span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-bold text-white/40 block">Latent Sync</span>
                    <span className="text-[9px] font-bold text-green-400">12ms Active</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-1">
                  <span className="text-[9px] text-white/30">Wearable biometrics not synced.</span>
                </div>
              )}
            </div>

            {/* Cardio specific summary stats (kcal, steps, km) */}
            <div className="grid grid-cols-3 w-full gap-2">
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-base font-black text-white">{Math.round(calories)}</span>
                <span className="text-[8px] uppercase font-black text-white/30 mt-0.5">kcal</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5">
                <Footprints className="w-4 h-4 text-cyan-400" />
                <span className="text-base font-black text-white">{steps}</span>
                <span className="text-[8px] uppercase font-black text-white/30 mt-0.5">Steps</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5">
                <Navigation className="w-4 h-4 text-green-400 rotate-45" />
                <span className="text-base font-black text-white">{distance.toFixed(2)}</span>
                <span className="text-[8px] uppercase font-black text-white/30 mt-0.5">km</span>
              </div>
            </div>

          </div>

          {/* RIGHT: Dynamic splits based on workout mode selection */}
          <div className="flex-1 flex flex-col p-6 gap-5 overflow-auto">

            {workoutMode === 'cardio' ? (
              /* CARDIO SESSION TRACKER VIEW */
              <div className="flex-1 flex flex-col gap-5 overflow-auto">
                {/* 1. Large Telemetry Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[8px] uppercase font-bold text-white/40 tracking-wider">Pace</span>
                    <span className="text-base font-black text-white mt-1">
                      {distance > 0 ? fmtTime(Math.round(totalElapsed / distance)) + '/km' : '00:00/km'}
                    </span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[8px] uppercase font-bold text-white/40 tracking-wider">Live Speed</span>
                    <span className="text-base font-black text-[#00E5FF] mt-1">
                      {(speed * 3.6).toFixed(1)} <span className="text-[9px] font-normal text-white/40">km/h</span>
                    </span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[8px] uppercase font-bold text-white/40 tracking-wider">Detected Activity</span>
                    <span className="text-base font-black text-green-400 mt-1 capitalize">{activityType}</span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between">
                    <span className="text-[8px] uppercase font-bold text-white/40 tracking-wider">Cadence</span>
                    <span className="text-base font-black text-white mt-1">{cadence} <span className="text-[9px] font-normal text-white/40">spm</span></span>
                  </div>
                </div>

                {/* 2. Interactive GPS route map */}
                <div className="flex-1 rounded-3xl bg-[#090D1A] border border-white/10 overflow-hidden relative min-h-[220px]">
                  <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none" />
                  
                  {/* SVG Polyline drawer */}
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center p-4">
                    {coords.length >= 2 ? (
                      <svg viewBox="0 0 100 100" className="w-full h-full opacity-90">
                        <path
                          d={svgPath}
                          fill="none"
                          stroke="#00F5FF"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="drop-shadow-[0_0_5px_#00F5FF]"
                        />
                        {/* Start point */}
                        <circle cx={svgPath.split(' ')[1].split(',')[0]} cy={svgPath.split(' ')[1].split(',')[1]} r="2" fill="#EC4899" />
                        {/* Pulse point */}
                        <circle cx={pulsePos.x} cy={pulsePos.y} r="3" fill="#00F5FF" className="animate-pulse" />
                        <circle cx={pulsePos.x} cy={pulsePos.y} r="7" fill="none" stroke="#00F5FF" strokeWidth="1" className="animate-ping opacity-60" />
                      </svg>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-center text-white/20 p-6 z-10">
                        <Map className={`w-8 h-8 ${running ? 'text-[#00E5FF] animate-pulse' : ''}`} />
                        <span className="text-[10px] text-white/40 max-w-[200px]">
                          {running ? 'Locking GPS telemetry coordinates... Move around to update map trail.' : 'Start run or cycle to stream coordinates.'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Coordinates floating indicator */}
                  {lastCoord && (
                    <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/60 border border-white/5 rounded-lg backdrop-blur-md text-[8px] font-mono text-white/50">
                      GPS: {lastCoord.lat.toFixed(5)}, {lastCoord.lng.toFixed(5)}
                    </div>
                  )}

                  {/* Dynamic activity indicator */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 border border-white/5 rounded-lg backdrop-blur-md">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[9px] font-bold text-white capitalize">{cardioSubtype} session</span>
                  </div>
                </div>
              </div>
            ) : (
              /* STRENGTH SESSION SET LOGGER VIEW */
              <div className="flex-1 flex flex-col gap-5 overflow-auto">
                
                {/* AI Motivation banner */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10">
                      <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-ping" />
                      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-75 blur-sm" style={{ animation: 'spin 6s linear infinite' }} />
                      <div className="relative w-7 h-7 rounded-full bg-[#060B16] border border-cyan-400 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-cyan-400 tracking-widest">AI Trainer Insights</span>
                      <span className="text-xs font-bold text-white tracking-wide">{motivation}</span>
                    </div>
                  </div>
                </div>

                {/* Exercise selection */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-white/40 mb-2 block">Choose Exercise</label>
                  <div className="flex flex-wrap gap-1.5">
                    {EXERCISES_SUGGESTIONS.map(ex => (
                      <button
                        key={ex}
                        onClick={() => setExercise(ex)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                          exercise === ex 
                            ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30' 
                            : 'bg-white/5 text-white/40 border-transparent hover:text-white'
                        }`}
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weight + Reps inputs */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-white/40 mb-2 block">Weight (kg)</label>
                    <input
                      type="number" value={weight} onChange={e => setWeight(e.target.value)}
                      placeholder="80"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xs font-bold focus:outline-none focus:border-[#00E5FF]/40 transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-white/40 mb-2 block">Reps</label>
                    <input
                      type="number" value={reps} onChange={e => setReps(e.target.value)}
                      placeholder="10"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xs font-bold focus:outline-none focus:border-[#00E5FF]/40 transition-colors"
                    />
                  </div>
                  <button
                    onClick={addSet}
                    className="px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-black flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform"
                    style={{ background: 'linear-gradient(135deg,#00E5FF,#00B3CC)', boxShadow: '0 0 15px rgba(0,229,255,0.3)' }}
                  >
                    <PlusCircle className="w-4 h-4" /> Log Set
                  </button>
                </div>

                {/* Recorded Sets list */}
                <div className="flex-1 space-y-2 overflow-auto">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[9px] font-black uppercase tracking-wider text-white/40">Sets Log</h3>
                    <span className="text-[9px] font-bold text-white/30">{sets.length} sets logged</span>
                  </div>

                  {sets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-28 rounded-2xl border border-dashed border-white/10 text-white/20">
                      <Dumbbell className="w-6 h-6 mb-1.5 animate-bounce" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Log a set to register weight load</span>
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {[...sets].reverse().map((s, i) => (
                        <motion.div
                          key={sets.length - 1 - i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-[#00E5FF]/20 transition-colors"
                        >
                          <div className="w-6 h-6 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[9px] font-black text-[#00E5FF]">
                            {sets.length - i}
                          </div>
                          <div className="flex-1">
                            <span className="text-xs font-black text-white">{s.exercise}</span>
                            <span className="text-[9px] text-white/40 ml-2">{s.time}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-white">{s.weight}kg × {s.reps}</span>
                            <div className="text-[9px] text-white/30">{(s.weight * s.reps).toFixed(0)} kg</div>
                          </div>
                          <CheckCircle className="w-3.5 h-3.5 text-[#00E5FF]/60 shrink-0" />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>

              </div>
            )}

            {/* Bottom session end trigger */}
            {!saved && (workoutMode === 'cardio' || sets.length > 0) && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest text-black flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-60 shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #00E5FF)',
                  boxShadow: '0 0 25px rgba(124, 58, 237, 0.3)'
                }}
              >
                <Trophy className="w-4 h-4" />
                {saving ? 'Finalizing Workout Session...' : 'Finish & Save Workout'}
              </motion.button>
            )}

            {saved && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] font-black uppercase tracking-widest text-xs shrink-0"
              >
                <CheckCircle className="w-4 h-4" />
                Workout Sync Complete! Stored in database history.
              </motion.div>
            )}

          </div>

        </div>
      </motion.div>

      {/* Floating Achievements Popup Stack */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-[110]">
        <AnimatePresence>
          {achievements.map((ach) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-cyan-950 border border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] text-white"
            >
              <span className="text-xl">{ach.icon}</span>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400">{ach.title}</span>
                <span className="text-[10px] text-white/60">{ach.subtitle}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
