import React from 'react';

export default function ActivityHeatmapV2() {
  const weeks = 12;
  const days = 7;
  
  const cells = Array.from({ length: weeks * days }, (_, i) => {
    const intensity = Math.random();
    let colorClass = 'bg-white/5'; // empty
    if (intensity > 0.8) colorClass = 'bg-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.8)]'; // high
    else if (intensity > 0.5) colorClass = 'bg-[#00F5FF]/60'; // med
    else if (intensity > 0.2) colorClass = 'bg-[#00F5FF]/30'; // low
    return colorClass;
  });

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
      <div className="flex gap-1.5">
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={`w-${w}`} className="flex flex-col gap-1.5">
            {Array.from({ length: days }).map((_, d) => (
              <div 
                key={`c-${w}-${d}`} 
                className={`w-3 h-3 rounded-[2px] transition-all hover:scale-125 hover:border hover:border-white ${cells[w * days + d]}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 text-[9px] text-v2-soft-gray uppercase tracking-widest font-bold">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 bg-white/5 rounded-[1px]" />
          <div className="w-2.5 h-2.5 bg-[#00F5FF]/30 rounded-[1px]" />
          <div className="w-2.5 h-2.5 bg-[#00F5FF]/60 rounded-[1px]" />
          <div className="w-2.5 h-2.5 bg-[#00F5FF] shadow-[0_0_5px_rgba(0,245,255,0.8)] rounded-[1px]" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
