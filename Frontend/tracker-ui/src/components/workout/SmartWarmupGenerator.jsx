import React from 'react';
import { Sun, CheckCircle } from 'lucide-react';

export default function SmartWarmupGenerator() {
  const warmups = [
    { name: 'Arm Circles', dur: '30s', done: true },
    { name: 'Band Pull-Aparts', dur: '15 reps', done: true },
    { name: 'Shoulder Dislocates', dur: '10 reps', done: false },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-3">
        <Sun className="w-4 h-4 text-[#F59E0B]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-white">Dynamic Warmup</span>
      </div>
      <div className="space-y-2">
        {warmups.map((w, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#0F172A] border border-white/5">
            <div className="flex items-center gap-2">
              {w.done ? <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" /> : <div className="w-3.5 h-3.5 rounded-full border border-v2-soft-gray" />}
              <span className={`text-[10px] font-bold ${w.done ? 'text-v2-soft-gray line-through' : 'text-white'}`}>{w.name}</span>
            </div>
            <span className="text-[9px] text-[#00F5FF] font-mono">{w.dur}</span>
          </div>
        ))}
      </div>
      <button className="mt-3 text-[9px] font-bold uppercase tracking-widest text-[#F59E0B] hover:text-white transition-colors text-center w-full">
        Generate New Flow
      </button>
    </div>
  );
}
