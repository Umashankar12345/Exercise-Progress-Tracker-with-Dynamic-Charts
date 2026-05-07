import React from 'react';
import { Outlet } from 'react-router-dom';
import { Activity } from 'lucide-react';
import Navigation from './Navigation';

const Layout = () => {
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Activity size={28} />
          <span>FitTrack AI</span>
        </div>
        <Navigation />
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="container animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
