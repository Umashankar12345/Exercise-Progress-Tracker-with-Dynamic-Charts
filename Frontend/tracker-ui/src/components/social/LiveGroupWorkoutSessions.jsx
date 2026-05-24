import React, { useState, useEffect } from 'react';
import { Video, Users, Loader2, Play, Square } from 'lucide-react';
import useStore from '../../store/useStore';
import { getEcho } from '../../lib/echo';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function LiveGroupWorkoutSessions() {
  const { activeSessionRoom, joinSession, leaveSession, roomParticipants, updateRoomParticipants } = useStore();
  const [loading, setLoading] = useState(false);
  const roomId = 'studio-1';
  const isJoined = activeSessionRoom === roomId;

  const currentCount = roomParticipants[roomId] ?? 0;
  const displayCount = 1240 + currentCount;

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data } = await axios.get(`http://172.21.133.28:8000/api/live-sessions/${roomId}/participants`);
        updateRoomParticipants(roomId, data.participant_count);
      } catch (err) {
        console.error('Error fetching room count:', err);
      }
    };
    fetchCount();
  }, [roomId, updateRoomParticipants]);

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.channel(`live-room.${roomId}`);
    
    channel.listen('.ParticipantJoined', (e) => {
      updateRoomParticipants(roomId, e.participant_count);
      toast(`${e.user_name} joined the live workout!`, {
        icon: '💪',
        style: {
          background: '#0F172A',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }
      });
    });

    channel.listen('.ParticipantLeft', (e) => {
      updateRoomParticipants(roomId, e.participant_count);
    });

    return () => {
      echo.leave(`live-room.${roomId}`);
    };
  }, [roomId, updateRoomParticipants]);

  const handleToggleSession = async () => {
    setLoading(true);
    try {
      if (isJoined) {
        await leaveSession(roomId);
        toast.success('You have left the Live Studio session.');
      } else {
        await joinSession(roomId);
        toast.success('Successfully joined the Live Studio room! WebSocket connected.');
      }
    } catch (err) {
      toast.error('Failed to toggle session participation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full rounded-2xl border transition-all duration-300 p-5 relative overflow-hidden group ${
      isJoined ? 'border-[#EF4444] bg-[#EF4444]/10 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-[#EF4444]/30 bg-[#EF4444]/5'
    }`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#EF4444] opacity-10 blur-3xl rounded-full" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
             <Video className="w-4 h-4 text-[#EF4444]" />
             <div className="absolute inset-0 bg-[#EF4444] rounded-full blur-md opacity-40 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Studio</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#EF4444]/10 border border-[#EF4444]/30">
          <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
          <span className="text-[9px] font-bold text-[#EF4444] tracking-widest">LIVE</span>
        </div>
      </div>

      <div className="aspect-video w-full rounded-xl bg-black/40 border border-white/10 mb-4 relative overflow-hidden flex items-center justify-center group-hover:border-white/20 transition-colors">
         <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-black to-black" />
         <div className="flex items-center gap-2">
           <div className={`w-12 h-12 rounded-full border-2 p-1 flex items-center justify-center relative shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all ${
             isJoined ? 'border-[#22C55E] scale-105' : 'border-[#EF4444]'
           }`}>
             <img src="https://i.pravatar.cc/150?u=10" alt="Trainer" className="w-full h-full rounded-full object-cover" />
             {isJoined && (
               <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-[#22C55E] rounded-full ring-2 ring-[#0F172A] animate-pulse" />
             )}
           </div>
         </div>
         <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[8px] text-white uppercase font-bold tracking-widest">
            <Users className="w-2.5 h-2.5" /> {displayCount} Watching
         </div>
      </div>

      <button 
        onClick={handleToggleSession}
        disabled={loading}
        className={`w-full py-2.5 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer border ${
          isJoined 
            ? 'bg-transparent border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
            : 'bg-[#EF4444] border-transparent hover:bg-[#DC2626] text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
        } disabled:opacity-50`}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isJoined ? (
          <>
            <Square className="w-3.5 h-3.5 fill-[#EF4444]" />
            Leave Room
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-white" />
            Join Session
          </>
        )}
      </button>
    </div>
  );
}
