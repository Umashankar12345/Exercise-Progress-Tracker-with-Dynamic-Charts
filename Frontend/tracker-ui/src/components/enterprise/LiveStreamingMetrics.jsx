import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Flame, Zap } from 'lucide-react';

export default function LiveStreamingMetrics() {
  const [data, setData] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      time: i,
      bpm: 70 + Math.random() * 10,
      calories: 5 + Math.random() * 2,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)];
        const last = newData[newData.length - 1];
        newData.push({
          time: last.time + 1,
          bpm: 110 + Math.random() * 40, // Simulating active workout HR
          calories: last.calories + Math.random() * 3,
        });
        return newData;
      });
    }, 2000); // Polling every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* BPM Stream */}
      <div className="glass-card p-6 border border-zinc-800/60 bg-zinc-900/40 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-red-400">Live Stream</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-red-500/10 rounded-xl text-red-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-widest uppercase">Real-Time BPM</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">Hardware telemetry active</p>
          </div>
        </div>
        
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} width={30} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                labelStyle={{ display: 'none' }}
              />
              <Line 
                type="monotone" 
                dataKey="bpm" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={false}
                isAnimationActive={false} // Disable to make stream look realistic without bubbling
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calories Stream */}
      <div className="glass-card p-6 border border-zinc-800/60 bg-zinc-900/40 relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-widest uppercase">Energy Expenditure</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">Calculated burn rate</p>
          </div>
        </div>

        <div className="h-[140px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} width={30} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                labelStyle={{ display: 'none' }}
              />
              <Area type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorCal)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
