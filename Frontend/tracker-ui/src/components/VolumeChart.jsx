// Remember to run: npm install recharts
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const VolumeChart = ({ data }) => {
    return (
        <div className="volume-chart p-4 border rounded shadow-sm bg-white">
            <h3 className="mb-4 font-bold text-lg">Volume & 1RM Trend</h3>
            <div className="h-64 w-full bg-gray-50 flex items-center justify-center text-gray-400">
                {/* 
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="volume" stroke="#8884d8" />
                        <Line type="monotone" dataKey="estimated1RM" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
                */}
                [Recharts LineChart Placeholder]
            </div>
        </div>
    );
};
