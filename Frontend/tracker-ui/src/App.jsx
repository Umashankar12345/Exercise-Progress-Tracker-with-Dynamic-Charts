import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import V2EnterpriseDashboard from './pages/V2EnterpriseDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import LiveWorkoutMode from './components/dashboard/LiveWorkoutMode';
import AIWorkoutSystem from './pages/AIWorkoutSystem';
import AIHealthSystem from './pages/AIHealthSystem';
import AIWorkoutCalendar from './pages/AIWorkoutCalendar';
import AISocialSystem from './pages/AISocialSystem';
import AIFitnessIntelligence from './pages/AIFitnessIntelligence';
import AIFuturisticEcosystem from './pages/AIFuturisticEcosystem';
import LogWorkout from './pages/LogWorkout';
import ProgressCharts from './pages/ProgressCharts';
import ExerciseLibrary from './pages/ExerciseLibrary';
import ExerciseDetail from './pages/ExerciseDetail';
import AIInsights from './pages/AIInsights';
import Profile from './pages/Profile';
import Plan from './pages/Plan';
import Report from './pages/Report';
import Settings from './pages/Settings';
import Health from './pages/Health';
import AIChat from './pages/AIChat';
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
          <Route path="enterprise-v2" element={<V2EnterpriseDashboard />} />
          <Route path="enterprise-v1" element={<EnterpriseDashboard />} />
          <Route path="live-workout/:id" element={<LiveWorkoutMode />} />
          <Route path="ai-workout" element={<AIWorkoutSystem />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="health-intelligence" element={<AIHealthSystem />} />
          <Route path="calendar" element={<AIWorkoutCalendar />} />
          <Route path="social" element={<AISocialSystem />} />
          <Route path="intelligence" element={<AIFitnessIntelligence />} />
          <Route path="futuristic" element={<AIFuturisticEcosystem />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          <Route path="log"      element={<LogWorkout />} />
          <Route path="charts"   element={<ProgressCharts />} />
          <Route path="library"  element={<ExerciseLibrary />} />
          <Route path="library/:id" element={<ExerciseDetail />} />
          <Route path="insights" element={<AIInsights />} />
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
