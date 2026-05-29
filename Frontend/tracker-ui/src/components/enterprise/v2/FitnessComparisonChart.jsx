import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function FitnessComparisonChart() {
  const data = [
    { metric: 'Vol', you: 15000, avg: 12000 },
    { metric: 'Freq', you: 5, avg: 3 },
    { metric: 'Str', you: 85, avg: 70 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis dataKey="metric" type="category" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#8B5CF6', borderRadius: '8px' }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', color: '#94A3B8' }} />
        <Bar dataKey="you" name="You" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={12} />
        <Bar dataKey="avg" name="Community" fill="#424754" radius={[0, 4, 4, 0]} barSize={12} />
      </BarChart>
    </ResponsiveContainer>
  );
}
