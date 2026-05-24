import React from 'react';
import { Server, Wifi, Activity } from 'lucide-react';

export default function ProductionRealtimeHud() {
  return (
    <div className="w-full rounded-b-2xl border-t border-white/5 bg-[#050816]/90 p-3 flex justify-between items-center backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
          <span className="text-[9px] uppercase font-bold tracking-widest text-v2-soft-gray">System Online</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-1">
          <Wifi className="w-3 h-3 text-[#3B82F6]" />
          <span className="text-[9px] font-mono text-[#3B82F6]">WSS OK</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Server className="w-3 h-3 text-v2-soft-gray" />
          <span className="text-[9px] font-mono text-v2-soft-gray">42ms ping</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-v2-soft-gray" />
          <span className="text-[9px] font-mono text-v2-soft-gray">AI Model v2.4</span>
        </div>
      </div>
    </div>
  );
}
