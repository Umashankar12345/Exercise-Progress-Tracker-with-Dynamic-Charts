import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SleepAnalyticsGraph() {
  const data = [
    { time: '10PM', deep: 40, rem: 20, light: 40 },
    { time: '12AM', deep: 60, rem: 10, light: 30 },
    { time: '2AM', deep: 30, rem: 40, light: 30 },
    { time: '4AM', deep: 10, rem: 50, light: 40 },
    { time: '6AM', deep: 5, rem: 20, light: 75 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip
          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#8B5CF6', borderRadius: '8px' }}
          itemStyle={{ color: '#E2E8F0' }}
        />
        <Area type="monotone" dataKey="deep" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.8} />
        <Area type="monotone" dataKey="rem" stackId="1" stroke="#00F5FF" fill="#00F5FF" fillOpacity={0.6} />
        <Area type="monotone" dataKey="light" stackId="1" stroke="#424754" fill="#424754" fillOpacity={0.4} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
