import React, { useEffect, useState } from 'react';
import { Droplet } from 'lucide-react';
import api from '../../api/axios';
import useStore from '../../store/useStore';

export default function HydrationRing() {
  const { user } = useStore();
  const waterGoal = user?.water_goal || 3.5;
  const [percentage, setPercentage] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.get('/health-dashboard');
        const currentWater = parseFloat(res.data.latest?.water_intake) || 0;
        setWaterIntake(currentWater);
        const goal = parseFloat(user?.water_goal) || 3.5;
        const calcPercent = goal > 0 ? Math.min(Math.round((currentWater / goal) * 100), 100) : 0;
        setPercentage(isNaN(calcPercent) ? 0 : calcPercent);
      } catch (err) {
        console.error("Failed to fetch health data", err);
      }
    };
    fetchHealth();

    window.addEventListener('health-data-updated', fetchHealth);
    return () => {
      window.removeEventListener('health-data-updated', fetchHealth);
    };
  }, [user?.water_goal]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const safePercentage = isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage));
  const offset = circumference - (safePercentage / 100) * circumference;

  return (
    <div className="w-full h-[330px] rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 relative overflow-hidden backdrop-blur-xl group hover:-translate-y-1 hover:border-[#0EA5E9]/30 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0EA5E9] opacity-10 blur-[50px] rounded-full pointer-events-none" />
      
      <div className="absolute top-6 left-6 flex flex-col">
         <h3 className="text-sm font-black text-white uppercase tracking-widest pt-1 leading-normal">Hydration</h3>
         <p className="text-[10px] text-[#0EA5E9] uppercase tracking-widest font-bold">Daily Target</p>
      </div>

      <div className="relative flex items-center justify-center mt-6">
        {/* Glow behind ring */}
        <div className="absolute inset-0 bg-[#0EA5E9] opacity-20 blur-xl rounded-full scale-75" />
        
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#0EA5E9"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(14,165,233,0.8)]"
          />
        </svg>
        
        <div className="absolute flex flex-col items-center justify-center text-center">
          <Droplet className="w-5 h-5 text-[#0EA5E9] mb-1 drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]" />
          <span className="text-2xl font-black text-white tracking-tighter">{safePercentage}%</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{(isNaN(waterIntake) ? 0 : waterIntake).toFixed(1)}L / {(parseFloat(user?.water_goal) || 3.5).toFixed(1)}L</span>
        </div>
      </div>
    </div>
  );
}
