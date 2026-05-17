import React from 'react';
import { Calendar, Bot, Zap, Clock, ChevronRight, Target, Dumbbell, Sparkles } from 'lucide-react';

const WEEK_PLAN = [
  { day: 'Monday', title: 'Hypertrophy: Push A', focus: 'Chest, Delts, Triceps', exercises: 6, volume: 'High' },
  { day: 'Tuesday', title: 'Hypertrophy: Pull A', focus: 'Back, Biceps, Rear Delts', exercises: 7, volume: 'High' },
  { day: 'Wednesday', title: 'Active Recovery', focus: 'Mobility, Zone 2 Cardio', exercises: 0, volume: 'Low' },
  { day: 'Thursday', title: 'Strength: Legs A', focus: 'Quads, Adductors, Calves', exercises: 5, volume: 'Extreme' },
  { day: 'Friday', title: 'Hypertrophy: Upper Body B', focus: 'Vertical Push/Pull Focus', exercises: 8, volume: 'Moderate' },
  { day: 'Saturday', title: 'Functional Strength', focus: 'Full Body Compound', exercises: 4, volume: 'Moderate' },
  { day: 'Sunday', title: 'Full Recovery', focus: 'Rest, Nutrition, Sleep', exercises: 0, volume: 'Zero' },
];

export default function Plan() {
  return (
    <div className="flex flex-col gap-8">
      {/* AI Hero Section */}
      <div className="p-10 rounded-3xl bg-gradient-to-br from-primary/20 via-surface-container to-transparent border border-primary/20 relative overflow-hidden group">
        <Sparkles className="absolute -top-10 -right-10 w-64 h-64 text-primary/5 group-hover:rotate-12 transition-transform duration-1000" />
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40">
            <Bot className="text-white w-12 h-12" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-black text-on-surface tracking-tighter uppercase">AI Adaptive Training Plan</h1>
            <p className="text-on-surface-variant font-medium text-lg">Your plan has been optimized by Gemini 1.5 based on your last 12 sessions.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-secondary uppercase tracking-widest px-3 py-1 bg-secondary/10 rounded-full border border-secondary/20">
                ADAPTIVE MODE ON
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                PERIODIZATION: HYPERTROPHY
              </div>
            </div>
          </div>
          <button className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-black shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0">
            REGENERATE PLAN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Weekly Curriculum
            </h2>
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Phase 2 of 4</span>
          </div>

          <div className="space-y-3">
            {WEEK_PLAN.map((day, i) => (
              <div key={i} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-surface-bright border border-outline-variant rounded-xl flex flex-col items-center justify-center">
                    <span className="text-[9px] font-black text-on-surface-variant uppercase">{day.day.slice(0, 3)}</span>
                    <span className="text-lg font-black text-on-surface leading-tight">{i + 14}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors">{day.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{day.focus}</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant" />
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{day.exercises} Exercises</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    day.volume === 'Extreme' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    day.volume === 'High' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                    day.volume === 'Moderate' ? 'bg-secondary/10 border-secondary/20 text-secondary' :
                    'bg-surface-bright border-outline-variant text-on-surface-variant'
                  }`}>
                    {day.volume} Volume
                  </div>
                  <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-all group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
          <div className="glass-card p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface flex items-center gap-2">
              <Zap className="w-4 h-4 text-tertiary" />
              AI Adjustments
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-widest">
                  <Target className="w-3.5 h-3.5" />
                  Volume Correction
                </div>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Back day exercises increased by 15% to address pull-to-push imbalance detected in last 3 sessions.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                  <Dumbbell className="w-3.5 h-3.5" />
                  Exercise Swap
                </div>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Swapped Bench Press for Incline DB Press due to plateau in horizontal pressing strength.
                </p>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all">
              VIEW ADAPTATION LOG
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-surface-container border border-outline-variant space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-on-surface">Plan Statistics</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-on-surface-variant">Training Frequency</span>
                <span className="text-on-surface">5x / Week</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-on-surface-variant">Avg Session Time</span>
                <span className="text-on-surface">72 Minutes</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-on-surface-variant">Next Deload</span>
                <span className="text-tertiary">In 12 Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
