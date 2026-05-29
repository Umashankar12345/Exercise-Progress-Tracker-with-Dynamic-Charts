import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function WorkoutPieChart() {
  const data = [
    { name: 'Strength', value: 60 },
    { name: 'Cardio', value: 25 },
    { name: 'Mobility', value: 15 },
  ];
  const COLORS = ['#8B5CF6', '#00F5FF', '#EC4899'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%" cy="50%"
          innerRadius="50%" outerRadius="80%"
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#8B5CF6', borderRadius: '8px' }}
          itemStyle={{ color: '#E2E8F0' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
