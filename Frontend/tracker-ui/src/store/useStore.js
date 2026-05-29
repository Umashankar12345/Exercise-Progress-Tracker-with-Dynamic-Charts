import { create } from 'zustand';
import api from '../api/axios';

const useStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  token: localStorage.getItem('auth_token') || null,

  // Theme Mode state
  theme: localStorage.getItem('app_theme') || 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('app_theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    return { theme: newTheme };
  }),

  // Focus Mode state (from useAppStore spec)
  isFocusActive: false,
  setIsFocusActive: (isActive) => set({ isFocusActive: isActive }),

  // Offline queue tracking
  offlineQueueLength: 0,
  setOfflineQueueLength: (count) => set({ offlineQueueLength: count }),

  // Social Interactive State
  connectedUsers: [],
  joinedChallenges: [],
  importedWorkouts: [],
  activeSessionRoom: null,
  roomParticipants: {}, // roomId -> count

  // Global Data Cache (SWR Pattern)
  feed: [],
  arenaChallenges: [],
  arenaLeaderboard: [],
  exerciseLibrary: [],
  dashboardAnalytics: null,
  dashboardHeatmap: null,
  dashboardHeatmapWorkouts: null,

  fetchFeed: async () => {
    try {
      const { data } = await api.get('/posts');
      set({ feed: data });
    } catch (err) {
      console.error('Error fetching feed cache:', err);
    }
  },

  fetchArenaChallenges: async () => {
    try {
      const { data } = await api.get('/challenges');
      set({ arenaChallenges: data });
    } catch (err) {
      console.error('Error fetching challenges cache:', err);
    }
  },

  fetchArenaLeaderboard: async () => {
    try {
      const { data } = await api.get('/leaderboard');
      set({ arenaLeaderboard: data });
    } catch (err) {
      console.error('Error fetching leaderboard cache:', err);
    }
  },

  fetchDashboardAnalytics: async (silent = false) => {
    try {
      const { data } = await api.get('/dashboard/analytics');
      set({ dashboardAnalytics: data });
    } catch (err) {
      console.error('Error fetching dashboard analytics cache:', err);
    }
  },

  fetchHeatmapData: async () => {
    try {
      const [heatmapRes, workoutsRes] = await Promise.all([
        api.get('/workouts/heatmap'),
        api.get('/workouts')
      ]);
      set({ 
        dashboardHeatmap: heatmapRes.data || [], 
        dashboardHeatmapWorkouts: workoutsRes.data || [] 
      });
    } catch (err) {
      console.error('Error fetching heatmap cache:', err);
    }
  },

  logHealthMetric: async (dateStr, data) => {
    try {
      // Optimistic update
      set((state) => {
        if (state.dashboardAnalytics) {
          return {
            dashboardAnalytics: {
              ...state.dashboardAnalytics,
              ...data
            }
          };
        }
        return state;
      });

      await api.post('/health-metrics', {
        date: dateStr,
        ...data
      });
      
      // Refresh to ensure full sync
      get().fetchDashboardAnalytics(true);
    } catch (err) {
      console.error('Error logging health metric:', err);
      get().fetchDashboardAnalytics(true);
    }
  },

  fetchExerciseLibrary: async () => {
    try {
      const { data } = await api.get('/exercises');
      set({ exerciseLibrary: data });
    } catch (err) {
      console.error('Error fetching exercise library cache:', err);
    }
  },

  fetchSocialState: async () => {
    try {
      const [connRes, challRes] = await Promise.all([
        api.get('/connections'),
        api.get('/challenges/active')
      ]);
      set({
        connectedUsers: connRes.data,
        joinedChallenges: challRes.data
      });
    } catch (err) {
      console.error('Error fetching social state:', err);
    }
  },

  toggleConnect: async (targetId) => {
    try {
      const { data } = await api.post('/connections/connect', { connected_user_id: targetId });
      const connectedUsers = get().connectedUsers;
      if (data.status === 'connected') {
        set({ connectedUsers: [...connectedUsers, targetId] });
      } else {
        set({ connectedUsers: connectedUsers.filter(id => id !== targetId) });
      }
      return data;
    } catch (err) {
      console.error('Error toggling connect:', err);
      throw err;
    }
  },

  importWorkout: async (splitName) => {
    try {
      const { data } = await api.post('/workouts/import', { split_name: splitName });
      const importedWorkouts = get().importedWorkouts;
      set({ importedWorkouts: [...importedWorkouts, splitName] });
      return data;
    } catch (err) {
      console.error('Error importing workout:', err);
      throw err;
    }
  },

  joinChallenge: async (challengeId) => {
    try {
      const { data } = await api.post(`/challenges/${challengeId}/join`);
      const joinedChallenges = get().joinedChallenges;
      if (data.status === 'joined') {
        set({ joinedChallenges: [...joinedChallenges, challengeId] });
      } else {
        set({ joinedChallenges: joinedChallenges.filter(id => id !== challengeId) });
      }
      return data;
    } catch (err) {
      console.error('Error joining challenge:', err);
      throw err;
    }
  },

  joinSession: async (roomId) => {
    try {
      const { data } = await api.post('/live-sessions/join', { room_id: roomId });
      set({ activeSessionRoom: roomId });
      set((state) => ({
        roomParticipants: { ...state.roomParticipants, [roomId]: data.participant_count }
      }));
      return data;
    } catch (err) {
      console.error('Error joining session:', err);
      throw err;
    }
  },

  leaveSession: async (roomId) => {
    try {
      const { data } = await api.post('/live-sessions/leave', { room_id: roomId });
      set({ activeSessionRoom: null });
      set((state) => ({
        roomParticipants: { ...state.roomParticipants, [roomId]: data.participant_count }
      }));
      return data;
    } catch (err) {
      console.error('Error leaving session:', err);
      throw err;
    }
  },

  updateRoomParticipants: (roomId, count) => {
    set((state) => ({
      roomParticipants: { ...state.roomParticipants, [roomId]: count }
    }));
  },

  setAuth: (user, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null, isFocusActive: false, connectedUsers: [], joinedChallenges: [], importedWorkouts: [], activeSessionRoom: null });
  },
}));

export default useStore;
