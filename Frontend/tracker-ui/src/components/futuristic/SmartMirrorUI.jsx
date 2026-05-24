import React from 'react';
import { Monitor, Zap } from 'lucide-react';

export default function SmartMirrorUI() {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 relative overflow-hidden group backdrop-blur-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.05)]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-white" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Smart Mirror</span>
        </div>
        <span className="text-[9px] text-[#3B82F6] font-bold uppercase tracking-widest">Cast Active</span>
      </div>

      <div className="flex flex-col items-center justify-center text-center opacity-80 group-hover:opacity-100 transition-opacity">
         <span className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-tighter">
           168 <span className="text-sm tracking-widest text-v2-soft-gray uppercase font-bold">BPM</span>
         </span>
         
         <div className="w-32 h-1 bg-white/10 rounded-full mt-4 overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#22C55E] via-[#FACC15] to-[#EF4444] w-3/4" />
         </div>
         <span className="text-[8px] uppercase tracking-widest text-v2-soft-gray font-bold mt-2">Zone 4: Anaerobic</span>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase font-bold text-white/50 tracking-widest">
         <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-[#FACC15]" /> 420 kcal</span>
         <span>45:20</span>
      </div>
    </div>
  );
}
