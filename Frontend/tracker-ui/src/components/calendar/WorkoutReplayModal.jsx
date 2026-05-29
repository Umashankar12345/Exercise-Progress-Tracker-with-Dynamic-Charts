import React, { useState, useEffect } from 'react';
import { PlayCircle, Activity, Flame } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function WorkoutReplayModal() {
  const [data, setData] = useState(Array.from({ length: 20 }, (_, i) => ({ val: 110 + Math.random() * 40 })));

  useEffect(() => {
    const int = setInterval(() => {
      setData(prev => [...prev.slice(1), { val: 120 + Math.random() * 60 }]);
    }, 1000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EF4444]/20 flex items-center justify-center border border-[#EF4444]/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <PlayCircle className="w-5 h-5 text-[#EF4444] ml-0.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-v2-soft-gray mb-1">Session Replay</span>
            <span className="text-lg font-black text-white">HIIT Protocol x8</span>
          </div>
        </div>
        <div className="text-right flex flex-col">
          <span className="text-sm font-black text-white flex items-center justify-end gap-1">
             <Flame className="w-3.5 h-3.5 text-[#F97316]" /> 650
          </span>
          <span className="text-[9px] uppercase font-bold tracking-widest text-v2-soft-gray">Kcal</span>
        </div>
      </div>

      <div className="h-28 w-full relative">
        <div className="absolute top-0 left-0 w-full flex justify-between z-10 px-2 pt-1 pointer-events-none">
           <div className="flex items-center gap-1 bg-[#0F172A]/80 px-2 py-0.5 rounded border border-white/5 backdrop-blur-sm">
              <Activity className="w-3 h-3 text-[#EF4444]" />
              <span className="text-[9px] font-bold text-white tracking-widest">168 BPM Max</span>
           </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorReplay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="step" dataKey="val" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorReplay)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
