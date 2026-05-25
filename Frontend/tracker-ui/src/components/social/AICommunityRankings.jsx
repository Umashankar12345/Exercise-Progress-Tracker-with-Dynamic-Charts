import React, { useState, useEffect } from 'react';
import { Trophy, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import useStore from '../../store/useStore';
import GlobalLoader from './../ui/GlobalLoader';

export default function AICommunityRankings() {
  const { arenaLeaderboard, fetchArenaLeaderboard } = useStore();
  const [loading, setLoading] = useState(arenaLeaderboard.length === 0);

  useEffect(() => {
    const initFetch = async () => {
      if (arenaLeaderboard.length === 0) setLoading(true);
      await fetchArenaLeaderboard();
      setLoading(false);
    };
    initFetch();
  }, [fetchArenaLeaderboard]);

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ChevronUp className="w-3 h-3 text-[#22C55E]" />;
    if (trend === 'down') return <ChevronDown className="w-3 h-3 text-[#EF4444]" />;
    return <Minus className="w-3 h-3 text-v2-soft-gray" />;
  };

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#FACC15]" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Global Top 5%</span>
        </div>
        <span className="text-[9px] text-v2-soft-gray uppercase tracking-widest">AI Ranked</span>
      </div>

      {loading ? (
        <div className="py-8">
          <GlobalLoader text="Calculating Ranks..." />
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-4 relative z-10">
          {arenaLeaderboard.slice(0, 5).map((r, i) => (
            <div key={i} className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${r.isUser ? 'bg-[#3B82F6]/10 border border-[#3B82F6]/30' : 'hover:bg-white/5 border border-transparent'}`}>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-black w-4 text-center ${r.rank <= 3 ? 'text-white' : 'text-v2-soft-gray'}`}>
                  {r.rank}
                </span>
                <div className="flex flex-col">
                  <span className={`text-[11px] font-bold ${r.isUser ? 'text-[#3B82F6]' : 'text-white'}`}>{r.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-white">{r.score}</span>
                {getTrendIcon(r.trend)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
