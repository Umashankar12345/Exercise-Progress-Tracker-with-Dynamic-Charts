import React from 'react';
import { BrainCircuit, Target, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AIIntelligenceCenter() {
  return (
    <div className="glass-card p-6 border border-zinc-800/60 bg-zinc-900/40 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
        <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
          AI Intelligence Center
        </h3>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">GPT-4 Turbo Active</span>
        </div>
      </div>

      {/* Confidence Meter */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-zinc-400">
          <span>Prediction Confidence</span>
          <span className="text-emerald-400">94.2%</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" style={{ width: '94.2%' }} />
        </div>
      </div>

      {/* AI Goal Prediction */}
      <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Goal Trajectory</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Based on current progressive overload velocity, you are on track to hit <strong className="text-white">100kg Bench Press</strong> by Oct 12th.
            </p>
          </div>
        </div>
      </div>

      {/* Mood/Recovery Recommendation */}
      <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Dynamic Adjustment</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              High HRV detected. Recommend increasing working sets by 1 today. Focus on explosive concentric movements.
            </p>
          </div>
        </div>
      </div>

      {/* Warning/Alert */}
      <div className="mt-2 p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
        <span className="text-[10px] text-yellow-500/80 font-bold uppercase tracking-widest">
          Slight posterior chain fatigue predicted.
        </span>
      </div>
    </div>
  );
}
