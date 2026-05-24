import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { 
  Dumbbell, Flame, Zap, Scale, Droplet, Moon, Heart, Activity, ShieldCheck, RefreshCw, BarChart2 
} from 'lucide-react';
import api from '../api/axios';
import useStore from '../store/useStore';

export default function AnalyticsDashboard() {
  const { user } = useStore();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    try {
      const res = await api.get('/dashboard/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(() => fetchAnalytics(true), 15000);
    return () => clearInterval(interval);
  }, []);

  // Format the chart data safely
  const chartData = Object.entries(analytics?.workout_chart || {}).map(([day, value]) => ({
    day,
    value
  }));

  // Find max value in chart data for coloring / scaling
  const maxWorkoutCount = Math.max(...chartData.map(d => d.value), 1);

  const weightChartData = analytics?.weight_chart && analytics.weight_chart.length > 0
    ? analytics.weight_chart
    : [
        { date: '05/18', weight: 81.2 },
        { date: '05/19', weight: 80.9 },
        { date: '05/20', weight: 81.0 },
        { date: '05/21', weight: 80.5 },
        { date: '05/22', weight: 80.4 },
        { date: '05/23', weight: 79.8 },
        { date: '05/24', weight: 79.5 },
      ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center gap-4 text-v2-soft-gray">
        <Activity className="w-10 h-10 text-cyan-400 animate-pulse" />
        <span className="text-xs font-black uppercase tracking-[0.25em] animate-pulse">Syncing Analytics Core...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col gap-8 pb-24 p-4 md:p-8 relative overflow-hidden">
      {/* Background Glow Mesh */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00F5FF]/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-3xl bg-[#0F172A]/70 border border-white/5 backdrop-blur-xl shadow-2xl relative z-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">Analytics Hub</h1>
            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected to local database • real metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-[9px] font-bold text-v2-soft-gray uppercase tracking-widest">Active Athlete</span>
            <span className="text-xs font-black text-white">{user?.name ?? 'Guest Athlete'}</span>
          </div>
          <button 
            onClick={() => fetchAnalytics(true)}
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        
        {/* Card 1: Total Workouts */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="relative rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 backdrop-blur-xl shadow-xl flex items-center justify-between overflow-hidden group hover:border-cyan-500/30 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500 opacity-5 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-black text-v2-soft-gray uppercase tracking-widest">Logged Sessions</span>
            <span className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">
              {analytics?.total_workouts ?? 0}
            </span>
            <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">All-time count</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:scale-110 transition-transform">
            <Dumbbell className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 2: Total Calories */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="relative rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 backdrop-blur-xl shadow-xl flex items-center justify-between overflow-hidden group hover:border-pink-500/30 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500 opacity-5 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-black text-v2-soft-gray uppercase tracking-widest">Energy Burned</span>
            <span className="text-3xl font-black text-white group-hover:text-pink-400 transition-colors">
              {analytics?.total_calories?.toLocaleString() ?? 0}
            </span>
            <span className="text-[9px] font-bold text-pink-400 uppercase tracking-widest">Total kcal</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.1)] group-hover:scale-110 transition-transform">
            <Flame className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 3: Weekly Volume */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="relative rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 backdrop-blur-xl shadow-xl flex items-center justify-between overflow-hidden group hover:border-purple-500/30 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 opacity-5 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-black text-v2-soft-gray uppercase tracking-widest">Weekly Tonnage</span>
            <span className="text-3xl font-black text-white group-hover:text-purple-400 transition-colors">
              {analytics?.weekly_volume?.toLocaleString() ?? 0}
            </span>
            <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">kg lifted (7 days)</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 4: Body Weight */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="relative rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 backdrop-blur-xl shadow-xl flex items-center justify-between overflow-hidden group hover:border-yellow-500/30 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500 opacity-5 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-black text-v2-soft-gray uppercase tracking-widest">Body Weight</span>
            <span className="text-3xl font-black text-white group-hover:text-yellow-400 transition-colors">
              {analytics?.weight > 0 ? `${analytics.weight} kg` : '--'}
            </span>
            <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-widest">Latest metric log</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.1)] group-hover:scale-110 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
        </motion.div>

      </div>

      {/* Main Grid: Chart + Side Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: Weekly Activity + Weight Charts */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Weekly Activity Line Chart */}
          <div className="rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 backdrop-blur-xl shadow-2xl flex flex-col gap-6">
            <div className="flex flex-col">
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Weekly Activity Frequency</h2>
              <p className="text-[10px] text-v2-soft-gray uppercase tracking-widest font-bold mt-1">Sessions distribution by day</p>
            </div>

            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00F5FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(0,245,255,0.3)', borderRadius: '12px', color: '#white' }}
                    itemStyle={{ color: '#00F5FF', fontSize: 12, fontWeight: 'bold' }}
                    labelStyle={{ color: '#94A3B8', fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#00F5FF" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" dot={{ r: 4, fill: '#070B14', strokeWidth: 2, stroke: '#00F5FF' }} activeDot={{ r: 6, fill: '#00F5FF' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Body Weight Progress Chart */}
          <div className="rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 backdrop-blur-xl shadow-2xl flex flex-col gap-6">
            <div className="flex flex-col">
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Body Weight Tracker</h2>
              <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold mt-1">
                {analytics?.weight_chart && analytics.weight_chart.length > 0 
                  ? 'Real telemetry logs' 
                  : 'Demo mode • Log weight to track real progress'}
              </p>
            </div>

            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={weightChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(0,245,255,0.3)', borderRadius: '12px', color: '#white' }}
                    itemStyle={{ color: '#00E5FF', fontSize: 12, fontWeight: 'bold' }}
                    labelStyle={{ color: '#94A3B8', fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#00E5FF"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#070B14', strokeWidth: 2, stroke: '#00E5FF' }}
                    activeDot={{ r: 6, fill: '#00E5FF' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Side panel: Health Biometrics */}
        <div className="flex flex-col gap-6">
          
          {/* Hydration Widget */}
          <div className="rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 backdrop-blur-xl shadow-xl flex items-center gap-5 relative overflow-hidden group hover:border-[#0EA5E9]/30 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#0EA5E9] opacity-5 blur-[35px] rounded-full pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center text-[#0EA5E9] shrink-0">
              <Droplet className="w-6 h-6 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[10px] font-black text-v2-soft-gray uppercase tracking-widest">Hydration Balance</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-white">{analytics?.hydration ?? 0} L</span>
                <span className="text-[10px] text-v2-soft-gray font-bold">/ 3.5 L Target</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-white/5 rounded-full h-1.5 mt-1 overflow-hidden">
                <div 
                  className="bg-[#0EA5E9] h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(14,165,233,0.5)]" 
                  style={{ width: `${Math.min(Math.round(((analytics?.hydration ?? 0) / 3.5) * 100), 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sleep Hours Widget */}
          <div className="rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 backdrop-blur-xl shadow-xl flex items-center gap-5 relative overflow-hidden group hover:border-[#3B82F6]/30 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#3B82F6] opacity-5 blur-[35px] rounded-full pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] shrink-0">
              <Moon className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[10px] font-black text-v2-soft-gray uppercase tracking-widest">Circadian Sleep</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-white">{analytics?.sleep ?? 0} h</span>
                <span className="text-[10px] text-v2-soft-gray font-bold">/ 8.0 h Recommended</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-white/5 rounded-full h-1.5 mt-1 overflow-hidden">
                <div 
                  className="bg-[#3B82F6] h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                  style={{ width: `${Math.min(Math.round(((analytics?.sleep ?? 0) / 8.0) * 100), 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Heart Rate Widget */}
          <div className="rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 backdrop-blur-xl shadow-xl flex items-center gap-5 relative overflow-hidden group hover:border-[#EF4444]/30 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#EF4444] opacity-5 blur-[35px] rounded-full pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444] shrink-0 relative">
              <Heart className="w-6 h-6 text-[#EF4444] fill-[#EF4444] animate-ping absolute opacity-30" />
              <Heart className="w-6 h-6 text-[#EF4444] fill-[#EF4444]" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[10px] font-black text-v2-soft-gray uppercase tracking-widest">Pulse & Cardio</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-white">
                  {analytics?.heart_rate > 0 ? `${analytics.heart_rate} BPM` : '--'}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Stable
                </span>
              </div>
              <span className="text-[8px] font-medium text-v2-soft-gray uppercase tracking-widest mt-1">Automatic sync telemetry</span>
            </div>
          </div>

        </div>

      </div>

      {/* Audit Log Footer */}
      <div className="relative z-10 max-w-sm rounded-xl border border-white/5 bg-[#0F172A]/30 p-4 flex items-center gap-3 backdrop-blur-md">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <div>
          <h4 className="text-[9px] font-black text-white uppercase tracking-widest">API Data Integration Valid</h4>
          <p className="text-[8px] text-v2-soft-gray mt-0.5 font-bold uppercase tracking-widest">SQLite Database engine online • TLS 1.3 encryption active</p>
        </div>
      </div>

    </div>
  );
}
