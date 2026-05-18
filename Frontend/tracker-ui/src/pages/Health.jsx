import React, { useState, useEffect } from 'react';
import { Scale, Heart, TrendingDown, TrendingUp, Info, Plus, Calendar, Zap, Bot, ArrowRight, Activity } from 'lucide-react';
import api from '../api/axios';
import { BMIGauge } from '../components/BMIGauge';
import { WeightTrendChart } from '../components/WeightTrendChart';

export default function Health() {
    const [history, setHistory] = useState([]);
    const [latest, setLatest] = useState(null);
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('loss'); // 'loss' or 'gain'
    
    // Form state
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [hRes, pRes] = await Promise.all([
                api.get('/body-metrics'),
                api.get('/health-plan').catch(() => ({ data: null }))
            ]);
            setHistory(hRes.data.history || []);
            setLatest(hRes.data.latest);
            setPlan(pRes.data);
            
            if (hRes.data.latest) {
                setHeight(hRes.data.latest.height);
                setWeight(hRes.data.latest.weight);
                setAge(hRes.data.latest.age || '');
                setGender(hRes.data.latest.gender || 'Male');
            }
        } catch (err) {
            console.error('Error fetching health data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLog = async (e) => {
        e.preventDefault();
        try {
            await api.post('/body-metrics', { weight, height, age, gender, date });
            fetchData();
        } catch (err) {
            alert('Error logging metrics. Please check inputs.');
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-on-surface tracking-tighter uppercase">Health & BMI Dashboard</h1>
                    <p className="text-on-surface-variant font-medium">Track your body metrics and AI-optimized nutrition plans.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                    <Heart className="w-5 h-5 text-primary animate-pulse" />
                    <span className="text-xs font-black text-primary uppercase tracking-widest">Health Sync Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* BMI Gauge & Quick Log */}
                <div className="xl:col-span-1 flex flex-col gap-8">
                    <BMIGauge bmi={latest?.bmi} />
                    
                    <div className="glass-card p-6 flex flex-col gap-6">
                        <h3 className="font-black text-sm uppercase tracking-widest text-on-surface">Log Daily Metrics</h3>
                        <form onSubmit={handleLog} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-on-surface-variant uppercase ml-1">Weight (kg)</label>
                                    <input 
                                        type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} required
                                        className="w-full bg-surface-bright border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all animate-none text-on-surface"
                                        placeholder="75.0"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-on-surface-variant uppercase ml-1">Height (cm)</label>
                                    <input 
                                        type="number" step="0.1" value={height} onChange={e => setHeight(e.target.value)} required
                                        className="w-full bg-surface-bright border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all animate-none text-on-surface"
                                        placeholder="180"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-on-surface-variant uppercase ml-1">Age</label>
                                    <input 
                                        type="number" value={age} onChange={e => setAge(e.target.value)} required
                                        className="w-full bg-surface-bright border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all animate-none text-on-surface"
                                        placeholder="25"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-on-surface-variant uppercase ml-1">Gender</label>
                                    <select 
                                        value={gender} onChange={e => setGender(e.target.value)} required
                                        className="w-full bg-surface-bright border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-on-surface-variant uppercase ml-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                                    <input 
                                        type="date" value={date} onChange={e => setDate(e.target.value)} required
                                        className="w-full bg-surface-bright border border-outline-variant rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface"
                                    />
                                </div>
                            </div>
                            <button className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                Update Metrics
                            </button>
                        </form>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="xl:col-span-2 flex flex-col gap-8">
                    {/* Weight Trend Chart */}
                    <WeightTrendChart data={history.map(h => ({ date: h.date.slice(5), weight: parseFloat(h.weight) }))} />

                    {/* Weight Plans Section */}
                    <div className="glass-card overflow-hidden">
                        <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold text-on-surface tracking-tight">Personalized Nutrition Strategies</h3>
                                <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest mt-1">AI-Calculated targets based on TDEE</p>
                            </div>
                            <div className="flex bg-surface-bright p-1 rounded-xl border border-outline-variant">
                                <button 
                                    onClick={() => setView('loss')}
                                    className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${view === 'loss' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Loss Plan
                                </button>
                                <button 
                                    onClick={() => setView('gain')}
                                    className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${view === 'gain' ? 'bg-secondary text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}
                                >
                                    Gain Plan
                                </button>
                            </div>
                        </div>

                        <div className="p-8">
                            {plan ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-bright to-transparent border border-outline-variant relative group overflow-hidden">
                                            <div className={`absolute top-0 right-0 p-4 ${view === 'loss' ? 'text-primary' : 'text-secondary'} opacity-10 group-hover:scale-125 transition-transform`}>
                                                {view === 'loss' ? <TrendingDown className="w-20 h-20" /> : <TrendingUp className="w-20 h-20" />}
                                            </div>
                                            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Target Daily Intake</p>
                                            <h4 className="text-4xl font-black text-on-surface">{plan[view].target_calories} <span className="text-sm font-bold text-on-surface-variant">kcal</span></h4>
                                            <div className="flex items-center gap-2 mt-4 text-xs font-bold text-on-surface-variant">
                                                <Activity className="w-4 h-4 text-tertiary" />
                                                Maintenance: {plan.tdee} kcal
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-2xl bg-surface-bright border border-outline-variant">
                                            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Body Fat Estimate</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-3xl font-black text-on-surface">{plan.body_fat || '15.5'}%</span>
                                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Dynamic adult BMI formula</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-2xl bg-surface-bright border border-outline-variant">
                                            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4">Macro Breakdown</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-2xl font-black text-on-surface">{plan[view].protein}g</span>
                                                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Protein Goal</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[1,2,3,4,5].map(i => <div key={i} className={`w-2 h-6 rounded-full ${i <= 4 ? 'bg-secondary' : 'bg-secondary/20'}`} />)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-xs font-black text-on-surface uppercase tracking-widest">
                                            <Bot className="w-4 h-4 text-primary" />
                                            AI Diet Advice
                                        </div>
                                        <div className="space-y-3">
                                            {plan[view].tips.map((tip, i) => (
                                                <div key={i} className="p-4 rounded-xl bg-surface-bright border border-outline-variant flex gap-3 group hover:border-primary/30 transition-all">
                                                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                        <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
                                                    </div>
                                                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed">{tip}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full py-4 rounded-xl border border-dashed border-outline-variant text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center gap-2">
                                            <Plus className="w-3 h-3" />
                                            Generate Full Meal Plan
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center gap-4 text-center">
                                    <div className="p-4 rounded-full bg-surface-bright border border-outline-variant">
                                        <Info className="w-8 h-8 text-on-surface-variant" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-on-surface">No Health Data Found</h4>
                                        <p className="text-xs text-on-surface-variant max-w-[280px]">Log your height and weight in the side panel to unlock AI-powered diet plans.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
