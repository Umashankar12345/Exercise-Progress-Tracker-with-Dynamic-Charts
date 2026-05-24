import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function WeeklyPerformanceBar() {
  const data = [
    { day: 'M', vol: 12000 },
    { day: 'T', vol: 15000 },
    { day: 'W', vol: 8000 },
    { day: 'T', vol: 18000, isPR: true },
    { day: 'F', vol: 14000 },
    { day: 'S', vol: 20000 },
    { day: 'S', vol: 5000 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip
          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#00F5FF', borderRadius: '8px' }}
          itemStyle={{ color: '#00F5FF' }}
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
        />
        <Bar dataKey="vol" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.isPR ? '#00F5FF' : '#424754'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
