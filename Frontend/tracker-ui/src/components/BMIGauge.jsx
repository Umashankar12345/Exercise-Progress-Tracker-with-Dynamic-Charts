import React from 'react';

export const BMIGauge = ({ bmi }) => {
    const getBMICategory = (val) => {
        if (!val) return { label: 'No Data', color: 'text-gray-400', bg: 'bg-gray-100', position: 0 };
        if (val < 18.5) return { label: 'Underweight', color: 'text-blue-500', bg: 'bg-blue-100', position: 10 };
        if (val < 25) return { label: 'Normal', color: 'text-green-500', bg: 'bg-green-100', position: 40 };
        if (val < 30) return { label: 'Overweight', color: 'text-yellow-500', bg: 'bg-yellow-100', position: 70 };
        return { label: 'Obese', color: 'text-red-500', bg: 'bg-red-100', position: 90 };
    };

    const category = getBMICategory(bmi);

    return (
        <div className="bmi-gauge p-6 glass-card flex flex-col items-center gap-6">
            <h3 className="font-black text-sm uppercase tracking-widest text-on-surface-variant">BMI Analysis</h3>
            
            <div className="relative w-full h-24 flex flex-col justify-end">
                {/* Gauge Background */}
                <div className="w-full h-4 bg-gray-200 rounded-full flex overflow-hidden">
                    <div className="h-full w-[25%] bg-blue-400 opacity-50" />
                    <div className="h-full w-[25%] bg-green-400 opacity-50" />
                    <div className="h-full w-[25%] bg-yellow-400 opacity-50" />
                    <div className="h-full w-[25%] bg-red-400 opacity-50" />
                </div>

                {/* Needle / Indicator */}
                {bmi && (
                    <div 
                        className="absolute bottom-4 flex flex-col items-center transition-all duration-1000 ease-out"
                        style={{ left: `${category.position}%`, transform: 'translateX(-50%)' }}
                    >
                        <span className="text-xl font-black text-on-surface">{bmi}</span>
                        <div className="w-1 h-6 bg-primary rounded-full shadow-lg" />
                    </div>
                )}

                {/* Scale Labels */}
                <div className="flex justify-between mt-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                    <span>18.5</span>
                    <span>25.0</span>
                    <span>30.0</span>
                </div>
            </div>

            <div className={`px-4 py-2 rounded-xl border ${category.bg} ${category.color.replace('text', 'border')} flex items-center gap-2`}>
                <div className={`w-2 h-2 rounded-full ${category.color.replace('text', 'bg')} animate-pulse`} />
                <span className={`text-xs font-black uppercase tracking-widest ${category.color}`}>
                    {category.label}
                </span>
            </div>

            <p className="text-[10px] text-center text-on-surface-variant font-medium leading-relaxed max-w-[200px]">
                Body Mass Index (BMI) is a measure of body fat based on height and weight.
            </p>
        </div>
    );
};
