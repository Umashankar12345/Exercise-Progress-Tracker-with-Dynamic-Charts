import React from 'react';
import { AlertOctagon, Phone } from 'lucide-react';

export default function EmergencyHealthAlerts() {
  return (
    <div className="w-full rounded-2xl border border-[#EF4444] bg-[#EF4444]/10 p-5 relative overflow-hidden group shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-[pulse_4s_ease-in-out_infinite]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#EF4444] opacity-20 blur-3xl rounded-full" />
      
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <AlertOctagon className="w-5 h-5 text-[#EF4444]" />
        <span className="text-xs uppercase font-black text-[#EF4444] tracking-widest">Medical Alert</span>
      </div>

      <div className="flex flex-col gap-1 mb-4 relative z-10">
         <span className="text-[10px] text-v2-soft-gray uppercase tracking-widest font-bold">O2 Saturation Drop</span>
         <span className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">89%</span>
      </div>

      <p className="text-[10px] text-white/80 font-bold mb-4 relative z-10">
         Auto-pausing workout. Please sit down and initiate breathing protocol.
      </p>

      <button className="w-full py-3 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] transition-colors text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2">
         <Phone className="w-3 h-3" /> Call Emergency Contact
      </button>
    </div>
  );
}
