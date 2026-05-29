import React from 'react';

export default function SmartPostureDetection() {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">Spinal Alignment</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold uppercase tracking-widest border border-[#10B981]/30">Good</span>
      </div>

      <div className="flex justify-center items-center h-20">
        {/* Abstract spine representation */}
        <div className="flex flex-col gap-1 items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-8 h-2 rounded bg-[#00F5FF] opacity-80 shadow-[0_0_5px_rgba(0,245,255,0.5)]" />
          ))}
        </div>
      </div>

      <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase mt-2 border-t border-white/5 pt-2">
        <div className="flex flex-col">
          <span className="text-v2-soft-gray">Sitting</span>
          <span className="text-[#EF4444]">4h 20m</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-v2-soft-gray">Standing</span>
          <span className="text-[#10B981]">1h 15m</span>
        </div>
      </div>
    </div>
  );
}
