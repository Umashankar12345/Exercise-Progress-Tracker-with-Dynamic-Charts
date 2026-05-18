import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Dumbbell, ChevronRight } from 'lucide-react';
import api from '../api/axios';

const MUSCLES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

const DIFFICULTY_COLORS = {
  Beginner: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Intermediate: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  Advanced: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
};

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState('');
  const [activeMuscle, setActiveMuscle] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const muscleParam = activeMuscle === 'All' ? '' : activeMuscle;
      const { data } = await api.get('/exercises', {
        params: {
          search,
          muscle: muscleParam
        }
      });
      setExercises(data);
    } catch (err) {
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [search, activeMuscle]);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <Dumbbell className="text-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">Exercise Library</h1>
            <p className="text-sm text-on-surface-variant/70 mt-1">
              Explore 50+ master guided exercises, proper forms, and dynamic video tutorials.
            </p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 rounded-3xl bg-surface-container border border-outline-variant">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Search exercises (e.g. Bench Press)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-bright border border-outline-variant rounded-2xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors text-sm"
          />
        </div>

        {/* Muscle Tabs */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {MUSCLES.map((muscle) => (
            <button
              key={muscle}
              onClick={() => setActiveMuscle(muscle)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                activeMuscle === muscle
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  : 'bg-surface-bright text-on-surface-variant border-outline-variant hover:text-on-surface hover:border-outline'
              }`}
            >
              {muscle}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-6 h-48 animate-pulse space-y-4">
              <div className="h-4 bg-outline-variant rounded w-3/4"></div>
              <div className="h-3 bg-outline-variant rounded w-1/2"></div>
              <div className="h-10 bg-outline-variant rounded mt-8"></div>
            </div>
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <div className="p-16 text-center glass-card space-y-4">
          <Sparkles className="w-12 h-12 text-on-surface-variant mx-auto opacity-20" />
          <h3 className="text-lg font-bold text-on-surface">No Exercises Found</h3>
          <p className="text-on-surface-variant/70 text-sm max-w-md mx-auto">
            We couldn't find any exercises matching your filter. Try adjusting your query or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((item) => (
            <Link
              key={item.id}
              to={`/library/${item.id}`}
              className="glass-card p-6 border border-outline-variant/60 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors leading-tight">
                    {item.name}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${DIFFICULTY_COLORS[item.difficulty] || DIFFICULTY_COLORS.Beginner}`}>
                    {item.difficulty}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant/70 line-clamp-2">
                  {item.description || 'Master correct training form, setups, and mechanics.'}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4 mt-6">
                <div className="flex gap-2">
                  <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded-lg">
                    {item.muscle_group}
                  </span>
                  {item.equipment && (
                    <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded-lg">
                      {item.equipment}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-black text-primary uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  Guide
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
