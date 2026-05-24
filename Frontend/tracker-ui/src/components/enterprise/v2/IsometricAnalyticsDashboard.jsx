import React from 'react';
import { Layers, Database, Activity, GitBranch } from 'lucide-react';

export default function IsometricAnalyticsDashboard() {
  // A CSS 3D representation of floating analytics cards
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden perspective-[1000px]">
      <div className="relative w-64 h-64 transform-style-3d rotate-x-[60deg] rotate-z-[-45deg] transition-transform duration-1000 hover:rotate-x-[50deg] hover:rotate-z-[-30deg]">
        
        {/* Layer 1: Base Grid */}
        <div className="absolute inset-0 border border-[#00F5FF]/20 bg-[#00F5FF]/5 shadow-[0_0_50px_rgba(0,245,255,0.1)] rounded-xl" style={{ transform: 'translateZ(0px)' }}>
          <div className="w-full h-full bg-[linear-gradient(rgba(0,245,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] rounded-xl" />
        </div>

        {/* Layer 2: Floating Nodes */}
        <div className="absolute inset-x-4 inset-y-4 border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 backdrop-blur-md shadow-[0_0_30px_rgba(139,92,246,0.2)] rounded-xl flex items-center justify-center gap-4" style={{ transform: 'translateZ(40px)' }}>
          <div className="p-2 bg-[#8B5CF6]/20 rounded-lg animate-pulse"><Database className="w-4 h-4 text-[#8B5CF6]" /></div>
          <div className="p-2 bg-[#8B5CF6]/20 rounded-lg"><GitBranch className="w-4 h-4 text-[#8B5CF6]" /></div>
        </div>

        {/* Layer 3: Top Analytics Card */}
        <div className="absolute inset-x-8 inset-y-8 border border-[#EC4899]/40 bg-[#0F172A]/80 backdrop-blur-xl shadow-[0_0_40px_rgba(236,72,153,0.3)] rounded-xl p-4 flex flex-col justify-between" style={{ transform: 'translateZ(80px)' }}>
          <div className="flex items-center justify-between">
            <Activity className="w-5 h-5 text-[#EC4899]" />
            <div className="w-2 h-2 bg-[#EC4899] rounded-full shadow-[0_0_10px_#EC4899] animate-ping" />
          </div>
          <div>
            <div className="text-[8px] font-bold text-v2-soft-gray uppercase tracking-widest">Global Stream</div>
            <div className="text-lg font-black text-white">ACTIVE</div>
          </div>
        </div>

      </div>
    </div>
  );
}
