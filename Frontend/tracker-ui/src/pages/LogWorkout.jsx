import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import useStore from '../store/useStore';

const LogWorkout = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [successMsg, setSuccessMsg] = useState('');
  
  const addExerciseToSession = useStore((state) => state.addExerciseToSession);

  // Mock mutation for submitting a workout log
  const mutation = useMutation({
    mutationFn: async (newLog) => {
      // In a real app, this would be an API call like: api.post('/workouts/log', newLog)
      // For now, simulate network delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: newLog, status: 201 });
        }, 800);
      });
    },
    onSuccess: (data) => {
      setSuccessMsg('Exercise logged successfully!');
      addExerciseToSession(data.data);
      reset(); // Clear the form
      setTimeout(() => setSuccessMsg(''), 3000);
    },
    onError: () => {
      // Handle error here
      console.error("Failed to log workout.");
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Log Workout</h1>
        <p className="page-subtitle">Record your session and track progress.</p>
      </div>
      
      {successMsg && (
        <div className="bg-success bg-opacity-20 text-success p-3 rounded-lg mb-6 border border-success">
          {successMsg}
        </div>
      )}
      
      <div className="glass-panel max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex-col gap-4">
          <div>
            <label>Exercise</label>
            <select {...register("exercise", { required: "Please select an exercise" })}>
              <option value="">Select an exercise...</option>
              <option value="Bench Press">Bench Press</option>
              <option value="Squat">Squat</option>
              <option value="Deadlift">Deadlift</option>
              <option value="Overhead Press">Overhead Press</option>
            </select>
            {errors.exercise && <span className="text-danger text-sm mt-1">{errors.exercise.message}</span>}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label>Sets</label>
              <input 
                type="number" 
                placeholder="3" 
                {...register("sets", { required: "Required", min: { value: 1, message: "Min 1" } })} 
              />
              {errors.sets && <span className="text-danger text-sm mt-1">{errors.sets.message}</span>}
            </div>
            <div>
              <label>Reps</label>
              <input 
                type="number" 
                placeholder="10" 
                {...register("reps", { required: "Required", min: { value: 1, message: "Min 1" } })} 
              />
              {errors.reps && <span className="text-danger text-sm mt-1">{errors.reps.message}</span>}
            </div>
            <div>
              <label>Weight (lbs)</label>
              <input 
                type="number" 
                placeholder="135" 
                {...register("weight", { required: "Required", min: { value: 0, message: "Min 0" } })} 
              />
              {errors.weight && <span className="text-danger text-sm mt-1">{errors.weight.message}</span>}
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary mt-6 w-full flex justify-center items-center gap-2"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Logging...' : 'Log Exercise'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogWorkout;
