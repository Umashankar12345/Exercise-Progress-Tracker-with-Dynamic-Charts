import React from 'react';
import { Scale } from 'lucide-react';

export default function BMICalculator() {
  const bmi = 22.4;
  const position = ((bmi - 15) / (35 - 15)) * 100; // rough mapping for scale

  return (
    <div className="w-full h-full flex flex-col justify-center gap-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-v2-soft-gray" />
          <span className="text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest">BMI Index</span>
        </div>
        <span className="text-xl font-black text-[#10B981]">{bmi}</span>
      </div>

      <div className="relative pt-4">
        <div className="w-full h-2 rounded-full bg-gradient-to-r from-[#3B82F6] via-[#10B981] to-[#EF4444]" />
        <div 
          className="absolute top-2.5 w-3 h-3 bg-white border-2 border-[#050816] rounded-full shadow-lg transition-all"
          style={{ left: `calc(${position}% - 6px)` }}
        />
        
        <div className="flex justify-between text-[7px] text-v2-soft-gray uppercase font-bold tracking-widest mt-2">
          <span>Under</span>
          <span>Normal</span>
          <span>Over</span>
          <span>Obese</span>
        </div>
      </div>
    </div>
  );
}
