import React from 'react';

export default function NutritionAnalytics() {
  const macros = [
    { name: 'Protein', current: 140, goal: 160, color: '#EC4899' },
    { name: 'Carbs', current: 210, goal: 280, color: '#3B82F6' },
    { name: 'Fats', current: 55, goal: 70, color: '#F59E0B' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center gap-4">
      {macros.map((m, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white" style={{ color: m.color }}>{m.name}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-black text-white">{m.current}g</span>
              <span className="text-[9px] text-v2-soft-gray font-bold">/ {m.goal}g</span>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(m.current / m.goal) * 100}%`, backgroundColor: m.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}
