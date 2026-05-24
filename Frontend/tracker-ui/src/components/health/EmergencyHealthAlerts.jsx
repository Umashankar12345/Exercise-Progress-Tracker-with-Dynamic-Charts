import React from 'react';
import { AlertOctagon, HeartPulse } from 'lucide-react';

export default function EmergencyHealthAlerts() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center">
      <div className="relative mb-3">
        <div className="absolute inset-0 bg-[#EF4444] blur-lg opacity-20 rounded-full animate-pulse" />
        <AlertOctagon className="w-8 h-8 text-[#EF4444] relative z-10" />
      </div>
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-2">Abnormal HR Detected</h4>
      <p className="text-[9px] text-v2-soft-gray mb-4">
        Your heart rate spiked to 140 BPM while inactive for 10 minutes.
      </p>
      <div className="flex w-full gap-2">
        <button className="flex-1 bg-[#EF4444]/10 border border-[#EF4444]/30 py-2 rounded-lg hover:bg-[#EF4444]/20 transition-all">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#EF4444]">I'm OK</span>
        </button>
        <button className="flex-1 bg-white/5 border border-white/10 py-2 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-1">
          <HeartPulse className="w-3 h-3 text-white" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-white">Log ECG</span>
        </button>
      </div>
    </div>
  );
}
