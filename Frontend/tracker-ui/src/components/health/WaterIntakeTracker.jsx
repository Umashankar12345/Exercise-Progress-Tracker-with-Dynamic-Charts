import React, { useState, useEffect } from 'react';
import { Droplet, Plus, Loader2 } from 'lucide-react';
import api from '../../api/axios';

export default function WaterIntakeTracker() {
  const [intake, setIntake] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const goal = 3.5;
  const percentage = Math.min((intake / goal) * 100, 100);
  const todayStr = new Date().toLocaleDateString('sv'); // YYYY-MM-DD

  useEffect(() => {
    const fetchWater = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/body-metrics');
        // Find today's record in history
        const todayRecord = (data.history || []).find(h => h.date === todayStr);
        if (todayRecord && todayRecord.water_intake !== null) {
          setIntake(parseFloat(todayRecord.water_intake));
        }
      } catch (err) {
        console.error("Failed to load water intake", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWater();
  }, []);

  const handleAddWater = async () => {
    if (syncing) return;
    const newIntake = intake + 0.25;
    setIntake(newIntake);
    setSyncing(true);
    try {
      await api.post('/body-metrics', {
        date: todayStr,
        water_intake: newIntake
      });
    } catch (err) {
      console.error("Failed to save water intake", err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-v2-soft-gray text-[10px] font-bold uppercase tracking-widest animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative">
      <button 
        type="button"
        disabled={syncing}
        className="absolute top-0 right-0 p-1.5 rounded-full bg-[#3B82F6]/20 hover:bg-[#3B82F6]/40 transition-colors disabled:opacity-40" 
        onClick={handleAddWater}
      >
        {syncing ? <Loader2 className="w-4 h-4 text-[#3B82F6] animate-spin" /> : <Plus className="w-4 h-4 text-[#3B82F6]" />}
      </button>

      <div className="relative w-20 h-24 bg-white/5 border border-white/10 rounded-b-xl rounded-t flex items-end justify-center overflow-hidden mb-3">
        {/* Abstract Water Fill */}
        <div 
          className="absolute bottom-0 w-full bg-gradient-to-t from-[#3B82F6] to-[#00F5FF] opacity-80 transition-all duration-500 shadow-[0_-5px_15px_rgba(0,245,255,0.4)]"
          style={{ height: `${percentage}%` }}
        />
        {/* Highlight/Glass reflection */}
        <div className="absolute top-0 left-1 w-2 h-full bg-white/10 rounded-full" />
      </div>

      <div className="text-center z-10">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-xl font-black text-white">{intake.toFixed(2)}</span>
          <span className="text-[10px] text-v2-soft-gray font-bold uppercase tracking-widest">/ {goal}L</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Droplet className="w-3 h-3 text-[#3B82F6] fill-current" />
          <span className="text-[9px] uppercase font-bold tracking-widest text-[#3B82F6]">Hydration</span>
        </div>
      </div>
    </div>
  );
}
