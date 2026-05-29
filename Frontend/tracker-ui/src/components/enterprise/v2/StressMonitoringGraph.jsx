import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function StressMonitoringGraph() {
  const data = [
    { time: 'M', stress: 45, bpm: 65 },
    { time: 'T', stress: 80, bpm: 85 },
    { time: 'W', stress: 60, bpm: 72 },
    { time: 'T', stress: 90, bpm: 95 },
    { time: 'F', stress: 50, bpm: 68 },
    { time: 'S', stress: 30, bpm: 60 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide yAxisId="left" />
        <YAxis hide yAxisId="right" orientation="right" />
        <Tooltip
          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#EC4899', borderRadius: '8px' }}
        />
        <Bar yAxisId="left" dataKey="stress" fill="#EC4899" fillOpacity={0.4} radius={[4, 4, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="bpm" stroke="#EC4899" strokeWidth={2} dot={{ r: 4, fill: '#050816' }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
