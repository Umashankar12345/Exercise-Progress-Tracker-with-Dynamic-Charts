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
            <span className="px-4 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/50">
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
                      : 'text-on-surface-variant hover:bg-surface-bright hover:text-on-surface'}
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

      <div className="p-4 border-t border-outline-variant">
        <div 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-xl bg-surface-container hover:bg-surface-bright border border-outline-variant transition-colors cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-white shadow-inner">
            {initials}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold truncate text-on-surface">{user?.name ?? 'Guest User'}</span>
            <span className="text-[10px] text-primary font-medium">Pro Athlete</span>
          </div>
          <LogOut className="w-4 h-4 text-on-surface-variant group-hover:text-red-400 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
