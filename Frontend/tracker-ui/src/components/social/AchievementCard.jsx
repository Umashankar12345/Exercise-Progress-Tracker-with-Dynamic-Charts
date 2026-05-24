import React from 'react';

export default function AchievementCard({ achievement }) {
  const Icon = achievement.icon;
  return (
    <div className="w-full relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#0F172A] to-black p-6 flex flex-col items-center justify-center text-center group">
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ backgroundColor: achievement.color }}
      />
      
      <div 
        className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-4 relative z-10 shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500"
        style={{ backgroundColor: `${achievement.color}15`, borderColor: `${achievement.color}50` }}
      >
        <Icon className="w-8 h-8" style={{ color: achievement.color }} />
      </div>
      
      <h4 className="text-lg font-black text-white mb-2 relative z-10 uppercase tracking-wide">
        {achievement.title}
      </h4>
      <p className="text-xs text-v2-soft-gray max-w-[250px] relative z-10">
        {achievement.description}
      </p>
    </div>
  );
}
