import React from 'react';
import { CheckCircle, AlertCircle, Dumbbell, Activity, Battery, Flame } from 'lucide-react';

export default function WorkoutDayCell({ data }) {
  const { day, currentMonth, type, status, isToday } = data;

  const getTypeColor = (t) => {
    switch(t) {
      case 'Cardio': return 'bg-[#22D3EE]/20 border-[#22D3EE]/30 text-[#22D3EE]';
      case 'Strength': return 'bg-[#8B5CF6]/20 border-[#8B5CF6]/30 text-[#8B5CF6]';
      case 'Recovery': return 'bg-[#22C55E]/20 border-[#22C55E]/30 text-[#22C55E]';
      case 'HIIT': return 'bg-[#EF4444]/20 border-[#EF4444]/30 text-[#EF4444]';
      case 'Yoga': return 'bg-[#3B82F6]/20 border-[#3B82F6]/30 text-[#3B82F6]';
      default: return 'bg-white/5 border-white/5 text-v2-soft-gray';
    }
  };

  const getIcon = (t) => {
    switch(t) {
      case 'Cardio': return <Activity className="w-3 h-3" />;
      case 'Strength': return <Dumbbell className="w-3 h-3" />;
      case 'Recovery': return <Battery className="w-3 h-3" />;
      case 'HIIT': return <Flame className="w-3 h-3" />;
      case 'Yoga': return <Activity className="w-3 h-3" />;
      default: return null;
    }
  };

  if (!currentMonth) {
    return <div className="rounded-lg p-2 opacity-30 border border-transparent" />;
  }

  return (
    <div className={`relative flex flex-col rounded-xl border p-2 transition-all cursor-pointer hover:border-white/20 group ${
      isToday ? 'bg-[#0F172A] border-[#22D3EE]/50 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'bg-black/20 border-white/5'
    }`}>
      {isToday && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#22D3EE] rounded-b-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
      
      <span className={`text-[10px] font-bold ${isToday ? 'text-white' : 'text-v2-soft-gray'}`}>{day}</span>
      
      <div className="flex-1 mt-1 flex flex-col gap-1 justify-end">
        {type && (
          <div className={`w-full rounded p-1.5 flex items-center justify-between border ${getTypeColor(type)}`}>
            <div className="flex items-center gap-1">
              {getIcon(type)}
              <span className="text-[9px] uppercase font-bold tracking-widest hidden lg:block truncate">{type}</span>
            </div>
            {status === 'completed' && <CheckCircle className="w-3 h-3 shrink-0" />}
            {status === 'missed' && <AlertCircle className="w-3 h-3 text-[#F97316] shrink-0" />}
          </div>
        )}
      </div>
    </div>
  );
}
