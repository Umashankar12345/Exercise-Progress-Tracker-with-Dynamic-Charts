import React, { useState, useEffect } from 'react';
import { Camera, Focus, AlertTriangle, Square, CheckCircle } from 'lucide-react';
import CameraAI from './CameraAI';
import api from '../../api/axios';

export default function ARWorkoutMode() {
  const [seconds, setSeconds] = useState(0);
  const [calories, setCalories] = useState(0);
  const [reps, setReps] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        setSeconds(prev => prev + 1);
        setCalories(prev => prev + 0.15); // ~9 kcal/min
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  const handleEndWorkout = async () => {
    setIsActive(false);
    try {
      await api.post('/workouts', {
        title: 'AR AI Squat Session',
        duration: Math.floor(seconds / 60),
        calories_burned: Math.floor(calories),
        reps: reps,
        type: 'AI Live Session'
      });
      setIsSaved(true);
    } catch (err) {
      console.error("Failed to save workout", err);
    }
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  return (
    <div className="w-full rounded-2xl border border-[#EF4444]/30 bg-black p-5 relative overflow-hidden group">
      {/* Simulated Camera Feed Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 z-0" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop&q=60')] bg-cover bg-center z-[-1]" />
      
      {/* AR Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:40px_40px] z-0 opacity-30" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#22D3EE]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">AR Vision</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xl font-black text-white">{formatTime(seconds)}</span>
            <span className="text-[10px] uppercase font-bold text-v2-soft-gray tracking-widest">{calories.toFixed(1)} kcal</span>
          </div>
          {isActive ? (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
              <span className="text-[9px] text-[#EF4444] font-bold uppercase tracking-widest">Rec</span>
            </div>
          ) : (
            <div className="px-2 py-1 bg-[#00F5A0]/20 rounded border border-[#00F5A0]/30 text-[9px] font-bold uppercase text-[#00F5A0]">
              Ended
            </div>
          )}
        </div>
      </div>

      {!isSaved ? (
        <>
          <div className="flex-1 w-full relative z-10 p-0 border-0 m-0 transition-opacity duration-500" style={{ opacity: isActive ? 1 : 0.5 }}>
             <CameraAI onRepComplete={(count) => setReps(count)} />
          </div>

          {isActive && (
            <button 
              onClick={handleEndWorkout}
              className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#B91C1C] flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest hover:brightness-110 transition-all z-10 relative border border-[#EF4444]/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              <Square className="w-5 h-5 fill-white" />
              End & Save Workout
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 relative z-10 text-center">
          <CheckCircle className="w-16 h-16 text-[#00F5A0] mb-4 drop-shadow-[0_0_15px_rgba(0,245,160,0.5)]" />
          <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Workout Synced</h2>
          <p className="text-v2-soft-gray text-sm mb-6">Your AR session was successfully logged to the database.</p>
          <div className="flex gap-6 mb-8">
             <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-[#00E5FF]">{reps}</span>
                <span className="text-[10px] uppercase font-bold text-v2-soft-gray tracking-widest">Reps</span>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-[#00E5FF]">{Math.floor(calories)}</span>
                <span className="text-[10px] uppercase font-bold text-v2-soft-gray tracking-widest">Kcal</span>
             </div>
          </div>
          <button 
             onClick={() => window.location.href = '/'}
             className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
          >
             Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
