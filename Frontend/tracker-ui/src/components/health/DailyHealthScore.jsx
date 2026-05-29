import React from 'react';
import { Star } from 'lucide-react';

export default function DailyHealthScore() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00F5FF] to-[#8B5CF6] blur-xl opacity-30 animate-pulse rounded-full" />
        <div className="w-24 h-24 rounded-full border-4 border-[#00F5FF]/30 flex flex-col items-center justify-center relative z-10 bg-[#0F172A] shadow-[0_0_20px_rgba(0,245,255,0.2)]">
          <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#00F5FF] to-[#8B5CF6]">92</span>
        </div>
        <div className="absolute -top-2 -right-2 bg-[#8B5CF6] p-1 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)] z-20">
          <Star className="w-3 h-3 text-white fill-current" />
        </div>
      </div>
      <h4 className="text-[10px] uppercase font-bold tracking-widest text-v2-soft-gray mb-1">Overall Health</h4>
      <p className="text-[9px] text-[#10B981] font-bold tracking-widest uppercase">Top 5% of users</p>
    </div>
  );
}
