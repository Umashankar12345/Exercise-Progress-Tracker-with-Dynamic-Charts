import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { echo } from '../lib/echo'
import axios   from 'axios'
import confetti from 'canvas-confetti'
import toast    from 'react-hot-toast'

export function useGoals(userId) {
  const queryClient = useQueryClient()
  const [celebrating, setCelebrating] = useState(null) // goalId being celebrated

  // ── 1. Load all goals on mount (one REST call) ──
  const { data, isLoading } = useQuery({
    queryKey: ['goals', userId],
    queryFn:  () => axios.get('/api/goals').then(r => r.data.data),
    staleTime: Infinity,  // never poll — WebSocket handles updates
  })

  // ── 2. Listen for live progress updates ──
  useEffect(() => {
    if (!userId) return

    echo.private(`user.${userId}`)
      .listen('.goal.progress', (payload) => {
        const {
          goal_id, pct, current_kg,
          target_kg, exercise_name,
          status, achieved_at
        } = payload

        // Update the specific goal in React Query cache
        queryClient.setQueryData(['goals', userId], (old) =>
          old?.map(g =>
            g.goal_id === goal_id
              ? { ...g, pct, current_kg, status }
              : g
          ) ?? []
        )

        // 🎉 Goal achieved for the first time — celebrate!
        if (achieved_at) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00e5a0', '#7c5cfc', '#ff7849'],
          })
          toast.success(
            `🏆 Goal achieved! ${exercise_name}: ${current_kg} kg`,
            { duration: 5000 }
          )
          setCelebrating(goal_id)
          setTimeout(() => setCelebrating(null), 4000)
        }

        // ⚠️ Goal is at risk — warn the user
        if (status === 'at_risk') {
          toast(
            `⚠️ ${exercise_name} goal is at risk — only ${pct}% with 2 weeks left`,
            { icon: '⚠️', duration: 4000 }
          )
        }
      })

    return () => echo.leave(`user.${userId}`)
  }, [userId, queryClient])

  return {
    goals: data ?? [],
    isLoading,
    celebrating,  // use to apply glow/animation to specific goal card
  }
}
