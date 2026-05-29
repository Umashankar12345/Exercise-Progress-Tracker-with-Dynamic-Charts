import React from 'react';
import { Lightbulb, AlertTriangle } from 'lucide-react';

export default function SmartExerciseSuggestions() {
  const suggestions = [
    { title: 'Swap Bench Press', reason: 'High fatigue detected in Anterior Deltoids.', alternative: 'Dumbbell Floor Press' },
    { title: 'Lower Intensity', reason: 'HRV is 12% below baseline.', alternative: 'Reduce working weight by 5%' },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-3 justify-center">
      {suggestions.map((s, i) => (
        <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#EC4899] opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-3.5 h-3.5 text-[#00F5FF]" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{s.title}</span>
          </div>
          <p className="text-[10px] text-v2-soft-gray mb-2">{s.reason}</p>
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-[#0F172A] border border-[#3B82F6]/30">
            <AlertTriangle className="w-3 h-3 text-[#3B82F6]" />
            <span className="text-[9px] font-bold text-[#3B82F6] uppercase tracking-widest">Suggest: {s.alternative}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
