import { useState } from 'react';
import { FileText, CheckCircle, AlertTriangle, Upload, Sparkles } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function ScoreRing({ score }) {
  const size = 150;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circ * (1 - pct);

  let gradient, shadow;
  if (score >= 70) { gradient = 'url(#ringGreen)'; shadow = 'rgba(5,150,105,0.5)'; }
  else if (score >= 40) { gradient = 'url(#ringIndigo)'; shadow = 'rgba(79,70,229,0.5)'; }
  else { gradient = 'url(#ringRed)'; shadow = 'rgba(220,38,38,0.5)'; }

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <linearGradient id="ringIndigo" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          <linearGradient id="ringRed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#F87171" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        {/* Progress */}
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={gradient}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 8px ${shadow})`, transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      {/* Center text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, fontFamily: 'Outfit, sans-serif' }}>{score}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/100</span>
      </div>
    </div>
  );
}

const Resume = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [analysis, setAnalysis]         = useState(null);
  const [error, setError]               = useState('');
  const [dragOver, setDragOver]         = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File must be smaller than 5MB.'); return; }
    setSelectedFile(file); setError('');
  };

  const handleFileChange = e => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const extractTextFromPDF = async (file) => {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(it => it.str).join(' ') + '\n';
    }
    return text;
  };

  const submitResume = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setLoading(true); setError('');

    try {
      let text = '';
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        text = await extractTextFromPDF(selectedFile);
      } else {
        text = await selectedFile.text();
      }

      if (!text.trim()) { setError('Could not extract valid text from the document.'); return; }

      const res = await fetch('http://localhost/smart-ai-interview-prep/backend/api/resume.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: text }),
        credentials: 'include',
      });
      const data = await res.json();

      if (data.success) setAnalysis(data.analysis);
      else setError(data.message || 'Analysis failed');
    } catch (err) {
      setError(`An error occurred: ${err.message || 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  const isFriendly = analysis?.is_ats_friendly === 'Yes';

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <header className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1 className="gradient-text">Resume Analyzer</h1>
        <p>Upload your resume for instant ATS scoring and AI-driven improvement suggestions.</p>
      </header>

      {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <div style={{
        display: 'grid',
        gridTemplateColumns: analysis ? '1fr 1fr' : '1fr',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Upload Panel */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileText size={18} color="white" />
            </div>
            Your Resume
          </h2>

          <form onSubmit={submitResume}>
            {/* Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragOver ? '#4F46E5' : 'var(--border)'}`,
                borderRadius: '16px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                background: dragOver ? 'rgba(79,70,229,0.06)' : 'rgba(11,17,32,0.5)',
                transition: 'all 0.2s ease',
                marginBottom: '1.5rem',
                cursor: 'pointer',
              }}
            >
              <input
                type="file" accept=".pdf,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="resume-upload"
              />
              <label htmlFor="resume-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '16px',
                  background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(79,70,229,0.4)',
                }}>
                  <Upload size={28} color="white" />
                </div>
                <div>
                  <p style={{ fontWeight: 600 }}>
                    <span style={{ color: '#818CF8' }}>Click to upload</span> or drag & drop
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>PDF or TXT · Max 5MB</p>
                </div>
              </label>

              {selectedFile && (
                <div style={{
                  marginTop: '1.5rem', padding: '0.85rem 1rem',
                  background: 'rgba(79,70,229,0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(79,70,229,0.25)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    📄 {selectedFile.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '0.5rem' }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !selectedFile}
              style={{ width: '100%', padding: '0.95rem' }}
            >
              {loading ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Analyzing Profile…
                </>
              ) : (
                <><Sparkles size={18} /> Analyze Resume</>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {analysis && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Score card */}
            <div className="glass-panel" style={{
              padding: '2rem',
              textAlign: 'center',
              background: 'linear-gradient(145deg, rgba(79,70,229,0.08), rgba(124,58,237,0.04))',
            }}>
              <p style={{
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1.5rem',
              }}>
                ATS Compatibility Score
              </p>

              <ScoreRing score={analysis.score} />

              <div style={{
                marginTop: '1.5rem',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1.25rem', borderRadius: '99px',
                background: isFriendly ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.12)',
                border: `1px solid ${isFriendly ? 'rgba(5,150,105,0.3)' : 'rgba(220,38,38,0.25)'}`,
                fontWeight: 700,
                color: isFriendly ? 'var(--secondary)' : 'var(--danger)',
              }}>
                {isFriendly
                  ? <><CheckCircle size={18} /> ATS Friendly</>
                  : <><AlertTriangle size={18} /> Needs Improvement</>
                }
              </div>
            </div>

            {/* Suggestions */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  background: 'linear-gradient(135deg,#D97706,#B45309)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AlertTriangle size={15} color="white" />
                </div>
                Key Suggestions
              </h3>

              {analysis.suggestions && analysis.suggestions.length > 0 ? (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {analysis.suggestions.map((s, i) => (
                    <li key={i} style={{
                      display: 'flex', gap: '0.75rem',
                      padding: '1rem 1.1rem',
                      background: 'rgba(239,68,68,0.07)',
                      borderRadius: '12px',
                      borderLeft: '4px solid var(--danger)',
                    }}>
                      <AlertTriangle size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: 'var(--text)', fontSize: '0.925rem', lineHeight: 1.6 }}>{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{
                  padding: '1.25rem',
                  background: 'rgba(16,185,129,0.08)',
                  borderRadius: '12px',
                  borderLeft: '4px solid var(--secondary)',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  <CheckCircle size={22} color="var(--secondary)" style={{ flexShrink: 0 }} />
                  <span style={{ color: 'var(--text)', lineHeight: 1.6 }}>
                    Great job! No major improvements needed based on our ATS checklist.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
