import { useEffect, useRef, useCallback } from 'react';
import { registerWorkoutPersistedListener } from '../api/axios';

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * useWorkoutStateSync — Enterprise Real-Time State Synchronization Hook
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * Automatically invalidates and refetches all active dashboard panel states
 * the exact second a workout dataset is successfully persisted via a POST,
 * PUT, PATCH, or DELETE request to the backend.
 *
 * Architecture:
 *   Axios Response Interceptor
 *     → detects workout mutation (POST /workouts, PUT /sets/{id}, etc.)
 *     → fires registered listeners
 *     → this hook's callback executes
 *     → all dashboard panels (Volume Analytics, Muscle Balance, Consistency Matrix)
 *       simultaneously refetch their API states
 *     → NO page refresh required
 *
 * Features:
 *   - Debounced refetch (prevents redundant calls from rapid mutations)
 *   - Automatic cleanup on component unmount
 *   - Stable callback reference via useRef (no unnecessary re-subscriptions)
 *   - Error-isolated: listener failures don't crash the host component
 *
 * Usage:
 *   ```jsx
 *   const loadDashboard = useCallback(async () => {
 *     const [summary, muscles] = await Promise.all([
 *       api.get('/dashboard/summary'),
 *       api.get('/progress/muscles'),
 *     ]);
 *     setSummary(summary.data);
 *     setMuscles(muscles.data);
 *   }, []);
 *
 *   useWorkoutStateSync(loadDashboard);
 *   ```
 *
 * @param {Function} refetchCallback - Async function to invoke when a workout mutation is detected
 * @param {Object}   [options]       - Configuration options
 * @param {number}   [options.debounceMs=300] - Debounce window in milliseconds
 * @param {boolean}  [options.enabled=true]   - Whether sync is active
 * ──────────────────────────────────────────────────────────────────────────────
 */
export function useWorkoutStateSync(refetchCallback, options = {}) {
  const {
    debounceMs = 300,
    enabled = true,
  } = options;

  // Stable ref to the latest callback — prevents re-subscription on every render
  const callbackRef = useRef(refetchCallback);
  callbackRef.current = refetchCallback;

  // Debounce timer ref for cleanup
  const debounceTimerRef = useRef(null);

  // Track whether the component is still mounted
  const mountedRef = useRef(true);

  const debouncedRefetch = useCallback(
    (context) => {
      // Clear any pending debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        if (!mountedRef.current) return;

        try {
          console.debug('[FitTrack Sync] Triggering dashboard refetch…', context);
          await callbackRef.current?.(context);
          console.debug('[FitTrack Sync] Dashboard refetch complete');
        } catch (error) {
          console.error('[FitTrack Sync] Refetch callback error:', error);
        }
      }, debounceMs);
    },
    [debounceMs]
  );

  useEffect(() => {
    mountedRef.current = true;

    if (!enabled || typeof callbackRef.current !== 'function') {
      return;
    }

    // Register with the Axios interceptor listener system
    const unsubscribe = registerWorkoutPersistedListener(debouncedRefetch);

    console.debug('[FitTrack Sync] State sync listener registered');

    return () => {
      mountedRef.current = false;
      unsubscribe();

      // Clean up any pending debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      console.debug('[FitTrack Sync] State sync listener cleaned up');
    };
  }, [debouncedRefetch, enabled]);
}

export default useWorkoutStateSync;
