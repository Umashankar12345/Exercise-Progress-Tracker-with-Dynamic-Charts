import React from 'react';
import { UserPlus, Activity } from 'lucide-react';

export default function FollowFriendsManager() {
  const friends = [
    { name: 'Michael C.', activity: 'Running now', online: true },
    { name: 'Jessica R.', activity: 'Completed Yoga', online: false },
    { name: 'Brian T.', activity: 'Rest day', online: true },
  ];

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-white" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Following</span>
        </div>
        <span className="text-[9px] text-[#3B82F6] font-bold uppercase tracking-widest cursor-pointer hover:underline">Find</span>
      </div>

      <div className="flex flex-col gap-3">
        {friends.map((f, i) => (
          <div key={i} className="flex items-center gap-3 group cursor-pointer">
             <div className="relative">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20" />
                {f.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] border-2 border-[#050816] rounded-full" />}
             </div>
             <div className="flex flex-col">
                <span className="text-xs font-bold text-white group-hover:text-[#3B82F6] transition-colors">{f.name}</span>
                <span className="text-[9px] font-medium text-v2-soft-gray uppercase tracking-widest flex items-center gap-1">
                  {f.activity.includes('now') && <Activity className="w-2.5 h-2.5 text-[#22C55E]" />}
                  {f.activity}
                </span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
