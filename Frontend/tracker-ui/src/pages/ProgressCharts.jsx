import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', volume: 4000 },
  { name: 'Tue', volume: 3000 },
  { name: 'Wed', volume: 2000 },
  { name: 'Thu', volume: 2780 },
  { name: 'Fri', volume: 1890 },
  { name: 'Sat', volume: 2390 },
  { name: 'Sun', volume: 3490 },
];

const ProgressCharts = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Progress Charts</h1>
        <p className="page-subtitle">Visualize your growth over time.</p>
      </div>
      
      <div className="glass-panel" style={{ height: '400px' }}>
        <h3 className="mb-4">Weekly Volume Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#13131A', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <Line type="monotone" dataKey="volume" stroke="#00F0FF" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressCharts;
