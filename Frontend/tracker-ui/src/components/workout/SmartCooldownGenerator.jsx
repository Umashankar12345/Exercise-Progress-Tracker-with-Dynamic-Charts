import React from 'react';
import { Moon, Wind } from 'lucide-react';

export default function SmartCooldownGenerator() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center">
      <div className="relative mb-3">
        <div className="absolute inset-0 bg-[#3B82F6] blur-lg opacity-20 rounded-full animate-pulse" />
        <Moon className="w-8 h-8 text-[#3B82F6] relative z-10" />
      </div>
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-2">CNS Down-Regulation</h4>
      <p className="text-[9px] text-v2-soft-gray max-w-[200px] mb-4">
        Your HR is still elevated. We recommend a 5-minute box breathing protocol to shift into a parasympathetic state.
      </p>
      <button className="flex items-center gap-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 px-4 py-2 rounded-lg hover:bg-[#3B82F6]/20 transition-all group">
        <Wind className="w-3.5 h-3.5 text-[#3B82F6] group-hover:scale-110 transition-transform" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#3B82F6]">Start Breathing</span>
      </button>
    </div>
  );
}
