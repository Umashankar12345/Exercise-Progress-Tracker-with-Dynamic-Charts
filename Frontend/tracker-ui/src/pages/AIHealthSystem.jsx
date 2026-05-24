import React from 'react';
import { HeartPulse, Cpu } from 'lucide-react';
import useStore from '../store/useStore';
import GoogleFitDashboard from '../components/health/GoogleFitDashboard';

// Group 1
import HeartRateTracker from '../components/health/HeartRateTracker';
import OxygenLevelMonitor from '../components/health/OxygenLevelMonitor';
import BloodPressureLog from '../components/health/BloodPressureLog';
import MetabolismAnalysis from '../components/health/MetabolismAnalysis';
import BodyFatEstimator from '../components/health/BodyFatEstimator';

// Group 2
import SleepMonitoring from '../components/health/SleepMonitoring';
import RecoveryMonitoring from '../components/health/RecoveryMonitoring';
import StressMonitoring from '../components/health/StressMonitoring';
import DailyHealthScore from '../components/health/DailyHealthScore';
import HealthTimelineReplay from '../components/health/HealthTimelineReplay';

// Group 3
import WaterIntakeTracker from '../components/health/WaterIntakeTracker';
import HydrationAlerts from '../components/health/HydrationAlerts';
import CaloriesIntakeTracker from '../components/health/CaloriesIntakeTracker';
import NutritionAnalytics from '../components/health/NutritionAnalytics';
import SmartMedicationReminder from '../components/health/SmartMedicationReminder';

// Group 4
import AIDiseaseRiskPrediction from '../components/health/AIDiseaseRiskPrediction';
import AIHealthRecommendations from '../components/health/AIHealthRecommendations';
import SmartHealthAssistant from '../components/health/SmartHealthAssistant';
import EmergencyHealthAlerts from '../components/health/EmergencyHealthAlerts';
import BMICalculator from '../components/health/BMICalculator';

// Group 5
import MentalWellnessTracker from '../components/health/MentalWellnessTracker';
import MoodAnalytics from '../components/health/MoodAnalytics';
import BreathingExerciseTracker from '../components/health/BreathingExerciseTracker';
import HealthyHabitAnalytics from '../components/health/HealthyHabitAnalytics';
import SmartPostureDetection from '../components/health/SmartPostureDetection';

