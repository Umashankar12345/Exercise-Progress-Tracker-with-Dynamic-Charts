import React, { useState } from 'react';
import { Droplets, Moon, Activity } from 'lucide-react';
import api from '../../api/axios';

export default function QuickLogActions({ onLogSuccess }) {
  const [water, setWater] = useState('');
  const [sleep, setSleep] = useState('');
  const [steps, setSteps] = useState('');

  const handleLog = async (type, value) => {
    if (!value) return;
    
    try {
      const payload = { date: new Date().toISOString().split('T')[0] };
      if (type === 'water') payload.water_intake = parseFloat(value);
      if (type === 'sleep') payload.sleep_hours = parseFloat(value);
      if (type === 'steps') payload.steps = parseInt(value, 10);

      await api.post('/body-metrics', payload);
      alert(`Successfully logged ${type}!`);
      
      if (type === 'water') setWater('');
      if (type === 'sleep') setSleep('');
      if (type === 'steps') setSteps('');
      
      if (onLogSuccess) onLogSuccess();
    } catch (err) {
      console.error(`Failed to log ${type}`, err);
      alert(`Failed to log ${type}`);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap gap-6 items-center justify-between">
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="p-2 bg-cyan-500/10 rounded-lg">
          <Droplets className="w-5 h-5 text-cyan-400" />
        </div>
        <input 
          type="number" 
          placeholder="Water (L)" 
          className="bg-transparent border-b border-white/20 text-white w-24 px-2 py-1 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
          value={water}
          onChange={(e) => setWater(e.target.value)}
        />
        <button 
          onClick={() => handleLog('water', water)}
          className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-cyan-500/30 transition-all"
        >
          Log
        </button>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <Moon className="w-5 h-5 text-indigo-400" />
        </div>
        <input 
          type="number" 
          placeholder="Sleep (hrs)" 
          className="bg-transparent border-b border-white/20 text-white w-24 px-2 py-1 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
          value={sleep}
          onChange={(e) => setSleep(e.target.value)}
        />
        <button 
          onClick={() => handleLog('sleep', sleep)}
          className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-indigo-500/30 transition-all"
        >
          Log
        </button>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Activity className="w-5 h-5 text-emerald-400" />
        </div>
        <input 
          type="number" 
          placeholder="Steps" 
          className="bg-transparent border-b border-white/20 text-white w-24 px-2 py-1 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />
        <button 
          onClick={() => handleLog('steps', steps)}
          className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-500/30 transition-all"
        >
          Log
        </button>
      </div>
    </div>
  );
}
