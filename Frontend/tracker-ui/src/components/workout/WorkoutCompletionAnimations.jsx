import React, { useState } from 'react';
import { Trophy, Star } from 'lucide-react';

export default function WorkoutCompletionAnimations() {
  const [complete, setComplete] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {!complete ? (
        <button 
          onClick={() => setComplete(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white font-black uppercase tracking-widest shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-all hover:scale-105 active:scale-95"
        >
          Finish Workout
        </button>
      ) : (
        <div className="flex flex-col items-center animate-in zoom-in fade-in duration-500 relative">
          <div className="absolute -inset-10 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] opacity-20 blur-xl rounded-full animate-pulse" />
          <Trophy className="w-16 h-16 text-[#00F5FF] drop-shadow-[0_0_15px_rgba(0,245,255,0.8)] mb-4" />
          <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-1">Workout Complete</h2>
          <div className="flex items-center gap-1 text-[#8B5CF6] font-bold text-xs uppercase tracking-widest mb-4">
            <Star className="w-3 h-3 fill-current" /> +450 XP Earned
          </div>
          <button 
            onClick={() => setComplete(false)}
            className="text-[9px] text-v2-soft-gray hover:text-white uppercase tracking-widest font-bold underline"
          >
            Reset Demo
          </button>
        </div>
      )}
    </div>
  );
}
