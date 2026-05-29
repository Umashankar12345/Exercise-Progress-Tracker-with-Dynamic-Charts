import React from 'react';

export default function MoodAnalytics() {
  const days = [
    { day: 'M', score: 8 },
    { day: 'T', score: 6 },
    { day: 'W', score: 9 },
    { day: 'T', score: 4 },
    { day: 'F', score: 7 },
    { day: 'S', score: 10 },
    { day: 'S', score: 9 },
  ];

  const getColor = (score) => {
    if (score >= 8) return 'bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.5)]';
    if (score >= 6) return 'bg-[#00F5FF] shadow-[0_0_10px_rgba(0,245,255,0.5)]';
    if (score >= 4) return 'bg-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.5)]';
    return 'bg-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  };

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest mb-4">7-Day Mood Heatmap</div>
      
      <div className="flex justify-between items-end h-16">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={`w-3 rounded-full ${getColor(d.score)}`} style={{ height: `${d.score * 10}%` }} />
            <span className="text-[8px] uppercase tracking-widest font-bold text-v2-soft-gray">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
