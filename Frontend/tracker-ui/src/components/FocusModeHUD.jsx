import React, { useState } from 'react';
import { Plus, CheckCircle2, ChevronRight, Save } from 'lucide-react';

export default function FocusModeHUD({
  exerciseName,
  sets,
  onUpdateSet,
  onAddSet,
  onDeleteSet,
  onSubmit,
  onClose
}) {
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  const activeSet = sets[activeSetIndex] || sets[0];

  const handleNextSet = () => {
    if (activeSetIndex < sets.length - 1) {
      setActiveSetIndex(prev => prev + 1);
    } else {
      onAddSet();
      setActiveSetIndex(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex flex-col bg-zinc-950 text-white overflow-hidden rounded-[2rem] border border-primary/20 shadow-2xl w-full max-w-5xl max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/60 bg-zinc-900/50">
          <div>
            <h2 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Focus HUD Active
            </h2>
            <h1 className="text-3xl font-extrabold mt-1">{exerciseName || 'No Exercise Selected'}</h1>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full text-sm font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors uppercase tracking-widest"
          >
            Exit Focus
          </button>
        </div>

        {/* Main Tracking Area */}
        <div className="flex-1 flex flex-col justify-center p-8 gap-12 w-full overflow-y-auto custom-scrollbar">
          {activeSet ? (
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col items-center justify-center bg-zinc-900/40 border border-zinc-800/80 rounded-[2rem] p-8 md:p-12">
                <label className="text-zinc-400 font-bold uppercase tracking-widest mb-4 text-xs md:text-sm">Weight (kg)</label>
                <input
                  type="number"
                  value={activeSet.weight || ''}
                  onChange={e => onUpdateSet(activeSet.id, 'weight', e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-center text-5xl md:text-8xl font-black focus:outline-none focus:text-primary transition-colors text-white placeholder:text-zinc-800"
                />
              </div>
              <div className="flex flex-col items-center justify-center bg-zinc-900/40 border border-zinc-800/80 rounded-[2rem] p-8 md:p-12">
                <label className="text-zinc-400 font-bold uppercase tracking-widest mb-4 text-xs md:text-sm">Reps</label>
                <input
                  type="number"
                  value={activeSet.reps || ''}
                  onChange={e => onUpdateSet(activeSet.id, 'reps', e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-center text-5xl md:text-8xl font-black focus:outline-none focus:text-secondary transition-colors text-white placeholder:text-zinc-800"
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-zinc-500 font-bold text-2xl">No Sets Available</div>
          )}

          {/* Execution Targets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleNextSet}
              className="group flex flex-col items-center justify-center gap-2 p-6 md:p-8 bg-zinc-900 hover:bg-zinc-800 rounded-3xl border-2 border-zinc-800 hover:border-zinc-700 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-zinc-500 group-hover:text-primary transition-colors" />
              <span className="font-black text-lg md:text-xl text-zinc-300 group-hover:text-white uppercase tracking-widest">
                Mark Set {activeSetIndex + 1} Done
              </span>
            </button>
            <button
              onClick={onSubmit}
              className="group flex flex-col items-center justify-center gap-2 p-6 md:p-8 bg-primary/20 hover:bg-primary/30 rounded-3xl border-2 border-primary/40 hover:border-primary/60 transition-all active:scale-95"
            >
              <Save className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              <span className="font-black text-lg md:text-xl text-primary uppercase tracking-widest">
                Submit Session
              </span>
            </button>
          </div>
        </div>

        {/* Sets Pagination / Summary */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-900 flex gap-4 overflow-x-auto custom-scrollbar">
          {sets.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveSetIndex(idx)}
              className={`flex-shrink-0 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 font-black text-xl transition-all ${
                activeSetIndex === idx
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={onAddSet}
            className="flex-shrink-0 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 border-dashed border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400 transition-all"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
