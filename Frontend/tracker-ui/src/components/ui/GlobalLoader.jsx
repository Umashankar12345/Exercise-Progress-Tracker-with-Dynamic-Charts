import React from 'react';
import { Zap } from 'lucide-react';

export default function GlobalLoader({ fullScreen = false, text = "Loading Data..." }) {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen bg-[#050816]' : 'w-full h-64'} gap-6`}>
      <div className="relative flex items-center justify-center">
        {/* Outer rotating multi-color ring */}
        <div className="absolute inset-0 w-24 h-24 -m-4 rounded-full border-t-2 border-r-2 border-transparent border-t-cyan-400 border-r-blue-500 animate-spin" style={{ animationDuration: '1.5s' }} />
        <div className="absolute inset-0 w-24 h-24 -m-4 rounded-full border-b-2 border-l-2 border-transparent border-b-[#10B981] border-l-[#8B5CF6] animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
        
        {/* Inner pulse ring */}
        <div className="absolute inset-0 w-20 h-20 -m-2 rounded-full bg-cyan-500/10 animate-ping" style={{ animationDuration: '3s' }} />

        {/* Center Logo */}
        <div className="relative z-10 w-16 h-16 bg-gradient-to-tr from-[#0F172A] to-[#1E293B] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.15)] border border-white/10">
          <Zap className="w-8 h-8 text-cyan-400 fill-cyan-400 animate-pulse" />
        </div>
      </div>
      
      {/* Brand Text */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-lg font-black tracking-widest text-white uppercase flex items-center gap-1">
          Fit<span className="text-cyan-400">Track</span> AI
        </span>
        <span className="text-[10px] text-v2-soft-gray uppercase tracking-[0.3em] font-bold animate-pulse">
          {text}
        </span>
      </div>
    </div>
  );
}
