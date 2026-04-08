import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, BrainCircuit, Code, Users, Settings, Clock } from 'lucide-react';

const Interview = () => {
  const [type, setType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleVideoMount = (node) => {
    if (node && streamRef.current) {
      if (node.srcObject !== streamRef.current) {
        node.srcObject = streamRef.current;
      }
    }
  };

  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startTimer = () => {
    setTimeLeft(120);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startInterview = async (selectedType) => {
    setType(selectedType);
    setLoading(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
    } catch (err) {
      console.error("Camera access denied or missing", err);
    }
    
    try {
      const res = await fetch(`http://localhost/smart-ai-interview-prep/backend/api/interview.php?action=questions&type=${selectedType}`, {
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        speakQuestion(data.questions[0].question);
        startTimer();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setAnswer(prev => prev + ' ' + currentTranscript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    
    setEvaluating(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
    
    const currentQ = questions[currentIndex];

    try {
      const res = await fetch('http://localhost/smart-ai-interview-prep/backend/api/interview.php?action=evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: currentQ.id,
          question_text: currentQ.question,
          answer: answer
        }),
        credentials: 'include'
      });
      const data = await res.json();
      // console.log("evaluation",data);
      
      if (data.success) {
        setEvaluation(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    setAnswer('');
    setEvaluation(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      speakQuestion(questions[currentIndex + 1].question);
      startTimer();
    } else {
      navigate('/dashboard');
    }
  };

  // Render Selection View
  if (!type) {
    return (
      <div>
        <header className="page-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1>Select Interview Type</h1>
          <p>Choose a category to begin your AI-driven mock interview</p>
        </header>

        <div className="features-grid">
          <button onClick={() => startInterview('Technical')} className="feature-card" style={{ textAlign: 'left', border: 'none', background: 'var(--surface)' }}>
            <div className="icon-wrapper" style={{ display: 'inline-block', padding: '1rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '12px' }}>
              <Code size={32} />
            </div>
            <h3>Technical Interview</h3>
            <p>Programming, data structures, algorithms, and technical concepts.</p>
          </button>
          
          <button onClick={() => startInterview('HR')} className="feature-card" style={{ textAlign: 'left', border: 'none', background: 'var(--surface)' }}>
            <div className="icon-wrapper" style={{ display: 'inline-block', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', borderRadius: '12px' }}>
              <Users size={32} />
            </div>
            <h3>HR Interview</h3>
            <p>Soft skills, past experiences, and behavioral questions.</p>
          </button>

          <button onClick={() => startInterview('Mock')} className="feature-card" style={{ textAlign: 'left', border: 'none', background: 'var(--surface)' }}>
            <div className="icon-wrapper" style={{ display: 'inline-block', padding: '1rem', background: 'rgba(192, 132, 252, 0.1)', color: '#C084FC', borderRadius: '12px' }}>
              <Settings size={32} />
            </div>
            <h3>Mixed Mock Interview</h3>
            <p>A comprehensive session blending technical and behavioral topics.</p>
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Preparing your interview...</div>;
  if (!questions.length) return <div style={{ padding: '2rem' }}>No questions available for this category.</div>;

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${mins}:${secs.toString().padStart(2, '0')}`;
  const isTimeLow = timeLeft <= 30;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <span>{type} Session</span>
          <span>Question {currentIndex + 1} of {questions.length}</span>
        </div>
        <div style={{ height: '6px', background: 'var(--surface)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--primary)', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: '1 1 500px', padding: '2.5rem' }}>
          <style>
            {`
              @keyframes soundWave {
                0% { height: 4px; opacity: 0.5; }
                50% { height: 20px; opacity: 1; }
                100% { height: 4px; opacity: 0.5; }
              }
              .wave-bar {
                width: 4px;
                background: var(--danger);
                border-radius: 2px;
                animation: soundWave 0s ease-in-out infinite;
              }
              .wave-bar:nth-child(1) { animation-duration: 0.4s; }
              .wave-bar:nth-child(2) { animation-duration: 0.6s; }
              .wave-bar:nth-child(3) { animation-duration: 0.5s; }
              .wave-bar:nth-child(4) { animation-duration: 0.7s; }
              .wave-bar:nth-child(5) { animation-duration: 0.3s; }
            `}
          </style>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600 }}>
            <BrainCircuit size={16} />
            AI Interviewer
          </div>
          
          {!evaluation && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: isTimeLow ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface)', color: isTimeLow ? 'var(--danger)' : 'var(--text)', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, border: `1px solid ${isTimeLow ? 'var(--danger)' : 'var(--border)'}`, transition: 'all 0.3s ease' }}>
              <Clock size={16} />
              {timeString}
            </div>
          )}
        </div>

        <h2 style={{ fontSize: '1.5rem', lineHeight: 1.5, marginBottom: '2.5rem' }}>
          <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>Q.</span>
          {currentQ.question}
        </h2>

        {!evaluation ? (
          <form onSubmit={submitAnswer}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <textarea 
                className="form-control" 
                rows="6" 
                placeholder="Type your answer here, or use the voice recording feature..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button 
                  type="button" 
                  onClick={toggleRecording} 
                  className={`btn ${isRecording ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ background: isRecording ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface)', color: isRecording ? 'var(--danger)' : 'var(--text)', border: '1px solid var(--border)' }}
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                  {isRecording ? 'Stop Recording' : 'Use Voice Input'}
                </button>
                {isRecording && (
                  <div style={{ display: 'flex', gap: '4px', height: '24px', alignItems: 'center', padding: '0 0.5rem' }}>
                    <div className="wave-bar" />
                    <div className="wave-bar" />
                    <div className="wave-bar" />
                    <div className="wave-bar" />
                    <div className="wave-bar" />
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary" disabled={evaluating || !answer.trim()}>
                {evaluating ? 'Thinking...' : 'Submit Answer'} <Send size={18} />
              </button>
            </div>
          </form>
        ) : (
          <div style={{ padding: '2rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '4rem', fontWeight: 700, color: evaluation.score >= 7 ? 'var(--secondary)' : (evaluation.score >= 4 ? 'var(--primary)' : 'var(--danger)'), lineHeight: 1 }}>
                {evaluation.score}<span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>/10</span>
              </div>
              <h3 style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Evaluation Score</h3>
            </div>
            
            <div style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--primary)', marginBottom: '2rem' }}>
              <p style={{ color: 'var(--text)', lineHeight: 1.6 }}>{evaluation.feedback}</p>
            </div>

            <button onClick={nextQuestion} className="btn btn-primary" style={{ width: '100%' }}>
              {currentIndex + 1 < questions.length ? 'Next Question' : 'Complete Session'}
            </button>
          </div>
        )}
        </div>
        
        <div className="glass-panel" style={{ flex: '0 0 260px', padding: '1rem' }}>
          <div style={{ width: '100%', aspectRatio: '4/3', background: '#111', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
            <video 
              ref={handleVideoMount} 
              autoPlay 
              muted 
              playsInline 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
            />
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
            <div style={{ width: '6px', height: '6px', background: 'var(--danger)', borderRadius: '50%', boxShadow: '0 0 4px var(--danger)' }}></div>
            Camera Preview
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
