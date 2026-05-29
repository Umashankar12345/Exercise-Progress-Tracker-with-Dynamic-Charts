import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Download,
  FileBarChart,
  Target,
  Trophy,
  Droplets,
  Moon,
  Footprints,
  Dumbbell,
  Clock,
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(`${String(dateStr).slice(0, 10)}T00:00:00`);
};

const inRange = (dateStr, start, end) => {
  const d = parseLocalDate(dateStr);
  if (!d || !start || !end) return false;
  return d >= start && d <= end;
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const avg = (values) => {
  const list = values.filter((n) => Number.isFinite(n));
  if (list.length === 0) return null;
  return list.reduce((a, b) => a + b, 0) / list.length;
};

export default function Report() {
  const [exportProgress, setExportProgress] = useState(0);
  const [exportPhase, setExportPhase] = useState('idle');

  const isExporting = exportPhase !== 'idle';

  const { data: reportData, isLoading: loading } = useQuery({
    queryKey: ['monthlyReportData'],
    queryFn: async () => {
      const [progressRes, monthlyRes, prsRes, heatmapRes, healthRes, stepsRes] = await Promise.all([
        api.get('/progress/summary'),
        api.get('/reports/monthly/summary'),
        api.get('/prs'),
        api.get('/workouts/heatmap'),
        api.get('/body-metrics?range=90d'),
        api.get('/daily-steps?range=90d').catch(() => ({ data: [] })),
      ]);
      return {
        progressSummary: progressRes.data,
        monthlySummary: monthlyRes.data,
        prs: Array.isArray(prsRes.data) ? prsRes.data : [],
        workoutHeatmap: Array.isArray(heatmapRes.data) ? heatmapRes.data : [],
        healthHistory: Array.isArray(healthRes.data?.history) ? healthRes.data.history : [],
        healthLatest: healthRes.data?.latest ?? null,
        dailySteps: Array.isArray(stepsRes.data) ? stepsRes.data : []
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const progressSummary = reportData?.progressSummary;
  const monthlySummary = reportData?.monthlySummary;
  const prs = reportData?.prs || [];
  const workoutHeatmap = reportData?.workoutHeatmap || [];
  const healthHistory = reportData?.healthHistory || [];
  const healthLatest = reportData?.healthLatest || null;
  const dailySteps = reportData?.dailySteps || [];

  const period = useMemo(() => {
    const start = parseLocalDate(monthlySummary?.period?.start) ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = parseLocalDate(monthlySummary?.period?.end) ?? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    return { start, end };
  }, [monthlySummary?.period?.end, monthlySummary?.period?.start]);

  const monthLabel = monthlySummary?.month
    || new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const reportGeneratedAt = useMemo(() => {
    return new Date().toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const monthHeatmap = useMemo(() => {
    return (workoutHeatmap || [])
      .filter((e) => inRange(e.date, period.start, period.end))
      .map((e) => ({
        date: String(e.date).slice(0, 10),
        workouts: safeNumber(e.count),
        calories: safeNumber(e.calories),
      }))
      .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
  }, [period.end, period.start, workoutHeatmap]);

  const monthSteps = useMemo(() => {
    return (dailySteps || [])
      .filter((s) => inRange(s.full_date, period.start, period.end))
      .map((s) => ({
        date: String(s.full_date).slice(0, 10),
        label: s.date,
        steps: safeNumber(s.step_count),
      }))
      .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
  }, [dailySteps, period.end, period.start]);

  const monthHealth = useMemo(() => {
    return (healthHistory || [])
      .filter((h) => inRange(h.date, period.start, period.end))
      .map((h) => ({
        date: String(h.date).slice(0, 10),
        water: h.water_intake === null || h.water_intake === undefined ? null : safeNumber(h.water_intake),
        sleep: h.sleep_hours === null || h.sleep_hours === undefined ? null : safeNumber(h.sleep_hours),
        steps: h.steps === null || h.steps === undefined ? null : safeNumber(h.steps),
      }))
      .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
  }, [healthHistory, period.end, period.start]);

  const hydrationAvg = useMemo(() => {
    return avg(monthHealth.map((h) => h.water).filter((v) => v !== null));
  }, [monthHealth]);

  const sleepAvg = useMemo(() => {
    return avg(monthHealth.map((h) => h.sleep).filter((v) => v !== null));
  }, [monthHealth]);

  const stepsTotal = useMemo(() => {
    if (monthSteps.length > 0) {
      return Math.round(monthSteps.reduce((sum, d) => sum + d.steps, 0));
    }
    return Math.round(monthHealth.reduce((sum, d) => sum + (d.steps ?? 0), 0));
  }, [monthHealth, monthSteps]);

  const stepsSeries = useMemo(() => {
    if (monthSteps.length > 0) return monthSteps;
    return monthHealth.map((h) => ({
      date: h.date,
      label: new Date(`${h.date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      steps: safeNumber(h.steps ?? 0),
    }));
  }, [monthHealth, monthSteps]);

  const workoutsTotal = safeNumber(monthlySummary?.workouts?.count);
  const volumeTotal = safeNumber(monthlySummary?.workouts?.total_volume);
  const caloriesTotal = safeNumber(monthlySummary?.workouts?.total_calories);
  const avgDuration = safeNumber(monthlySummary?.workouts?.avg_duration_min);
  const prsThisMonth = safeNumber(monthlySummary?.prs?.count);

  const topPrs = useMemo(() => {
    return (prs || [])
      .slice()
      .sort((a, b) => safeNumber(b.weight) - safeNumber(a.weight))
      .slice(0, 6);
  }, [prs]);

  const reportSecurityId = useMemo(() => {
    const seed = `${workoutsTotal}|${volumeTotal}|${caloriesTotal}|${prsThisMonth}|${stepsTotal}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 1000000;
    return String(Math.abs(hash)).padStart(6, '0');
  }, [caloriesTotal, prsThisMonth, stepsTotal, volumeTotal, workoutsTotal]);

  const getExportStatusMessage = () => {
    switch (exportPhase) {
      case 'preparing': return 'Preparing report...';
      case 'capturing': return 'Capturing layout...';
      case 'compiling': return 'Generating PDF...';
      case 'success': return 'Done.';
      default: return 'Working...';
    }
  };

  const handleExportPDF = async () => {
    try {
      setExportPhase('preparing');
      setExportProgress(15);
      await new Promise(r => setTimeout(r, 250));

      setExportPhase('capturing');
      setExportProgress(45);

      const report = document.getElementById('monthly-report');
      if (!report) {
        toast.error('Report container not found.');
        setExportPhase('idle');
        return;
      }

      await new Promise(r => setTimeout(r, 250));
      setExportProgress(75);
      setExportPhase('compiling');

      const canvas = await html2canvas(report, {
        backgroundColor: '#070B14',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: 1200,
      });

      if (!canvas.width || !canvas.height) {
        throw new Error('Failed to render report canvas.');
      }

      setExportProgress(90);
      await new Promise(r => setTimeout(r, 200));

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      setExportProgress(100);
      setExportPhase('success');
      await new Promise(r => setTimeout(r, 350));

      pdf.save(`FitTrack_Monthly_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success('PDF report downloaded.');
    } catch (err) {
      console.error('[Monthly Report Export]:', err);
      toast.error(`Export failed: ${err.message || 'Unknown error'}`);
    } finally {
      setExportPhase('idle');
      setExportProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-8 max-w-5xl mx-auto p-6 md:p-8 animate-pulse">
        <div className="h-20 bg-white/5 border border-white/5 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="h-24 bg-white/5 border border-white/5 rounded-2xl" />
          <div className="h-24 bg-white/5 border border-white/5 rounded-2xl" />
          <div className="h-24 bg-white/5 border border-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#050816] py-8 relative">
      {exportPhase !== 'idle' && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="w-full max-w-md bg-[#0F172A]/90 border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.4)] text-center">
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Exporting Monthly Report</h3>
            <p className="text-slate-300 text-xs mb-6 font-semibold uppercase tracking-widest">{getExportStatusMessage()}</p>
            <div className="w-full h-2.5 bg-white/5 border border-white/10 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${exportProgress}%` }} />
            </div>
            <span className="text-[10px] font-mono text-cyan-300 font-black">{exportProgress}%</span>
          </div>
        </div>
      )}

      <div
        id="monthly-report"
        className="flex flex-col gap-8 max-w-6xl mx-auto p-6 bg-[#070B14] rounded-3xl border border-white/5 shadow-2xl relative"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-[#0F172A]/80 border border-white/5 shadow-lg">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-400/30">
              <FileBarChart className="w-8 h-8 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-[10px] font-black uppercase rounded tracking-widest">FitTrack Monthly Report</span>
                <span className="text-slate-500 text-[10px] font-mono font-bold">SEC_ID: {reportSecurityId}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">{monthLabel}</h1>
              <p className="text-slate-300 font-semibold text-xs mt-1.5">{`Generated ${reportGeneratedAt}`}</p>
            </div>
          </div>

          <div className="flex gap-3" data-html2canvas-ignore>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-70"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workouts</span>
              <Dumbbell className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="mt-3 text-3xl font-black text-white">{workoutsTotal}</div>
            <div className="mt-1 text-[11px] font-semibold text-slate-300">This month</div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Volume</span>
              <Trophy className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="mt-3 text-3xl font-black text-white">{Math.round(volumeTotal).toLocaleString()}</div>
            <div className="mt-1 text-[11px] font-semibold text-slate-300">kg lifted</div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calories</span>
              <Target className="w-4 h-4 text-rose-300" />
            </div>
            <div className="mt-3 text-3xl font-black text-white">{Math.round(caloriesTotal).toLocaleString()}</div>
            <div className="mt-1 text-[11px] font-semibold text-slate-300">kcal burned</div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Steps</span>
              <Footprints className="w-4 h-4 text-violet-300" />
            </div>
            <div className="mt-3 text-3xl font-black text-white">{stepsTotal.toLocaleString()}</div>
            <div className="mt-1 text-[11px] font-semibold text-slate-300">Logged</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#0F172A]/50 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-black uppercase tracking-widest text-white">Workouts & Calories (Month)</div>
              <div className="text-[10px] font-bold text-slate-400">{`${monthlySummary?.period?.start || ''} to ${monthlySummary?.period?.end || ''}`}</div>
            </div>
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={monthHeatmap} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.25)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.25)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(34,211,238,0.25)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="calories" stroke="#22d3ee" strokeWidth={2} fill="url(#calGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black uppercase tracking-widest text-white">Health (Month)</div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Avg</span>
              </div>
            </div>

            <div className="rounded-xl bg-black/30 border border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-violet-300" />
                <span className="text-xs font-bold text-slate-200">Sleep</span>
              </div>
              <span className="text-xs font-black text-white">{sleepAvg === null ? 'N/A' : `${sleepAvg.toFixed(1)}h`}</span>
            </div>

            <div className="rounded-xl bg-black/30 border border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-300" />
                <span className="text-xs font-bold text-slate-200">Water</span>
              </div>
              <span className="text-xs font-black text-white">{hydrationAvg === null ? 'N/A' : `${hydrationAvg.toFixed(2)}L`}</span>
            </div>

            <div className="rounded-xl bg-black/30 border border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-300" />
                <span className="text-xs font-bold text-slate-200">PRs</span>
              </div>
              <span className="text-xs font-black text-white">{prsThisMonth}</span>
            </div>

            <div className="rounded-xl bg-black/30 border border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-300" />
                <span className="text-xs font-bold text-slate-200">Avg Duration</span>
              </div>
              <span className="text-xs font-black text-white">{avgDuration ? `${avgDuration} min` : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-6">
            <div className="text-xs font-black uppercase tracking-widest text-white mb-3">Steps (Month)</div>
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={stepsSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="label" stroke="rgba(255,255,255,0.25)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.25)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(167,139,250,0.25)', borderRadius: '12px' }} />
                  <Bar dataKey="steps" fill="#a78bfa" radius={[4, 4, 0, 0]} opacity={0.9} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-6">
            <div className="text-xs font-black uppercase tracking-widest text-white mb-3">Sleep & Water (Month)</div>
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={monthHealth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.25)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.25)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(34,211,238,0.25)', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="sleep" stroke="#a78bfa" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="water" stroke="#22d3ee" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-6">
            <div className="text-xs font-black uppercase tracking-widest text-white mb-4">Top Exercises (Month)</div>
            {Array.isArray(monthlySummary?.top_exercises) && monthlySummary.top_exercises.length > 0 ? (
              <div className="space-y-3">
                {monthlySummary.top_exercises.slice(0, 6).map((ex) => (
                  <div key={ex.name} className="rounded-xl bg-black/30 border border-white/5 p-4 flex items-center justify-between">
                    <div className="text-sm font-bold text-white">{ex.name}</div>
                    <div className="text-xs font-black text-cyan-300">{safeNumber(ex.sessions)} sessions</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm font-semibold text-slate-400">No workouts recorded this month.</div>
            )}
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-6">
            <div className="text-xs font-black uppercase tracking-widest text-white mb-4">Top PRs (All Time)</div>
            {topPrs.length > 0 ? (
              <div className="space-y-3">
                {topPrs.map((p) => (
                  <div key={p.exercise} className="rounded-xl bg-black/30 border border-white/5 p-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">{p.exercise}</div>
                      <div className="text-[11px] font-semibold text-slate-400">{p.date ? new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date N/A'}</div>
                    </div>
                    <div className="text-xs font-black text-emerald-300">{safeNumber(p.weight).toFixed(1)} kg</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm font-semibold text-slate-400">No PR data yet.</div>
            )}
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-semibold flex flex-wrap gap-4 justify-between mt-4">
          <span>{`Streak: ${safeNumber(progressSummary?.streak)} day(s)`}</span>
          <span>{`Latest weight: ${healthLatest?.weight ? `${safeNumber(healthLatest.weight).toFixed(1)} kg` : 'N/A'}`}</span>
          <span>{`Latest BMI: ${healthLatest?.bmi ? safeNumber(healthLatest.bmi).toFixed(1) : 'N/A'}`}</span>
        </div>
      </div>
    </div>
  );
}
