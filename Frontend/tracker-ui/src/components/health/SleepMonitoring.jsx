import React, { useState, useEffect } from 'react';
import { Moon } from 'lucide-react';
import api from '../../api/axios';

export default function SleepMonitoring() {
  const [sleepHours, setSleepHours] = useState(7.4);
  const [loading, setLoading] = useState(true);
  const todayStr = new Date().toLocaleDateString('sv'); // YYYY-MM-DD

  useEffect(() => {
    const fetchSleep = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/body-metrics');
        const todayRecord = (data.history || []).find(h => h.date === todayStr);
        if (todayRecord && todayRecord.sleep_hours !== null) {
          setSleepHours(parseFloat(todayRecord.sleep_hours));
        }
      } catch (err) {
        console.error("Failed to load sleep metrics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSleep();
  }, []);

  const hours = Math.floor(sleepHours);
  const minutes = Math.round((sleepHours - hours) * 60);

  // Circles calculation
  const lightPct = 0.4;
  const deepPct = 0.6;
  const remPct = 0.7;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <div className="absolute top-2 left-2">
        <Moon className="w-5 h-5 text-[#8B5CF6]" />
      </div>
      
      {/* Concentric Rings for Sleep Phases */}
      <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
        {/* Light Sleep */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="6" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#8B5CF6" strokeWidth="6" strokeDasharray="251" strokeDashoffset={251 * (1 - lightPct)} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
        {/* Deep Sleep */}
        <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(0,245,255,0.1)" strokeWidth="6" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#00F5FF" strokeWidth="6" strokeDasharray="188" strokeDashoffset={188 * (1 - deepPct)} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]" />
        {/* REM */}
        <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(236,72,153,0.1)" strokeWidth="6" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="#EC4899" strokeWidth="6" strokeDasharray="125" strokeDashoffset={125 * (1 - remPct)} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
      </svg>
      
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-black text-white tracking-tighter">
          {loading ? '...' : `${hours}h ${minutes}m`}
        </span>
        <span className="text-[8px] uppercase tracking-widest font-bold text-v2-soft-gray">Time in Bed</span>
      </div>

      <div className="absolute bottom-0 w-full flex justify-between px-2 text-[8px] uppercase font-bold tracking-widest">
        <span className="text-[#8B5CF6]">Light</span>
        <span className="text-[#00F5FF]">Deep</span>
        <span className="text-[#EC4899]">REM</span>
      </div>
    </div>
  );
}
