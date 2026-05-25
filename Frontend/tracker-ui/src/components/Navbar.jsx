import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Share2, Plus, Calendar as CalendarIcon, Menu, Flame, Droplet, Moon, Sun, Zap, LogOut } from 'lucide-react';
import api from '../api/axios';
import useStore from '../store/useStore';

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
  const { theme, toggleTheme, logout } = useStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[pathname] ?? 'FitTrack AI';
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  const confirmLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    logout();
    navigate('/login');
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (theme === 'light') document.documentElement.classList.add('light-mode');
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FitTrack AI',
          text: 'Check out my fitness progress on FitTrack AI!',
          url: window.location.origin,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.origin);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'streak': return <Flame className="w-4 h-4 text-red-400" />;
      case 'hydration': return <Droplet className="w-4 h-4 text-blue-400" />;
      case 'sleep': return <Moon className="w-4 h-4 text-purple-400" />;
      default: return <Zap className="w-4 h-4 text-[#00E5FF]" />;
    }
  };

  return (
    <>
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
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2.5 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-all relative group"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <div className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 rounded-full border border-surface text-[9px] font-black text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </div>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 space-y-4 animate-in slide-in-from-top-2 duration-205">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-xs font-black uppercase text-white tracking-widest">Alert Center</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-[9px] font-black uppercase text-primary tracking-widest hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2.5 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <p className="text-[10px] text-center text-on-surface-variant font-medium py-6 uppercase tracking-wider">No active warnings</p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                        className={`flex gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          n.is_read 
                            ? 'bg-transparent border-white/5 opacity-55' 
                            : 'bg-white/5 border-primary/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-surface-bright flex items-center justify-center shrink-0 h-fit">
                          {getNotificationIcon(n.type)}
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[11px] font-black text-white leading-tight">{n.title}</h4>
                            {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                          </div>
                          <p className="text-[10px] text-v2-soft-gray font-medium leading-relaxed">{n.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleShare}
            className="p-2.5 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
          
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-all ml-2 shadow-inner"
            title="Toggle Light/Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>
        </div>

        <button 
          onClick={() => navigate('/log')}
          className="ml-2 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white dark:text-[#060B16] px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-black shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">NEW SESSION</span>
          <span className="sm:hidden">NEW</span>
        </button>

        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="ml-2 flex items-center gap-2 bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 px-3 md:px-4 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-black transition-all hover:-translate-y-0.5 active:translate-y-0 border border-red-200 dark:border-red-500/20 shadow-sm"
        >
          <LogOut className="w-4 h-4 stroke-[3]" />
          <span className="hidden md:inline">LOG OUT</span>
        </button>
      </div>
    </header>

    {/* Logout Confirmation Modal */}
    {showLogoutConfirm && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
        <div className="bg-[#060B16] border border-[#00E5FF]/20 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_40px_rgba(34,211,238,0.15)] flex flex-col items-center text-center gap-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]">
            <LogOut className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-wide">Ready to Leave?</h3>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              You are about to log out of your FitTrack AI session.
            </p>
          </div>
          <div className="flex gap-4 w-full mt-2">
            <button 
              onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 py-3.5 px-4 rounded-xl font-black text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all uppercase tracking-widest text-[10px]"
            >
              Cancel
            </button>
            <button 
              onClick={confirmLogout}
              className="flex-1 py-3.5 px-4 rounded-xl font-black text-white bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all uppercase tracking-widest text-[10px]"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
