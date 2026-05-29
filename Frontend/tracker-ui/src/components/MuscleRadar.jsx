export const MuscleRadar = ({ muscleData }) => {
    return (
        <div className="muscle-radar p-4 border rounded shadow-sm bg-white">
            <h3 className="mb-4 font-bold text-lg">Muscle Balance</h3>
            <div className="space-y-3">
                {muscleData?.map((muscle, index) => (
                    <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                            <span>{muscle.name}</span>
                            <span>{muscle.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${muscle.percentage}%` }}></div>
                        </div>
                    </div>
                ))}
                {!muscleData && <p className="text-gray-400">No muscle data available.</p>}
            </div>
        </div>
    );
};
