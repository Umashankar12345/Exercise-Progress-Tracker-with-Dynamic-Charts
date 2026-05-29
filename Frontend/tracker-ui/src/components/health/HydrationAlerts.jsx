import React from 'react';
import { BellRing, Activity } from 'lucide-react';

export default function HydrationAlerts() {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-3">
      <div className="p-3 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex gap-3 items-start relative overflow-hidden group cursor-pointer hover:bg-[#3B82F6]/20 transition-colors">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#3B82F6]" />
        <div className="mt-0.5">
          <BellRing className="w-4 h-4 text-[#3B82F6] animate-[wiggle_1s_ease-in-out_infinite]" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white mb-1">Drink Water Now</span>
          <p className="text-[10px] text-v2-soft-gray">You just finished a 45min HIIT session. Hydrate immediately.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2 rounded bg-black/20 border border-white/5">
        <Activity className="w-3 h-3 text-v2-soft-gray" />
        <span className="text-[9px] text-v2-soft-gray font-medium">Sweat loss estimated at 600ml.</span>
      </div>
    </div>
  );
}
