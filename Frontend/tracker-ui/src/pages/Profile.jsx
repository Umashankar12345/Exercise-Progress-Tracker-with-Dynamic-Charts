import React from 'react';
import { User } from 'lucide-react';

const Profile = () => {
  return (
    <div>
      <div className="page-header flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-accent-primary flex items-center justify-center">
          <User size={32} />
        </div>
        <div>
          <h1 className="page-title mb-0">User Profile</h1>
          <p className="page-subtitle">Manage your goals and personal records.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-panel">
          <h3 className="mb-4">Current Goals</h3>
          <div className="flex justify-between items-center mb-2">
            <span>Target Bodyweight</span>
            <span className="font-bold text-accent-secondary">185 lbs</span>
          </div>
          <div className="w-full bg-bg-tertiary rounded-full h-2">
            <div className="bg-accent-gradient h-2 rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>
        
        <div className="glass-panel">
          <h3 className="mb-4">Personal Records</h3>
          <ul className="flex-col gap-2">
            <li className="flex justify-between border-b border-glass-border pb-2">
              <span>Bench Press</span>
              <span className="font-bold">225 lbs</span>
            </li>
            <li className="flex justify-between border-b border-glass-border pb-2 mt-2">
              <span>Squat</span>
              <span className="font-bold">315 lbs</span>
            </li>
            <li className="flex justify-between mt-2">
              <span>Deadlift</span>
              <span className="font-bold">405 lbs</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
