import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const WeightTrendChart = ({ data }) => {
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
            <div className="flex justify-between items-center">
                <h3 className="font-black text-sm uppercase tracking-widest text-on-surface">Weight Trend (30 Days)</h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">Body Mass (kg)</span>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
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
