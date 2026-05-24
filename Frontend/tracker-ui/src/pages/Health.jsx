import React, { useState, useEffect } from 'react';
import { Scale, Heart, TrendingDown, TrendingUp, Info, Plus, Calendar, Zap, Bot, ArrowRight, Activity, Moon, ShieldAlert } from 'lucide-react';
import api from '../api/axios';
import { BMIGauge } from '../components/BMIGauge';
import { WeightTrendChart } from '../components/WeightTrendChart';
import WeightPredictionChart from '../components/dashboard/WeightPredictionChart';

export default function Health() {
    const [history, setHistory] = useState([]);
    const [latest, setLatest] = useState(null);
    const [plan, setPlan] = useState(null);
    const [weightLogs, setWeightLogs] = useState([]);
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
            const [hRes, pRes, wRes] = await Promise.all([
                api.get('/body-metrics'),
                api.get('/health-plan').catch(() => ({ data: null })),
                api.get('/weight-logs').catch(() => ({ data: [] }))
            ]);
            setHistory(hRes.data.history || []);
            setLatest(hRes.data.latest);
            setPlan(pRes.data);
            setWeightLogs(wRes.data || []);
            
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

    const handleQuickWeightLog = async (weightVal) => {
        try {
            await api.post('/weight-logs', { weight: weightVal });
            await fetchData();
        } catch (err) {
            alert('Error logging weight. Please try again.');
            throw err;
        }
    };

    // Dynamic client-side BMI calculations as user edits form fields
    const currentBmi = weight && height ? (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1) : latest?.bmi || '--';
    const bmrEstimate = weight && height && age ? (
        gender === 'Male' 
          ? (10 * parseFloat(weight)) + (6.25 * parseFloat(height)) - (5 * parseInt(age)) + 5
          : (10 * parseFloat(weight)) + (6.25 * parseFloat(height)) - (5 * parseInt(age)) - 161
    ) : null;
    const tdeeEstimate = bmrEstimate ? Math.round(bmrEstimate * 1.55) : latest?.tdee || '--';
    const bodyFatEstimate = currentBmi !== '--' && age ? (
        gender === 'Male'
          ? (1.20 * parseFloat(currentBmi)) + (0.23 * parseInt(age)) - 16.2
          : (1.20 * parseFloat(currentBmi)) + (0.23 * parseInt(age)) - 5.4
    ) : latest?.body_fat || '--';

    // Format prediction data mapping for AreaChart
    const getForecastPoints = () => {
        const points = [];
        const logs = weightLogs.length > 0 ? weightLogs : history;
        
        logs.slice(-4).forEach((wl, idx) => {
            points.push({
                name: `Wk ${idx + 1}`,
                weight: parseFloat(wl.weight),
                predicted: null
            });
        });

        if (plan) {
            const list = view === 'loss' ? plan.forecast_loss : plan.forecast_gain;
            // Bridge the last actual point to the predicted forecast line
            if (points.length > 0) {
                points[points.length - 1].predicted = points[points.length - 1].weight;
            }
            list.forEach((f) => {
                points.push({
                    name: f.week,
                    weight: null,
                    predicted: f.weight
                });
            });
        }
        return points;
    };

    const forecastPoints = getForecastPoints();

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Health & BMI Dashboard</h1>
                    <p className="text-gray-400 font-medium">Track your body metrics, prediction forecasts, and AI-optimized nutrition plans.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-xl">
                    <Heart className="w-5 h-5 text-[#00E5FF] animate-pulse" />
                    <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Health Sync Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* BMI Gauge & Quick Log */}
                <div className="xl:col-span-1 flex flex-col gap-8">
                    <BMIGauge bmi={parseFloat(currentBmi) || latest?.bmi} />
                    
                    {/* Log Daily Metrics */}
                    <div className="glass-card bg-[#0F172A]/80 border border-white/10 p-6 flex flex-col gap-6 rounded-3xl">
                        <h3 className="font-black text-sm uppercase tracking-widest text-white">Log Daily Metrics</h3>
                        
                        {/* Live Calculation preview HUD */}
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 grid grid-cols-3 gap-2 text-center text-xs font-bold">
                            <div>
                                <span className="text-gray-500 block uppercase text-[8px]">Live BMI</span>
                                <span className="text-sm font-black text-cyan-400">{currentBmi}</span>
                            </div>
                            <div className="border-l border-white/5">
                                <span className="text-gray-500 block uppercase text-[8px]">Live TDEE</span>
                                <span className="text-sm font-black text-yellow-400">{tdeeEstimate} kcal</span>
                            </div>
                            <div className="border-l border-white/5">
                                <span className="text-gray-500 block uppercase text-[8px]">Live Fat%</span>
                                <span className="text-sm font-black text-purple-400">
                                    {typeof bodyFatEstimate === 'number' ? bodyFatEstimate.toFixed(1) : bodyFatEstimate}%
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleLog} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Weight (kg)</label>
                                    <input 
                                        type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} required
                                        className="w-full bg-[#1e293b]/60 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] outline-none transition-all text-white"
                                        placeholder="75.0"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Height (cm)</label>
                                    <input 
                                        type="number" step="0.1" value={height} onChange={e => setHeight(e.target.value)} required
                                        className="w-full bg-[#1e293b]/60 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] outline-none transition-all text-white"
                                        placeholder="180"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Age</label>
                                    <input 
                                        type="number" value={age} onChange={e => setAge(e.target.value)} required
                                        className="w-full bg-[#1e293b]/60 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] outline-none transition-all text-white"
                                        placeholder="25"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Gender</label>
                                    <select 
                                        value={gender} onChange={e => setGender(e.target.value)} required
                                        className="w-full bg-[#1e293b]/60 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] outline-none transition-all text-white cursor-pointer"
                                    >
                                        <option value="Male" className="bg-[#0f172a]">Male</option>
                                        <option value="Female" className="bg-[#0f172a]">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="date" value={date} onChange={e => setDate(e.target.value)} required
                                        className="w-full bg-[#1e293b]/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] outline-none transition-all text-white"
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
                    {/* Weight Predictions & Trends */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <WeightTrendChart 
                            data={weightLogs.length > 0 
                                ? weightLogs.map(w => {
                                    const d = new Date(w.created_at || w.date);
                                    const month = String(d.getMonth() + 1).padStart(2, '0');
                                    const day = String(d.getDate()).padStart(2, '0');
                                    return { date: `${month}/${day}`, weight: parseFloat(w.weight) };
                                  })
                                : history.map(h => ({ date: h.date.slice(5), weight: parseFloat(h.weight) }))
                            } 
                            onLogWeight={handleQuickWeightLog}
                        />
                        <WeightPredictionChart forecastData={forecastPoints} />
                    </div>

                    {/* Weight Plans Section */}
                    <div className="glass-card bg-[#0F172A]/50 border border-white/10 rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-primary/5 to-transparent">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold text-white tracking-tight">Personalized Nutrition Strategies</h3>
                                <p className="text-xs text-cyan-400 font-medium uppercase tracking-widest mt-1">AI-Calculated targets based on TDEE</p>
                            </div>
                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                                <button 
                                    onClick={() => setView('loss')}
                                    className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${view === 'loss' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Loss Plan
                                </button>
                                <button 
                                    onClick={() => setView('gain')}
                                    className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${view === 'gain' ? 'bg-[#00E5FF] text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Gain Plan
                                </button>
                            </div>
                        </div>

                        <div className="p-8">
                            {plan ? (
                                <div className="space-y-8">
                                    {/* Cardiovascular / WHO Risk Analysis Banner */}
                                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-3">
                                        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">WHO Clinical Risk Analysis</span>
                                            <p className="text-xs font-bold text-white mt-1">{plan.health_risk}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            {/* Calorie recommendation */}
                                            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative group overflow-hidden">
                                                <div className={`absolute top-0 right-0 p-4 ${view === 'loss' ? 'text-primary' : 'text-cyan-400'} opacity-10 group-hover:scale-125 transition-transform`}>
                                                    {view === 'loss' ? <TrendingDown className="w-20 h-20" /> : <TrendingUp className="w-20 h-20" />}
                                                </div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Daily Intake</p>
                                                <h4 className="text-4xl font-black text-white">{plan[view].target_calories} <span className="text-sm font-bold text-gray-400">kcal</span></h4>
                                                <div className="flex items-center gap-2 mt-4 text-xs font-bold text-gray-400">
                                                    <Activity className="w-4 h-4 text-purple-400" />
                                                    Maintenance: {plan.tdee} kcal
                                                </div>
                                            </div>

                                            {/* US Navy Body Fat estimation comparison */}
                                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Adult BMI Fat %</p>
                                                    <span className="text-2xl font-black text-white">{plan.body_fat}%</span>
                                                </div>
                                                <div className="border-l border-white/5 pl-4">
                                                    <p className="text-[9px] font-black text-[#00E5FF] uppercase tracking-widest mb-1">Navy Method Fat %</p>
                                                    <span className="text-2xl font-black text-cyan-400">{plan.navy_body_fat}%</span>
                                                </div>
                                            </div>

                                            {/* Sleep Recovery Score */}
                                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Sleep Recovery Score</p>
                                                    <span className="text-2xl font-black text-purple-400">{plan.sleep_recovery_score}/100</span>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/30">
                                                    <Moon className="w-5 h-5 text-purple-400 animate-pulse" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Macronutrients Optimization */}
                                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Macro Nutrient Optimization</p>
                                                
                                                <div className="space-y-3">
                                                    <div>
                                                        <div className="flex justify-between text-xs font-bold mb-1">
                                                            <span className="text-gray-400">Protein</span>
                                                            <span>{plan[view].protein}g</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-purple-500" style={{ width: '80%' }} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between text-xs font-bold mb-1">
                                                            <span className="text-gray-400">Carbohydrates</span>
                                                            <span>{plan[view].carbs}g</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-cyan-400" style={{ width: '65%' }} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between text-xs font-bold mb-1">
                                                            <span className="text-gray-400">Fats</span>
                                                            <span>{plan[view].fats}g</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-yellow-400" style={{ width: '45%' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* AI Advice list */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest">
                                                    <Bot className="w-4 h-4 text-cyan-400" />
                                                    AI Coach Recommendation
                                                </div>
                                                <div className="space-y-2">
                                                    {plan[view].tips.map((tip, i) => (
                                                        <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3 group hover:border-[#00E5FF]/30 transition-all">
                                                            <div className="w-6 h-6 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center shrink-0">
                                                                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                                                            </div>
                                                            <p className="text-xs text-gray-300 font-semibold leading-relaxed">{tip}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center gap-4 text-center">
                                    <div className="p-4 rounded-full bg-[#0F172A] border border-white/5">
                                        <Info className="w-8 h-8 text-gray-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-white">No Health Data Found</h4>
                                        <p className="text-xs text-gray-400 max-w-[280px]">Log your height and weight in the side panel to unlock AI-powered health predictions.</p>
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
