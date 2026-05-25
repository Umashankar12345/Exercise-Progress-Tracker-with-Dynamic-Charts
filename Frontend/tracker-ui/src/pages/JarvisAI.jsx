import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, Send, Sparkles, Brain, Loader2, Dumbbell, Flame, Apple,
  Zap, TrendingUp, AlertCircle, Clock, Lightbulb, CheckCircle2,
  Droplets, Moon, Activity, X, RefreshCw, Target
} from 'lucide-react';
import api, { getBackendHost } from '../api/axios';
import useStore from '../store/useStore';

const INSIGHT_ICONS = {
  progressive_overload: { icon: TrendingUp, color: '#00F5A0', bg: 'rgba(0,245,160,0.08)', border: 'rgba(0,245,160,0.2)', label: 'Progressive Overload' },
  imbalance:           { icon: AlertCircle, color: '#FBBF24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', label: 'Muscle Imbalance' },
  recovery:            { icon: Moon,        color: '#818CF8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.2)', label: 'Recovery & Fatigue' },
  hydration:           { icon: Droplets,    color: '#38BDF8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)', label: 'Hydration' },
  nutrition:           { icon: Apple,       color: '#4ADE80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)', label: 'Nutrition' },
};

const PRESETS = [
  { text: 'Create a chest workout plan for me', icon: Dumbbell, label: 'Chest Workout' },
  { text: 'How do I increase squat strength?', icon: Flame, label: 'Strength Tips' },
  { text: 'What should I eat for recovery?', icon: Apple, label: 'Recovery Diet' },
  { text: 'Analyze my current fitness trends', icon: Activity, label: 'My Trends' },
];

