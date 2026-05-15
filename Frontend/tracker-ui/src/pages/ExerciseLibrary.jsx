import React, { useState } from 'react';
import { 
  Search, 
  Dumbbell, 
  ChevronRight, 
  Info, 
  Filter, 
  PlayCircle,
  Clock,
  Target
} from 'lucide-react';

const EXERCISES = {
  Chest:     ['Bench Press', 'Incline DB Press', 'Cable Fly', 'Chest Dips'],
  Back:      ['Deadlift', 'Pull-ups', 'Barbell Row', 'Lat Pulldown'],
  Legs:      ['Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curl'],
  Shoulders: ['Overhead Press', 'Lateral Raises', 'Face Pulls'],
  Arms:      ['Barbell Curl', 'Tricep Pushdown', 'Hammer Curl'],
  Core:      ['Plank', 'Cable Crunch', 'Leg Raise'],
};

export default function ExerciseLibrary() {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');

  const allExercises = Object.entries(EXERCISES).flatMap(([group, items]) => 
    items.map(name => ({ name, group }))
  );

  const filtered = allExercises.filter(ex => 
    (activeGroup === 'All' || ex.group === activeGroup) &&
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Search and Categories */}
      <div className="glass-card p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Exercise Library</h1>
            <p className="text-sm text-on-surface-variant font-medium">Browse technical execution guides and history</p>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search 150+ exercises..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-80 bg-surface-bright border border-outline-variant rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary transition-all font-medium"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', ...Object.keys(EXERCISES)].map(group => (
            <button 
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeGroup === group 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-surface-bright border-outline-variant text-on-surface-variant hover:border-primary/50'
              }`}
            >
              {group.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ex, i) => (
          <div key={i} className="glass-card group hover:border-primary/40 transition-all hover:-translate-y-1 cursor-pointer">
            <div className="aspect-video bg-surface-bright relative overflow-hidden flex items-center justify-center border-b border-outline-variant">
              <Dumbbell className="w-12 h-12 text-on-surface-variant/20 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-3 left-3 px-2 py-1 bg-surface/80 backdrop-blur-md border border-outline-variant rounded-md text-[9px] font-black text-primary uppercase tracking-widest">
                {ex.group}
              </div>
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
              <PlayCircle className="absolute inset-0 m-auto w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300" />
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">{ex.name}</h3>
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                  <Target className="w-3.5 h-3.5" />
                  Primary: {ex.group}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                  <Clock className="w-3.5 h-3.5" />
                  Rest: 2-3 min
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
