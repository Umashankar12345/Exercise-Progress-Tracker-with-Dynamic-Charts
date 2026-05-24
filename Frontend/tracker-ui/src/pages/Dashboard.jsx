import React, { useState, useEffect, useRef } from 'react';
import HeroSection from '../components/dashboard/HeroSection';
import LiveWorkoutTrackerPanel from '../components/dashboard/LiveWorkoutTrackerPanel';
import DashboardLiveGpsMap from '../components/dashboard/DashboardLiveGpsMap';
import CaloriesBurnedChart from '../components/dashboard/CaloriesBurnedChart';
import HydrationRing from '../components/dashboard/HydrationRing';
import WeightPredictionChart from '../components/dashboard/WeightPredictionChart';
import SleepRecoveryChart from '../components/dashboard/SleepRecoveryChart';
import MuscleRadarChart from '../components/dashboard/MuscleRadarChart';
import SmartwatchSync from '../components/futuristic/SmartwatchSync';
import api from '../api/axios';
import useStore from '../store/useStore';
import { getEcho } from '../lib/echo';

export default function Dashboard() {
  const { user } = useStore();
  const [insights, setInsights] = useState([]);
  
  // Active Workout Session State
  const [activeSession, setActiveSession] = useState(null);

  // References for GPS, steps, and wake locks
  const watchIdRef = useRef(null);
  const wakeLockRef = useRef(null);
  const timerRef = useRef(null);
  const lastStepTimeRef = useRef(0);
  const baselineRef = useRef(9.8); // To dynamically filter gravity

  // Throttled API timers
  const lastGpsPost = useRef(0);
  const lastStepsPost = useRef(0);
  const lastHrPost = useRef(0);
  const lastActivityPost = useRef(0);

  // Haversine km calculator
  const getDistanceKm = (c1, c2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(c2.lat - c1.lat);
    const dLng = toRad(c2.lng - c1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(c1.lat)) *
        Math.cos(toRad(c2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Wake Lock handler
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      } catch (err) {
        console.warn('[FitTrack] Wake lock request failed:', err);
      }
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Start Geolocation watchPosition
  const startGpsTracking = (sessionId) => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed: gpsSpeed, accuracy } = position.coords;
        const speedMs = gpsSpeed !== null && gpsSpeed >= 0 ? gpsSpeed : 0;

        setActiveSession((prev) => {
          if (!prev) return null;
          const updatedCoords = [...prev.coords, { lat: latitude, lng: longitude, timestamp: Date.now() }];
          
          let deltaKm = 0;
          if (prev.coords.length > 0) {
            const last = prev.coords[prev.coords.length - 1];
            deltaKm = getDistanceKm(last, { lat: latitude, lng: longitude });
          }

          // Filter GPS jitter: count small movements if accuracy is high
          const isAccurate = !accuracy || accuracy < 30;
          const minDelta = isAccurate ? 0.0005 : 0.0015; // 0.5 meters vs 1.5 meters threshold
          const newDistance = deltaKm > minDelta ? prev.distance + deltaKm : prev.distance;

          // Throttled GPS Post (throttle: 4 seconds)
          if (sessionId && Date.now() - lastGpsPost.current > 4000) {
            api.post('/gps', {
              latitude,
              longitude,
              speed: speedMs,
              accuracy: accuracy ?? 0,
              distance: newDistance
            }).catch(err => console.warn(err));
            lastGpsPost.current = Date.now();
          }

          // Live Activity detection
          let detected = 'idle';
          if (speedMs > 6.0) detected = 'cycling';
          else if (speedMs > 2.2) detected = 'running';
          else if (speedMs > 0.3) detected = 'walking';
          else detected = Date.now() - lastStepTimeRef.current < 2000 ? 'walking' : 'idle';

          if (detected !== prev.activityType) {
            api.post('/activity', { activity_type: detected }).catch(err => console.warn(err));
          }

          // Direct DOM update for GPS debug values
          const gpsEl = document.getElementById('debug-gps');
          if (gpsEl) {
            gpsEl.innerText = `Lat: ${latitude.toFixed(6)} | Lng: ${longitude.toFixed(6)} | Acc: ${accuracy?.toFixed(1) ?? 'N/A'}m`;
          }

          return {
            ...prev,
            coords: updatedCoords,
            distance: newDistance,
            speed: speedMs,
            activityType: detected
          };
        });
      },
      (err) => {
        console.warn('[FitTrack] Geolocation watch error:', err);
        const gpsEl = document.getElementById('debug-gps');
        if (gpsEl) {
          gpsEl.innerText = `Error: ${err.message}`;
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const stopGpsTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const handleDeviceMotion = (event) => {
    // Add debug logging
    console.log("Motion detected", event);

    // Alert once so user gets immediate visual feedback on mobile without locking browser
    if (!window.hasAlertedMotion) {
      window.hasAlertedMotion = true;
      alert("motion");
    }

    const acc = event.accelerationIncludingGravity;
    if (!acc) {
      const magEl = document.getElementById('debug-mag');
      if (magEl) magEl.innerText = "Error: No acceleration values";
      return;
    }

    const x = acc.x || 0;
    const y = acc.y || 0;
    const z = acc.z || 0;
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    
    // Low pass gravity filter
    baselineRef.current = baselineRef.current * 0.9 + magnitude * 0.1;
    const dynamicAccel = Math.abs(magnitude - baselineRef.current);

    // Direct DOM update for high-frequency motion debug data
    const magEl = document.getElementById('debug-mag');
    if (magEl) {
      magEl.innerText = `Raw: ${magnitude.toFixed(2)} | Dyn: ${dynamicAccel.toFixed(2)}`;
    }
    const motionEl = document.getElementById('debug-motion-status');
    if (motionEl) {
      window.motionEventCount = (window.motionEventCount || 0) + 1;
      motionEl.innerText = `Streaming (${window.motionEventCount} events)`;
    }

    if (!window.repState) {
      window.repState = { count: 0, lastPeakTime: 0, state: 0, currentExercise: 'Walking' };
    }

    const currentEx = window.repState.currentExercise || 'Walking';

    if (currentEx === 'Walking' || currentEx === 'Running') {
      // Step counting mode
      const threshold = 1.2; 
      const timeNow = Date.now();
      const delta = timeNow - lastStepTimeRef.current;

      if (dynamicAccel > threshold && delta > 350) {
        lastStepTimeRef.current = timeNow;
        setActiveSession((prev) => {
          if (!prev || prev.status !== 'active') {
            return prev;
          }

          const nextSteps = prev.steps + 1;
          const cadence = Math.round(60000 / delta);

          let detected = prev.activityType;
          if (prev.speed <= 0.3) {
            detected = cadence > 140 ? 'running' : 'walking';
          }

          if (detected !== prev.activityType) {
            api.post('/activity', { activity_type: detected }).catch(err => console.warn(err));
          }

          if (prev.id && timeNow - lastStepsPost.current > 5000) {
            api.post('/steps', {
              steps: nextSteps,
              cadence
            }).catch(err => console.warn(err));

            lastStepsPost.current = timeNow;
          }

          return {
            ...prev,
            steps: nextSteps,
            activityType: detected
          };
        });
      }
    } else {
      // Rep Detection Logic (Squats, Pushups, Crunches, Jacks, Climbers, Lunges, Burpees)
      const timeNow = Date.now();
      const elapsedSinceLastPeak = timeNow - window.repState.lastPeakTime;
      let isRepDetected = false;
      const exLower = currentEx.toLowerCase();

      if (exLower.includes('squat')) {
        const val = y; 
        const dip = -1.3;
        const peak = 1.3;
        if (window.repState.state === 0 && val < dip) {
          window.repState.state = 1;
        } else if (window.repState.state === 1 && val > peak) {
          if (elapsedSinceLastPeak > 900) {
            isRepDetected = true;
          }
          window.repState.state = 0;
        }
      } else if (exLower.includes('pushup') || exLower.includes('push-up')) {
        const val = z;
        const dip = -1.1;
        const peak = 1.1;
        if (window.repState.state === 0 && val < dip) {
          window.repState.state = 1;
        } else if (window.repState.state === 1 && val > peak) {
          if (elapsedSinceLastPeak > 750) {
            isRepDetected = true;
          }
          window.repState.state = 0;
        }
      } else if (exLower.includes('crunch')) {
        const val = x;
        const limit = 1.5;
        if (Math.abs(val) > limit) {
          if (elapsedSinceLastPeak > 1300) {
            isRepDetected = true;
          }
        }
      } else if (exLower.includes('jack') || exLower.includes('jumping')) {
        const val = Math.sqrt(x * x + y * y);
        const limit = 4.2;
        if (val > limit) {
          if (elapsedSinceLastPeak > 500) {
            isRepDetected = true;
          }
        }
      } else if (exLower.includes('climber') || exLower.includes('mountain')) {
        const val = Math.abs(x);
        const limit = 3.0;
        if (val > limit) {
          if (elapsedSinceLastPeak > 350) {
            isRepDetected = true;
          }
        }
      } else if (exLower.includes('lunge')) {
        const val = y;
        const dip = -1.0;
        const peak = 1.0;
        if (window.repState.state === 0 && val < dip) {
          window.repState.state = 1;
        } else if (window.repState.state === 1 && val > peak) {
          if (elapsedSinceLastPeak > 1100) {
            isRepDetected = true;
          }
          window.repState.state = 0;
        }
      } else if (exLower.includes('burpee')) {
        const val = magnitude;
        if (window.repState.state === 0 && val < 5.5) {
          window.repState.state = 1;
        } else if (window.repState.state === 1 && val > 14.5) {
          window.repState.state = 2;
        } else if (window.repState.state === 2 && val < 11.5) {
          if (elapsedSinceLastPeak > 1600) {
            isRepDetected = true;
          }
          window.repState.state = 0;
        }
      }

      if (isRepDetected) {
        window.repState.count += 1;
        window.repState.lastPeakTime = timeNow;
        const nextReps = window.repState.count;

        setActiveSession((prev) => {
          if (!prev || prev.status !== 'active') return prev;

          // Stream reps dynamically to backend API
          if (prev.id && prev.id !== 'demo') {
            api.post('/workout-session/reps', {
              exercise_name: currentEx,
              reps: nextReps,
              duration: prev.duration,
              calories_burned: 0.5
            }).catch(err => console.warn(err));
          }

          // Trigger speech count on mobile browser
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`${nextReps}`);
            utterance.rate = 1.3;
            window.speechSynthesis.speak(utterance);
          }

          return {
            ...prev,
            reps: nextReps,
            calories: prev.calories + 0.5
          };
        });
      }
    }
  };

  /* ─── WebSocket sync listener ─── */
  useEffect(() => {
    const echo = getEcho();
    if (echo && user && activeSession && activeSession.id !== 'demo') {
      echo.private(`user.${user.id}`)
        .listen('.App\\Events\\WorkoutTelemetryUpdated', (e) => {
          console.log('[FitTrack Dashboard WS] Synced:', e);
          if (e.session && e.session.id === activeSession.id) {
            setActiveSession({
              id: e.session.id,
              duration: e.session.duration,
              calories: e.session.calories,
              steps: e.session.steps,
              distance: e.session.distance,
              speed: e.session.speed ?? 0,
              heartRate: e.session.heart_rate,
              activityType: e.session.activity_type,
              status: e.session.status,
              coords: e.session.gps_path ?? []
            });
          }
        });
      return () => {
        echo.leave(`user.${user.id}`);
      };
    }
  }, [activeSession?.id, user]);

  /* ─── Session Timer interval tick ─── */
  useEffect(() => {
    if (activeSession && activeSession.status === 'active') {
      timerRef.current = setInterval(() => {
        // Increment timer and calories locally
        setActiveSession((prev) => {
          if (!prev) return null;
          const nextDuration = prev.duration + 1;
          
          // Calculate dynamic cardio burn
          const hourlyKcal = prev.activityType === 'running' ? 700 : (prev.activityType === 'cycling' ? 450 : (prev.activityType === 'walking' ? 250 : 80));
          const perSecondKcal = hourlyKcal / 3600;
          const nextCalories = prev.calories + perSecondKcal;

          // Simulate heart rate oscillations
          let hrTarget = prev.activityType === 'running' ? 155 : (prev.activityType === 'cycling' ? 135 : (prev.activityType === 'walking' ? 100 : 72));
          const hrDelta = Math.floor(Math.random() * 5) - 2;
          const nextHr = Math.max(60, Math.min(185, prev.heartRate + (prev.heartRate < hrTarget ? 2 : -1) + hrDelta));

          // Throttled HR post (throttle: 4 seconds)
          if (prev.id && Date.now() - lastHrPost.current > 4000) {
            api.post('/heart-rate', { heart_rate: nextHr }).catch(err => console.warn(err));
            lastHrPost.current = Date.now();
          }

          return {
            ...prev,
            duration: nextDuration,
            calories: nextCalories,
            heartRate: nextHr
          };
        });
      }, 1000);

      window.addEventListener('devicemotion', handleDeviceMotion, true);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener('devicemotion', handleDeviceMotion, true);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener('devicemotion', handleDeviceMotion, true);
    };
  }, [activeSession?.status]);

  /* ─── Workout Control Handlers ─── */
  const handleStartWorkout = async () => {
    // Request iOS/Android Motion Permissions properly
    const motionEl = document.getElementById('debug-motion-status');
    if (motionEl) motionEl.innerText = 'Requesting permission...';

    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      // iOS 13+
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        console.log('[iOS Permission State]:', permission);
        if (motionEl) motionEl.innerText = `iOS Perm: ${permission}`;
      } catch (err) {
        console.warn('[iOS Permission Error]:', err);
        if (motionEl) motionEl.innerText = `iOS Err: ${err.message || err}`;
      }
    } else {
      // Android Chrome fallback / Implicit support checking
      console.log('[FitTrack] DeviceMotionEvent.requestPermission not present. Checking Permissions API...');
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const result = await navigator.permissions.query({ name: 'accelerometer' });
          console.log('[Android Chrome Accelerometer State]:', result.state);
          if (motionEl) motionEl.innerText = `Android Sensor: ${result.state}`;
        } catch (err) {
          console.warn('[Permissions API accelerometer query error]:', err);
          if (motionEl) motionEl.innerText = 'Sensors Active (Implicit)';
        }
      } else {
        if (motionEl) motionEl.innerText = 'Sensors Active (Implicit)';
      }
    }

    try {
      const res = await api.post('/workout', { action: 'start', workout_type: 'run' });
      const sessionData = res.data.session;

      window.repState = { count: 0, lastPeakTime: 0, state: 0, currentExercise: 'Walking' };

      setActiveSession({
        id: sessionData.id,
        duration: 0,
        calories: 0,
        steps: 0,
        distance: 0.0,
        speed: 0,
        heartRate: 72,
        activityType: 'idle',
        status: 'active',
        coords: [],
        exercise: 'Walking',
        reps: 0
      });

      await requestWakeLock();
      startGpsTracking(sessionData.id);
    } catch (err) {
      console.error(
        'Failed to start session:',
        err
      );
      window.repState = { count: 0, lastPeakTime: 0, state: 0, currentExercise: 'Walking' };
      const demoSession = {
        id: 'demo',
        duration: 0,
        calories: 0,
        steps: 0,
        distance: 0,
        speed: 0,
        heartRate: 72,
        activityType: 'idle',
        status: 'active',
        coords: [],
        exercise: 'Walking',
        reps: 0
      };
      setActiveSession(demoSession);
      await requestWakeLock();
      startGpsTracking('demo');
    }
  };

  const handleSelectExercise = (newEx) => {
    if (!window.repState) {
      window.repState = { count: 0, lastPeakTime: 0, state: 0, currentExercise: 'Walking' };
    }
    window.repState.currentExercise = newEx;
    window.repState.count = 0;
    window.repState.state = 0;
    
    // Speak exercise name to assist user
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Switching to ${newEx} detection mode.`);
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }

    setActiveSession(prev => prev ? { ...prev, exercise: newEx, reps: 0 } : null);
  };

  const handlePauseWorkout = async () => {
    setActiveSession(prev => prev ? { ...prev, status: 'paused' } : null);
    await releaseWakeLock();
    stopGpsTracking();
    if (activeSession && activeSession.id !== 'demo') {
      api.post('/workout', { action: 'pause' }).catch(err => console.warn(err));
    }
  };

  const handleResumeWorkout = async () => {
    setActiveSession(prev => prev ? { ...prev, status: 'active' } : null);
    await requestWakeLock();
    startGpsTracking(activeSession?.id);
    if (activeSession && activeSession.id !== 'demo') {
      api.post('/workout', { action: 'resume' }).catch(err => console.warn(err));
    }
  };

  const handleStopWorkout = async () => {
    if (!activeSession) return;
    stopGpsTracking();
    await releaseWakeLock();

    try {
      if (activeSession.id !== 'demo') {
        await api.post('/workout', {
          action: 'stop',
          duration: activeSession.duration,
          calories: Math.round(activeSession.calories)
        });
      }
      alert('Workout successfully saved to database history!');
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setActiveSession(null);
    }
  };

  // Clean watches on unmount
  useEffect(() => {
    return () => {
      stopGpsTracking();
      releaseWakeLock();
    };
  }, []);

  // Quick insights fetcher
  useEffect(() => {
    api.get('/insights/quick')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setInsights(res.data);
        }
      })
      .catch(err => console.error("Failed to load quick insights:", err));
  }, []);

  return (
    <div className="w-full min-h-screen p-6 md:p-8 space-y-8 pb-24 relative overflow-hidden bg-[#070B14]">
      
      {/* Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7C3AED]/20 blur-[150px] rounded-full mix-blend-screen" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00E5FF]/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* Realtime Futuristic Debug Panel */}
      <div className="fixed bottom-6 left-6 z-50 max-w-xs md:max-w-sm rounded-2xl bg-[#090F1D]/90 border border-[#00E5FF]/30 p-4 backdrop-blur-xl shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] font-black text-[#00E5FF] uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            Telemetry Debug Console
          </h4>
          <span className="text-[9px] text-gray-500 font-mono">v1.2.0</span>
        </div>
        
        <div className="space-y-1.5 font-mono text-[10px] text-gray-300">
          <div className="flex justify-between bg-black/20 p-1.5 rounded">
            <span className="text-gray-500">Motion Sensor:</span>
            <span id="debug-motion-status" className="text-amber-400 font-bold">Waiting for start...</span>
          </div>
          <div className="flex justify-between bg-black/20 p-1.5 rounded">
            <span className="text-gray-500">Acceleration:</span>
            <span id="debug-mag" className="text-white">Mag: 0.00 | Dyn: 0.00</span>
          </div>
          <div className="flex justify-between bg-black/20 p-1.5 rounded">
            <span className="text-gray-500">GPS Tracker:</span>
            <span id="debug-gps" className="text-white">Lat: 0.000000 | Lng: 0.000000</span>
          </div>
          <div className="bg-black/20 p-1.5 rounded space-y-1 text-gray-400">
            <div className="text-[9px] text-[#7C3AED] font-black uppercase tracking-wider">Android HTTPS Tunnel Tip:</div>
            <div className="text-[8px] leading-normal text-gray-400 font-sans">
              Modern Android Chrome ignores HTTP insecure flags for sensors.
              <br />
              Tunnel through secure HTTPS from your laptop:
              <br />
              <code className="text-[#00E5FF] select-all bg-black/40 px-1 rounded">npx localtunnel --port 5173</code>
              <br />
              or use <code className="text-[#00E5FF]">ngrok http 5173</code>. Open the secure link on your phone!
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 space-y-8 max-w-[1600px] mx-auto">
         {/* TOP: Hero Section */}
         <HeroSection onStartWorkout={handleStartWorkout} activeSession={activeSession} />

         {/* MIDDLE: Live Workout Tracker & Live GPS Route Map */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
               <LiveWorkoutTrackerPanel 
                  activeSession={activeSession}
                  onPause={handlePauseWorkout}
                  onResume={handleResumeWorkout}
                  onStop={handleStopWorkout}
                  onSelectExercise={handleSelectExercise}
               />
            </div>
            <div className="lg:col-span-7">
               <DashboardLiveGpsMap 
                  activeSession={activeSession}
               />
            </div>
         </div>

         {/* BOTTOM: Analytics Matrix Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Left Column */}
            <div className="flex flex-col gap-6">
               <CaloriesBurnedChart />
               <HydrationRing />
            </div>

            {/* Middle Column */}
            <div className="flex flex-col gap-6">
               <WeightPredictionChart />
               <SleepRecoveryChart />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6 xl:col-span-1 md:col-span-2">
               <MuscleRadarChart />
               
               {/* Smartwatch Sync Simulator */}
               <SmartwatchSync 
                  activeHeartRate={activeSession?.heartRate} 
                  activeSteps={activeSession?.steps} 
                  activeCalories={activeSession?.calories} 
                  isTracking={activeSession?.status === 'active'} 
               />
               
               {/* Mini AI Insight Card */}
               <div className="w-full rounded-3xl bg-gradient-to-br from-[#7C3AED]/20 to-[#0F172A] border border-[#7C3AED]/30 p-6 relative overflow-hidden backdrop-blur-xl group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED] opacity-20 blur-[40px] rounded-full pointer-events-none" />
                     <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Daily AI Insights</h3>
                     <div className="space-y-3">
                        {insights.length > 0 ? (
                           insights.slice(0, 3).map((ins, i) => (
                              <div key={i} className="flex gap-2 items-start">
                                 <span className="text-cyan-400 shrink-0 font-bold">🧬</span>
                                 <p className="text-v2-soft-gray text-xs leading-relaxed font-bold">{ins}</p>
                              </div>
                           ))
                        ) : (
                           <p className="text-v2-soft-gray text-xs leading-relaxed">
                              Syncing training telemetry and health metrics to compile predictive biological intelligence models...
                           </p>
                        )}
                     </div>
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                     <div className="px-2 py-1 rounded bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#00E5FF] text-[9px] uppercase font-black tracking-widest">Active Engine</div>
                     <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-[9px] uppercase font-black tracking-widest">Telemetry Sync</div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
