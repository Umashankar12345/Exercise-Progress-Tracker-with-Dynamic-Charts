import React from 'react';
import { ShieldAlert, TrendingDown } from 'lucide-react';

export default function AIDiseaseRiskPrediction() {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-4">
      <div className="flex items-center gap-2 mb-2">
        <ShieldAlert className="w-4 h-4 text-[#10B981]" />
        <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">Cardiovascular Risk</span>
      </div>
      
      <div className="flex justify-between items-end">
        <span className="text-3xl font-black text-[#10B981]">1.2%</span>
        <span className="text-[9px] text-v2-soft-gray font-bold uppercase tracking-widest pb-1">10-Year Probability</span>
      </div>

      <div className="p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex flex-col gap-2">
        <span className="text-[9px] font-bold text-[#10B981] uppercase tracking-widest flex items-center gap-1">
          <TrendingDown className="w-3 h-3" /> Risk Reduced
        </span>
        <p className="text-[10px] text-v2-soft-gray">
          Your consistent Zone 2 cardio over the last 3 months has lowered your baseline resting HR, dropping your risk profile by 0.4%.
        </p>
      </div>
    </div>
  );
}
