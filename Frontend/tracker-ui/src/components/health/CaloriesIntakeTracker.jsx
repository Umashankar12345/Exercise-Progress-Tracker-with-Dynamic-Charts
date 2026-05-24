import React from 'react';
import { Utensils } from 'lucide-react';

export default function CaloriesIntakeTracker() {
  const current = 1850;
  const goal = 2400;
  const percentage = (current / goal) * 100;

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="flex justify-between items-end mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest mb-1">Calories Consumed</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">{current}</span>
            <span className="text-[10px] font-bold text-v2-soft-gray uppercase">/ {goal} kcal</span>
          </div>
        </div>
        <Utensils className="w-5 h-5 text-v2-soft-gray" />
      </div>

      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-3">
        <div className="h-full bg-gradient-to-r from-[#10B981] to-[#00F5FF] rounded-full shadow-[0_0_10px_rgba(0,245,255,0.5)]" style={{ width: `${percentage}%` }} />
      </div>

      <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase">
        <span className="text-[#10B981]">550 kcal remaining</span>
        <span className="text-[#00F5FF]">Surplus Track</span>
      </div>
    </div>
  );
}
