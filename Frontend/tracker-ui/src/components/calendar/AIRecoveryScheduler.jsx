import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function AIRecoveryScheduler() {
  return (
    <div className="w-full rounded-2xl border border-[#F97316]/30 bg-[#F97316]/10 p-5 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#F97316]" />
      
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-5 h-5 text-[#F97316] animate-[pulse_2s_ease-in-out_infinite]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-white">Recovery Warning</span>
        </div>
      </div>

      <p className="text-[11px] text-v2-soft-gray mb-4 leading-relaxed">
        You scheduled a <strong className="text-white">Heavy Leg Day</strong> for tomorrow, but your sleep score dropped to <strong className="text-[#EF4444]">42%</strong> and HRV is depressed.
      </p>

      <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all">
        <RefreshCw className="w-3.5 h-3.5 text-[#3B82F6]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6]">Auto-Adjust Schedule</span>
      </button>
    </div>
  );
}
