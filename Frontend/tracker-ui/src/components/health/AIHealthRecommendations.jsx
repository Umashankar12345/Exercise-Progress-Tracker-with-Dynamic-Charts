import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

export default function AIHealthRecommendations() {
  const recommendations = [
    { title: 'Increase Magnesium', reason: 'Poor deep sleep detected.', action: 'Take 400mg before bed.' },
    { title: 'Sunlight Exposure', reason: 'Circadian delay likely.', action: '15m AM sunlight.' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center gap-3">
      {recommendations.map((r, i) => (
        <div key={i} className="group cursor-pointer flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-3 h-3 text-[#F59E0B]" />
              <span className="text-xs font-bold text-white group-hover:text-[#F59E0B] transition-colors">{r.title}</span>
            </div>
            <p className="text-[9px] text-v2-soft-gray mt-1">{r.reason}</p>
          </div>
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 group-hover:bg-[#F59E0B]/20 transition-colors">
            <ArrowRight className="w-3 h-3 text-v2-soft-gray group-hover:text-[#F59E0B] transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );
}
