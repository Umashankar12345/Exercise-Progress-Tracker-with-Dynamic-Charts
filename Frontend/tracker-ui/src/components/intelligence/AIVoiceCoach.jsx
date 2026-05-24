import React from 'react';
import { Mic, Headphones } from 'lucide-react';

export default function AIVoiceCoach() {
  return (
    <div className="w-full rounded-2xl border border-[#22D3EE]/30 bg-[#22D3EE]/5 p-5 relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#22D3EE] opacity-10 blur-3xl rounded-full" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-[#22D3EE]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Voice Coach</span>
        </div>
        <div className="flex items-center gap-1 bg-[#22D3EE]/10 px-2 py-1 rounded border border-[#22D3EE]/30">
           <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
           <span className="text-[9px] text-[#22D3EE] font-bold uppercase tracking-widest">Active</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center relative z-10 mb-4">
         <div className="flex items-end gap-1 h-12 mb-4">
            {/* Animated Waveform */}
            {[...Array(9)].map((_, i) => (
              <div 
                key={i} 
                className="w-1.5 rounded-full bg-[#22D3EE] animate-pulse" 
                style={{ 
                  height: `${Math.max(20, Math.random() * 100)}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.8s'
                }} 
              />
            ))}
         </div>
         <p className="text-sm font-bold text-white text-center italic">
           "Heart rate is peaking at 172 BPM. Reduce your pace by 10% for this final interval."
         </p>
      </div>

      <div className="flex items-center gap-2 mt-4 relative z-10">
        <button className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-[9px] uppercase font-bold tracking-widest text-white border border-white/10 flex items-center justify-center gap-1.5">
           <Mic className="w-3 h-3" /> Push to Talk
        </button>
      </div>
    </div>
  );
}
