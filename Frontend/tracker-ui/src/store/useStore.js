import { create } from 'zustand';
import axios from 'axios';

const useStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  token: localStorage.getItem('auth_token') || null,

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

  fetchSocialState: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      }
    };
    try {
      const [connRes, challRes] = await Promise.all([
        axios.get('http://172.21.133.28:8000/api/connections', config),
        axios.get('http://172.21.133.28:8000/api/challenges/active', config)
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
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      }
    };
    try {
      const { data } = await axios.post('http://172.21.133.28:8000/api/connections/connect', { connected_user_id: targetId }, config);
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
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      }
    };
    try {
      const { data } = await axios.post('http://172.21.133.28:8000/api/workouts/import', { split_name: splitName }, config);
      const importedWorkouts = get().importedWorkouts;
      set({ importedWorkouts: [...importedWorkouts, splitName] });
      return data;
    } catch (err) {
      console.error('Error importing workout:', err);
      throw err;
    }
  },

  joinChallenge: async (challengeId) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      }
    };
    try {
      const { data } = await axios.post(`http://172.21.133.28:8000/api/challenges/${challengeId}/join`, {}, config);
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
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      }
    };
    try {
      const { data } = await axios.post('http://172.21.133.28:8000/api/live-sessions/join', { room_id: roomId }, config);
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
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      }
    };
    try {
      const { data } = await axios.post('http://172.21.133.28:8000/api/live-sessions/leave', { room_id: roomId }, config);
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
