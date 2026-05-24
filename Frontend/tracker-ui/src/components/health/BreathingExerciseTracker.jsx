import React, { useState, useEffect } from 'react';

export default function BreathingExerciseTracker() {
  const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale, Hold
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let currentPhase = 0;
    const phases = [
      { name: 'Inhale', s: 1.5 },
      { name: 'Hold', s: 1.5 },
      { name: 'Exhale', s: 1 },
      { name: 'Hold', s: 1 },
    ];

    const int = setInterval(() => {
      currentPhase = (currentPhase + 1) % 4;
      setPhase(phases[currentPhase].name);
      setScale(phases[currentPhase].s);
    }, 4000); // 4 seconds per phase (Box Breathing)

    return () => clearInterval(int);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <div 
        className="w-20 h-20 rounded-full border-4 border-[#00F5FF]/30 flex items-center justify-center transition-all duration-[4000ms] ease-in-out bg-[#00F5FF]/10 shadow-[0_0_30px_rgba(0,245,255,0.2)]"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="w-10 h-10 rounded-full bg-[#00F5FF]/30 blur-md" />
      </div>
      <div className="absolute flex flex-col items-center pointer-events-none mt-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#00F5FF]">{phase}</span>
      </div>
      <div className="absolute bottom-0 text-[8px] text-v2-soft-gray uppercase font-bold tracking-widest">
        Box Breathing Protocol
      </div>
    </div>
  );
}
