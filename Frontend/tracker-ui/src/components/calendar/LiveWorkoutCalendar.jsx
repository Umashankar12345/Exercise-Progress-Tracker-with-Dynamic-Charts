import React, { useState, useEffect } from 'react';
import WorkoutDayCell from './WorkoutDayCell';
import api from '../../api/axios';

export default function LiveWorkoutCalendar() {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await api.get('/workouts');
        const workouts = res.data || [];
        
        // Generate calendar cells for current month
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        let startDayOfWeek = firstDayOfMonth.getDay() - 1; // Mon = 0
        if (startDayOfWeek === -1) startDayOfWeek = 6; // Sun = 6

        const totalDays = new Date(year, month + 1, 0).getDate();
        const prevMonthTotalDays = new Date(year, month, 0).getDate();

        const cells = [];

        // Trailing days from previous month
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
          cells.push({
            day: prevMonthTotalDays - i,
            currentMonth: false,
            type: null,
            status: null,
            isToday: false
          });
        }

        // Days in current month
        // We use local date matching to avoid timezone offset mismatches
        const todayStr = new Date().toLocaleDateString('sv'); // YYYY-MM-DD
        for (let d = 1; d <= totalDays; d++) {
          const currentDate = new Date(year, month, d);
          const dateString = currentDate.toLocaleDateString('sv');

          // Check if there is a workout logged on this date
          const dateWorkouts = workouts.filter(w => {
            const wDate = new Date(w.started_at || w.created_at).toLocaleDateString('sv');
            return wDate === dateString;
          });

          let type = null;
          let status = 'upcoming';

          if (dateWorkouts.length > 0) {
            const wType = dateWorkouts[0].type || '';
            if (wType.toLowerCase().includes('strength')) {
              type = 'Strength';
            } else if (wType.toLowerCase().includes('cardio')) {
              type = 'Cardio';
            } else {
              type = 'HIIT';
            }
            status = 'completed';
          }

          cells.push({
            day: d,
            currentMonth: true,
            type,
            status,
            isToday: dateString === todayStr
          });
        }

        // Trailing days for next month to round out the 35 or 42 grid cells
        const totalCellsSoFar = cells.length;
        const totalGridSize = totalCellsSoFar > 35 ? 42 : 35;
        const remaining = totalGridSize - totalCellsSoFar;
        for (let i = 1; i <= remaining; i++) {
          cells.push({
            day: i,
            currentMonth: false,
            type: null,
            status: null,
            isToday: false
          });
        }

        setDays(cells);
      } catch (err) {
        console.error("Failed to load workouts for calendar", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-v2-soft-gray text-xs font-bold uppercase tracking-widest animate-pulse">
        Syncing calendar data...
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map(d => (
          <div key={d} className="text-center text-[10px] uppercase font-bold tracking-widest text-v2-soft-gray pb-2 border-b border-white/5">
            {d}
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-7 gap-2">
        {days.map((d, i) => (
          <WorkoutDayCell key={i} data={d} />
        ))}
      </div>
    </div>
  );
}
