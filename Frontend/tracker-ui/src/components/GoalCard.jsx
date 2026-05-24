import { useGoals } from '../hooks/useGoals'
import { useAuth }  from '../hooks/useAuth'

const STATUS_COLORS = {
  in_progress: 'var(--green)',
  achieved:    'var(--green)',
  at_risk:     'var(--yellow)',
  overdue:     'var(--red)',
}

export function GoalsPanel() {
  const { user } = useAuth()
  const { goals, isLoading, celebrating } = useGoals(user?.id)

  if (isLoading) return <div className="p-4 text-center opacity-50">Loading goals...</div>

  return (
    <div className="goals-list space-y-4">
      {goals.map(goal => (
        <div
          key={goal.goal_id}
          className={`goal-item p-4 rounded-xl border border-white/5 bg-white/5 transition-all duration-500 ${
            celebrating === goal.goal_id ? 'ring-2 ring-green-400 shadow-[0_0_20px_rgba(74,222,128,0.3)]' : ''
          }`}
        >
          <div className="goal-meta flex justify-between items-center mb-2">
            <span className="goal-name font-medium">
              🏋️ {goal.exercise_name} — {goal.target_kg} kg
            </span>
            <span
              className="goal-pct font-bold"
              style={{ color: STATUS_COLORS[goal.status] || 'var(--green)' }}
            >
              {goal.pct}%
            </span>
          </div>

          {/* Animated progress bar */}
          <div className="pbar h-2 w-full bg-white/10 rounded-full overflow-hidden mb-3">
            <div
              className="pfill h-full rounded-full"
              style={{
                width: `${goal.pct}%`,
                background: STATUS_COLORS[goal.status] || 'var(--green)',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',  // smooth live animation
              }}
            />
          </div>

          <div className="goal-dates flex justify-between text-xs opacity-60">
            <span>Now: {goal.current_kg} kg</span>
            <span className={goal.status === 'overdue' ? 'text-red-500' : ''}>
              {goal.status === 'achieved'
                ? '✅ Achieved!'
                : `Target: ${goal.target_kg} kg`}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
