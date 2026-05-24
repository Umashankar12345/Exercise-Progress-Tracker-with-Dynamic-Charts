import React from 'react';
import { Flame } from 'lucide-react';

export default function LiveStreakTracker() {
  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#F97316] opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity" />
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.2)]">
            <Flame className="w-6 h-6 text-[#F97316]" fill="currentColor" />
          </div>
          <div className="absolute -inset-1 border border-[#F97316]/20 rounded-full animate-[spin_4s_linear_infinite]" />
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
             <span className="text-2xl font-black text-white">28</span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-v2-soft-gray">Days</span>
          </div>
          <span className="text-[9px] uppercase font-bold text-[#F97316] tracking-widest mt-0.5">Active Streak</span>
        </div>
      </div>

      <div className="mt-4 flex gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${i < 5 ? 'bg-[#F97316] shadow-[0_0_5px_rgba(249,115,22,0.5)]' : 'bg-white/10'}`} />
        ))}
      </div>
    </div>
  );
}
