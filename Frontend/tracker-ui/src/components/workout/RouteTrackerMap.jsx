import React, { useState, useEffect, useRef } from 'react';
import { Map, Navigation2, Play, Pause, Square, AlertTriangle, RefreshCw } from 'lucide-react';

export default function RouteTrackerMap() {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [distance, setDistance] = useState(0); // in km
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [errorMsg, setErrorMsg] = useState('');

  const watchIdRef = useRef(null);
  const timerRef = useRef(null);
  const wakeLockRef = useRef(null);

  // Haversine formula to calculate distance between two coordinates in km
  const getDistanceKm = (c1, c2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
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

  // Handle Wake Lock to keep phone screen awake
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
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
      } catch (err) {
        console.error('[FitTrack] Wake Lock release failed:', err);
      }
    }
  };

  // Start tracking run
  const startTracking = async () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setErrorMsg('');
    setIsTracking(true);
    setIsPaused(false);
    setCoordinates([]);
    setDistance(0);
    setElapsedTime(0);

    await requestWakeLock();

    // Start timer
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Watch position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoord = { lat: latitude, lng: longitude, time: Date.now() };

        setCoordinates((prev) => {
          if (prev.length > 0) {
            const lastCoord = prev[prev.length - 1];
            // Calculate delta distance
            const d = getDistanceKm(lastCoord, newCoord);
            // Only count movement if it's more than 2 meters to avoid GPS noise jitter
            if (d > 0.002) {
              setDistance((dPrev) => dPrev + d);
              return [...prev, newCoord];
            }
            return prev;
          }
          return [newCoord];
        });
      },
      (err) => {
        console.error('[FitTrack] Geolocation Watch Error:', err);
        setErrorMsg('GPS Signal lost or permissions denied.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Pause/Resume tracking
  const togglePause = () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      requestWakeLock();
    } else {
      // Pause
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
      releaseWakeLock();
    }
  };

  // Stop and clear tracking
  const stopTracking = () => {
    setIsTracking(false);
    setIsPaused(false);
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    releaseWakeLock();
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      releaseWakeLock();
    };
  }, []);

  // Format Elapsed Time (MM:SS or HH:MM:SS)
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  };

  // Calculate Pace (min/km)
  const getPaceStr = () => {
    if (distance === 0 || elapsedTime === 0) return '0:00/km';
    const totalMinutes = elapsedTime / 60;
    const paceDecimal = totalMinutes / distance;
    const paceMinutes = Math.floor(paceDecimal);
    const paceSeconds = Math.floor((paceDecimal - paceMinutes) * 60);
    return `${paceMinutes}:${String(paceSeconds).padStart(2, '0')}/km`;
  };

  // Project latitude/longitude coordinates into local 100x100 SVG space
  const getSvgPath = () => {
    if (coordinates.length < 2) return '';

    const lats = coordinates.map((c) => c.lat);
    const lngs = coordinates.map((c) => c.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = maxLat - minLat || 0.0001;
    const lngRange = maxLng - minLng || 0.0001;

    // Map each coordinate to a point between 10 and 90 inside the 100x100 box
    const points = coordinates.map((c) => {
      const x = 15 + ((c.lng - minLng) / lngRange) * 70;
      const y = 85 - ((c.lat - minLat) / latRange) * 70; // Invert Y for screen coordinates
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const svgPath = getSvgPath();
  const lastPoint = coordinates[coordinates.length - 1];

  // Get project coordinates relative position for current GPS pulse
  const getLastPointCoords = () => {
    if (coordinates.length === 0) return { x: 50, y: 50 };
    if (coordinates.length === 1) return { x: 50, y: 50 };

    const lats = coordinates.map((c) => c.lat);
    const lngs = coordinates.map((c) => c.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = maxLat - minLat || 0.0001;
    const lngRange = maxLng - minLng || 0.0001;

    const x = 15 + ((lastPoint.lng - minLng) / lngRange) * 70;
    const y = 85 - ((lastPoint.lat - minLat) / latRange) * 70;

    return { x, y };
  };

  const currentPulsePos = getLastPointCoords();

  return (
    <div className="w-full h-full min-h-[220px] relative rounded-xl overflow-hidden bg-[#0F172A] border border-white/5 flex flex-col justify-between">
      {/* Abstract Grid Map Background */}
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none" />
      
      {/* Route Line SVG */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center p-4">
        {coordinates.length >= 2 ? (
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-80">
            <path
              d={svgPath}
              fill="none"
              stroke="#00F5FF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_6px_#00F5FF]"
            />
            {/* Start point indicator */}
            <circle cx={svgPath.split(' ')[1].split(',')[0]} cy={svgPath.split(' ')[1].split(',')[1]} r="2.5" fill="#EC4899" />
            
            {/* Current pulsating position */}
            <circle cx={currentPulsePos.x} cy={currentPulsePos.y} r="3.5" fill="#00F5FF" className="animate-pulse" />
            <circle cx={currentPulsePos.x} cy={currentPulsePos.y} r="8" fill="none" stroke="#00F5FF" strokeWidth="1" className="animate-ping opacity-60" />
          </svg>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-center z-10 px-4">
            <Map className={`w-8 h-8 ${isTracking ? 'text-[#00F5FF] animate-pulse' : 'text-white/20'}`} />
            <span className="text-[10px] text-v2-soft-gray max-w-[150px] leading-relaxed">
              {isTracking
                ? 'Acquiring GPS lock... Walk to draw your route.'
                : 'Tap Start to begin live route and telemetry tracking.'}
            </span>
          </div>
        )}
      </div>

      {/* Top Info Header */}
      <div className="absolute top-2 left-2 right-2 z-20 flex justify-between items-center pointer-events-none">
        <div className="px-2.5 py-1 bg-black/60 border border-white/10 rounded-lg backdrop-blur-md flex items-center gap-1.5 pointer-events-auto">
          <Navigation2 className={`w-3.5 h-3.5 text-[#00F5FF] ${isTracking && !isPaused ? 'animate-bounce' : ''}`} />
          <span className="text-[9px] font-black text-white uppercase tracking-widest">
            {isTracking ? (isPaused ? 'Paused' : 'Live GPS') : 'GPS Ready'}
          </span>
          {isTracking && !isPaused && (
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
          )}
        </div>

        {errorMsg && (
          <div className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg backdrop-blur-md flex items-center gap-1 text-[8px] font-bold pointer-events-auto">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Bottom Info Metrics & Control Buttons */}
      <div className="w-full z-20 mt-auto p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2.5">
        
        {/* Telemetry Metrics */}
        <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-2 text-center">
          <div className="flex flex-col">
            <span className="text-[8px] text-v2-soft-gray uppercase font-bold tracking-wider">Duration</span>
            <span className="text-sm font-black text-white">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-v2-soft-gray uppercase font-bold tracking-wider">Distance</span>
            <span className="text-sm font-black text-[#00F5FF]">
              {distance >= 1 ? `${distance.toFixed(2)} km` : `${Math.round(distance * 1000)} m`}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-v2-soft-gray uppercase font-bold tracking-wider">Pace</span>
            <span className="text-sm font-black text-white">{getPaceStr()}</span>
          </div>
        </div>

        {/* Control Button Actions */}
        <div className="flex justify-center items-center gap-4">
          {!isTracking ? (
            <button
              onClick={startTracking}
              className="flex items-center justify-center gap-1.5 px-6 py-2 bg-gradient-to-r from-[#00F5FF] to-[#3B82F6] hover:from-[#00F5FF]/90 hover:to-[#3B82F6]/90 text-slate-900 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#00F5FF]/10 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-slate-900" />
              <span>Start Tracking</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 w-full justify-center">
              <button
                onClick={togglePause}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 border rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 flex-1 ${
                  isPaused
                    ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                    : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                }`}
              >
                {isPaused ? (
                  <>
                    <Play className="w-3 h-3 fill-green-400" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 fill-yellow-400" />
                    <span>Pause</span>
                  </>
                )}
              </button>
              
              <button
                onClick={stopTracking}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 flex-1"
              >
                <Square className="w-3 h-3 fill-red-400" />
                <span>Stop</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
