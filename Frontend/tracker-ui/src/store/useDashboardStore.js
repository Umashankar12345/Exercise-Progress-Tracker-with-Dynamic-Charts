import { create } from 'zustand';
import api from '../api/axios';

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * useDashboardStore — Zustand State Layer for Dashboard Panels
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * Centralized state store for all dashboard analytics data.
 * Provides typed state slices and async fetch actions for:
 *
 *   1. Volume Analytics    (tonnage timeseries from /dashboard/summary)
 *   2. Muscle Balance Bars (muscle distribution from /dashboard/summary)
 *   3. Consistency Matrix  (heatmap data from /dashboard/consistency)
 *   4. Personal Records    (PR list from /prs)
 *   5. Progress Summary    (stats overview from /progress/summary)
 *
 * Designed to work alongside TanStack React Query:
 *   - TanStack handles caching, stale detection, and background refetch
 *   - Zustand provides imperative state access for non-query components
 *   - Both are invalidated simultaneously via useWorkoutStateSync
 *
 * Usage:
 *   ```jsx
 *   const { summary, fetchAll, isLoading } = useDashboardStore();
 *
 *   useEffect(() => { fetchAll(); }, [fetchAll]);
 *   ```
 * ──────────────────────────────────────────────────────────────────────────────
 */

/** @typedef {'idle' | 'loading' | 'ready' | 'error'} FetchStatus */

const useDashboardStore = create((set, get) => ({
  // ─── State Slices ───────────────────────────────────────────────────

  /** @type {FetchStatus} */
  status: 'idle',

  /** @type {Object|null} Dashboard summary (tonnage series, muscle distribution, KPIs) */
  summary: null,

  /** @type {Array} Personal records list */
  prs: [],

  /** @type {Array} Muscle group distribution */
  muscles: [],

  /** @type {Array} Daily step data */
  steps: [],

  /** @type {Array} Workout history list */
  workouts: [],

  /** @type {Object|null} Consistency matrix data */
  consistencyMatrix: null,

  /** @type {string|null} Last successful fetch timestamp */
  lastFetchedAt: null,

  /** @type {string|null} Last error message */
  lastError: null,

  // ─── Computed Getters ─────────────────────────────────────────────

  /** Whether any data is currently loading */
  get isLoading() {
    return get().status === 'loading';
  },

  // ─── Actions ──────────────────────────────────────────────────────

  /**
   * Fetch all dashboard panel data simultaneously.
   * Uses Promise.allSettled so individual failures don't block other panels.
   */
  fetchAll: async () => {
    set({ status: 'loading', lastError: null });

    try {
      const results = await Promise.allSettled([
        api.get('/progress/summary'),
        api.get('/prs'),
        api.get('/progress/muscles'),
        api.get('/daily-steps'),
        api.get('/workouts'),
        api.get('/dashboard/summary'),
      ]);

      const [summaryRes, prsRes, musclesRes, stepsRes, workoutsRes, dashRes] = results;

      set({
        summary:     dashRes.status === 'fulfilled' ? dashRes.value.data : get().summary,
        prs:         prsRes.status === 'fulfilled' ? prsRes.value.data : get().prs,
        muscles:     musclesRes.status === 'fulfilled' ? musclesRes.value.data : get().muscles,
        steps:       stepsRes.status === 'fulfilled' ? stepsRes.value.data : get().steps,
        workouts:    workoutsRes.status === 'fulfilled' ? workoutsRes.value.data : get().workouts,
        status:      'ready',
        lastFetchedAt: new Date().toISOString(),
      });

      // Merge progress summary if available
      if (summaryRes.status === 'fulfilled') {
        set((state) => ({
          summary: {
            ...state.summary,
            ...summaryRes.value.data,
          },
        }));
      }

      console.debug('[FitTrack Store] All dashboard panels fetched', {
        fulfilled: results.filter((r) => r.status === 'fulfilled').length,
        rejected: results.filter((r) => r.status === 'rejected').length,
      });
    } catch (error) {
      set({
        status: 'error',
        lastError: error?.message || 'Failed to fetch dashboard data',
      });
      console.error('[FitTrack Store] fetchAll error:', error);
    }
  },

  /**
   * Fetch only the cached dashboard summary (tonnage + muscles).
   * Lightweight call for targeted panel refresh.
   */
  fetchSummary: async () => {
    try {
      const { data } = await api.get('/dashboard/summary');
      set({ summary: data, lastFetchedAt: new Date().toISOString() });
    } catch (error) {
      console.error('[FitTrack Store] fetchSummary error:', error);
    }
  },

  /**
   * Fetch consistency matrix data for the heatmap panel.
   */
  fetchConsistency: async () => {
    try {
      const { data } = await api.get('/dashboard/consistency');
      set({ consistencyMatrix: data, lastFetchedAt: new Date().toISOString() });
    } catch (error) {
      console.error('[FitTrack Store] fetchConsistency error:', error);
    }
  },

  /**
   * Reset all dashboard state to initial values.
   */
  reset: () =>
    set({
      status: 'idle',
      summary: null,
      prs: [],
      muscles: [],
      steps: [],
      workouts: [],
      consistencyMatrix: null,
      lastFetchedAt: null,
      lastError: null,
    }),
}));

export default useDashboardStore;
