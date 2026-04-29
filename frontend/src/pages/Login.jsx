import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        'http://localhost/smart-ai-interview-prep/backend/api/auth.php?action=login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        }
      );
      const data = await res.json();

      if (data.success) {
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('An error occurred while communicating with the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Decorative blobs */}
      <div style={{
        position: 'fixed', top: '-120px', left: '-80px',
        width: '450px', height: '450px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-100px', right: '-60px',
        width: '380px', height: '380px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="auth-card">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '68px', height: '68px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            boxShadow: '0 12px 28px rgba(79,70,229,0.45)',
            marginBottom: '1.25rem',
          }}>
            <Zap size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Sign in to continue your interview prep
          </p>
        </div>

        {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email" id="email" className="form-control"
                value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="you@example.com"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Forgot?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password" id="password" className="form-control"
                value={password} onChange={e => setPassword(e.target.value)}
                required placeholder="••••••••"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: '0.5rem', width: '100%', fontSize: '1rem', padding: '0.95rem' }}
          >
            {loading ? 'Signing in…' : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#818CF8', fontWeight: 600 }}>Create one now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
