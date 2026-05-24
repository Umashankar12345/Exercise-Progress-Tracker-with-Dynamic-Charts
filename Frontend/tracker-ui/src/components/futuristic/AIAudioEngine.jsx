import React from 'react';
import { Music, Radio } from 'lucide-react';

export default function AIAudioEngine() {
  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-[#8B5CF6]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">AI Audio</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/30">
          <Radio className="w-2.5 h-2.5 text-[#8B5CF6] animate-pulse" />
          <span className="text-[9px] font-bold text-[#8B5CF6] tracking-widest">130 BPM</span>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5 relative z-10 mb-4">
         <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Music className="w-5 h-5 text-white" />
         </div>
         <div className="flex flex-col">
            <span className="text-xs font-black text-white">Cyberpunk Synths</span>
            <span className="text-[9px] text-v2-soft-gray uppercase tracking-widest font-bold">Auto-matching tempo</span>
         </div>
      </div>

      <div className="flex items-end justify-between h-8 gap-1">
         {[...Array(12)].map((_, i) => (
           <div 
             key={i} 
             className="w-full rounded-t-sm bg-[#8B5CF6] animate-pulse" 
             style={{ 
               height: `${Math.max(10, Math.random() * 100)}%`,
               animationDelay: `${i * 0.05}s`,
               animationDuration: '0.4s'
             }} 
           />
         ))}
      </div>
    </div>
  );
}
