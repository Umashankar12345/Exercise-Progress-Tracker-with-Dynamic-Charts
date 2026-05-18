import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  LineChart, 
  Dumbbell, 
  Bot, 
  Calendar, 
  Target, 
  FileBarChart, 
  Settings,
  LogOut,
  Zap,
  Heart,
  X
} from 'lucide-react';
import useStore from '../store/useStore';
import api from '../api/axios';

const NAV_GROUPS = [
  {
    title: 'Main',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/log', label: 'Log Workout', icon: ClipboardList },
      { to: '/charts', label: 'Progress Charts', icon: LineChart },
      { to: '/library', label: 'Exercise Library', icon: Dumbbell },
      { to: '/health', label: 'Health & BMI', icon: Heart },
    ]
  },
  {
    title: 'AI Features',
    items: [
      { to: '/insights', label: 'AI Insights', icon: Bot, badge: '3' },
      { to: '/plan', label: 'Workout Plan', icon: Calendar, badge: 'AI' },
      { to: '/profile', label: 'Profile & Goals', icon: Target },
    ]
  },
  {
    title: 'Reports',
    items: [
      { to: '/report', label: 'Monthly Report', icon: FileBarChart },
      { to: '/settings', label: 'Settings', icon: Settings },
    ]
  }
];

export default function Sidebar({ onClose }) {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-surface border-r border-outline-variant flex flex-col fixed top-0 left-0 z-50">
      <div className="p-6 border-b border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="text-white w-6 h-6" fill="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-on-surface">
              Fit<span className="text-primary">Track</span> AI
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="md:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-8 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-2">
            <span className="px-4 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/50 mt-2 pt-2 border-t border-outline-variant/30 first:border-0 first:mt-0 first:pt-0">
              {group.title}
            </span>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? 'bg-primary/10 text-primary font-medium border border-primary/20' 
                      : 'text-on-surface-variant/60 hover:bg-surface-bright hover:text-on-surface'}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${item.badge === 'AI' ? 'text-secondary' : ''}`} />
                  <span className="text-sm">{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badge === 'AI' ? 'bg-secondary text-surface' : 'bg-primary text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-outline-variant/80">
        <div 
          onClick={handleLogout}
          className="flex items-center justify-between p-2 rounded-xl bg-surface-container-high/30 border border-outline-variant/50 backdrop-blur-sm group hover:bg-surface-container-high/50 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-secondary text-white font-bold text-sm ring-2 ring-background">
              {initials}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-secondary ring-2 ring-background animate-pulse"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-on-surface tracking-wide truncate">{user?.name ?? 'Guest User'}</span>
              <span className="text-[10px] font-medium text-secondary uppercase tracking-widest">Pro Athlete</span>
            </div>
          </div>
          
          <button className="text-on-surface-variant hover:text-red-400 p-1.5 rounded-lg hover:bg-surface-bright transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
