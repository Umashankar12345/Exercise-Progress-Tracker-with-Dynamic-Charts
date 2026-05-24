import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Droplet } from 'lucide-react';

export default function WaterIntakeRing() {
  const percent = 75;
  const data = [
    { name: 'Drank', value: percent },
    { name: 'Remaining', value: 100 - percent },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius="70%" outerRadius="90%"
            startAngle={90} endAngle={-270}
            dataKey="value" stroke="none"
          >
            <Cell fill="#22D3EE" />
            <Cell fill="rgba(255,255,255,0.05)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Droplet className="w-5 h-5 text-v2-cyan mb-1" />
        <span className="text-xl font-black text-white">{percent}%</span>
      </div>
    </div>
  );
}
