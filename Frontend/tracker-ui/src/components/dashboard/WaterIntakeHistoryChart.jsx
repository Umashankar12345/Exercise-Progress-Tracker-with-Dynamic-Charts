import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Droplet } from 'lucide-react';
import api from '../../api/axios';
import useStore from '../../store/useStore';

export default function WaterIntakeHistoryChart() {
  const { user } = useStore();
  const waterGoal = user?.water_goal || 3.5;
  const [data, setData] = useState([]);
  const [avgWater, setAvgWater] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/health-dashboard');
        const weeklyRaw = res.data.weekly || [];
        
        if (weeklyRaw.length > 0) {
          const mapped = weeklyRaw.map(w => {
            const waterVal = parseFloat(w.water_intake) || 0;
            return {
              day: w.day.charAt(0), // Take first letter of day (e.g. M, T, W)
              liters: waterVal
            };
          });
          setData(mapped);
          
          const sum = weeklyRaw.reduce((acc, curr) => acc + (parseFloat(curr.water_intake) || 0), 0);
          setAvgWater(Number((sum / weeklyRaw.length).toFixed(1)));
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Failed to load weekly water history:", err);
      }
    };
    fetchHistory();

    window.addEventListener('health-data-updated', fetchHistory);
    return () => {
      window.removeEventListener('health-data-updated', fetchHistory);
    };
  }, []);

  const maxLiters = Math.max(...data.map(d => d.liters), 1);

  return (
    <div className="w-full h-[330px] rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 relative overflow-hidden backdrop-blur-xl group hover:-translate-y-1 hover:border-[#0EA5E9]/30 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0EA5E9] opacity-10 blur-[50px] rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
           <h3 className="text-sm font-black text-white uppercase tracking-widest pt-1 leading-normal">Weekly Hydration</h3>
           <p className="text-[10px] text-[#0EA5E9] uppercase tracking-widest font-bold">
             7-Day Average: {avgWater}L / Goal: {waterGoal}L
           </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center border border-[#0EA5E9]/30">
           <Droplet className="w-4 h-4 text-[#0EA5E9]" />
        </div>
      </div>

      <div className="w-full h-[180px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(14,165,233,0.3)', borderRadius: '12px' }}
                itemStyle={{ color: '#0EA5E9', fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}
              />
              <Bar dataKey="liters" radius={[6, 6, 6, 6]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.liters >= waterGoal ? '#00F5A0' : (entry.liters === maxLiters ? '#0EA5E9' : 'rgba(14,165,233,0.3)')} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-v2-soft-gray border border-white/5 rounded-2xl bg-white/[0.02]">
            <Droplet className="w-8 h-8 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">No Data Available</span>
          </div>
        )}
      </div>
    </div>
  );
}
