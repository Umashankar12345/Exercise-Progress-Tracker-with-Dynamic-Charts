import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Flame, 
  Trophy, 
  Target, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Zap,
  Calendar,
  Bot,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import api from '../api/axios';
import { StepChart } from '../components/StepChart';
import { useAIInsights } from '../hooks/useAIInsights';
import useStore from '../store/useStore';

const MUSCLE_COLORS = { 
  Chest: '#3b82f6', 
  Back: '#10b981', 
  Legs: '#f59e0b', 
  Shoulders: '#8b5cf6', 
  Arms: '#ef4444', 
  Core: '#06b6d4' 
};

function StatCard({ label, value, trend, trendUp, icon: Icon, colorClass }) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 group transition-all hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className={`p-2.5 rounded-lg bg-surface-bright border border-outline-variant ${colorClass} group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-secondary' : 'text-red-400'}`}>
          {trend}
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">{label}</span>
        <span className="text-3xl font-bold text-on-surface mt-1">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-surface-bright rounded-full overflow-hidden mt-2">
        <div className={`h-full rounded-full ${colorClass.replace('text-', 'bg-')}`} style={{ width: '65%' }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useStore();
  const { insights, status: aiStatus } = useAIInsights(user?.id);
  
  const [summary, setSummary] = useState(null);
  const [prs, setPrs]         = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [steps, setSteps]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p, m, st] = await Promise.all([
          api.get('/progress/summary'),
          api.get('/prs'),
          api.get('/progress/muscles'),
          api.get('/daily-steps'),
        ]);
        setSummary(s.data);
        setPrs(p.data);
        setMuscles(m.data);
        setSteps(st.data);
      } catch (e) {
        console.error('Dashboard fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const volumeData = [
    { name: 'Mon', vol: 4200 },
    { name: 'Tue', vol: 5100 },
    { name: 'Wed', vol: 3800 },
    { name: 'Thu', vol: 6200 },
    { name: 'Fri', vol: 5800 },
    { name: 'Sat', vol: 7100 },
    { name: 'Sun', vol: 4500 },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Real-time Status Bar */}
      <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-secondary/5 border border-secondary/10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">Real-time Sync Active</span>
          <span className="text-on-surface-variant/30 text-xs">|</span>
          <span className="text-xs text-on-surface-variant font-medium">Laravel Reverb Connected</span>
        </div>
        <div className="flex gap-2">
          {['workout.saved', 'insight.ready'].map(evt => (
            <span key={evt} className="px-2 py-1 bg-surface-bright border border-outline-variant rounded-md text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
              {evt}
            </span>
          ))}
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Workouts" 
          value={summary?.total_workouts ?? 0} 
          trend="+12%" 
          trendUp 
          icon={Activity} 
          colorClass="text-primary" 
        />
        <StatCard 
          label="Workout Volume" 
          value={`${(summary?.total_volume ?? 0).toLocaleString()} kg`} 
          trend="+8.4k" 
          trendUp 
          icon={Flame} 
          colorClass="text-secondary" 
        />
        <StatCard 
          label="Personal Records" 
          value={summary?.prs ?? 0} 
          trend="+2" 
          trendUp 
          icon={Trophy} 
          colorClass="text-tertiary" 
        />
        <StatCard 
          label="Active Streak" 
          value={`${summary?.streak ?? 0} Days`} 
          trend="Steady" 
          trendUp 
          icon={Target} 
          colorClass="text-red-400" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Weekly Volume Chart */}
        <div className="xl:col-span-1 glass-card flex flex-col">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-on-surface tracking-tight">Performance Volume</h3>
              <p className="text-xs text-on-surface-variant font-medium">Total tonnage moved across all sessions</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-surface-bright border border-outline-variant rounded-lg text-xs font-bold">Week</button>
              <button className="px-3 py-1.5 bg-surface-bright border border-outline-variant rounded-lg text-xs font-bold text-on-surface-variant opacity-50">Month</button>
            </div>
          </div>
          <div className="p-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                <XAxis 
                  dataKey="name" 
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
                  dataKey="vol" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#volGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Step Tracking Chart */}
        <div className="xl:col-span-1">
          <StepChart data={steps} />
        </div>

        {/* Right Sidebar Column */}
        <div className="flex flex-col gap-8">
          
          {/* AI Insight Highlight */}
          <div className="bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
            <Zap className="absolute -top-4 -right-4 w-32 h-32 text-primary/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-primary rounded-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">AI Recommendation</span>
            </div>
            <p className="text-on-surface font-semibold text-lg leading-snug mb-4">
              {insights?.[0]?.text ?? "Your back volume is lagging. Add 2 sets of rows to your next session for balance."}
            </p>
            <button className="text-xs font-bold text-primary flex items-center gap-1 group/btn">
              VIEW ALL INSIGHTS 
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Muscle Balance */}
          <div className="glass-card">
            <div className="p-5 border-b border-outline-variant flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface">Muscle Balance</h4>
              <Activity className="w-4 h-4 text-secondary" />
            </div>
            <div className="p-6 flex flex-col gap-5">
              {Array.isArray(muscles) && muscles.map(m => (
                <div key={m.name} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-on-surface-variant">{m.name}</span>
                    <span className="text-on-surface">{m.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-bright rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ 
                        width: `${m.percentage}%`, 
                        backgroundColor: MUSCLE_COLORS[m.name] || '#adc6ff' 
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: PRs & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Personal Records */}
        <div className="glass-card">
          <div className="p-5 border-b border-outline-variant flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface">Personal Records</h4>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-[10px] font-bold text-secondary">LIVE FROM API</span>
            </div>
          </div>
          <div className="divide-y divide-outline-variant">
            {Array.isArray(prs) && prs.slice(0, 4).map((pr, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-surface-bright transition-colors cursor-default group">
                <div className="w-10 h-10 bg-surface-bright border border-outline-variant rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {(pr.exercise || '').includes('Bench') ? '🏋️' : (pr.exercise || '').includes('Squat') ? '🦵' : '💪'}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-on-surface">{pr.exercise}</div>
                  <div className="text-[10px] font-medium text-on-surface-variant">{pr.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-primary">{pr.weight} kg</div>
                  <div className="text-[10px] font-bold text-secondary uppercase tracking-tighter">New PR</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Schedule */}
        <div className="glass-card">
          <div className="p-5 border-b border-outline-variant flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface">Weekly AI Plan</h4>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { day: 'MON', name: 'Push Day A', muscle: 'Chest · Shoulders', active: true },
              { day: 'TUE', name: 'Pull Day A', muscle: 'Back · Biceps', active: false },
              { day: 'WED', name: 'Active Recovery', muscle: 'Mobility · Walk', active: false },
              { day: 'THU', name: 'Leg Focus', muscle: 'Quads · Hams', active: false },
            ].map((s, i) => (
              <div key={i} className={`p-4 rounded-xl border ${s.active ? 'bg-primary/5 border-primary/20' : 'bg-surface-bright border-outline-variant opacity-60'} flex flex-col gap-1`}>
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-black tracking-widest ${s.active ? 'text-primary' : 'text-on-surface-variant'}`}>{s.day}</span>
                  {s.active && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                </div>
                <div className="text-sm font-bold text-on-surface">{s.name}</div>
                <div className="text-[10px] font-medium text-on-surface-variant">{s.muscle}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

