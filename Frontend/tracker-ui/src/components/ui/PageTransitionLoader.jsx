import React from 'react';
import { Loader2 } from 'lucide-react';

export default function PageTransitionLoader({ visible }) {
  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 z-[8000] flex items-center justify-center bg-[#070B14]/40 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto"
      style={{
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {/* Visual background blur mesh */}
      <div className="absolute top-[30%] left-[30%] w-[300px] h-[300px] bg-[#7C3AED]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[30%] right-[30%] w-[300px] h-[300px] bg-[#00E5FF]/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Cybernetic Loading Badge */}
      <div className="px-6 py-4 rounded-3xl bg-[#0F172A]/70 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl flex items-center gap-4 animate-in zoom-in-95 duration-200">
        {/* Glow point */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#7C3AED]/20 to-[#00E5FF]/20 rounded-3xl -z-10 blur-sm pointer-events-none" />

        {/* Spinner */}
        <div className="relative">
          <Loader2 className="w-5 h-5 text-[#7C3AED] animate-spin" />
          <div className="absolute inset-0 text-[#00E5FF] opacity-30 animate-pulse blur-md w-5 h-5" />
        </div>
        
        {/* Texts */}
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
            Processing Link
          </span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Loading FitTrack Nodes...
          </span>
        </div>
      </div>
    </div>
  );
}
