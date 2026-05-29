export const ScheduleCard = ({ schedule }) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return (
        <div className="schedule-card p-4 border border-blue-200 rounded shadow-sm bg-blue-50">
            <h3 className="mb-4 font-bold text-lg text-blue-800">📅 AI Weekly Plan</h3>
            <div className="grid grid-cols-7 gap-2 text-center">
                {days.map((day, index) => {
                    const plan = schedule?.[day];
                    return (
                        <div key={index} className="flex flex-col border border-blue-100 rounded p-2 bg-white">
                            <span className="text-xs font-bold text-gray-500">{day}</span>
                            <span className="text-sm mt-2 text-blue-900 font-medium">
                                {plan?.muscleGroup || 'Rest'}
                            </span>
                            {plan?.intensity && (
                                <span className="text-xs mt-1 text-gray-400">
                                    {plan.intensity}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
