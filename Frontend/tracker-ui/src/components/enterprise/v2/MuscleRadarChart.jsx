import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function MuscleRadarChart() {
  const data = [
    { subject: 'Chest', A: 85, fullMark: 100 },
    { subject: 'Back', A: 90, fullMark: 100 },
    { subject: 'Legs', A: 70, fullMark: 100 },
    { subject: 'Core', A: 80, fullMark: 100 },
    { subject: 'Arms', A: 95, fullMark: 100 },
    { subject: 'Shoulders', A: 65, fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#424754" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="Volume" dataKey="A" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.4} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#22D3EE', borderRadius: '8px' }}
          itemStyle={{ color: '#22D3EE' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
