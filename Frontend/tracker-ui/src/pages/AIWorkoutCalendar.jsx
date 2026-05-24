import React from 'react';
import { Calendar } from 'lucide-react';
import useStore from '../store/useStore';

// Calendar Widgets
import LiveWorkoutCalendar from '../components/calendar/LiveWorkoutCalendar';
import CalendarHeatmapOverlay from '../components/calendar/CalendarHeatmapOverlay';
import WorkoutReplayModal from '../components/calendar/WorkoutReplayModal';
import LiveStreakTracker from '../components/calendar/LiveStreakTracker';
import AIRecoveryScheduler from '../components/calendar/AIRecoveryScheduler';
import CommunityChallengeSystem from '../components/calendar/CommunityChallengeSystem';
import SmartReminderSystem from '../components/calendar/SmartReminderSystem';
import LiveSmartwatchSync from '../components/calendar/LiveSmartwatchSync';

export default function AIWorkoutCalendar() {
  const { user } = useStore();

  return (
    <div className="min-h-screen bg-[#050816] text-v2-text-white flex flex-col gap-6 pb-12 p-4 md:p-8 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-[#0F172A]/80 border border-white/10 shadow-[0_0_40px_rgba(34,211,238,0.03)] backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
              <Calendar className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-widest uppercase">AI Scheduling Intelligence</span>
              <span className="text-[10px] text-[#22D3EE] font-bold uppercase tracking-widest">Live Calendar Synced</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Calendar Grid Area (75%) */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="w-full min-h-[600px] rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-6 overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-20" />
             <h3 className="text-[10px] font-black uppercase tracking-widest text-v2-soft-gray mb-6">Interactive Master Calendar</h3>
             
             {/* Core Calendar Component */}
             <div className="w-full h-full">
               <LiveWorkoutCalendar />
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Heatmap & Replay */}
             <CalendarHeatmapOverlay />
             <WorkoutReplayModal />
          </div>
        </div>

        {/* Sidebar Widgets Area (25%) */}
        <div className="w-full xl:w-[350px] flex flex-col gap-6">
          {/* Widgets */}
          <LiveStreakTracker />
          <AIRecoveryScheduler />
          <CommunityChallengeSystem />
          <SmartReminderSystem />
          <LiveSmartwatchSync />
        </div>
      </div>
    </div>
  );
}
