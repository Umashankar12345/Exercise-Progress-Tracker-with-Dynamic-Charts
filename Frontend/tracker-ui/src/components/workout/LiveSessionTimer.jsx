import React, { useState, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';

export default function LiveSessionTimer() {
  const [active, setActive] = useState(true);
  const [time, setTime] = useState(3600); // 1 hour

  useEffect(() => {
    let int;
    if (active) {
      int = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(int);
  }, [active]);

  const format = (t) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative mb-6">
        <div className="text-5xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(0,245,255,0.3)]">
          {format(time)}
        </div>
        <div className="absolute -top-4 -right-4 flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${active ? 'bg-[#00F5FF] animate-pulse' : 'bg-v2-soft-gray'}`} />
          <span className="text-[8px] uppercase tracking-widest font-bold text-[#00F5FF]">{active ? 'Live' : 'Paused'}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
          <Square className="w-4 h-4 text-v2-soft-gray" />
        </button>
        <button 
          onClick={() => setActive(!active)} 
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 ${active ? 'bg-[#EC4899] shadow-[0_0_20px_rgba(236,72,153,0.4)]' : 'bg-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.4)]'}`}
        >
          {active ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" fill="currentColor" />}
        </button>
        <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-[10px] font-bold text-v2-soft-gray uppercase">
          Lap
        </button>
      </div>
    </div>
  );
}
