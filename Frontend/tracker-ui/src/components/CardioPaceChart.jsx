import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Activity, Clock, Compass } from 'lucide-react';

export default function CardioPaceChart({ sets = [] }) {
  // Map cardio sets data
  const chartData = useMemo(() => {
    return sets
      .filter(s => s.type === 'cardio' && s.distance && s.duration_seconds)
      .map((s, idx) => {
        const distanceKm = parseFloat(s.distance) || 0;
        const durationMin = (parseInt(s.duration_seconds) || 0) / 60;
        
        // Pace: minutes per km (min/km)
        const pace = distanceKm > 0 ? durationMin / distanceKm : 0;
        // Speed: km/h
        const speed = durationMin > 0 ? (distanceKm / (durationMin / 60)) : 0;

        return {
          index: `Set ${idx + 1}`,
          distance: distanceKm,
          duration: durationMin,
          pace: parseFloat(pace.toFixed(2)),
          speed: parseFloat(speed.toFixed(1)),
        };
      });
  }, [sets]);

  const avgPace = useMemo(() => {
    if (chartData.length === 0) return '0:00';
    const sum = chartData.reduce((acc, d) => acc + d.pace, 0);
    const avg = sum / chartData.length;
    const mins = Math.floor(avg);
    const secs = Math.round((avg - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')} /km`;
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-surface-container border border-outline-variant text-center space-y-4">
        <Compass className="w-10 h-10 text-on-surface-variant/40 mx-auto animate-pulse" />
        <h4 className="text-sm font-bold text-on-surface">No Cardio Analytics</h4>
        <p className="text-xs text-on-surface-variant max-w-[240px] mx-auto">
          Cardio sets logged with distance & duration parameters will populate split pace area charts.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 border border-secondary/20 rounded-xl">
            <Activity className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-on-surface">Cardio Pace Analytics</h3>
            <p className="text-xs text-on-surface-variant">Pace split & velocity chart per session set</p>
          </div>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-black text-on-surface-variant uppercase">Average Pace</span>
          <span className="text-lg font-black text-secondary">{avgPace}</span>
        </div>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="paceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
            <XAxis 
              dataKey="index" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#8c909f', fontSize: 11, fontWeight: 500 }} 
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#8c909f', fontSize: 11, fontWeight: 500 }} 
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#8c909f', fontSize: 11, fontWeight: 500 }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '12px' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="pace" 
              name="Pace (min/km)"
              stroke="#10b981" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#paceGradient)" 
            />
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="speed" 
              name="Speed (km/h)"
              stroke="#3b82f6" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#speedGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
