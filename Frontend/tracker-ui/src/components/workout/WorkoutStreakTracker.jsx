import React from 'react';
import { Flame } from 'lucide-react';

export default function WorkoutStreakTracker() {
  const days = [
    { name: 'M', active: true },
    { name: 'T', active: true },
    { name: 'W', active: true },
    { name: 'T', active: true },
    { name: 'F', active: true },
    { name: 'S', active: false },
    { name: 'S', active: false },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="relative flex items-center justify-center mb-4">
        <div className="absolute inset-0 bg-[#F59E0B] blur-xl opacity-30 animate-pulse rounded-full" />
        <Flame className="w-10 h-10 text-[#F59E0B] drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] relative z-10" />
      </div>
      <div className="text-3xl font-black text-white tracking-tighter mb-1">12 Days</div>
      <div className="text-[10px] uppercase font-bold tracking-widest text-v2-soft-gray mb-4">Active Streak</div>
      
      <div className="flex gap-1.5">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
              d.active ? 'bg-[#F59E0B] text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-white/10 text-v2-soft-gray border border-white/5'
            }`}>
              {d.active ? '✓' : ''}
            </div>
            <span className="text-[8px] text-v2-soft-gray">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
