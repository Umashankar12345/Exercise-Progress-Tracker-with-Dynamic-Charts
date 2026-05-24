import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function StepTrackingChart() {
  const [data, setData] = useState([
    { hour: '8A', steps: 1200 },
    { hour: '9A', steps: 800 },
    { hour: '10A', steps: 400 },
    { hour: '11A', steps: 2000 },
    { hour: '12P', steps: 500 },
    { hour: 'Now', steps: 0 },
  ]);

  useEffect(() => {
    const int = setInterval(() => {
      setData(prev => {
        const next = [...prev];
        next[5].steps += Math.floor(Math.random() * 20); // Simulating live steps
        return next;
      });
    }, 1000);
    return () => clearInterval(int);
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="hour" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#22D3EE', borderRadius: '8px' }}
        />
        <Bar dataKey="steps" fill="#22D3EE" radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
