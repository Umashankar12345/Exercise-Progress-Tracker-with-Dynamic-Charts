import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Moon } from 'lucide-react';
import api from '../../api/axios';



export default function SleepRecoveryChart() {
  const [data, setData] = useState([]);
  const [avgSleep, setAvgSleep] = useState(null);

  useEffect(() => {
    const fetchHistory = () => {
      api.get('/health-dashboard').then(res => {
        const sleepHours = res.data.today ? parseFloat(res.data.today.sleep_hours) : null;
        if (sleepHours) setAvgSleep(sleepHours);

        const weeklyRaw = res.data.weekly || [];
        if (weeklyRaw.length > 0) {
          setData(weeklyRaw.map(w => {
              const h = parseFloat(w.sleep_hours) || 0;
              return {
                  day: w.day.charAt(0),
                  hours: h,
                  score: Math.min(Math.round((h / 9) * 100), 100)
              };
          }));
        } else {
          setData([]);
        }
      }).catch(() => {});
    };
    fetchHistory();

    window.addEventListener('health-data-updated', fetchHistory);
    return () => {
      window.removeEventListener('health-data-updated', fetchHistory);
    };
  }, []);

  return (
    <div className="w-full h-[330px] rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 relative overflow-hidden backdrop-blur-xl group hover:-translate-y-1 hover:border-[#3B82F6]/30 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#3B82F6] opacity-10 blur-[50px] rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
           <h3 className="text-sm font-black text-white uppercase tracking-widest pt-1 leading-normal">Sleep vs Recovery</h3>
           <p className="text-[10px] text-[#3B82F6] uppercase tracking-widest font-bold">
             Last night: {avgSleep != null ? `${avgSleep}h` : 'Circadian Rhythm Sync'}
           </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/30">
           <Moon className="w-4 h-4 text-[#3B82F6]" />
        </div>
      </div>

      <div className="w-full h-[180px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" stroke="rgba(255,255,255,0.2)" fontSize={10} domain={[4, 10]} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.2)" fontSize={10} domain={[0, 100]} axisLine={false} tickLine={false} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(59,130,246,0.3)', borderRadius: '12px' }}
                itemStyle={{ color: '#3B82F6', fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}
              />
              <Line yAxisId="left" type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#0F172A', stroke: '#3B82F6', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#3B82F6' }} />
              <Line yAxisId="right" type="monotone" dataKey="score" stroke="#00F5A0" strokeWidth={2} strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 border border-white/5 rounded-2xl bg-white/[0.02]">
            <Moon className="w-8 h-8 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">No Data Available</span>
          </div>
        )}
      </div>
    </div>
  );
}
