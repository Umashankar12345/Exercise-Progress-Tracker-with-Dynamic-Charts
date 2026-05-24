import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';

export default function GoalGauge() {
  const value = 82; // 82% completion
  const data = [
    { name: 'Completed', value: value },
    { name: 'Remaining', value: 100 - value },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="80%"
            startAngle={180} endAngle={0}
            innerRadius="70%" outerRadius="90%"
            dataKey="value" stroke="none"
          >
            <Cell fill="#22D3EE" />
            <Cell fill="rgba(255,255,255,0.05)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-4 flex flex-col items-center justify-center">
        <Target className="w-4 h-4 text-v2-cyan mb-1" />
        <span className="text-xl font-black text-white">{value}%</span>
        <span className="text-[9px] uppercase tracking-widest text-v2-soft-gray font-bold">Confidence</span>
      </div>
    </div>
  );
}
