import React from 'react';
import { Calendar } from 'lucide-react';

export default function WorkoutSplitPlanner() {
  const week = [
    { day: 'Mon', type: 'Push', status: 'done' },
    { day: 'Tue', type: 'Pull', status: 'done' },
    { day: 'Wed', type: 'Legs', status: 'today' },
    { day: 'Thu', type: 'Rest', status: 'upcoming' },
    { day: 'Fri', type: 'Push', status: 'upcoming' },
    { day: 'Sat', type: 'Pull', status: 'upcoming' },
    { day: 'Sun', type: 'Legs', status: 'upcoming' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">Active Split</span>
        <span className="text-xs font-black text-[#00F5FF]">PPL 6-Day</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {week.map((d, i) => (
          <div key={i} className={`flex flex-col items-center justify-center p-1 rounded-md border ${
            d.status === 'done' ? 'bg-[#3B82F6]/20 border-[#3B82F6]/50' : 
            d.status === 'today' ? 'bg-[#00F5FF]/20 border-[#00F5FF] shadow-[0_0_10px_rgba(0,245,255,0.3)]' : 
            'bg-white/5 border-white/5 opacity-50'
          }`}>
            <span className="text-[8px] uppercase tracking-wider text-v2-soft-gray mb-1">{d.day}</span>
            <span className={`text-[9px] font-bold ${d.status === 'done' ? 'text-[#3B82F6]' : d.status === 'today' ? 'text-[#00F5FF]' : 'text-white'}`}>{d.type}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Calendar className="w-3 h-3 text-v2-soft-gray" />
        <span className="text-[10px] text-v2-soft-gray">You are on week 4 of this cycle.</span>
      </div>
    </div>
  );
}
