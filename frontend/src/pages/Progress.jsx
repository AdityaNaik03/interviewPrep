import { useState, useEffect } from 'react';
import { Activity, TrendingUp, BarChart2, Target, Award } from 'lucide-react';

const SCORE_GRADIENTS = [
  { from: '#4F46E5', to: '#7C3AED' },
  { from: '#0891B2', to: '#0E7490' },
  { from: '#059669', to: '#047857' },
  { from: '#D97706', to: '#B45309' },
  { from: '#DC2626', to: '#B91C1C' },
  { from: '#7C3AED', to: '#6D28D9' },
];

function scoreColor(score) {
  if (score >= 8) return { from: '#059669', to: '#047857' };
  if (score >= 6) return { from: '#4F46E5', to: '#7C3AED' };
  if (score >= 4) return { from: '#D97706', to: '#B45309' };
  return { from: '#DC2626', to: '#B91C1C' };
}

const Progress = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost/smart-ai-interview-prep/backend/api/progress.php', { credentials: 'include' })
      .then(r => r.json())
      .then(r => { if (r.success) setData(r); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <p>Loading your analytics…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Award size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
        <p>No progress data yet. Complete an interview to see analytics here.</p>
      </div>
    );
  }

  const { by_type, performance } = data;

  const SUMMARY_CARDS = [
    {
      label: 'Total Answers',
      value: performance?.total_answers || 0,
      icon: Activity,
      gradient: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
      shadow: 'rgba(79,70,229,0.4)',
    },
    {
      label: 'Highest Score',
      value: performance?.max_score ? parseFloat(performance.max_score).toFixed(1) : 'N/A',
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg,#059669,#047857)',
      shadow: 'rgba(5,150,105,0.4)',
    },
    {
      label: 'Lowest Score',
      value: performance?.min_score ? parseFloat(performance.min_score).toFixed(1) : 'N/A',
      icon: BarChart2,
      gradient: 'linear-gradient(135deg,#DC2626,#B91C1C)',
      shadow: 'rgba(220,38,38,0.4)',
    },
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1 className="gradient-text">Progress Analytics</h1>
        <p>A detailed breakdown of your performance across different interview categories.</p>
      </header>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        {SUMMARY_CARDS.map(({ label, value, icon: Icon, gradient, shadow }) => (
          <div
            key={label}
            className="stat-card"
            style={{
              background: 'linear-gradient(145deg,rgba(19,29,46,0.9),rgba(11,17,32,0.9))',
              boxShadow: `0 8px 28px -6px ${shadow}`,
            }}
          >
            <div className="stat-icon" style={{ background: gradient, boxShadow: `0 6px 18px ${shadow}` }}>
              <Icon size={22} />
            </div>
            <h3>{label}</h3>
            <p className="value" style={{ fontSize: '1.8rem' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Target size={18} color="white" />
          </div>
          Performance by Category
        </h2>

        {by_type && by_type.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {by_type.map((type, idx) => {
              const avg = parseFloat(type.avg_score);
              const pct = Math.min((avg / 10) * 100, 100);
              const { from, to } = scoreColor(avg);
              const g = SCORE_GRADIENTS[idx % SCORE_GRADIENTS.length];

              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--surface-2)',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    {/* Category label */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: `linear-gradient(135deg,${g.from},${g.to})`,
                        boxShadow: `0 0 10px ${g.from}`,
                      }} />
                      <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{type.type} Mock Interviews</h3>
                    </div>

                    {/* Score badge */}
                    <div style={{
                      padding: '0.35rem 0.9rem',
                      borderRadius: '20px',
                      background: `linear-gradient(135deg,${from},${to})`,
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: 'white',
                      boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
                    }}>
                      {avg.toFixed(1)} / 10
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: '8px',
                    background: 'var(--background)',
                    borderRadius: '99px',
                    overflow: 'hidden',
                    marginBottom: '0.75rem',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: `linear-gradient(90deg,${from},${to})`,
                      borderRadius: '99px',
                      boxShadow: `0 0 8px ${from}88`,
                      transition: 'width 1s ease',
                    }} />
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Based on {type.count} evaluated answer{type.count !== 1 ? 's' : ''}.
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
            No category breakdown available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
