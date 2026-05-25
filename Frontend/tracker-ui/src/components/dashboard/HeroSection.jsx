import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Play, Zap, Droplet, Flame, X, Send, Moon, Plus, Footprints } from 'lucide-react';
import { toast } from 'react-hot-toast';
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
  const [dnaClass, setDnaClass] = useState('Balanced Human');

  // Interactive Health Form States
  const [sleepHours, setSleepHours] = useState('');
  const [waterMl, setWaterMl] = useState(250);
  const [stepCount, setStepCount] = useState(10000);
  const [stepsGoalInput, setStepsGoalInput] = useState(10000);

  const fetchAnalytics = () => {
    api.get('/dashboard/analytics').then(res => {
      const sleep = parseFloat(res.data.sleep) || 0;
      const water = parseFloat(res.data.hydration) || 0;
      setStats({
        totalCalories: parseFloat(res.data.total_calories) || 0,
        water,
        totalWorkouts: parseInt(res.data.total_workouts) || 0,
        steps: parseInt(res.data.steps) || 0,
        streak: parseInt(res.data.streak) || 0,
        sleep,
        steps_goal: parseInt(res.data.steps_goal) || 10000
      });
      setSleepHours(sleep > 0 ? sleep.toString() : '');
      if (res.data.steps) setStepCount(parseInt(res.data.steps));
      if (res.data.steps_goal) setStepsGoalInput(parseInt(res.data.steps_goal));
    }).catch(e => console.error("Error loading dashboard analytics", e));
  };

  useEffect(() => {
    fetchAnalytics();

    api.get('/user/dna').then(res => {
      setDnaClass(res.data.class);
    }).catch(() => {});
  }, []);

  const handleLogSleep = async () => {
    if (!sleepHours || isNaN(Number(sleepHours))) {
      toast.error('Please enter a valid sleep duration!');
      return;
    }
    try {
      await api.post('/body-metrics', {
        date: new Date().toISOString().split('T')[0],
        sleep_hours: Number(sleepHours)
      });
      setStats(prev => ({ ...prev, sleep: Number(sleepHours) }));
      window.dispatchEvent(new Event('health-data-updated'));
      toast.success(`Sleep logged: ${sleepHours}h!`);
    } catch (err) {
      console.error("Error logging sleep metrics", err);
      toast.error('Failed to log sleep.');
    }
  };

  const handleAddWater = async (amountMl) => {
    const mlToLog = amountMl || waterMl;
    if (!mlToLog || isNaN(Number(mlToLog))) {
      toast.error('Please select a valid water amount!');
      return;
    }
    try {
      const addedLiters = Number(mlToLog) / 1000;
      const newTotal = parseFloat(((stats.water || 0) + addedLiters).toFixed(2));
      await api.post('/body-metrics', {
        date: new Date().toISOString().split('T')[0],
        water_intake: newTotal
      });
      setStats(prev => ({ ...prev, water: newTotal }));
      window.dispatchEvent(new Event('health-data-updated'));
      toast.success(`Hydration logged: +${mlToLog}ml!`);
    } catch (err) {
      console.error("Error logging water metrics", err);
      toast.error('Failed to log water intake.');
    }
  };

  const handleLogSteps = async (amountSteps) => {
    const stepsToLog = amountSteps || stepCount;
    if (stepsToLog === '' || isNaN(Number(stepsToLog)) || Number(stepsToLog) < 0) {
      toast.error('Please enter a valid step count!');
      return;
    }
    try {
      await api.post('/daily-steps', {
        date: new Date().toISOString().split('T')[0],
        step_count: Number(stepsToLog)
      });
      setStats(prev => ({ ...prev, steps: Number(stepsToLog) }));
      window.dispatchEvent(new Event('health-data-updated'));
      toast.success(`Steps logged: ${Number(stepsToLog).toLocaleString()} steps!`);
    } catch (err) {
      console.error("Error logging steps", err);
      toast.error('Failed to log steps.');
    }
  };

  const handleUpdateStepsGoal = async () => {
    if (!stepsGoalInput || isNaN(Number(stepsGoalInput)) || Number(stepsGoalInput) < 1000) {
      toast.error('Please enter a valid goal (min 1,000 steps)!');
      return;
    }
    try {
      await api.put('/user/profile', {
        steps_goal: Number(stepsGoalInput)
      });
      setStats(prev => ({ ...prev, steps_goal: Number(stepsGoalInput) }));
      window.dispatchEvent(new Event('health-data-updated'));
      toast.success(`Daily Steps Goal updated: ${Number(stepsGoalInput).toLocaleString()} steps!`);
    } catch (err) {
      console.error("Error updating steps goal", err);
      toast.error('Failed to update steps goal.');
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
            className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 pb-4 mb-4 tracking-tighter leading-relaxed"
          >
            {greeting},<br />{user?.name || 'Athlete'}
          </motion.h1>
 
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-lg mb-8 leading-relaxed"
          >
            {stats.sleep > 0 && stats.water > 0
              ? `Sleep: ${stats.sleep}h · Hydration: ${stats.water.toFixed(1)}L today. You are primed for a heavy push session. Let's crush those goals.`
              : stats.sleep > 0
              ? `Sleep: ${stats.sleep}h logged. Log your hydration below to complete today's health data.`
              : stats.water > 0
              ? `Hydration: ${stats.water.toFixed(1)}L logged. Log your sleep below to complete today's health data.`
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
               <span className="text-xl font-black text-white">{stats.totalCalories > 0 ? stats.totalCalories.toLocaleString() : '--'}</span>
               <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Kcal Burned</span>
            </div>
            <div className="absolute -right-8 bottom-10 px-4 py-2 rounded-xl bg-[#0F172A]/80 backdrop-blur-md border border-[#00F5A0]/30 flex flex-col items-center">
               <Droplet className="w-4 h-4 text-[#00F5A0] mb-1" />
               <span className="text-xl font-black text-white">{stats.water > 0 ? `${stats.water.toFixed(1)}L` : '--'}</span>
               <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Hydration</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setIsHealthLogOpen(false)}
          >
            <motion.div 
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="w-full max-w-sm bg-[#0A0F24] border border-[#00E5FF]/30 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,229,255,0.15)] flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top border glowing highlight */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-gradient-to-r from-[#00E5FF]/10 to-transparent shrink-0">
                <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-[#00E5FF]" /> Log Health
                </h3>
                <button onClick={() => setIsHealthLogOpen(false)} className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 hover:border-red-500/40 border border-white/10 text-slate-400 hover:text-red-400 transition-all cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'min(70vh, 520px)' }}>
                
                {/* HYDRATION */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-widest text-[#00E5FF] font-black flex items-center gap-1.5">
                      <Droplet className="w-3 h-3" /> Hydration
                    </label>
                    <span className="text-[10px] text-slate-400 font-bold">
                      Today: <span className="text-white font-black">{stats.water > 0 ? stats.water.toFixed(1) : '0.0'}L</span> / {user?.water_goal || 3.5}L
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[250, 500, 750].map((ml) => (
                      <button key={ml} type="button" onClick={() => handleAddWater(ml)}
                        className="py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E5FF]/40 text-xs font-black text-white hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] transition-all flex items-center justify-center gap-1 cursor-pointer">
                        <Plus className="w-3 h-3" /> {ml}ml
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase">
                    <span>Custom</span><span className="text-[#00E5FF]">{waterMl}ml</span>
                  </div>
                  <input type="range" min="100" max="1000" step="50" value={waterMl}
                    onChange={(e) => setWaterMl(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]" />
                  <button type="button" onClick={() => handleAddWater(waterMl)}
                    className="w-full py-2.5 rounded-xl bg-[#00E5FF] hover:bg-[#00B3CC] text-black font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    <Plus className="w-3.5 h-3.5 stroke-[3]" /> Drink {waterMl}ml
                  </button>
                </div>

                {/* SLEEP */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-widest text-[#7C3AED] font-black flex items-center gap-1.5">
                      <Moon className="w-3 h-3" /> Sleep
                    </label>
                    <span className="text-[10px] text-slate-400 font-bold">
                      Logged: <span className="text-white font-black">{stats.sleep > 0 ? `${stats.sleep}h` : 'None'}</span>
                    </span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <input type="range" min="2" max="14" step="0.5" value={sleepHours || '7.0'}
                      onChange={(e) => setSleepHours(e.target.value)}
                      className="flex-1 h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]" />
                    <input type="number" step="0.1" min="0" max="24" value={sleepHours}
                      onChange={(e) => setSleepHours(e.target.value)} placeholder="7.5"
                      className="w-16 bg-black/40 border border-white/10 rounded-xl py-2 px-2 text-white text-xs font-mono text-center focus:outline-none focus:border-[#7C3AED]" />
                  </div>
                  <button type="button" onClick={handleLogSleep}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    Save Sleep
                  </button>
                </div>

                {/* STEPS */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-[#10B981] font-black flex items-center gap-1.5">
                      <Footprints className="w-3 h-3" /> Steps
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      Today: <span className="text-white font-black">{(stats.steps || 0).toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[2500, 5000, 10000].map((steps) => (
                      <button key={steps} type="button" onClick={() => handleLogSteps(steps)}
                        className="py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#10B981]/40 text-xs font-black text-white hover:bg-[#10B981]/10 hover:text-[#10B981] transition-all flex items-center justify-center gap-1 cursor-pointer">
                        <Plus className="w-3 h-3" /> {(steps/1000).toFixed(1)}k
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase">
                    <span>Custom</span><span className="text-[#10B981]">{stepCount.toLocaleString()} steps</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <input type="range" min="0" max="25000" step="500" value={stepCount}
                      onChange={(e) => setStepCount(parseInt(e.target.value))}
                      className="flex-1 h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#10B981]" />
                    <input type="number" min="0" max="100000" value={stepCount}
                      onChange={(e) => setStepCount(parseInt(e.target.value) || 0)}
                      className="w-20 bg-black/40 border border-white/10 rounded-xl py-2 px-2 text-white text-xs font-mono text-center focus:outline-none focus:border-[#10B981]" />
                  </div>
                  <button type="button" onClick={() => handleLogSteps(stepCount)}
                    className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    Save Steps
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
