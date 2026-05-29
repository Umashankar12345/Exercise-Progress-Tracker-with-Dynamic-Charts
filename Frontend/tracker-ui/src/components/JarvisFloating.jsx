import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, Send, Loader2, X, Dumbbell, Flame, Apple, Activity,
  Moon, Droplets, Minimize2, Maximize2
} from 'lucide-react';
import { getBackendHost } from '../api/axios';
import useStore from '../store/useStore';

const PRESETS = [
  { text: 'Create a chest workout plan', icon: Dumbbell },
  { text: 'How do I improve my sleep recovery?', icon: Moon },
  { text: 'Analyze my hydration levels', icon: Droplets },
  { text: 'What are my weak muscle groups?', icon: Activity },
];

export default function JarvisFloating() {
  const { user } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: `Hi${user?.name ? ` ${user.name.split(' ')[0]}` : ''}! I'm Jarvis, your AI fitness coach. Ask me anything about your workouts, recovery, nutrition, or training plan.` }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || isSending) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    if (!textToSend) setInput('');
    setIsSending(true);
    setMessages(prev => [...prev, { role: 'bot', text: '', loading: true }]);
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
      setMessages(prev => {
        const msgs = [...prev];
        if (msgs[msgs.length - 1]?.role === 'bot')
          msgs[msgs.length - 1] = { role: 'bot', text: data.message || "I couldn't generate a response." };
        return msgs;
      });
    } catch {
      setMessages(prev => {
        const msgs = [...prev];
        if (msgs[msgs.length - 1]?.role === 'bot')
          msgs[msgs.length - 1] = { role: 'bot', text: "Connection error. Please try again." };
        return msgs;
      });
    } finally {
      setIsSending(false);
    }
  };

  const panelW = isExpanded ? 'w-[480px]' : 'w-[370px]';
  const panelH = isExpanded ? 'h-[620px]' : 'h-[500px]';

  return (
    <>
      {/* ── Floating Button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[9998] flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', boxShadow: '0 8px 40px rgba(124,58,237,0.45), 0 0 0 1px rgba(124,58,237,0.3)' }}
        >
          <div className="relative shrink-0">
            <span className="absolute inset-0 w-8 h-8 rounded-full bg-white/20 animate-ping" />
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/30 flex items-center justify-center relative z-10">
              <Bot className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white text-xs font-black uppercase tracking-widest leading-none">Jarvis</span>
            <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest leading-none mt-0.5">AI Coach</span>
          </div>
        </button>
      )}

      {/* ── Chat Panel ── */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] ${panelW} ${panelH} flex flex-col rounded-3xl overflow-hidden transition-all duration-300`}
          style={{
            background: 'linear-gradient(180deg, #0D1322 0%, #090F1D 100%)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.25)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0"
            style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.18) 0%, rgba(79,70,229,0.08) 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-[#7C3AED] flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00F5A0] border-2 border-[#090F1D]">
                  <span className="absolute inset-0 rounded-full bg-[#00F5A0] animate-ping opacity-60" />
                </span>
              </div>
              <div>
                <p className="text-sm font-black text-white tracking-wide">Jarvis AI Coach</p>
                <p className="text-[9px] text-[#00F5A0] font-bold uppercase tracking-widest">Online · Ready</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsExpanded(e => !e)}
                title={isExpanded ? 'Minimize' : 'Expand'}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.07] flex items-center justify-center text-[#64748B] hover:text-white transition-all"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/[0.07] hover:border-red-500/25 flex items-center justify-center text-[#64748B] hover:text-red-400 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3"
            ref={scrollRef}
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/25 flex items-center justify-center shrink-0 mt-0.5">
                    {msg.loading
                      ? <Loader2 className="w-3 h-3 text-[#7C3AED] animate-spin" />
                      : <Bot className="w-3 h-3 text-[#7C3AED]" />}
                  </div>
                )}
                <div className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-medium max-w-[82%] ${
                  msg.role === 'user'
                    ? 'bg-[#7C3AED] text-white rounded-tr-sm shadow-[0_4px_16px_rgba(124,58,237,0.3)]'
                    : 'bg-white/[0.04] text-[#CBD5E1] border border-white/[0.07] rounded-tl-sm'
                }`}>
                  {msg.loading ? (
                    <span className="flex items-center gap-1.5 py-0.5">
                      {[0, 150, 300].map((d, di) => (
                        <span key={di} className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </span>
                  ) : msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-[#94A3B8]">
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Presets — only on first message */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 grid grid-cols-2 gap-1.5 shrink-0">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(p.text)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.025] border border-white/[0.07] hover:border-[#7C3AED]/35 hover:bg-[#7C3AED]/8 transition-all text-left group"
                >
                  <p.icon className="w-3 h-3 text-[#7C3AED] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-bold text-[#475569] group-hover:text-[#94A3B8] uppercase tracking-widest leading-tight transition-colors truncate">
                    {p.text.slice(0, 22)}…
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-white/[0.06] bg-black/20 shrink-0">
            <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={isSending ? 'Thinking…' : 'Ask Jarvis anything…'}
                disabled={isSending}
                className="flex-1 bg-white/[0.04] border border-white/[0.08] focus:border-[#7C3AED]/45 rounded-xl py-2.5 px-4 text-xs text-white placeholder-[#334155] focus:outline-none transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="w-9 h-9 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 shrink-0 shadow-[0_0_14px_rgba(124,58,237,0.35)]"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
