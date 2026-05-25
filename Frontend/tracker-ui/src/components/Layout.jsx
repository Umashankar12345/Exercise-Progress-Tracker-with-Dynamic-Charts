import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import JarvisFloating from './JarvisFloating';
import useStore from '../store/useStore';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  // Global Data Pre-fetch (SWR Architecture)
  const { 
    fetchFeed, 
    fetchArenaChallenges, 
    fetchArenaLeaderboard, 
    fetchExerciseLibrary,
    fetchDashboardAnalytics,
    fetchHeatmapData
  } = useStore();

  React.useEffect(() => {
    // Fire all fetchers silently in the background when the app loads
    // so that when a user clicks a tab, the data is instantly available
    fetchDashboardAnalytics(true);
    fetchHeatmapData();
    fetchFeed(true);
    fetchArenaChallenges(true);
    fetchArenaLeaderboard(true);
    fetchExerciseLibrary(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-background selection:bg-primary/30 selection:text-primary relative overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on all, translated on mobile */}
      <div className={`
        fixed top-0 left-0 h-screen z-[70] transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-[280px]'}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar 
          isCollapsed={isCollapsed} 
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>
      
      {/* Main Content Area */}
      <div className={`
        flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'md:pl-20' : 'md:pl-[280px]'}
      `}>
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 animate-in fade-in duration-500">
          <Outlet />
        </main>
      </div>
      {/* Jarvis Floating AI Button - visible on all pages */}
      <JarvisFloating />
    </div>
  );
}
