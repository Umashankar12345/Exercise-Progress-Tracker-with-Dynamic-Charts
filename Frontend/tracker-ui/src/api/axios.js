import axios from "axios";
import useStore from "../store/useStore";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Inject Auth Token so calls don't fail with 401 Unauthorized
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally by clearing stale/expired auth tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useStore.getState().logout();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Stub for Reverb WS / OAuth integrations
export const getBackendHost = () => {
  return "http://127.0.0.1:8000";
};

// Stub to prevent compilation crashes in hooks
export const registerWorkoutPersistedListener = () => {
  return () => {}; // return dummy unsubscribe function
};

export default api;
