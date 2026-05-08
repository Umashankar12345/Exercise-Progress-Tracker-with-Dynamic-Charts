export const PRList = ({ prs }) => {
    return (
        <div className="pr-list p-4 border rounded shadow-sm bg-white">
            <h3 className="mb-4 font-bold text-lg">Personal Records</h3>
            <ul className="space-y-2">
                {prs?.map((pr, index) => (
                    <li key={index} className="flex justify-between items-center border-b pb-2 text-sm">
                        <span className="font-medium">{pr.exercise}</span>
                        <div className="text-right">
                            <span className="font-bold text-blue-600">{pr.weight} kg</span>
                            <div className="text-xs text-gray-400">{pr.date}</div>
                        </div>
                    </li>
                ))}
                {!prs && <li className="text-gray-400 text-sm">No PRs recorded yet.</li>}
            </ul>
        </div>
    );
};
