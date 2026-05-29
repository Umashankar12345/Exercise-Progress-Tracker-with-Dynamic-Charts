import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, Zap, Activity } from 'lucide-react';

export default function CyberBootLoader({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isFading, setIsFading] = useState(false);

  const diagSteps = [
    { threshold: 0, text: '✦ LAUNCHING FITTRACK CORE OS v2.4...', type: 'info' },
    { threshold: 12, text: '⚙ CONNECTING TO DB NODE (SQLITE)... SUCCESS.', type: 'success' },
    { threshold: 25, text: '⚡ INITIALIZING BIO-SENSOR SCANNER ENGINE...', type: 'info' },
    { threshold: 38, text: '⚡ DEVICE CALIBRATION: nominal [3.3V stable]', type: 'success' },
    { threshold: 50, text: '✦ SPINNING TELEMETRY NODE CONTROLLER...', type: 'info' },
    { threshold: 62, text: '✦ GPS MESH ROUTING ENGINE STABLE', type: 'success' },
    { threshold: 75, text: '✦ DEPLOYING SWR COGNITIVE MEMORY CACHE...', type: 'info' },
    { threshold: 88, text: '✦ COGNITIVE NETWORKS SECURE AND LINKED', type: 'success' },
    { threshold: 95, text: '⚙ PARSING LIVE TELEMETRY DEVIATIONS... NOMINAL.', type: 'success' },
    { threshold: 100, text: '✦ SYSTEM BOOT STAGE COMPLETE. WELCOME AGENT.', type: 'ready' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              onComplete();
            }, 800); // Wait for fade-out animation to finish
          }, 600);
          return 100;
        }
        const increment = Math.floor(Math.random() * 5) + 3; // Random speed increment
        return Math.min(prev + increment, 100);
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Sync log lines based on current percentage
  useEffect(() => {
    const activeLogs = diagSteps
      .filter(step => percent >= step.threshold)
      .map(step => step);
    setLogs(activeLogs);
  }, [percent]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050814] select-none transition-all duration-700 ease-in-out ${
        isFading ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Scanline and Grid Mesh Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#000_90%)]" />
      
      {/* Curved CRT glow filter */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15)_0%,transparent_75%)]" />

      {/* Futuristic Hologram Card */}
      <div className="w-[90%] max-w-xl p-8 rounded-[32px] bg-[#0A0F24]/80 border border-[#7C3AED]/30 backdrop-blur-2xl relative shadow-[0_0_80px_rgba(124,58,237,0.15)] flex flex-col items-center">
        {/* Border corner brackets */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#7C3AED]" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#7C3AED]" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#7C3AED]" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#7C3AED]" />

        {/* Central Glowing Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-[#7C3AED]/20 blur-xl animate-pulse" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] flex items-center justify-center border border-[#7C3AED]/40 shadow-[0_0_30px_rgba(124,58,237,0.4)] relative">
            <Cpu className="w-8 h-8 text-white animate-spin-slow" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-[#00F5A0] fill-[#00F5A0]" />
          <span className="text-xl font-black text-white uppercase tracking-widest">
            Fit<span className="text-[#7C3AED]">Track</span> AI
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mb-8">
          Cognitive Fitness Engine OS
        </p>

        {/* Circular Progress & Percentage */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r="70"
              className="stroke-[#0A0F24]"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Animated foreground ring */}
            <circle
              cx="80"
              cy="80"
              r="70"
              className="stroke-[#7C3AED] transition-all duration-100 ease-out"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={440}
              strokeDashoffset={440 - (440 * percent) / 100}
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0px 0px 8px rgba(124,58,237,0.6))',
              }}
            />
          </svg>
          {/* Centered Percentage */}
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-black text-white font-mono tracking-tighter">
              {percent}%
            </span>
            <span className="text-[8px] text-[#00F5A0] font-black uppercase tracking-widest mt-1 flex items-center gap-1">
              <Activity className="w-2.5 h-2.5 animate-pulse" />
              Syncing...
            </span>
          </div>
        </div>

        {/* Live Diagnostics Log Output */}
        <div className="w-full bg-[#030612]/90 border border-white/5 rounded-2xl p-4 h-[120px] overflow-hidden relative font-mono text-left select-text">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#030612]/30 via-transparent to-[#030612] z-10" />
          <div className="space-y-1.5 h-full overflow-y-auto pr-2 scrollbar-none flex flex-col justify-end text-[10px]">
            {logs.slice(-4).map((log, i) => (
              <div 
                key={i} 
                className={`flex gap-1.5 items-start ${
                  log.type === 'success' ? 'text-[#00F5A0]' :
                  log.type === 'ready' ? 'text-[#00E5FF] font-bold' :
                  'text-slate-400'
                }`}
              >
                <span className="shrink-0 text-slate-500">{`>`}</span>
                <span className="leading-relaxed animate-in fade-in slide-in-from-bottom-1 duration-200">
                  {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Small security badge */}
        <div className="mt-6 flex items-center gap-1 text-[8px] text-slate-500 font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3 text-[#00F5A0]" />
          Securing military grade sync link
        </div>
      </div>
    </div>
  );
}
