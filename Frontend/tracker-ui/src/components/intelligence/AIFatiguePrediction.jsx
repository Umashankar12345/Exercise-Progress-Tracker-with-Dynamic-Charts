import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';

export default function AIFatiguePrediction() {
  return (
    <div className="w-full rounded-2xl border border-[#EF4444]/30 bg-[#EF4444]/5 p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#EF4444] opacity-10 blur-3xl rounded-full" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#EF4444]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Fatigue Prediction</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#EF4444]/10 border border-[#EF4444]/30">
          <AlertTriangle className="w-2.5 h-2.5 text-[#EF4444]" />
          <span className="text-[9px] font-bold text-[#EF4444] tracking-widest">HIGH RISK</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center mb-6 relative z-10">
        <div className="relative mb-2">
           <svg className="w-24 h-24 transform -rotate-90">
             <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
             <circle cx="48" cy="48" r="40" stroke="#EF4444" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="45" className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
           </svg>
           <div className="absolute inset-0 flex items-center justify-center flex-col">
             <span className="text-2xl font-black text-white">82<span className="text-xs text-v2-soft-gray">%</span></span>
           </div>
        </div>
        <p className="text-xs text-v2-soft-gray font-medium px-4">
           AI detects cumulative central nervous system fatigue based on your recent HRV and elevated resting BPM.
        </p>
      </div>

      <div className="w-full rounded-xl bg-black/40 border border-[#EF4444]/20 p-4 relative z-10 text-center">
         <span className="text-[9px] font-bold uppercase tracking-widest text-[#EF4444] block mb-1">AI Recommendation</span>
         <span className="text-sm font-black text-white">Skip HIIT. Active Recovery Day.</span>
      </div>
    </div>
  );
}
