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
  Loader2,
  Calculator,
  Eye,
  HelpCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import useStore from '../store/useStore';
import PlateCalculatorModal from '../components/PlateCalculatorModal';
import FocusModeHUD from '../components/FocusModeHUD';
import CardioPaceChart from '../components/CardioPaceChart';
import AIInsightsCard from '../components/AIInsightsCard';
import ActiveSessionTracking from '../components/ActiveSessionTracking';

const defaultSets = [
  { id: 1, reps: 10, weight: 60, distance: '', duration_seconds: '', type: 'strength' },
];

export default function LogWorkout() {
  const { isFocusActive, setIsFocusActive } = useStore();
  const [dbExercises, setDbExercises] = useState([]);
  const [exercise, setExercise] = useState('');
  const [sets, setSets]         = useState(defaultSets);
  const [notes, setNotes]       = useState('');
  const [intensity, setIntensity] = useState(7);
  const [status, setStatus]     = useState(null);
  const [msg, setMsg]           = useState('');
  const [goals, setGoals]       = useState([]);
  const [loading, setLoading]   = useState(false);

  // Focus & Calculator UI states
  const [activeCalculatorWeight, setActiveCalculatorWeight] = useState(null);
  const [ghostPlaceholder, setGhostPlaceholder] = useState(null);
  const [advisingPayload, setAdvisingPayload] = useState(null);

  // Dynamic Rest Timer state
  const [restTimer, setRestTimer] = useState(null);

  // Workout History state
  const [historyList, setHistoryList] = useState([]);
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState('All');
  
  // Edit Workout Form state
  const [editWorkout, setEditWorkout] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', notes: '', duration: '', calories_burned: '' });

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/workouts');
      setHistoryList(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;
    try {
      await api.delete(`/workouts/${id}`);
      fetchHistory();
      alert("Workout deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete workout.");
    }
  };

  const handleEditWorkout = (w) => {
    setEditWorkout(w);
    setEditForm({
      name: w.name,
      notes: w.notes || '',
      duration: w.duration || '',
      calories_burned: w.calories_burned || ''
    });
  };

  const handleUpdateWorkout = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/workouts/${editWorkout.id}`, editForm);
      setEditWorkout(null);
      fetchHistory();
      alert("Workout updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update workout.");
    }
  };

  useEffect(() => {
    api.get('/goals').then(r => setGoals(r.data?.data || [])).catch(() => {});
    api.get('/exercises').then(r => {
      const data = r.data?.data || r.data;
      setDbExercises(Array.isArray(data) ? data : []);
    }).catch(e => console.error("Exercises fetch error", e));
    fetchHistory();
  }, []);

  const selectedExObj = dbExercises.find(e => e.name === exercise);

  useEffect(() => {
    if (selectedExObj) {
      // 1. Fetch ghost placeholder
      api.get(`/exercises/${selectedExObj.id}/ghost-placeholder`)
        .then(r => setGhostPlaceholder(r.data))
        .catch(() => setGhostPlaceholder(null));

      // 2. Fetch target advising overload advice
      api.get(`/analytics/target-advising?exercise_id=${selectedExObj.id}`)
        .then(r => setAdvisingPayload(r.data))
        .catch(() => setAdvisingPayload(null));
    } else {
      setGhostPlaceholder(null);
      setAdvisingPayload(null);
    }
  }, [selectedExObj]);

  // Rest Timer ticking effect
  useEffect(() => {
    let interval;
    if (restTimer !== null && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    } else if (restTimer === 0) {
      // Auto-hide when it reaches 0
      setTimeout(() => setRestTimer(null), 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  const groupedExercises = dbExercises.reduce((acc, ex) => {
    const group = ex.muscle_group || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(ex.name);
    return acc;
  }, {});

  const updateSet = (id, field, val) => {
    setSets(prev => prev.map(s => {
      if (s.id === id) {
        let parsedVal = val;
        if (field === 'reps' || field === 'duration_seconds') {
          parsedVal = val === '' ? '' : Math.max(0, parseInt(val) || 0);
        } else if (field === 'weight' || field === 'distance') {
          parsedVal = val === '' ? '' : Math.max(0, parseFloat(val) || 0);
        }
        return { ...s, [field]: parsedVal };
      }
      return s;
    }));
  };
  
  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    setSets(prev => [...prev, { 
      id: Date.now(), 
      reps: lastSet?.reps ?? 10, 
      weight: lastSet?.weight ?? 60,
      distance: lastSet?.distance ?? '',
      duration_seconds: lastSet?.duration_seconds ?? '',
      type: lastSet?.type ?? 'strength'
    }]);
  };

  const delSet = (id) =>
    setSets(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);

  const handleSubmit = async () => {
    if (!exercise) { 
      setStatus('error'); 
      setMsg('Please select an exercise before logging.'); 
      toast.error('Please select an exercise first!');
      return; 
    }
    setLoading(true);
    setStatus(null);
    setMsg('');
    try {
      const response = await api.post('/workouts', {
        name: exercise,
        started_at: new Date().toISOString(),
        ended_at:   new Date().toISOString(),
        notes: `[Intensity: ${intensity}/10] ${notes}`,
        sets: sets.map(s => ({ 
          reps: s.type === 'cardio' ? 0 : Number(s.reps || 0), 
          weight: s.type === 'cardio' ? 0 : Number(s.weight || 0),
          distance: s.type === 'cardio' ? Number(s.distance || 0) : null,
          duration_seconds: s.type === 'cardio' ? Number(s.duration_seconds || 0) : null,
          type: s.type || 'strength'
        })),
      });

      if (response.data.isOfflineCached) {
        setStatus('success');
        setMsg(`Workout saved offline! It will automatically sync when internet connection restores.`);
        toast.success('Workout queued offline! Syncing in background.');
      } else {
        setStatus('success');
        setMsg(`Workout saved successfully! AI Insights are being generated.`);
        toast.success('Workout saved! Generating intelligent coaching feedback...');
      }

      setSets(defaultSets); 
      setExercise(''); 
      setNotes('');
      setIntensity(7);
      setIsFocusActive(false);
      fetchHistory();
      setTimeout(() => { setStatus(null); setMsg(''); }, 6000);
    } catch (err) {
      setStatus('error');
      setMsg(err.response?.data?.message || 'Failed to save workout. Please try again.');
      toast.error('Failed to log workout session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Real-time Tracking Header */}

      {msg && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
          status === 'success' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          <span className="text-sm font-bold">{msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start w-full">
          <div className="glass-card xl:col-span-2">
            <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-lg font-bold text-on-surface tracking-tight">Record Workout</h3>
                  <p className="text-xs text-on-surface-variant font-medium">Detailed set logging with instant PR detection</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  disabled={!exercise}
                  title={!exercise ? "Please choose an exercise first" : "Start Focus Mode"}
                  onClick={() => setIsFocusActive(true)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    !exercise 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' 
                      : 'bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Start Focus Mode
                </button>
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
                    {Object.entries(groupedExercises).map(([group, items]) => (
                      <optgroup key={group} label={group} className="bg-surface font-bold text-primary">
                        {items.map(ex => <option key={ex} value={ex} className="text-on-surface">{ex}</option>)}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:rotate-90 transition-transform pointer-events-none" />
                </div>
              </div>

              {/* Ghost performance alerts */}
              {ghostPlaceholder && (ghostPlaceholder.weight !== null) && (
                <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-on-surface-variant font-semibold">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    <span>Last performance placeholder:</span>
                  </div>
                  <span className="text-primary font-black uppercase">
                    {ghostPlaceholder.weight} kg x {ghostPlaceholder.reps} reps (Vol: {ghostPlaceholder.volume} kg)
                  </span>
                </div>
              )}

              {/* Progressive Overload advise alerts */}
              {advisingPayload && (
                <div className={`p-4 rounded-2xl border flex flex-col gap-1 ${
                  advisingPayload.achieved 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-405' 
                    : 'bg-zinc-900/50 border-zinc-800 text-on-surface-variant'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${advisingPayload.achieved ? 'bg-emerald-450 animate-pulse' : 'bg-zinc-500'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                      Progressive Overload Advisor
                    </span>
                  </div>
                  <span className="text-xs font-bold mt-1 text-zinc-100">
                    {advisingPayload.message}
                  </span>
                  {advisingPayload.achieved && (
                    <div className="text-[11px] font-medium mt-1 text-emerald-400">
                      Current Session Max: <span className="font-black text-white">{advisingPayload.current_max_weight} kg</span> → Target Overload Recommendation: <span className="font-black text-emerald-300">{advisingPayload.recommended_weight} kg</span>
                    </div>
                  )}
                </div>
              )}

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
                  {/* Header - Desktop Only */}
                  <div className="hidden md:grid grid-cols-[40px_90px_1fr_1fr_120px_60px] gap-3 px-4 text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">
                    <span className="text-center">Set</span>
                    <span>Type</span>
                    <span className="text-center">Reps / Dist</span>
                    <span className="text-center">Weight / Secs</span>
                    <span className="text-center">Volume / Pace</span>
                    <span className="text-center">Done / Del</span>
                  </div>

                  {/* Rows */}
                  {sets.map((s, idx) => {
                    const isCardio = s.type === 'cardio';
                    return (
                      <React.Fragment key={s.id}>
                        {/* Desktop Row View */}
                        <div 
                          className={`hidden md:grid grid-cols-[40px_90px_1fr_1fr_120px_60px] gap-3 items-center p-3 rounded-xl border border-outline-variant bg-surface-container transition-all hover:border-outline ${
                            idx === sets.length - 1 ? 'ring-1 ring-primary/20 bg-primary/5 border-primary/20' : ''
                          }`}
                        >
                          <div className="text-center text-xs font-black text-on-surface-variant">{idx + 1}</div>
                          
                          {/* Type Selector */}
                          <div>
                            <select
                              value={s.type || 'strength'}
                              onChange={e => updateSet(s.id, 'type', e.target.value)}
                              className="bg-surface-bright border border-outline-variant rounded-lg py-1.5 px-2 text-xs font-bold text-on-surface focus:outline-none w-full cursor-pointer"
                            >
                              <option value="strength">Strength</option>
                              <option value="cardio">Cardio</option>
                            </select>
                          </div>

                          {/* Reps or Distance */}
                          <div className="flex flex-col gap-1.5 w-full">
                            {isCardio ? (
                              <div className="flex items-center bg-surface-bright border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-colors">
                                <button type="button" onClick={() => updateSet(s.id, 'distance', Math.max(0, parseFloat(s.distance || 0) - 0.5).toFixed(1))} className="px-2.5 py-2 text-on-surface hover:bg-white/5 font-black">-</button>
                                <input 
                                  type="number" 
                                  placeholder="0.0"
                                  value={s.distance}
                                  step="0.1"
                                  onChange={e => updateSet(s.id, 'distance', e.target.value)}
                                  className="w-full bg-transparent py-2 text-center text-sm font-bold text-[#00E5FF] outline-none"
                                />
                                <button type="button" onClick={() => updateSet(s.id, 'distance', (parseFloat(s.distance || 0) + 0.5).toFixed(1))} className="px-2.5 py-2 text-on-surface hover:bg-white/5 font-black">+</button>
                              </div>
                            ) : (
                              <div className="flex items-center bg-surface-bright border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-colors">
                                <button type="button" onClick={() => updateSet(s.id, 'reps', Math.max(0, parseInt(s.reps || 10) - 1))} className="px-2.5 py-2 text-on-surface hover:bg-white/5 font-black">-</button>
                                <input 
                                  type="number" 
                                  placeholder={ghostPlaceholder?.reps ? `${ghostPlaceholder.reps}` : "10"}
                                  value={s.reps}
                                  onChange={e => updateSet(s.id, 'reps', e.target.value)}
                                  className="w-full bg-transparent py-2 text-center text-sm font-bold text-[#00E5FF] outline-none"
                                />
                                <button type="button" onClick={() => updateSet(s.id, 'reps', parseInt(s.reps || 10) + 1)} className="px-2.5 py-2 text-on-surface hover:bg-white/5 font-black">+</button>
                              </div>
                            )}
                          </div>

                          {/* Weight or Duration */}
                          <div className="flex flex-col gap-1.5 w-full relative">
                            {isCardio ? (
                              <div className="flex items-center bg-surface-bright border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-colors">
                                <button type="button" onClick={() => updateSet(s.id, 'duration_seconds', Math.max(0, parseInt(s.duration_seconds || 0) - 30))} className="px-2 py-2 text-on-surface hover:bg-white/5 font-black">-</button>
                                <input 
                                  type="number" 
                                  placeholder="Secs"
                                  value={s.duration_seconds}
                                  onChange={e => updateSet(s.id, 'duration_seconds', e.target.value)}
                                  className="w-full bg-transparent py-2 text-center text-sm font-bold text-[#7C3AED] outline-none"
                                />
                                <button type="button" onClick={() => updateSet(s.id, 'duration_seconds', parseInt(s.duration_seconds || 0) + 30)} className="px-2 py-2 text-on-surface hover:bg-white/5 font-black">+</button>
                              </div>
                            ) : (
                              <div className="flex items-center bg-surface-bright border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-colors relative">
                                <button type="button" onClick={() => updateSet(s.id, 'weight', Math.max(0, parseFloat(s.weight || 60) - 2.5))} className="px-2 py-2 text-on-surface hover:bg-white/5 font-black">-</button>
                                <input 
                                  type="number" 
                                  placeholder={ghostPlaceholder?.weight ? `${ghostPlaceholder.weight}` : "60"}
                                  value={s.weight}
                                  onChange={e => updateSet(s.id, 'weight', e.target.value)}
                                  className={`w-full bg-transparent py-2 pr-6 text-center text-sm font-bold outline-none ${
                                    s.weight > 100 ? 'text-tertiary' : 'text-[#00E5FF]'
                                  }`}
                                />
                                <button type="button" onClick={() => updateSet(s.id, 'weight', parseFloat(s.weight || 60) + 2.5)} className="px-2 py-2 text-on-surface hover:bg-white/5 font-black">+</button>
                                <button
                                  type="button"
                                  onClick={() => setActiveCalculatorWeight(s.weight || 20)}
                                  className="absolute right-7 text-on-surface-variant hover:text-primary transition-colors p-1"
                                  title="Plate Calculator"
                                >
                                  <Calculator className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Volume or Pace */}
                          <div className="text-center text-xs font-black text-on-surface-variant">
                            {isCardio ? (
                              s.distance && s.duration_seconds ? (
                                `${((s.duration_seconds / 60) / s.distance).toFixed(2)} min/km`
                              ) : (
                                '0.00 min/km'
                              )
                            ) : (
                              `${((s.reps || 0) * (s.weight || 0)).toLocaleString()} kg`
                            )}
                          </div>

                          <div className="flex items-center justify-center gap-2">
                            <button 
                              type="button"
                              onClick={() => setRestTimer(90)}
                              title="Set Done (Start 90s Rest)"
                              className="flex items-center justify-center text-on-surface-variant hover:text-secondary transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => delSet(s.id)}
                              title="Delete Set"
                              className="flex items-center justify-center text-on-surface-variant hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Mobile Card View */}
                        <div 
                          className={`md:hidden flex flex-col gap-4 p-4 rounded-2xl border border-outline-variant bg-surface-container transition-all hover:border-outline ${
                            idx === sets.length - 1 ? 'ring-2 ring-primary/30 bg-primary/5 border-primary/20' : ''
                          }`}
                        >
                          {/* Top Bar: Set Number + Type Selector */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-surface-bright border border-outline-variant text-[11px] font-black text-on-surface-variant">
                                {idx + 1}
                              </span>
                              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Set</span>
                            </div>
                            
                            <div className="w-32 shrink-0">
                              <select
                                value={s.type || 'strength'}
                                onChange={e => updateSet(s.id, 'type', e.target.value)}
                                className="bg-surface-bright border border-outline-variant rounded-lg py-1.5 px-2 text-xs font-bold text-on-surface focus:outline-none w-full cursor-pointer"
                              >
                                <option value="strength">Strength</option>
                                <option value="cardio">Cardio</option>
                              </select>
                            </div>
                          </div>

                          {/* Middle Row: Inputs */}
                          <div className="grid grid-cols-2 gap-3">
                            {/* Input 1: Reps / Distance */}
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider pl-1">
                                {isCardio ? 'Distance' : 'Reps'}
                              </span>
                              {isCardio ? (
                                <div className="flex items-center bg-surface-bright border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-colors">
                                  <button type="button" onClick={() => updateSet(s.id, 'distance', Math.max(0, parseFloat(s.distance || 0) - 0.5).toFixed(1))} className="px-2 py-1.5 text-on-surface hover:bg-white/5 font-black text-xs">-</button>
                                  <input 
                                    type="number" 
                                    placeholder="0.0"
                                    value={s.distance}
                                    step="0.1"
                                    onChange={e => updateSet(s.id, 'distance', e.target.value)}
                                    className="w-full bg-transparent py-1.5 text-center text-xs font-bold text-[#00E5FF] outline-none"
                                  />
                                  <button type="button" onClick={() => updateSet(s.id, 'distance', (parseFloat(s.distance || 0) + 0.5).toFixed(1))} className="px-2 py-1.5 text-on-surface hover:bg-white/5 font-black text-xs">+</button>
                                </div>
                              ) : (
                                <div className="flex items-center bg-surface-bright border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-colors">
                                  <button type="button" onClick={() => updateSet(s.id, 'reps', Math.max(0, parseInt(s.reps || 10) - 1))} className="px-2 py-1.5 text-on-surface hover:bg-white/5 font-black text-xs">-</button>
                                  <input 
                                    type="number" 
                                    placeholder={ghostPlaceholder?.reps ? `${ghostPlaceholder.reps}` : "10"}
                                    value={s.reps}
                                    onChange={e => updateSet(s.id, 'reps', e.target.value)}
                                    className="w-full bg-transparent py-1.5 text-center text-xs font-bold text-[#00E5FF] outline-none"
                                  />
                                  <button type="button" onClick={() => updateSet(s.id, 'reps', parseInt(s.reps || 10) + 1)} className="px-2 py-1.5 text-on-surface hover:bg-white/5 font-black text-xs">+</button>
                                </div>
                              )}
                            </div>

                            {/* Input 2: Weight / Duration */}
                            <div className="flex flex-col gap-1 relative">
                              <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider pl-1">
                                {isCardio ? 'Seconds' : 'Weight (kg)'}
                              </span>
                              {isCardio ? (
                                <div className="flex items-center bg-surface-bright border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-colors">
                                  <button type="button" onClick={() => updateSet(s.id, 'duration_seconds', Math.max(0, parseInt(s.duration_seconds || 0) - 30))} className="px-2 py-1.5 text-on-surface hover:bg-white/5 font-black text-xs">-</button>
                                  <input 
                                    type="number" 
                                    placeholder="Secs"
                                    value={s.duration_seconds}
                                    onChange={e => updateSet(s.id, 'duration_seconds', e.target.value)}
                                    className="w-full bg-transparent py-1.5 text-center text-xs font-bold text-[#7C3AED] outline-none"
                                  />
                                  <button type="button" onClick={() => updateSet(s.id, 'duration_seconds', parseInt(s.duration_seconds || 0) + 30)} className="px-2 py-1.5 text-on-surface hover:bg-white/5 font-black text-xs">+</button>
                                </div>
                              ) : (
                                <div className="flex items-center bg-surface-bright border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-colors relative">
                                  <button type="button" onClick={() => updateSet(s.id, 'weight', Math.max(0, parseFloat(s.weight || 60) - 2.5))} className="px-2 py-1.5 text-on-surface hover:bg-white/5 font-black text-xs">-</button>
                                  <input 
                                    type="number" 
                                    placeholder={ghostPlaceholder?.weight ? `${ghostPlaceholder.weight}` : "60"}
                                    value={s.weight}
                                    onChange={e => updateSet(s.id, 'weight', e.target.value)}
                                    className={`w-full bg-transparent py-1.5 pr-6 text-center text-xs font-bold outline-none ${
                                      s.weight > 100 ? 'text-tertiary' : 'text-[#00E5FF]'
                                    }`}
                                  />
                                  <button type="button" onClick={() => updateSet(s.id, 'weight', parseFloat(s.weight || 60) + 2.5)} className="px-2 py-1.5 text-on-surface hover:bg-white/5 font-black text-xs">+</button>
                                  <button
                                    type="button"
                                    onClick={() => setActiveCalculatorWeight(s.weight || 20)}
                                    className="absolute right-7 text-on-surface-variant hover:text-primary transition-colors p-1"
                                    title="Plate Calculator"
                                  >
                                    <Calculator className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Bottom Row: Volume/Pace + Actions */}
                          <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8px] font-black text-white/35 uppercase tracking-widest">Volume / Pace</span>
                              <span className="text-xs font-black text-primary">
                                {isCardio ? (
                                  s.distance && s.duration_seconds ? (
                                    `${((s.duration_seconds / 60) / s.distance).toFixed(2)} min/km`
                                  ) : (
                                    '0.00 min/km'
                                  )
                                ) : (
                                  `${((s.reps || 0) * (s.weight || 0)).toLocaleString()} kg`
                                )}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <button 
                                type="button"
                                onClick={() => setRestTimer(90)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-secondary/15 border border-secondary/20 text-[9px] font-black text-secondary uppercase tracking-wider hover:bg-secondary/20 transition-all"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Rest
                              </button>
                              <button 
                                type="button"
                                onClick={() => delSet(s.id)}
                                className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Intensity & Notes */}
              <div className="space-y-6">
                {/* Intensity Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Session Intensity: {intensity}/10</label>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${intensity <= 4 ? 'bg-emerald-500/20 text-emerald-400' : intensity <= 7 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {intensity <= 4 ? 'Light' : intensity <= 7 ? 'Moderate' : 'Brutal'}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="10" 
                    value={intensity} 
                    onChange={e => setIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-surface-bright rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: intensity <= 4 ? '#34d399' : intensity <= 7 ? '#facc15' : '#f87171' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Session Notes</label>
                  <textarea 
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="How did it feel? (e.g. Explosive reps, felt heavy today...)"
                    className="w-full bg-surface-container border border-outline-variant rounded-xl p-4 text-sm text-on-surface font-medium focus:outline-none focus:border-primary transition-all min-h-[100px] resize-none"
                  />
                </div>
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

          {/* Recent Workouts History */}
          <div className="glass-card xl:col-span-1 flex flex-col max-h-[800px]">
            <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-gradient-to-r from-[#00E5FF]/5 to-transparent">
              <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-[#00E5FF]" />
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Recent Workouts History</h3>
                  <p className="text-xs text-v2-soft-gray font-medium">Search, filter, edit, or delete logged workout sessions</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Controls: Filter then Search */}
              <div className="flex flex-col gap-4">
                <div className="flex gap-2 bg-surface-bright p-1 rounded-xl border border-outline-variant w-full sm:w-fit">
                  {['All', 'Strength', 'Cardio'].map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setHistoryFilter(f)}
                      className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        historyFilter === f ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search by exercise name..."
                    value={historySearch}
                    onChange={e => setHistorySearch(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary text-white"
                  />
                </div>
              </div>

              {/* Stacked List */}
              <div className="flex flex-col gap-3">
                {historyList
                  .filter(w => (w.name || '').toLowerCase().includes((historySearch || '').toLowerCase()))
                  .filter(w => historyFilter === 'All' || (historyFilter === 'Strength' && (w.type || '').toLowerCase().includes('strength')) || (historyFilter === 'Cardio' && (w.type || '').toLowerCase().includes('cardio')))
                  .map(w => (
                    <div key={w.id} className="p-4 rounded-2xl bg-white/5 border border-outline-variant/30 hover:bg-white/10 transition-colors flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white text-sm">{w.name}</h4>
                          <span className="text-[10px] uppercase font-black tracking-widest text-v2-soft-gray bg-surface-bright px-2 py-0.5 rounded-md mt-1 inline-block">{w.type}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-secondary">{w.calories_burned} kcal</span>
                          <div className="text-[10px] text-on-surface-variant font-medium mt-0.5">{new Date(w.started_at || w.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-white">
                          <span className="text-v2-soft-gray font-normal mr-1">Duration:</span> {w.duration} mins
                        </div>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => handleEditWorkout(w)} className="text-[10px] uppercase tracking-widest text-[#00E5FF] hover:underline font-black">Edit</button>
                          <button type="button" onClick={() => handleDeleteWorkout(w.id)} className="text-[10px] uppercase tracking-widest text-red-400 hover:underline font-black">Delete</button>
                        </div>
                      </div>
                      
                      {w.notes && (
                        <div className="text-[10px] text-v2-soft-gray font-normal border-t border-outline-variant/30 pt-2 mt-1">
                          {w.notes}
                        </div>
                      )}
                    </div>
                  ))}
                  
                {historyList.length === 0 && (
                  <div className="py-8 text-center italic text-on-surface-variant text-xs">
                    No recent workouts found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Render Plate Calculator Modal if active */}
      {activeCalculatorWeight !== null && (
        <PlateCalculatorModal 
          weight={activeCalculatorWeight} 
          onClose={() => setActiveCalculatorWeight(null)} 
        />
      )}

      {/* Dynamic Rest Timer Widget */}
      {restTimer !== null && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="glass-card px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl border-secondary/30 bg-zinc-950/80 backdrop-blur-md">
            <div className={`w-2 h-2 rounded-full ${restTimer > 0 ? 'bg-secondary animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm font-black text-white tracking-widest uppercase">
              {restTimer > 0 ? 'Rest Timer' : 'Time Up!'}
            </span>
            <span className={`text-xl font-bold font-mono ${restTimer > 0 ? 'text-secondary' : 'text-red-400'}`}>
              {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
            </span>
            <button 
              onClick={() => setRestTimer(null)}
              className="ml-2 text-on-surface-variant hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Edit Workout Modal Overlay */}
      {editWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F172A] border border-[#7C3AED]/30 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-4">Edit Workout Details</h3>
            <form onSubmit={handleUpdateWorkout} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-on-surface-variant">Exercise Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-on-surface-variant">Duration (Mins)</label>
                <input
                  type="number"
                  required
                  value={editForm.duration}
                  onChange={e => setEditForm({ ...editForm, duration: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-on-surface-variant">Calories Burned (kcal)</label>
                <input
                  type="number"
                  required
                  value={editForm.calories_burned}
                  onChange={e => setEditForm({ ...editForm, calories_burned: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-on-surface-variant">Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl p-4 text-xs text-white focus:outline-none focus:border-primary min-h-[80px]"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditWorkout(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant text-[10px] font-black uppercase text-on-surface-variant hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Focus Mode HUD Overlay */}
      {isFocusActive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto w-full h-full">
            <FocusModeHUD
              exerciseName={exercise}
              sets={sets}
              onUpdateSet={updateSet}
              onAddSet={addSet}
              onDeleteSet={delSet}
              onSubmit={handleSubmit}
              onClose={() => setIsFocusActive(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
