import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, X } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ActiveGoalsWidget() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    target_value: '',
    target_date: ''
  });

  const fetchGoals = async () => {
    try {
      const response = await api.get('/goals');
      // Assume the response might have data wrapped or not
      const data = response.data?.data || response.data || [];
      setGoals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goals', {
        title: form.title,
        target_value: parseFloat(form.target_value),
        target_date: form.target_date,
        // Defaulting target_kg as a fallback for the existing backend logic
        target_kg: parseFloat(form.target_value),
        exercise_id: 1 // Fallback generic ID if required by older schema
      });
      toast.success('Goal Set Successfully!');
      setIsModalOpen(false);
      setForm({ title: '', target_value: '', target_date: '' });
      fetchGoals();
    } catch (error) {
      toast.error('Failed to set goal');
      console.error(error);
    }
  };

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-5 border-b border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface">Active Milestones</h4>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 text-[10px] font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/20"
        >
          <Plus className="w-3.5 h-3.5" />
          Set Goal
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : goals.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-4 opacity-70">
            <TrendingUp className="w-8 h-8 text-on-surface-variant mb-2" />
            <p className="text-sm font-medium text-on-surface-variant">No active milestones.</p>
            <p className="text-xs text-on-surface-variant mt-1">Set a goal to track your progress.</p>
          </div>
        ) : (
          goals.map(goal => {
            // Using either percentage, or calculating it from current / target
            const target = goal.target_value || goal.target_kg || 100;
            const current = goal.current_value || goal.current_kg || 0;
            const rawPercent = goal.percentage !== undefined ? goal.percentage : (current / target) * 100;
            const percentage = Math.min(Math.max(rawPercent, 0), 100).toFixed(1);
            
            return (
              <div key={goal.id} className="space-y-3 group">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">
                      {goal.title || goal.exercise?.name || 'Milestone Target'}
                    </span>
                    <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                      {target} {goal.title ? '' : 'kg'}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-on-surface-variant font-medium mb-0.5">
                      {current} / {target}
                    </span>
                    <span className="text-lg font-black text-secondary leading-none">{percentage}%</span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Configure Goal
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Milestone Title</label>
                <input 
                  type="text" 
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="e.g. 100kg Bench Press" 
                  className="w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors" 
                  required 
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Target Value</label>
                <input 
                  type="number" 
                  value={form.target_value}
                  onChange={e => setForm({...form, target_value: e.target.value})}
                  placeholder="0" 
                  className="w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors" 
                  required 
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Target Date</label>
                <input 
                  type="date" 
                  value={form.target_date}
                  onChange={e => setForm({...form, target_date: e.target.value})}
                  className="w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest py-3.5 rounded-xl transition-all active:scale-[0.98]"
              >
                Confirm Target
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
