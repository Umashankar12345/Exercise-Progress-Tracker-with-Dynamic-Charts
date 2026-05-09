import React from 'react'
import { useAIInsights } from '../hooks/useAIInsights'
import useStore from '../store/useStore'

const INSIGHT_TYPE_MAP = {
  tip:     { cls: 'tip',   icon: '✅' },
  warning: { cls: 'warn',  icon: '⚠️' },
  alert:   { cls: 'alert', icon: '🔴' },
}

function InsightsSkeleton() {
  return (
    <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          height: 48, borderRadius: 9,
          background: 'linear-gradient(90deg,var(--s2) 25%,var(--s3) 50%,var(--s2) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }} />
      ))}
    </div>
  )
}

function InsightsError() {
  return (
    <div style={{ padding: 16, color: 'var(--red)', fontSize: 12.5 }}>
      ⚠️ Could not load AI insights. Log a workout to generate analysis.
    </div>
  )
}

/**
 * AIInsightsCard — renders real-time AI coaching data.
 *
 * Data flow:
 *  1. On mount → GET /api/ai/insights (cached by AnalyzeWorkoutJob)
 *  2. Live push → Reverb private:user.{id} → .insight.ready event
 *  3. Status badge shows "just updated" for 5s after live push
 */
export default function AIInsightsCard() {
  const user = useStore((s) => s.user)
  const {
    insights, recommendation, warnings,
    nextWorkout, generatedAt, status,
  } = useAIInsights(user?.id)

  if (status === 'loading') return (
    <div className="ai-card">
      <div className="ai-glow-header">
        <span style={{ fontSize: 18 }}>🤖</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>AI Coach Insights</div>
          <div className="ai-status"><div className="live-dot"></div>Analyzing…</div>
        </div>
        <span className="ai-label">AI</span>
      </div>
      <InsightsSkeleton />
    </div>
  )

  if (status === 'error') return (
    <div className="ai-card">
      <div className="ai-glow-header">
        <span style={{ fontSize: 18 }}>🤖</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>AI Coach Insights</div>
        </div>
      </div>
      <InsightsError />
    </div>
  )

  return (
    <div className="ai-card">
      {/* Header */}
      <div className="ai-glow-header">
        <span style={{ fontSize: 18 }}>🤖</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>AI Coach Insights</div>
          <div className="ai-status">
            <div className="live-dot"></div>
            Claude ·{' '}
            {generatedAt
              ? new Date(generatedAt).toLocaleTimeString()
              : 'cached'}
          </div>
        </div>
        {status === 'live'
          ? <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--green)', color: '#000', padding: '2px 8px', borderRadius: 20 }}>JUST UPDATED</span>
          : <span className="ai-label">AI LIVE</span>
        }
      </div>

      {/* Insight items */}
      <div className="insights-list">
        {insights.map((item, i) => {
          const { cls, icon } = INSIGHT_TYPE_MAP[item.type] ?? INSIGHT_TYPE_MAP.tip
          return (
            <div key={i} className={`insight ${cls}`}>
              <div className="insight-icon">{icon}</div>
              <div className="insight-text" dangerouslySetInnerHTML={{ __html: item.text }} />
            </div>
          )
        })}

        {/* Recommendation */}
        {recommendation && (
          <div style={{ padding: '8px 10px', fontSize: 12, color: 'var(--text2)', fontStyle: 'italic', borderTop: '1px solid var(--border)', marginTop: 4 }}>
            💡 {recommendation}
          </div>
        )}
      </div>

      {/* Next Workout Card */}
      {nextWorkout && (
        <div style={{ margin: '0 14px 12px', padding: '10px 12px', background: 'rgba(124,92,252,.08)', border: '1px solid rgba(124,92,252,.2)', borderRadius: 9 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>📅 NEXT WORKOUT</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{nextWorkout.name}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text2)', marginTop: 2 }}>{nextWorkout.focus}</div>
          {nextWorkout.exercises && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
              {nextWorkout.exercises.map((ex, i) => (
                <span key={i} style={{ fontSize: 10, padding: '2px 7px', background: 'var(--s3)', borderRadius: 20, color: 'var(--text2)' }}>{ex}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ask AI button */}
      <div style={{ padding: '0 14px 12px' }}>
        <button style={{
          width: '100%', padding: 9, borderRadius: 8,
          background: 'var(--accent-glow)', border: '1px solid rgba(124,92,252,.3)',
          color: 'var(--accent)', fontFamily: 'inherit', fontSize: 12.5, cursor: 'pointer',
        }}>
          💬 Ask AI Coach
        </button>
      </div>
    </div>
  )
}
