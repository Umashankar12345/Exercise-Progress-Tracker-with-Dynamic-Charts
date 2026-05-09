import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LogWorkout from './pages/LogWorkout';
import ProgressCharts from './pages/ProgressCharts';
import ExerciseLibrary from './pages/ExerciseLibrary';
import AIInsights from './pages/AIInsights';
import Profile from './pages/Profile';
import './index.css';

/* Simple placeholder for pages not yet built */
const Placeholder = ({ title }) => (
  <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text2)' }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 13 }}>Coming soon — backend endpoint ready.</div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index           element={<Dashboard />} />
          <Route path="log"      element={<LogWorkout />} />
          <Route path="charts"   element={<ProgressCharts />} />
          <Route path="library"  element={<ExerciseLibrary />} />
          <Route path="insights" element={<AIInsights />} />
          <Route path="profile"  element={<Profile />} />
          <Route path="plan"     element={<Placeholder title="AI Workout Plan" />} />
          <Route path="report"   element={<Placeholder title="Monthly Report" />} />
          <Route path="settings" element={<Placeholder title="Settings" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
