import React, { useState, useEffect } from 'react';
import { Heart, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

export default function HeartRateTracker() {
  const [bpm, setBpm] = useState(68);
  const [data, setData] = useState(Array.from({ length: 20 }, (_, i) => ({ val: 65 + Math.random() * 10 })));

  useEffect(() => {
    const int = setInterval(() => {
      const next = 60 + Math.floor(Math.random() * 20);
      setBpm(next);
      setData(prev => [...prev.slice(1), { val: next }]);
    }, 1500);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">Current</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white">{bpm}</span>
            <span className="text-xs font-bold text-[#EC4899]">BPM</span>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <Heart className="w-6 h-6 text-[#EC4899] drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" fill="currentColor" />
          <div className="absolute inset-0 bg-[#EC4899] rounded-full blur-[10px] opacity-40 animate-pulse" />
        </div>
      </div>
      
      <div className="h-24 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
            <Area type="monotone" dataKey="val" stroke="#EC4899" strokeWidth={2} fillOpacity={1} fill="url(#colorBpm)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-1.5 p-1.5 mt-2 rounded bg-white/5 border border-white/5 w-max">
        <Activity className="w-3 h-3 text-v2-soft-gray" />
        <span className="text-[9px] text-v2-soft-gray font-bold uppercase tracking-widest">Resting: 58 BPM</span>
      </div>
    </div>
  );
}
