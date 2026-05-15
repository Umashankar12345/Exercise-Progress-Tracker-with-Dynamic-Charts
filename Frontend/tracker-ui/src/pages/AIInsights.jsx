import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Zap, 
  Brain, 
  MessageSquare, 
  Send, 
  History, 
  Cpu, 
  Lightbulb, 
  AlertCircle,
  TrendingUp,
  Clock,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useAIInsights } from '../hooks/useAIInsights';
import useStore from '../store/useStore';

const INSIGHT_TYPE_MAP = {
  tip:     { color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20', icon: Lightbulb },
  warning: { color: 'text-tertiary',  bg: 'bg-tertiary/10',  border: 'border-tertiary/20',  icon: AlertCircle },
  alert:   { color: 'text-red-400',   bg: 'bg-red-500/10',   border: 'border-red-500/20',   icon: AlertCircle },
};

export default function AIInsights() {
  const { user } = useStore();
  const { insights, recommendation, status, generatedAt } = useAIInsights(user?.id);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I've analyzed your recent chest session. Would you like to know how it impacts your weekly goal?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMessage = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', { message: userMessage });
      setMessages(prev => [...prev, { role: 'bot', text: response.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to my knowledge base right now." }]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Header with Engine Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-surface-container to-transparent border border-outline-variant relative overflow-hidden group">
        <Cpu className="absolute -top-10 -right-10 w-48 h-48 text-primary/5 group-hover:rotate-12 transition-transform duration-1000" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40">
            <Brain className="text-white w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">AI Coach Intelligence</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Claude 3.5 Engine Active
              </div>
              <span className="text-outline-variant text-xs">|</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant">
                <Clock className="w-3.5 h-3.5" />
                Updated {generatedAt ? new Date(generatedAt).toLocaleTimeString() : 'Recently'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 relative z-10">
          <div className="px-5 py-3 bg-surface-bright rounded-2xl border border-outline-variant flex flex-col">
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Analysis Depth</span>
            <span className="text-sm font-bold text-on-surface">Precision High</span>
          </div>
          <div className="px-5 py-3 bg-surface-bright rounded-2xl border border-outline-variant flex flex-col">
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Data Points</span>
            <span className="text-sm font-bold text-on-surface">1.2k Sessions</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Insight Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Zap className="w-5 h-5 text-tertiary" />
              Latest Training Analysis
            </h2>
            <button className="text-xs font-bold text-primary hover:underline">Mark all as read</button>
          </div>

          <div className="space-y-4">
            {insights.length === 0 ? (
              <div className="p-12 text-center glass-card space-y-4">
                <Bot className="w-12 h-12 text-on-surface-variant mx-auto opacity-20" />
                <p className="text-on-surface-variant font-medium">No insights generated yet. Log your first workout to trigger analysis.</p>
              </div>
            ) : (
              insights.map((item, i) => {
                const config = INSIGHT_TYPE_MAP[item.type] || INSIGHT_TYPE_MAP.tip;
                const Icon = config.icon;
                return (
                  <div 
                    key={i} 
                    className={`glass-card p-6 border-l-4 ${config.border.replace('border-', 'border-l-')} hover:translate-x-1 transition-all duration-300 group`}
                  >
                    <div className="flex gap-4">
                      <div className={`p-3 rounded-xl ${config.bg} h-fit`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                            {item.type} · Insight #{i+1}
                          </span>
                          <span className="text-[10px] font-medium text-on-surface-variant">2 hours ago</span>
                        </div>
                        <p 
                          className="text-on-surface font-medium leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: item.text }}
                        />
                        <div className="flex items-center gap-4 pt-2">
                          <button className="text-[11px] font-black text-primary uppercase tracking-widest flex items-center gap-1 group/btn">
                            Apply to Plan
                            <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                          <button className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Dismiss</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: AI Chat & Highlights */}
        <div className="space-y-8">
          
          {/* AI Chat Interface */}
          <div className="glass-card flex flex-col h-[500px] overflow-hidden">
            <div className="p-5 border-b border-outline-variant bg-surface-bright flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Chat with Coach</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-secondary font-bold">
                  <div className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
                  ONLINE
                </div>
              </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-4" ref={scrollRef}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 bg-surface-bright rounded-lg flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-surface-bright text-on-surface-variant rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-surface-bright rounded-lg flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                  <div className="bg-surface-bright p-3 rounded-2xl rounded-tl-none text-xs text-on-surface-variant font-medium animate-pulse">
                    Analyzing data...
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-surface-bright border-t border-outline-variant">
              <div className="relative">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isLoading ? "AI is thinking..." : "Ask anything..."}
                  disabled={isLoading}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl py-3 pl-4 pr-12 text-sm text-on-surface focus:outline-none focus:border-primary transition-all font-medium disabled:opacity-50"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-center text-on-surface-variant mt-3 font-bold uppercase tracking-widest opacity-50">
                Powered by Claude 3.5 Sonnet
              </p>
            </div>
          </div>

          {/* Master Recommendation */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-secondary/20 to-primary/10 border border-secondary/20 space-y-4 relative overflow-hidden">
            <Sparkles className="absolute -bottom-6 -right-6 w-24 h-24 text-secondary/10" />
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <span className="text-xs font-black text-secondary uppercase tracking-widest">Master Strategy</span>
            </div>
            <p className="text-sm font-bold text-on-surface leading-relaxed">
              {recommendation ?? "Your current split is optimal for hypertrophy. Maintain current intensity for another 2 weeks before deloading."}
            </p>
            <div className="pt-2">
              <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Confidence Score</div>
              <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[94%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
