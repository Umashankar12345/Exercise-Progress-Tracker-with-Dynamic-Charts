import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ── live animated stat card ── */
function StatCard({ color, icon, label, value, trend, trendUp, delay = 0 }) {
  return (
    <div className={`stat-card ${color}`} style={{ animationDelay: `${delay}s` }}>
      <div className="stat-glow"></div>
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-val">{value}</div>
      <div className="stat-trend">
        <span className={trendUp ? 'up' : 'dn'}>{trend}</span>
      </div>
    </div>
  );
}

/* ── streak calendar ── */
const calData = [
  'rest','rest','done','done','done','miss','done',
  'done','done','done','done','done','done','done',
  'done','done','done','done','done','today',
];

/* ── muscle balance ── */
const muscles = [
  { name: 'Chest',     pct: 38, color: 'var(--green)' },
  { name: 'Back',      pct: 19, color: 'var(--accent)' },
  { name: 'Legs',      pct: 52, color: 'var(--orange)' },
  { name: 'Shoulders', pct: 25, color: 'var(--yellow)' },
  { name: 'Arms',      pct: 20, color: 'var(--red)' },
  { name: 'Core',      pct: 15, color: 'var(--blue)' },
];

export default function Dashboard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* WebSocket bar */}
      <div className="ws-bar">
        <div className="live-dot" style={{ width: 8, height: 8 }}></div>
        <span className="ws-green">WebSocket connected</span>
        <span style={{ color: 'var(--text3)' }}>·</span>
        <span>All 10 features broadcasting live on</span>
        <code style={{ background: 'var(--s2)', padding: '1px 7px', borderRadius: 5, fontSize: 11 }}>
          private:user.42
        </code>
        <div className="ws-events">
          {['workout.saved','pr.achieved','streak.updated','insight.ready','goal.progress'].map(e => (
            <span key={e} className="ws-evt">{e}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="sec-head">
        <div className="sec-label">This Week's Overview</div>
        <div className="sec-line"></div>
        <div className="sec-tag">Live via Echo — {time.toLocaleTimeString()}</div>
      </div>
      <div className="stats-grid">
        <StatCard color="c-green"  icon="⚡" label="Workouts (April)" value="18"   trend="↑ 3 from last month" trendUp delay={0.04} />
        <StatCard color="c-orange" icon="🔥" label="Total Volume (kg)" value="24.8k" trend="↑ 12% overload"      trendUp delay={0.08} />
        <StatCard color="c-purple" icon="🏆" label="Personal Records"  value="7"    trend="this month"           trendUp delay={0.12} />
        <StatCard color="c-red"    icon="🔥" label="Streak"            value="14d"  trend="↑ Best ever!"         trendUp delay={0.16} />
        <StatCard color="c-blue"   icon="🎯" label="Goals Active"      value="3"    trend="↑ 78% avg progress"   trendUp delay={0.20} />
      </div>

      {/* Bottom 3-col grid */}
      <div className="sec-head">
        <div className="sec-label">Progress, Records &amp; Schedule</div>
        <div className="sec-line"></div>
        <div className="sec-tag">All live via WebSocket</div>
      </div>

      <div className="bottom-grid">
        {/* Streak Calendar */}
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">🔥 Streak Calendar</div>
              <div className="card-sub">streak.updated · Apr 2026</div>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--orange)' }}>14</span>
          </div>
          <div className="streak-cal">
            <div className="cal-grid">
              {calData.map((d, i) => (
                <div key={i} className={`cal-day ${d}`}>{i + 1}</div>
              ))}
            </div>
            <div className="streak-stats">
              <div className="ss-item"><div className="ss-val">14</div><div className="ss-lbl">Current</div></div>
              <div className="ss-item"><div className="ss-val">18</div><div className="ss-lbl">Workouts</div></div>
              <div className="ss-item"><div className="ss-val">14</div><div className="ss-lbl">Best</div></div>
            </div>
          </div>
        </div>

        {/* PR Tracker */}
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">🏆 Personal Records</div>
              <div className="card-sub">pr.achieved · Epley 1RM formula</div>
            </div>
            <span style={{ fontSize: 10, color: 'var(--green)', background: 'var(--green-dim)', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(0,229,160,.2)' }}>LIVE</span>
          </div>
          <div className="pr-list">
            {[
              { ico: '🏋️', name: 'Bench Press', date: 'Apr 19, 2026', kg: '80 kg' },
              { ico: '🦵', name: 'Squat',        date: 'Apr 15, 2026', kg: '95 kg' },
              { ico: '💀', name: 'Deadlift',     date: 'Apr 12, 2026', kg: '120 kg' },
              { ico: '💪', name: 'OHP',          date: 'Apr 8, 2026',  kg: '52 kg' },
            ].map(pr => (
              <div key={pr.name} className="pr-item">
                <div className="pr-ico">{pr.ico}</div>
                <div className="pr-info">
                  <div className="pr-name">{pr.name}</div>
                  <div className="pr-date">{pr.date}</div>
                </div>
                <div className="pr-weight">{pr.kg}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Schedule */}
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">📅 AI Weekly Plan</div>
              <div className="card-sub">schedule.ready · GenerateScheduleJob</div>
            </div>
            <span className="ai-label" style={{ fontSize: 9 }}>AI</span>
          </div>
          <div className="sched-list">
            {[
              { day: 'MON', name: 'Push Day A',  muscle: 'Chest · Shoulders · Triceps', dot: 'var(--accent)', today: true },
              { day: 'TUE', name: 'Pull Day A',  muscle: 'Back · Biceps · Rear Delt',   dot: 'var(--green)' },
              { day: 'WED', name: 'REST / Walk', muscle: 'Active recovery',              dot: 'var(--text3)' },
              { day: 'THU', name: 'Legs + Core', muscle: 'Quads · Hams · Glutes',        dot: 'var(--orange)' },
              { day: 'FRI', name: 'Push Day B',  muscle: 'Volume focus · deload ready',  dot: 'var(--accent)' },
            ].map(s => (
              <div key={s.day} className={`sched-item${s.today ? ' today-row' : ''}`}>
                <div className="sched-day">{s.day}</div>
                <div className="sched-info">
                  <div className="sched-name">{s.name}</div>
                  <div className="sched-muscle">{s.muscle}</div>
                </div>
                <div className="sched-dot" style={{ background: s.dot }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Muscle Balance */}
      <div className="sec-head" style={{ marginTop: 18 }}>
        <div className="sec-label">Muscle Group Balance</div>
        <div className="sec-line"></div>
        <div className="sec-tag">imbalance.detected · ProgressService</div>
      </div>
      <div className="card">
        <div className="card-hd">
          <div>
            <div className="card-title">Volume Distribution — April 2026</div>
            <div className="card-sub">muscle.balance.updated · live radar data</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--yellow)', background: 'rgba(251,191,36,.08)', border: '1px solid rgba(251,191,36,.2)', padding: '4px 10px', borderRadius: 7 }}>
            ⚠️ Push/pull imbalance — AI flagged
          </div>
        </div>
        <div className="muscle-grid">
          {muscles.map(m => (
            <div key={m.name} className="muscle-item">
              <div className="muscle-lbl"><span>{m.name}</span><span>{m.pct}%</span></div>
              <div className="pbar"><div className="pfill" style={{ width: `${m.pct}%`, background: m.color }}></div></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="footer-bar">
        <span style={{ fontSize: 20 }}>⚡</span>
        <div style={{ flex: 1, fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text)' }}>Rank #1 stack:</strong>{' '}
          Laravel 11 (Observer → Queue → Horizon) · Claude API (AIService) · Laravel Reverb WebSockets · React + Echo · Redis cache · MySQL · Recharts · Sanctum auth · Service layer pattern
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="ws-evt">10 live events</span>
          <span className="ws-evt">1 channel</span>
          <span className="ws-evt">0 polling</span>
        </div>
      </div>
    </>
  );
}
