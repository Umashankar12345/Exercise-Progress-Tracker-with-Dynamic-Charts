import React from 'react';
import { PlayCircle, Maximize2 } from 'lucide-react';

export default function ExerciseVideoDemos() {
  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="relative w-full h-32 bg-[#050816] rounded-xl border border-white/10 overflow-hidden group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        {/* Placeholder for actual video element */}
        <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity z-20">
          <PlayCircle className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </div>
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4 text-white" />
        </div>
        <div className="absolute bottom-2 left-3 z-20">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#00F5FF]">Squat Form Check</span>
        </div>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {['Setup', 'Descent', 'Drive', 'Breathing'].map((step, i) => (
          <div key={i} className="flex-shrink-0 px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] text-v2-soft-gray uppercase font-bold tracking-widest whitespace-nowrap hover:bg-white/10 transition-colors cursor-pointer">
            {i + 1}. {step}
          </div>
        ))}
      </div>
    </div>
  );
}
