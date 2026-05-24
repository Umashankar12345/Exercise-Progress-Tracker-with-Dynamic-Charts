import React from 'react';
import { Bot } from 'lucide-react';
import useStore from '../store/useStore';

// Components
import AIFatiguePrediction from '../components/intelligence/AIFatiguePrediction';
import AIConsistencyAnalyzer from '../components/intelligence/AIConsistencyAnalyzer';
import AIDietPlanner from '../components/intelligence/AIDietPlanner';
import AIFitnessTwin from '../components/intelligence/AIFitnessTwin';
import AIInjuryPrevention from '../components/intelligence/AIInjuryPrevention';
import AIEmotionalHealth from '../components/intelligence/AIEmotionalHealth';
import AIVoiceCoach from '../components/intelligence/AIVoiceCoach';
import AIFitnessForecast from '../components/intelligence/AIFitnessForecast';

export default function AIFitnessIntelligence() {
  const { user } = useStore();

  return (
    <div className="min-h-screen bg-[#050816] text-v2-text-white flex flex-col gap-6 pb-12 p-4 md:p-8 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-[#0F172A]/80 border border-white/10 shadow-[0_0_40px_rgba(239,68,68,0.03)] backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
              <Bot className="w-5 h-5 text-[#EF4444]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-widest uppercase">AI Intelligence Engine</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
                 <span className="text-[10px] text-[#EF4444] font-bold uppercase tracking-widest">Predictive Models Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6">
        
        {/* Left Column: Predictive Engines & Diet (3 cols) */}
        <div className="flex flex-col xl:col-span-4 gap-6">
          <AIFatiguePrediction />
          <AIConsistencyAnalyzer />
          <AIDietPlanner />
        </div>

        {/* Center Column: Fitness Twin & Biomechanics (5 cols) */}
        <div className="flex flex-col xl:col-span-5 gap-6">
          <AIFitnessTwin />
          <div className="grid grid-cols-2 gap-6">
            <AIInjuryPrevention />
            <AIEmotionalHealth />
          </div>
        </div>

        {/* Right Column: Coaching & Forecasts (3 cols) */}
        <div className="flex flex-col xl:col-span-3 gap-6">
          <AIVoiceCoach />
          <AIFitnessForecast />
        </div>

      </div>
    </div>
  );
}
