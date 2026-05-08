export const AIInsightsCard = ({ insights }) => {
    return (
        <div className="ai-insights p-4 border border-purple-200 rounded shadow-sm bg-purple-50">
            <h3 className="mb-4 font-bold text-lg text-purple-800">🤖 AI Coach Panel</h3>
            <div className="space-y-2 text-sm text-purple-900">
                <p><strong>Tip:</strong> {insights?.tip || 'Increase volume slightly on chest day.'}</p>
                <p><strong>Warning:</strong> {insights?.warning || 'You have stalled on squats for 2 weeks.'}</p>
                <p><strong>Alert:</strong> {insights?.alert || 'Consider a deload week soon.'}</p>
            </div>
        </div>
    );
};
