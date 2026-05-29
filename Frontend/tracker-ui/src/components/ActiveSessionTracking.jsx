import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import useStore from '../store/useStore';
import { getEcho } from '../lib/echo';

export default function ActiveSessionTracking() {
  const { user } = useStore();
  const [activeEvents, setActiveEvents] = useState({
    'WorkoutSavedEvent': false,
    'PersonalRecordEvent': false,
    'GoalProgressEvent': false,
  });

  useEffect(() => {
    if (!user) return;

    const echoInstance = getEcho();
    if (!echoInstance) return;

    const handleEvent = (eventName) => {
      setActiveEvents(prev => ({ ...prev, [eventName]: true }));
      setTimeout(() => {
        setActiveEvents(prev => ({ ...prev, [eventName]: false }));
      }, 3000);
    };

    // Assuming the backend broadcasts on a private channel for the user
    const channel = echoInstance.private(`user.${user.id}`);

    // Listen for the specific events
    channel
      .listen('.WorkoutSavedEvent', () => handleEvent('WorkoutSavedEvent'))
      .listen('.PersonalRecordEvent', () => handleEvent('PersonalRecordEvent'))
      .listen('.GoalProgressEvent', () => handleEvent('GoalProgressEvent'));

    return () => {
      if (echoInstance && typeof echoInstance.disconnect === 'function') {
        echoInstance.disconnect();
      }
    };
  }, [user]);

  const badges = [
    { key: 'WorkoutSavedEvent', label: 'WORKOUT.SAVED', activeColor: 'bg-emerald-500 text-white border-emerald-400' },
    { key: 'PersonalRecordEvent', label: 'PR.ACHIEVED', activeColor: 'bg-amber-500 text-white border-amber-400' },
    { key: 'GoalProgressEvent', label: 'GOAL.PROGRESS', activeColor: 'bg-blue-500 text-white border-blue-400' }
  ];

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container border border-outline-variant">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
          <Activity className="w-5 h-5 text-secondary animate-pulse" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-widest">Active Session Tracking</h2>
          <p className="text-[10px] text-on-surface-variant font-medium">Real-time WebSocket event listeners active</p>
        </div>
      </div>
      <div className="flex gap-2">
        {badges.map(({ key, label, activeColor }) => (
          <div 
            key={key} 
            className={`px-2.5 py-1 border rounded-md text-[9px] font-black uppercase tracking-tighter transition-all duration-300 ${
              activeEvents[key] 
                ? `${activeColor} scale-110 shadow-[0_0_15px_rgba(0,0,0,0.5)] shadow-${activeColor.split(' ')[0].replace('bg-', '')}/50` 
                : 'bg-surface-bright border-outline-variant text-on-surface-variant'
            }`}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
