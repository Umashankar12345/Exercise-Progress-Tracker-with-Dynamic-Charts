import React, { useState, useEffect } from 'react';
import { ShieldAlert, Server, Zap, Globe, Bell, Mic, Activity } from 'lucide-react';
import useStore from '../store/useStore';
import api from '../api/axios';

// Group 1
import WeightProgressChart from '../components/enterprise/v2/WeightProgressChart';
import CaloriesAreaChart from '../components/enterprise/v2/CaloriesAreaChart';
import WaterIntakeRing from '../components/enterprise/v2/WaterIntakeRing';
import WorkoutPieChart from '../components/enterprise/v2/WorkoutPieChart';

// Group 2
import WeeklyPerformanceBar from '../components/enterprise/v2/WeeklyPerformanceBar';
import StreakRing from '../components/enterprise/v2/StreakRing';
import SleepAnalyticsGraph from '../components/enterprise/v2/SleepAnalyticsGraph';
import HeartRateLiveChart from '../components/enterprise/v2/HeartRateLiveChart';

// Group 3
import MuscleRadarChart from '../components/enterprise/v2/MuscleRadarChart';
import ActivityHeatmapV2 from '../components/enterprise/v2/ActivityHeatmapV2';
import GoalGauge from '../components/enterprise/v2/GoalGauge';
import TransformationTimeline from '../components/enterprise/v2/TransformationTimeline';

// Group 4
import AIPredictionChart from '../components/enterprise/v2/AIPredictionChart';
import WorkoutFrequencyHistogram from '../components/enterprise/v2/WorkoutFrequencyHistogram';
import RecoveryGraph from '../components/enterprise/v2/RecoveryGraph';
import DailyEnergyCurve from '../components/enterprise/v2/DailyEnergyCurve';

// Group 5
import StepTrackingChart from '../components/enterprise/v2/StepTrackingChart';
import StressMonitoringGraph from '../components/enterprise/v2/StressMonitoringGraph';
import FitnessComparisonChart from '../components/enterprise/v2/FitnessComparisonChart';
import IsometricAnalyticsDashboard from '../components/enterprise/v2/IsometricAnalyticsDashboard';

// We will import the 20 charts as we build them.
// For now, they are simulated wrappers to ensure layout scale.

