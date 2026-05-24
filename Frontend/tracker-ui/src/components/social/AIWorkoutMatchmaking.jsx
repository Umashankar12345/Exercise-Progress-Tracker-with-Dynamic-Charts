import React, { useState } from 'react';
import { BrainCircuit, Loader2, UserCheck, UserPlus } from 'lucide-react';
import useStore from '../../store/useStore';
import { toast } from 'react-hot-toast';

export default function AIWorkoutMatchmaking() {
  const { connectedUsers, toggleConnect } = useStore();
  const [loading, setLoading] = useState(false);
  const targetId = 2; // Simulated matched user ID
  const isConnected = connectedUsers.includes(targetId);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const data = await toggleConnect(targetId);
      if (data.status === 'connected') {
        toast.success('Successfully connected with Marcus J.!');
      } else {
        toast.success('Successfully disconnected from Marcus J.');
      }
    } catch (err) {
      toast.error('Failed to toggle connection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5 relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#22D3EE] opacity-10 blur-3xl rounded-full" />
      
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="w-4 h-4 text-[#22D3EE]" />
        <span className="text-[10px] uppercase font-bold text-white tracking-widest">AI Matchmaking</span>
      </div>

      <div className="flex flex-col items-center text-center">
         <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 mb-3 flex items-center justify-center relative">
            <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#22D3EE] border-2 border-[#050816] flex items-center justify-center">
               <span className="text-[8px] font-black text-[#050816]">98</span>
            </div>
            <img src="https://i.pravatar.cc/150?u=marcus" alt="Marcus J." className="w-full h-full rounded-full object-cover" />
         </div>
         <span className="text-sm font-bold text-white mb-1">Marcus J.</span>
         <span className="text-[10px] text-v2-soft-gray uppercase tracking-widest font-bold mb-4">98% Match • Similar Goals</span>
         
         <button 
           onClick={handleConnect}
           disabled={loading}
           className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border ${
             isConnected 
               ? 'bg-[#10B981]/25 border-[#10B981]/50 text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
               : 'bg-[#22D3EE]/10 border-[#22D3EE]/30 text-[#22D3EE] hover:bg-[#22D3EE]/20 shadow-[0_0_10px_rgba(34,211,238,0.05)]'
           } disabled:opacity-50`}
         >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isConnected ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                Connected
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                Connect
              </>
            )}
         </button>
      </div>
    </div>
  );
}
