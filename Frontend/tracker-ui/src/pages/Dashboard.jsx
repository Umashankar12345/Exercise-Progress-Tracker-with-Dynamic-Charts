import React, { useState, useEffect, useRef } from 'react';
import TopMetricsGrid from '../components/dashboard/TopMetricsGrid';
import QuickLogActions from '../components/dashboard/QuickLogActions';
import LiveWorkoutTrackerPanel from '../components/dashboard/LiveWorkoutTrackerPanel';
import DashboardLiveGpsMap from '../components/dashboard/DashboardLiveGpsMap';
import CaloriesBurnedChart from '../components/dashboard/CaloriesBurnedChart';
import HydrationRing from '../components/dashboard/HydrationRing';
import SleepRecoveryChart from '../components/dashboard/SleepRecoveryChart';
import WaterIntakeHistoryChart from '../components/dashboard/WaterIntakeHistoryChart';
import StepsHistoryChart from '../components/dashboard/StepsHistoryChart';
import api from '../api/axios';
import useStore from '../store/useStore';
import { getEcho } from '../lib/echo';

export default function Dashboard() {
  const { user } = useStore();
  const [insights, setInsights] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  
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
  const fetchDashboardData = () => {
    api.get('/dashboard/analytics')
      .then(res => setDashboardData(res.data))
      .catch(err => console.error("Failed to load dashboard data:", err));
  };

  useEffect(() => {
    api.get('/insights/quick')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setInsights(res.data);
        }
      })
      .catch(err => console.error("Failed to load quick insights:", err));

    fetchDashboardData();
  }, []);

  return (
    <div className="w-full min-h-screen p-6 md:p-8 space-y-8 pb-24 relative overflow-hidden bg-[#070B14]">
      
      {/* Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7C3AED]/20 blur-[150px] rounded-full mix-blend-screen" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00E5FF]/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>



      <div className="relative z-10 space-y-8 max-w-[1600px] mx-auto">
         {/* TOP: Real Data Metrics Section */}
         <div className="space-y-4">
            <TopMetricsGrid data={dashboardData} />
            <QuickLogActions onLogSuccess={fetchDashboardData} />
         </div>

         {/* MIDDLE: Live Workout Tracker & Live GPS Route Map */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
               <LiveWorkoutTrackerPanel 
                  activeSession={activeSession}
                  onStartWorkout={handleStartWorkout}
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
            
            {/* Left Column - Today's Energy & Target Hydration */}
            <div className="flex flex-col gap-6">
               <CaloriesBurnedChart data={dashboardData} onStartWorkout={handleStartWorkout} />
               <HydrationRing data={dashboardData} />
            </div>

            {/* Middle Column - 7-Day History Trends */}
            <div className="flex flex-col gap-6">
               <SleepRecoveryChart data={dashboardData} />
               <WaterIntakeHistoryChart data={dashboardData} />
            </div>

            {/* Right Column - Cognitive AI Guidance Core & Step Telemetry */}
            <div className="flex flex-col gap-6 xl:col-span-1 md:col-span-2">
               
               <StepsHistoryChart data={dashboardData} onStartWorkout={handleStartWorkout} />

               {/* Jarvis AI Coach Launch Card */}
               <div className="w-full h-full rounded-3xl bg-gradient-to-br from-[#7C3AED]/20 via-[#0F172A] to-[#4F46E5]/10 border border-[#7C3AED]/20 p-6 relative overflow-hidden backdrop-blur-xl group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-[0_8px_30px_rgba(124,58,237,0.2)] min-h-[330px]">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#7C3AED] opacity-10 blur-[60px] rounded-full pointer-events-none group-hover:opacity-20 transition-opacity duration-500" />
                  
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#7C3AED] flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" /></svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Jarvis AI Coach</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-pulse" />
                           <p className="text-[9px] text-[#00F5A0] font-bold uppercase tracking-widest">AI Engine Active</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      {insights.length > 0 ? (
                        insights.slice(0, 3).map((ins, i) => (
                          <div key={i} className="flex gap-2 items-start p-2.5 rounded-xl bg-white/[0.03] border border-white/8">
                            <span className="text-[#7C3AED] shrink-0 text-xs mt-0.5">✦</span>
                            <p className="text-[#94A3B8] text-xs leading-relaxed">{ins}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                          <p className="text-[#475569] text-xs font-bold uppercase tracking-wider">Nominal systems state. Log metrics for insights.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <a href="/jarvis" className="mt-5 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#7C3AED]/20 hover:bg-[#7C3AED]/30 border border-[#7C3AED]/30 hover:border-[#7C3AED]/50 text-[#7C3AED] text-[10px] font-black uppercase tracking-widest transition-all duration-200 group/btn">
                    <svg className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Open Jarvis AI Coach
                  </a>
               </div>

            </div>

         </div>
      </div>
    </div>
  );
}
