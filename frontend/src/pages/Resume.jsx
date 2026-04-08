import { useState } from 'react';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set up the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const Resume = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Limit to 5MB max
      if (file.size > 5 * 1024 * 1024) {
        setError('File must be drastically smaller than 5MB.');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }
    
    return fullText;
  };

  const submitResume = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setError('');

    try {
      let extractedText = '';

      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(selectedFile);
      } else {
        // Read as text
        extractedText = await selectedFile.text();
      }

      if (!extractedText.trim()) {
        setError('Could not extract valid text from the document.');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost/smart-ai-interview-prep/backend/api/resume.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: extractedText }),
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.message || 'Analysis failed');
      }
    } catch (err) {
      console.error("Resume Processing Error:", err);
      setError(`An error occurred: ${err.message || 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: '3rem' }}>
        <h1>Resume Analyzer</h1>
        <p>Paste your resume text below for instant ATS compatibility scoring and AI-driven suggestions.</p>
      </header>

      {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: analysis ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        {/* Input Section */}
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--primary)" />
            Your Resume
          </h2>
          
          <form onSubmit={submitResume}>
            <div style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px dashed var(--border)',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--text)',
                marginBottom: '1.5rem',
                transition: 'border-color 0.2s'
              }}
            >
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="resume-upload"
              />
              <label htmlFor="resume-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
                  <FileText size={32} />
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Click to upload</span> or drag and drop
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>TXT or PDF (Max 5MB)</p>
                </div>
              </label>
              
              {selectedFile && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--surface)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              )}
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading || !selectedFile} style={{ width: '100%' }}>
              {loading ? 'Analyzing Profile...' : 'Analyze Resume'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {analysis && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(192, 132, 252, 0.1))' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ATS Compatibility Score</h3>
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'var(--surface)',
                border: `8px solid ${analysis.score >= 70 ? 'var(--secondary)' : (analysis.score >= 40 ? 'var(--primary)' : 'var(--danger)')}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <span style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>{analysis.score}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/100</span>
              </div>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}>
                {analysis.is_ats_friendly === 'Yes' ? (
                  <><CheckCircle size={20} color="var(--secondary)" /> <span style={{ color: 'var(--secondary)' }}>ATS Friendly</span></>
                ) : (
                  <><AlertTriangle size={20} color="var(--danger)" /> <span style={{ color: 'var(--danger)' }}>Needs Improvement</span></>
                )}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Key Suggestions</h3>
              {analysis.suggestions && analysis.suggestions.length > 0 ? (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {analysis.suggestions.map((suggestion, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--danger)' }}>
                      <AlertTriangle size={20} color="var(--danger)" style={{ flexShrink: 0 }} />
                      <span style={{ color: 'var(--text)', fontSize: '0.95rem' }}>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle size={24} color="var(--secondary)" />
                  <span style={{ color: 'var(--text)' }}>Great job! No major improvements needed based on our current ATS standard checklist.</span>
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
