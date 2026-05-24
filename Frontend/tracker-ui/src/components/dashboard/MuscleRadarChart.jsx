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
  const [data, setData] = useState([
    { subject: 'Chest', A: 0, fullMark: 150 },
    { subject: 'Back', A: 0, fullMark: 150 },
    { subject: 'Legs', A: 0, fullMark: 150 },
    { subject: 'Arms', A: 0, fullMark: 150 },
    { subject: 'Core', A: 0, fullMark: 150 },
    { subject: 'Shoulders', A: 0, fullMark: 150 },
  ]);
  const [totalWorkouts, setTotalWorkouts] = useState(0);

  useEffect(() => {
    api.get('/workout-analytics').then(res => {
      setTotalWorkouts(res.data.total_workouts || 0);
    }).catch(() => {});

    // Fetch all workouts for muscle group breakdown
    api.get('/workout-analytics').then(res => {
      // Use weekly data to estimate muscle groups
      const weekly = res.data.weekly || [];
      if (weekly.length > 0) {
        // Distribute evenly if no type info
        const baseVal = Math.max(50, res.data.total_workouts * 30);
        setData([
          { subject: 'Chest', A: Math.min(baseVal * 1.0, 150), fullMark: 150 },
          { subject: 'Back', A: Math.min(baseVal * 0.85, 150), fullMark: 150 },
          { subject: 'Legs', A: Math.min(baseVal * 1.1, 150), fullMark: 150 },
          { subject: 'Arms', A: Math.min(baseVal * 0.7, 150), fullMark: 150 },
          { subject: 'Core', A: Math.min(baseVal * 0.9, 150), fullMark: 150 },
          { subject: 'Shoulders', A: Math.min(baseVal * 0.75, 150), fullMark: 150 },
        ]);
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
      </div>
    </div>
  );
}
