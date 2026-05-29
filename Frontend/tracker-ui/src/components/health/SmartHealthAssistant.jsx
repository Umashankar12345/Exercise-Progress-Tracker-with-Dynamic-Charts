import React, { useState } from 'react';
import { Bot, Send, User } from 'lucide-react';

export default function SmartHealthAssistant() {
  const [messages] = useState([
    { role: 'ai', text: 'Good morning. Your HRV dropped 15% last night. Avoid high-intensity training today.' },
  ]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2 scrollbar-hide flex flex-col justify-end">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'ai' ? 'items-start' : 'items-start flex-row-reverse'}`}>
            <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${m.role === 'ai' ? 'bg-[#3B82F6]/20' : 'bg-white/10'}`}>
              {m.role === 'ai' ? <Bot className="w-3.5 h-3.5 text-[#3B82F6]" /> : <User className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className={`p-2 rounded-lg text-[10px] ${m.role === 'ai' ? 'bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#E2E8F0]' : 'bg-white/10 text-white border border-white/5'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="relative">
        <input 
          type="text" 
          placeholder="Ask health AI..." 
          className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-2 pl-3 pr-8 text-[10px] text-white focus:outline-none focus:border-[#3B82F6]/50 transition-colors placeholder:text-white/30"
          disabled
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 cursor-not-allowed">
          <Send className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}
