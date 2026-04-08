import { useState, useEffect } from 'react';
import { Target, TrendingUp, BarChart2, Activity } from 'lucide-react';

const Progress = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost/smart-ai-interview-prep/backend/api/progress.php', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        setData(result);
      }
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '3rem', color: 'var(--text-muted)' }}>Loading progress analytics...</div>;
  if (!data) return <div style={{ padding: '3rem', color: 'var(--text-muted)' }}>No progress data available yet. Please complete an interview first.</div>;

  const { by_type, performance } = data;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: '3rem' }}>
        <h1>Progress Analytics</h1>
        <p>A detailed breakdown of your performance across different interview categories.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>
            <Activity size={16} /> Total Questions
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 700 }}>{performance?.total_answers || 0}</span>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>
            <TrendingUp size={16} /> Highest Score
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)' }}>{performance?.max_score ? parseFloat(performance.max_score).toFixed(1) : 'N/A'}</span>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.875rem', textTransform: 'uppercase' }}>
            <BarChart2 size={16} /> Lowest Score
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>{performance?.min_score ? parseFloat(performance.min_score).toFixed(1) : 'N/A'}</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={20} color="var(--primary)" />
          Performance by Category
        </h2>
        
        {by_type && by_type.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {by_type.map((type, idx) => {
              const avgScore = parseFloat(type.avg_score).toFixed(1);
              const isHigh = avgScore >= 7;
              const isMedium = avgScore >= 5 && avgScore < 7;
              const trackColor = isHigh ? 'var(--secondary)' : (isMedium ? 'var(--primary)' : 'var(--danger)');
              
              return (
                <div key={idx} style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem' }}>{type.type} Mock Interviews</h3>
                    <div style={{ fontWeight: 600, color: trackColor }}>
                      <span style={{ fontSize: '1.25rem' }}>{avgScore}</span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}> / 10 Average</span>
                    </div>
                  </div>
                  
                  <div style={{ height: '8px', background: 'var(--background)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                    <div style={{ height: '100%', width: `${(avgScore / 10) * 100}%`, background: trackColor, borderRadius: '4px' }} />
                  </div>
                  
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Based on {type.count} evaluated answers.</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No category breakdown available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
