import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
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
          <p className="text-on-surface-variant text-lg max-w-md font-medium">
            Join thousands of professional athletes who use data to optimize their strength and recovery.
          </p>
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
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl py-3.5 pl-12 pr-4 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>

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
