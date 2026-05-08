export const WeeklySchedule = ({ schedule }) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return (
        <div className="weekly-schedule p-4 border rounded shadow-sm bg-white">
            <h3 className="mb-4 font-bold text-lg">Weekly Schedule</h3>
            <div className="grid grid-cols-7 gap-2 text-center">
                {days.map((day, index) => (
                    <div key={index} className="flex flex-col border rounded p-2">
                        <span className="text-xs font-bold text-gray-500">{day}</span>
                        <span className="text-sm mt-2">{schedule?.[day] || 'Rest'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
