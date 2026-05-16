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
        <div className="step-chart p-6 border rounded-2xl shadow-lg bg-white/80 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-gray-800">Daily Step Activity</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
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
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded mb-2 whitespace-nowrap z-10">
                                    {item.step_count.toLocaleString()} steps
                                </div>
                                
                                {/* Bar */}
                                <div 
                                    className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out cursor-pointer
                                        ${item.step_count >= 10000 ? 'bg-gradient-to-t from-green-500 to-green-400' : 'bg-gradient-to-t from-blue-500 to-blue-400'}
                                        hover:from-indigo-500 hover:to-indigo-400 shadow-sm`}
                                    style={{ height: `${height}%`, minHeight: '10%' }}
                                ></div>
                            </div>
                            <span className="mt-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{item.date}</span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-semibold uppercase">Avg. Steps</p>
                    <p className="text-xl font-bold text-blue-900">
                        {Math.round(chartData.reduce((acc, curr) => acc + curr.step_count, 0) / chartData.length).toLocaleString()}
                    </p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                    <p className="text-xs text-green-600 font-semibold uppercase">Total Calories</p>
                    <p className="text-xl font-bold text-green-900">
                        {Math.round(chartData.reduce((acc, curr) => acc + curr.step_count, 0) * 0.04).toLocaleString()} kcal
                    </p>
                </div>
            </div>
        </div>
    );
};
