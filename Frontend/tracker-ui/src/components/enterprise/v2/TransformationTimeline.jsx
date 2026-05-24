import React from 'react';
import { Camera, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TransformationTimeline() {
  const milestones = [
    { date: 'Jan 1', weight: '92kg', bf: '24%', active: false, current: false },
    { date: 'Feb 15', weight: '88kg', bf: '21%', active: false, current: false },
    { date: 'Today', weight: '84kg', bf: '18%', active: true, current: true },
    { date: 'Goal', weight: '80kg', bf: '15%', active: false, current: false },
  ];

  return (
    <div className="w-full h-full flex items-center justify-between px-4 relative">
      {/* Background Line */}
      <div className="absolute top-1/2 left-8 right-8 h-1 bg-white/5 -translate-y-1/2 rounded-full" />
      <div className="absolute top-1/2 left-8 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] -translate-y-1/2 rounded-full w-[66%]" />

      {milestones.map((m, i) => (
        <div key={i} className="relative flex flex-col items-center group">
          <div className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${m.current ? 'text-[#00F5FF]' : 'text-v2-soft-gray'}`}>
            {m.date}
          </div>
          
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
            m.current 
              ? 'bg-[#050816] border-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.5)] scale-110' 
              : m.active 
                ? 'bg-[#8B5CF6] border-[#8B5CF6]' 
                : 'bg-[#0F172A] border-white/10'
          }`}>
            {m.current ? <Camera className="w-3 h-3 text-[#00F5FF]" /> : <CheckCircle2 className={`w-4 h-4 ${m.active ? 'text-white' : 'text-transparent'}`} />}
          </div>

          <div className="mt-4 flex flex-col items-center">
            <span className="text-sm font-black text-white">{m.weight}</span>
            <span className="text-[10px] text-v2-soft-gray">{m.bf} BF</span>
          </div>
        </div>
      ))}
    </div>
  );
}
