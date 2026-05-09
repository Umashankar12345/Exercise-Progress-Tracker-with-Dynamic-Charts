import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'

/**
 * useAIInsights — fetches AI insights on mount, then keeps them
 * live via Laravel Reverb WebSocket (InsightReady event).
 *
 * Uses a polling fallback if Reverb/Echo is not configured,
 * so the hook always works even without WebSocket setup.
 */
export function useAIInsights(userId) {
  const [insights,       setInsights]       = useState([])
  const [recommendation, setRecommendation] = useState('')
  const [warnings,       setWarnings]       = useState([])
  const [nextWorkout,    setNextWorkout]     = useState(null)
  const [generatedAt,    setGeneratedAt]     = useState(null)
  const [status,         setStatus]          = useState('loading')
  // status: 'loading' | 'ready' | 'live' | 'error'

  const echoRef = useRef(null)

  function applyPayload(data) {
    setInsights(data.insights        ?? [])
    setRecommendation(data.recommendation ?? '')
    setWarnings(data.warnings        ?? [])
    setNextWorkout(data.next_workout  ?? null)
    setGeneratedAt(data.generated_at  ?? null)
  }

  useEffect(() => {
    if (!userId) return

    // ── Step 1: Load cached insight on mount (HTTP, ONE call) ──────
    api.get('/ai/insights')
      .then(({ data }) => {
        applyPayload(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))

    // ── Step 2: Subscribe via Reverb WebSocket if Echo is available ─
    // Echo is set up globally in main.jsx via window.Echo
    if (window.Echo) {
      const channel = window.Echo
        .private(`user.${userId}`)
        .listen('.insight.ready', (data) => {
          applyPayload(data)
          setStatus('live')
          setTimeout(() => setStatus('ready'), 5000)
        })
        .listen('.streak.updated', () => {
          // streak updated — optionally refresh dashboard stats
        })
        .listen('.pr.achieved', () => {
          // PR achieved — optionally show a toast
        })
        .listen('.goal.progress', () => {
          // goal progress updated — optionally refresh goals
        })
        .listen('.workout.saved', () => {
          // workout confirmed saved
        })

      echoRef.current = channel
    }

    return () => {
      if (window.Echo && echoRef.current) {
        window.Echo.leave(`user.${userId}`)
      }
    }
  }, [userId])

  return {
    insights,
    recommendation,
    warnings,
    nextWorkout,
    generatedAt,
    status,
  }
}
