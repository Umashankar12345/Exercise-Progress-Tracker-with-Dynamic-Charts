import React from 'react';

const LogWorkout = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Log Workout</h1>
        <p className="page-subtitle">Record your session and track progress.</p>
      </div>
      
      <div className="glass-panel max-w-2xl mx-auto">
        <form className="flex-col gap-4">
          <div>
            <label>Exercise</label>
            <select>
              <option>Bench Press</option>
              <option>Squat</option>
              <option>Deadlift</option>
            </select>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label>Sets</label>
              <input type="number" placeholder="3" />
            </div>
            <div>
              <label>Reps</label>
              <input type="number" placeholder="10" />
            </div>
            <div>
              <label>Weight (lbs)</label>
              <input type="number" placeholder="135" />
            </div>
          </div>
          
          <button type="button" className="btn btn-primary mt-6 w-full">
            Log Exercise
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogWorkout;
