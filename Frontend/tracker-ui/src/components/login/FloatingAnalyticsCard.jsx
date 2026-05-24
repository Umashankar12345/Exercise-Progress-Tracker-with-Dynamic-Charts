import React, { useState, useEffect } from 'react';
import { Heart, Flame, Zap } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export default function FloatingAnalyticsCard() {
  const [bpm, setBpm] = useState(128);
  const [data, setData] = useState(Array.from({ length: 15 }, (_, i) => ({ val: 120 + Math.random() * 15 })));

  useEffect(() => {
    const int = setInterval(() => {
      const newBpm = 120 + Math.floor(Math.random() * 15);
      setBpm(newBpm);
      setData(prev => [...prev.slice(1), { val: newBpm }]);
    }, 1500);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="absolute top-12 left-12 w-64 p-4 rounded-2xl bg-[#0F172A]/70 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-4 duration-1000 z-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <Heart className="w-4 h-4 text-[#EC4899]" />
            <div className="absolute inset-0 bg-[#EC4899] rounded-full blur-[8px] opacity-50 animate-pulse" />
          </div>
          <span className="text-xs font-black text-white tracking-widest uppercase">Live Vitals</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
          <span className="text-[9px] font-bold text-[#00F5FF] uppercase tracking-widest">Active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">BPM</div>
          <div className="text-2xl font-black text-white flex items-baseline gap-1">
            {bpm}
          </div>
        </div>
        <div className="border-l border-white/10 pl-4">
          <div className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest flex items-center gap-1">
            <Flame className="w-3 h-3 text-[#EC4899]" /> Cals
          </div>
          <div className="text-lg font-black text-white">426</div>
        </div>
      </div>

      <div className="h-12 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
            <Line type="monotone" dataKey="val" stroke="#00F5FF" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#22D3EE]" />
          <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">Recovery</span>
        </div>
        <span className="text-xs font-black text-[#22D3EE]">82%</span>
      </div>
    </div>
  );
}
