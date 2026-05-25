import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Play, Zap, Droplet, Flame, X, Send } from 'lucide-react';
import api from '../../api/axios';
import useStore from '../../store/useStore';

export default function HeroSection({ onStartWorkout, activeSession }) {
  const { user } = useStore();
  
  const hour = new Date().getHours();
  let greeting = 'Good Evening';
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 18) greeting = 'Good Afternoon';

  const [stats, setStats] = useState({ totalCalories: 0, water: 0, totalWorkouts: 0, steps: 0, streak: 0, sleep: 0 });
  const [isHealthLogOpen, setIsHealthLogOpen] = useState(false);
  const [healthForm, setHealthForm] = useState({ sleep_hours: '', water_intake: '' });
  const [dnaClass, setDnaClass] = useState('Balanced Human');

  useEffect(() => {
    api.get('/dashboard/analytics').then(res => {
      setStats({
        totalCalories: res.data.total_calories || 0,
        water: res.data.avg_water || 0,
        totalWorkouts: res.data.total_workouts || 0,
        steps: res.data.steps || 0,
        streak: res.data.streak || 0,
        sleep: res.data.avg_sleep || 0
      });
    }).catch(e => console.error("Error loading dashboard analytics", e));

    api.get('/user/dna').then(res => {
      setDnaClass(res.data.class);
    }).catch(() => {});
  }, []);

  const handleLogHealth = async () => {
    try {
      await api.post('/body-metrics', {
        date: new Date().toISOString().split('T')[0],
        sleep_hours: Number(healthForm.sleep_hours),
        water_intake: Number(healthForm.water_intake)
      });
      setStats(prev => ({ 
        ...prev, 
        sleep: Number(healthForm.sleep_hours) || prev.sleep, 
        water: Number(healthForm.water_intake) || prev.water 
      }));
      setIsHealthLogOpen(false);
      setHealthForm({ sleep_hours: '', water_intake: '' });
    } catch (err) {
      console.error("Error logging health metrics", err);
    }
  };
  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#070B14] border border-white/5 p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.05)]">
      {/* Background Orbs & Mesh */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00E5FF] opacity-10 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#7C3AED] opacity-10 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />
      
      <div className="flex flex-col xl:flex-row items-center justify-between relative z-10 gap-8">
        
        {/* Left Content */}
        <div className="flex flex-col items-start w-full xl:w-1/2">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 mb-4 tracking-tighter"
          >
            {greeting},<br />{user?.name || 'Athlete'}
          </motion.h1>
 
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-v2-soft-gray text-lg max-w-lg mb-8 leading-relaxed"
          >
            {stats.sleep > 0 
              ? `Your average sleep is ${stats.sleep}h. You are primed for a heavy push session today. Let's crush those goals.`
              : `Your sleep and hydration data isn't tracked yet. Log your health below.`}
          </motion.p>
 
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            {activeSession && activeSession.status === 'active' ? (
              <div className="px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-black uppercase tracking-widest text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.15)] animate-pulse">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Tracking Session
              </div>
            ) : activeSession && activeSession.status === 'paused' ? (
              <div className="px-6 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" /> Session Paused
              </div>
            ) : (
              <button onClick={() => onStartWorkout && onStartWorkout()} className="px-6 py-3 rounded-xl bg-[#00E5FF] hover:bg-[#00B3CC] transition-colors text-black font-black uppercase tracking-widest text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                <Play className="w-4 h-4 fill-black" /> Start Workout
              </button>
            )}
            <button 
              onClick={() => setIsHealthLogOpen(true)}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-[#00F5A0]/20 text-white font-black uppercase tracking-widest text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,160,0.1)]"
            >
              <Droplet className="w-4 h-4 text-[#00F5A0]" /> Log Health
            </button>
          </motion.div>
        </div>

        {/* Right Content - Glowing AI Orb & Quick Stats */}
        <div className="w-full xl:w-1/2 flex items-center justify-center xl:justify-end relative">
          
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="relative w-64 h-64 flex items-center justify-center hidden md:flex"
          >
            {/* The Orb */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED] to-[#00E5FF] rounded-full blur-xl opacity-40 animate-spin-slow" />
            <div className="absolute inset-4 bg-black rounded-full border border-white/10 flex items-center justify-center shadow-[inset_0_0_50px_rgba(0,229,255,0.2)]">
               <Bot className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </div>
            
            {/* Orbiting Stats */}
            <div className="absolute -left-12 top-10 px-4 py-2 rounded-xl bg-[#0F172A]/80 backdrop-blur-md border border-[#00E5FF]/30 flex flex-col items-center">
               <Zap className="w-4 h-4 text-[#00E5FF] mb-1" />
               <span className="text-xl font-black text-white">{stats.totalCalories.toLocaleString()}</span>
               <span className="text-[9px] uppercase tracking-widest text-v2-soft-gray font-bold">Kcal Burned</span>
            </div>
            <div className="absolute -right-8 bottom-10 px-4 py-2 rounded-xl bg-[#0F172A]/80 backdrop-blur-md border border-[#00F5A0]/30 flex flex-col items-center">
               <Droplet className="w-4 h-4 text-[#00F5A0] mb-1" />
               <span className="text-xl font-black text-white">{stats.water > 0 ? `${stats.water}L` : '--'}</span>
               <span className="text-[9px] uppercase tracking-widest text-v2-soft-gray font-bold">Hydration</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Health Logging Modal Overlay */}
      <AnimatePresence>
        {isHealthLogOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="w-full max-w-sm bg-[#0F172A] border border-[#00F5A0]/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,245,160,0.15)] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-[#00F5A0]/10 to-transparent">
                <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-[#00F5A0]" /> Log Daily Health
                </h3>
                <button onClick={() => setIsHealthLogOpen(false)} className="p-2 text-v2-soft-gray hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-v2-soft-gray font-bold">Sleep (Hours)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={healthForm.sleep_hours}
                    onChange={(e) => setHealthForm({...healthForm, sleep_hours: e.target.value})}
                    placeholder="e.g. 7.5"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#00F5A0]/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-v2-soft-gray font-bold">Water Intake (Liters)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={healthForm.water_intake}
                    onChange={(e) => setHealthForm({...healthForm, water_intake: e.target.value})}
                    placeholder="e.g. 2.5"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#00F5A0]/50 transition-colors"
                  />
                </div>
                <button 
                  onClick={handleLogHealth}
                  className="w-full py-4 rounded-xl bg-[#00F5A0] hover:bg-[#00D68A] text-black font-black uppercase tracking-widest text-sm transition-colors shadow-[0_0_20px_rgba(0,245,160,0.3)]"
                >
                  Save Metrics
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
