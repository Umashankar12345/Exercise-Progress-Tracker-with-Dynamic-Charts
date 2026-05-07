import React from 'react';
import { Brain, AlertCircle, Lightbulb } from 'lucide-react';

const AIInsights = () => {
  return (
    <div>
      <div className="page-header flex items-center gap-4">
        <Brain size={40} className="text-accent-primary" />
        <div>
          <h1 className="page-title mb-0">AI Insights</h1>
          <p className="page-subtitle">Smart analysis of your training data.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-panel border-l-4 border-l-accent-primary">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="text-warning" />
            <h3>Smart Suggestion</h3>
          </div>
          <p className="text-text-secondary">
            Your chest volume is down 15% this week. Consider adding an extra set of Incline Dumbbell Press on your next push day to maintain progress.
          </p>
        </div>
        
        <div className="glass-panel border-l-4 border-l-danger">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-danger" />
            <h3>Anomaly Detected</h3>
          </div>
          <p className="text-text-secondary">
            Your rest periods have decreased while lifting near maximal loads. This increases injury risk. Ensure 2-3 minutes of rest for strength sets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
