import React from 'react';
import { Target, TrendingDown } from 'lucide-react';

export default function AIConsistencyAnalyzer() {
  return (
    <div className="w-full rounded-2xl border border-[#F97316]/30 bg-[#F97316]/5 p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#F97316] opacity-10 blur-3xl rounded-full" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#F97316]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Consistency Analyzer</span>
        </div>
        <span className="text-[9px] text-[#F97316] font-bold uppercase tracking-widest bg-[#F97316]/10 px-2 py-1 rounded">Medium Risk</span>
      </div>

      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="flex-1 flex flex-col p-3 rounded-xl bg-black/20 border border-white/5">
           <span className="text-[9px] uppercase tracking-widest text-v2-soft-gray font-bold mb-1">Drop-off Risk</span>
           <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white">38%</span>
              <TrendingDown className="w-3 h-3 text-[#F97316]" />
           </div>
        </div>
        <div className="flex-1 flex flex-col p-3 rounded-xl bg-black/20 border border-white/5">
           <span className="text-[9px] uppercase tracking-widest text-v2-soft-gray font-bold mb-1">Motivation</span>
           <span className="text-lg font-black text-white">Low</span>
        </div>
      </div>

      <p className="text-xs text-v2-soft-gray mb-4 relative z-10">
        You missed 2 workouts this week and sleep quality is down. Pattern matches previous streak drop-offs.
      </p>

      <button className="w-full py-2 rounded-xl bg-[#F97316]/20 hover:bg-[#F97316]/30 transition-colors text-[9px] font-bold uppercase tracking-widest text-[#F97316] border border-[#F97316]/30">
        Trigger Recovery Routine
      </button>
    </div>
  );
}
