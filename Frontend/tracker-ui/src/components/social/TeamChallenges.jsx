import React, { useEffect } from 'react';
import { Shield, Zap } from 'lucide-react';
import useStore from '../../store/useStore';

export default function TeamChallenges() {
  const { arenaLeaderboard, fetchArenaLeaderboard } = useStore();

  useEffect(() => {
    if (arenaLeaderboard.length === 0) {
      fetchArenaLeaderboard();
    }
  }, [fetchArenaLeaderboard, arenaLeaderboard.length]);

  const userRankData = arenaLeaderboard.find(r => r.isUser);
  const userRank = userRankData ? userRankData.rank : '--';
  const userScore = userRankData ? userRankData.score : '--';

  return (
    <div className="w-full rounded-2xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/5 p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6] opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity" />
      
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <Shield className="w-4 h-4 text-[#8B5CF6]" />
        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Squad League</span>
      </div>

      <div className="flex items-center justify-between mb-2 relative z-10">
        <span className="text-sm font-black text-white">Iron Core Squad</span>
        <span className="text-xs font-bold text-[#22C55E]">Rank #{userRank}</span>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 mt-4 relative z-10">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-widest text-v2-soft-gray font-bold mb-1">Squad XP</span>
          <span className="text-xs font-black text-white flex items-center gap-1"><Zap className="w-3 h-3 text-[#FACC15]" /> {userScore}</span>
        </div>
        <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-[9px] uppercase font-bold text-white tracking-widest border border-white/10">
          View Hub
        </button>
      </div>
    </div>
  );
}
