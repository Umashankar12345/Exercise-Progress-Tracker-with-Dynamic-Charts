import React from 'react';
import { ActivitySquare, TrendingDown } from 'lucide-react';

export default function BloodPressureLog() {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest mb-1">Latest Reading</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">118<span className="text-xl text-v2-soft-gray font-bold">/76</span></span>
            <span className="text-[9px] text-v2-soft-gray font-bold uppercase">mmHg</span>
          </div>
        </div>
        <div className="p-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]">
          <TrendingDown className="w-4 h-4" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] text-v2-soft-gray font-bold uppercase tracking-widest border-b border-white/5 pb-1">
          <span>Date</span>
          <span>SYS/DIA</span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-medium text-white">
          <span>Today, 8:00 AM</span>
          <span>118/76</span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-medium text-v2-soft-gray">
          <span>Yesterday, 7:30 AM</span>
          <span>120/79</span>
        </div>
      </div>
    </div>
  );
}
