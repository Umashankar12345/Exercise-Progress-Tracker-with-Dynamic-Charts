import React from 'react';
import { Activity, Thermometer } from 'lucide-react';

export default function AIInjuryPrevention() {
  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#FACC15]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Injury Prevention</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="w-full p-3 rounded-xl bg-gradient-to-r from-[#FACC15]/10 to-transparent border border-[#FACC15]/20 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-[#FACC15]/20 flex items-center justify-center">
               <Thermometer className="w-4 h-4 text-[#FACC15]" />
             </div>
             <div className="flex flex-col">
               <span className="text-xs font-bold text-white">Right Knee Strain</span>
               <span className="text-[9px] uppercase tracking-widest text-v2-soft-gray">Imbalance Detected</span>
             </div>
           </div>
           <span className="text-sm font-black text-[#FACC15]">64%</span>
        </div>
        <p className="text-[10px] text-v2-soft-gray leading-relaxed">
           Your left-leg compensation during squats has increased by 14%. Recommend lowering weight and focusing on mobility.
        </p>
      </div>
    </div>
  );
}
