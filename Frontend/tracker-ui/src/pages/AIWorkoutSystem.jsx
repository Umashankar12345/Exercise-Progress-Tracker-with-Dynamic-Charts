import React from 'react';
import { Activity, Zap, ShieldAlert, Cpu } from 'lucide-react';
import useStore from '../store/useStore';

// Group 1: AI Planning & Generation
import AIWorkoutGenerator from '../components/workout/AIWorkoutGenerator';
import SmartExerciseSuggestions from '../components/workout/SmartExerciseSuggestions';
import DragDropWorkoutPlanner from '../components/workout/DragDropWorkoutPlanner';
import WorkoutSplitPlanner from '../components/workout/WorkoutSplitPlanner';

// Group 2: Live Tracking & Execution
import LiveSessionTimer from '../components/workout/LiveSessionTimer';
import SmartRestTimer from '../components/workout/SmartRestTimer';
import ExerciseVideoDemos from '../components/workout/ExerciseVideoDemos';
import WorkoutCompletionAnimations from '../components/workout/WorkoutCompletionAnimations';

// Group 3: AI Computer Vision
import AIRepCounter from '../components/workout/AIRepCounter';
import AIFormCorrection from '../components/workout/AIFormCorrection';
import WebcamPoseDetection from '../components/workout/WebcamPoseDetection';
import MuscleGroupHeatmap from '../components/workout/MuscleGroupHeatmap';

// Group 4: Progress & Adaptability
import AutoWorkoutSuggestions from '../components/workout/AutoWorkoutSuggestions';
import ProgressiveOverloadChart from '../components/workout/ProgressiveOverloadChart';
import ExerciseDifficultyProgression from '../components/workout/ExerciseDifficultyProgression';
import WorkoutStreakTracker from '../components/workout/WorkoutStreakTracker';

// Group 5: Specialized Routines & Telemetry
import SmartWarmupGenerator from '../components/workout/SmartWarmupGenerator';
import SmartCooldownGenerator from '../components/workout/SmartCooldownGenerator';
import HIITCircuitGenerator from '../components/workout/HIITCircuitGenerator';
import RouteTrackerMap from '../components/workout/RouteTrackerMap';

const WorkoutCard = ({ title, children, glowColor = 'bg-v2-cyan', colSpan = 1 }) => (
  <div className={`relative rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-6 overflow-hidden group hover:border-white/10 transition-colors ${colSpan === 2 ? 'xl:col-span-2' : 'xl:col-span-1'}`}>
    <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${glowColor.replace('bg-', '')} to-transparent opacity-20 group-hover:opacity-100 transition-opacity`} />
    <h3 className="text-[10px] font-black uppercase tracking-widest text-v2-soft-gray mb-4">{title}</h3>
    <div className="h-full w-full min-h-[200px] flex items-center justify-center relative">
      {children}
    </div>
  </div>
);

export default function AIWorkoutSystem() {
  const { user } = useStore();

  return (
    <div className="min-h-screen bg-[#050816] text-v2-text-white flex flex-col gap-8 pb-12 p-4 md:p-8 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-[#0F172A]/80 border border-white/10 shadow-[0_0_40px_rgba(34,211,238,0.03)] backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20">
              <Cpu className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-widest uppercase">FitTrack AI Intelligence</span>
              <span className="text-[10px] text-[#22D3EE] font-bold uppercase tracking-widest">Workout Engine Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Row 1: AI Planning & Generation */}
        <WorkoutCard title="1. AI Workout Generator" glowColor="bg-[#00F5FF]" colSpan={2}>
          <AIWorkoutGenerator />
        </WorkoutCard>
        <WorkoutCard title="2. Smart Exercise Suggestions" glowColor="bg-[#8B5CF6]">
          <SmartExerciseSuggestions />
        </WorkoutCard>
        <WorkoutCard title="3. Drag & Drop Planner" glowColor="bg-[#EC4899]">
          <DragDropWorkoutPlanner />
        </WorkoutCard>

        {/* Row 2: Live Tracking & Execution */}
        <WorkoutCard title="4. Live Session Timer" glowColor="bg-[#22D3EE]" colSpan={2}>
          <LiveSessionTimer />
        </WorkoutCard>
        <WorkoutCard title="5. Smart Rest Timer" glowColor="bg-[#00F5FF]">
          <SmartRestTimer />
        </WorkoutCard>
        <WorkoutCard title="6. Workout Split Planner" glowColor="bg-[#8B5CF6]">
          <WorkoutSplitPlanner />
        </WorkoutCard>

        {/* Row 3: AI Computer Vision & Telemetry */}
        <WorkoutCard title="7. AI Rep Counter" glowColor="bg-[#EC4899]" colSpan={1}>
          <AIRepCounter />
        </WorkoutCard>
        <WorkoutCard title="8. Webcam Pose Detection" glowColor="bg-[#00F5FF]" colSpan={1}>
          <WebcamPoseDetection />
        </WorkoutCard>
        <WorkoutCard title="9. AI Form Correction" glowColor="bg-[#8B5CF6]" colSpan={1}>
          <AIFormCorrection />
        </WorkoutCard>
        <WorkoutCard title="10. Muscle Group Heatmap" glowColor="bg-[#EC4899]" colSpan={1}>
          <MuscleGroupHeatmap />
        </WorkoutCard>

        {/* Row 4: Progress & Adaptability */}
        <WorkoutCard title="11. Progressive Overload" glowColor="bg-[#8B5CF6]" colSpan={2}>
          <ProgressiveOverloadChart />
        </WorkoutCard>
        <WorkoutCard title="12. Auto Workout Suggestions" glowColor="bg-[#00F5FF]">
          <AutoWorkoutSuggestions />
        </WorkoutCard>
        <WorkoutCard title="13. Difficulty Progression" glowColor="bg-[#EC4899]">
          <ExerciseDifficultyProgression />
        </WorkoutCard>

        {/* Row 5: Specialized Routines */}
        <WorkoutCard title="14. HIIT Circuit Generator" glowColor="bg-[#22D3EE]" colSpan={1}>
          <HIITCircuitGenerator />
        </WorkoutCard>
        <WorkoutCard title="15. Smart Warmup" glowColor="bg-[#F59E0B]" colSpan={1}>
          <SmartWarmupGenerator />
        </WorkoutCard>
        <WorkoutCard title="16. Smart Cooldown" glowColor="bg-[#3B82F6]" colSpan={1}>
          <SmartCooldownGenerator />
        </WorkoutCard>
        <WorkoutCard title="17. Route Tracker Map" glowColor="bg-[#00F5FF]" colSpan={1}>
          <RouteTrackerMap />
        </WorkoutCard>

        {/* Row 6: Motivation & Meta */}
        <WorkoutCard title="18. Exercise Video Demos" glowColor="bg-[#8B5CF6]" colSpan={2}>
          <ExerciseVideoDemos />
        </WorkoutCard>
        <WorkoutCard title="19. Workout Streak Tracker" glowColor="bg-[#F59E0B]" colSpan={1}>
          <WorkoutStreakTracker />
        </WorkoutCard>
        <WorkoutCard title="20. Completion Animations" glowColor="bg-[#00F5FF]" colSpan={1}>
          <WorkoutCompletionAnimations />
        </WorkoutCard>
      </div>
    </div>
  );
}
