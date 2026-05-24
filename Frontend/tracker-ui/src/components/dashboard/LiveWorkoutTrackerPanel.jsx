import React from 'react';
import {
  Pause,
  Square,
  Flame,
  Footprints,
  Navigation,
  Heart,
  Activity,
  ShieldCheck,
  Compass,
  Zap,
  Dumbbell,
  Compass as CompassIcon,
  Play
} from 'lucide-react';

const SUPPORTED_EXERCISES = [
  'Walking', 'Running', 'Pushups', 'Squats', 'Crunches', 'Jumping Jacks', 'Mountain Climbers', 'Lunges', 'Burpees'
];

export default function LiveWorkoutTrackerPanel({
  activeSession,
  onPause,
  onResume,
  onStop,
  onSelectExercise
}) {
  const isTracking = activeSession?.status === 'active';
  const isPaused = activeSession?.status === 'paused';
  const isActiveOrPaused = isTracking || isPaused;

  const currentExercise = activeSession?.exercise || 'Walking';
  const liveReps = activeSession?.reps || 0;
  const steps = activeSession?.steps || 0;
  const distance = activeSession?.distance || 0;
  const calories = activeSession?.calories || 0;
  const heartRate = activeSession?.heartRate || 72;
  const duration = activeSession?.duration || 0;
  const activityType = activeSession?.activityType || 'idle';

  const isRepBased = !['Walking', 'Running'].includes(currentExercise);

  const fmtTime = (s = 0) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const getActivityIcon = () => {
    if (!isActiveOrPaused) {
      return <Compass className="w-6 h-6 text-white/30" />;
    }

    if (currentExercise === 'Walking') {
      return <Footprints className="w-6 h-6 text-cyan-400" />;
    }
    if (currentExercise === 'Running') {
      return <Zap className="w-6 h-6 text-yellow-400" />;
    }
    return <Dumbbell className="w-6 h-6 text-purple-400" />;
  };

  // Estimate workout intensity level based on metrics
  const getIntensityLevel = () => {
    if (!isActiveOrPaused) return 'Standby';
    if (isRepBased) {
      return liveReps > 25 ? 'High Intensity' : (liveReps > 10 ? 'Moderate' : 'Low Active');
    }
    return distance > 2.0 ? 'High' : (distance > 0.5 ? 'Moderate' : 'Low Active');
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-[#0F172A]/70 to-[#070B14]/70 border border-white/10 p-6 relative overflow-hidden backdrop-blur-xl shadow-[0_0_40px_rgba(0,229,255,0.02)] h-full flex flex-col justify-between min-h-[350px]">
      
      {/* Pulse Glow on Rep Increment */}
      {isTracking && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 blur-[50px] rounded-full pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
            {getActivityIcon()}
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-1.5">
              Live Tracker Cockpit
            </h3>
            <span className="text-[10px] text-white/40 uppercase tracking-widest block mt-0.5">
              Engine: {currentExercise}
            </span>
          </div>
        </div>

        {/* Sensor badges */}
        {isTracking ? (
          <div className="px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-[9px] uppercase font-black tracking-widest flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
            Motion Sensor Active
          </div>
        ) : isPaused ? (
          <div className="px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-[9px] uppercase font-black tracking-widest">
            Paused
          </div>
        ) : (
          <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/30 text-[9px] uppercase font-black tracking-widest">
            Sensor Standby
          </div>
        )}
      </div>

      {/* Exercise Selection Grid - Switched dynamically */}
      {isActiveOrPaused && (
        <div className="mb-5">
          <span className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-2 block">
            Select Tracked Activity / Rep Pattern:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {SUPPORTED_EXERCISES.map((ex) => (
              <button
                key={ex}
                onClick={() => onSelectExercise && onSelectExercise(ex)}
                className={`py-1.5 px-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                  currentExercise === ex
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/40 shadow-[0_0_10px_rgba(0,229,255,0.1)]'
                    : 'bg-white/5 text-white/50 border-transparent hover:bg-white/10 hover:text-white'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Display: Steps vs Reps */}
      <div className="my-auto py-2 flex flex-col items-center">
        {isRepBased ? (
          /* Rep Counter HUD */
          <div className="flex flex-col items-center justify-center py-2 relative">
            <div className="absolute -inset-4 bg-purple-500/10 blur-xl rounded-full animate-pulse pointer-events-none" />
            <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-1">
              Repetitions Detected
            </span>
            <div 
              id="telemetry-rep-value" 
              className="text-7xl font-black text-white font-mono tracking-tighter transition-all duration-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              {liveReps}
            </div>
            <span className="text-[8px] text-white/40 font-bold uppercase tracking-wider mt-2">
              Sets Completed: {Math.max(1, Math.ceil(liveReps / 10))}
            </span>
          </div>
        ) : (
          /* Cardio Step HUD */
          <div className="flex gap-8 justify-center w-full">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-cyan-400 font-black uppercase tracking-widest mb-0.5">Steps</span>
              <div className="text-4xl font-black text-white font-mono">{steps}</div>
            </div>
            <div className="flex flex-col items-center border-l border-white/5 pl-8">
              <span className="text-[9px] text-yellow-400 font-black uppercase tracking-widest mb-0.5">Cadence</span>
              <div className="text-4xl font-black text-white font-mono">
                {activeSession?.cadence || 0} <span className="text-xs text-white/30 font-bold">SPM</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Calories */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-white/40 font-bold">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Calories
          </div>
          <div className="mt-2 text-xl font-black text-white font-mono">
            {isActiveOrPaused ? Math.round(calories) : 0}
            <span className="text-xs text-white/30 ml-1">kcal</span>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-white/40 font-bold">
            <Heart className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            Heart Rate
          </div>
          <div className="mt-2 text-xl font-black text-white font-mono">
            {isActiveOrPaused ? heartRate : '--'}
            <span className="text-xs text-white/30 ml-1">BPM</span>
          </div>
        </div>
      </div>

      {/* Bottom controls & Timer details */}
      <div className="mt-5 border-t border-white/5 pt-4 flex items-center justify-between">
        <div>
          <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold">
            Active Duration
          </div>
          <div className="text-xl font-black text-white font-mono mt-0.5">
            {isActiveOrPaused ? fmtTime(duration) : '00:00'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isActiveOrPaused ? (
            <>
              {isPaused ? (
                <button
                  onClick={onResume}
                  className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all text-xs font-black uppercase tracking-widest"
                >
                  Resume
                </button>
              ) : (
                <button
                  onClick={onPause}
                  className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-all text-xs font-black uppercase tracking-widest"
                >
                  Pause
                </button>
              )}
              <button
                onClick={onStop}
                className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                title="Finish & Save"
              >
                <Square className="w-4 h-4 fill-red-400" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-[#00E5FF] px-2.5 py-1 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-lg">
              <Activity className="w-3.5 h-3.5 animate-spin" />
              System Standby
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
