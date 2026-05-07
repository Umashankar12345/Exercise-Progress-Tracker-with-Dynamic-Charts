import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, 
  Dumbbell, 
  LineChart, 
  Library, 
  Brain, 
  User 
} from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { path: '/', name: 'Dashboard', icon: <Activity size={20} /> },
    { path: '/log', name: 'Log Workout', icon: <Dumbbell size={20} /> },
    { path: '/charts', name: 'Progress Charts', icon: <LineChart size={20} /> },
    { path: '/library', name: 'Exercise Library', icon: <Library size={20} /> },
    { path: '/insights', name: 'AI Insights', icon: <Brain size={20} /> },
    { path: '/profile', name: 'Profile & Goals', icon: <User size={20} /> },
  ];

  return (
    <nav className="sidebar-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }
        >
          {item.icon}
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
