import React, { useState } from 'react';
import { Share, Download, Loader2, Check, Bookmark, BookmarkCheck } from 'lucide-react';
import useStore from '../../store/useStore';
import { toast } from 'react-hot-toast';

export default function WorkoutSharingSystem() {
  const { importWorkout, importedWorkouts } = useStore();
  const [importing, setImporting] = useState(false);
  const [saved, setSaved] = useState(false);
  const splitName = "Push Hypertrophy";
  
  const isImported = importedWorkouts.includes(splitName);

  const handleImport = async () => {
    if (isImported) {
      toast.error('This split is already imported!');
      return;
    }
    setImporting(true);
    try {
      await importWorkout(splitName);
      toast.success(`${splitName} imported successfully! Added to your Workout Plan.`);
    } catch (err) {
      toast.error('Failed to import workout split.');
    } finally {
      setImporting(false);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    if (!saved) {
      toast.success(`${splitName} saved to favorites.`);
    } else {
      toast.success(`${splitName} removed from favorites.`);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/5 bg-[#0F172A]/65 backdrop-blur-xl p-5 group hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Share className="w-4 h-4 text-[#8B5CF6]" />
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Trending Split</span>
        </div>
        <button 
          onClick={handleSave}
          className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded cursor-pointer transition-all duration-300 flex items-center gap-1 ${
            saved 
              ? 'bg-[#8B5CF6] text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]' 
              : 'bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20'
          }`}
        >
          {saved ? <BookmarkCheck className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <div className="p-4 rounded-xl bg-black/20 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#8B5CF6] opacity-10 blur-xl rounded-full" />
        <h4 className="text-sm font-black text-white mb-1 relative z-10">{splitName}</h4>
        <p className="text-[10px] text-v2-soft-gray uppercase tracking-widest font-bold mb-3 relative z-10">By Alex Thompson</p>
        
        <div className="flex gap-2 relative z-10">
          <button 
            onClick={handleImport}
            disabled={importing || isImported}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[9px] uppercase font-black tracking-widest text-white transition-all duration-300 cursor-pointer border ${
              isImported
                ? 'bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'bg-[#3B82F6] border-transparent hover:bg-[#2563EB] shadow-[0_0_10px_rgba(59,130,246,0.3)]'
            } disabled:opacity-50`}
          >
             {importing ? (
               <Loader2 className="w-3 h-3 animate-spin" />
             ) : isImported ? (
               <>
                 <Check className="w-3 h-3" /> Imported
               </>
             ) : (
               <>
                 <Download className="w-3 h-3" /> Import
               </>
             )}
          </button>
        </div>
      </div>
    </div>
  );
}
