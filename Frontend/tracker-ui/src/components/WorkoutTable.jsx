export const WorkoutTable = ({ session }) => {
    return (
        <div className="workout-table overflow-x-auto border rounded shadow-sm bg-white p-4">
            <h3 className="mb-4 font-bold text-lg">Last Session Log</h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sets</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reps</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PR Badge</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {/* Map through session.exercises here */}
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bench Press</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8, 8, 7</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100kg</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">🏆</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
