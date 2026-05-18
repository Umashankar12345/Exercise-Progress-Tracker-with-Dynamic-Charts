import React, { useEffect, useState } from 'react';
import { FileBarChart, Download, Share2, TrendingUp, TrendingDown, Target, Activity, Zap, FileText, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Report() {
  const [summary, setSummary] = useState(null);
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [sRes, pRes] = await Promise.all([
          api.get('/progress/summary'),
          api.get('/prs')
        ]);
        setSummary(sRes.data);
        setPrs(pRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const drawChartToCanvas = (data) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Background gradient: sleek dark premium card theme
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#121318');
    bgGrad.addColorStop(1, '#0e0f12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Padding & graph size
    const padding = { top: 40, right: 30, bottom: 40, left: 60 };
    const graphWidth = canvas.width - padding.left - padding.right;
    const graphHeight = canvas.height - padding.top - padding.bottom;
    
    if (!data || data.length === 0) {
      ctx.fillStyle = '#9ca3af';
      ctx.font = '600 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No progress data available for this month.', canvas.width / 2, canvas.height / 2);
      return canvas.toDataURL('image/png');
    }
    
    const volumes = data.map(d => d.volume);
    const maxVol = Math.max(...volumes, 100);
    const minVol = Math.min(...volumes, 0);
    
    const getX = (index) => padding.left + (index / (data.length - 1 || 1)) * graphWidth;
    const getY = (value) => padding.top + graphHeight - ((value - minVol) / (maxVol - minVol || 1)) * graphHeight;
    
    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const yVal = minVol + (i / gridLines) * (maxVol - minVol);
      const y = getY(yVal);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(canvas.width - padding.right, y);
      ctx.stroke();
      
      // Label y-axis
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '500 10px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.round(yVal)} kg`, padding.left - 10, y + 3);
    }
    
    // Axis labels (X)
    data.forEach((d, idx) => {
      if (idx === 0 || idx === data.length - 1 || (data.length > 5 && idx === Math.floor(data.length / 2))) {
        const x = getX(idx);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '500 10px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(d.date || '', x, canvas.height - 15);
      }
    });
    
    // Draw the area fill under line
    ctx.beginPath();
    data.forEach((d, idx) => {
      const x = getX(idx);
      const y = getY(d.volume);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(getX(data.length - 1), getY(minVol));
    ctx.lineTo(getX(0), getY(minVol));
    ctx.closePath();
    
    const areaGrad = ctx.createLinearGradient(0, padding.top, 0, canvas.height - padding.bottom);
    areaGrad.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
    areaGrad.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
    ctx.fillStyle = areaGrad;
    ctx.fill();
    
    // Draw line
    ctx.beginPath();
    data.forEach((d, idx) => {
      const x = getX(idx);
      const y = getY(d.volume);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    
    // Dots
    data.forEach((d, idx) => {
      const x = getX(idx);
      const y = getY(d.volume);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });
    
    return canvas.toDataURL('image/png');
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      toast.loading('Generating your premium PDF report...', { id: 'pdf-toast' });
      
      // 1. Fetch progress data
      let progressData = [];
      try {
        const response = await api.get('/progress?range=30d');
        progressData = response.data || [];
      } catch (err) {
        console.error("Failed to fetch progress data", err);
      }

      // 2. Draw chart to base64
      const chartBase64 = drawChartToCanvas(progressData);

      // 3. Request report from PDF backend passing chart
      const response = await api.post('/reports/monthly', {
        chart: chartBase64
      }, { 
        responseType: 'blob' 
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Monthly-Performance-Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success('PDF report downloaded! Copy sent via email.', { id: 'pdf-toast' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to export PDF report', { id: 'pdf-toast' });
    } finally {
      setExporting(false);
    }
  };

  const stats = [
    { label: 'Total Volume', value: summary?.total_volume ? `${summary.total_volume.toLocaleString()} kg` : '0 kg', trend: '+12.4%', up: true },
    { label: 'Sessions', value: summary?.total_workouts ?? 0, trend: '+2', up: true },
    { label: 'New PRs', value: summary?.prs ?? 0, trend: '+5', up: true },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-surface-container border border-outline-variant">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center">
            <FileBarChart className="w-10 h-10 text-tertiary" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-on-surface tracking-tighter uppercase">Monthly Performance Report</h1>
            <p className="text-on-surface-variant font-medium">May 2026 · Compiled by FitTrack AI</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl text-xs font-black uppercase tracking-widest hover:border-primary/50 transition-all text-on-surface">
            <Share2 className="w-4 h-4" />
            SHARE
          </button>
          <button 
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            EXPORT PDF
          </button>
        </div>
      </div>

      {/* High Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="glass-card p-6 space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{s.label}</span>
              <div className={`flex items-center gap-1 text-[10px] font-black ${s.up ? 'text-secondary' : 'text-red-400'}`}>
                {s.trend}
                {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              </div>
            </div>
            <div className="text-2xl font-black text-on-surface tracking-tight">{s.value}</div>
            <div className="h-1 w-full bg-surface-bright rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${s.up ? 'bg-secondary' : 'bg-red-400'}`} style={{ width: '70%' }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Deep Dive Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-outline-variant bg-gradient-to-r from-tertiary/5 to-transparent">
              <h3 className="text-sm font-black uppercase tracking-widest text-on-surface flex items-center gap-2">
                <Target className="w-4 h-4 text-tertiary" />
                AI Executive Summary
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-on-surface-variant font-medium leading-relaxed">
                Your performance in May indicates a significant shift towards high-intensity training. 
                Volume increased by <span className="text-on-surface font-bold">12.4%</span> while training frequency slightly decreased, 
                suggesting higher efficiency per session.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-surface-bright border border-outline-variant space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-widest">
                    <Zap className="w-4 h-4" />
                    Key Strength Gains
                  </div>
                  <ul className="space-y-2">
                    <li className="flex justify-between text-xs font-bold text-on-surface-variant">
                      <span>Bench Press</span>
                      <span className="text-secondary">+7.5 kg</span>
                    </li>
                    <li className="flex justify-between text-xs font-bold text-on-surface-variant">
                      <span>Back Squat</span>
                      <span className="text-secondary">+15 kg</span>
                    </li>
                  </ul>
                </div>
                <div className="p-5 rounded-2xl bg-surface-bright border border-outline-variant space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                    <Activity className="w-4 h-4" />
                    Focus Areas for June
                  </div>
                  <ul className="space-y-2">
                    <li className="text-xs font-bold text-on-surface">· Increase pull volume</li>
                    <li className="text-xs font-bold text-on-surface">· Improve rest discipline</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="p-6 border-b border-outline-variant">
              <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Recent Performance Logs</h3>
            </div>
            <div className="p-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 rounded-xl hover:bg-surface-bright flex items-center justify-between group transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-surface-bright rounded-lg border border-outline-variant">
                      <FileText className="w-4 h-4 text-on-surface-variant" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-on-surface">Full Analytics Report · Week {i}</div>
                      <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Generated May {10 + i * 5}, 2026</div>
                    </div>
                  </div>
                  <button className="text-xs font-black text-primary hover:underline">VIEW</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Goal Tracking */}
        <div className="space-y-8">
          <div className="glass-card p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Monthly Goal Velocity</h3>
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-surface-bright" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - 0.78)} className="text-secondary" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-on-surface">78%</span>
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter">Velocity</span>
                </div>
              </div>
              <p className="text-center text-xs font-medium text-on-surface-variant max-w-[180px]">
                You are on track to hit your <span className="text-secondary">95kg Bench</span> goal by mid-June.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-primary text-white space-y-4 shadow-2xl shadow-primary/30">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/70">Pro Insight</h4>
            <p className="text-sm font-bold leading-relaxed">
              Consistently hitting 90% of your planned volume has put you in the top 5% of athletes in your weight category.
            </p>
            <div className="pt-2">
              <button className="w-full py-3 bg-white text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/90 transition-all">
                GO PRO ANALYTICS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
