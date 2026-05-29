import React from 'react';

export const StepChart = ({ data }) => {
    // Ensure we handle both potential array structures or empty states safely
    const chartData = data && data.length > 0 ? data : [];
    
    // Get today's steps (assuming last item in array is today, or 0 if empty)
    const currentSteps = chartData.length > 0 ? chartData[chartData.length - 1].step_count : 0;
    const stepGoal = 10000;
    
    // Calculate percentage capped at 100%
    const percentage = Math.min((currentSteps / stepGoal) * 100, 100);
    
    // SVG Circle Radius math: 2 * pi * r (r=40 -> circumference ≈ 251.2)
    const circumference = 251.2;
    const strokeOffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="step-chart p-6 glass-card flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h3 className="font-black text-sm uppercase tracking-widest text-on-surface">Daily Step Activity</h3>
                <span className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Goal: 10k steps
                </span>
            </div>
            
            {chartData.length === 0 || currentSteps === 0 ? (
                // EMPTY STATE UI
                <div className="flex flex-col items-center justify-center h-64 p-6 text-center animate-fade-in-up">
                    <div className="p-4 mb-4 rounded-full bg-surface-container-high text-secondary backdrop-blur-sm">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-base font-semibold text-on-surface">No Steps Recorded</h3>
                    <p className="max-w-xs mt-1 text-xs text-on-surface-variant">
                        Sync your device or log your daily activity to track your progress towards 10,000 steps.
                    </p>
                </div>
            ) : (
                // CIRCULAR PROGRESS UI
                <div className="relative flex flex-col items-center justify-center h-64">
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke="#2a2a2a" strokeWidth="8" fill="transparent"/>
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                stroke="#10b981" 
                                strokeWidth="8" 
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeOffset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out" 
                            />
                        </svg>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in-up">
                            <span className="text-4xl font-black text-on-surface tracking-tight">
                                {currentSteps.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase mt-1">
                                / {stepGoal.toLocaleString()} steps
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
