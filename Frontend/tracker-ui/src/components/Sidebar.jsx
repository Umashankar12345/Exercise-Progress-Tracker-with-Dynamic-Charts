import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  LineChart, 
  Dumbbell, 
  Bot, 
  Calendar, 
  Target, 
  Settings,
  LogOut,
  Zap,
  X,
  Activity,
  HeartPulse,
  Users,
  Eye,
  Brain,
  Trophy,
  FileText,
  Download,
  User,
  ChevronLeft,
  ChevronRight,
  Flame,
  BarChart3
} from 'lucide-react';
import useStore from '../store/useStore';
import api from '../api/axios';
import { getEcho } from '../lib/echo';

const NAV_GROUPS = [
  {
    title: 'Main',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/enterprise', label: 'Analytics', icon: LineChart },
      { to: '/ai-workout', label: 'AI Workout', icon: Activity },
      { to: '/health-intelligence', label: 'Health', icon: HeartPulse },
      { to: '/calendar', label: 'Calendar', icon: Calendar },
    ]
  },
  {
    title: 'AI Features',
    items: [
      { to: '/ai-chat', label: 'Jarvis AI', icon: Bot },
      { to: '/insights', label: 'AI Insights', icon: Brain },
      { to: '/futuristic', label: 'Vision AI', icon: Eye },
      { to: '/intelligence', label: 'Recovery AI', icon: Zap },
    ]
  },
  {
    title: 'Fitness',
    items: [
      { to: '/log', label: 'Log Workout', icon: ClipboardList },
      { to: '/library', label: 'Exercise Library', icon: Dumbbell },
      { to: '/charts', label: 'Progress Charts', icon: BarChart3 },
      { to: '/health', label: 'Heatmap', icon: Flame },
    ]
  },
  {
    title: 'Social',
    items: [
      { to: '/social', label: 'Community', icon: Users },
      { to: '/social?tab=challenges', label: 'Challenges', icon: Target },
      { to: '/social?tab=leaderboard', label: 'Leaderboard', icon: Trophy },
    ]
  },
  {
    title: 'Reports',
    items: [
      { to: '/report', label: 'Monthly Report', icon: FileText },
      { to: '/report?action=export', label: 'Export PDF', icon: Download },
    ]
  },
  {
    title: 'Settings',
    items: [
      { to: '/profile', label: 'Profile', icon: User },
      { to: '/settings', label: 'Settings', icon: Settings },
    ]
  }
];

