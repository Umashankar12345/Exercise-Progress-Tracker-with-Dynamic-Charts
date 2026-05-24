import React, { useState } from 'react';
import { Cpu, RefreshCcw, ArrowRight } from 'lucide-react';

export default function AIWorkoutGenerator() {
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState(null);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setPlan([
        { name: 'Barbell Squat', sets: '4x8', rest: '90s' },
        { name: 'Romanian Deadlift', sets: '3x10', rest: '60s' },
        { name: 'Bulgarian Split Squat', sets: '3x12', rest: '60s' },
      ]);
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center p-2">
      {!plan && !generating && (
        <div className="text-center">
          <Cpu className="w-8 h-8 text-[#00F5FF] mx-auto mb-3 opacity-80" />
          <p className="text-xs text-v2-soft-gray mb-4">Analyze recovery and history to build today's optimal routine.</p>
          <button onClick={generate} className="bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/30 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#00F5FF]/20 transition-all flex items-center gap-2 mx-auto">
            Generate Plan
          </button>
        </div>
      )}

      {generating && (
        <div className="text-center animate-pulse">
          <RefreshCcw className="w-6 h-6 text-[#8B5CF6] mx-auto mb-3 animate-spin" />
          <p className="text-xs text-[#8B5CF6] uppercase font-bold tracking-widest">Compiling neural data...</p>
        </div>
      )}

      {plan && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-[#22D3EE] tracking-widest">Optimized Leg Day</span>
            <span className="text-[10px] font-black text-[#00F5FF]">98% Match</span>
          </div>
          <div className="space-y-2">
            {plan.map((ex, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                <span className="text-xs font-bold text-white">{ex.name}</span>
                <div className="flex gap-3 text-[10px] text-v2-soft-gray font-mono">
                  <span>{ex.sets}</span>
                  <span>{ex.rest}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setPlan(null)} className="mt-4 w-full text-center text-[10px] text-[#EC4899] uppercase tracking-widest font-bold hover:text-white transition-colors">
            Discard & Regenerate
          </button>
        </div>
      )}
    </div>
  );
}
