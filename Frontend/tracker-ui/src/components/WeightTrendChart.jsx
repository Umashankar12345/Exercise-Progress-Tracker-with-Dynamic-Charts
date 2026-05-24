import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Scale } from 'lucide-react';

export const WeightTrendChart = ({ data, onLogWeight }) => {
    const [newWeight, setNewWeight] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newWeight || isNaN(newWeight) || parseFloat(newWeight) < 20 || parseFloat(newWeight) > 300) {
            alert('Please enter a valid weight between 20kg and 300kg');
            return;
        }
        setIsSubmitting(true);
        try {
            await onLogWeight(parseFloat(newWeight));
            setNewWeight('');
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fallback data if none provided
    const chartData = data && data.length > 0 ? data : [
        { date: '05/10', weight: 82.5 },
        { date: '05/12', weight: 82.1 },
        { date: '05/14', weight: 81.8 },
        { date: '05/15', weight: 81.5 },
        { date: '05/16', weight: 81.2 },
    ];

    return (
        <div className="weight-chart p-6 glass-card flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="font-black text-sm uppercase tracking-widest text-on-surface">Weight Trend (30 Days)</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase">Body Mass (kg)</span>
                    </div>
                </div>
                {onLogWeight && (
                    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-surface-bright border border-outline-variant rounded-xl p-1 w-full sm:w-auto">
                        <div className="flex items-center gap-2 px-3 text-on-surface-variant">
                            <Scale className="w-4.5 h-4.5" />
                            <input 
                                type="number" 
                                step="0.1" 
                                value={newWeight} 
                                onChange={e => setNewWeight(e.target.value)} 
                                placeholder="Log weight..." 
                                disabled={isSubmitting}
                                className="bg-transparent border-none outline-none text-xs font-bold text-on-surface placeholder:text-on-surface-variant/50 w-24"
                            />
                            <span className="text-[10px] font-bold uppercase tracking-widest">kg</span>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting || !newWeight}
                            className="bg-primary hover:bg-primary-hover disabled:bg-primary/20 text-white rounded-lg p-2 transition-all flex items-center justify-center"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </form>
                )}
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#8c909f', fontSize: 10, fontWeight: 500 }} 
                            dy={10}
                        />
                        <YAxis 
                            domain={['dataMin - 2', 'dataMax + 2']}
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#8c909f', fontSize: 10, fontWeight: 500 }} 
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '12px' }}
                            itemStyle={{ color: '#adc6ff' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#weightGradient)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
