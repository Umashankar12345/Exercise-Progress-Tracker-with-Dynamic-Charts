import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Watch } from 'lucide-react';

export default function LiveActivityFeedOverlay() {
  const [feed, setFeed] = useState([
    { id: 1, type: 'workout', text: 'Alex completed HIIT workout', icon: <Flame className="w-3 h-3 text-[#EC4899]" /> },
  ]);

  const activities = [
    { type: 'streak', text: 'Sarah reached 15-day streak', icon: <Trophy className="w-3 h-3 text-[#8B5CF6]" /> },
    { type: 'sync', text: 'John synced Fitbit Data', icon: <Watch className="w-3 h-3 text-[#00F5FF]" /> },
    { type: 'workout', text: 'Mike hit a new PR', icon: <Flame className="w-3 h-3 text-[#EC4899]" /> },
  ];

  useEffect(() => {
    let count = 0;
    const int = setInterval(() => {
      if (count < activities.length) {
        const nextActivity = activities[count];
        setFeed(prev => [nextActivity, ...prev].slice(0, 3));
        count++;
      } else {
        clearInterval(int);
      }
    }, 3000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="absolute bottom-12 left-12 w-64 flex flex-col gap-2 z-20">
      {feed.map((item) => {
        if (!item) return null;
        return (
          <div 
            key={item.id || item.text} 
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0F172A]/70 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] animate-in slide-in-from-left fade-in duration-500"
          >
            <div className="p-1.5 rounded-md bg-white/5 border border-white/10">
              {item.icon}
            </div>
            <span className="text-[10px] font-bold text-white tracking-wide">{item.text}</span>
          </div>
        );
      })}
    </div>
  );
}
