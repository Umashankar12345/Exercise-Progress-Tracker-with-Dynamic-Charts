import React, { useState } from 'react';
import { Target, Users, Loader2, Check, ArrowRight } from 'lucide-react';
import useStore from '../../store/useStore';
import { toast } from 'react-hot-toast';

export default function LiveCommunityChallenges() {
  const { joinedChallenges, joinChallenge } = useStore();
  const [loadingId, setLoadingId] = useState(null);

  const challenges = [
    { id: 1, title: 'Global 100K Steps', participants: '12.4k', progress: 85, color: '#22D3EE', timeLeft: '2 days' },
    { id: 2, title: '30-Day HIIT Burn', participants: '8.2k', progress: 42, color: '#EF4444', timeLeft: '14 days' },
  ];

  const handleToggleJoin = async (e, id, title) => {
    e.stopPropagation();
    setLoadingId(id);
    try {
      const data = await joinChallenge(id);
      if (data.status === 'joined') {
        toast.success(`Joined challenge: ${title}! Let's do this! 💪`);
      } else {
        toast.success(`Left challenge: ${title}`);
      }
    } catch (err) {
      toast.error('Failed to update challenge status.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#22D3EE]" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Challenges</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {challenges.map((c) => {
          const isJoined = joinedChallenges.includes(c.id);
          const isLoading = loadingId === c.id;

          return (
            <div 
              key={c.id} 
              onClick={(e) => handleToggleJoin(e, c.id, c.title)}
              className={`flex flex-col gap-3 p-3 rounded-xl bg-black/20 border transition-all duration-300 group cursor-pointer ${
                isJoined 
                  ? 'border-[#22D3EE]/40 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white mb-1">{c.title}</span>
                  <div className="flex items-center gap-2 text-[9px] text-v2-soft-gray uppercase tracking-widest font-bold">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.participants}</span>
                    <span>•</span>
                    <span>{c.timeLeft}</span>
                  </div>
                </div>

                <button 
                  disabled={isLoading}
                  onClick={(e) => handleToggleJoin(e, c.id, c.title)}
                  className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1 border ${
                    isJoined
                      ? 'bg-[#10B981]/25 border-[#10B981]/50 text-[#10B981]'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  } disabled:opacity-50`}
                >
                  {isLoading ? (
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  ) : isJoined ? (
                    <>
                      <Check className="w-2.5 h-2.5" /> Joined
                    </>
                  ) : (
                    <>
                      Join <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
              
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000 group-hover:brightness-125" style={{ width: `${c.progress}%`, backgroundColor: c.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
