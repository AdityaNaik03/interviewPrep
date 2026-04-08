import { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const Practice = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAnswers, setOpenAnswers] = useState({});

  useEffect(() => {
    fetch('http://localhost/smart-ai-interview-prep/backend/api/practice.php?action=subjects', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setSubjects(data.subjects);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      setLoading(true);
      fetch(`http://localhost/smart-ai-interview-prep/backend/api/practice.php?action=questions&subject_id=${selectedSubject.id}`, {
        credentials: 'include'
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQuestions(data.questions);
          setOpenAnswers({});
        }
        setLoading(false);
      });
    }
  }, [selectedSubject]);

  const toggleAnswer = (id) => {
    setOpenAnswers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading && !subjects.length) return <div className="p-8 text-muted">Loading practice materials...</div>;

  return (
    <div>
      <header className="page-header">
        <h1>Practice Subjects</h1>
        <p>Master specific technical concepts before your mock interviews.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {subjects.map(subject => (
          <button
            key={subject.id}
            onClick={() => setSelectedSubject(subject)}
            className="feature-card"
            style={{ 
              padding: '1.5rem', 
              textAlign: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '1rem',
              borderColor: selectedSubject?.id === subject.id ? 'var(--primary)' : 'var(--border)',
              background: selectedSubject?.id === subject.id ? 'rgba(79, 70, 229, 0.1)' : 'var(--surface)',
              cursor: 'pointer'
            }}
          >
            <BookOpen size={32} color={selectedSubject?.id === subject.id ? 'var(--primary)' : 'var(--text-muted)'} />
            <h3 style={{ fontSize: '1.1rem' }}>{subject.name}</h3>
          </button>
        ))}
      </div>

      {selectedSubject && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--primary)' }}>{selectedSubject.name}</span> Questions
          </h2>
          
          {loading ? (
            <p>Loading questions...</p>
          ) : questions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No questions available for this subject yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {questions.map((q, idx) => (
                <div key={q.id} style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', background: 'var(--background)' }}>
                  <div 
                    onClick={() => toggleAnswer(q.id)}
                    style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: openAnswers[q.id] ? 'var(--surface)' : 'transparent', transition: 'background 0.2s' }}
                  >
                    <h3 style={{ fontSize: '1rem', fontWeight: 500, lineHeight: 1.5, paddingRight: '1rem' }}>
                      <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>Q{idx + 1}.</span> 
                      {q.question}
                    </h3>
                    <div style={{ color: 'var(--text-muted)' }}>
                      {openAnswers[q.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                  
                  {openAnswers[q.id] && (
                    <div style={{ padding: '1.5rem', paddingTop: 0, borderTop: '0px solid var(--border)' }}>
                      <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--secondary)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--secondary)', display: 'block', marginBottom: '0.5rem' }}>Answer</span>
                        <p style={{ color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{q.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Practice;
