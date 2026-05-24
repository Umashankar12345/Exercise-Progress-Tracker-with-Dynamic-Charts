import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Flame } from 'lucide-react';
import api from '../../api/axios';

const FALLBACK = [
  { name: 'Mon', kcal: 0 },
  { name: 'Tue', kcal: 0 },
  { name: 'Wed', kcal: 0 },
  { name: 'Thu', kcal: 0 },
  { name: 'Fri', kcal: 0 },
  { name: 'Sat', kcal: 0 },
  { name: 'Sun', kcal: 0 },
];

const DAY_MAP = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
  Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun'
};

export default function CaloriesBurnedChart() {
  const [data, setData] = useState(FALLBACK);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    api.get('/workout-analytics').then(res => {
      const weekly = res.data.weekly || [];
      if (weekly.length > 0) {
        const mapped = weekly.map(w => ({
          name: DAY_MAP[w.day] || w.day,
          kcal: w.calories || 0,
        }));
        setData(mapped);
      }
      setTotalCalories(res.data.total_calories || 0);
    }).catch(() => {});
  }, []);

  const maxKcal = Math.max(...data.map(d => d.kcal), 1);

  return (
    <div className="w-full h-[300px] rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 relative overflow-hidden backdrop-blur-xl group hover:-translate-y-1 hover:border-[#EF4444]/30 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#EF4444] opacity-10 blur-[50px] rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
           <h3 className="text-sm font-black text-white uppercase tracking-widest">Energy Expenditure</h3>
           <p className="text-[10px] text-[#EF4444] uppercase tracking-widest font-bold">
             Total: {totalCalories.toLocaleString()} kcal
           </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center border border-[#EF4444]/30">
           <Flame className="w-4 h-4 text-[#EF4444]" />
        </div>
      </div>

      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(239,68,68,0.3)', borderRadius: '12px' }}
              itemStyle={{ color: '#EF4444', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Bar dataKey="kcal" radius={[6, 6, 6, 6]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.kcal === maxKcal ? '#EF4444' : 'rgba(239,68,68,0.3)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
