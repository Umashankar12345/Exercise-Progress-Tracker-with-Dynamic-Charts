import React from 'react';
import { LineChart, Sparkles } from 'lucide-react';

export default function AIFitnessForecast() {
  return (
    <div className="w-full rounded-2xl border border-[#3B82F6]/30 bg-[#3B82F6]/5 p-5 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#3B82F6] opacity-10 blur-3xl rounded-full" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-[#3B82F6]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Fitness Forecast</span>
        </div>
        <span className="text-[9px] text-[#3B82F6] font-bold uppercase tracking-widest bg-[#3B82F6]/10 px-2 py-1 rounded flex items-center gap-1">
           <Sparkles className="w-2.5 h-2.5" /> 91% Confidence
        </span>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
         <div className="flex items-center justify-between">
            <div className="flex flex-col">
               <span className="text-xs font-bold text-white mb-0.5">Projected Weight</span>
               <span className="text-[9px] uppercase tracking-widest text-v2-soft-gray">in 45 days</span>
            </div>
            <span className="text-xl font-black text-[#22D3EE]">72<span className="text-xs text-white/50">KG</span></span>
         </div>
         
         {/* Simulated projection chart */}
         <div className="w-full h-16 flex items-end justify-between border-b border-white/10 pb-1">
            {[80, 78, 76, 75, 74, 73, 72].map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-2 rounded-t-sm ${i === 6 ? 'bg-[#22D3EE]' : 'bg-white/10'}`} style={{ height: `${(val/80)*100}%` }} />
                <span className="text-[8px] text-v2-soft-gray font-mono">{val}</span>
              </div>
            ))}
         </div>

         <div className="w-full p-3 rounded-xl bg-black/20 border border-white/5 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
            <p className="text-[10px] text-v2-soft-gray leading-relaxed">
              Based on your current 500kcal deficit and high adherence rate, you are perfectly on track to hit your goal.
            </p>
         </div>
      </div>
    </div>
  );
}
