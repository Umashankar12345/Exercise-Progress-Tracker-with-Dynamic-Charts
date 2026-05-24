import React from 'react';
import { HeartPulse, Brain } from 'lucide-react';

export default function AIEmotionalHealth() {
  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5 relative overflow-hidden group">
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#8B5CF6] opacity-10 blur-3xl rounded-full" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#8B5CF6]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Emotional Health</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 relative z-10">
        <div className="w-12 h-12 rounded-full border-2 border-[#8B5CF6] flex items-center justify-center bg-[#8B5CF6]/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
           <HeartPulse className="w-6 h-6 text-[#8B5CF6]" />
        </div>
        <div className="flex flex-col">
           <span className="text-xs font-bold text-white mb-0.5">Stress Levels: Low</span>
           <span className="text-[10px] text-v2-soft-gray uppercase tracking-widest font-bold">Stable Mindset</span>
        </div>
      </div>

      <p className="text-[10px] text-v2-soft-gray leading-relaxed relative z-10">
        Low cortisol and steady sleep patterns indicate high mental readiness. Perfect time for a PR attempt.
      </p>
    </div>
  );
}
