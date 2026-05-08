import { useState } from 'react';

export const useWorkout = () => {
    const [workouts, setWorkouts] = useState([]);

    const fetchWorkouts = async () => {
        // API call to fetch workouts
    };

    const addWorkout = async (workoutData) => {
        // API call to add workout
    };

    return { workouts, fetchWorkouts, addWorkout };
};
