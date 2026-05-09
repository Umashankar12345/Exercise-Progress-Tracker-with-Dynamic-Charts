import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LogWorkout from './pages/LogWorkout';
import ProgressCharts from './pages/ProgressCharts';
import ExerciseLibrary from './pages/ExerciseLibrary';
import AIInsights from './pages/AIInsights';
import Profile from './pages/Profile';
import useStore from './store/useStore';
import './index.css';

const Placeholder = ({ title }) => (
  <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text2)' }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{title}</div>
    <div style={{ marginTop: 8, fontSize: 13 }}>Backend endpoint ready · Frontend coming soon.</div>
  </div>
);

// Protected route wrapper
function PrivateRoute({ children }) {
  const token = useStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
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
