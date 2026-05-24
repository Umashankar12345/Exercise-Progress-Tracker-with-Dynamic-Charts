import React, { useState } from 'react';
import { Wand2, CheckCircle2 } from 'lucide-react';

export default function AISuggestedCalendar() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center">
          <Wand2 className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Smart Fill</span>
          <span className="text-[9px] text-v2-soft-gray">AI Calendar Generator</span>
        </div>
      </div>

      {!generated ? (
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Generate Split</span>
          )}
        </button>
      ) : (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="text-[9px] uppercase font-bold tracking-widest">PPL Split Applied</span>
        </div>
      )}
    </div>
  );
}
