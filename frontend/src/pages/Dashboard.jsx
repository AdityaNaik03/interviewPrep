import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Target, Star, Trophy, MessageSquare, ArrowRight, Mic2, FileText } from 'lucide-react';

const STAT_CONFIG = [
  {
    key:      'total_interviews',
    label:    'Total Interviews',
    icon:     Target,
    gradient: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
    shadow:   'rgba(79,70,229,0.4)',
    blob:     '#4F46E5',
    format:   v => v || 0,
  },
  {
    key:      'avg_score',
    label:    'Average Score',
    icon:     Star,
    gradient: 'linear-gradient(135deg,#059669,#047857)',
    shadow:   'rgba(5,150,105,0.4)',
    blob:     '#059669',
    format:   v => v ? `${parseFloat(v).toFixed(1)}/10` : '0.0/10',
  },
  {
    key:      'best_score',
    label:    'Best Score',
    icon:     Trophy,
    gradient: 'linear-gradient(135deg,#D97706,#B45309)',
    shadow:   'rgba(217,119,6,0.4)',
    blob:     '#D97706',
    format:   v => v ? `${v}/10` : 'N/A',
  },
  {
    key:      'total_answers',
    label:    'Total Answers',
    icon:     MessageSquare,
    gradient: 'linear-gradient(135deg,#7C3AED,#6D28D9)',
    shadow:   'rgba(124,58,237,0.4)',
    blob:     '#7C3AED',
    format:   v => v || 0,
  },
];

const QUICK_ACTIONS = [
  {
    to: '/interview',
    icon: Mic2,
    label: 'Start Mock Interview',
    desc:  'Practice with AI using realistic questions and receive instant detailed feedback.',
    cta:   'Begin Session',
    gradient: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
    shadow:   'rgba(79,70,229,0.35)',
    blob:     '#4F46E5',
  },
  {
    to: '/resume',
    icon: FileText,
    label: 'Resume Analyzer',
    desc:  'Get a detailed ATS score and tailored tips to make your CV stand out.',
    cta:   'Scan Resume',
    gradient: 'linear-gradient(135deg,#D97706,#B45309)',
    shadow:   'rgba(217,119,6,0.35)',
    blob:     '#D97706',
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost/smart-ai-interview-prep/backend/api/dashboard.php', { credentials: 'include' })
      .then(r => r.json())
      .then(r => { if (r.success) setData(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <p>Loading your statistics…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <header className="page-header">
        <h1>
          Welcome back,{' '}
          <span className="gradient-text">{data?.user_name || user?.name || 'User'}</span> 👋
        </h1>
        <p>Ready to crush your next interview? Here's your snapshot.</p>
      </header>

      {/* Stats */}
      <section className="stats-grid">
        {STAT_CONFIG.map(({ key, label, icon: Icon, gradient, shadow, blob, format }) => (
          <div
            key={key}
            className="stat-card"
            style={{
              background: `linear-gradient(145deg, rgba(19,29,46,0.9), rgba(11,17,32,0.9))`,
              borderColor: 'var(--glass-border)',
              boxShadow: `0 8px 32px -8px ${shadow}`,
            }}
          >
            {/* Blob */}
            <div className="blob" style={{ background: blob }} />

            {/* Icon */}
            <div className="stat-icon" style={{ background: gradient, boxShadow: `0 6px 18px ${shadow}` }}>
              <Icon size={22} />
            </div>

            <h3>{label}</h3>
            <p className="value">{format(data?.[key])}</p>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem' }}>Quick Actions</h2>
      <section className="features-grid">
        {QUICK_ACTIONS.map(({ to, icon: Icon, label, desc, cta, gradient, shadow, blob }) => (
          <Link
            key={to}
            to={to}
            className="feature-card"
            style={{
              boxShadow: `0 4px 20px -6px ${shadow}`,
              borderColor: 'var(--glass-border)',
            }}
          >
            {/* Blob */}
            <div style={{
              position: 'absolute', top: '-30px', right: '-30px',
              width: '110px', height: '110px', borderRadius: '50%',
              background: blob, opacity: 0.1,
              transition: 'transform 0.4s ease',
            }} />

            {/* Icon badge */}
            <div style={{
              display: 'inline-flex', padding: '0.875rem',
              background: gradient, borderRadius: '16px',
              alignSelf: 'flex-start',
              boxShadow: `0 8px 20px -4px ${shadow}`,
              marginBottom: '0.5rem',
            }}>
              <Icon size={26} color="white" />
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '0.4rem' }}>{label}</h3>
              <p>{desc}</p>
            </div>

            <div style={{
              marginTop: '1.25rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontWeight: 600, fontSize: '0.9rem',
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              <span>{cta}</span>
              <ArrowRight size={16} style={{ WebkitTextFillColor: 'initial', color: 'currentColor' }} />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
