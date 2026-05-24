import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function AIFormCorrection() {
  const [status, setStatus] = useState('good'); // 'good' | 'warning'

  useEffect(() => {
    const int = setInterval(() => {
      setStatus(s => s === 'good' ? 'warning' : 'good');
    }, 4000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center gap-3">
      <div className={`p-3 rounded-xl border ${status === 'good' ? 'bg-[#10B981]/10 border-[#10B981]/30' : 'bg-[#EF4444]/10 border-[#EF4444]/30'} transition-colors duration-500`}>
        <div className="flex items-center gap-2 mb-2">
          {status === 'good' ? <CheckCircle className="w-4 h-4 text-[#10B981]" /> : <AlertTriangle className="w-4 h-4 text-[#EF4444] animate-pulse" />}
          <span className={`text-[10px] uppercase font-bold tracking-widest ${status === 'good' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
            {status === 'good' ? 'Form Perfect' : 'Posture Warning'}
          </span>
        </div>
        <p className="text-[10px] text-v2-soft-gray font-medium">
          {status === 'good' 
            ? 'Spine is neutral. Depth is optimal.' 
            : 'Knees caving inward. Push knees out on ascent.'}
        </p>
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1 bg-white/5 rounded border border-white/10 p-2 flex flex-col items-center">
          <span className="text-[8px] text-v2-soft-gray uppercase tracking-widest mb-1">Knee Angle</span>
          <span className={`text-xs font-bold ${status === 'warning' ? 'text-[#EF4444]' : 'text-white'}`}>82°</span>
        </div>
        <div className="flex-1 bg-white/5 rounded border border-white/10 p-2 flex flex-col items-center">
          <span className="text-[8px] text-v2-soft-gray uppercase tracking-widest mb-1">Back Angle</span>
          <span className="text-xs font-bold text-[#10B981]">45°</span>
        </div>
      </div>
    </div>
  );
}
