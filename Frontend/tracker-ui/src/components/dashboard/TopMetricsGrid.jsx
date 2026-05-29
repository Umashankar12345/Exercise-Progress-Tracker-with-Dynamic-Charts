import React from 'react';
import { Activity, Flame, Route, Droplets, Moon, Timer } from 'lucide-react';

export default function TopMetricsGrid({ data }) {
  if (!data) return null;

  const metrics = [
    { title: 'Steps Today', value: data.steps?.toLocaleString() || '0', unit: 'steps', icon: <Activity className="w-5 h-5 text-emerald-400" />, color: 'bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Calories Burned', value: data.calories?.toLocaleString() || '0', unit: 'kcal', icon: <Flame className="w-5 h-5 text-orange-400" />, color: 'bg-orange-500/10 border-orange-500/20' },
    { title: 'Distance', value: data.distance || '0', unit: 'km', icon: <Route className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/10 border-blue-500/20' },
    { title: 'Water Intake', value: data.water || '0', unit: 'L', icon: <Droplets className="w-5 h-5 text-cyan-400" />, color: 'bg-cyan-500/10 border-cyan-500/20' },
    { title: 'Sleep', value: data.sleep || '0', unit: 'hrs', icon: <Moon className="w-5 h-5 text-indigo-400" />, color: 'bg-indigo-500/10 border-indigo-500/20' },
    { title: 'Active Minutes', value: data.active_minutes || '0', unit: 'min', icon: <Timer className="w-5 h-5 text-rose-400" />, color: 'bg-rose-500/10 border-rose-500/20' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric, idx) => (
        <div key={idx} className={`rounded-2xl p-4 border ${metric.color} backdrop-blur-md flex flex-col justify-between min-h-[120px]`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider">{metric.title}</h4>
            {metric.icon}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{metric.value}</span>
            <span className="text-xs font-bold text-white/50">{metric.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
