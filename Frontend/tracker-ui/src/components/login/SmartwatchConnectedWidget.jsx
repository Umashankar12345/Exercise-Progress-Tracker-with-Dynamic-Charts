import React, { useState, useEffect } from 'react';
import { Watch, RefreshCw } from 'lucide-react';

export default function SmartwatchConnectedWidget() {
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const int = setInterval(() => {
      setSyncing(true);
      setTimeout(() => setSyncing(false), 800);
    }, 4000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="absolute top-12 right-12 px-4 py-3 rounded-xl bg-[#0F172A]/70 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-right-4 duration-1000 z-20 flex items-center gap-3">
      <div className="relative">
        <Watch className="w-5 h-5 text-white" />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#10b981] rounded-full border-2 border-[#0F172A]" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Apple Watch Ultra</span>
        <div className="flex items-center gap-1 mt-0.5">
          <RefreshCw className={`w-3 h-3 text-v2-soft-gray ${syncing ? 'animate-spin text-[#00F5FF]' : ''}`} />
          <span className="text-[9px] text-v2-soft-gray uppercase tracking-widest font-bold">
            {syncing ? 'Syncing...' : 'Last sync: 2s ago'}
          </span>
        </div>
      </div>
    </div>
  );
}
