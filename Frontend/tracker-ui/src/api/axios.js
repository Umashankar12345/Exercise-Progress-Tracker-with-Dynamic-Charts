import axios from "axios";
import useStore from "../store/useStore";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8000/api`;
  }
  return "http://127.0.0.1:8000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// FitTrack SWR Promise Cache & Request Deduplicator
const getCache = new Map();

// Helper to clear the entire GET cache on mutations (POST, PUT, DELETE, PATCH)
export const clearApiCache = () => {
  if (getCache.size > 0) {
    console.debug(`[FitTrack Cache] Invalidate: Cleared ${getCache.size} cached endpoints due to state mutation.`);
    getCache.clear();
  }
};

const originalGet = api.get;
api.get = function (url, config = {}) {
  // Ignore caching for specific non-cacheable routes if any (e.g. CSRF cookies or dynamic session status if needed)
  if (url.includes('/csrf-cookie') || config?.headers?.['X-No-Cache']) {
    return originalGet.call(this, url, config);
  }

  // Build cache key based on URL and query params
  const cacheKey = `${url}?${JSON.stringify(config.params || {})}`;

  if (getCache.has(cacheKey)) {
    console.debug(`[FitTrack Cache] HIT (0ms): ${url}`);
    return getCache.get(cacheKey);
  }

  console.debug(`[FitTrack Cache] MISS (Fetching...): ${url}`);
  const promise = originalGet.call(this, url, config)
    .then((response) => {
      // Keep it in cache
      return response;
    })
    .catch((error) => {
      // Remove failed request from cache so future attempts can retry
      getCache.delete(cacheKey);
      throw error;
    });

  getCache.set(cacheKey, promise);
  return promise;
};

// Auto-invalidate cache on any mutating request to guarantee data consistency
const originalPost = api.post;
api.post = function (...args) {
  clearApiCache();
  return originalPost.apply(this, args);
};

const originalPut = api.put;
api.put = function (...args) {
  clearApiCache();
  return originalPut.apply(this, args);
};

const originalDelete = api.delete;
api.delete = function (...args) {
  clearApiCache();
  return originalDelete.apply(this, args);
};

const originalPatch = api.patch;
api.patch = function (...args) {
  clearApiCache();
  return originalPatch.apply(this, args);
};

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
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, "");
  }
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8000`;
  }
  return "http://127.0.0.1:8000";
};

// Stub to prevent compilation crashes in hooks
export const registerWorkoutPersistedListener = () => {
  return () => {}; // return dummy unsubscribe function
};

export default api;
