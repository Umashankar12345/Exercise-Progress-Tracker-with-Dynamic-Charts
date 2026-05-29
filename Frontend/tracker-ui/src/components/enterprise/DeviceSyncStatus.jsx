import React, { useState, useEffect } from 'react';
import { Watch, Smartphone, Battery, Activity, Zap, Wifi } from 'lucide-react';

export default function DeviceSyncStatus() {
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate slight latency jitter
      setLatency(prev => {
        const jitter = Math.floor(Math.random() * 5) - 2;
        return Math.max(10, Math.min(150, prev + jitter));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 border border-zinc-800/60 bg-zinc-900/40 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <Watch className="w-5 h-5 text-cyan-400" />
          Hardware Integration
        </h3>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Device 1 */}
        <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Watch className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold text-zinc-300">Apple Watch Ultra</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase">
              <Battery className="w-3.5 h-3.5" />
              84%
            </div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase">
              Syncing...
            </div>
          </div>
        </div>

        {/* Device 2 */}
        <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold text-zinc-300">iPhone 15 Pro</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-zinc-600" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase">
              <Activity className="w-3.5 h-3.5" />
              Background
            </div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase">
              Idle
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Network Latency</span>
          <span className="text-sm font-black text-white flex items-center gap-1">
            {latency}ms <Zap className="w-3 h-3 text-yellow-500" />
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Last Sync</span>
          <span className="text-sm font-black text-white">Just now</span>
        </div>
      </div>
    </div>
  );
}
