import React from 'react';
import { Target, Flame } from 'lucide-react';

export default function AdaptiveFitnessChallenges() {
  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5 relative overflow-hidden group">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-[#FACC15]" />
        <span className="text-[10px] uppercase font-bold text-white tracking-widest">Adaptive Missions</span>
      </div>

      <div className="w-full p-4 rounded-xl bg-black/40 border border-[#FACC15]/20 relative overflow-hidden group-hover:border-[#FACC15]/40 transition-colors">
         <div className="absolute top-0 right-0 w-24 h-24 bg-[#FACC15] opacity-10 blur-2xl rounded-full" />
         
         <div className="flex items-center justify-between mb-2 relative z-10">
            <span className="text-xs font-black text-white">Burn 400 Active Calories</span>
            <span className="text-[9px] text-[#FACC15] uppercase tracking-widest font-bold">Daily Core</span>
         </div>
         
         <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mb-2 relative z-10">
            <div className="h-full bg-[#FACC15] rounded-full w-[65%] shadow-[0_0_10px_#FACC15]" />
         </div>
         
         <div className="flex items-center justify-between text-[9px] uppercase tracking-widest font-bold relative z-10">
            <span className="text-white">260 / 400 kcal</span>
            <span className="text-v2-soft-gray flex items-center gap-1"><Flame className="w-3 h-3 text-[#EF4444]" /> +20 XP</span>
         </div>
      </div>
    </div>
  );
}
