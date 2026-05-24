import React from 'react';
import { HeartPulse, Moon, Zap, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function RecoverySystem() {
  // WHOOP-style recovery metrics
  const recoveryScore = 84;
  const hrv = 62;
  const rhr = 54;
  const sleepPerformance = 92;

  // Chart data for radial ring
  const data = [
    { name: 'Recovery', value: recoveryScore },
    { name: 'Remaining', value: 100 - recoveryScore },
  ];

  return (
    <div className="glass-card p-6 border border-zinc-800/60 bg-zinc-900/40">
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-6">
        <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-emerald-400" />
          Recovery Analytics
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Radial Ring */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#27272a" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black text-white">{recoveryScore}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">Primed</span>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="flex flex-col justify-center gap-4">
          <div className="flex justify-between items-end border-b border-zinc-800/50 pb-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <Activity className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">HRV</span>
            </div>
            <span className="text-sm font-black text-white">{hrv} <span className="text-[10px] text-zinc-500">ms</span></span>
          </div>
          
          <div className="flex justify-between items-end border-b border-zinc-800/50 pb-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <HeartPulse className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">RHR</span>
            </div>
            <span className="text-sm font-black text-white">{rhr} <span className="text-[10px] text-zinc-500">bpm</span></span>
          </div>

          <div className="flex justify-between items-end border-b border-zinc-800/50 pb-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <Moon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Sleep</span>
            </div>
            <span className="text-sm font-black text-white">{sleepPerformance}%</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
        <p className="text-xs text-zinc-400 font-medium leading-relaxed">
          Your nervous system is fully recovered. You are prepared to take on high strain today.
        </p>
      </div>
    </div>
  );
}
