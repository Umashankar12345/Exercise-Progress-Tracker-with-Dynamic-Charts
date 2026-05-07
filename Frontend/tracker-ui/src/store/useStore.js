import { create } from 'zustand';

const useStore = create((set) => ({
  // User Profile State
  user: {
    id: 1,
    name: 'John Doe',
    targetWeight: 185,
    goalDate: '2026-12-31',
    prTracking: {
      benchPress: 225,
      squat: 315,
      deadlift: 405,
    }
  },
  
  // Actions for User Profile
  updateTargetWeight: (weight) => 
    set((state) => ({ user: { ...state.user, targetWeight: weight } })),
    
  updatePR: (exercise, weight) =>
    set((state) => ({
      user: {
        ...state.user,
        prTracking: {
          ...state.user.prTracking,
          [exercise]: weight,
        }
      }
    })),

  // Active Workout Session State
  activeWorkoutSession: null,
  
  // Actions for Workout Session
  startWorkout: (workoutName) => 
    set({ activeWorkoutSession: { name: workoutName, startTime: new Date().toISOString(), exercises: [] } }),
    
  endWorkout: () => 
    set({ activeWorkoutSession: null }),
    
  addExerciseToSession: (exerciseData) =>
    set((state) => {
      if (!state.activeWorkoutSession) return state;
      return {
        activeWorkoutSession: {
          ...state.activeWorkoutSession,
          exercises: [...state.activeWorkoutSession.exercises, exerciseData]
        }
      };
    })
}));

export default useStore;
