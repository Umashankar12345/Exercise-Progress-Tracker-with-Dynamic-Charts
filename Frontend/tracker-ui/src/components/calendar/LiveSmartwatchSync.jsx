import React, { useState, useEffect } from 'react';
import { Watch, RefreshCcw } from 'lucide-react';

export default function LiveSmartwatchSync() {
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const int = setInterval(() => {
      setSyncing(true);
      setTimeout(() => setSyncing(false), 2000);
    }, 15000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5 group cursor-pointer hover:border-white/20 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center">
            <Watch className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="flex flex-col">
             <span className="text-sm font-bold text-white">Apple Watch Ultra</span>
             <div className="flex items-center gap-1.5 mt-0.5">
               <div className={`w-1.5 h-1.5 rounded-full ${syncing ? 'bg-[#3B82F6] animate-pulse' : 'bg-[#10B981]'}`} />
               <span className="text-[9px] uppercase font-bold tracking-widest text-v2-soft-gray">
                 {syncing ? 'Syncing...' : 'Connected'}
               </span>
             </div>
          </div>
        </div>
        <RefreshCcw className={`w-4 h-4 text-v2-soft-gray group-hover:text-white transition-all ${syncing ? 'animate-spin text-[#3B82F6]' : ''}`} />
      </div>
    </div>
  );
}
