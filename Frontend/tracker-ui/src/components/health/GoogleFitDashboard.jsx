import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  RefreshCw, 
  Footprints, 
  Heart, 
  Flame, 
  Moon, 
  Zap, 
  Smartphone, 
  Radio 
} from 'lucide-react';
import { 
  connectGoogleFit, 
  getDailySteps, 
  getHeartRate, 
  getCalories, 
  getSleepData, 
  syncWearables 
} from '../../services/googleFitService';
import { getEcho } from '../../lib/echo';
import useStore from '../../store/useStore';

export default function GoogleFitDashboard() {
  const { user } = useStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [steps, setSteps] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [calories, setCalories] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [recoveryScore, setRecoveryScore] = useState(0);
  const [wsLogs, setWsLogs] = useState([]);

  // Calculate local recovery preview
  const calculateLocalRecovery = (sl, st, hr) => {
    let score = 100;
    if (sl < 6) score -= 20;
    if (hr > 95) score -= 15;
    if (st > 15000) score -= 10;
    return Math.max(score, 0);
  };

  const handleConnect = async () => {
    setIsSyncing(true);
    try {
      const ok = await connectGoogleFit();
      if (ok) {
        setIsConnected(true);
        // Load initial mock values
        const s = await getDailySteps();
        const h = await getHeartRate();
        const c = await getCalories();
        const sl = await getSleepData();

        setSteps(s);
        setHeartRate(h);
        setCalories(c);
        setSleep(sl);
        setRecoveryScore(calculateLocalRecovery(sl, s, h));
        
        // Log locally
        addLog("SYSTEM", "Authorized Google Fit successfully.");
      }
    } catch (e) {
      addLog("ERROR", "Failed to connect to Google Fit.");
    } finally {
      setIsSyncing(false);
    }
  };

  const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setWsLogs(prev => [{ timestamp, type, message }, ...prev].slice(0, 8));
  };

  const handleSync = async () => {
    if (!isConnected) return;
    setIsSyncing(true);
    addLog("API_POST", "Posting telemetry to Laravel Backend...");
    try {
      // Get fresh data
      const s = await getDailySteps();
      const h = await getHeartRate();
      const c = await getCalories();
      const sl = await getSleepData();

      setSteps(s);
      setHeartRate(h);
      setCalories(c);
      setSleep(sl);
      setRecoveryScore(calculateLocalRecovery(sl, s, h));

      const payload = { steps: s, heartRate: h, calories: c, sleep: sl };
      const response = await syncWearables(payload);
      
      if (response.data?.success) {
        addLog("SUCCESS", `Database Sync Ok! Steps: ${s}, Heart Rate: ${h} bpm`);
      }
    } catch (e) {
      addLog("ERROR", "API Sync failed. Ensure server is online.");
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Set up Reverb WebSocket listener
  useEffect(() => {
    const echo = getEcho();
    if (echo && user) {
      addLog("WS_CONN", "Listening on private channel 'fitness-live'...");
      echo.channel('fitness-live')
        .listen('.WEARABLE_UPDATED', (event) => {
          console.log('[Google Fit Sync WS] Received:', event);
          addLog("WS_EVENT", `WEARABLE_UPDATED: user_id=${event.payload?.user_id}, steps=${event.payload?.steps}`);
        });

      return () => {
        echo.leave('fitness-live');
      };
    }
  }, [user]);

  // Determine pulse speed based on heart rate
  const getHeartPulseSpeed = () => {
    if (heartRate > 90) return 'animate-[ping_0.6s_infinite]';
    return 'animate-[ping_1.2s_infinite]';
  };

  return (
    <div className="w-full text-white bg-gradient-to-br from-[#0F172A] to-[#1E293B]/70 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#22D3EE]/30 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#22D3EE]/10 border border-[#22D3EE]/20 rounded-xl">
            <Smartphone className="w-5 h-5 text-[#22D3EE]" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-white">Google Fit Connection</h4>
            <span className="text-[9px] font-bold text-[#00F5FF]/70 uppercase tracking-widest block mt-0.5">
              Wearable Synchronizer
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="text-[9px] uppercase tracking-widest font-black text-v2-soft-gray">
            {isConnected ? 'Sync Active' : 'Disconnected'}
          </span>
        </div>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center p-8 bg-black/40 border border-dashed border-white/5 rounded-2xl text-center">
          <Smartphone className="w-12 h-12 text-white/20 mb-3" />
          <p className="text-xs text-gray-300 font-bold max-w-xs leading-relaxed mb-4">
            Link your Google Fit cloud profile to synchronize daily activity telemetry with AI diagnostic systems.
          </p>
          <button
            onClick={handleConnect}
            disabled={isSyncing}
            className="px-6 py-2.5 bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-cyan-500/10 flex items-center gap-2"
          >
            {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
            Authorize Google Fit
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Steps */}
            <div className="bg-black/25 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-2">
                <Footprints className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Daily Steps</span>
              <span className="text-lg font-black text-emerald-400 mt-1">{steps.toLocaleString()}</span>
            </div>

            {/* Heart Rate */}
            <div className="bg-black/25 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center relative">
              <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg mb-2 relative">
                <Heart className={`w-4 h-4 text-red-400 absolute ${getHeartPulseSpeed()}`} />
                <Heart className="w-4 h-4 text-red-400 relative" />
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Heart Rate</span>
              <span className="text-lg font-black text-red-400 mt-1">{heartRate} <span className="text-[10px] font-normal text-gray-400">bpm</span></span>
            </div>

            {/* Calories */}
            <div className="bg-black/25 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center">
              <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg mb-2">
                <Flame className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Cal</span>
              <span className="text-lg font-black text-orange-400 mt-1">{calories} <span className="text-[10px] font-normal text-gray-400">kcal</span></span>
            </div>

            {/* Sleep */}
            <div className="bg-black/25 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center">
              <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg mb-2">
                <Moon className="w-4 h-4 text-purple-400 animate-pulse" />
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sleep Hours</span>
              <span className="text-lg font-black text-purple-400 mt-1">{sleep} <span className="text-[10px] font-normal text-gray-400">hrs</span></span>
            </div>
          </div>

          {/* Recovery Score Hud */}
          <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 flex items-center justify-center relative">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">AI Readiness Level</span>
                <p className="text-xs font-bold text-gray-200 mt-0.5">Vitals analyzed. Recovery score calculated.</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">{recoveryScore}%</span>
              <span className="text-[8px] block font-medium uppercase tracking-widest text-emerald-400/70">Primed</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex-1 py-3 bg-gradient-to-r from-[#22D3EE] to-cyan-500 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Synchronizing...' : 'Sync Telemetry Now'}
            </button>
            <button
              onClick={() => setIsConnected(false)}
              className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {/* WebSocket Vitals Log Feed */}
      <div className="mt-5 border-t border-white/5 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#00F5FF]">Telemetric Sync Feed</span>
        </div>
        <div className="h-28 overflow-y-auto bg-black/45 border border-white/5 rounded-lg p-2.5 font-mono text-[9px] space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
          {wsLogs.length === 0 ? (
            <span className="text-white/20 block text-center py-6 italic">Feed awaiting sync activations...</span>
          ) : (
            wsLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-gray-500">[{log.timestamp}]</span>
                <span className={`font-bold ${
                  log.type === 'SUCCESS' ? 'text-green-400' :
                  log.type === 'API_POST' ? 'text-yellow-400' :
                  log.type === 'WS_EVENT' ? 'text-purple-400' :
                  log.type === 'ERROR' ? 'text-red-400' : 'text-cyan-400'
                }`}>
                  {log.type}:
                </span>
                <span className="text-gray-300">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
