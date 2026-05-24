import React from 'react';
import { Target, CheckCircle } from 'lucide-react';

export default function HealthyHabitAnalytics() {
  const habits = [
    { name: 'No Screens > 9PM', streak: 4, done: true },
    { name: 'Morning Sunlight', streak: 12, done: true },
    { name: 'Read 10 Pages', streak: 0, done: false },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-[#8B5CF6]" />
        <span className="text-[10px] uppercase font-bold tracking-widest text-white">Daily Habits</span>
      </div>
      <div className="space-y-2">
        {habits.map((h, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#0F172A] border border-white/5">
            <div className="flex items-center gap-2">
              {h.done ? <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" /> : <div className="w-3.5 h-3.5 rounded-full border border-v2-soft-gray" />}
              <span className={`text-[10px] font-bold ${h.done ? 'text-v2-soft-gray line-through' : 'text-white'}`}>{h.name}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded">
              <span className="text-[8px] text-[#F59E0B]">🔥</span>
              <span className="text-[9px] font-bold text-white">{h.streak}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
