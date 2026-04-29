import { useState, useEffect } from 'react';
import {
  BookOpen, ChevronDown, ChevronUp, ArrowLeft,
  Code2, Database, Brain, Globe, Shield, Cpu,
  Layers, Server, Zap, Network, Terminal, GitBranch
} from 'lucide-react';

// Map domain names to icons for visual variety
const DOMAIN_ICONS = [
  Code2, Database, Brain, Globe, Shield, Cpu,
  Layers, Server, Zap, Network, Terminal, GitBranch
];

// Gradient palettes cycled across domain cards
const CARD_GRADIENTS = [
  { from: '#4F46E5', to: '#7C3AED' },   // indigo → violet
  { from: '#0891B2', to: '#0E7490' },   // cyan shades
  { from: '#059669', to: '#047857' },   // emerald shades
  { from: '#D97706', to: '#B45309' },   // amber shades
  { from: '#DC2626', to: '#B91C1C' },   // red shades
  { from: '#7C3AED', to: '#6D28D9' },   // violet shades
  { from: '#0284C7', to: '#0369A1' },   // sky shades
  { from: '#16A34A', to: '#15803D' },   // green shades
  { from: '#EA580C', to: '#C2410C' },   // orange shades
  { from: '#9333EA', to: '#7E22CE' },   // purple shades
  { from: '#0F766E', to: '#0D6C62' },   // teal shades
  { from: '#BE123C', to: '#9F1239' },   // rose shades
];