const HealthCard = ({ title, children, glowColor = 'bg-[#00F5FF]', colSpan = 1 }) => (
  <div className={`relative rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-6 overflow-hidden group hover:border-white/10 transition-colors ${colSpan === 2 ? 'xl:col-span-2' : 'xl:col-span-1'}`}>
    <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${glowColor.replace('bg-', '')} to-transparent opacity-20 group-hover:opacity-100 transition-opacity`} />
    <h3 className="text-[10px] font-black uppercase tracking-widest text-v2-soft-gray mb-4">{title}</h3>
    <div className="h-full w-full min-h-[200px] flex items-center justify-center relative">
      {children}
    </div>
  </div>
);

export default function AIHealthSystem() {
  const { user } = useStore();

  return (
    <div className="min-h-screen bg-[#050816] text-v2-text-white flex flex-col gap-8 pb-12 p-4 md:p-8 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-[#0F172A]/80 border border-white/10 shadow-[0_0_40px_rgba(34,211,238,0.03)] backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#EC4899]/10 border border-[#EC4899]/20">
              <HeartPulse className="w-5 h-5 text-[#EC4899]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-widest uppercase">FitTrack Health Intelligence</span>
              <span className="text-[10px] text-[#00F5FF] font-bold uppercase tracking-widest">Medical Engine Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Google Fit Integration */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
          <GoogleFitDashboard />
        </div>

        {/* Row 1: Core Vitals */}
        <HealthCard title="1. Live Heart Rate" glowColor="bg-[#EC4899]" colSpan={2}>
          <HeartRateTracker />
        </HealthCard>
        <HealthCard title="2. Blood Oxygen" glowColor="bg-[#00F5FF]">
          <OxygenLevelMonitor />
        </HealthCard>
        <HealthCard title="3. Blood Pressure" glowColor="bg-[#10B981]">
          <BloodPressureLog />
        </HealthCard>

        {/* Row 2: Recovery & Sleep */}
        <HealthCard title="4. WHOOP Recovery" glowColor="bg-[#10B981]" colSpan={1}>
          <RecoveryMonitoring />
        </HealthCard>
        <HealthCard title="5. Sleep Phases" glowColor="bg-[#8B5CF6]" colSpan={1}>
          <SleepMonitoring />
        </HealthCard>
        <HealthCard title="6. Daily Health Score" glowColor="bg-[#00F5FF]" colSpan={1}>
          <DailyHealthScore />
        </HealthCard>
        <HealthCard title="7. Real-Time Stress" glowColor="bg-[#F59E0B]" colSpan={1}>
          <StressMonitoring />
        </HealthCard>

        {/* Row 3: Nutrition & Hydration */}
        <HealthCard title="8. Hydration Tracker" glowColor="bg-[#3B82F6]" colSpan={1}>
          <WaterIntakeTracker />
        </HealthCard>
        <HealthCard title="9. Hydration Alerts" glowColor="bg-[#3B82F6]" colSpan={1}>
          <HydrationAlerts />
        </HealthCard>
        <HealthCard title="10. Caloric Intake" glowColor="bg-[#10B981]" colSpan={1}>
          <CaloriesIntakeTracker />
        </HealthCard>
        <HealthCard title="11. Macro Breakdown" glowColor="bg-[#EC4899]" colSpan={1}>
          <NutritionAnalytics />
        </HealthCard>

        {/* Row 4: Body Comp & Timeline */}
        <HealthCard title="12. 24h Health Timeline" glowColor="bg-[#3B82F6]" colSpan={2}>
          <HealthTimelineReplay />
        </HealthCard>
        <HealthCard title="13. Est. Body Fat" glowColor="bg-[#10B981]" colSpan={1}>
          <BodyFatEstimator />
        </HealthCard>
        <HealthCard title="14. Metabolism" glowColor="bg-[#F59E0B]" colSpan={1}>
          <MetabolismAnalysis />
        </HealthCard>

        {/* Row 5: AI Intelligence */}
        <HealthCard title="15. AI Health Assistant" glowColor="bg-[#3B82F6]" colSpan={2}>
          <SmartHealthAssistant />
        </HealthCard>
        <HealthCard title="16. AI Recommendations" glowColor="bg-[#F59E0B]" colSpan={1}>
          <AIHealthRecommendations />
        </HealthCard>
        <HealthCard title="17. Disease Risk Model" glowColor="bg-[#10B981]" colSpan={1}>
          <AIDiseaseRiskPrediction />
        </HealthCard>

        {/* Row 6: Mental & Lifestyle */}
        <HealthCard title="18. Mood Heatmap" glowColor="bg-[#8B5CF6]" colSpan={2}>
          <MoodAnalytics />
        </HealthCard>
        <HealthCard title="19. Cognitive Load" glowColor="bg-[#8B5CF6]" colSpan={1}>
          <MentalWellnessTracker />
        </HealthCard>
        <HealthCard title="20. Box Breathing" glowColor="bg-[#00F5FF]" colSpan={1}>
          <BreathingExerciseTracker />
        </HealthCard>

        {/* Row 7: Alerts & Tracking */}
        <HealthCard title="21. Emergency Alerts" glowColor="bg-[#EF4444]" colSpan={1}>
          <EmergencyHealthAlerts />
        </HealthCard>
        <HealthCard title="22. Supplements" glowColor="bg-[#8B5CF6]" colSpan={1}>
          <SmartMedicationReminder />
        </HealthCard>
        <HealthCard title="23. Daily Habits" glowColor="bg-[#10B981]" colSpan={1}>
          <HealthyHabitAnalytics />
        </HealthCard>
        <HealthCard title="24. Spinal Alignment" glowColor="bg-[#00F5FF]" colSpan={1}>
          <SmartPostureDetection />
        </HealthCard>

        {/* Row 8: Extras */}
        <HealthCard title="25. BMI Calculator" glowColor="bg-[#10B981]" colSpan={4}>
          <BMICalculator />
        </HealthCard>
      </div>
    </div>
  );
}
