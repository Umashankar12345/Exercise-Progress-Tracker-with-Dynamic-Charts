import React, { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Target } from 'lucide-react';
import api from '../../api/axios';

// Build radar data from workout type counts
function buildRadarData(workouts) {
  const muscleMap = {
    'Strength': 'Chest',
    'Chest': 'Chest',
    'Back': 'Back',
    'Legs': 'Legs',
    'Arms': 'Arms',
    'Core': 'Core',
    'Shoulders': 'Shoulders',
    'Cardio': 'Core',
    'AI Live Session': 'Core',
  };
  const counts = { Chest: 0, Back: 0, Legs: 0, Arms: 0, Core: 0, Shoulders: 0 };

  workouts.forEach(w => {
    const group = muscleMap[w.type] || muscleMap[w.title] || 'Core';
    counts[group] = (counts[group] || 0) + (w.reps || 50);
  });

  const max = Math.max(...Object.values(counts), 1);
  return Object.entries(counts).map(([key, val]) => ({
    subject: key,
    A: Math.round((val / max) * 150),
    fullMark: 150,
  }));
}

export default function MuscleRadarChart() {
  const [data, setData] = useState([]);
  const [totalWorkouts, setTotalWorkouts] = useState(0);

  useEffect(() => {
    api.get('/workout-analytics').then(res => {
      setTotalWorkouts(res.data.total_workouts || 0);
    }).catch(() => {});

    // Fetch all workouts for real muscle group breakdown
    api.get('/workout').then(res => {
      const wks = res.data || [];
      if (wks.length > 0) {
        setData(buildRadarData(wks));
      } else {
        setData([]);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="w-full h-[300px] rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 relative overflow-hidden backdrop-blur-xl group hover:-translate-y-1 hover:border-[#00F5A0]/30 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#00F5A0] opacity-10 blur-[50px] rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col">
           <h3 className="text-sm font-black text-white uppercase tracking-widest">Muscle Load</h3>
           <p className="text-[10px] text-[#00F5A0] uppercase tracking-widest font-bold">
             {totalWorkouts} Total Sessions
           </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#00F5A0]/10 flex items-center justify-center border border-[#00F5A0]/30">
           <Target className="w-4 h-4 text-[#00F5A0]" />
        </div>
      </div>

      <div className="w-full h-[200px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(0,245,160,0.3)', borderRadius: '12px' }}
                itemStyle={{ color: '#00F5A0', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Radar name="Volume" dataKey="A" stroke="#00F5A0" strokeWidth={2} fill="#00F5A0" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-v2-soft-gray border border-white/5 rounded-2xl bg-white/[0.02]">
            <Target className="w-8 h-8 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">No Data Available</span>
          </div>
        )}
      </div>
    </div>
  );
}
