import React from 'react';
import { Hexagon, Wallet } from 'lucide-react';

export default function BlockchainFitnessRewards() {
  return (
    <div className="w-full rounded-2xl border border-[#FACC15]/20 bg-[#FACC15]/5 p-5 relative overflow-hidden group">
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#FACC15] opacity-10 blur-3xl rounded-full" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-[#FACC15]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Web3 Wallet</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 relative z-10">
         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FACC15] to-[#B45309] p-[2px] shadow-[0_0_15px_rgba(250,204,21,0.3)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#050816] rounded-[10px] flex items-center justify-center">
               <Hexagon className="w-6 h-6 text-[#FACC15]" />
            </div>
         </div>
         <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-v2-soft-gray font-bold mb-0.5">$FIT Balance</span>
            <span className="text-xl font-black text-white">1,420.50</span>
         </div>
      </div>

      <button className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-[9px] uppercase font-bold tracking-widest text-white border border-white/10">
        View NFT Trophies
      </button>
    </div>
  );
}
