import React from 'react';
import { GripVertical } from 'lucide-react';

export default function DragDropWorkoutPlanner() {
  const exercises = [
    { id: 1, name: 'Deadlift', category: 'Legs' },
    { id: 2, name: 'Pull-ups', category: 'Back' },
    { id: 3, name: 'Face Pulls', category: 'Shoulders' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="text-[9px] text-v2-soft-gray uppercase tracking-widest font-bold mb-3">Today's Block</div>
      <div className="space-y-2">
        {exercises.map((ex) => (
          <div key={ex.id} className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F172A]/80 border border-white/10 hover:border-[#8B5CF6]/50 transition-colors cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-v2-soft-gray" />
              <span className="text-xs font-bold text-white">{ex.name}</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-v2-soft-gray">{ex.category}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 p-2.5 rounded-lg border-2 border-dashed border-white/10 text-center text-[10px] text-v2-soft-gray uppercase font-bold tracking-widest cursor-pointer hover:border-white/30 hover:text-white transition-all">
        + Drop Exercise Here
      </div>
    </div>
  );
}
