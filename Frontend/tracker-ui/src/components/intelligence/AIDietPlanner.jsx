import React from 'react';
import { Apple, Flame } from 'lucide-react';

export default function AIDietPlanner() {
  return (
    <div className="w-full rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/5 p-5 relative overflow-hidden group h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E] opacity-10 blur-3xl rounded-full" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Apple className="w-4 h-4 text-[#22C55E]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Dynamic Diet</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 relative z-10 mb-4">
         <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
            <div className="flex flex-col">
               <span className="text-xs font-bold text-white mb-0.5">Post-Workout Meal</span>
               <span className="text-[9px] uppercase tracking-widest text-v2-soft-gray font-bold">Suggested in 30m</span>
            </div>
            <span className="text-sm font-black text-[#22C55E]">450 kcal</span>
         </div>
         
         <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-black/40 border border-[#EF4444]/20 flex flex-col items-center">
               <span className="text-[9px] text-[#EF4444] uppercase tracking-widest font-bold">Protein</span>
               <span className="text-xs font-black text-white">45g</span>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-[#3B82F6]/20 flex flex-col items-center">
               <span className="text-[9px] text-[#3B82F6] uppercase tracking-widest font-bold">Carbs</span>
               <span className="text-xs font-black text-white">40g</span>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-[#FACC15]/20 flex flex-col items-center">
               <span className="text-[9px] text-[#FACC15] uppercase tracking-widest font-bold">Fat</span>
               <span className="text-xs font-black text-white">12g</span>
            </div>
         </div>
      </div>

      <div className="w-full flex items-center gap-2 relative z-10">
         <Flame className="w-4 h-4 text-[#F97316]" />
         <p className="text-[9px] text-v2-soft-gray font-bold uppercase tracking-widest">
           Macros adjusted +15% due to high volume leg day.
         </p>
      </div>
    </div>
  );
}
