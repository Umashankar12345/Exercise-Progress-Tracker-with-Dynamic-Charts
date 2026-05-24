import React from 'react';
import { Target, TrendingUp } from 'lucide-react';

export default function ExerciseDifficultyProgression() {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">AI Intensity Scaling</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EC4899]/20 text-[#EC4899] font-bold uppercase tracking-widest border border-[#EC4899]/30">Advanced</span>
      </div>
      
      <div className="space-y-3">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="text-[9px] font-bold text-white uppercase tracking-widest">Volume</div>
            <div className="text-[9px] font-bold text-[#EC4899]">85%</div>
          </div>
          <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded bg-white/10">
            <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#EC4899]"></div>
          </div>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="text-[9px] font-bold text-white uppercase tracking-widest">Load</div>
            <div className="text-[9px] font-bold text-[#00F5FF]">92%</div>
          </div>
          <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded bg-white/10">
            <div style={{ width: "92%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#00F5FF]"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2 rounded-lg bg-black/20 border border-white/5">
        <TrendingUp className="w-3 h-3 text-[#10B981]" />
        <span className="text-[9px] text-v2-soft-gray font-medium">AI bumped working sets by +2.5kg based on last week's RPE.</span>
      </div>
    </div>
  );
}
