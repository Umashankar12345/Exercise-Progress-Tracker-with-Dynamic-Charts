import React, { useState, useEffect } from 'react';
import { Wind } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export default function OxygenLevelMonitor() {
  const [spo2, setSpo2] = useState(98);
  const [data, setData] = useState(Array.from({ length: 15 }, () => ({ val: 97 + Math.random() * 3 })));

  useEffect(() => {
    const int = setInterval(() => {
      const next = 96 + Math.floor(Math.random() * 4);
      setSpo2(next);
      setData(prev => [...prev.slice(1), { val: next }]);
    }, 3000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">Blood Oxygen</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#00F5FF] drop-shadow-[0_0_10px_rgba(0,245,255,0.4)]">{spo2}%</span>
          </div>
        </div>
        <Wind className="w-5 h-5 text-[#00F5FF]" />
      </div>
      
      <div className="h-16 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis domain={[90, 100]} hide />
            <Line type="stepAfter" dataKey="val" stroke="#00F5FF" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-[9px] text-v2-soft-gray font-medium">
        Healthy range detected. Your SpO2 is optimal.
      </div>
    </div>
  );
}
