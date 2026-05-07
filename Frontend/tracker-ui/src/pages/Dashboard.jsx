import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your fitness journey at a glance.</p>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-panel">
          <h3>Workouts This Week</h3>
          <p className="text-2xl font-bold mt-2 text-accent-secondary">4</p>
        </div>
        <div className="glass-panel">
          <h3>Total Volume</h3>
          <p className="text-2xl font-bold mt-2 text-accent-primary">12,450 lbs</p>
        </div>
        <div className="glass-panel">
          <h3>Current Streak</h3>
          <p className="text-2xl font-bold mt-2 text-success">3 days</p>
        </div>
      </div>
      
      <div className="glass-panel mt-6">
        <h3>Recent Workouts</h3>
        <p className="text-muted mt-4">No recent workouts to display.</p>
      </div>
    </div>
  );
};

export default Dashboard;
