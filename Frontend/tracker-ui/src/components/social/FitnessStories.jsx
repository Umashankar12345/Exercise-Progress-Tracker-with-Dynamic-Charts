import React from 'react';
import { Plus } from 'lucide-react';

export default function FitnessStories() {
  const stories = [
    { id: 1, name: 'You', image: 'https://i.pravatar.cc/150?u=1', isUser: true, hasUnseen: false },
    { id: 2, name: 'Sarah M.', image: 'https://i.pravatar.cc/150?u=2', isUser: false, hasUnseen: true, ringColor: 'from-[#EC4899] to-[#8B5CF6]' },
    { id: 3, name: 'Alex T.', image: 'https://i.pravatar.cc/150?u=3', isUser: false, hasUnseen: true, ringColor: 'from-[#22D3EE] to-[#3B82F6]' },
    { id: 4, name: 'David K.', image: 'https://i.pravatar.cc/150?u=4', isUser: false, hasUnseen: true, ringColor: 'from-[#FACC15] to-[#F97316]' },
    { id: 5, name: 'Emma W.', image: 'https://i.pravatar.cc/150?u=5', isUser: false, hasUnseen: false },
    { id: 6, name: 'Chris P.', image: 'https://i.pravatar.cc/150?u=6', isUser: false, hasUnseen: false },
  ];

  return (
    <div className="w-full flex items-center gap-4 overflow-x-auto scrollbar-hide py-2 px-1">
      {stories.map(story => (
        <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full p-[2px] ${story.hasUnseen ? `bg-gradient-to-tr ${story.ringColor}` : 'bg-white/10'}`}>
               <div className="w-full h-full rounded-full border-2 border-[#050816] overflow-hidden">
                 <img src={story.image} alt={story.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
               </div>
            </div>
            {story.isUser && (
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#3B82F6] border-2 border-[#050816] flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <span className={`text-[10px] font-bold tracking-wide ${story.hasUnseen ? 'text-white' : 'text-v2-soft-gray'}`}>
            {story.name}
          </span>
        </div>
      ))}
    </div>
  );
}
