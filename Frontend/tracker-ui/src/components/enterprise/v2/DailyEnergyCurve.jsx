import React from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DailyEnergyCurve() {
  const data = [
    { time: '6A', energy: 30 },
    { time: '9A', energy: 80 },
    { time: '12P', energy: 95 },
    { time: '3P', energy: 60 },
    { time: '6P', energy: 40 },
    { time: '9P', energy: 20 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#00F5FF', borderRadius: '8px' }}
          itemStyle={{ color: '#00F5FF' }}
        />
        <Line type="natural" dataKey="energy" stroke="#00F5FF" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
