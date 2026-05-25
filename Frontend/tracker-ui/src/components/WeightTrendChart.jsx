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

    const chartData = data && data.length > 0 ? data : [];

    return (
        <div className="weight-chart p-6 glass-card flex flex-col gap-6 w-full h-[300px] relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="font-black text-sm uppercase tracking-widest text-white">Weight Trend (30 Days)</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Body Mass (kg)</span>
                    </div>
                </div>
                {onLogWeight && (
                    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl p-1 w-full sm:w-auto z-10">
                        <div className="flex items-center gap-2 px-3 text-gray-400">
                            <Scale className="w-4.5 h-4.5" />
                            <input 
                                type="number" 
                                step="0.1" 
                                value={newWeight} 
                                onChange={e => setNewWeight(e.target.value)} 
                                placeholder="Log weight..." 
                                disabled={isSubmitting}
                                className="bg-transparent border-none outline-none text-xs font-bold text-white placeholder:text-gray-600 w-24"
                            />
                            <span className="text-[10px] font-bold uppercase tracking-widest">kg</span>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting || !newWeight}
                            className="bg-primary hover:bg-primary/90 disabled:bg-primary/20 text-white rounded-lg p-2 transition-all flex items-center justify-center shadow-lg shadow-primary/20"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </form>
                )}
            </div>

            <div className="h-full w-full absolute inset-0 pt-24 px-6 pb-6 pointer-events-none">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
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
                                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                labelStyle={{ color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}
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
                ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 border border-white/5 rounded-2xl bg-white/[0.02] pointer-events-auto">
                        <Scale className="w-8 h-8 opacity-20 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-80">Log weight to see trends</span>
                    </div>
                )}
            </div>
        </div>
    );
};
