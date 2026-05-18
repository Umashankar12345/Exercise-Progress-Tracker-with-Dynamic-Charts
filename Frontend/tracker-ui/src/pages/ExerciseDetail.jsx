import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Dumbbell, Award, HelpCircle, CheckCircle2, Play } from 'lucide-react';
import api from '../api/axios';

const DIFFICULTY_COLORS = {
  Beginner: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Intermediate: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  Advanced: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
};

export default function ExerciseDetail() {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/exercises/${id}`);
        setExercise(data);
      } catch (err) {
        console.error('Error loading exercise detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-medium text-sm">Loading guide details...</p>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="text-center p-12 glass-card space-y-4 max-w-md mx-auto">
        <HelpCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-on-surface">Exercise Not Found</h2>
        <p className="text-on-surface-variant/70 text-sm">
          We couldn't find the exercise guide you were looking for. It may have been removed or renamed.
        </p>
        <Link to="/library" className="btn btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>
      </div>
    );
  }

  const steps = exercise.instructions ? exercise.instructions.split('\n') : [];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Back to Library */}
      <div>
        <Link
          to="/library"
          className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Exercise Library
        </Link>
      </div>

      {/* Hero section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-surface-container border border-outline-variant">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <Dumbbell className="text-primary w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">{exercise.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${DIFFICULTY_COLORS[exercise.difficulty] || DIFFICULTY_COLORS.Beginner}`}>
                {exercise.difficulty}
              </span>
              <span className="text-outline-variant text-xs">|</span>
              <span className="text-xs font-bold text-on-surface-variant">Muscle: {exercise.muscle_group}</span>
              <span className="text-outline-variant text-xs">|</span>
              <span className="text-xs font-bold text-on-surface-variant">Equipment: {exercise.equipment || 'None'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Instructions */}
        <div className="glass-card p-8 border border-outline-variant space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 pb-4 border-b border-outline-variant/30">
              <Award className="w-5 h-5 text-secondary" />
              Proper Training Mechanics
            </h2>

            {steps.length > 0 ? (
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4 items-start group">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <p className="text-sm text-on-surface leading-relaxed font-medium">
                      {step.replace(/^\d+\.\s*/, '')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">No specific instructions documented yet.</p>
            )}
          </div>

          <div className="bg-surface-bright/50 p-4 rounded-2xl border border-outline-variant/20 mt-8">
            <h4 className="text-xs font-black text-on-surface uppercase tracking-widest">Description</h4>
            <p className="text-xs text-on-surface-variant/80 mt-1 leading-relaxed">
              {exercise.description || 'Focus on maintaining a solid core foundation throughout the entire lift path.'}
            </p>
          </div>
        </div>

        {/* Video Tutorial */}
        <div className="glass-card p-8 border border-outline-variant flex flex-col justify-between h-full">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 pb-4 border-b border-outline-variant/30">
              <Play className="w-5 h-5 text-primary" />
              Form Tutorial Video
            </h2>

            {exercise.youtube_url ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-outline-variant/50 shadow-2xl">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={exercise.youtube_url}
                  title={`${exercise.name} Tutorial`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="w-full aspect-video rounded-2xl bg-surface-bright flex flex-col items-center justify-center border border-outline-variant/50 border-dashed text-center p-6 space-y-2">
                <Play className="w-12 h-12 text-on-surface-variant/40" />
                <span className="text-sm font-bold text-on-surface-variant">No Video Available</span>
                <span className="text-xs text-on-surface-variant/60">Follow the proper mechanics checklist.</span>
              </div>
            )}
          </div>

          <div className="text-center text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest mt-8 pt-4 border-t border-outline-variant/30">
            Source: Expert Certified Athletics Database
          </div>
        </div>
      </div>
    </div>
  );
}
