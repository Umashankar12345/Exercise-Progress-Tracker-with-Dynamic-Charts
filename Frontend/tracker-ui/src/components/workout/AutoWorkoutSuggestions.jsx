import React from 'react';
import { ArrowRight, Wind } from 'lucide-react';

export default function AutoWorkoutSuggestions() {
  const suggestions = [
    { title: 'Active Recovery Yoga', duration: '20 min', type: 'Recovery', color: '#10B981' },
    { title: 'Zone 2 Cycling', duration: '45 min', type: 'Cardio', color: '#3B82F6' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center gap-3">
      <div className="flex items-center gap-2 mb-1">
        <Wind className="w-4 h-4 text-v2-soft-gray" />
        <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">Recommended Next</span>
      </div>
      {suggestions.map((s, i) => (
        <div key={i} className="group cursor-pointer flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-white group-hover:text-[#00F5FF] transition-colors">{s.title}</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/50 font-bold uppercase tracking-widest" style={{ color: s.color }}>
                {s.type}
              </span>
              <span className="text-[9px] text-v2-soft-gray font-mono">{s.duration}</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-v2-soft-gray group-hover:text-white transition-colors group-hover:translate-x-1" />
        </div>
      ))}
    </div>
  );
}
