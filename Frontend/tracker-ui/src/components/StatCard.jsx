export const StatCard = ({ title, value, subtitle }) => {
    return (
        <div className="stat-card p-4 border rounded shadow-sm bg-white">
            <h4 className="text-gray-500 text-sm">{title}</h4>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && <p className="text-xs text-green-500">{subtitle}</p>}
        </div>
    );
};
