import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Flame } from 'lucide-react';

export default function StreakRing() {
  const percent = 92;
  const data = [
    { name: 'Active', value: percent },
    { name: 'Rest', value: 100 - percent },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius="75%" outerRadius="95%"
            startAngle={225} endAngle={-45}
            dataKey="value" stroke="none"
          >
            <Cell fill="#EC4899" />
            <Cell fill="rgba(255,255,255,0.05)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Flame className="w-6 h-6 text-v2-pink mb-1 animate-pulse" />
        <span className="text-2xl font-black text-white">42</span>
        <span className="text-[9px] uppercase tracking-widest text-v2-soft-gray font-bold">Days</span>
      </div>
    </div>
  );
}