const V2Card = ({ title, children, glowColor = 'bg-v2-cyan' }) => (
  <div className="relative rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-6 overflow-hidden group hover:border-white/10 transition-colors">
    <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${glowColor.replace('bg-', '')} to-transparent opacity-20 group-hover:opacity-100 transition-opacity`} />
    <h3 className="text-xs font-black uppercase tracking-widest text-v2-soft-gray mb-4">{title}</h3>
    <div className="h-full w-full min-h-[200px]">
      {children}
    </div>
  </div>
);

export default function V2EnterpriseDashboard() {
  const { user } = useStore();
  const [dbStatus, setDbStatus] = useState('SYNCING');

  useEffect(() => {
    setTimeout(() => setDbStatus('ONLINE'), 1500);
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-v2-text-white flex flex-col gap-8 pb-12 p-4 md:p-8 font-inter">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-[#0F172A]/80 border border-white/10 shadow-[0_0_40px_rgba(0,245,255,0.03)] backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-v2-neon-blue/10 border border-v2-neon-blue/20">
              <Zap className="w-4 h-4 text-v2-neon-blue" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-widest uppercase">V2 Intelligence Engine</span>
              <span className="text-[10px] text-v2-neon-blue font-bold uppercase tracking-widest">Real-time Stream Active</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-v2-soft-gray uppercase tracking-widest">PostgreSQL</span>
              <span className={`text-xs font-black ${dbStatus === 'ONLINE' ? 'text-emerald-400' : 'text-yellow-400'}`}>{dbStatus}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-v2-soft-gray uppercase tracking-widest">API Latency</span>
              <span className="text-xs font-black text-white">42ms</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-v2-soft-gray uppercase tracking-widest">WebSockets</span>
              <span className="text-xs font-black text-v2-cyan">Connected</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button className="relative p-2.5 rounded-full bg-white/5 border border-white/10 text-v2-soft-gray hover:text-white hover:bg-white/10 transition-all">
            <Bell className="w-4 h-4" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-v2-pink shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-v2-purple/10 border border-v2-purple/20 text-v2-purple hover:bg-v2-purple/20 transition-all">
            <Mic className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Voice AI</span>
          </button>
        </div>
      </div>

      {/* Massive 20-Chart Grid Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Row 1: Core Biometrics (Live Streaming Focus) */}
        <div className="xl:col-span-2">
           <V2Card title="1. Weight Progress & AI Prediction" glowColor="bg-[#00F5FF]">
             <WeightProgressChart />
           </V2Card>
        </div>
        <div className="xl:col-span-1">
           <V2Card title="2. Calories Burned Stream" glowColor="bg-[#EC4899]">
             <CaloriesAreaChart />
           </V2Card>
        </div>
        <div className="xl:col-span-1">
           <V2Card title="3. Hydration & Intake" glowColor="bg-[#22D3EE]">
             <WaterIntakeRing />
           </V2Card>
        </div>

        {/* Row 2: Analytics & Symmetry */}
        <div className="xl:col-span-1">
           <V2Card title="4. Workout Category Distribution" glowColor="bg-[#8B5CF6]">
             <WorkoutPieChart />
           </V2Card>
        </div>
        <div className="xl:col-span-2">
           <V2Card title="5. Weekly Performance Volume" glowColor="bg-[#00F5FF]">
             <WeeklyPerformanceBar />
           </V2Card>
        </div>
        <div className="xl:col-span-1">
           <V2Card title="6. Streak & Consistency" glowColor="bg-[#EC4899]">
             <StreakRing />
           </V2Card>
        </div>

        {/* Row 3: Recovery & Biology */}
        <div className="xl:col-span-1">
           <V2Card title="7. Sleep Architecture" glowColor="bg-[#8B5CF6]">
             <SleepAnalyticsGraph />
           </V2Card>
        </div>
        <div className="xl:col-span-1">
           <V2Card title="8. Live BPM Stream" glowColor="bg-[#EC4899]">
             <HeartRateLiveChart />
           </V2Card>
        </div>
        <div className="xl:col-span-1">
           <V2Card title="9. Muscle Symmetry" glowColor="bg-[#22D3EE]">
             <MuscleRadarChart />
           </V2Card>
        </div>
        <div className="xl:col-span-1">
           <V2Card title="10. Activity Heatmap" glowColor="bg-[#00F5FF]">
             <ActivityHeatmapV2 />
           </V2Card>
        </div>

        {/* Row 4: AI & Transformation */}
        <div className="xl:col-span-1">
           <V2Card title="11. Goal Completion Confidence" glowColor="bg-[#22D3EE]">
             <GoalGauge />
           </V2Card>
        </div>
        <div className="xl:col-span-2">
           <V2Card title="12. Transformation Timeline" glowColor="bg-[#8B5CF6]">
             <TransformationTimeline />
           </V2Card>
        </div>
        <div className="xl:col-span-1">
           <V2Card title="13. AI ML Prediction Overlay" glowColor="bg-[#00F5FF]">
             <AIPredictionChart />
           </V2Card>
        </div>

        {/* Row 5: Deep Analytics */}
        <div className="xl:col-span-1">
           <V2Card title="14. Workout Frequency" glowColor="bg-[#8B5CF6]">
             <WorkoutFrequencyHistogram />
           </V2Card>
        </div>
        <div className="xl:col-span-1">
           <V2Card title="15. HRV & Recovery" glowColor="bg-[#EC4899]">
             <RecoveryGraph />
           </V2Card>
        </div>
        <div className="xl:col-span-1">
           <V2Card title="16. Daily Energy Tracking" glowColor="bg-[#00F5FF]">
             <DailyEnergyCurve />
           </V2Card>
        </div>
        <div className="xl:col-span-1">
           <V2Card title="17. Live Step Stream" glowColor="bg-[#22D3EE]">
             <StepTrackingChart />
           </V2Card>
        </div>

        {/* Row 6: Meta Systems */}
        <div className="xl:col-span-1">
           <V2Card title="18. Stress & Burnout" glowColor="bg-[#EC4899]">
             <StressMonitoringGraph />
           </V2Card>
        </div>
        <div className="xl:col-span-1">
           <V2Card title="19. Community Comparison" glowColor="bg-[#8B5CF6]">
             <FitnessComparisonChart />
           </V2Card>
        </div>
        <div className="xl:col-span-2">
           <V2Card title="20. Isometric 3D Analytics Core" glowColor="bg-[#00F5FF]">
             <IsometricAnalyticsDashboard />
           </V2Card>
        </div>
      </div>
    </div>
  );
}

