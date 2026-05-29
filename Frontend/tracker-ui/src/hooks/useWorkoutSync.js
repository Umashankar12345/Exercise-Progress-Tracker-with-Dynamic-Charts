import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useWorkoutSync = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workoutPayload) => {
      const response = await api.post('/workouts', workoutPayload);
      return response.data;
    },
    onSuccess: () => {
      // Broadcast state invalidation across all background panels instantly
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['progress-charts'] });
      queryClient.invalidateQueries({ queryKey: ['consistency-heatmap'] });

      console.log('FitTrack AI global system state re-validated.');
    },
    onError: (error) => {
      console.error('Data validation boundaries rejected structural sync packet.', error);
    }
  });
};
