import React from 'react';
import { User, Activity, Scan } from 'lucide-react';

export default function Avatar3DSystem() {
  return (
    <div className="w-full rounded-2xl border border-[#3B82F6]/30 bg-[#3B82F6]/5 p-5 relative overflow-hidden group h-[500px] flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3B82F6]/10 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#3B82F6]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">3D Bio-Twin</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#3B82F6]/10 px-2 py-1 rounded border border-[#3B82F6]/30">
           <Scan className="w-3 h-3 text-[#3B82F6]" />
           <span className="text-[9px] text-[#3B82F6] font-bold uppercase tracking-widest">Syncing</span>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center z-10 w-full perspective-1000">
         {/* Hologram Rings */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-16 border-2 border-[#3B82F6]/30 rounded-[100%] rotate-x-[60deg] animate-pulse" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-56 h-20 border-2 border-[#22D3EE]/20 rounded-[100%] rotate-x-[60deg] animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" />
         
         {/* Wireframe Body Stand-in */}
         <div className="relative w-32 h-64 flex flex-col items-center">
            {/* Head */}
            <div className="w-10 h-14 border border-[#3B82F6]/50 rounded-[40%] bg-[#3B82F6]/10 shadow-[0_0_20px_#3B82F6] backdrop-blur-sm" />
            {/* Torso */}
            <div className="w-20 h-28 border border-[#3B82F6]/50 rounded-[20%] mt-2 bg-[#3B82F6]/5 shadow-[0_0_15px_#3B82F6] relative overflow-hidden">
               {/* Core mapping lines */}
               <div className="absolute top-1/2 w-full h-px bg-[#22D3EE]/30" />
               <div className="absolute left-1/2 w-px h-full bg-[#22D3EE]/30" />
            </div>
            {/* Legs */}
            <div className="flex gap-2 mt-2">
               <div className="w-6 h-24 border border-[#3B82F6]/50 rounded-[30%] bg-[#3B82F6]/5" />
               <div className="w-6 h-24 border border-[#3B82F6]/50 rounded-[30%] bg-[#3B82F6]/5" />
            </div>
         </div>

         {/* Holographic Target Lines */}
         <div className="absolute top-1/3 left-1/4 w-12 h-px bg-[#22D3EE]/50" />
         <span className="absolute top-1/3 left-10 text-[8px] text-[#22D3EE] font-mono uppercase tracking-widest">+1.2kg Mass</span>
         
         <div className="absolute bottom-1/3 right-1/4 w-12 h-px bg-[#22C55E]/50" />
         <span className="absolute bottom-1/3 right-4 text-[8px] text-[#22C55E] font-mono uppercase tracking-widest">-4% Body Fat</span>
      </div>

      <div className="w-full flex items-center justify-between p-3 rounded-xl bg-black/40 border border-[#3B82F6]/20 relative z-10 backdrop-blur-md">
         <div className="flex flex-col">
            <span className="text-[9px] text-[#3B82F6] uppercase tracking-widest font-bold">Prediction Engine</span>
            <span className="text-xs font-black text-white">Day 90 Shape</span>
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-v2-soft-gray uppercase tracking-widest">
            <span>Confidence:</span>
            <span className="text-[#22C55E]">92%</span>
         </div>
      </div>
    </div>
  );
}
