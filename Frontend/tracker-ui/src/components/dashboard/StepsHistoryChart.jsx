import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Footprints, Flame } from 'lucide-react';
import api from '../../api/axios';

export default function StepsHistoryChart({ data: dashboardData }) {
  const data = dashboardData?.weekly_steps?.map(w => ({
    date: w.day,
    step_count: w.steps || 0,
  })) || [];
  
  const totalSteps = data.reduce((acc, curr) => acc + curr.step_count, 0);
  const totalCal = 0; // Steps history chart currently calculates calories based on steps; simplified here as dashboard data provides steps directly.

  const maxSteps = Math.max(...data.map(d => d.step_count), 1);

  return (
    <div className="w-full h-[330px] rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 relative overflow-hidden backdrop-blur-xl group hover:-translate-y-1 hover:border-[#10B981]/30 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] opacity-10 blur-[50px] rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
           <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-1.5 pt-1 leading-normal">
             Weekly Steps
           </h3>
           <p className="text-[10px] text-[#10B981] uppercase tracking-widest font-bold flex items-center gap-1 mt-0.5">
             <Footprints className="w-3.5 h-3.5 text-[#10B981]" />
             Total: {totalSteps.toLocaleString()} steps • {totalCal} kcal
           </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/30">
           <Footprints className="w-4 h-4 text-[#10B981]" />
        </div>
      </div>

      <div className="w-full h-[180px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(16,185,129,0.3)', borderRadius: '12px' }}
                itemStyle={{ color: '#10B981', fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}
              />
              <Bar dataKey="step_count" radius={[6, 6, 6, 6]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.step_count === maxSteps ? '#10B981' : 'rgba(16,185,129,0.3)'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-v2-soft-gray border border-white/5 rounded-2xl bg-white/[0.02]">
            <Footprints className="w-8 h-8 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">No Data Available</span>
          </div>
        )}
      </div>
    </div>
  );
}
