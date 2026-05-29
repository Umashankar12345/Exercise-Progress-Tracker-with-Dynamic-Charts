import React from 'react';
import { Bell, Droplet, Dumbbell } from 'lucide-react';

export default function SmartReminderSystem() {
  const reminders = [
    { type: 'workout', text: 'Push workout starts in 30 minutes', icon: Dumbbell, color: '#3B82F6' },
    { type: 'hydration', text: 'Hydration level low today', icon: Droplet, color: '#00F5FF' },
  ];

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-4 h-4 text-white" />
        <span className="text-[10px] uppercase font-bold text-white tracking-widest">Smart Reminders</span>
      </div>

      <div className="flex flex-col gap-2">
        {reminders.map((r, i) => {
          const Icon = r.icon;
          return (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
              <div className="mt-0.5 relative">
                <Icon className="w-4 h-4" style={{ color: r.color }} />
                {i === 0 && <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-white font-medium group-hover:text-white transition-colors">{r.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