const Practice = () => {
  const [practiceData, setPracticeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [openAnswers, setOpenAnswers] = useState({});
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    fetch('http://localhost/smart-ai-interview-prep/backend/api/practice.php?action=all', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setPracticeData(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleAnswer = (id) => {
    setOpenAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openDomain = (domain) => {
    setOpenAnswers({});
    setAnimating(true);
    setTimeout(() => {
      setSelectedDomain(domain);
      setAnimating(false);
    }, 200);
  };

  const goBack = () => {
    setAnimating(true);
    setTimeout(() => {
      setSelectedDomain(null);
      setOpenAnswers({});
      setAnimating(false);
    }, 200);
  };

  /* ── Loading State ── */
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' }}>
        <div className="practice-spinner" />
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Loading practice library…</p>
      </div>
    );
  }

  /* ── Questions View ── */
  if (selectedDomain) {
    const idx = practiceData.findIndex(d => d.id === selectedDomain.id);
    const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
    const Icon = DOMAIN_ICONS[idx % DOMAIN_ICONS.length];

    return (
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(12px)' : 'translateY(0)',
          transition: 'opacity 0.2s ease, transform 0.2s ease'
        }}
      >
        {/* Back button */}
        <button
          onClick={goBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginBottom: '2rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--text)';
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.background = 'rgba(79,70,229,0.08)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <ArrowLeft size={16} />
          All Topics
        </button>

        {/* Domain header banner */}
        <div
          style={{
            borderRadius: '20px',
            background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
            padding: '2rem 2.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: `0 16px 40px -8px ${gradient.from}55`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* decorative blob */}
          <div style={{
            position: 'absolute', right: '-30px', top: '-30px',
            width: '180px', height: '180px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }} />
          <div style={{
            position: 'absolute', right: '80px', bottom: '-50px',
            width: '120px', height: '120px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }} />

          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={32} color="white" />
          </div>

          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: 'white', marginBottom: '0.3rem' }}>
              {selectedDomain.name}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem' }}>
              {selectedDomain.questions.length} {selectedDomain.questions.length === 1 ? 'question' : 'questions'} · Click any to reveal the answer
            </p>
          </div>
        </div>

        {/* Questions accordion */}
        {selectedDomain.questions.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            color: 'var(--text-muted)',
            background: 'var(--surface)',
            borderRadius: '16px',
            border: '1px dashed var(--border)',
          }}>
            <BookOpen size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p>No questions available for this topic yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {selectedDomain.questions.map((q, idx) => (
              <div
                key={q.id}
                className="practice-question-card"
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: `1px solid ${openAnswers[q.id] ? gradient.from + '55' : 'var(--border)'}`,
                  background: openAnswers[q.id] ? `rgba(${hexToRgb(gradient.from)}, 0.05)` : 'var(--surface)',
                  transition: 'all 0.3s ease',
                  boxShadow: openAnswers[q.id] ? `0 4px 20px -4px ${gradient.from}33` : 'none',
                }}
              >
                {/* Question row */}
                <div
                  onClick={() => toggleAnswer(q.id)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    userSelect: 'none',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1 }}>
                    <span style={{
                      flexShrink: 0,
                      width: '28px', height: '28px',
                      borderRadius: '8px',
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: 'white',
                      marginTop: '2px',
                    }}>
                      {idx + 1}
                    </span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 500, lineHeight: 1.6, color: 'var(--text)' }}>
                      {q.question}
                    </h3>
                  </div>
                  <div style={{
                    color: openAnswers[q.id] ? gradient.from : 'var(--text-muted)',
                    flexShrink: 0,
                    transition: 'color 0.2s ease',
                  }}>
                    {openAnswers[q.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Answer panel */}
                {openAnswers[q.id] && (
                  <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                    <div style={{
                      padding: '1.25rem 1.5rem',
                      background: 'var(--background)',
                      borderRadius: '12px',
                      borderLeft: `4px solid ${gradient.from}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: gradient.from }} />
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.08em',
                          color: gradient.from,
                        }}>
                          Expert Answer
                        </span>
                      </div>
                      <p style={{ color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.75, fontSize: '0.97rem' }}>
                        {q.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── Domain Cards Grid ── */
  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateY(12px)' : 'translateY(0)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    >
      <header className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1 className="gradient-text">Practice Library</h1>
        <p>Select a topic domain to explore curated interview questions and expert answers.</p>
      </header>

      {practiceData.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '5rem 2rem',
          color: 'var(--text-muted)',
          background: 'var(--surface)',
          borderRadius: '20px',
          border: '1px dashed var(--border)',
        }}>
          <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.35 }} />
          <p style={{ fontSize: '1.1rem' }}>No practice domains available yet.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {practiceData.map((domain, i) => {
            const gradient = CARD_GRADIENTS[i % CARD_GRADIENTS.length];
            const Icon = DOMAIN_ICONS[i % DOMAIN_ICONS.length];
            return (
              <DomainCard
                key={domain.id}
                domain={domain}
                gradient={gradient}
                Icon={Icon}
                onClick={() => openDomain(domain)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ── Domain Card Sub-component ── */
const DomainCard = ({ domain, gradient, Icon, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '20px',
        border: `1px solid ${hovered ? gradient.from + '88' : 'var(--border)'}`,
        background: hovered
          ? `linear-gradient(145deg, rgba(${hexToRgb(gradient.from)}, 0.12), rgba(${hexToRgb(gradient.to)}, 0.06))`
          : 'var(--surface)',
        padding: '1.75rem',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 40px -10px ${gradient.from}44` : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative corner blob */}
      <div style={{
        position: 'absolute',
        top: '-20px', right: '-20px',
        width: '100px', height: '100px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${gradient.from}22, ${gradient.to}11)`,
        transition: 'transform 0.3s ease',
        transform: hovered ? 'scale(1.4)' : 'scale(1)',
      }} />

      {/* Icon */}
      <div style={{
        width: '56px', height: '56px',
        borderRadius: '14px',
        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 8px 20px -4px ${gradient.from}66`,
        transition: 'transform 0.3s ease',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
      }}>
        <Icon size={26} color="white" />
      </div>

      {/* Text */}
      <div>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: '0.4rem',
          lineHeight: 1.3,
        }}>
          {domain.name}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {domain.questions.length} {domain.questions.length === 1 ? 'question' : 'questions'}
        </p>
      </div>

      {/* CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: gradient.from,
        fontSize: '0.875rem',
        fontWeight: 600,
        marginTop: 'auto',
      }}>
        <span>Start Practicing</span>
        <span style={{
          display: 'inline-flex',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 0.2s ease',
        }}>→</span>
      </div>
    </div>
  );
};

/* ── Utility: hex color to "r,g,b" string ── */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default Practice;
