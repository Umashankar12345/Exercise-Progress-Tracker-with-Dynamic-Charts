import React from 'react';
import { Users, Trophy, ChevronUp } from 'lucide-react';

export default function CommunityFeed() {
  const feed = [
    { id: 1, user: 'Alex M.', action: 'crushed a new PR', detail: '120kg Bench Press', time: '2m ago', isPR: true },
    { id: 2, user: 'Sarah K.', action: 'completed', detail: 'Leg Day Annihilation', time: '14m ago', isPR: false },
    { id: 3, user: 'David W.', action: 'hit a weekly streak of', detail: '5 workouts', time: '1h ago', isPR: false },
  ];

  const leaderboard = [
    { rank: 1, user: 'Marcus T.', volume: '18,400 kg', trend: 'up' },
    { rank: 2, user: 'Alex M.', volume: '16,250 kg', trend: 'up' },
    { rank: 3, user: 'Elena R.', volume: '15,900 kg', trend: 'down' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Live Activity Feed */}
      <div className="glass-card p-6 border border-zinc-800/60 bg-zinc-900/40">
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-4">
          <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
            <Users className="w-5 h-5 text-zinc-400" />
            Live Network Activity
          </h3>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        
        <div className="flex flex-col gap-4">
          {feed.map(item => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                <span className="text-xs font-bold text-zinc-300">{item.user.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-zinc-300">
                  <strong className="text-white">{item.user}</strong> {item.action}
                </p>
                <div className={`text-xs font-bold mt-0.5 ${item.isPR ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {item.detail}
                </div>
              </div>
              <span className="text-[10px] font-medium text-zinc-500 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Leaderboard */}
      <div className="glass-card p-6 border border-zinc-800/60 bg-zinc-900/40">
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-4">
          <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Weekly Volume Elite
          </h3>
        </div>
        
        <div className="flex flex-col gap-3">
          {leaderboard.map((item) => (
            <div key={item.rank} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50 group hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`w-6 text-center text-xs font-black ${item.rank === 1 ? 'text-amber-500' : item.rank === 2 ? 'text-zinc-300' : 'text-amber-700'}`}>
                  {item.rank}
                </span>
                <span className="text-sm font-bold text-white">{item.user}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-primary">{item.volume}</span>
                {item.trend === 'up' ? (
                  <ChevronUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-red-500 rotate-180" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
