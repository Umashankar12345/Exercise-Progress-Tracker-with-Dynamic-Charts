import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  Target, 
  Calendar, 
  ChevronDown, 
  Filter,
  Maximize2
} from 'lucide-react';

const volumeData = [
  { date: 'May 01', volume: 4200, intensity: 85, sessions: 1 },
  { date: 'May 03', volume: 5100, intensity: 88, sessions: 1 },
  { date: 'May 04', volume: 3800, intensity: 82, sessions: 1 },
  { date: 'May 06', volume: 6200, intensity: 90, sessions: 1 },
  { date: 'May 08', volume: 5800, intensity: 92, sessions: 1 },
  { date: 'May 10', volume: 7100, intensity: 95, sessions: 1 },
  { date: 'May 12', volume: 5400, intensity: 89, sessions: 1 },
];

const muscleData = [
  { name: 'Chest', value: 85, color: '#3b82f6' },
  { name: 'Back', value: 72, color: '#10b981' },
  { name: 'Legs', value: 94, color: '#f59e0b' },
  { name: 'Shoulders', value: 65, color: '#8b5cf6' },
  { name: 'Arms', value: 58, color: '#ef4444' },
];

export default function ProgressCharts() {
  const [selectedExercise, setSelectedExercise] = useState('Bench Press');
  const [timeframe, setTimeframe] = useState('30D');

  return (
    <div className="flex flex-col gap-8">
      {/* Filters Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-surface-container border border-outline-variant">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Target Analysis</span>
            <div className="flex items-center gap-2 text-on-surface font-bold">
              <Activity className="w-4 h-4 text-primary" />
              <span>{selectedExercise}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-outline-variant" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Active Timeframe</span>
            <div className="flex items-center gap-2 text-on-surface font-bold">
              <Calendar className="w-4 h-4 text-secondary" />
              <span>Last 30 Days</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-surface-bright p-1 rounded-xl border border-outline-variant">
            {['7D', '30D', '90D', 'ALL'].map(t => (
              <button 
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${
                  timeframe === t ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-surface-bright border border-outline-variant px-4 py-2.5 rounded-xl text-xs font-bold hover:border-primary/50 transition-all">
            <Filter className="w-4 h-4" />
            ADVANCED FILTERS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Progression Chart */}
        <div className="xl:col-span-2 glass-card">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-on-surface tracking-tight">Strength Progression</h3>
              <p className="text-xs text-on-surface-variant font-medium">Estimated 1RM trend based on training volume</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-surface-bright transition-colors">
              <Maximize2 className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>
          <div className="p-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="strengthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8c909f', fontSize: 12, fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8c909f', fontSize: 12, fontWeight: 500 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '12px' }}
                  itemStyle={{ color: '#adc6ff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="intensity" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#strengthGradient)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Widgets */}
        <div className="space-y-8">
          
          {/* Muscle Activation Bar Chart */}
          <div className="glass-card">
            <div className="p-5 border-b border-outline-variant">
              <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface">Volume Breakdown</h4>
            </div>
            <div className="p-6 h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={muscleData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8c909f', fontSize: 11, fontWeight: 600 }}
                    width={70}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1c1c1c', border: 'none', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {muscleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant flex items-center justify-between group cursor-default">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">Top Muscle</span>
                  <span className="text-sm font-bold text-on-surface">Quadriceps</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-secondary uppercase tracking-wider">Growth Rate</span>
                  <div className="text-sm font-black text-secondary">+14.2%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-tertiary/10 to-transparent border border-tertiary/20 space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-tertiary" />
              <span className="text-[10px] font-black text-tertiary uppercase tracking-widest">Growth Opportunity</span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-bold leading-relaxed">
              Your <span className="text-on-surface">Bench Press</span> strength has plateaued over the last 12 days. 
              Consider increasing intensity to <span className="text-tertiary">92.5 kg</span> for lower reps in your next session.
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card">
          <div className="p-5 border-b border-outline-variant">
            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface">Volume Stability</h4>
          </div>
          <div className="p-6 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Line 
                  type="stepAfter" 
                  dataKey="volume" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <div className="p-5 border-b border-outline-variant">
            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface">Training Frequency</h4>
          </div>
          <div className="p-6 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="sessions" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
