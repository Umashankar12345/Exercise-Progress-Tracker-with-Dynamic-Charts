import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Brain, Clock, Loader2, Dumbbell, Flame, Apple } from 'lucide-react';
import api, { getBackendHost } from '../api/axios';
import useStore from '../store/useStore';

export default function AIChat() {
  const { user } = useStore();
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I am Jarvis, your AI Athletics Coach. Ask me to design a workout plan, structure progressive overload, or calculate nutrition targets!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim() || isSending) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    if (!textToSend) setChatInput('');
    setIsSending(true);

    // Add a placeholder message for the AI response
    setMessages(prev => [...prev, { role: 'bot', text: '' }]);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${getBackendHost()}/api/ai/jarvis/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (!data.message) {
        throw new Error('No AI reply');
      }

      setMessages(prev => {
        const newMsgs = [...prev];
        const lastIdx = newMsgs.length - 1;
        if (newMsgs[lastIdx] && newMsgs[lastIdx].role === 'bot') {
          newMsgs[lastIdx] = {
            ...newMsgs[lastIdx],
            text: data.message
          };
        }
        return newMsgs;
      });
    } catch (err) {
      console.error(err);
      const errMsg = "Sorry, I'm having trouble connecting right now.";
      setMessages(prev => {
        const newMsgs = [...prev];
        const lastIdx = newMsgs.length - 1;
        if (newMsgs[lastIdx] && newMsgs[lastIdx].role === 'bot') {
          newMsgs[lastIdx] = {
            ...newMsgs[lastIdx],
            text: errMsg
          };
        }
        return newMsgs;
      });
    } finally {
      setIsSending(false);
    }
  };

  const PRESETS = [
    { text: 'Create chest workout', icon: Dumbbell, label: 'Chest Workout' },
    { text: 'How do I overload squats?', icon: Flame, label: 'Squat Overload' },
    { text: 'What is my recovery diet?', icon: Apple, label: 'Diet Plan' },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto h-[calc(100vh-120px)] pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-surface-container to-transparent border border-outline-variant flex items-center justify-between relative overflow-hidden group">
        <Brain className="absolute -top-10 -right-10 w-48 h-48 text-primary/5 group-hover:rotate-12 transition-transform duration-1000" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-2xl shadow-primary/40">
            <Bot className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight uppercase">Jarvis AI Coach</h1>
            <p className="text-xs text-secondary font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Dynamic Training Intelligence Active
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden min-h-0">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'bot' && (
                <div className="w-8 h-8 bg-surface-bright border border-outline-variant rounded-lg flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-surface-bright text-white border border-outline-variant/60 rounded-tl-none font-medium'
              }`}>
                {msg.text.split('\n').map((line, lIdx) => (
                  <p key={lIdx} className="mb-1 last:mb-0">{line}</p>
                ))}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-surface-bright border border-outline-variant rounded-lg flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
              <div className="bg-surface-bright border border-outline-variant/60 p-4 rounded-2xl rounded-tl-none text-xs text-on-surface-variant font-medium animate-pulse">
                Jarvis is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Preset suggestions */}
        {messages.length === 1 && (
          <div className="px-6 py-4 border-t border-outline-variant bg-black/10 flex flex-wrap gap-3">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(p.text)}
                className="flex items-center gap-2 px-3 py-2 bg-surface-bright border border-outline-variant hover:border-primary/40 rounded-xl text-xs font-bold text-on-surface hover:text-white transition-all"
              >
                <p.icon className="w-3.5 h-3.5 text-primary" />
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form 
          onSubmit={e => { e.preventDefault(); handleSendMessage(); }}
          className="p-4 bg-surface-bright border-t border-outline-variant"
        >
          <div className="relative">
            <input 
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={isSending ? "Jarvis is analyzing..." : "Ask anything (e.g. Create chest workout)..."}
              disabled={isSending}
              className="w-full bg-surface-container border border-outline-variant rounded-xl py-3.5 pl-4 pr-12 text-sm text-on-surface focus:outline-none focus:border-primary transition-all font-medium disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isSending || !chatInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
