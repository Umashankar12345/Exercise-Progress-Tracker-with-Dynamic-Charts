import React from 'react';
import { Trophy, Users } from 'lucide-react';

export default function CommunityChallengeSystem() {
  const challenges = [
    { title: '10K Steps Daily', participants: '1.2k', progress: 75, color: '#22D3EE' },
    { title: '30-Day HIIT', participants: '850', progress: 30, color: '#EF4444' },
  ];

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Active Challenges</span>
        </div>
        <span className="text-[9px] font-bold text-[#3B82F6] cursor-pointer hover:underline uppercase tracking-widest">View All</span>
      </div>

      <div className="flex flex-col gap-3">
        {challenges.map((c, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-white">{c.title}</span>
              <div className="flex items-center gap-1 text-[9px] font-bold text-v2-soft-gray uppercase tracking-widest">
                <Users className="w-3 h-3" /> {c.participants}
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000 group-hover:brightness-125" style={{ width: `${c.progress}%`, backgroundColor: c.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
