import React from 'react';
import { Pill, CheckCircle } from 'lucide-react';

export default function SmartMedicationReminder() {
  const meds = [
    { name: 'Fish Oil & D3', time: '8:00 AM', taken: true },
    { name: 'Magnesium', time: '9:30 PM', taken: false },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-4">
        <Pill className="w-4 h-4 text-[#8B5CF6]" />
        <span className="text-[10px] uppercase font-bold tracking-widest text-white">Supplements</span>
      </div>

      <div className="space-y-2">
        {meds.map((m, i) => (
          <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${m.taken ? 'bg-white/5 border-white/5 opacity-60' : 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 group cursor-pointer hover:bg-[#8B5CF6]/20 transition-colors'}`}>
            <div className="flex flex-col gap-1">
              <span className={`text-xs font-bold ${m.taken ? 'text-v2-soft-gray line-through' : 'text-white'}`}>{m.name}</span>
              <span className="text-[9px] font-mono text-v2-soft-gray">{m.time}</span>
            </div>
            {m.taken ? (
              <CheckCircle className="w-4 h-4 text-[#10B981]" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-v2-soft-gray group-hover:border-white transition-colors" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
