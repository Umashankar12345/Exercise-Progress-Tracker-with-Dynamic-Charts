export const StreakCalendar = ({ streakData }) => {
    // Mock days layout
    const days = Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        workedOut: Math.random() > 0.5 // random mock data
    }));

    return (
        <div className="streak-calendar p-4 border rounded shadow-sm bg-white">
            <h3 className="mb-4 font-bold text-lg">Streak Calendar</h3>
            <div className="grid grid-cols-7 gap-2">
                {days.map((d, index) => (
                    <div 
                        key={index} 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white ${d.workedOut ? 'bg-green-500' : 'bg-red-400'}`}
                        title={d.workedOut ? 'Workout' : 'Missed'}
                    >
                        {d.day}
                    </div>
                ))}
            </div>
        </div>
    );
};
