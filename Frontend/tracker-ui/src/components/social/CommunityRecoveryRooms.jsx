import React from 'react';
import { MessageSquare, Hash } from 'lucide-react';

export default function CommunityRecoveryRooms() {
  const rooms = [
    { name: 'Knee Rehab Support', active: 142 },
    { name: 'Nutrition & Macros', active: 890 },
    { name: 'Sleep Optimization', active: 355 },
  ];

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4 text-[#22C55E]" />
        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Recovery Rooms</span>
      </div>

      <div className="flex flex-col gap-2">
        {rooms.map((r, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
             <div className="flex items-center gap-2">
               <Hash className="w-3 h-3 text-v2-soft-gray group-hover:text-[#22C55E] transition-colors" />
               <span className="text-xs font-bold text-white group-hover:text-[#22C55E] transition-colors">{r.name}</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
               <span className="text-[9px] text-v2-soft-gray font-bold">{r.active}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
