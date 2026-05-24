import React, { useState, useEffect, useRef } from 'react';
import { Watch, Wifi, WifiOff, Heart, Flame, Footprints } from 'lucide-react';

export default function SmartwatchSync({ activeHeartRate, activeSteps, activeCalories, isTracking }) {
  const [isConnected, setIsConnected] = useState(true);
  const [heartRate, setHeartRate] = useState(72);
  const [steps, setSteps] = useState(4820);
  const [calories, setCalories] = useState(245);
  const [batteryLevel, setBatteryLevel] = useState(92);
  const [latency, setLatency] = useState(12);

  const simulationIntervalRef = useRef(null);

  useEffect(() => {
    if (isConnected && !isTracking) {
      // Simulate live hardware signals only when not actively tracking a real session
      simulationIntervalRef.current = setInterval(() => {
        // Vary heart rate slightly (e.g., within 70 to 140 bpm depending on activity)
        setHeartRate((prev) => {
          const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
          const next = prev + delta;
          return Math.max(65, Math.min(145, next));
        });

        // Accumulate step counts
        setSteps((prev) => {
          const newSteps = Math.floor(Math.random() * 4); // 0 to 3 steps
          if (newSteps > 0) {
            // Calories burn approx 0.04 kcal per step
            setCalories((cPrev) => +(cPrev + newSteps * 0.04).toFixed(1));
          }
          return prev + newSteps;
        });

        // Battery slowly drains (1% chance per tick)
        setBatteryLevel((prev) => {
          if (Math.random() < 0.01 && prev > 1) {
            return prev - 1;
          }
          return prev;
        });

        // Vary latency
        setLatency((prev) => {
          const delta = Math.floor(Math.random() * 3) - 1; // -1 to +1
          const next = prev + delta;
          return Math.max(8, Math.min(25, next));
        });
      }, 1500);
    } else {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
    }

    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, [isConnected, isTracking]);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  const displayHeartRate = isConnected && isTracking && activeHeartRate ? activeHeartRate : (isConnected ? heartRate : 0);
  const displaySteps = isConnected && isTracking && activeSteps !== undefined ? activeSteps : (isConnected ? steps : 0);
  const displayCalories = isConnected && isTracking && activeCalories !== undefined ? activeCalories : (isConnected ? calories : 0);

  // Determine pulse speed based on heart rate
  const getHeartPulseSpeed = () => {
    if (displayHeartRate > 120) return 'animate-[ping_0.5s_infinite]';
    if (displayHeartRate > 90) return 'animate-[ping_0.8s_infinite]';
    return 'animate-[ping_1.2s_infinite]';
  };

  return (
    <div className={`w-full rounded-2xl border transition-all duration-300 p-5 relative overflow-hidden group ${
      isConnected 
        ? 'border-[#22D3EE]/30 bg-[#22D3EE]/5 shadow-[0_0_20px_rgba(34,211,238,0.03)]' 
        : 'border-white/5 bg-[#0F172A]/50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Watch className={`w-4 h-4 transition-colors ${isConnected ? 'text-[#22D3EE]' : 'text-v2-soft-gray'}`} />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Wearable Telemetry</span>
        </div>
        
        {isConnected ? (
          <div className="flex items-center gap-1 text-[9px] text-[#22D3EE] font-bold uppercase tracking-widest">
            <Wifi className="w-3.5 h-3.5" /> {latency}ms
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[9px] text-red-400 font-bold uppercase tracking-widest">
            <WifiOff className="w-3.5 h-3.5" /> Offline
          </div>
        )}
      </div>

      {/* Main Connection Status Widget */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-black/45 border border-white/5 shadow-inner mb-4">
        <div className="flex flex-col">
          <span className="text-[9px] text-v2-soft-gray uppercase tracking-widest font-bold mb-1">Apple Watch Ultra</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs font-black text-white">{isConnected ? 'Syncing Active' : 'Disconnected'}</span>
          </div>
        </div>
        
        {isConnected && (
          <div className="w-8 h-8 rounded-full border-2 border-[#22D3EE]/30 flex items-center justify-center relative">
            <span className="text-[9px] font-black text-white">{batteryLevel}%</span>
          </div>
        )}
      </div>

      {/* Real-time Dynamic Metrics */}
      {isConnected ? (
        <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
          {/* Heart Rate */}
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/25 border border-white/5 relative">
            <div className="flex items-center gap-1 mb-1">
              <div className="relative flex h-2 w-2">
                <Heart className={`w-2 h-2 text-red-500 fill-red-500 absolute ${getHeartPulseSpeed()}`} />
                <Heart className="w-2 h-2 text-red-500 fill-red-500 relative" />
              </div>
              <span className="text-[8px] text-v2-soft-gray uppercase font-bold tracking-wider">Pulse</span>
            </div>
            <span className="text-sm font-black text-white">{displayHeartRate} <span className="text-[8px] font-normal text-v2-soft-gray">bpm</span></span>
          </div>

          {/* Steps */}
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/25 border border-white/5">
            <div className="flex items-center gap-1 mb-1">
              <Footprints className="w-3.5 h-3.5 text-[#00F5FF]" />
              <span className="text-[8px] text-v2-soft-gray uppercase font-bold tracking-wider">Steps</span>
            </div>
            <span className="text-sm font-black text-[#00F5FF]">{displaySteps.toLocaleString()}</span>
          </div>

          {/* Active Kcal */}
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/25 border border-white/5">
            <div className="flex items-center gap-1 mb-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[8px] text-v2-soft-gray uppercase font-bold tracking-wider">Burned</span>
            </div>
            <span className="text-sm font-black text-white">{Math.round(displayCalories)} <span className="text-[8px] font-normal text-v2-soft-gray">kcal</span></span>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-black/20 rounded-lg border border-dashed border-white/5 text-center mb-4">
          <span className="text-[9px] text-v2-soft-gray leading-relaxed block">
            Turn on watch synchronisation below to stream live biometric data into your workout session.
          </span>
        </div>
      )}

      {/* Toggle Connect Action */}
      <button
        onClick={toggleConnection}
        className={`w-full py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.98] ${
          isConnected 
            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20' 
            : 'bg-[#22D3EE] text-slate-900 hover:bg-[#22D3EE]/90 shadow-md shadow-[#22D3EE]/10'
        }`}
      >
        {isConnected ? 'Disconnect Watch' : 'Connect Wearable'}
      </button>
    </div>
  );
}
