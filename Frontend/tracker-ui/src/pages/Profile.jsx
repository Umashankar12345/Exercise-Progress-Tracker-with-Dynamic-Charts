import React from 'react';
import { User, Edit2, Shield, Settings, Trophy, Target, ChevronRight, Activity, MapPin, Mail, Plus, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useStore from '../store/useStore';
import api from '../api/axios';

export default function Profile() {
  const { user } = useStore();
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const res = await api.get('/goals');
      return res.data.data;
    }
  });

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="glass-card p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-1000" />
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary p-1 shadow-2xl shadow-primary/20">
              <div className="w-full h-full rounded-full bg-surface-container flex items-center justify-center text-4xl font-black text-white">
                {initials}
              </div>
            </div>
            <button className="absolute bottom-1 right-1 p-2 bg-surface-bright border border-outline-variant rounded-full text-on-surface-variant hover:text-primary transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-4xl font-black text-on-surface tracking-tighter">{user?.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  PREMIUM MEMBER
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  NEW YORK, USA
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant">
                  <Mail className="w-3.5 h-3.5 text-tertiary" />
                  {user?.email}
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-center md:justify-start">
              <button className="px-6 py-2.5 bg-primary text-white text-xs font-black rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">EDIT PROFILE</button>
              <button className="px-6 py-2.5 bg-surface-bright border border-outline-variant text-xs font-black rounded-xl hover:border-primary/50 transition-all">ACCOUNT SETTINGS</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Goals Management */}
        <div className="glass-card">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface flex items-center gap-2">
              <Target className="w-4 h-4 text-secondary" />
              Active Training Goals
            </h3>
            <button className="p-2 hover:bg-surface-bright rounded-lg transition-colors">
              <Settings className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>
          <div className="p-8 space-y-10">
            {goals.length === 0 ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-surface-bright rounded-2xl flex items-center justify-center mx-auto">
                  <Plus className="w-6 h-6 text-on-surface-variant" />
                </div>
                <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">Create your first goal</p>
              </div>
            ) : (
              goals.map(g => (
                <div key={g.id} className="space-y-4 group">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Target Weight Goal</div>
                      <div className="text-xl font-black text-on-surface">{g.target_kg} kg</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-secondary">{g.pct}%</div>
                      <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Completion</div>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-surface-bright rounded-full overflow-hidden border border-outline-variant/30">
                    <div 
                      className="h-full bg-secondary rounded-full transition-all duration-1000 group-hover:opacity-80" 
                      style={{ width: `${g.pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                    <span>Started: {new Date(g.created_at).toLocaleDateString()}</span>
                    <span className="text-tertiary">Deadline: {g.target_date || 'None'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PR History Feed */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface flex items-center gap-2">
              <Trophy className="w-4 h-4 text-tertiary" />
              Personal Records
            </h3>
            <span className="text-[10px] font-bold text-on-surface-variant bg-surface-bright px-2 py-1 rounded-md">ALL TIME</span>
          </div>
          <div className="divide-y divide-outline-variant">
            {[
              { ex: 'Bench Press', wt: 102.5, dt: '2 days ago', inc: '+2.5kg' },
              { ex: 'Squat (High Bar)', wt: 145, dt: '1 week ago', inc: '+5.0kg' },
              { ex: 'Deadlift', wt: 180, dt: 'May 04, 2026', inc: '+10.0kg' },
              { ex: 'Overhead Press', wt: 65, dt: 'April 28, 2026', inc: '+2.5kg' },
              { ex: 'Pull-ups', wt: 20, dt: 'April 15, 2026', inc: 'First PR' },
            ].map((pr, i) => (
              <div key={i} className="p-6 flex items-center gap-5 hover:bg-surface-bright transition-all cursor-default group">
                <div className="w-12 h-12 bg-surface-bright border border-outline-variant rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                  <Activity className="w-6 h-6 text-on-surface-variant group-hover:text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-on-surface tracking-tight group-hover:text-primary transition-colors">{pr.ex}</h4>
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">{pr.dt}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-on-surface">{pr.wt} kg</div>
                  <div className="text-[10px] font-bold text-secondary flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {pr.inc}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-surface-bright border-t border-outline-variant text-center">
            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View Detailed PR History</button>
          </div>
        </div>
      </div>
    </div>
  );
}


