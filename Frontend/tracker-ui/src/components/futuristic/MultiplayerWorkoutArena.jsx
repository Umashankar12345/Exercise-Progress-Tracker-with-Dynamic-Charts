import React from 'react';
import { Users, Swords } from 'lucide-react';

export default function MultiplayerWorkoutArena() {
  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#22D3EE]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Live Arena</span>
        </div>
        <span className="text-[9px] text-[#22C55E] font-bold uppercase tracking-widest bg-[#22C55E]/10 px-2 py-1 rounded">Lobby Active</span>
      </div>

      <div className="flex flex-col gap-3">
         <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-[#22D3EE]/20 hover:border-[#22D3EE]/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-[#22D3EE]/10 flex items-center justify-center border border-[#22D3EE]/30">
                  <Swords className="w-4 h-4 text-[#22D3EE]" />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Global HIIT Battle</span>
                  <span className="text-[9px] uppercase tracking-widest text-v2-soft-gray font-bold">Starts in 04:20</span>
               </div>
            </div>
            <div className="flex -space-x-2">
               <div className="w-6 h-6 rounded-full bg-gray-600 border border-[#050816]" />
               <div className="w-6 h-6 rounded-full bg-gray-500 border border-[#050816]" />
               <div className="w-6 h-6 rounded-full bg-gray-400 border border-[#050816] flex items-center justify-center text-[8px] font-bold text-white">+14</div>
            </div>
         </div>
      </div>
    </div>
  );
}
