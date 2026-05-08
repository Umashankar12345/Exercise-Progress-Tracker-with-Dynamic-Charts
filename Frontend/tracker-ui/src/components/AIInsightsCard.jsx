export const AIInsightsCard = ({ insights }) => {
    return (
        <div className="ai-insights p-4 border border-purple-200 rounded shadow-sm bg-purple-50 relative">
            <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md uppercase tracking-wide">
                AI Powered
            </div>
            <h3 className="mb-4 font-bold text-lg text-purple-800">🤖 AI Coach Panel</h3>
            <div className="space-y-2 text-sm text-purple-900 pr-24">
                <p><strong>Tip:</strong> {insights?.tip || 'Increase volume slightly on chest day.'}</p>
                <p><strong>Warning:</strong> {insights?.warning || 'You have stalled on squats for 2 weeks.'}</p>
                <p><strong>Recommendation:</strong> {insights?.recommendation || 'Consider a deload week soon.'}</p>
            </div>
        </div>
    );
};
