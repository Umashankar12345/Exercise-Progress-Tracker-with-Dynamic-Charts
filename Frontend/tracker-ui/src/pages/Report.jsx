import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FileBarChart, Download, Share2, TrendingUp, TrendingDown, Target, 
  Activity, Zap, FileText, Loader2, Heart, Clock, Wifi, Sparkles, 
  CheckCircle2, Lock, ChevronRight, MessageSquare, Flame 
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import CountUp from 'react-countup';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis,
  Tooltip, ResponsiveContainer,
  CartesianGrid
} from 'recharts';

// Helper: Animated counter component using react-countup
function AnimatedCounter({ end, suffix = "" }) {
  return <CountUp start={0} end={Number(end) || 0} duration={1.8} separator="," suffix={suffix} />;
}

// Helper: Typewriter text scanner effect with blinking cursor
function Typewriter({ text, speed = 15 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    let index = 0;
    if (!text) return;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span>
      {displayedText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-[#00E5FF] font-bold ml-0.5`}>|</span>
    </span>
  );
}

// Helper: Dual-phase AI Summary component (Scanning + Typewriter)
function AISummary({ text }) {
  const [scanning, setScanning] = useState(true);
  const [scanText, setScanText] = useState('Syncing active telemetry...');

  useEffect(() => {
    const phrases = [
      'Syncing active telemetry...',
      'Analyzing progressive overload velocity...',
      'Correlating heart rate zones with volume...',
      'Generating biomechanical predictions...'
    ];
    let phraseIdx = 0;
    
    const textInterval = setInterval(() => {
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setScanText(phrases[phraseIdx]);
    }, 700);

    const scanTimeout = setTimeout(() => {
      setScanning(false);
      clearInterval(textInterval);
    }, 2800);

    return () => {
      clearInterval(textInterval);
      clearTimeout(scanTimeout);
    };
  }, [text]);

  if (scanning) {
    return (
      <div className="relative min-h-[120px] flex flex-col justify-center items-center py-6 px-4 bg-black/45 rounded-xl border border-[#00E5FF]/20 overflow-hidden">
        {/* Scanning Laser Line */}
        <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent animate-scan" />
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00E5FF]/10 flex items-center justify-center border border-[#00E5FF]/30 animate-pulse">
            <Activity className="w-5 h-5 text-[#00E5FF]" />
          </div>
          <span className="text-xs font-black tracking-widest text-[#00E5FF] uppercase animate-pulse">{scanText}</span>
        </div>
      </div>
    );
  }

  return (
    <p className="text-v2-soft-gray font-medium leading-relaxed">
      <Typewriter text={text} />
    </p>
  );
}

export default function Report() {
  const location = useLocation();
  const [summary, setSummary] = useState(null);
  const [prs, setPrs] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [weeklyCalories, setWeeklyCalories] = useState([]);
  const [recoveryHistory, setRecoveryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // PDF Export HUD Progress States
  const [exportProgress, setExportProgress] = useState(0);
  const [exportPhase, setExportPhase] = useState('idle'); // 'idle' | 'preparing' | 'capturing' | 'compiling' | 'success'

  // Real-time HUD states
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pulseBpm, setPulseBpm] = useState(72);
  const [syncLatency, setSyncLatency] = useState(14);
  const [activeRecommendation, setActiveRecommendation] = useState(0);
  
  const [networkFeed, setNetworkFeed] = useState([
    { id: 1, text: "Marcus J. completed Bench Press PR (95kg)!", time: "Just now" },
    { id: 2, text: "Sarah K. started a Live Running session.", time: "2m ago" },
    { id: 3, text: "Dave T. joined Summer Endurance Challenge.", time: "5m ago" },
    { id: 4, text: "Elena M. logged 1,200 calories burned today.", time: "12m ago" }
  ]);

  // Rotational advice listings
  const recommendations = [
    "AI Suggestion: Increase cardio by 15 mins to accelerate your fat-burning cycle.",
    "AI Predicts: You are on track to achieve a 100kg squat by mid-June.",
    "AI Recovery Tip: Sleep depth was suboptimal. Rest 5 mins longer between sets today.",
    "Nutrition Coach: Target 140g protein today to optimize muscle protein synthesis."
  ];

  // Dynamic scrolling feed updates
  const sampleFeed = [
    "Sophia G. joined the Summer Endurance Challenge!",
    "Alex M. logged a 45-minute HIIT workout split.",
    "David L. achieved a new Deadlift PR (180kg)!",
    "Chloe P. completed the 10,000 steps daily target.",
    "James R. started a Live Heatmap Session in Zone 4.",
    "Isabella T. completed Day 4 of Push Hypertrophy."
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [sRes, pRes, progressRes, analyticsRes, healthRes] = await Promise.all([
          api.get('/progress/summary'),
          api.get('/prs'),
          api.get('/progress?range=30d'),
          api.get('/workout-analytics'),
          api.get('/body-metrics')
        ]);
        
        setSummary(sRes.data);
        setPrs(pRes.data || []);
        setProgressData(progressRes.data || []);
        
        if (analyticsRes.data && analyticsRes.data.weekly) {
          setWeeklyCalories(analyticsRes.data.weekly);
        }
        
        if (healthRes.data && healthRes.data.history) {
          const mapped = healthRes.data.history.map(h => {
            const sleep = h.sleep_hours ?? 7.0;
            const stress = h.stress_level ?? 30;
            let score = (sleep / 8.0) * 100 - (stress * 0.2);
            score = Math.max(20, Math.min(100, Math.round(score)));
            return {
              date: h.date,
              sleep,
              stress,
              recovery: score
            };
          });
          setRecoveryHistory(mapped);
        }
      } catch (err) {
        console.error("Failed to load report metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Sync timers
  useEffect(() => {
    // 1s clock
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Telemetry updates
    const telemetryTimer = setInterval(() => {
      setPulseBpm((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(68, Math.min(138, prev + delta));
      });
      setSyncLatency((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(10, Math.min(28, prev + delta));
      });
    }, 2000);

    // AI tips rotation
    const rotationTimer = setInterval(() => {
      setActiveRecommendation(prev => (prev + 1) % recommendations.length);
    }, 6000);

    // Scrolling feed ticker
    const feedTimer = setInterval(() => {
      setNetworkFeed(prev => {
        const newMsg = sampleFeed[Math.floor(Math.random() * sampleFeed.length)];
        const newItem = {
          id: Date.now(),
          text: newMsg,
          time: "Just now"
        };
        const updated = prev.map(item => ({
          ...item,
          time: item.time === "Just now" ? "1m ago" : item.time
        }));
        return [newItem, ...updated.slice(0, 3)];
      });
    }, 7000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(telemetryTimer);
      clearInterval(rotationTimer);
      clearInterval(feedTimer);
    };
  }, []);

  useEffect(() => {
    if (!loading && summary) {
      const params = new URLSearchParams(location.search);
      if (params.get('action') === 'export') {
        handleExportPDF();
      }
    }
  }, [loading, summary, location.search]);

  const handleExportPDF = async () => {
    try {
      setExportPhase('preparing');
      setExportProgress(15);
      await new Promise(r => setTimeout(r, 400));

      setExportPhase('capturing');
      setExportProgress(45);
      
      const report = document.getElementById('monthly-report');
      if (!report) {
        toast.error('Report container not found.');
        setExportPhase('idle');
        return;
      }

      await new Promise(r => setTimeout(r, 400));
      setExportProgress(75);
      setExportPhase('compiling');

      const canvas = await html2canvas(report, {
        backgroundColor: '#070B14',
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: 1200
      });

      if (!canvas.width || !canvas.height) {
        throw new Error("Render canvas width/height is invalid.");
      }

      setExportProgress(90);
      await new Promise(r => setTimeout(r, 400));
      
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
      await new Promise(r => setTimeout(r, 800));

      pdf.save(`FitTrack_Monthly_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      // Confetti burst
      confetti({
        particleCount: 180,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#8B5CF6', '#10B981', '#EC4899']
      });

      toast.success('PDF report downloaded successfully!');
    } catch (err) {
      console.error('[FitTrack PDF Export Error]:', err);
      toast.error(`Export Failed: ${err.message || 'Unknown error'}`);
    } finally {
      setExportPhase('idle');
      setExportProgress(0);
    }
  };

  const shareTextOnly = async (text, toastId) => {
    try {
      if (navigator.share) {
        toast.dismiss(toastId);
        await navigator.share({
          title: "FitTrack AI Report",
          text: text,
          url: window.location.href
        });
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Report link copied to clipboard!", { id: toastId });
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        toast.dismiss(toastId);
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard!", { id: toastId });
        } catch (clipErr) {
          toast.error("Copy failed", { id: toastId });
        }
      }
    }
  };

  const shareReport = async () => {
    const toastId = toast.loading("Compiling report image...");
    const summaryText = `Check out my monthly fitness report on FitTrack AI:\n- Sessions: ${summary?.total_workouts || 0}\n- Total Lifted: ${(summary?.total_volume || 0).toLocaleString()} kg\n- PRs hit: ${summary?.prs || 0}`;
    
    try {
      const report = document.getElementById('monthly-report');
      if (!report) throw new Error("Report element not found");

      const canvas = await html2canvas(report, {
        backgroundColor: '#070B14',
        scale: 1.2, // slightly lower scale to prevent mobile device memory limits
        useCORS: true,
        logging: false
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          shareTextOnly(summaryText, toastId);
          return;
        }
        
        const file = new File([blob], 'FitTrack_Report.png', { type: 'image/png' });

        try {
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            toast.dismiss(toastId);
            await navigator.share({
              files: [file],
              title: "FitTrack AI Report",
              text: summaryText
            });
            toast.success("Shared successfully!");
          } else {
            shareTextOnly(summaryText, toastId);
          }
        } catch (shareErr) {
          // Browser failed to share file (e.g. activation expired or platform limit), fallback to text
          console.warn("[FitTrack Share Warning]: File share failed, falling back to text:", shareErr);
          shareTextOnly(summaryText, toastId);
        }
      }, 'image/png');

    } catch (err) {
      console.error(err);
      shareTextOnly(summaryText, toastId);
    }
  };

  const hasWorkouts = summary?.total_workouts > 0;

  const stats = [
    { label: 'Total Volume', value: summary?.total_volume || 0, suffix: ' kg', trend: '+12.4%', up: true },
    { label: 'Sessions Logged', value: summary?.total_workouts || 0, suffix: '', trend: '+2', up: true },
    { label: 'New PRs', value: summary?.prs || 0, suffix: '', trend: '+5', up: true },
  ];

  // Dynamic Chart Fallbacks
  const volumeChartData = progressData.length > 0 ? progressData.map(d => ({
    name: d.date || 'Active',
    volume: d.volume || 0
  })) : [
    { name: 'Wk 1', volume: 240 },
    { name: 'Wk 2', volume: 480 },
    { name: 'Wk 3', volume: 720 },
    { name: 'Wk 4', volume: 960 },
  ];

  const prChartData = prs.length > 0 ? prs.map(p => ({
    name: p.exercise?.substring(0, 10) || 'PR',
    weight: p.weight || 0
  })) : [
    { name: 'Bench', weight: 85 },
    { name: 'Squat', weight: 110 },
    { name: 'Deadlift', weight: 140 },
    { name: 'Press', weight: 55 },
  ];

  const caloriesChartData = weeklyCalories.length > 0 ? weeklyCalories.map(w => ({
    name: w.day || 'Day',
    kcal: w.calories || 0
  })) : [
    { name: 'Mon', kcal: 320 },
    { name: 'Tue', kcal: 450 },
    { name: 'Wed', kcal: 180 },
    { name: 'Thu', kcal: 500 },
    { name: 'Fri', kcal: 620 },
    { name: 'Sat', kcal: 300 },
    { name: 'Sun', kcal: 400 },
  ];

  const recoveryChartData = recoveryHistory.length > 0 ? recoveryHistory.map(h => ({
    name: h.date ? new Date(h.date).toLocaleDateString(undefined, { weekday: 'short' }) : 'Day',
    score: h.recovery || 70
  })) : [
    { name: 'Mon', score: 78 },
    { name: 'Tue', score: 82 },
    { name: 'Wed', score: 85 },
    { name: 'Thu', score: 68 },
    { name: 'Fri', score: 74 },
    { name: 'Sat', score: 90 },
    { name: 'Sun', score: 88 },
  ];

  // 30-day calendar consistency dataset
  const generateHeatmapGrid = () => {
    const grid = [];
    const now = new Date();
    for (let i = 34; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const isWorkoutDay = d.getDay() === 1 || d.getDay() === 3 || d.getDay() === 5;
      const intensity = isWorkoutDay ? Math.floor(Math.random() * 3) + 1 : 0;
      grid.push({
        date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        intensity
      });
    }
    return grid;
  };
  const heatmapData = generateHeatmapGrid();

  // Onboarding checklists for empty states
  const onboardingSteps = [
    { id: 1, title: "Body Metrics Linked", desc: "Circadian patterns, step targets, and BMI fully calibrated.", completed: true },
    { id: 2, title: "AI Diet Configured", desc: "Custom macronutrient forecasting actively locked.", completed: true },
    { id: 3, title: "First Telemetry Workout", desc: "Log a training session on the telemetry hud.", completed: false, active: true },
    { id: 4, title: "Unlock Analytics Matrix", desc: "Progressive overload charts and PR trend logs.", completed: false }
  ];

  // Dynamic heart bpm pulse animation speed
  const getHeartPulseSpeed = () => {
    if (pulseBpm > 110) return '0.4s';
    if (pulseBpm > 85) return '0.7s';
    return '1.1s';
  };

  const getExportStatusMessage = () => {
    switch (exportPhase) {
      case 'preparing': return 'Initializing PDF compiler engines...';
      case 'capturing': return 'Capturing high-resolution layout grids...';
      case 'compiling': return 'Rendering interactive Recharts layers...';
      case 'success': return 'Compression complete! Downloading report...';
      default: return 'Processing...';
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
    <div className="cyber-grid w-full min-h-screen bg-[#050816] py-8 relative">
      
      {/* HUD Progress Export Modal */}
      <AnimatePresence>
        {exportPhase !== 'idle' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-md px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#0F172A]/90 border border-[#00E5FF]/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.2)] text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent animate-scan" />
              
              <div className="w-16 h-16 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Sparkles className="w-8 h-8 text-[#00E5FF]" />
              </div>
              
              <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Compiling Athlete Report</h3>
              <p className="text-v2-soft-gray text-xs mb-6 font-bold uppercase tracking-widest animate-pulse">{getExportStatusMessage()}</p>
              
              {/* Progress track bar */}
              <div className="w-full h-2.5 bg-white/5 border border-white/10 rounded-full overflow-hidden mb-3 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${exportProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(0,229,255,0.5)]"
                />
              </div>
              <span className="text-[10px] font-mono text-[#00E5FF] font-black">{exportProgress}% COMPLETE</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        id="monthly-report" 
        className="flex flex-col gap-8 max-w-5xl mx-auto p-6 bg-[#070B14] rounded-3xl border border-white/5 shadow-2xl relative z-10"
      >
        {/* Futuristic Top Telemetry Status Bar */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 text-[10px] font-mono text-gray-400 relative z-10" data-html2canvas-ignore>
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">SYSTEM STATE:</span>
            <span className="text-emerald-400 font-bold uppercase">Cloud Connected</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold">SYNC TIMING:</span>
            <span className="text-cyan-400 font-bold">{syncLatency}ms</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Heart 
              className="w-3.5 h-3.5 text-red-500 fill-red-500" 
              style={{ animation: `ping ${getHeartPulseSpeed()} infinite` }}
            />
            <span className="font-bold">LIVE TELEMETRY:</span>
            <span className="text-red-400 font-bold">{pulseBpm} BPM</span>
          </div>
          <div className="flex items-center gap-2.5 justify-end">
            <Clock className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
            <span className="text-purple-300 font-bold">{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Report Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-[#0F172A]/80 border border-white/5 shadow-lg backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED] opacity-10 blur-[80px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center border border-[#7C3AED]/30 shadow-[0_0_15px_rgba(124,58,237,0.1)]">
              <FileBarChart className="w-10 h-10 text-[#7C3AED]" />
            </div>
            <div>
              {/* branding for PDF exports */}
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-[#00E5FF]/20 border border-[#00E5FF]/30 text-[#00E5FF] text-[8px] font-black uppercase rounded tracking-widest animate-pulse">FitTrack AI Operating System</span>
                <span className="text-gray-500 text-[8px] font-mono font-bold">REPORT SEC_ID: #{Math.floor(Math.random()*900000+100000)}</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Monthly Performance Report</h1>
              <p className="text-v2-soft-gray font-semibold text-xs mt-1.5">Compiled May 24, 2026 · Automated Intelligence Node</p>
            </div>
          </div>
          <div className="flex gap-3 relative z-10" data-html2canvas-ignore>
            <button 
              onClick={shareReport}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/10 transition-all text-white cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              SHARE
            </button>
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-black animate-bounce" />
              EXPORT PDF
            </button>
          </div>
        </div>

        {/* Rotating Live AI Tip HUD Bar */}
        <div className="w-full p-4 bg-gradient-to-r from-[#7C3AED]/10 via-[#00E5FF]/5 to-transparent border border-[#7C3AED]/20 rounded-2xl flex items-center justify-between gap-4 overflow-hidden relative z-10" data-html2canvas-ignore>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] animate-pulse" />
            </div>
            <div className="overflow-hidden h-5 flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeRecommendation}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-semibold text-white tracking-wide truncate"
                >
                  {recommendations[activeRecommendation]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <span className="text-[8px] font-mono font-black text-[#00E5FF] shrink-0 uppercase tracking-widest animate-pulse">Live Coaching Advice</span>
        </div>

        {!hasWorkouts ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            {/* Step-by-Step Onboarding Checklist (Left) */}
            <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#070B14] border border-[#00E5FF]/20 p-8 shadow-[0_0_40px_rgba(0,229,255,0.04)] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#00E5FF] opacity-5 blur-[100px] rounded-full pointer-events-none" />
              
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#00E5FF]" />
                  Athlete Calibration Checklist
                </h3>
                <p className="text-v2-soft-gray text-xs leading-normal font-medium">Complete steps to compile progressive overload metrics and activate biometric tracking.</p>
              </div>

              <div className="flex flex-col gap-4 relative">
                {onboardingSteps.map((step) => (
                  <div 
                    key={step.id} 
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                      step.completed 
                        ? 'bg-emerald-950/15 border-emerald-500/20' 
                        : step.active 
                          ? 'bg-[#00E5FF]/5 border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.05)] animate-pulse'
                          : 'bg-black/20 border-white/5 opacity-50'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {step.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : step.active ? (
                        <div className="w-5 h-5 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className={`text-xs font-black uppercase tracking-wider ${step.completed ? 'text-emerald-400' : 'text-white'}`}>
                          {step.title}
                        </span>
                        {step.completed && <span className="text-[8px] font-mono text-emerald-500 font-bold uppercase tracking-wider">DONE</span>}
                      </div>
                      <p className="text-v2-soft-gray text-[10px] leading-relaxed font-bold">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black uppercase tracking-widest text-xs shadow-lg shadow-[#00E5FF]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  START TELEMETRY STREAM
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AI Onboarding Suggestions Sidebar (Right) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* AI Coaching Bubble */}
              <div className="rounded-3xl border border-[#7C3AED]/20 bg-[#7C3AED]/5 p-6 relative overflow-hidden group/coach hover:border-[#7C3AED]/40 transition-colors">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#7C3AED] opacity-15 blur-xl rounded-full" />
                <h4 className="text-xs font-black uppercase tracking-widest text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                  Coach AI Guidance
                </h4>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-v2-soft-gray leading-relaxed font-bold">
                  "Integrating biometrics is standard protocol. I recommend recording a <span className="text-[#00E5FF]">20-minute Zone 3 cardiovascular run</span> split on the telemetry map first to align heart rate parameters."
                </div>
              </div>

              {/* Static Pro insight block */}
              <div className="p-8 rounded-3xl bg-gradient-to-tr from-[#7C3AED] to-[#5B21B6] text-white space-y-4 shadow-2xl shadow-[#7C3AED]/30">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/70">Telemetry Calibration</h4>
                <p className="text-sm font-bold leading-relaxed">
                  Real-time movement trackers classify and capture sets, reps, and GPS routes dynamically. Run splits to begin database compilation.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* High Level Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
              {stats.map((s, i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-6 space-y-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-white/10 hover:bg-[#0F172A]/70 hover:-translate-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-v2-soft-gray uppercase tracking-widest">{s.label}</span>
                    <div className={`flex items-center gap-1 text-[10px] font-black ${s.up ? 'text-[#22C55E]' : 'text-red-400'}`}>
                      {s.trend}
                      {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white tracking-tight">
                    <AnimatedCounter end={s.value} suffix={s.suffix} />
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.up ? 'bg-[#22C55E]' : 'bg-red-400'}`} style={{ width: '75%' }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              {/* Left & Center Main Dashboard Area */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* AI Executive Summary Card */}
                <div className="rounded-2xl border border-[#7C3AED]/25 bg-[#0F172A]/50 overflow-hidden shadow-lg backdrop-blur-xl animate-neon-glow-purple">
                  <div className="p-6 border-b border-white/5 bg-gradient-to-r from-[#7C3AED]/5 to-transparent flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#7C3AED]" />
                      AI Executive Summary
                    </h3>
                    <span className="px-2 py-0.5 bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#7C3AED] text-[8px] font-mono font-black uppercase rounded tracking-widest">Active Compiler</span>
                  </div>
                  <div className="p-8 space-y-6">
                    <AISummary text="Your performance in May indicates a significant shift towards high-intensity training. Volume increased by 12.4% while training frequency slightly decreased, suggesting higher efficiency per session. Rest discipline remains key for maximizing next month's progressive overload gains." />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-2xl bg-black/35 border border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-[#22C55E] uppercase tracking-widest">
                          <Zap className="w-4 h-4 animate-bounce" />
                          Key Strength Gains
                        </div>
                        <ul className="space-y-2">
                          <li className="flex justify-between text-xs font-bold text-v2-soft-gray">
                            <span>Bench Press</span>
                            <span className="text-[#22C55E] font-black">+7.5 kg</span>
                          </li>
                          <li className="flex justify-between text-xs font-bold text-v2-soft-gray">
                            <span>Back Squat</span>
                            <span className="text-[#22C55E] font-black">+15 kg</span>
                          </li>
                        </ul>
                      </div>
                      <div className="p-5 rounded-2xl bg-black/35 border border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-[#00E5FF] uppercase tracking-widest font-bold">
                          <Activity className="w-4 h-4 animate-pulse" />
                          Focus Areas for June
                        </div>
                        <ul className="space-y-2">
                          <li className="text-xs font-bold text-white">· Increase pull volume</li>
                          <li className="text-xs font-bold text-white">· Improve rest discipline</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workout Consistency Heatmap Card */}
                <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-6 space-y-4 shadow-lg backdrop-blur-xl hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-white mb-0.5">Workout Consistency Map</h3>
                      <p className="text-[9px] font-medium text-v2-soft-gray uppercase tracking-widest">Workout intensities for the past 35 days</p>
                    </div>
                    <div className="flex items-center gap-2 text-[8px] font-mono font-bold text-gray-500 uppercase">
                      <span>Rest</span>
                      <div className="w-2.5 h-2.5 rounded bg-[#1e293b] border border-white/5" />
                      <div className="w-2.5 h-2.5 rounded bg-[#0e7490]" />
                      <div className="w-2.5 h-2.5 rounded bg-[#06b6d4]" />
                      <div className="w-2.5 h-2.5 rounded bg-[#22d3ee] shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                      <span>Peak</span>
                    </div>
                  </div>

                  <div className="w-full flex justify-center py-2">
                    <div className="grid grid-cols-7 gap-2.5 max-w-sm mx-auto">
                      {heatmapData.map((day, idx) => {
                        let cellBg = 'bg-[#1e293b] border-white/5';
                        if (day.intensity === 1) cellBg = 'bg-[#0e7490] border-[#0e7490]/40';
                        if (day.intensity === 2) cellBg = 'bg-[#06b6d4] border-[#06b6d4]/40';
                        if (day.intensity === 3) cellBg = 'bg-[#22d3ee] border-[#22d3ee]/50 shadow-[0_0_8px_rgba(34,211,238,0.4)]';

                        return (
                          <div 
                            key={idx}
                            title={`${day.date}: ${day.intensity === 0 ? 'Rest day' : `Intensity level ${day.intensity}`}`}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-[9px] font-mono font-black text-white/40 cursor-pointer hover:scale-110 active:scale-95 transition-all ${cellBg}`}
                          >
                            {day.date.split(' ')[1]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Four interactive charts grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Chart 1: Workout Volume */}
                  <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-6 space-y-4 shadow-lg backdrop-blur-xl hover:border-white/10 transition-colors min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase tracking-widest text-white">Workout Volume Trend</h3>
                      <span className="text-[9px] text-[#8B5CF6] font-bold uppercase tracking-widest">Volume (kg)</span>
                    </div>
                    <div className="w-full h-[180px] mt-2">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <AreaChart data={volumeChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(139,92,246,0.3)', borderRadius: '12px' }}
                            labelStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#8B5CF6', fontSize: '11px' }}
                          />
                          <Area type="monotone" dataKey="volume" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: PR History */}
                  <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-6 space-y-4 shadow-lg backdrop-blur-xl hover:border-white/10 transition-colors min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase tracking-widest text-white">PR Progression</h3>
                      <span className="text-[9px] text-[#00E5FF] font-bold uppercase tracking-widest">Max Weight</span>
                    </div>
                    <div className="w-full h-[180px] mt-2">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <LineChart data={prChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(0,229,255,0.3)', borderRadius: '12px' }}
                            labelStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#00E5FF', fontSize: '11px' }}
                          />
                          <Line type="monotone" dataKey="weight" stroke="#00E5FF" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#070B14' }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 3: Calories Trend */}
                  <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-6 space-y-4 shadow-lg backdrop-blur-xl hover:border-white/10 transition-colors min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase tracking-widest text-white">Active Calories Burn</h3>
                      <span className="text-[9px] text-[#EF4444] font-bold uppercase tracking-widest">Kcal Expended</span>
                    </div>
                    <div className="w-full h-[180px] mt-2">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart data={caloriesChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(239,68,68,0.3)', borderRadius: '12px' }}
                            labelStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#EF4444', fontSize: '11px' }}
                          />
                          <Bar dataKey="kcal" fill="#EF4444" radius={[4, 4, 0, 0]} opacity={0.8} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 4: Recovery Analytics */}
                  <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-6 space-y-4 shadow-lg backdrop-blur-xl hover:border-white/10 transition-colors min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase tracking-widest text-white">Recovery Index</h3>
                      <span className="text-[9px] text-[#10B981] font-bold uppercase tracking-widest">Score %</span>
                    </div>
                    <div className="w-full h-[180px] mt-2">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <AreaChart data={recoveryChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRecovery" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(16,185,129,0.3)', borderRadius: '12px' }}
                            labelStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#10B981', fontSize: '11px' }}
                          />
                          <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRecovery)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                {/* Performance Logs list */}
                <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 shadow-lg backdrop-blur-xl">
                  <div className="p-6 border-b border-white/5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">Recent Performance Logs</h3>
                  </div>
                  <div className="p-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-4 rounded-xl hover:bg-white/5 flex items-center justify-between group transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-black/20 rounded-lg border border-white/5">
                            <FileText className="w-4 h-4 text-v2-soft-gray" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">Full Analytics Report · Week {i}</div>
                            <div className="text-[10px] font-bold text-v2-soft-gray uppercase tracking-widest">Generated May {10 + i * 5}, 2026</div>
                          </div>
                        </div>
                        <button className="text-xs font-black text-[#00E5FF] hover:underline cursor-pointer">VIEW</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar Area */}
              <div className="space-y-8">
                
                {/* Goal Velocity Card */}
                <div className="rounded-2xl border border-[#00E5FF]/25 bg-[#00E5FF]/5 p-8 space-y-6 relative overflow-hidden shadow-[0_0_25px_rgba(0,229,255,0.1)] hover:shadow-[0_0_35px_rgba(0,229,255,0.2)] transition-all duration-300 group/goal animate-neon-glow-cyan">
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#00E5FF] opacity-10 blur-xl rounded-full group-hover/goal:opacity-20 transition-opacity animate-pulse" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white relative z-10">Monthly Goal Velocity</h3>
                  <div className="flex flex-col items-center justify-center py-6 gap-2 relative z-10">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - 0.78)} className="text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-black text-white">78%</span>
                        <span className="text-[9px] font-bold text-v2-soft-gray uppercase tracking-tighter">Velocity</span>
                      </div>
                    </div>
                    <p className="text-center text-xs font-semibold text-v2-soft-gray max-w-[180px] mt-2">
                      You are on track to hit your <span className="text-[#00E5FF] font-black">95kg Bench</span> goal by mid-June.
                    </p>
                  </div>
                </div>

                {/* Real-time Network Feed Ticker (Sidebar) */}
                <div className="rounded-2xl border border-white/5 bg-[#0F172A]/50 p-6 space-y-4 shadow-lg backdrop-blur-xl" data-html2canvas-ignore>
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-cyan-400" />
                      Live Network Feed
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase">Live Stream</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 max-h-[220px] overflow-hidden relative">
                    <AnimatePresence initial={false}>
                      {networkFeed.map((item) => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, x: -10, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: 'auto' }}
                          exit={{ opacity: 0, scale: 0.9, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-3 bg-black/20 border border-white/5 rounded-xl flex flex-col gap-1 overflow-hidden"
                        >
                          <span className="text-[10px] text-white/90 leading-snug font-semibold">{item.text}</span>
                          <span className="text-[8px] text-[#00E5FF] font-black uppercase tracking-wider">{item.time}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Static Pro insight block */}
                <div className="p-8 rounded-3xl bg-gradient-to-tr from-[#7C3AED] to-[#5B21B6] text-white space-y-4 shadow-2xl shadow-[#7C3AED]/30">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white/70">Pro Insight</h4>
                  <p className="text-sm font-bold leading-relaxed">
                    Consistently hitting 90% of your planned volume has put you in the top 5% of athletes in your weight category.
                  </p>
                  <div className="pt-2">
                    <button className="w-full py-3 bg-white text-[#7C3AED] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/90 transition-all cursor-pointer">
                      GO PRO ANALYTICS
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
