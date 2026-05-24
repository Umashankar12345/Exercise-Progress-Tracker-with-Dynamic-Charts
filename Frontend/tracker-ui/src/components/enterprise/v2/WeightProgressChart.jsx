import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function WeightProgressChart() {
  const data = [
    { date: 'Mon', weight: 85, aiPred: null },
    { date: 'Tue', weight: 84.8, aiPred: null },
    { date: 'Wed', weight: 84.5, aiPred: null },
    { date: 'Thu', weight: 84.2, aiPred: null },
    { date: 'Fri', weight: 84.0, aiPred: null },
    { date: 'Sat', weight: null, aiPred: 83.8 },
    { date: 'Sun', weight: null, aiPred: 83.5 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#00F5FF', borderRadius: '8px' }}
          itemStyle={{ color: '#00F5FF' }}
        />
        <ReferenceLine y={83} stroke="#EC4899" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Goal: 83kg', fill: '#EC4899', fontSize: 10 }} />
        <Line type="monotone" dataKey="weight" stroke="#00F5FF" strokeWidth={3} dot={{ r: 4, fill: '#050816', strokeWidth: 2 }} />
        <Line type="monotone" dataKey="aiPred" stroke="#8B5CF6" strokeWidth={3} strokeDasharray="5 5" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
