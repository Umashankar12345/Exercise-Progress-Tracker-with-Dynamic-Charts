import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AIInsightsCard from '../components/AIInsightsCard';

const EXERCISES = {
  Chest:     ['Bench Press', 'Incline DB Press', 'Cable Fly', 'Chest Dips'],
  Back:      ['Deadlift', 'Pull-ups', 'Barbell Row', 'Lat Pulldown'],
  Legs:      ['Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curl'],
  Shoulders: ['Overhead Press', 'Lateral Raises', 'Face Pulls'],
  Arms:      ['Barbell Curl', 'Tricep Pushdown', 'Hammer Curl'],
  Core:      ['Plank', 'Cable Crunch', 'Leg Raise'],
};

const GOAL_COLORS = ['var(--green)', 'var(--orange)', 'var(--accent)', 'var(--blue)'];
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

  useEffect(() => {
    api.get('/goals').then(r => setGoals(r.data)).catch(() => {});
  }, []);

  const updateSet = (id, field, val) =>
    setSets(prev => prev.map(s => s.id === id ? { ...s, [field]: Number(val) } : s));
  const addSet = () =>
    setSets(prev => [...prev, { id: nextId++, reps: 10, weight: prev.at(-1)?.weight ?? 135 }]);
  const delSet = (id) =>
    setSets(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);

  const handleSubmit = async () => {
    if (!exercise) { setStatus('error'); setMsg('Please select an exercise first.'); return; }
    setStatus('loading');
    setMsg('');
    try {
      await api.post('/workouts', {
        name: exercise,
        started_at: new Date().toISOString(),
        ended_at:   new Date().toISOString(),
        notes,
        sets: sets.map(s => ({ reps: s.reps, weight: s.weight })),
      });
      setStatus('success');
      setMsg(`✅ "${exercise}" saved! WorkoutObserver fired 5 events → AI job dispatched to queue.`);
      setSets(defaultSets); setExercise(''); setNotes('');
      setTimeout(() => { setStatus(null); setMsg(''); }, 6000);
    } catch (err) {
      setStatus('error');
      setMsg(err.response?.data?.message || 'Failed to save. Is Laravel running on :8000?');
    }
  };

  return (
    <>
      {/* API status bar */}
      <div className="ws-bar">
        <div className="live-dot" style={{ width: 8, height: 8 }}></div>
        <span className="ws-green">API connected</span>
        <span style={{ color: 'var(--text3)' }}>·</span>
        <span>POST /api/workouts → WorkoutObserver → 5 events broadcast</span>
        <div className="ws-events">
          {['workout.saved','pr.achieved','streak.updated','insight.ready','goal.progress'].map(e => (
            <span key={e} className="ws-evt">{e}</span>
          ))}
        </div>
      </div>

      {msg && <div className={status === 'success' ? 'alert-success' : 'alert-error'}>{msg}</div>}

      <div className="sec-head">
        <div className="sec-label">Log Your Session</div>
        <div className="sec-line"></div>
        <div className="sec-tag">POST /api/workouts → WorkoutObserver → InsightReady broadcast</div>
      </div>

      <div className="content-grid">
        {/* ── FORM ── */}
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">Record your session</div>
              <div className="card-sub">Saved to DB → AI job dispatched → InsightReady broadcast via Reverb</div>
            </div>
            <div className="live-indicator"><div className="live-dot"></div>Laravel ready</div>
          </div>
          <div className="card-body">
            <div className="form-section">

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
                <div style={{ color: 'var(--text)', fontWeight: 500, marginBottom: 4, fontSize: 12 }}>⚡ On submit, WorkoutObserver fires:</div>
                <span style={{ color: 'var(--green)' }}>workout.saved</span> · <span style={{ color: 'var(--orange)' }}>streak.updated</span> · <span style={{ color: 'var(--blue)' }}>muscle.balance.updated</span> · <span style={{ color: 'var(--yellow)' }}>goal.progress</span> → then <span style={{ color: 'var(--accent)' }}>AnalyzeWorkoutJob</span> dispatched → <span style={{ color: 'var(--green)' }}>insight.ready</span> broadcast
              </div>

              <button className="btn-submit" onClick={handleSubmit} disabled={status === 'loading'}>
                {status === 'loading'
                  ? <><div className="spinner"></div> Saving to Laravel DB…</>
                  : '⚡ Log Exercise & Trigger 5 WebSocket Events'}
              </button>
            </div>
          </div>
        </div>

        {/* ── AI PANEL — real hook + Reverb WebSocket ── */}
        <div className="ai-panel">
          {/* AIInsightsCard uses useAIInsights hook: HTTP on mount + Reverb live push */}
          <AIInsightsCard />

          {/* Goals from real API */}
          <div className="ai-card">
            <div className="card-hd" style={{ padding: '12px 16px' }}>
              <div>
                <div className="card-title" style={{ fontSize: 13 }}>Active Goals</div>
                <div className="card-sub">/api/goals · goal.progress event</div>
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
