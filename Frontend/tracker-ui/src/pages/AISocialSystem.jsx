import React from 'react';
import { Users, Swords } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import useStore from '../store/useStore';

// Components
import FitnessFeed from '../components/social/FitnessFeed';
import AICommunityRankings from '../components/social/AICommunityRankings';
import LiveCommunityChallenges from '../components/social/LiveCommunityChallenges';
import TeamChallenges from '../components/social/TeamChallenges';

export default function AISocialSystem() {
  const { user, fetchSocialState } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'community';

  React.useEffect(() => {
    fetchSocialState();
  }, [fetchSocialState]);

  const setTab = (tabName) => {
    if (tabName === 'community') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tabName });
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-v2-text-white flex flex-col gap-6 pb-12 p-4 md:p-8 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-[#0F172A]/80 border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.03)] backdrop-blur-xl gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20">
              <Users className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-widest uppercase">Global Fitness Network</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                 <span className="text-[10px] text-[#10B981] font-bold uppercase tracking-widest">Network Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Glassmorphic Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1 bg-[#0A0F1D]/80 border border-white/5 rounded-xl self-stretch md:self-auto">
          <button
            onClick={() => setTab('community')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex-1 md:flex-initial ${
              activeTab === 'community'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/15 border border-cyan-500/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            Community
          </button>
          <button
            onClick={() => setTab('arena')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex-1 md:flex-initial ${
              activeTab === 'arena'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/15 border border-cyan-500/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Swords className="w-4 h-4" />
            Arena
          </button>
        </div>
      </div>

      {/* Community Tab Content */}
      {activeTab === 'community' && (
        <div className="flex flex-col gap-6">
          <div className="w-full xl:w-2/3 mx-auto flex flex-col gap-6">
            <FitnessFeed />
          </div>
        </div>
      )}

      {/* Arena Tab Content */}
      {activeTab === 'arena' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="flex flex-col xl:col-span-8 gap-6">
            <LiveCommunityChallenges />
          </div>
          <div className="flex flex-col xl:col-span-4 gap-6">
            <AICommunityRankings />
            <TeamChallenges />
          </div>
        </div>
      )}
    </div>
  );
}
