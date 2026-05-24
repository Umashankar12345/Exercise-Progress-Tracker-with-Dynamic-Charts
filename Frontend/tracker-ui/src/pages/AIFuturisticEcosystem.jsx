import React from 'react';
import { Eye } from 'lucide-react';
import useStore from '../store/useStore';

// Components
import Avatar3DSystem from '../components/futuristic/Avatar3DSystem';
import ARWorkoutMode from '../components/futuristic/ARWorkoutMode';
import SmartMirrorUI from '../components/futuristic/SmartMirrorUI';
import VRGymEnvironment from '../components/futuristic/VRGymEnvironment';
import SmartwatchSync from '../components/futuristic/SmartwatchSync';
import EmergencyHealthAlerts from '../components/futuristic/EmergencyHealthAlerts';
import AIAudioEngine from '../components/futuristic/AIAudioEngine';
import AdaptiveFitnessChallenges from '../components/futuristic/AdaptiveFitnessChallenges';
import MultiplayerWorkoutArena from '../components/futuristic/MultiplayerWorkoutArena';
import BlockchainFitnessRewards from '../components/futuristic/BlockchainFitnessRewards';

export default function AIFuturisticEcosystem() {
  const { user } = useStore();

  return (
    <div className="min-h-screen bg-[#050816] text-v2-text-white flex flex-col gap-6 pb-12 p-4 md:p-8 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-[#0F172A]/80 border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.03)] backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
              <Eye className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-widest uppercase">Immersive Ecosystem</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
                 <span className="text-[10px] text-[#8B5CF6] font-bold uppercase tracking-widest">Vision Mode Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6">
        
        {/* Left Column: Wearables & Audio (3 cols) */}
        <div className="flex flex-col xl:col-span-3 gap-6">
          <SmartwatchSync />
          <EmergencyHealthAlerts />
          <AIAudioEngine />
        </div>

        {/* Center Column: Core Immersive (6 cols) */}
        <div className="flex flex-col xl:col-span-6 gap-6">
          <Avatar3DSystem />
          <div className="grid grid-cols-2 gap-6">
             <ARWorkoutMode />
             <SmartMirrorUI />
          </div>
        </div>

        {/* Right Column: Metaverse & Rewards (3 cols) */}
        <div className="flex flex-col xl:col-span-3 gap-6">
          <VRGymEnvironment />
          <MultiplayerWorkoutArena />
          <AdaptiveFitnessChallenges />
          <BlockchainFitnessRewards />
        </div>

      </div>
    </div>
  );
}
