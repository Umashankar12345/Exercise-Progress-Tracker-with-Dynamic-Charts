import React, { useState } from 'react';

const EXERCISES = {
  Chest:     ['Bench Press', 'Incline DB Press', 'Cable Fly', 'Chest Dips'],
  Back:      ['Deadlift', 'Pull-ups', 'Barbell Row', 'Lat Pulldown'],
  Legs:      ['Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curl'],
  Shoulders: ['Overhead Press', 'Lateral Raises', 'Face Pulls'],
  Arms:      ['Barbell Curl', 'Tricep Pushdown', 'Hammer Curl'],
  Core:      ['Plank', 'Cable Crunch', 'Leg Raise'],
};

const INSIGHTS = [
  { type: 'tip',   icon: '✅', text: <><strong>Progressive overload detected.</strong> Bench press volume up 12% over 3 weeks — excellent adaptation signal.</> },
  { type: 'warn',  icon: '⚠️', text: <><strong>Shoulder imbalance.</strong> Pushing 2× pulling volume. Add 2 rows per week to rebalance.</> },
  { type: 'alert', icon: '🔴', text: <><strong>Deload recommended.</strong> 14 days straight — light week advised to prevent overtraining.</> },
];

const GOALS = [
  { icon: '🏋️', name: 'Bench — 100 kg', now: '78 kg', target: 'Jun 2026', pct: 78, color: 'var(--green)' },
  { icon: '⚖️', name: 'Weight — 75 kg',  now: '81 kg', target: 'Aug 2026', pct: 60, color: 'var(--orange)' },
  { icon: '🦵', name: 'Squat — 120 kg',  now: '95 kg', target: 'Sep 2026', pct: 45, color: 'var(--accent)' },
];

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
  const [status, setStatus]     = useState(null); // 'loading' | 'success' | 'error'
  const [msg, setMsg]           = useState('');

  /* ── set helpers ── */
  const updateSet = (id, field, val) =>
    setSets(prev => prev.map(s => s.id === id ? { ...s, [field]: Number(val) } : s));

  const addSet = () =>
    setSets(prev => [...prev, { id: nextId++, reps: 10, weight: prev.at(-1)?.weight ?? 135 }]);

  const delSet = (id) =>
    setSets(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);

  /* ── submit ── */
  const handleSubmit = async () => {
    if (!exercise) { setStatus('error'); setMsg('Please select an exercise first.'); return; }
    setStatus('loading');
    // Simulate API call to Laravel POST /api/workouts
    await new Promise(r => setTimeout(r, 1200));
    setStatus('success');
    setMsg(`✅ "${exercise}" logged! AI analysis dispatched, streak updated, WebSocket events broadcast.`);
    setTimeout(() => { setStatus(null); setMsg(''); }, 5000);
  };

  return (
    <>
      {/* WebSocket bar */}
      <div className="ws-bar">
        <div className="live-dot" style={{ width: 8, height: 8 }}></div>
        <span className="ws-green">WebSocket connected</span>
        <span style={{ color: 'var(--text3)' }}>·</span>
        <span>All 10 features broadcasting live on</span>
        <code style={{ background: 'var(--s2)', padding: '1px 7px', borderRadius: 5, fontSize: 11 }}>private:user.42</code>
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
        <div className="sec-tag">POST /api/workouts → WorkoutObserver → 9 events broadcast</div>
      </div>

      <div className="content-grid">
        {/* ── FORM ── */}
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">Record your session</div>
              <div className="card-sub">Saving triggers AI analysis, PR detection, streak update — all live</div>
            </div>
            <div className="live-indicator">
              <div className="live-dot"></div>Live push ready
            </div>
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

              {/* Column labels */}
              <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr 36px', gap: 8, padding: '0 12px' }}>
                {['#', 'Reps', 'Weight', 'Vol (lbs)', ''].map((h, i) => (
                  <span key={i} style={{ fontSize: 10, color: 'var(--text3)', textAlign: 'center' }}>{h}</span>
                ))}
              </div>

              {/* Set rows */}
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

              {/* Notes */}
              <div className="field">
                <label>Session Notes (optional)</label>
                <input type="text" placeholder="e.g. Felt strong today, good pump…"
                  value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              {/* What happens on submit */}
              <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 9, padding: '10px 12px', fontSize: 11.5, color: 'var(--text2)', lineHeight: 1.7 }}>
                <div style={{ color: 'var(--text)', fontWeight: 500, marginBottom: 4, fontSize: 12 }}>⚡ On submit, Laravel instantly:</div>
                saves to MySQL · checks PR (Epley 1RM) · updates streak · calculates muscle balance · dispatches AI job to queue · broadcasts{' '}
                <span style={{ color: 'var(--green)' }}>9 WebSocket events</span> to your channel
              </div>

              <button className="btn-submit" onClick={handleSubmit} disabled={status === 'loading'}>
                {status === 'loading'
                  ? <><div className="spinner"></div> Processing…</>
                  : '⚡ Log Exercise & Trigger Live Updates'}
              </button>
            </div>
          </div>
        </div>

        {/* ── AI PANEL ── */}
        <div className="ai-panel">
          {/* AI Insights */}
          <div className="ai-card">
            <div className="ai-glow-header">
              <span style={{ fontSize: 18 }}>🤖</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>AI Coach Insights</div>
                <div className="ai-status"><div className="live-dot"></div>Claude · updated 12 min ago</div>
              </div>
              <span className="ai-label">AI LIVE</span>
            </div>
            <div className="insights-list">
              {INSIGHTS.map((ins, i) => (
                <div key={i} className={`insight ${ins.type}`}>
                  <div className="insight-icon">{ins.icon}</div>
                  <div className="insight-text">{ins.text}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)' }}>
              <button style={{ width: '100%', padding: 9, borderRadius: 8, background: 'var(--accent-glow)', border: '1px solid rgba(124,92,252,.3)', color: 'var(--accent)', fontFamily: 'inherit', fontSize: 12.5, cursor: 'pointer' }}>
                💬 Ask AI Coach
              </button>
            </div>
          </div>

          {/* Goals */}
          <div className="ai-card">
            <div className="card-hd" style={{ padding: '12px 16px' }}>
              <div>
                <div className="card-title" style={{ fontSize: 13 }}>Active Goals</div>
                <div className="card-sub">Live progress · goal.progress event</div>
              </div>
            </div>
            <div className="goals-list">
              {GOALS.map(g => (
                <div key={g.name} className="goal-item">
                  <div className="goal-meta">
                    <span className="goal-name">{g.icon} {g.name}</span>
                    <span className="goal-pct" style={{ color: g.color }}>{g.pct}%</span>
                  </div>
                  <div className="pbar">
                    <div className="pfill" style={{ width: `${g.pct}%`, background: g.color }}></div>
                  </div>
                  <div className="goal-dates"><span>Now: {g.now}</span><span>{g.target}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
