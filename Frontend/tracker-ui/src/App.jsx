import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LogWorkout from './pages/LogWorkout';
import ProgressCharts from './pages/ProgressCharts';
import ExerciseLibrary from './pages/ExerciseLibrary';
import AIInsights from './pages/AIInsights';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="log" element={<LogWorkout />} />
          <Route path="charts" element={<ProgressCharts />} />
          <Route path="library" element={<ExerciseLibrary />} />
          <Route path="insights" element={<AIInsights />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
