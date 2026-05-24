import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function RecoveryGraph() {
  const data = [
    { day: 'M', hrv: 45 },
    { day: 'T', hrv: 50 },
    { day: 'W', hrv: 35 },
    { day: 'T', hrv: 40 },
    { day: 'F', hrv: 55 },
    { day: 'S', hrv: 65 },
    { day: 'S', hrv: 70 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <ReferenceLine y={40} stroke="#94A3B8" strokeDasharray="3 3" />
        <Tooltip
          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#EC4899', borderRadius: '8px' }}
        />
        <Area type="monotone" dataKey="hrv" stroke="#EC4899" strokeWidth={3} fillOpacity={1} fill="url(#hrvGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
