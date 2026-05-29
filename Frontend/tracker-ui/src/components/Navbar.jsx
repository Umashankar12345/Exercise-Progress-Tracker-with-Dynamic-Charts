import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Share2, Plus, Calendar as CalendarIcon, Menu, Flame, Droplet, Moon, Sun, Zap, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
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
  const { theme, toggleTheme, logout, exerciseLibrary } = useStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[pathname] ?? 'FitTrack AI';
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  const [notifications, setNotifications] = useState([]);
  const [streak, setStreak] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  // Spotlight Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  const confirmLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    logout();
    toast.success('Logged out successfully. See you soon!');
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

  const fetchStreak = async () => {
    try {
      const res = await api.get('/user/streak');
      setStreak(res.data?.streak ?? 0);
    } catch (err) {
      console.error('Error fetching user streak:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchStreak();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchStreak();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (theme === 'light') document.documentElement.classList.add('light-mode');
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      // Notification dropdown click outside
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      // Spotlight search click outside
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const navItems = [
    { name: 'Dashboard Analytics', path: '/' },
    { name: 'Log Workout Session', path: '/log' },
    { name: 'Exercise Reference Library', path: '/library' },
    { name: 'Jarvis AI Coaching Center', path: '/jarvis' },
    { name: 'AI Periodization Workout Plan', path: '/plan' },
    { name: 'Monthly Performance Report', path: '/report' },
    { name: 'Health & Body Metrics Logs', path: '/health' },
    { name: 'Profile & Goal Tuning', path: '/profile' },
  ];

  const filteredNav = searchQuery 
    ? navItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : navItems.slice(0, 4);

  const filteredExercises = searchQuery && Array.isArray(exerciseLibrary)
    ? exerciseLibrary.filter(ex => 
        ex.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ex.muscle_group?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

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
        className="mr-4 p-2 md:hidden text-white/80 hover:text-white transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex flex-col flex-1 min-w-0 select-none">
        <h1 className="text-lg md:text-xl font-bold text-white tracking-tight truncate">{title}</h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-300 font-medium mt-0.5">
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5 text-secondary" />
            {today}
          </span>
          <span className="w-1 h-1 rounded-full bg-outline-variant hidden sm:inline" />
          <span className="flex items-center gap-1.5 text-orange-400 font-black tracking-wider uppercase bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.1)]">
            <Flame className="w-3.5 h-3.5 fill-orange-500 animate-pulse filter drop-shadow-[0_0_4px_rgba(249,115,22,0.6)]" />
            STREAK: {streak} {streak === 1 ? 'DAY' : 'DAYS'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-4">
        <div className="relative group hidden md:block" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search pages, exercises..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="bg-surface-container border border-outline-variant rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-64 focus:w-80 transition-all duration-300 font-medium"
          />
          
          {/* Spotlight Search Dropdown */}
          {isSearchFocused && (
            <div className="absolute right-0 mt-3 w-96 bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 space-y-4 animate-in slide-in-from-top-2 duration-200 backdrop-blur-xl">
              {/* Category: System Pages */}
              {filteredNav.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase text-primary tracking-widest block">📁 System Nodes</span>
                  <div className="space-y-1">
                    {filteredNav.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          navigate(item.path);
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-all flex items-center justify-between group/nav"
                      >
                        <span>{item.name}</span>
                        <span className="text-[9px] font-bold text-slate-500 group-hover/nav:text-primary transition-colors">GO ➔</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category: Exercise Library */}
              {filteredExercises.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase text-secondary tracking-widest block">🏋️ Reference Exercises</span>
                  <div className="space-y-1">
                    {filteredExercises.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => {
                          navigate(`/library/${ex.id}`);
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-all flex items-center justify-between group/ex"
                      >
                        <div className="flex flex-col">
                          <span>{ex.name}</span>
                          <span className="text-[8px] text-slate-500 uppercase tracking-wider">{ex.muscle_group}</span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 group-hover/ex:text-secondary transition-colors">VIEW ➔</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {filteredNav.length === 0 && filteredExercises.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No nodes match your query</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 border-l border-outline-variant pl-2 sm:pl-4">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 md:p-2.5 rounded-full bg-surface-container border border-outline-variant text-white/80 hover:text-white hover:bg-surface-bright transition-all relative group"
            >
              <Bell className="w-4.5 h-4.5 md:w-5 md:h-5" />
              {unreadCount > 0 && (
                <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full border border-surface text-[8px] font-black text-white flex items-center justify-center animate-pulse">
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
            onClick={toggleTheme}
            className="p-2 md:p-2.5 rounded-full bg-surface-container border border-outline-variant text-white/80 hover:text-white hover:bg-surface-bright transition-all ml-1 sm:ml-2 shadow-inner"
            title="Toggle Light/Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 md:w-5 md:h-5 text-yellow-400" /> : <Moon className="w-4.5 h-4.5 md:w-5 md:h-5 text-indigo-400" />}
          </button>
        </div>

        <button 
          onClick={() => navigate('/log')}
          className="ml-1 sm:ml-2 flex items-center gap-1.5 sm:gap-2 bg-primary hover:bg-primary/90 text-white dark:text-white px-2.5 sm:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-black shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
          <span className="hidden sm:inline">NEW SESSION</span>
          <span className="sm:hidden">NEW</span>
        </button>

        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="ml-1 sm:ml-2 flex items-center gap-1.5 sm:gap-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white px-2.5 sm:px-4 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-black transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-red-500/5 md:shadow-red-500/30"
          title="Log Out"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
          <span className="hidden sm:inline">LOG OUT</span>
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