export default function JarvisAI() {
  const { user } = useStore();
  const [messages, setMessages] = useState([
    { role: 'bot', text: `Hello${user?.name ? ` ${user.name.split(' ')[0]}` : ''}! I'm **Jarvis**, your personal AI fitness coach. I have access to your real workout and health data. Ask me anything — from creating workout plans to analyzing your recovery, sleep, or hydration.`, time: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [insights, setInsights] = useState([]);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'insights'
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (user) fetchInsights();
  }, [user]);

  const fetchInsights = async () => {
    try {
      setInsightsLoading(true);
      const { data } = await api.get('/insights');
      setInsights(Array.isArray(data) ? data : []);
    } catch (err) {
      setInsights([]);
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleReAnalyze = async () => {
    try {
      setReanalyzing(true);
      await api.post('/ai/insights/generate');
      await fetchInsights();
    } catch (err) {
      await fetchInsights();
    } finally {
      setReanalyzing(false);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await api.post(`/insights/${id}/read`);
      setInsights(prev => prev.map(i => i.id === id ? { ...i, is_read: true } : i));
    } catch (_) {}
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim() || isSending) return;
    const now = new Date();
    setMessages(prev => [...prev, { role: 'user', text, time: now }]);
    if (!textToSend) setChatInput('');
    setIsSending(true);
    setMessages(prev => [...prev, { role: 'bot', text: '', time: new Date(), loading: true }]);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${getBackendHost()}/api/ai/jarvis/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (!data.message) throw new Error('No reply');
      setMessages(prev => {
        const msgs = [...prev];
        const last = msgs[msgs.length - 1];
        if (last?.role === 'bot') msgs[msgs.length - 1] = { role: 'bot', text: data.message, time: new Date() };
        return msgs;
      });
    } catch {
      setMessages(prev => {
        const msgs = [...prev];
        const last = msgs[msgs.length - 1];
        if (last?.role === 'bot') msgs[msgs.length - 1] = { role: 'bot', text: "Sorry, I'm having trouble connecting right now. Please check your connection and try again.", time: new Date() };
        return msgs;
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (date) => date ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  const renderMessage = (text) => {
    // Basic markdown: **bold**
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
  };

  const unreadCount = insights.filter(i => !i.is_read).length;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-6xl mx-auto gap-0">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 pb-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.5)]">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00F5A0] border-2 border-[#060B16] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-ping absolute" />
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Jarvis AI Coach</h1>
            <p className="text-xs text-[#00F5A0] font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-pulse" />
              Powered by your real fitness data
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-2xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 ${
              activeTab === 'chat'
                ? 'bg-[#7C3AED] text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            Chat
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 relative ${
              activeTab === 'insights'
                ? 'bg-[#7C3AED] text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" />
            AI Insights
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 min-h-0 rounded-3xl border border-white/5 bg-[#0B1120]/80 backdrop-blur-xl overflow-hidden flex flex-col shadow-[0_8px_60px_rgba(0,0,0,0.6)]">

        {/* ──── CHAT TAB ──── */}
        {activeTab === 'chat' && (
          <div className="flex-1 min-h-0 flex flex-col">
            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5" ref={scrollRef}
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
              
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'bot' && (
                    <div className="w-9 h-9 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center shrink-0 mt-0.5">
                      {msg.loading ? (
                        <Loader2 className="w-4 h-4 text-[#7C3AED] animate-spin" />
                      ) : (
                        <Bot className="w-4 h-4 text-[#7C3AED]" />
                      )}
                    </div>
                  )}

                  <div className={`flex flex-col gap-1 max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3.5 rounded-2xl text-sm leading-relaxed font-medium ${
                      msg.role === 'user'
                        ? 'bg-[#7C3AED] text-white rounded-tr-sm shadow-[0_4px_20px_rgba(124,58,237,0.3)]'
                        : 'bg-white/[0.04] text-[#E2E8F0] border border-white/8 rounded-tl-sm'
                    }`}>
                      {msg.loading ? (
                        <span className="flex items-center gap-2 text-[#94A3B8]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: renderMessage(msg.text) }} />
                      )}
                    </div>
                    <span className="text-[9px] text-[#475569] font-medium px-1">{formatTime(msg.time)}</span>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black text-white">
                      {user?.name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Preset Quick Actions — only show at start */}
            {messages.length === 1 && (
              <div className="px-6 pb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(p.text)}
                    className="flex flex-col items-start gap-1.5 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/8 hover:bg-[#7C3AED]/10 hover:border-[#7C3AED]/30 transition-all duration-200 group text-left"
                  >
                    <p.icon className="w-4 h-4 text-[#7C3AED] group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest group-hover:text-white transition-colors">{p.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={isSending ? 'Jarvis is thinking...' : 'Ask Jarvis anything about your fitness…'}
                  disabled={isSending}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#7C3AED]/50 rounded-2xl py-4 pl-5 pr-16 text-sm text-white placeholder-[#475569] focus:outline-none transition-all font-medium disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSending || !chatInput.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[9px] text-center text-[#334155] mt-2 font-bold uppercase tracking-widest">
                Jarvis uses your real workout &amp; health data for context
              </p>
            </div>
          </div>
        )}

        {/* ──── INSIGHTS TAB ──── */}
        {activeTab === 'insights' && (
          <div className="flex-1 min-h-0 flex flex-col">
            {/* Insights Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#7C3AED]" />
                <span className="text-sm font-black text-white uppercase tracking-widest">AI Analysis</span>
                {!insightsLoading && (
                  <span className="text-[9px] font-black text-[#475569] uppercase tracking-widest ml-2">
                    {insights.length} insight{insights.length !== 1 ? 's' : ''} • {unreadCount} unread
                  </span>
                )}
              </div>
              <button
                onClick={handleReAnalyze}
                disabled={reanalyzing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 border border-[#7C3AED]/20 text-[#7C3AED] text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${reanalyzing ? 'animate-spin' : ''}`} />
                {reanalyzing ? 'Analyzing...' : 'Re-Analyze'}
              </button>
            </div>

            {/* Insights List */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
              
              {insightsLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
                  <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" />
                  <p className="text-sm text-[#475569] font-medium">Analyzing your fitness data...</p>
                </div>
              ) : insights.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                  <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-[#7C3AED] opacity-40" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-white">No Insights Yet</p>
                    <p className="text-xs text-[#475569] mt-1 max-w-xs">Log a few workouts and health metrics, then click Re-Analyze to generate your personalized insights.</p>
                  </div>
                  <button
                    onClick={handleReAnalyze}
                    disabled={reanalyzing}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7C3AED] text-white text-xs font-black uppercase tracking-widest hover:bg-[#6D28D9] transition-all disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4" />
                    Generate My Insights
                  </button>
                </div>
              ) : (
                insights.map((item) => {
                  const cfg = INSIGHT_ICONS[item.type] || { icon: Lightbulb, color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)', label: 'Training Insight' };
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={item.id}
                      className={`group relative flex gap-4 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${
                        item.is_read ? 'opacity-40' : ''
                      }`}
                      style={{ background: cfg.bg, borderColor: cfg.border }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: cfg.color }}>
                            {cfg.label}
                          </span>
                          <span className="text-[9px] text-[#475569] font-medium">
                            {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-[#CBD5E1] leading-relaxed font-medium">{item.content}</p>
                        {!item.is_read && (
                          <button
                            onClick={() => handleDismiss(item.id)}
                            className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors hover:underline"
                            style={{ color: cfg.color }}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Mark as Read
                          </button>
                        )}
                      </div>
                      {!item.is_read && (
                        <span className="absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse" style={{ background: cfg.color }} />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom CTA */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              <button
                onClick={() => setActiveTab('chat')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.03] border border-white/8 text-[#94A3B8] hover:text-white hover:bg-white/[0.06] text-xs font-black uppercase tracking-widest transition-all"
              >
                <Bot className="w-4 h-4" />
                Ask Jarvis about these insights
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
