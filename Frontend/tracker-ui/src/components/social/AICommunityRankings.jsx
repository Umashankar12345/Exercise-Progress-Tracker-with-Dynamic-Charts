import React, { useState, useEffect } from 'react';
import { Trophy, ChevronUp, ChevronDown, Minus, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function AICommunityRankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      const token = localStorage.getItem('auth_token');
      try {
        const { data } = await axios.get('http://172.21.133.28:8000/api/leaderboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRankings(data);
      } catch (err) {
        console.error('Error fetching rankings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, []);

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
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-5 h-5 text-[#FACC15] animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {rankings.map((r, i) => (
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
