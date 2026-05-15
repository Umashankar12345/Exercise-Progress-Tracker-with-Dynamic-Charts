import React from 'react';
import { useAIInsights } from '../hooks/useAIInsights';
import useStore from '../store/useStore';
import { Bot, Sparkles, AlertCircle, CheckCircle2, MessageSquare, ArrowRight, Calendar } from 'lucide-react';

const INSIGHT_TYPE_MAP = {
  tip:     { cls: 'border-secondary bg-secondary/5', icon: CheckCircle2, iconCls: 'text-secondary' },
  warning: { cls: 'border-tertiary bg-tertiary/5',  icon: AlertCircle, iconCls: 'text-tertiary' },
  alert:   { cls: 'border-red-500 bg-red-500/5', icon: AlertCircle, iconCls: 'text-red-500' },
};

export default function AIInsightsCard() {
  const user = useStore((s) => s.user);
  const {
    insights, recommendation, warnings,
    nextWorkout, generatedAt, status,
  } = useAIInsights(user?.id);

  if (status === 'loading') {
    return (
      <div className="glass-card overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-outline-variant flex items-center gap-3">
          <Bot className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-on-surface">AI Coach</h4>
            <div className="flex items-center gap-1.5 text-[10px] text-primary font-medium">
              <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              ANALYZING DATA...
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-surface-bright rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-outline-variant flex items-center gap-3">
        <Bot className="w-5 h-5 text-primary" />
        <div className="flex-1">
          <h4 className="text-sm font-bold text-on-surface">AI Coach Insights</h4>
          <div className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
            {generatedAt ? `Generated at ${new Date(generatedAt).toLocaleTimeString()}` : 'Live Analysis'}
          </div>
        </div>
        {status === 'live' ? (
          <span className="text-[10px] font-black bg-secondary text-surface px-2 py-0.5 rounded-full animate-bounce">JUST UPDATED</span>
        ) : (
          <span className="text-[10px] font-black border border-primary/30 text-primary px-2 py-0.5 rounded-full">AI LIVE</span>
        )}
      </div>

      {/* Insights */}
      <div className="p-4 space-y-3">
        {Array.isArray(insights) && insights.map((item, i) => {
          if (!item) return null;
          const config = INSIGHT_TYPE_MAP[item.type] ?? INSIGHT_TYPE_MAP.tip;
          const Icon = config.icon;
          return (
            <div key={i} className={`p-3 rounded-xl border-l-4 ${config.cls} flex gap-3 group transition-all hover:translate-x-1`}>
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.iconCls}`} />
              <div className="text-xs text-on-surface-variant leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: item.text || '' }} />
            </div>
          );
        })}

        {recommendation && (
          <div className="mt-4 p-4 rounded-xl bg-surface-bright border border-outline-variant relative group">
            <Sparkles className="absolute top-2 right-2 w-4 h-4 text-tertiary opacity-30 group-hover:opacity-100 transition-opacity" />
            <div className="text-[10px] font-black text-tertiary uppercase tracking-widest mb-1">Weekly Focus</div>
            <p className="text-xs font-semibold text-on-surface leading-normal italic">"{recommendation}"</p>
          </div>
        )}
      </div>

      {/* Next Workout */}
      {nextWorkout && (
        <div className="mx-4 mb-4 p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              Next Scheduled Session
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-on-surface">{nextWorkout.name}</div>
            <div className="text-[11px] font-medium text-on-surface-variant">{nextWorkout.focus}</div>
          </div>
          {nextWorkout.exercises && Array.isArray(nextWorkout.exercises) && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {nextWorkout.exercises.map((ex, i) => (
                <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-surface-container border border-outline-variant text-on-surface-variant">
                  {ex}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Action */}
      <div className="p-4 pt-0">
        <button className="w-full py-2.5 rounded-xl bg-surface-bright border border-outline-variant hover:border-primary/50 text-on-surface font-bold text-xs flex items-center justify-center gap-2 transition-all group">
          <MessageSquare className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          ASK AI COACH
          <ArrowRight className="w-3 h-3 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
