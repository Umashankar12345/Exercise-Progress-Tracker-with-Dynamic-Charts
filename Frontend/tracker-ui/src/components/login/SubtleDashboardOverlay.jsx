import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function SubtleDashboardOverlay() {
  const data = Array.from({ length: 50 }, (_, i) => ({
    val: Math.sin(i / 5) * 20 + 50 + Math.random() * 10
  }));

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-30 mix-blend-screen">
      <div className="absolute bottom-0 w-full h-[40%]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="overlayGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00F5FF" stopOpacity={0.2}/>
                <stop offset="100%" stopColor="#00F5FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="val" stroke="#00F5FF" strokeWidth={1} fill="url(#overlayGrad)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Grid overlay for tech feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
}
