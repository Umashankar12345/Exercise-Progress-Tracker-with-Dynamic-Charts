import React, { useState, useEffect } from 'react';
import { Activity, Zap } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function StressMonitoring() {
  const [data, setData] = useState(Array.from({ length: 20 }, (_, i) => ({ val: 30 + Math.random() * 20 })));
  const [stressLevel, setStressLevel] = useState('Low');

  useEffect(() => {
    const int = setInterval(() => {
      const next = 20 + Math.random() * 40;
      setStressLevel(next > 50 ? 'Medium' : 'Low');
      setData(prev => [...prev.slice(1), { val: next }]);
    }, 2000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">Real-Time Stress</span>
          <span className={`text-xl font-black ${stressLevel === 'Low' ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>{stressLevel}</span>
        </div>
        <Zap className={`w-5 h-5 ${stressLevel === 'Low' ? 'text-[#10B981]' : 'text-[#F59E0B]'}`} />
      </div>

      <div className="h-20 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stressLevel === 'Low' ? '#10B981' : '#F59E0B'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={stressLevel === 'Low' ? '#10B981' : '#F59E0B'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="val" stroke={stressLevel === 'Low' ? '#10B981' : '#F59E0B'} strokeWidth={2} fillOpacity={1} fill="url(#colorStress)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Activity className="w-3 h-3 text-v2-soft-gray" />
        <span className="text-[9px] text-v2-soft-gray font-medium">HRV is stable at 65ms</span>
      </div>
    </div>
  );
}
