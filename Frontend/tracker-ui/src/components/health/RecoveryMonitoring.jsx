import React, { useState, useEffect } from 'react';

export default function RecoveryMonitoring() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to 86
    const int = setInterval(() => {
      setScore(s => {
        if (s >= 86) {
          clearInterval(int);
          return 86;
        }
        return s + 2;
      });
    }, 30);
    return () => clearInterval(int);
  }, []);

  const progress = (score / 100) * 283; // 283 is approx circumference of r=45

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <svg viewBox="0 0 100 100" className="w-40 h-40">
        <path d="M 20 80 A 45 45 0 1 1 80 80" fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="8" strokeLinecap="round" />
        <path 
          d="M 20 80 A 45 45 0 1 1 80 80" 
          fill="none" 
          stroke="#10B981" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeDasharray="283"
          strokeDashoffset={283 - progress}
          className="transition-all duration-700 ease-out drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" 
        />
      </svg>
      <div className="absolute flex flex-col items-center -mt-4">
        <span className="text-4xl font-black text-white">{score}%</span>
        <span className="text-[10px] uppercase font-bold text-[#10B981] tracking-widest mt-1">Primed</span>
      </div>
      <div className="absolute bottom-2 text-center">
        <span className="text-[8px] text-v2-soft-gray uppercase tracking-widest font-bold">Based on HRV & Sleep</span>
      </div>
    </div>
  );
}
