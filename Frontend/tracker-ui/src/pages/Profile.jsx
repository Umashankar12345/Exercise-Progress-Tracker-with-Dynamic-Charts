import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, MapPin, Mail, Droplets, Footprints, LogOut, Moon, Sun, User as UserIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import api from '../api/axios';

export default function Profile() {
  const { user, token, setAuth, logout } = useStore();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U';
  
  const [isEditing, setIsEditing] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const [editData, setEditData] = useState({ 
    name: user?.name || '', 
    address: user?.address || 'NEW YORK, USA',
    water_goal: user?.water_goal || 3.5,
    steps_goal: user?.steps_goal || 10000,
  });

  const handleSave = async () => {
    try {
      const res = await api.put('/user/profile', editData);
      setAuth(res.data.user, token);
      setIsEditing(false);
      toast.success('Profile details updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Unable to save changes. Please try again.');
    }
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await api.post('/auth/logout');
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Failed to logout cleanly');
      logout();
      navigate('/login');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    toast(`Switched to ${newTheme} mode`, { icon: newTheme === 'dark' ? '🌙' : '☀️' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 max-w-4xl mx-auto min-h-screen pb-24 p-4 md:p-8 bg-[#070B14] text-white relative overflow-hidden"
    >
      {/* Background Glow Mesh */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00F5FF]/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Top Banner (Header) */}
      <motion.div variants={itemVariants} className="rounded-3xl bg-[#0F172A]/70 border border-white/5 p-8 md:p-10 relative overflow-hidden group backdrop-blur-xl shadow-2xl z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-cyan-500/20 transition-all duration-1000" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Avatar and Info */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-1 shadow-2xl shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full rounded-full bg-[#070B14] flex items-center justify-center text-4xl font-black text-white">
                {initials}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-black text-white tracking-tighter">{user?.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-bold text-v2-soft-gray">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                {user?.email}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-v2-soft-gray hover:text-white transition-all shadow-lg flex items-center gap-2 group"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 group-hover:text-yellow-400" /> : <Moon className="w-5 h-5 group-hover:text-blue-400" />}
            </button>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="px-5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          
        </div>
      </motion.div>

      {/* Editable Details Card */}
      <motion.div variants={itemVariants} className="rounded-3xl bg-[#0F172A]/50 border border-white/5 backdrop-blur-xl shadow-xl overflow-hidden relative z-10">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0F172A]/80">
          <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-cyan-400" />
            Profile Configuration
          </h3>
          {isEditing ? (
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-[10px] uppercase tracking-widest font-black rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 transition-all"
            >
              Save Changes
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] uppercase tracking-widest font-black rounded-lg hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <Edit2 className="w-3 h-3" />
              Edit Mode
            </button>
          )}
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Name Configuration */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-v2-soft-gray uppercase tracking-widest flex items-center gap-1.5">
                <UserIcon className="w-3 h-3 text-cyan-400" /> Display Name
              </label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editData.name} 
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-sm font-bold w-full transition-colors"
                />
              ) : (
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-transparent text-white text-sm font-bold w-full">
                  {user?.name}
                </div>
              )}
            </div>

            {/* Address Configuration */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-v2-soft-gray uppercase tracking-widest flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-pink-400" /> Location
              </label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editData.address} 
                  onChange={(e) => setEditData({...editData, address: e.target.value})}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-pink-400 focus:outline-none text-white text-sm font-bold w-full transition-colors"
                  placeholder="e.g. NEW YORK, USA"
                />
              ) : (
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-transparent text-white text-sm font-bold w-full">
                  {user?.address || 'NEW YORK, USA'}
                </div>
              )}
            </div>

            {/* Water Goal Configuration */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-v2-soft-gray uppercase tracking-widest flex items-center gap-1.5">
                <Droplets className="w-3 h-3 text-blue-400" /> Daily Water Goal
              </label>
              {isEditing ? (
                <div className="relative">
                  <input 
                    type="number" 
                    value={editData.water_goal} 
                    onChange={(e) => setEditData({...editData, water_goal: parseFloat(e.target.value) || 0})}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-400 focus:outline-none text-white text-sm font-bold w-full transition-colors"
                    step="0.1" min="0.5" max="10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-v2-soft-gray">Liters</span>
                </div>
              ) : (
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-transparent text-blue-300 text-sm font-bold w-full">
                  {user?.water_goal || 3.5} Liters / day
                </div>
              )}
            </div>

            {/* Steps Goal Configuration */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-v2-soft-gray uppercase tracking-widest flex items-center gap-1.5">
                <Footprints className="w-3 h-3 text-emerald-400" /> Daily Steps Goal
              </label>
              {isEditing ? (
                <div className="relative">
                  <input 
                    type="number" 
                    value={editData.steps_goal} 
                    onChange={(e) => setEditData({...editData, steps_goal: parseInt(e.target.value) || 0})}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-400 focus:outline-none text-white text-sm font-bold w-full transition-colors"
                    step="500" min="1000" max="100000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-v2-soft-gray">Steps</span>
                </div>
              ) : (
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-transparent text-emerald-300 text-sm font-bold w-full">
                  {(user?.steps_goal || 10000).toLocaleString()} Steps / day
                </div>
              )}
            </div>

          </div>
        </div>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B14]/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0F172A] border border-rose-500/30 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(244,63,94,0.15)]"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
                <LogOut className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-black text-white text-center mb-2">Sign Out</h3>
              <p className="text-sm text-v2-soft-gray text-center mb-8">Are you sure you want to sign out of your account?</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-colors shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                >
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
