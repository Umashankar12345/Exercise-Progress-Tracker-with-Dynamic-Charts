import React from 'react';
import { User, Maximize } from 'lucide-react';

export default function AIFitnessTwin() {
  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5 relative overflow-hidden group min-h-[400px] flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3B82F6]/5 via-black/20 to-transparent" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#3B82F6]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">AI Fitness Twin</span>
        </div>
        <button className="p-1.5 rounded bg-white/5 hover:bg-white/10 transition-colors">
          <Maximize className="w-3 h-3 text-v2-soft-gray" />
        </button>
      </div>

      <div className="flex-1 w-full relative flex items-center justify-center z-10">
         {/* Simulated 3D Wireframe */}
         <div className="absolute w-64 h-80 border-x border-dashed border-[#3B82F6]/20 rounded-[100px] animate-pulse" />
         <div className="absolute w-48 h-72 border-y border-dashed border-[#22D3EE]/20 rounded-[80px]" />
         
         {/* Torso/Body approximation points */}
         <div className="absolute w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_10px_#22C55E] top-1/4 left-1/3" />
         <div className="absolute w-2 h-2 rounded-full bg-[#3B82F6] shadow-[0_0_10px_#3B82F6] top-1/4 right-1/3" />
         <div className="absolute w-2 h-2 rounded-full bg-[#EF4444] shadow-[0_0_10px_#EF4444] top-1/2 left-1/2 -translate-x-1/2" />
         
         {/* Labels */}
         <div className="absolute top-1/4 -left-4 flex items-center gap-2">
            <div className="w-12 h-px bg-[#22C55E]/50" />
            <span className="text-[8px] text-[#22C55E] font-mono uppercase">+2.4% Mass</span>
         </div>
         <div className="absolute top-1/2 -right-4 flex items-center gap-2">
            <span className="text-[8px] text-[#EF4444] font-mono uppercase">Fatigue Detected</span>
            <div className="w-12 h-px bg-[#EF4444]/50" />
         </div>
      </div>

      <div className="w-full flex items-center justify-between mt-4 relative z-10 p-3 rounded-xl bg-black/40 border border-white/5">
         <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-v2-soft-gray font-bold">Simulated Projection</span>
            <span className="text-xs font-black text-white">Month 3 Physique</span>
         </div>
         <button className="px-3 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] transition-colors text-[9px] font-bold uppercase tracking-widest text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            Replay
         </button>
      </div>
    </div>
  );
}