export default function Sidebar({ isCollapsed, onToggleCollapse, onClose }) {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U';
  const [unreadCount, setUnreadCount] = React.useState(0);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/insights/unread-count');
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.error('Error fetching unread insights count:', err);
    }
  };

  React.useEffect(() => {
    if (!user) return;
    
    // Fetch initial
    fetchUnreadCount();
    
    // Setup private Reverb Echo listener
    const echoInstance = getEcho();
    echoInstance.private(`user.${user.id}`)
      .listen('.WorkoutLogged', (e) => {
        if (e.increment_insights) {
          setUnreadCount(prev => prev + 1);
        }
      });

    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => {
      clearInterval(interval);
      if (echoInstance && typeof echoInstance.disconnect === 'function') {
        echoInstance.disconnect();
      }
    };
  }, [user]);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout();
    navigate('/login');
  };

  return (
    <aside className={`h-screen bg-[#060B16]/95 border-r border-cyan-500/10 flex flex-col justify-between py-6 overflow-y-auto transition-all duration-300 ease-in-out scrollbar-none ${isCollapsed ? 'w-20 px-2' : 'w-[280px] px-4'}`}>
      
      {/* Top Header */}
      <div className={`flex items-center justify-between pb-6 border-b border-white/5 mb-4 ${isCollapsed ? 'flex-col gap-4 px-0' : 'px-3'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Zap className="text-white w-5 h-5 fill-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-widest text-white uppercase">
                Fit<span className="text-cyan-400">Track</span> AI
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {/* Collapse Button - Desktop Only */}
          <button 
            onClick={onToggleCollapse}
            className="hidden md:flex p-2 rounded-xl bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white hover:bg-cyan-500/10 transition-colors shadow-inner"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          
          {/* Close Button - Mobile Only */}
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-[#94A3B8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 flex flex-col gap-6 overflow-y-auto scrollbar-none py-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-1">
            {isCollapsed ? (
              <div className="border-t border-white/5 my-2 w-8 mx-auto" />
            ) : (
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#475569] font-black mb-2 mt-4 px-3">
                {group.title}
              </p>
            )}
            
            <div className="flex flex-col gap-1.5">
              {group.items.map((item) => {
                const badgeValue = item.to === '/insights' 
                  ? (unreadCount > 0 ? String(unreadCount) : null) 
                  : item.badge;
                
                // Custom check for active state considering query params
                const isActive = item.to === '/' 
                  ? location.pathname === '/' 
                  : item.to.includes('?') 
                    ? (location.pathname + location.search) === item.to
                    : (location.pathname === item.to && !location.search.includes('tab=') && !location.search.includes('action='));

                return (
                  <NavLink
                    key={`${item.to}-${item.label}`}
                    to={item.to}
                    onClick={onClose}
                    className={`
                      group flex items-center rounded-2xl transition-all duration-300 relative
                      ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5 gap-4 hover:translate-x-1'}
                      hover:text-white hover:bg-cyan-500/10
                      ${isActive 
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] text-white font-medium' 
                        : 'text-[#94A3B8]'}
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0
                      ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-[#94A3B8] group-hover:bg-cyan-500/20 group-hover:text-white'}
                    `}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    
                    {!isCollapsed && (
                      <span className="text-sm font-semibold tracking-wide truncate">{item.label}</span>
                    )}

                    {/* Badge */}
                    {badgeValue && !isCollapsed && (
                      <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full ${
                        badgeValue === 'AI' ? 'bg-cyan-400 text-[#060B16]' : 'bg-[#E11D48] text-white shadow-[0_0_10px_rgba(225,29,72,0.4)]'
                      }`}>
                        {badgeValue}
                      </span>
                    )}

                    {/* Tooltip for Collapsed State */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#0F172A] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                        {item.label}
                        {badgeValue && (
                          <span className="ml-2 px-1.5 py-0.5 bg-cyan-400 text-[#060B16] rounded-full text-[8px]">
                            {badgeValue}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Area */}
      <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-white/5">
        
        {/* AI Orb */}
        <div className={`flex flex-col items-center justify-center transition-all duration-300 ${isCollapsed ? 'my-2' : 'p-4 rounded-2xl bg-cyan-950/10 border border-cyan-500/10 my-2 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]'}`}>
          <div className="relative flex items-center justify-center w-12 h-12">
            <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-ping" />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-75 blur-sm" style={{ animation: 'spin 8s linear infinite' }} />
            <div className="relative w-8 h-8 rounded-full bg-[#060B16] border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="mt-2 text-center">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400 animate-pulse">AI Engine Online</span>
            </div>
          )}
        </div>

        {/* User Profile Card */}
        <div className={`p-2 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm group/profile hover:bg-white/[0.04] transition-all duration-300 cursor-pointer relative ${isCollapsed ? 'flex justify-center' : 'flex items-center justify-between'}`}>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 text-white font-bold text-sm ring-2 ring-cyan-500/30">
              {initials}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#060B16] animate-pulse"></span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white tracking-wide truncate">{user?.name ?? 'Guest User'}</span>
                <span className="text-[9px] font-medium text-cyan-400 uppercase tracking-widest">Level 12 • Streak 5🔥</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Tooltip for Collapsed Profile Logout */}
          {isCollapsed && (
            <div 
              onClick={handleLogout}
              className="absolute left-full ml-3 p-3 rounded-xl bg-[#0F172A] border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover/profile:opacity-100 transition-opacity z-[100] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:bg-red-500/10"
            >
              Log Out
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
