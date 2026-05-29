import React from 'react';
import { RadioTower, Map } from 'lucide-react';

export default function RealtimeEventStreaming() {
  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RadioTower className="w-4 h-4 text-[#FACC15]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Live Events</span>
        </div>
      </div>

      <div className="w-full h-32 rounded-xl bg-black/40 border border-white/10 relative overflow-hidden mb-3 group-hover:border-white/20 transition-colors">
        <img src="https://images.unsplash.com/photo-1552674605-15c2145eba11?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Marathon" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-3">
           <h4 className="text-xs font-black text-white">NYC Virtual Marathon</h4>
           <div className="flex items-center gap-1 text-[8px] text-v2-soft-gray uppercase font-bold tracking-widest mt-1">
             <Map className="w-2.5 h-2.5 text-[#FACC15]" /> 26.2 Miles • 8,400 Runners
           </div>
        </div>
      </div>
    </div>
  );
}
