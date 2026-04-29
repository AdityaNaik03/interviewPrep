import { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const Practice = () => {
  const [practiceData, setPracticeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAnswers, setOpenAnswers] = useState({});

  useEffect(() => {
    fetch('http://localhost/smart-ai-interview-prep/backend/api/practice.php?action=all', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setPracticeData(data.data);
      }
      setLoading(false);
    });
  }, []);

  const toggleAnswer = (id) => {
    setOpenAnswers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading practice materials...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: '3rem' }}>
        <h1>Practice Library</h1>
        <p>Comprehensive question bank categorized by domain to help you master technical concepts.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {practiceData.map(domain => (
          <section key={domain.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--primary)' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '10px' }}>
                <BookOpen size={24} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{domain.name}</h2>
              <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--text-muted)', background: 'var(--surface)', padding: '0.25rem 0.75rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
                {domain.questions.length} Questions
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {domain.questions.length === 0 ? (
                <p style={{ padding: '1rem', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                  No questions available for this domain yet.
                </p>
              ) : (
                domain.questions.map((q, idx) => (
                  <div key={q.id} className="glass-panel" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)', transition: 'all 0.3s ease' }}>
                    <div 
                      onClick={() => toggleAnswer(q.id)}
                      style={{ 
                        padding: '1.25rem 1.5rem', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        background: openAnswers[q.id] ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.5, display: 'flex', gap: '0.75rem' }}>
                        <span style={{ color: 'var(--primary)', opacity: 0.7 }}>{idx + 1}.</span>
                        {q.question}
                      </h3>
                      <div style={{ color: openAnswers[q.id] ? 'var(--primary)' : 'var(--text-muted)', marginLeft: '1rem' }}>
                        {openAnswers[q.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                    
                    {openAnswers[q.id] && (
                      <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                        <div style={{ 
                          padding: '1.25rem', 
                          background: 'var(--background)', 
                          borderRadius: '12px', 
                          borderLeft: '4px solid var(--secondary)',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }}></div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--secondary)' }}>Expert Answer</span>
                          </div>
                          <p style={{ color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '1rem' }}>
                            {q.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Practice;
