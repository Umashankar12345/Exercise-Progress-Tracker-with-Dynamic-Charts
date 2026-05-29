import React, { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';

export default function LiveCommunityEvents() {
  const [liveCount, setLiveCount] = useState(482);

  useEffect(() => {
    const int = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 2000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-[#3B82F6]/20 bg-[#3B82F6]/5 p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#3B82F6] opacity-10 blur-2xl rounded-full" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
             <Radio className="w-4 h-4 text-[#3B82F6]" />
             <div className="absolute inset-0 bg-[#3B82F6] rounded-full blur-md opacity-40 animate-pulse" />
          </div>
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Live Events</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#EF4444]/10 border border-[#EF4444]/30">
          <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
          <span className="text-[9px] font-bold text-[#EF4444] tracking-widest">{liveCount} Online</span>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl bg-[#0F172A] border border-white/5 group-hover:border-white/20 transition-colors cursor-pointer">
         <div className="flex flex-col">
            <span className="text-xs font-bold text-white mb-0.5">Global HIIT Sesh</span>
            <span className="text-[9px] text-v2-soft-gray font-bold uppercase tracking-widest">Starting in 04:22</span>
         </div>
         <button className="px-3 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] transition-colors text-[9px] uppercase font-bold tracking-widest text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            Join
         </button>
      </div>
    </div>
  );
}
