import React, { useState, useEffect } from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function HeartRateLiveChart() {
  const [data, setData] = useState(
    Array.from({ length: 30 }, (_, i) => ({ time: i, bpm: 60 + Math.random() * 15 }))
  );

  useEffect(() => {
    const int = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1)];
        next.push({ time: next[next.length - 1].time + 1, bpm: 120 + Math.random() * 45 });
        return next;
      });
    }, 1000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 right-0 flex items-center gap-1 z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-v2-pink animate-ping" />
        <span className="text-[10px] font-bold text-v2-pink uppercase tracking-widest">Live</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#EC4899', borderRadius: '8px' }}
            itemStyle={{ color: '#EC4899' }}
            cursor={false}
          />
          <Line 
            type="step" 
            dataKey="bpm" 
            stroke="#EC4899" 
            strokeWidth={2} 
            dot={false}
            isAnimationActive={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
