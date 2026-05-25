import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Calendar, TrendingUp, Sparkles, Award } from 'lucide-react';
import useStore from '../../store/useStore';
import { useWorkoutStateSync } from '../../hooks/useWorkoutStateSync';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip as RechartsTooltip } from 'recharts';

const INTENSITY_LABELS = ['Rest', 'Light', 'Moderate', 'Hard', 'Beast'];

function HeatmapSkeleton() {
  return (
    <div className="w-full rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 animate-pulse space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="w-48 h-6 bg-white/5 rounded-lg" />
          <div className="w-32 h-4 bg-white/5 rounded-lg" />
        </div>
        <div className="flex gap-4">
          <div className="w-24 h-10 bg-white/5 rounded-xl" />
          <div className="w-24 h-10 bg-white/5 rounded-xl" />
        </div>
      </div>
      <div className="w-full h-36 bg-white/5 rounded-2xl flex items-center justify-center">
        <span className="text-xs text-white/20 uppercase tracking-widest font-black">Initializing Engine...</span>
      </div>
    </div>
  );
}

export default function WorkoutHeatmap() {
  const { dashboardHeatmap, dashboardHeatmapWorkouts, fetchHeatmapData } = useStore();
  const [loading, setLoading] = useState(!dashboardHeatmap);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);

  const initData = useCallback(async () => {
    if (!dashboardHeatmap) setLoading(true);
    await fetchHeatmapData();
    setLoading(false);
  }, [dashboardHeatmap, fetchHeatmapData]);

  // Fetch data on mount
  useEffect(() => {
    initData();
  }, [initData]);

  // Recalculate totals and streaks whenever the global data changes
  useEffect(() => {
    if (dashboardHeatmap) {
      const total = dashboardHeatmap.reduce((s, d) => s + (d.count || 0), 0);
      setTotalWorkouts(total);

      // Calculate current streak from data
      const dateSet = new Set(dashboardHeatmap.filter(d => d.count > 0).map(d => d.date));
      let s = 0;
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().split('T')[0];
        if (dateSet.has(key)) {
          s++;
        } else {
          // Allow today to be missing if they haven't worked out yet today
          if (i > 0) break;
        }
      }
      setStreak(s);
    }
  }, [dashboardHeatmap]);

  // Instant state synchronization hook
  useWorkoutStateSync(fetchHeatmapData);

  if (loading) {
    return <HeatmapSkeleton />;
  }

  // 1. Generate 365 days of data, merging with API data using Map
  const heatmapMap = new Map(
    (dashboardHeatmap || []).map(h => [h.date, h])
  );

  const days = Array.from({ length: 365 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (364 - i)); // aligns the last element to today
    const dateString = d.toISOString().split('T')[0];
    const realDay = heatmapMap.get(dateString);
    return {
      date: d,
      dateStr: dateString,
      intensity: realDay ? Math.min(Math.ceil(realDay.count), 4) : 0,
      calories: realDay ? realDay.calories : 0,
      count: realDay ? realDay.count : 0
    };
  });

  // Group into 52 weeks of 7 days
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // 2. Prepare month headers
  let currentMonthName = '';
  const monthHeaders = weeks.map((week) => {
    const firstDay = week[0].date;
    const mName = firstDay.toLocaleDateString('en-US', { month: 'short' });
    if (mName !== currentMonthName) {
      currentMonthName = mName;
      return mName;
    }
    return '';
  });

  // 3. Map workouts to dates for fast drill-down lookups
  const workoutsMap = new Map();
  (dashboardHeatmapWorkouts || []).forEach(w => {
    const dateStr = w.started_at ? w.started_at.split('T')[0] : w.created_at.split('T')[0];
    if (!workoutsMap.has(dateStr)) {
      workoutsMap.set(dateStr, []);
    }
    workoutsMap.get(dateStr).push(w);
  });

  // 4. Calculate AI Insights
  const getAIInsights = () => {
    if (!dashboardHeatmap || dashboardHeatmap.length === 0) {
      return { productiveMonth: 'N/A', consistency: 'Steady', recovery: 'Adequate' };
    }

    const monthCalories = {};
    dashboardHeatmap.forEach(d => {
      const monthStr = new Date(d.date).toLocaleDateString('en-US', { month: 'long' });
      monthCalories[monthStr] = (monthCalories[monthStr] || 0) + (d.calories || 0);
    });

    let productiveMonth = 'None';
    let maxCalories = 0;
    Object.keys(monthCalories).forEach(m => {
      if (monthCalories[m] > maxCalories) {
        maxCalories = monthCalories[m];
        productiveMonth = m;
      }
    });

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(today.getDate() - 60);

    let last30DaysCount = 0;
    let prior30DaysCount = 0;

    dashboardHeatmap.forEach(d => {
      const dateVal = new Date(d.date);
      if (dateVal >= thirtyDaysAgo && dateVal <= today) {
        last30DaysCount += d.count || 0;
      } else if (dateVal >= sixtyDaysAgo && dateVal < thirtyDaysAgo) {
        prior30DaysCount += d.count || 0;
      }
    });

    const consistency = last30DaysCount > prior30DaysCount ? 'Improving' : (prior30DaysCount > last30DaysCount ? 'Focus Needed' : 'Steady');

    let consecutiveDays = 0;
    let maxConsecutive = 0;
    const sortedData = [...dashboardHeatmap].sort((a, b) => new Date(a.date) - new Date(b.date));
    sortedData.forEach(d => {
      if (d.count > 0) {
        consecutiveDays++;
        if (consecutiveDays > maxConsecutive) maxConsecutive = consecutiveDays;
      } else {
        consecutiveDays = 0;
      }
    });

    const recovery = maxConsecutive >= 5 ? 'Declining (Overload)' : 'Adequate Recovery';

    return { productiveMonth, consistency, recovery };
  };

  const aiInsights = getAIInsights();

  // 5. Calculate Achievements/Badges
  const getBadges = () => {
    const badges = [];

    // 7 Day Streak
    badges.push({
      title: '7 Day Streak',
      desc: streak >= 7 ? `${streak} days active!` : `${streak}/7 completed`,
      icon: '🔥',
      active: streak >= 7
    });

    // Beast Week (Check if any 7-day week had >= 5 workouts)
    let maxWeeklyCount = 0;
    for (let i = 0; i < weeks.length; i++) {
      const weekWorkouts = weeks[i].reduce((sum, d) => sum + (d.count || 0), 0);
      if (weekWorkouts > maxWeeklyCount) maxWeeklyCount = weekWorkouts;
    }
    badges.push({
      title: 'Beast Week',
      desc: maxWeeklyCount >= 5 ? `Hit ${maxWeeklyCount} sessions!` : `${maxWeeklyCount}/5 completed`,
      icon: '⚡',
      active: maxWeeklyCount >= 5
    });

    // Elite Consistency (Check if >= 12 workouts in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(new Date().getDate() - 30);
    const workoutsLast30 = days
      .filter(d => d.date >= thirtyDaysAgo)
      .reduce((sum, d) => sum + d.count, 0);

    badges.push({
      title: 'Elite Consistency',
      desc: workoutsLast30 >= 12 ? `${workoutsLast30} sessions!` : `${workoutsLast30}/12 completed`,
      icon: '🏆',
      active: workoutsLast30 >= 12
    });

    return badges;
  };

  const badges = getBadges();

  // 6. Calculate Weekly Trend (last 12 weeks sparkline)
  const getWeeklyTrend = () => {
    const last84Days = days.slice(-84);
    const trend = [];
    for (let i = 0; i < 12; i++) {
      const weekDays = last84Days.slice(i * 7, (i + 1) * 7);
      const totalCalories = weekDays.reduce((sum, d) => sum + d.calories, 0);
      const firstDayStr = weekDays[0].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      trend.push({
        week: `W${i + 1}`,
        dateRange: firstDayStr,
        calories: Math.round(totalCalories)
      });
    }
    return trend;
  };

  const weeklyTrend = getWeeklyTrend();

  // 7. GitHub Style Green Intensity Color System
  const getColor = (intensity) => {
    switch (intensity) {
      case 1: return 'bg-[#0e4429] border-transparent';
      case 2: return 'bg-[#006d32] border-transparent';
      case 3: return 'bg-[#26a641] border-transparent';
      case 4: return 'bg-[#39d353] border-transparent';
      default: return 'bg-[#161b22] border-white/5 text-white/5';
    }
  };

  const getGlow = (intensity) => {
    return {}; // GitHub style is flat and professional, no glows
  };

  return (
    <div className="w-full rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 relative overflow-hidden backdrop-blur-xl group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF] opacity-5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div className="flex flex-col">
          <h3 className="text-xl font-black text-white flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            Workout Heatmap
          </h3>
          <p className="text-xs text-v2-soft-gray uppercase tracking-widest font-bold">{totalWorkouts} Workouts in the last year</p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FACC15]/10 border border-[#FACC15]/20">
            <Flame className="w-4 h-4 text-[#FACC15] animate-bounce" />
            <div>
              <span className="text-lg font-black text-white">{streak}</span>
              <span className="text-[10px] text-[#FACC15] font-bold uppercase ml-1">Day Streak</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
            <Calendar className="w-4 h-4 text-white/40" />
            <div>
              <span className="text-lg font-black text-white">{totalWorkouts}</span>
              <span className="text-[10px] text-white/40 font-bold uppercase ml-1">Sessions</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-v2-soft-gray tracking-widest">
          <span>Less</span>
          <div className="w-3 h-3 rounded-[2px] bg-[#161b22] border border-white/5" />
          <div className="w-3 h-3 rounded-[2px] bg-[#0e4429]" />
          <div className="w-3 h-3 rounded-[2px] bg-[#006d32]" />
          <div className="w-3 h-3 rounded-[2px] bg-[#26a641]" />
          <div className="w-3 h-3 rounded-[2px] bg-[#39d353]" />
          <span>More</span>
        </div>
      </div>

      {/* Month Labels & Heatmap Grid */}
      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        {/* Month Labels */}
        <div className="flex gap-1.5 min-w-max mb-1 select-none">
          {monthHeaders.map((m, idx) => (
            <div key={idx} className="w-3.5 text-[8px] font-black text-v2-soft-gray uppercase tracking-widest text-left h-4 relative overflow-visible">
              {m && <span className="absolute left-0 top-0 whitespace-nowrap">{m}</span>}
            </div>
          ))}
        </div>

        {/* The Grid */}
        <div className="flex gap-1.5 min-w-max">
          {weeks.map((week, weekIndex) => (
            <motion.div
              key={weekIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: weekIndex * 0.003, duration: 0.4 }}
              className="flex flex-col gap-1.5"
            >
              {week.map((day, dayIndex) => (
                <motion.div
                  key={dayIndex}
                  whileHover={{ scale: 1.6, zIndex: 10 }}
                  onClick={() => setSelectedDay(day)}
                  className={`w-3.5 h-3.5 rounded-[2px] border cursor-pointer transition-all duration-300 relative group/cell ${getColor(day.intensity)}`}
                  style={getGlow(day.intensity)}
                >
                  {/* Rich Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover/cell:opacity-100 transition-opacity z-50">
                    <div className="px-3 py-2 rounded-xl bg-black/95 border border-white/10 text-white text-[10px] font-bold whitespace-nowrap shadow-xl backdrop-blur-md">
                      <div className="text-white/50 mb-0.5">{day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      {day.intensity > 0 ? (
                        <>
                          <div className="text-[#39d353] font-black">{INTENSITY_LABELS[day.intensity]} Level</div>
                          <div className="text-white/70">{day.count} workout{day.count !== 1 ? 's' : ''}</div>
                          {day.calories > 0 && <div className="text-[#39d353]">{Math.round(day.calories)} kcal</div>}
                          <div className="text-white/40 text-[8px] mt-1 italic">Click for analytics drill-down</div>
                        </>
                      ) : (
                        <div className="text-white/30">Rest Day (Click to view details)</div>
                      )}
                    </div>
                    <div className="w-2 h-2 bg-black/95 border-b border-r border-white/10 rotate-45 mx-auto -mt-1" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Drill-down Analytics Drawer */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 border-t border-white/5 pt-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#39d353] animate-spin" style={{ animationDuration: '3s' }} />
                Analytics Drill-Down: {selectedDay.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h4>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors"
              >
                Close Panel
              </button>
            </div>

            {selectedDay.count > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric Summary Card */}
                <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block mb-1">Energy Burned</span>
                    <span className="text-2xl font-black text-white">{Math.round(selectedDay.calories)} <span className="text-xs font-normal text-[#39d353]">kcal</span></span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39d353] animate-pulse" />
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{selectedDay.count} active session{selectedDay.count > 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Workout History Details */}
                <div className="md:col-span-2 rounded-2xl bg-white/[0.02] border border-white/5 p-4">
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block mb-3">Completed Sessions</span>
                  <div className="space-y-3">
                    {workoutsMap.get(selectedDay.dateStr)?.map((workout, wIdx) => (
                      <div key={wIdx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-white uppercase tracking-wide">{workout.name || workout.title}</span>
                          <div className="flex gap-2">
                            <span className="text-[9px] font-black text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded uppercase">{workout.duration} min</span>
                            <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase">{workout.calories_burned} kcal</span>
                          </div>
                        </div>

                        {/* List of exercises performed */}
                        {workout.workout_exercises && workout.workout_exercises.length > 0 && (
                          <div className="mt-1 space-y-1">
                            <span className="text-[8px] font-bold text-white/35 uppercase tracking-widest">Exercises & Progress:</span>
                            <div className="flex flex-wrap gap-2">
                              {workout.workout_exercises.map((we, weIdx) => (
                                <div key={weIdx} className="text-[10px] text-white/70 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-1.5">
                                  <span className="font-bold text-white">{we.exercise?.name || 'Exercise'}</span>
                                  {we.workout_sets && we.workout_sets.length > 0 && (
                                    <span className="text-[9px] text-white/40">
                                      ({we.workout_sets.length} sets × {we.workout_sets[0].reps} reps)
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Rest Day</span>
                <p className="text-[10px] text-white/20">No workouts logged on this day. Great for muscle recovery and neural reset!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insights & Achievements Badge Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t border-white/5 pt-6">
        {/* AI Insights Panel */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            AI Training Insights
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest block mb-1">Peak Month</span>
              <span className="text-xs font-black text-[#39d353] uppercase block truncate">{aiInsights.productiveMonth}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest block mb-1">Consistency</span>
              <span className="text-xs font-black text-[#26a641] uppercase block truncate">{aiInsights.consistency}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest block mb-1">Recovery</span>
              <span className="text-xs font-black text-amber-500 uppercase block truncate">{aiInsights.recovery}</span>
            </div>
          </div>
        </div>

        {/* Badges Panel */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            Achievement Overlays
          </h4>
          <div className="flex gap-2 flex-wrap">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                  badge.active
                    ? 'bg-amber-500/10 border-amber-500/20 text-white'
                    : 'bg-white/[0.02] border-white/5 text-white/40 opacity-40'
                }`}
              >
                <span className="text-base">{badge.icon}</span>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-wider">{badge.title}</span>
                  <span className="text-[7px] text-white/50">{badge.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Calorie Burn Sparkline / Trend */}
      <div className="mt-8 border-t border-white/5 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#39d353]" />
              Weekly Energy Consumption (12-Week Trend)
            </h4>
            <p className="text-[10px] text-v2-soft-gray">Caloric output aggregation per week</p>
          </div>
          <span className="text-[10px] font-black text-[#39d353] bg-[#39d353]/10 px-2 py-0.5 rounded border border-[#39d353]/20 uppercase tracking-wider">
            12 Wk Sparkline
          </span>
        </div>

        <div className="w-full h-24">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="calorieGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#39d353" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#39d353" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.2)" fontSize={8} tickLine={false} axisLine={false} />
              <RechartsTooltip
                contentStyle={{ background: '#090D16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', fontWeight: 'bold' }}
                itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'black' }}
                formatter={(value) => [`${value} kcal`, 'Energy']}
              />
              <Area type="monotone" dataKey="calories" stroke="#39d353" strokeWidth={2} fillOpacity={1} fill="url(#calorieGlow)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
