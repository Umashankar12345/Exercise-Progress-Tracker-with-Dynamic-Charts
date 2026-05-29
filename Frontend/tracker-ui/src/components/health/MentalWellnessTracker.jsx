import React from 'react';
import { Brain, TrendingUp } from 'lucide-react';

export default function MentalWellnessTracker() {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">Cognitive Load</span>
        </div>
        <span className="text-xl font-black text-[#8B5CF6]">Optimal</span>
      </div>

      <div className="relative pt-2">
        <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-[#10B981] via-[#8B5CF6] to-[#EF4444]" />
        <div className="absolute top-0.5 left-[40%] w-3 h-3 bg-white border-2 border-[#050816] rounded-full shadow-lg" />
        
        <div className="flex justify-between text-[7px] text-v2-soft-gray uppercase font-bold tracking-widest mt-2">
          <span>Under</span>
          <span>Optimal</span>
          <span>Overload</span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2 mt-2 rounded bg-black/20 border border-white/5">
        <TrendingUp className="w-3 h-3 text-[#10B981]" />
        <span className="text-[9px] text-v2-soft-gray font-medium">Readiness is high. Perfect day for complex tasks.</span>
      </div>
    </div>
  );
}
