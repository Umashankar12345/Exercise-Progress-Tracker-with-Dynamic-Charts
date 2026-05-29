import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function CaloriesAreaChart() {
  const [data, setData] = useState(
    Array.from({ length: 20 }, (_, i) => ({ time: i, cal: 100 + Math.random() * 20 }))
  );

  useEffect(() => {
    const int = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1)];
        next.push({ time: next[next.length - 1].time + 1, cal: 100 + Math.random() * 50 });
        return next;
      });
    }, 1500);
    return () => clearInterval(int);
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EC4899" stopOpacity={0.5}/>
            <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="time" hide />
        <YAxis hide domain={['auto', 'auto']} />
        <Area type="monotone" dataKey="cal" stroke="#EC4899" strokeWidth={2} fillOpacity={1} fill="url(#calGrad)" isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
