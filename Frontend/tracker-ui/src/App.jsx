import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import LiveWorkoutMode from './components/dashboard/LiveWorkoutMode';
import AIWorkoutSystem from './pages/AIWorkoutSystem';
import AISocialSystem from './pages/AISocialSystem';
import LogWorkout from './pages/LogWorkout';
import ExerciseLibrary from './pages/ExerciseLibrary';
import ExerciseDetail from './pages/ExerciseDetail';
import JarvisAI from './pages/JarvisAI';
import Profile from './pages/Profile';
import Plan from './pages/Plan';
import Report from './pages/Report';
import Settings from './pages/Settings';
import Health from './pages/Health';
import useStore from './store/useStore';
import './index.css';

// Protected route wrapper
function PrivateRoute({ children }) {
  const token = useStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index           element={<Dashboard />} />
          <Route path="enterprise" element={<AnalyticsDashboard />} />
          <Route path="live-workout/:id" element={<LiveWorkoutMode />} />
          <Route path="ai-workout" element={<AIWorkoutSystem />} />
          {/* Unified Jarvis AI Coach */}
          <Route path="jarvis" element={<JarvisAI />} />
          {/* Legacy redirects */}
          <Route path="ai-chat" element={<Navigate to="/jarvis" replace />} />
          <Route path="insights" element={<Navigate to="/jarvis" replace />} />
          <Route path="social" element={<AISocialSystem />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          <Route path="log"      element={<LogWorkout />} />
          <Route path="library"  element={<ExerciseLibrary />} />
          <Route path="library/:id" element={<ExerciseDetail />} />
          <Route path="profile"  element={<Profile />} />
          <Route path="plan"     element={<Plan />} />
          <Route path="report"   element={<Report />} />
          <Route path="health"   element={<Health />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
