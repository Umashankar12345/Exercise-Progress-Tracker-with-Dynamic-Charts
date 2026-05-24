import React from 'react';
import { User, TrendingDown } from 'lucide-react';

export default function BodyFatEstimator() {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest mb-1">Est. Body Fat</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">14.2<span className="text-xl text-v2-soft-gray font-bold">%</span></span>
          </div>
        </div>
        <User className="w-5 h-5 text-v2-soft-gray" />
      </div>

      <div className="relative pt-4">
        {/* Abstract scale */}
        <div className="w-full h-2 rounded-full bg-gradient-to-r from-[#10B981] via-[#F59E0B] to-[#EF4444]" />
        {/* Indicator */}
        <div className="absolute top-2.5 left-[30%] w-3 h-3 bg-white border-2 border-[#050816] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        
        <div className="flex justify-between text-[8px] text-v2-soft-gray uppercase font-bold tracking-widest mt-2">
          <span>Athletic</span>
          <span>Fit</span>
          <span>Average</span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2 mt-1 rounded bg-[#10B981]/10 border border-[#10B981]/30">
        <TrendingDown className="w-3 h-3 text-[#10B981]" />
        <span className="text-[9px] text-[#10B981] font-bold tracking-widest uppercase">-0.4% from last month</span>
      </div>
    </div>
  );
}
