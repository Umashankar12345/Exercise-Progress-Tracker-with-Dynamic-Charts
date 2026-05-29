import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, Flame, Zap, Scale, Droplet, Moon, Heart, ShieldCheck, RefreshCw, BarChart2, Plus, Minus
} from 'lucide-react';
import api from '../api/axios';
import useStore from '../store/useStore';
import GlobalLoader from '../components/ui/GlobalLoader';
import WorkoutHeatmap from '../components/dashboard/WorkoutHeatmap';

export default function AnalyticsDashboard() {
  const { user, dashboardAnalytics, fetchDashboardAnalytics } = useStore();
  const [loading, setLoading] = useState(!dashboardAnalytics);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async (silent = false) => {
    if (!silent && !dashboardAnalytics) setLoading(true);
    else setIsRefreshing(true);
    await fetchDashboardAnalytics();
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    handleRefresh(dashboardAnalytics !== null);
    const interval = setInterval(() => handleRefresh(true), 15000);
    return () => clearInterval(interval);
  }, []);

  const chartData = dashboardAnalytics?.weekly_progress || [];

  const handleUpdateHealth = (key, delta) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const currentValue = dashboardAnalytics?.[key] ?? 0;
    // Hydration increments by 0.25L, Sleep by 0.5h
    const newValue = Math.max(0, parseFloat((currentValue + delta).toFixed(2)));
    
    useStore.getState().logHealthMetric(todayStr, {
      [key === 'hydration' ? 'water_intake' : 'sleep_hours']: newValue
    });
  };

  // Find max value in chart data for coloring / scaling
  const maxWorkoutCount = Math.max(...chartData.map(d => d.value), 1);

  if (loading) {
    return (
      <GlobalLoader fullScreen={true} text="Syncing Analytics Core..." />
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
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-[9px] font-bold text-v2-soft-gray uppercase tracking-widest">Active Athlete</span>
            <span className="text-xs font-black text-white">{user?.name ?? 'Guest Athlete'}</span>
          </div>
          <button 
            onClick={() => handleRefresh(false)}
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
              {dashboardAnalytics?.total_workouts ?? 0}
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
              {dashboardAnalytics?.total_calories?.toLocaleString() ?? 0}
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
              {dashboardAnalytics?.weekly_volume?.toLocaleString() ?? 0}
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
              {dashboardAnalytics?.weight > 0 ? `${dashboardAnalytics.weight} kg` : '--'}
            </span>
            <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-widest">Latest metric log</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.1)] group-hover:scale-110 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
        </motion.div>

      </div>

      {/* Main Content: Chart */}
      <div className="relative z-10">
        <div className="flex flex-col gap-8">
          <WorkoutHeatmap />
        </div>
      </div>
    </div>
  );
}
