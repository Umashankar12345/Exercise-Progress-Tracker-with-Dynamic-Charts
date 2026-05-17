import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Plus, 
  Trash2, 
  Save, 
  Zap, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Target,
  History,
  Activity,
  Loader2
} from 'lucide-react';
import api from '../api/axios';
import AIInsightsCard from '../components/AIInsightsCard';

const EXERCISES = {
  Chest:     ['Bench Press', 'Incline DB Press', 'Cable Fly', 'Chest Dips'],
  Back:      ['Deadlift', 'Pull-ups', 'Barbell Row', 'Lat Pulldown'],
  Legs:      ['Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curl'],
  Shoulders: ['Overhead Press', 'Lateral Raises', 'Face Pulls'],
  Arms:      ['Barbell Curl', 'Tricep Pushdown', 'Hammer Curl'],
  Core:      ['Plank', 'Cable Crunch', 'Leg Raise'],
};

const defaultSets = [
  { id: 1, reps: 10, weight: 60 },
  { id: 2, reps: 10, weight: 60 },
  { id: 3, reps: 8,  weight: 65 },
];

export default function LogWorkout() {
  const [exercise, setExercise] = useState('');
  const [sets, setSets]         = useState(defaultSets);
  const [notes, setNotes]       = useState('');
  const [status, setStatus]     = useState(null);
  const [msg, setMsg]           = useState('');
  const [goals, setGoals]       = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    api.get('/goals').then(r => setGoals(r.data.data || [])).catch(() => {});
  }, []);

  const updateSet = (id, field, val) =>
    setSets(prev => prev.map(s => s.id === id ? { ...s, [field]: Number(val) } : s));
  
  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    setSets(prev => [...prev, { 
      id: Date.now(), 
      reps: lastSet?.reps ?? 10, 
      weight: lastSet?.weight ?? 60 
    }]);
  };

  const delSet = (id) =>
    setSets(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);

  const handleSubmit = async () => {
    if (!exercise) { 
      setStatus('error'); 
      setMsg('Please select an exercise before logging.'); 
      return; 
    }
    setLoading(true);
    setStatus(null);
    setMsg('');
    try {
      await api.post('/workouts', {
        name: exercise,
        started_at: new Date().toISOString(),
        ended_at:   new Date().toISOString(),
        notes,
        sets: sets.map(s => ({ reps: s.reps, weight: s.weight })),
      });
      setStatus('success');
      setMsg(`Workout saved successfully! AI Insights are being generated.`);
      setSets(defaultSets); 
      setExercise(''); 
      setNotes('');
      setTimeout(() => { setStatus(null); setMsg(''); }, 5000);
    } catch (err) {
      setStatus('error');
      setMsg(err.response?.data?.message || 'Failed to save workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Real-time Tracking Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container border border-outline-variant">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
            <Activity className="w-5 h-5 text-secondary animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-widest">Active Session Tracking</h2>
            <p className="text-[10px] text-on-surface-variant font-medium">Real-time WebSocket event listeners active</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['workout.saved', 'pr.achieved', 'goal.progress'].map(evt => (
            <div key={evt} className="px-2.5 py-1 bg-surface-bright border border-outline-variant rounded-md text-[9px] font-black text-on-surface-variant uppercase tracking-tighter">
              {evt}
            </div>
          ))}
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
          status === 'success' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          <span className="text-sm font-bold">{msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Logging Form */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-card">
            <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-lg font-bold text-on-surface tracking-tight">Record Workout</h3>
                  <p className="text-xs text-on-surface-variant font-medium">Detailed set logging with instant PR detection</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-surface-bright rounded-full border border-outline-variant">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">LIVE DB</span>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Exercise Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Selected Exercise</label>
                <div className="relative group">
                  <select 
                    value={exercise} 
                    onChange={e => setExercise(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl py-4 pl-4 pr-10 text-on-surface font-bold focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Choose exercise...</option>
                    {Object.entries(EXERCISES).map(([group, items]) => (
                      <optgroup key={group} label={group} className="bg-surface font-bold text-primary">
                        {items.map(ex => <option key={ex} value={ex} className="text-on-surface">{ex}</option>)}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:rotate-90 transition-transform pointer-events-none" />
                </div>
              </div>

              {/* Set Logging Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Set Progression</h4>
                  <button 
                    onClick={addSet}
                    className="flex items-center gap-1.5 text-[10px] font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add New Set
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Header */}
                  <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-4 px-4 text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">
                    <span className="text-center">Set</span>
                    <span className="text-center">Reps</span>
                    <span className="text-center">Weight (kg)</span>
                    <span className="text-center">Volume</span>
                    <span></span>
                  </div>

                  {/* Rows */}
                  {sets.map((s, idx) => (
                    <div 
                      key={s.id} 
                      className={`grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-4 items-center p-3 rounded-xl border border-outline-variant bg-surface-container transition-all hover:border-outline ${
                        idx === sets.length - 1 ? 'ring-1 ring-primary/20 bg-primary/5 border-primary/20' : ''
                      }`}
                    >
                      <div className="text-center text-xs font-black text-on-surface-variant">{idx + 1}</div>
                      <div className="flex flex-col gap-1.5 w-full">
                        <label htmlFor={`reps-${s.id}`} className="sr-only">Reps</label>
                        <input 
                          id={`reps-${s.id}`}
                          type="number" 
                          value={s.reps}
                          onChange={e => updateSet(s.id, 'reps', e.target.value)}
                          className="bg-surface-bright border border-outline-variant rounded-lg py-2 text-center text-sm font-bold text-on-surface focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 w-full">
                        <label htmlFor={`weight-${s.id}`} className="sr-only">Weight</label>
                        <input 
                          id={`weight-${s.id}`}
                          type="number" 
                          value={s.weight}
                          onChange={e => updateSet(s.id, 'weight', e.target.value)}
                          className={`bg-surface-bright border border-outline-variant rounded-lg py-2 text-center text-sm font-bold focus:outline-none focus:border-primary ${
                            s.weight > 100 ? 'text-tertiary' : 'text-on-surface'
                          }`}
                        />
                      </div>
                      <div className="text-center text-sm font-black text-on-surface-variant">
                        {(s.reps * s.weight).toLocaleString()}
                      </div>
                      <button 
                        onClick={() => delSet(s.id)}
                        className="flex items-center justify-center text-on-surface-variant hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Session Notes</label>
                <textarea 
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="How did it feel? (e.g. Explosive reps, felt heavy today...)"
                  className="w-full bg-surface-container border border-outline-variant rounded-xl p-4 text-sm text-on-surface font-medium focus:outline-none focus:border-primary transition-all min-h-[100px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button 
                id="submit-workout-button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-5 h-5" fill="white" />
                    SUBMIT WORKOUT DATA
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <AIInsightsCard />

          {/* Goal Progress Widget */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-tertiary" />
                <h4 className="text-xs font-black text-on-surface uppercase tracking-widest">Active Goals</h4>
              </div>
              <History className="w-4 h-4 text-on-surface-variant" />
            </div>
            <div className="p-4 space-y-6">
              {(!Array.isArray(goals) || goals.length === 0) ? (
                <p className="text-xs text-on-surface-variant text-center py-4 italic">No active goals found.</p>
              ) : (
                goals.map(g => (
                  <div key={g.id} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">Weight Goal</span>
                        <span className="text-sm font-bold text-on-surface">{g.target_weight} kg</span>
                      </div>
                      <span className="text-lg font-black text-secondary">{g.percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-bright rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-secondary rounded-full transition-all duration-1000" 
                        style={{ width: `${g.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-[10px] font-black text-secondary uppercase tracking-widest">System Architecture</span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-bold leading-relaxed">
              Submitting this workout triggers the <span className="text-on-surface">WorkoutObserver</span>. 
              The backend dispatches an async <span className="text-on-surface">AnalyzeWorkoutJob</span> 
              which uses <span className="text-on-surface">Gemini AI</span> to update your insights via 
              <span className="text-secondary"> Laravel Reverb</span> WebSockets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
