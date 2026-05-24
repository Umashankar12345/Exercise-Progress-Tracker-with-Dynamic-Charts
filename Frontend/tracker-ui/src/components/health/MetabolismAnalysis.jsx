import React from 'react';
import { Flame } from 'lucide-react';

export default function MetabolismAnalysis() {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
            <Flame className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-widest">TDEE Est.</span>
        </div>
        <span className="text-xl font-black text-[#F59E0B]">2,850 <span className="text-[10px] text-v2-soft-gray">kcal</span></span>
      </div>

      <div className="space-y-3 mt-2">
        <div>
          <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-v2-soft-gray mb-1">
            <span>BMR (Basal)</span>
            <span className="text-white">1,850 kcal</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded overflow-hidden">
            <div className="h-full bg-v2-soft-gray w-[65%]" />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-[#F59E0B] mb-1">
            <span>Active Burn</span>
            <span className="text-white">1,000 kcal</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded overflow-hidden">
            <div className="h-full bg-[#F59E0B] w-[35%]" />
          </div>
        </div>
      </div>
    </div>
  );
}
