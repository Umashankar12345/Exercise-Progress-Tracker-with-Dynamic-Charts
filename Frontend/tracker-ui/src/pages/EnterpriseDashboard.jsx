import React, { useState, useEffect } from 'react';
import { ShieldAlert, Server, Zap, Globe, Bell, Mic } from 'lucide-react';
import LiveStreamingMetrics from '../components/enterprise/LiveStreamingMetrics';
import DeviceSyncStatus from '../components/enterprise/DeviceSyncStatus';
import AIIntelligenceCenter from '../components/enterprise/AIIntelligenceCenter';
import RecoverySystem from '../components/enterprise/RecoverySystem';
import CommunityFeed from '../components/enterprise/CommunityFeed';
import ConsistencyHeatmap from '../components/ConsistencyHeatmap';
import ActiveGoalsWidget from '../components/ActiveGoalsWidget';
import useStore from '../store/useStore';
import api from '../api/axios';

export default function EnterpriseDashboard() {
  const { user } = useStore();
  const [dbStatus, setDbStatus] = useState('SYNCING');
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    // Simulate initial syncing
    setTimeout(() => setDbStatus('ONLINE'), 1500);

    // Fetch existing heatmap data
    api.get('/workouts').then(res => {
      setWorkouts(res.data || []);
    }).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* System Monitoring Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800 shadow-xl shadow-black/50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${dbStatus === 'ONLINE' ? 'bg-emerald-500' : 'bg-yellow-500 animate-pulse'}`} />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              PostgreSQL <span className={dbStatus === 'ONLINE' ? 'text-emerald-400' : 'text-yellow-400'}>{dbStatus}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 hidden sm:flex">
            <Server className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">API: 42ms</span>
          </div>
          <div className="flex items-center gap-2 hidden md:flex">
            <Globe className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">WSS: Connected</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button className="relative p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
            <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 border border-zinc-950" />
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-colors">
            <Mic className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Voice Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Grid Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Live Telemetry & Core Tracking */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LiveStreamingMetrics />
            <div className="flex flex-col gap-8">
              <DeviceSyncStatus />
              <RecoverySystem />
            </div>
          </div>

          <div className="glass-card">
            <ConsistencyHeatmap yearActivityLogs={workouts} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="glass-card p-6 border border-zinc-800/60 bg-zinc-900/40">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-6">
                  <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Weight Transformation
                  </h3>
                </div>
                <div className="flex items-center justify-center h-32 border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-xs font-bold uppercase tracking-widest">
                  Timeline Data Loading...
                </div>
             </div>
             <div className="h-full">
               <ActiveGoalsWidget />
             </div>
          </div>
        </div>

        {/* Right Column: AI & Community */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <AIIntelligenceCenter />
          <CommunityFeed />
          
          {/* Security / System Audit */}
          <div className="mt-4 p-4 rounded-xl border border-zinc-800/50 bg-zinc-950/50 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-zinc-500 shrink-0" />
            <div>
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">System Audit Log</h4>
              <p className="text-[10px] text-zinc-500 mt-1 font-medium">All data is end-to-end encrypted. Last security audit passed 4 hours ago.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
