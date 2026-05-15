import React from 'react';
import { FileBarChart, Download, Share2, TrendingUp, TrendingDown, Target, Activity, Zap, FileText } from 'lucide-react';

const STATS = [
  { label: 'Total Volume', value: '142,500 kg', trend: '+12.4%', up: true },
  { label: 'Avg Intensity', value: '84.2%', trend: '+2.1%', up: true },
  { label: 'Sessions', value: '24', trend: '-2', up: false },
  { label: 'New PRs', value: '18', trend: '+5', up: true },
];

export default function Report() {
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
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl text-xs font-black uppercase tracking-widest hover:border-primary/50 transition-all">
            <Share2 className="w-4 h-4" />
            SHARE
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
            <Download className="w-4 h-4" />
            EXPORT PDF
          </button>
        </div>
      </div>

      {/* High Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((s, i) => (
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
                    <li className="flex justify-between text-xs font-bold">
                      <span className="text-on-surface-variant">Bench Press</span>
                      <span className="text-secondary">+7.5 kg</span>
                    </li>
                    <li className="flex justify-between text-xs font-bold">
                      <span className="text-on-surface-variant">Back Squat</span>
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
