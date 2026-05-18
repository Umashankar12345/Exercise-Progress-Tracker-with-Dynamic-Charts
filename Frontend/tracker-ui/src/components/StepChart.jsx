import React from 'react';

export const StepChart = ({ data }) => {
    // If no data, show dummy data for visualization as requested by the user
    const chartData = data && data.length > 0 ? data : [
        { date: 'Mon', step_count: 8000 },
        { date: 'Tue', step_count: 9500 },
        { date: 'Wed', step_count: 7000 },
        { date: 'Thu', step_count: 12000 },
        { date: 'Fri', step_count: 10500 },
    ];

    const maxSteps = Math.max(...chartData.map(d => d.step_count), 12000);

    return (
        <div className="step-chart p-6 glass-card flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h3 className="font-black text-sm uppercase tracking-widest text-on-surface">Daily Step Activity</h3>
                <span className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Goal: 10k steps
                </span>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2 px-2">
                {chartData.map((item, index) => {
                    const height = (item.step_count / maxSteps) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center group">
                            <div className="relative w-full flex flex-col items-center">
                                {/* Tooltip on hover */}
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-high text-on-surface border border-outline-variant text-xs py-1 px-2 rounded mb-2 whitespace-nowrap z-10 font-medium">
                                    {item.step_count.toLocaleString()} steps
                                </div>
                                
                                {/* Bar */}
                                <div 
                                    className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out cursor-pointer
                                        ${item.step_count >= 10000 ? 'bg-gradient-to-t from-secondary to-[#34d399]' : 'bg-gradient-to-t from-primary to-[#60a5fa]'}
                                        hover:opacity-80 shadow-sm`}
                                    style={{ height: `${height}%`, minHeight: '10%' }}
                                ></div>
                            </div>
                            <span className="mt-3 text-[10px] font-bold text-outline uppercase tracking-wider">{item.date}</span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-2 grid grid-cols-2 gap-4">
                <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Avg. Steps</p>
                    <p className="text-xl font-black text-on-surface">
                        {Math.round(chartData.reduce((acc, curr) => acc + curr.step_count, 0) / chartData.length).toLocaleString()}
                    </p>
                </div>
                <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant">
                    <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">Total Calories</p>
                    <p className="text-xl font-black text-on-surface">
                        {Math.round(chartData.reduce((acc, curr) => acc + curr.step_count, 0) * 0.04).toLocaleString()} kcal
                    </p>
                </div>
            </div>
        </div>
    );
};
