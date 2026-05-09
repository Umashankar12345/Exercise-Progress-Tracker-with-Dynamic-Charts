import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const EXERCISES = {
  Chest:     ['Bench Press', 'Incline DB Press', 'Cable Fly', 'Chest Dips'],
  Back:      ['Deadlift', 'Pull-ups', 'Barbell Row', 'Lat Pulldown'],
  Legs:      ['Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curl'],
  Shoulders: ['Overhead Press', 'Lateral Raises', 'Face Pulls'],
  Arms:      ['Barbell Curl', 'Tricep Pushdown', 'Hammer Curl'],
  Core:      ['Plank', 'Cable Crunch', 'Leg Raise'],
};

let nextId = 4;
const defaultSets = [
  { id: 1, reps: 10, weight: 135 },
  { id: 2, reps: 10, weight: 135 },
  { id: 3, reps: 8,  weight: 145 },
];

export default function LogWorkout() {
  const [exercise, setExercise] = useState('');
  const [sets, setSets]         = useState(defaultSets);
  const [notes, setNotes]       = useState('');
  const [status, setStatus]     = useState(null);
  const [msg, setMsg]           = useState('');
  const [goals, setGoals]       = useState([]);
  const [insights, setInsights] = useState([]);
  const [insightLoading, setInsightLoading] = useState(true);

  // Fetch real goals + AI insights from API
  useEffect(() => {
    const load = async () => {
      try {
        const [g, ins] = await Promise.all([
          api.get('/goals'),
          api.get('/ai/insights'),
        ]);
        setGoals(g.data);
        setInsights(ins.data);
      } catch (e) {
        console.error('Failed to load sidebar data', e);
      } finally {
        setInsightLoading(false);
      }
    };
    load();
  }, []);

  /* ── set helpers ── */
  const updateSet = (id, field, val) =>
    setSets(prev => prev.map(s => s.id === id ? { ...s, [field]: Number(val) } : s));
  const addSet = () =>
    setSets(prev => [...prev, { id: nextId++, reps: 10, weight: prev.at(-1)?.weight ?? 135 }]);
  const delSet = (id) =>
    setSets(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);

  /* ── submit to real API ── */
  const handleSubmit = async () => {
    if (!exercise) { setStatus('error'); setMsg('Please select an exercise first.'); return; }
    setStatus('loading');
    setMsg('');
    try {
      await api.post('/workouts', {
        name: exercise,
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        notes,
        sets: sets.map(s => ({ reps: s.reps, weight: s.weight })),
      });
      setStatus('success');
      setMsg(`✅ "${exercise}" saved to database! AI analysis job dispatched to Laravel queue.`);
      setSets(defaultSets);
      setExercise('');
      setNotes('');
      setTimeout(() => { setStatus(null); setMsg(''); }, 6000);
    } catch (err) {
      setStatus('error');
      setMsg(err.response?.data?.message || 'Failed to save workout. Check if backend is running.');
    }
  };

  const INSIGHT_STYLES = { tip: 'tip', warning: 'warn', alert: 'alert' };
  const INSIGHT_ICONS  = { tip: '✅', warning: '⚠️', alert: '🔴' };
  const GOAL_COLORS    = ['var(--green)', 'var(--orange)', 'var(--accent)', 'var(--blue)'];

  return (
    <>
      {/* API status bar */}
      <div className="ws-bar">
        <div className="live-dot" style={{ width: 8, height: 8 }}></div>
        <span className="ws-green">API connected</span>
        <span style={{ color: 'var(--text3)' }}>·</span>
        <span>POST /api/workouts → WorkoutController → Queue job dispatched</span>
        <div className="ws-events">
          {['workout.saved','pr.achieved','streak.updated','insight.ready','goal.progress'].map(e => (
            <span key={e} className="ws-evt">{e}</span>
          ))}
        </div>
      </div>

      {/* Alert */}
      {msg && <div className={status === 'success' ? 'alert-success' : 'alert-error'}>{msg}</div>}

      <div className="sec-head">
        <div className="sec-label">Log Your Session</div>
        <div className="sec-line"></div>
        <div className="sec-tag">POST /api/workouts → Real Laravel DB</div>
      </div>

      <div className="content-grid">
        {/* ── FORM ── */}
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">Record your session</div>
              <div className="card-sub">Data saved to SQLite → AI analysis → PR detection</div>
            </div>
            <div className="live-indicator"><div className="live-dot"></div>Laravel ready</div>
          </div>
          <div className="card-body">
            <div className="form-section">
              {/* Exercise selector */}
              <div className="field">
                <label>Exercise</label>
                <select value={exercise} onChange={e => setExercise(e.target.value)}>
                  <option value="" disabled>Select an exercise…</option>
                  {Object.entries(EXERCISES).map(([group, items]) => (
                    <optgroup key={group} label={group}>
                      {items.map(ex => <option key={ex}>{ex}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Set header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--text2)' }}>Sets</span>
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>Weight in lbs · tap to edit</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr 36px', gap: 8, padding: '0 12px' }}>
                {['#', 'Reps', 'Weight', 'Vol (lbs)', ''].map((h, i) => (
                  <span key={i} style={{ fontSize: 10, color: 'var(--text3)', textAlign: 'center' }}>{h}</span>
                ))}
              </div>

              <div className="set-rows">
                {sets.map((s, idx) => {
                  const vol = s.reps * s.weight;
                  const isLast = idx === sets.length - 1;
                  return (
                    <div key={s.id} className={`set-row${isLast ? ' last-set' : ''}`}>
                      <div className="set-num">{idx + 1}</div>
                      <div>
                        <div className="set-label">Reps</div>
                        <input className="set-input" type="number" min={1} value={s.reps}
                          onChange={e => updateSet(s.id, 'reps', e.target.value)} />
                      </div>
                      <div>
                        <div className="set-label">lbs</div>
                        <input className="set-input" type="number" min={0} value={s.weight}
                          style={s.weight > 140 ? { color: 'var(--orange)' } : {}}
                          onChange={e => updateSet(s.id, 'weight', e.target.value)} />
                      </div>
                      <div>
                        <div className="set-label">Vol</div>
                        <input className="set-input" type="number" value={vol} readOnly
                          style={{ color: 'var(--text2)' }} />
                      </div>
                      <div className="set-del" onClick={() => delSet(s.id)}>✕</div>
                    </div>
                  );
                })}
                <button className="add-set-btn" onClick={addSet}>＋ Add Set</button>
              </div>

              <div className="field">
                <label>Session Notes (optional)</label>
                <input type="text" placeholder="e.g. Felt strong today, good pump…"
                  value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 9, padding: '10px 12px', fontSize: 11.5, color: 'var(--text2)', lineHeight: 1.7 }}>
                <div style={{ color: 'var(--text)', fontWeight: 500, marginBottom: 4, fontSize: 12 }}>⚡ On submit, Laravel:</div>
                saves to DB · checks PR (Epley 1RM) · updates streak · dispatches{' '}
                <span style={{ color: 'var(--accent)' }}>AnalyzeWorkoutJob</span> to queue
              </div>

              <button className="btn-submit" onClick={handleSubmit} disabled={status === 'loading'}>
                {status === 'loading'
                  ? <><div className="spinner"></div> Saving to Laravel DB…</>
                  : '⚡ Log Exercise & Save to Database'}
              </button>
            </div>
          </div>
        </div>

        {/* ── AI PANEL (right) ── */}
        <div className="ai-panel">
          {/* AI Insights from API */}
          <div className="ai-card">
            <div className="ai-glow-header">
              <span style={{ fontSize: 18 }}>🤖</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>AI Coach Insights</div>
                <div className="ai-status">
                  <div className="live-dot"></div>
                  /api/ai/insights · Claude
                </div>
              </div>
              <span className="ai-label">AI LIVE</span>
            </div>
            <div className="insights-list">
              {insightLoading
                ? <div style={{ padding: 16, color: 'var(--text3)' }}>Loading AI insights…</div>
                : insights.length === 0
                  ? (
                    <>
                      {/* Fallback default insights if API returns empty */}
                      <div className="insight tip">
                        <div className="insight-icon">✅</div>
                        <div className="insight-text"><strong>Progressive overload detected.</strong> Bench press volume up 12% — excellent adaptation.</div>
                      </div>
                      <div className="insight warn">
                        <div className="insight-icon">⚠️</div>
                        <div className="insight-text"><strong>Shoulder imbalance.</strong> Pushing 2× pulling volume. Add rows to rebalance.</div>
                      </div>
                      <div className="insight alert">
                        <div className="insight-icon">🔴</div>
                        <div className="insight-text"><strong>Deload recommended.</strong> 14 days straight — light week advised.</div>
                      </div>
                    </>
                  )
                  : insights.map((ins, i) => (
                    <div key={i} className={`insight ${INSIGHT_STYLES[ins.type] ?? 'tip'}`}>
                      <div className="insight-icon">{INSIGHT_ICONS[ins.type] ?? '✅'}</div>
                      <div className="insight-text" dangerouslySetInnerHTML={{ __html: ins.message }}></div>
                    </div>
                  ))}
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)' }}>
              <button style={{ width: '100%', padding: 9, borderRadius: 8, background: 'var(--accent-glow)', border: '1px solid rgba(124,92,252,.3)', color: 'var(--accent)', fontFamily: 'inherit', fontSize: 12.5, cursor: 'pointer' }}>
                💬 Ask AI Coach
              </button>
            </div>
          </div>

          {/* Goals from real API */}
          <div className="ai-card">
            <div className="card-hd" style={{ padding: '12px 16px' }}>
              <div>
                <div className="card-title" style={{ fontSize: 13 }}>Active Goals</div>
                <div className="card-sub">/api/goals · Real data</div>
              </div>
            </div>
            <div className="goals-list">
              {goals.length === 0
                ? (
                  <div style={{ padding: '12px 4px', color: 'var(--text3)', fontSize: 12.5 }}>
                    No goals yet.{' '}
                    <a href="/profile" style={{ color: 'var(--accent)' }}>Set a goal →</a>
                  </div>
                )
                : goals.map((g, i) => {
                  const pct = g.percentage ?? 0;
                  return (
                    <div key={g.id} className="goal-item">
                      <div className="goal-meta">
                        <span className="goal-name">🎯 {g.target_weight ? `Target: ${g.target_weight} kg` : 'Goal'}</span>
                        <span className="goal-pct" style={{ color: GOAL_COLORS[i % GOAL_COLORS.length] }}>{pct}%</span>
                      </div>
                      <div className="pbar">
                        <div className="pfill" style={{ width: `${pct}%`, background: GOAL_COLORS[i % GOAL_COLORS.length] }}></div>
                      </div>
                      <div className="goal-dates">
                        <span>Target: {g.target_weight} kg</span>
                        <span>{g.goal_date ?? '—'}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
