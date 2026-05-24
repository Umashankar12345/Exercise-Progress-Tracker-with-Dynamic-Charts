import React from 'react';
import { Map, Users } from 'lucide-react';

export default function VRGymEnvironment() {
  return (
    <div className="w-full rounded-2xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/5 p-5 relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8B5CF6] opacity-10 blur-3xl rounded-full" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-[#8B5CF6]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">VR Metaverse</span>
        </div>
      </div>

      <div className="w-full h-32 rounded-xl border border-white/10 relative overflow-hidden mb-3 group-hover:border-white/20 transition-colors bg-[#0F172A] shadow-[inset_0_0_50px_rgba(139,92,246,0.1)] flex items-center justify-center">
        {/* Simulated VR Grid Map */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.2)_1px,transparent_1px)] bg-[size:20px_20px] [transform:rotateX(60deg)] scale-150 origin-bottom opacity-50" />
        
        {/* Simulated users on the map */}
        <div className="absolute w-2 h-2 rounded-full bg-[#22D3EE] shadow-[0_0_10px_#22D3EE] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-white/50 top-1/3 left-1/4" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-white/50 bottom-1/4 right-1/3" />
        
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[8px] text-v2-soft-gray uppercase font-bold tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur-md">
           <Users className="w-2.5 h-2.5 text-[#8B5CF6]" /> 124 Runners Active
        </div>
      </div>

      <button className="w-full py-2 rounded-xl bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 transition-colors text-[9px] uppercase font-bold tracking-widest text-[#8B5CF6] border border-[#8B5CF6]/30">
        Enter Neo-Tokyo Map
      </button>
    </div>
  );
}
