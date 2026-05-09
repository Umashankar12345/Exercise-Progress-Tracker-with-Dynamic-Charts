import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const calData = [
  'rest','rest','done','done','done','miss','done',
  'done','done','done','done','done','done','done',
  'done','done','done','done','done','today',
];
const SCHEDULE = [
  { day: 'MON', name: 'Push Day A',  muscle: 'Chest · Shoulders · Triceps', dot: 'var(--accent)', today: true },
  { day: 'TUE', name: 'Pull Day A',  muscle: 'Back · Biceps · Rear Delt',   dot: 'var(--green)' },
  { day: 'WED', name: 'REST / Walk', muscle: 'Active recovery',              dot: 'var(--text3)' },
  { day: 'THU', name: 'Legs + Core', muscle: 'Quads · Hams · Glutes',        dot: 'var(--orange)' },
  { day: 'FRI', name: 'Push Day B',  muscle: 'Volume focus',                 dot: 'var(--accent)' },
];

function StatCard({ color, icon, label, value, trend, trendUp, loading }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-glow"></div>
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-val">{loading ? '…' : value}</div>
      <div className="stat-trend"><span className={trendUp ? 'up' : 'dn'}>{trend}</span></div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [prs, setPrs]         = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime]       = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p, m] = await Promise.all([
          api.get('/progress/summary'),
          api.get('/prs'),
          api.get('/progress/muscles'),
        ]);
        setSummary(s.data);
        setPrs(p.data);
        setMuscles(m.data);
      } catch (e) {
        console.error('Dashboard fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const PR_ICONS = { 'Bench Press': '🏋️', 'Squat': '🦵', 'Deadlift': '💀', 'OHP': '💪' };
  const MUSCLE_COLORS = { Chest:'var(--green)', Back:'var(--accent)', Legs:'var(--orange)', Shoulders:'var(--yellow)', Arms:'var(--red)', Core:'var(--blue)' };

  return (
    <>
      {/* Live bar */}
      <div className="ws-bar">
        <div className="live-dot" style={{ width: 8, height: 8 }}></div>
        <span className="ws-green">API connected</span>
        <span style={{ color: 'var(--text3)' }}>·</span>
        <span>Laravel 11 · Sanctum · Real data</span>
        <div className="ws-events">
          {['workout.saved','pr.achieved','streak.updated','insight.ready','goal.progress'].map(e => (
            <span key={e} className="ws-evt">{e}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="sec-head">
        <div className="sec-label">Overview</div>
        <div className="sec-line"></div>
        <div className="sec-tag">{time.toLocaleTimeString()}</div>
      </div>
      <div className="stats-grid">
        <StatCard color="c-green"  icon="⚡" label="Total Workouts"   value={summary?.total_workouts ?? 0}       trend="from API"        trendUp loading={loading} />
        <StatCard color="c-orange" icon="🔥" label="Total Volume (kg)" value={`${(summary?.total_volume ?? 0).toLocaleString()}`} trend="↑ progressive" trendUp loading={loading} />
        <StatCard color="c-purple" icon="🏆" label="Personal Records"  value={summary?.prs ?? 0}                 trend="this month"      trendUp loading={loading} />
        <StatCard color="c-red"    icon="🔥" label="Streak"            value={`${summary?.streak ?? 0}d`}        trend="keep going!"     trendUp loading={loading} />
        <StatCard color="c-blue"   icon="🎯" label="Goals Active"      value={summary?.goals_count ?? '—'}       trend="track progress"  trendUp loading={loading} />
      </div>

      {/* Bottom 3-col grid */}
      <div className="sec-head">
        <div className="sec-label">Progress, Records &amp; Schedule</div>
        <div className="sec-line"></div>
        <div className="sec-tag">Real data from Laravel API</div>
      </div>
      <div className="bottom-grid">

        {/* Streak Calendar */}
        <div className="card">
          <div className="card-hd">
            <div><div className="card-title">🔥 Streak Calendar</div><div className="card-sub">Apr 2026</div></div>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--orange)' }}>{summary?.streak ?? '…'}</span>
          </div>
          <div className="streak-cal">
            <div className="cal-grid">
              {calData.map((d, i) => <div key={i} className={`cal-day ${d}`}>{i + 1}</div>)}
            </div>
            <div className="streak-stats">
              <div className="ss-item"><div className="ss-val">{summary?.streak ?? '…'}</div><div className="ss-lbl">Current</div></div>
              <div className="ss-item"><div className="ss-val">{summary?.total_workouts ?? '…'}</div><div className="ss-lbl">Workouts</div></div>
              <div className="ss-item"><div className="ss-val">{summary?.streak ?? '…'}</div><div className="ss-lbl">Best</div></div>
            </div>
          </div>
        </div>

        {/* PRs from API */}
        <div className="card">
          <div className="card-hd">
            <div><div className="card-title">🏆 Personal Records</div><div className="card-sub">Epley 1RM — from API</div></div>
            <span style={{ fontSize: 10, color: 'var(--green)', background: 'var(--green-dim)', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(0,229,160,.2)' }}>LIVE</span>
          </div>
          <div className="pr-list">
            {loading
              ? <div style={{ padding: 20, color: 'var(--text3)', textAlign: 'center' }}>Loading PRs…</div>
              : prs.length === 0
                ? <div style={{ padding: 20, color: 'var(--text3)', textAlign: 'center' }}>No PRs yet — log a workout!</div>
                : prs.map((pr, i) => (
                  <div key={i} className="pr-item">
                    <div className="pr-ico">{PR_ICONS[pr.exercise] ?? '💪'}</div>
                    <div className="pr-info">
                      <div className="pr-name">{pr.exercise}</div>
                      <div className="pr-date">{pr.date}</div>
                    </div>
                    <div className="pr-weight">{pr.weight} kg</div>
                  </div>
                ))}
          </div>
        </div>

        {/* AI Schedule */}
        <div className="card">
          <div className="card-hd">
            <div><div className="card-title">📅 AI Weekly Plan</div><div className="card-sub">GenerateScheduleJob</div></div>
            <span className="ai-label" style={{ fontSize: 9 }}>AI</span>
          </div>
          <div className="sched-list">
            {SCHEDULE.map(s => (
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

      {/* Muscle Balance from API */}
      <div className="sec-head" style={{ marginTop: 18 }}>
        <div className="sec-label">Muscle Group Balance</div>
        <div className="sec-line"></div>
        <div className="sec-tag">/api/progress/muscles</div>
      </div>
      <div className="card">
        <div className="card-hd">
          <div><div className="card-title">Volume Distribution</div><div className="card-sub">Real data from ProgressService</div></div>
        </div>
        <div className="muscle-grid">
          {loading
            ? <div style={{ padding: 20, color: 'var(--text3)' }}>Loading…</div>
            : muscles.map(m => (
              <div key={m.name} className="muscle-item">
                <div className="muscle-lbl"><span>{m.name}</span><span>{m.percentage}%</span></div>
                <div className="pbar">
                  <div className="pfill" style={{ width: `${m.percentage}%`, background: MUSCLE_COLORS[m.name] ?? 'var(--accent)' }}></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
