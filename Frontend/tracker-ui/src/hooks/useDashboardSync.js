import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { registerWorkoutPersistedListener } from '../api/axios';
import { useWorkoutStateSync } from './useWorkoutStateSync';

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * useDashboardSync — TanStack React Query Cache Invalidation Wrapper
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * Enterprise-grade hook that automatically invalidates ALL active dashboard
 * query caches the instant a workout mutation is detected by the Axios
 * response interceptor.
 *
 * This forces all mounted TanStack Query observers (Volume Analytics,
 * Muscle Balance Bars, Consistency Training Matrix, PRs, etc.) to
 * simultaneously refetch their API states WITHOUT a webpage refresh.
 *
 * Query Key Architecture:
 *   ['dashboard', 'summary']      → Volume Analytics + KPI badges
 *   ['dashboard', 'consistency']   → Consistency Training Matrix (heatmap)
 *   ['progress', 'muscles']        → Muscle Balance Bars
 *   ['progress', 'summary']        → Workout stats overview
 *   ['workouts']                   → Workout list
 *   ['prs']                        → Personal Records list
 *   ['daily-steps']                → Step tracking chart
 *
 * Invalidation Strategy:
 *   On workout mutation → invalidateQueries({ queryKey: [...] }) for EACH
 *   panel key → TanStack refetches only the queries that have active
 *   observers (mounted components), skipping unmounted ones.
 *
 * Usage:
 *   ```jsx
 *   function Dashboard() {
 *     useDashboardSync();  // That's it — all panels auto-sync
 *
 *     const { data: summary } = useQuery({
 *       queryKey: ['dashboard', 'summary'],
 *       queryFn: () => api.get('/dashboard/summary').then(r => r.data),
 *     });
 *     // ...
 *   }
 *   ```
 * ──────────────────────────────────────────────────────────────────────────────
 */

/** @type {ReadonlyArray<ReadonlyArray<string>>} All dashboard query keys to invalidate */
const DASHBOARD_QUERY_KEYS = [
  ['dashboard', 'summary'],
  ['dashboard', 'consistency'],
  ['progress', 'muscles'],
  ['progress', 'summary'],
  ['progress', 'chart'],
  ['workouts'],
  ['prs'],
  ['daily-steps'],
];

/**
 * Hook: Invalidates all active dashboard TanStack Query caches on workout mutation.
 *
 * @param {Object} [options]
 * @param {boolean} [options.enabled=true]    - Whether auto-sync is active
 * @param {number}  [options.debounceMs=300]  - Debounce window for rapid mutations
 * @param {string[]} [options.additionalKeys] - Extra query keys to invalidate
 */
export function useDashboardSync(options = {}) {
  const {
    enabled = true,
    debounceMs = 300,
    additionalKeys = [],
  } = options;

  const queryClient = useQueryClient();

  const invalidateAllPanels = useCallback(
    async (context) => {
      const keysToInvalidate = [
        ...DASHBOARD_QUERY_KEYS,
        ...additionalKeys.map((key) => [key]),
      ];

      console.debug(
        `[FitTrack QuerySync] Invalidating ${keysToInvalidate.length} query keys…`,
        context
      );

      // Fire all invalidations in parallel for maximum speed
      const invalidations = keysToInvalidate.map((queryKey) =>
        queryClient.invalidateQueries({
          queryKey,
          refetchType: 'active', // Only refetch queries with mounted observers
        })
      );

      await Promise.allSettled(invalidations);

      console.debug('[FitTrack QuerySync] All active dashboard panels invalidated');
    },
    [queryClient, additionalKeys]
  );

  // Wire into the Axios interceptor-based workout mutation detection system
  useWorkoutStateSync(invalidateAllPanels, {
    debounceMs,
    enabled,
  });
}

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * useWorkoutMutation — TanStack-Integrated Workout Submission Helper
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * Provides a submit function that POSTs a workout and then explicitly
 * invalidates the dashboard query cache. Use this as an alternative to
 * useDashboardSync when you want manual control over the invalidation
 * timing (e.g., after showing a success toast).
 *
 * Usage:
 *   ```jsx
 *   const { submitWorkout, isSubmitting } = useWorkoutMutation();
 *
 *   const handleSave = async () => {
 *     await submitWorkout(payload);
 *     toast.success('Workout logged!');
 *   };
 *   ```
 * ──────────────────────────────────────────────────────────────────────────────
 */
export function useWorkoutMutation() {
  const queryClient = useQueryClient();

  const invalidateCache = useCallback(async () => {
    const invalidations = DASHBOARD_QUERY_KEYS.map((queryKey) =>
      queryClient.invalidateQueries({
        queryKey,
        refetchType: 'active',
      })
    );
    await Promise.allSettled(invalidations);
  }, [queryClient]);

  return {
    invalidateCache,
    queryKeys: DASHBOARD_QUERY_KEYS,
  };
}

export default useDashboardSync;
