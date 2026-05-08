export const GoalProgress = ({ goals }) => {
    return (
        <div className="goal-progress p-4 border rounded shadow-sm bg-white">
            <h3 className="mb-4 font-bold text-lg">Goals Tracker</h3>
            <div className="space-y-4">
                {goals?.map((goal, index) => {
                    const percentage = Math.min((goal.current / goal.target) * 100, 100);
                    return (
                        <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                                <span>{goal.name} ({goal.current}{goal.unit} / {goal.target}{goal.unit})</span>
                                <span>{Math.round(percentage)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    );
                })}
                {!goals && <p className="text-gray-400">No active goals set.</p>}
            </div>
        </div>
    );
};
