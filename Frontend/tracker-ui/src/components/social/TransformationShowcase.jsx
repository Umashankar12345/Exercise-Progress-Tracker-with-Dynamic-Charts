import React, { useState } from 'react';
import { Camera, Sparkles } from 'lucide-react';

export default function TransformationShowcase() {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="w-full rounded-2xl border border-[#3B82F6]/20 bg-[#3B82F6]/5 p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#3B82F6]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Transformations</span>
        </div>
        <div className="flex items-center gap-1 bg-[#3B82F6]/20 px-2 py-1 rounded text-[9px] text-[#3B82F6] font-bold uppercase tracking-widest">
           <Sparkles className="w-3 h-3" /> AI Enhanced
        </div>
      </div>

      <div 
        className="relative w-full h-48 bg-black/40 rounded-xl overflow-hidden cursor-ew-resize border border-white/5"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pos = ((e.clientX - rect.left) / rect.width) * 100;
          setSliderPos(pos);
        }}
      >
        {/* Placeholder Before Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
           <span className="text-white/30 font-bold uppercase tracking-widest absolute left-4 bottom-4">Before (210 lbs)</span>
        </div>
        
        {/* Placeholder After Image */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/40 to-[#8B5CF6]/40 flex items-center justify-center"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
           <span className="text-white font-bold uppercase tracking-widest absolute right-4 bottom-4">After (175 lbs)</span>
        </div>

        {/* Slider Line */}
        <div className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ left: `calc(${sliderPos}% - 2px)` }}>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#3B82F6] flex items-center justify-center shadow-lg">
             <div className="w-1 h-3 border-l border-r border-[#3B82F6]/50" />
           </div>
        </div>
      </div>
    </div>
  );
}
