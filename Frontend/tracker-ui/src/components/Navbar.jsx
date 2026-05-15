import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Share2, Plus, Calendar as CalendarIcon, Menu } from 'lucide-react';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/log': 'Log Workout',
  '/charts': 'Progress Charts',
  '/library': 'Exercise Library',
  '/insights': 'AI Insights',
  '/plan': 'AI Workout Plan',
  '/profile': 'Profile & Goals',
  '/report': 'Monthly Report',
  '/settings': 'Settings',
};

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[pathname] ?? 'FitTrack AI';
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <header className="h-20 bg-surface/80 backdrop-blur-xl border-b border-outline-variant px-4 md:px-8 flex items-center sticky top-0 z-40">
      <button 
        onClick={onMenuClick}
        className="mr-4 p-2 md:hidden text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex flex-col flex-1 min-w-0">
        <h1 className="text-lg md:text-xl font-bold text-on-surface tracking-tight truncate">{title}</h1>
        <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-medium">
          <CalendarIcon className="w-3 h-3" />
          {today}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search analytics..." 
            className="bg-surface-container border border-outline-variant rounded-full py-2 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-64 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 border-l border-outline-variant pl-4">
          <button className="p-2.5 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-all relative group">
            <Bell className="w-5 h-5" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-tertiary rounded-full border-2 border-surface animate-pulse" />
          </button>
          
          <button className="p-2.5 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={() => navigate('/log')}
          className="ml-2 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">NEW SESSION</span>
          <span className="sm:hidden">NEW</span>
        </button>
      </div>
    </header>
  );
}
