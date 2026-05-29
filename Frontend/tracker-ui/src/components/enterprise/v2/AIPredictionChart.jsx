import React from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AIPredictionChart() {
  const data = [
    { month: 'Jan', actual: 80, predMin: 80, predMax: 80 },
    { month: 'Feb', actual: 82, predMin: 82, predMax: 82 },
    { month: 'Mar', actual: 85, predMin: 85, predMax: 85 },
    { month: 'Apr', actual: null, predMin: 86, predMax: 89, predAvg: 87.5 },
    { month: 'May', actual: null, predMin: 87, predMax: 93, predAvg: 90 },
    { month: 'Jun', actual: null, predMin: 89, predMax: 97, predAvg: 93 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis domain={['auto', 'auto']} hide />
        <Tooltip
          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#00F5FF', borderRadius: '8px' }}
          itemStyle={{ color: '#00F5FF' }}
        />
        <Area type="monotone" dataKey="predMax" stroke="none" fill="#00F5FF" fillOpacity={0.1} />
        <Area type="monotone" dataKey="predMin" stroke="none" fill="#050816" fillOpacity={1} />
        <Line type="monotone" dataKey="actual" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="predAvg" stroke="#00F5FF" strokeWidth={2} strokeDasharray="5 5" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
