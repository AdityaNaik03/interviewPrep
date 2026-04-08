import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Target, Star, Trophy, MessageSquare, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost/smart-ai-interview-prep/backend/api/dashboard.php', {
          credentials: 'include'
        });
        const result = await res.json();
        
        if (result.success) {
          setData(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading your statistics...</p>
      </div>
    );
  }

  return (
    <div>
      <header className="page-header">
        <h1>Welcome back, <span className="gradient-text">{data?.user_name || user?.name || 'User'}</span> 👋</h1>
        <p>Ready to crush your next interview?</p>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Target size={24} /></div>
          <h3>Total Interviews</h3>
          <p className="value">{data?.total_interviews || 0}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)' }}><Star size={24} /></div>
          <h3>Average Score</h3>
          <p className="value">{data?.avg_score ? parseFloat(data.avg_score).toFixed(1) : '0.0'}/10</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}><Trophy size={24} /></div>
          <h3>Best Score</h3>
          <p className="value">{data?.best_score || 'N/A'}/10</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(192, 132, 252, 0.1)', color: '#C084FC' }}><MessageSquare size={24} /></div>
          <h3>Total Answers</h3>
          <p className="value">{data?.total_answers || 0}</p>
        </div>
      </section>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Quick Actions</h2>
      <section className="features-grid">
        <Link to="/interview" className="feature-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
          <div className="icon-wrapper" style={{ display: 'inline-block', padding: '1rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '12px', alignSelf: 'flex-start' }}>
            <Target size={28} />
          </div>
          <div style={{ flex: 1, marginTop: '1rem' }}>
            <h3>Start Mock Interview</h3>
            <p>Practice with AI using realistic questions and receive instant detailed feedback.</p>
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 500, paddingTop: '1rem' }}>
            <span>Begin Session</span>
            <ArrowRight size={16} />
          </div>
        </Link>

        <Link to="/resume" className="feature-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
          <div className="icon-wrapper" style={{ display: 'inline-block', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', borderRadius: '12px', alignSelf: 'flex-start' }}>
            <Star size={28} />
          </div>
          <div style={{ flex: 1, marginTop: '1rem' }}>
            <h3>Resume Analyzer</h3>
            <p>Get a detailed ATS score and tailored tips to make your CV stand out.</p>
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontWeight: 500, paddingTop: '1rem' }}>
            <span>Scan Resume</span>
            <ArrowRight size={16} />
          </div>
        </Link>
      </section>
    </div>
  );
};

export default Dashboard;
