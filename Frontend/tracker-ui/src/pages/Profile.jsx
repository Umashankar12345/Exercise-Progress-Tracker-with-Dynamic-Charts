import React from 'react';
import { User, Edit2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useStore from '../store/useStore';
import api from '../api/axios';

const Profile = () => {
  const user = useStore((state) => state.user);
  
  // Example of a React Query for fetching historical PR data
  // In a real app, this would hit: api.get('/user/pr-history')
  const { data: prHistory, isLoading, isError } = useQuery({
    queryKey: ['prHistory', user.id],
    queryFn: async () => {
      // Mock API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              { date: '2026-04-01', exercise: 'Bench Press', weight: 215 },
              { date: '2026-05-01', exercise: 'Bench Press', weight: 225 },
            ]
          });
        }, 1000);
      });
    }
  });

  return (
    <div>
      <div className="page-header flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-accent-primary flex items-center justify-center shadow-glow">
          <User size={32} color="white" />
        </div>
        <div>
          <h1 className="page-title mb-0">{user.name}</h1>
          <p className="page-subtitle">Manage your goals and personal records.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-panel relative">
          <button className="absolute top-4 right-4 text-text-muted hover:text-accent-secondary transition-colors">
            <Edit2 size={18} />
          </button>
          <h3 className="mb-4">Current Goals</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-secondary">Target Bodyweight</span>
            <span className="font-bold text-accent-secondary">{user.targetWeight} lbs</span>
          </div>
          <div className="w-full bg-bg-tertiary rounded-full h-2 mb-4">
            <div className="bg-accent-gradient h-2 rounded-full" style={{ width: '70%' }}></div>
          </div>
          
          <div className="flex justify-between items-center mb-2 mt-4">
            <span className="text-text-secondary">Goal Date</span>
            <span className="font-bold text-text-primary">{new Date(user.goalDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="glass-panel">
          <div className="flex justify-between items-center mb-4">
            <h3>Personal Records</h3>
            {isLoading && <span className="text-xs text-accent-primary animate-pulse">Syncing...</span>}
          </div>
          
          <ul className="flex-col gap-2">
            {Object.entries(user.prTracking).map(([exercise, weight], index) => (
              <li key={index} className="flex justify-between border-b border-glass-border pb-3 mt-3 first:mt-0 last:border-0">
                <span className="capitalize text-text-secondary">
                  {exercise.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-bold text-text-primary text-lg">{weight} lbs</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
