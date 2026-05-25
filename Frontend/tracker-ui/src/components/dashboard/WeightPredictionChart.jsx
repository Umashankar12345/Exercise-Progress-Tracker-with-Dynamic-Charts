import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown } from 'lucide-react';

export default function WeightPredictionChart({ forecastData }) {
  const chartData = forecastData && forecastData.length > 0 ? forecastData : [];
  return (
    <div className="w-full h-[300px] rounded-3xl bg-[#0F172A]/50 border border-white/5 p-6 relative overflow-hidden backdrop-blur-xl group hover:-translate-y-1 hover:border-[#7C3AED]/30 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED] opacity-10 blur-[50px] rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
           <h3 className="text-sm font-black text-white uppercase tracking-widest">Weight Prediction</h3>
           <p className="text-[10px] text-[#7C3AED] uppercase tracking-widest font-bold">AI Forecasting Engine</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center border border-[#7C3AED]/30">
           <TrendingDown className="w-4 h-4 text-[#7C3AED]" />
        </div>
      </div>

      <div className="w-full h-[180px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#070B14', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}
              />
              <Area type="monotone" dataKey="weight" stroke="#FFFFFF" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              <Area type="monotone" dataKey="predicted" stroke="#7C3AED" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-v2-soft-gray border border-white/5 rounded-2xl bg-white/[0.02]">
            <TrendingDown className="w-8 h-8 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">No Data Available</span>
          </div>
        )}
      </div>
    </div>
  );
}
