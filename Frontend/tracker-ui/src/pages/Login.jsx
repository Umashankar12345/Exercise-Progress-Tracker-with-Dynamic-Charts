import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import useStore from '../store/useStore';
import photography from '../assets/stitch/photography.png';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useStore((s) => s.setAuth);

  const [mode, setMode]       = useState('login'); // 'login' | 'register'
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = mode === 'login'
        ? { email, password }
        : { name, email, password };

      const { data } = await api.post(`/auth/${mode}`, payload);
      const token = data.access_token || data.token;
      setAuth(data.user, token);
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach server. Make sure the backend is running.');
      } else if (err.response.status === 422) {
        const errors = err.response.data?.errors;
        setError(errors ? Object.values(errors).flat()[0] : (err.response.data?.message || 'Validation failed.'));
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side: Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src={photography} 
          alt="Fitness Training" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute bottom-12 left-12 right-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-2xl shadow-primary/40">
              <Zap className="text-white w-7 h-7" fill="white" />
            </div>
            <span className="text-3xl font-bold tracking-tighter text-white">
              Fit<span className="text-primary">Track</span> AI
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Master your performance with <br />
            <span className="text-primary">AI-driven analytics.</span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-md font-medium mb-8">
            Join thousands of professional athletes who use data to optimize their strength and recovery.
          </p>

          {/* New Testimonial & Avatars */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-high/40 backdrop-blur-md border border-outline-variant/30 max-w-lg">
            <div className="flex -space-x-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-bold text-primary">JD</div>
              <div className="w-10 h-10 rounded-full bg-secondary/20 border-2 border-background flex items-center justify-center text-xs font-bold text-secondary">MT</div>
              <div className="w-10 h-10 rounded-full bg-tertiary/20 border-2 border-background flex items-center justify-center text-xs font-bold text-tertiary">SR</div>
              <div className="w-10 h-10 rounded-full bg-surface-bright border-2 border-background flex items-center justify-center text-[10px] font-bold text-on-surface">+10k</div>
            </div>
            <div>
              <div className="flex text-tertiary text-[10px] mb-1">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="text-sm font-medium text-white italic">"Increased my clean & jerk volume by 18% in 3 months."</p>
              <p className="text-xs text-on-surface-variant mt-1">— Marcus T., Competitive CrossFitter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-20">
        <div className="w-full max-w-md animate-in slide-in-from-right duration-700">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5" fill="white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-on-surface">FitTrack AI</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-on-surface-variant font-medium">
              {mode === 'login' 
                ? 'Enter your credentials to access your dashboard' 
                : 'Enter your details to start your journey today'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium animate-in fade-in zoom-in duration-300">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full bg-surface-container border border-outline-variant rounded-xl py-3.5 pl-12 pr-4 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-surface-container border border-outline-variant rounded-xl py-3.5 pl-12 pr-4 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => toast.success('Password reset link sent to your email!')}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl py-3.5 pl-12 pr-12 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center pt-1">
                <input 
                  id="remember_me" 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary/20 focus:ring-offset-0 transition-colors cursor-pointer" 
                />
                <label htmlFor="remember_me" className="ml-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest cursor-pointer select-none">
                  Remember this device
                </label>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute w-full border-t border-outline-variant"></div>
              <span className="relative bg-background px-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center gap-2 border border-outline-variant bg-surface-container hover:bg-surface-bright text-sm font-medium text-on-surface py-3 rounded-xl transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span>Google</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-2 border border-outline-variant bg-surface-container hover:bg-surface-bright text-sm font-medium text-on-surface py-3 rounded-xl transition-colors">
                <span>🍏</span>
                <span>Apple</span>
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-on-surface-variant font-medium text-sm">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-primary hover:underline font-bold"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
