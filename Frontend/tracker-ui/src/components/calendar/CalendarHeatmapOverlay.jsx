import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import api from '../../api/axios';

export default function CalendarHeatmapOverlay() {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    api.get('/workouts/heatmap')
      .then(res => {
        setHeatmapData(res.data || []);
      })
      .catch(err => {
        console.error("Failed to load calendar intensity heatmap", err);
      });
  }, []);

  // Generate 35 days (5 weeks) ending today
  const days = Array.from({ length: 35 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    const dateString = d.toLocaleDateString('sv'); // YYYY-MM-DD
    
    const realDay = heatmapData.find(h => h.date === dateString);
    
    return {
      date: dateString,
      level: realDay ? Math.min(Math.ceil(realDay.count), 4) : 0,
      calories: realDay ? Math.round(realDay.calories) : 0,
      count: realDay ? realDay.count : 0
    };
  });

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getIntensityColor = (level) => {
    switch(level) {
      case 4: return 'bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.5)]'; // High
      case 3: return 'bg-[#22C55E]/80';
      case 2: return 'bg-[#22C55E]/50';
      case 1: return 'bg-[#22C55E]/30';
      default: return 'bg-white/5 border border-white/5'; // 0
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-[#22C55E]" />
        <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">30-Day Intensity Map</span>
      </div>
      
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2">
        {weeks.map((week, wIndex) => (
          <div key={wIndex} className="flex flex-col gap-1.5">
            {week.map((day, dIndex) => (
              <div 
                key={dIndex} 
                className={`w-4 h-4 rounded-sm transition-all hover:scale-110 cursor-pointer ${getIntensityColor(day.level)}`} 
                title={`${day.date}: Level ${day.level} (${day.count} workouts, ${day.calories} kcal)`}
              />
            ))}
          </div>
        ))}
        
        {/* Heatmap Legend */}
        <div className="ml-auto flex items-end">
           <div className="flex flex-col gap-1.5 justify-end">
             <div className="flex items-center gap-1.5 ml-4">
                <span className="text-[8px] uppercase tracking-widest text-v2-soft-gray font-bold mr-1">Less</span>
                <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/5" />
                <div className="w-3 h-3 rounded-sm bg-[#22C55E]/30" />
                <div className="w-3 h-3 rounded-sm bg-[#22C55E]/50" />
                <div className="w-3 h-3 rounded-sm bg-[#22C55E]/80" />
                <div className="w-3 h-3 rounded-sm bg-[#22C55E] shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                <span className="text-[8px] uppercase tracking-widest text-v2-soft-gray font-bold ml-1">More</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
