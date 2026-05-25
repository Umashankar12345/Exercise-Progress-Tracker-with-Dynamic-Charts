import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Dumbbell, ChevronRight, X, PlayCircle, Target, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import useStore from '../store/useStore';
import GlobalLoader from '../components/ui/GlobalLoader';

const MUSCLES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

const DIFFICULTY_COLORS = {
  Beginner: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Intermediate: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  Advanced: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
};

export default function ExerciseLibrary() {
  const { exerciseLibrary, fetchExerciseLibrary } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(exerciseLibrary.length === 0);
  const [search, setSearch] = useState('');
  const [activeMuscle, setActiveMuscle] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    const initFetch = async () => {
      if (exerciseLibrary.length === 0) setLoading(true);
      await fetchExerciseLibrary();
      setLoading(false);
    };
    initFetch();
  }, [fetchExerciseLibrary]);

  const filteredExercises = exerciseLibrary.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = activeMuscle === 'All' || item.muscle_group === activeMuscle;
    return matchesSearch && matchesMuscle;
  });

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
        <GlobalLoader fullScreen={true} text="Loading Library..." />
      ) : filteredExercises.length === 0 ? (
        <div className="p-16 text-center glass-card space-y-4">
          <Sparkles className="w-12 h-12 text-on-surface-variant mx-auto opacity-20" />
          <h3 className="text-lg font-bold text-on-surface">No Exercises Found</h3>
          <p className="text-on-surface-variant/70 text-sm max-w-md mx-auto">
            We couldn't find any exercises matching your filter. Try adjusting your query or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((item) => (
            <motion.div
              key={item.id}
              onClick={() => setSelectedExercise(item)}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer glass-card p-6 border border-outline-variant/60 hover:border-[#00E5FF]/40 hover:shadow-[0_0_30px_rgba(0,229,255,0.1)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle gradient glow inside card on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-lg text-white group-hover:text-[#00E5FF] transition-colors leading-tight">
                    {item.name}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${DIFFICULTY_COLORS[item.difficulty] || DIFFICULTY_COLORS.Beginner}`}>
                    {item.difficulty}
                  </span>
                </div>

                <p className="text-xs text-v2-soft-gray line-clamp-2">
                  {item.description || 'Master correct training form, setups, and mechanics.'}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6 relative z-10">
                <div className="flex gap-2">
                  <span className="bg-white/5 border border-white/10 text-v2-soft-gray text-[10px] font-bold px-2 py-1 rounded-lg">
                    {item.muscle_group}
                  </span>
                  {item.equipment && (
                    <span className="bg-white/5 border border-white/10 text-v2-soft-gray text-[10px] font-bold px-2 py-1 rounded-lg">
                      {item.equipment}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-black text-[#00E5FF] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  Preview
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cinematic Quick-View Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedExercise(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-[#0F172A] border border-[#00E5FF]/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.15)] flex flex-col max-h-[90vh]"
            >
              {/* Video Header Area */}
              <div className="relative h-64 md:h-80 bg-black flex items-center justify-center overflow-hidden border-b border-white/10 group">
                {/* Fallback pattern for video */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#00E5FF 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                
                <PlayCircle className="w-16 h-16 text-[#00E5FF] opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all cursor-pointer relative z-10" />
                
                <div className="absolute top-4 right-4 z-20">
                  <button 
                    onClick={() => setSelectedExercise(null)}
                    className="p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 backdrop-blur-md transition-all border border-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Gradient Overlay at bottom of video */}
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0F172A] to-transparent z-10" />
                
                {/* Exercise Title placed over the video bottom */}
                <div className="absolute bottom-6 left-6 z-20 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/20 border border-[#00E5FF]/50 flex items-center justify-center backdrop-blur-md">
                    <Dumbbell className="w-6 h-6 text-[#00E5FF]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-2">{selectedExercise.name}</h2>
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${DIFFICULTY_COLORS[selectedExercise.difficulty] || DIFFICULTY_COLORS.Beginner}`}>
                        {selectedExercise.difficulty}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-white border border-white/20">
                        {selectedExercise.muscle_group}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-[#060B16]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Instructions */}
                  <div className="md:col-span-2 space-y-6">
                    <section>
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#00E5FF] mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Mechanics & Setup
                      </h3>
                      <p className="text-v2-soft-gray text-sm leading-relaxed whitespace-pre-line">
                        {selectedExercise.description || "Detailed execution instructions are being generated for this exercise. Maintain a braced core, control the eccentric phase, and drive explosively on the concentric."}
                      </p>
                    </section>
                  </div>

                  {/* Sidebar Metadata */}
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white mb-2">
                        <Target className="w-4 h-4 text-[#7C3AED]" /> Target Metrics
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-v2-soft-gray mb-1">Equipment</p>
                          <p className="text-sm font-bold text-white">{selectedExercise.equipment || 'Any'}</p>
                        </div>
                        <div className="h-px w-full bg-white/10" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-v2-soft-gray mb-1">Primary Focus</p>
                          <p className="text-sm font-bold text-[#00E5FF]">{selectedExercise.muscle_group}</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/library/${selectedExercise.id}`)}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      View Full Masterclass <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
