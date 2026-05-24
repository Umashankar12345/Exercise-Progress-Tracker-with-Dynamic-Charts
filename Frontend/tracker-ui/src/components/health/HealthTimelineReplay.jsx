import React, { useState, useEffect } from 'react';
import { Play, Pause, Clock } from 'lucide-react';

export default function HealthTimelineReplay() {
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0); // 0 to 2400 (representing 24 hours)

  useEffect(() => {
    let int;
    if (playing) {
      int = setInterval(() => {
        setTime(t => (t >= 2400 ? 0 : t + 20));
      }, 50);
    }
    return () => clearInterval(int);
  }, [playing]);

  const displayHour = Math.floor(time / 100).toString().padStart(2, '0');
  const displayMin = (time % 100).toString().padStart(2, '0');

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setPlaying(!playing)} className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center hover:bg-[#2563EB] transition-colors shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            {playing ? <Pause className="w-4 h-4 text-white fill-current" /> : <Play className="w-4 h-4 text-white fill-current ml-0.5" />}
          </button>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold tracking-widest text-v2-soft-gray">Time</span>
            <span className="text-sm font-black text-white font-mono">{displayHour}:{displayMin}</span>
          </div>
        </div>
        <Clock className="w-5 h-5 text-v2-soft-gray" />
      </div>

      <div className="relative w-full h-2 bg-white/10 rounded-full mb-3 cursor-pointer">
        <div className="absolute h-full bg-gradient-to-r from-[#00F5FF] to-[#3B82F6] rounded-full shadow-[0_0_8px_rgba(0,245,255,0.5)]" style={{ width: `${(time / 2400) * 100}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#3B82F6] rounded-full shadow-lg" style={{ left: `calc(${(time / 2400) * 100}% - 6px)` }} />
      </div>
      
      <div className="flex justify-between text-[8px] text-v2-soft-gray uppercase font-bold tracking-widest">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>11 PM</span>
      </div>
    </div>
  );
}
