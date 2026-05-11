import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useStore from '../store/useStore';

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
      // Backend returns access_token (Sanctum plain text token)
      const token = data.access_token || data.token;
      setAuth(data.user, token);
      navigate('/');
    } catch (err) {
      if (!err.response) {
        // Network error – server unreachable
        setError('Cannot reach server. Make sure the backend is running on http://127.0.0.1:8000');
      } else if (err.response.status === 422) {
        // Validation errors
        const errors = err.response.data?.errors;
        if (errors) {
          const firstMsg = Object.values(errors).flat()[0];
          setError(firstMsg);
        } else {
          setError(err.response.data?.message || 'Validation failed.');
        }
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 400, background: 'var(--s1)', border: '1px solid var(--border)',
        borderRadius: 20, padding: 36, animation: 'fadeUp .4s ease both',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 38, height: 38, background: 'var(--accent)', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>⚡</div>
          <span style={{ fontSize: 22, fontWeight: 700 }}>
            Fit<span style={{ color: 'var(--accent)' }}>Track</span> AI
          </span>
        </div>

        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
          {mode === 'login' ? 'Welcome back 👋' : 'Create account 🚀'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24 }}>
          {mode === 'login'
            ? 'Sign in to your account to continue'
            : 'Start tracking your fitness journey'}
        </div>

        {error && (
          <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <div className="field">
              <label>Full Name</label>
              <input type="text" placeholder="Arjun Rao" value={name}
                onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)} required minLength={8} />
          </div>

          <button className="btn-submit" type="submit" disabled={loading} style={{ marginTop: 6 }}>
            {loading
              ? <><div className="spinner"></div> {mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
              : mode === 'login' ? '🔐 Sign In' : '🚀 Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text2)' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}
          >
            {mode === 'login' ? 'Register' : 'Sign In'}
          </span>
        </div>
      </div>
    </div>
  );
}
