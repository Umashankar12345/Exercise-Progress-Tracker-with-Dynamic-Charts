import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function WorkoutFrequencyHistogram() {
  const data = [
    { hour: '5A', count: 2 },
    { hour: '6A', count: 15 },
    { hour: '7A', count: 24, isMax: true },
    { hour: '8A', count: 12 },
    { hour: '9A', count: 4 },
    { hour: '5P', count: 8 },
    { hour: '6P', count: 18 },
    { hour: '7P', count: 14 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="hour" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#8B5CF6', borderRadius: '8px' }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.isMax ? '#8B5CF6' : '#424754'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
