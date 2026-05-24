import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useLiveAnalytics from '../../hooks/useLiveAnalytics';

export default function ProgressiveOverloadChart() {
  const [chartData, setChartData] = useState([
    { week: 'W1', weight: 100 },
    { week: 'W2', weight: 105 },
    { week: 'W3', weight: 105 },
    { week: 'W4', weight: 110 },
    { week: 'W5', weight: 115 },
    { week: 'W6', weight: 120 },
  ]);

  const liveData = useLiveAnalytics();

  useEffect(() => {
    if (liveData && liveData.weight !== undefined) {
      const nextWeekLabel = `W${chartData.length + 1}`;
      setChartData(prev => [
        ...prev, 
        { 
          week: liveData.week || nextWeekLabel, 
          weight: Number(liveData.weight) 
        }
      ]);
    }
  }, [liveData]); // eslint-disable-line react-hooks/exhaustive-deps

  const peakWeight = chartData.length > 0 ? Math.max(...chartData.map(d => d.weight)) : 0;

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="flex justify-between items-end mb-4">
        <div className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">Est. 1RM Deadlift</div>
        <div className="text-xl font-black text-[#8B5CF6]">{peakWeight}kg</div>
      </div>
      <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#8B5CF6', borderRadius: '8px' }}
              itemStyle={{ color: '#8B5CF6', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Line type="monotone" dataKey="weight" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: '#050816', strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
