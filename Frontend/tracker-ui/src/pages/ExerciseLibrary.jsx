import React from 'react';

const ExerciseLibrary = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Exercise Library</h1>
        <p className="page-subtitle">Browse and learn new movements.</p>
      </div>
      
      <div className="flex gap-4 mb-6">
        <input type="text" placeholder="Search exercises..." className="max-w-md" />
        <button className="btn btn-secondary">Chest</button>
        <button className="btn btn-secondary">Back</button>
        <button className="btn btn-secondary">Legs</button>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Placeholder cards */}
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="glass-panel">
            <div className="bg-bg-tertiary h-32 rounded-lg mb-4"></div>
            <h3>Exercise {i}</h3>
            <p className="text-muted text-sm mt-1">Muscle group • Equipment</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseLibrary;
