import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

export default function SmartRestTimer() {
  const [rest, setRest] = useState(90);

  useEffect(() => {
    const int = setInterval(() => {
      setRest(r => (r > 0 ? r - 1 : 90));
    }, 1000);
    return () => clearInterval(int);
  }, []);

  const progress = ((90 - rest) / 90) * 100;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <svg className="absolute w-32 h-32 -rotate-90">
        <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <circle 
          cx="64" cy="64" r="60" 
          fill="none" 
          stroke="#00F5FF" 
          strokeWidth="4" 
          strokeDasharray="377" 
          strokeDashoffset={377 - (377 * progress) / 100}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear shadow-[0_0_10px_#00F5FF]" 
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="text-3xl font-black text-white">{rest}s</span>
        <span className="text-[10px] text-v2-soft-gray uppercase tracking-widest font-bold">Rest</span>
      </div>
      <div className="absolute bottom-4 flex items-center gap-1.5 p-1.5 rounded-full bg-[#0F172A] border border-[#00F5FF]/20">
        <Activity className="w-3 h-3 text-[#00F5FF]" />
        <span className="text-[8px] font-bold text-[#00F5FF] uppercase tracking-widest">HR: 112 BPM</span>
      </div>
    </div>
  );
}
