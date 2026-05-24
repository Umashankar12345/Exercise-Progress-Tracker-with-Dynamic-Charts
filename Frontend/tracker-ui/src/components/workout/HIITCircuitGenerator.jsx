import React, { useState, useEffect } from 'react';
import { Timer, Zap } from 'lucide-react';

export default function HIITCircuitGenerator() {
  const [active, setActive] = useState(true);
  const [phase, setPhase] = useState('WORK'); // WORK | REST
  const [time, setTime] = useState(40); // 40s work, 20s rest
  
  useEffect(() => {
    let int;
    if (active) {
      int = setInterval(() => {
        setTime(t => {
          if (t <= 1) {
            setPhase(p => p === 'WORK' ? 'REST' : 'WORK');
            return phase === 'WORK' ? 20 : 40; // Next phase time
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(int);
  }, [active, phase]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <div className="absolute top-2 left-2 flex items-center gap-1">
        <div className="text-[10px] uppercase font-bold text-v2-soft-gray tracking-widest">Round 3/5</div>
      </div>
      
      <div className={`w-32 h-32 rounded-full border-[6px] flex flex-col items-center justify-center transition-colors duration-500 ${
        phase === 'WORK' ? 'border-[#EC4899] shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'border-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.3)]'
      }`}>
        <span className="text-4xl font-black text-white">{time}</span>
        <span className={`text-[10px] uppercase font-bold tracking-widest ${phase === 'WORK' ? 'text-[#EC4899]' : 'text-[#00F5FF]'}`}>
          {phase}
        </span>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <span className="text-xs font-bold text-white mb-1">{phase === 'WORK' ? 'Kettlebell Swings' : 'Active Recovery'}</span>
        <span className="text-[9px] text-v2-soft-gray uppercase tracking-widest">Next: Burpees</span>
      </div>
    </div>
  );
}
