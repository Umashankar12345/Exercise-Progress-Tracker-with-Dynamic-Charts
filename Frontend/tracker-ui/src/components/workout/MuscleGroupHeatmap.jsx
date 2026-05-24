import React from 'react';
import { Activity } from 'lucide-react';

export default function MuscleGroupHeatmap() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="flex gap-4 items-end">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-[#EF4444]" />
            <span className="text-[9px] text-v2-soft-gray uppercase font-bold tracking-widest">High Fatigue (Legs)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-[#F59E0B]" />
            <span className="text-[9px] text-v2-soft-gray uppercase font-bold tracking-widest">Med Fatigue (Back)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-[#10B981]" />
            <span className="text-[9px] text-v2-soft-gray uppercase font-bold tracking-widest">Recovered (Chest)</span>
          </div>
        </div>
        
        <div className="relative w-20 h-32 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
           {/* Abstract Body Heatmap */}
           <svg viewBox="0 0 50 100" className="w-12 h-24">
             {/* Head */}
             <circle cx="25" cy="10" r="5" fill="#424754" />
             {/* Chest */}
             <rect x="15" y="20" width="20" height="15" rx="4" fill="#10B981" fillOpacity="0.8" />
             {/* Back (implied) */}
             <rect x="18" y="38" width="14" height="20" rx="4" fill="#F59E0B" fillOpacity="0.8" />
             {/* Arms */}
             <rect x="8" y="22" width="5" height="25" rx="2" fill="#424754" />
             <rect x="37" y="22" width="5" height="25" rx="2" fill="#424754" />
             {/* Legs */}
             <rect x="16" y="60" width="7" height="30" rx="3" fill="#EF4444" fillOpacity="0.9" className="animate-pulse" />
             <rect x="27" y="60" width="7" height="30" rx="3" fill="#EF4444" fillOpacity="0.9" className="animate-pulse" />
           </svg>
        </div>
      </div>
    </div>
  );
}
