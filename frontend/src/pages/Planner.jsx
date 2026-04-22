import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle,
  Circle,
  Trash2,
  Plus,
  Brain,
  Target,
  Zap,
  BookOpen,
  Clock,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Lightbulb,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

// ── Score badge helper ─────────────────────────────────────────────────────────
const ScoreBadge = ({ score }) => {
  const s = parseFloat(score);
  const color =
    s >= 8 ? '#10b981' : s >= 6 ? '#6366f1' : s >= 4 ? '#f59e0b' : '#ef4444';
  const label = s >= 8 ? 'Strong' : s >= 6 ? 'Good' : s >= 4 ? 'Needs Work' : 'Weak';
  return (
    <span
      style={{
        padding: '2px 10px',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        background: color + '22',
        color,
        border: `1px solid ${color}55`,
      }}
    >
      {label}
    </span>
  );
};

// ── Level pill ─────────────────────────────────────────────────────────────────
const LevelPill = ({ level }) => {
  const map = {
    Beginner: { color: '#f59e0b', bg: '#f59e0b22' },
    Intermediate: { color: '#6366f1', bg: '#6366f122' },
    Advanced: { color: '#10b981', bg: '#10b98122' },
  };
  const { color, bg } = map[level] || map['Intermediate'];
  return (
    <span
      style={{
        padding: '4px 14px',
        borderRadius: '999px',
        fontWeight: 700,
        fontSize: '0.8rem',
        background: bg,
        color,
        border: `1px solid ${color}66`,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}
    >
      {level}
    </span>
  );
};

// ── Week card ──────────────────────────────────────────────────────────────────
const WeekCard = ({ week, isActive, onToggle }) => {
  const weekColors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];
  const color = weekColors[(week.week - 1) % weekColors.length];

  return (
    <div
      style={{
        borderRadius: '14px',
        overflow: 'hidden',
        border: `1px solid ${color}33`,
        background: 'var(--surface)',
        transition: 'box-shadow 0.2s',
        boxShadow: isActive ? `0 0 0 2px ${color}44` : 'none',
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          borderLeft: `4px solid ${color}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: color + '22',
              color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.95rem',
            }}
          >
            W{week.week}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
              {week.theme}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '4px' }}>
              {week.focus_areas?.map((a, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: color + '15',
                    color,
                    border: `1px solid ${color}33`,
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
        {isActive ? (
          <ChevronUp size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        ) : (
          <ChevronDown size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        )}
      </button>

      {/* Expanded content */}
      {isActive && (
        <div style={{ padding: '0 1.5rem 1.5rem', borderTop: `1px solid ${color}22` }}>
          {/* Daily tasks */}
          <h4
            style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: 'var(--text-muted)',
              margin: '1.25rem 0 0.75rem',
            }}
          >
            <Clock size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Daily Tasks
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {week.daily_tasks?.map((t, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.85rem',
                  background: 'var(--background)',
                  borderRadius: '8px',
                }}
              >
                <span
                  style={{
                    minWidth: 36,
                    textAlign: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color,
                    background: color + '18',
                    borderRadius: '6px',
                    padding: '2px 6px',
                  }}
                >
                  {t.day}
                </span>
                <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text)' }}>
                  {t.task}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <Clock size={11} /> {t.duration}
                </span>
              </div>
            ))}
          </div>

          {/* Resources */}
          {week.resources && week.resources.length > 0 && (
            <>
              <h4
                style={{
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  color: 'var(--text-muted)',
                  margin: '1.25rem 0 0.75rem',
                }}
              >
                <BookOpen size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Resources & Tips
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {week.resources.map((r, i) => (
                  <li key={i} style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {r}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
const Planner = () => {
  // ── Study plan state ─────────────────────────────────────────────
  const [planLoading, setPlanLoading] = useState(true);
  const [planData, setPlanData] = useState(null);
  const [planError, setPlanError] = useState(null);
  const [noInterviewData, setNoInterviewData] = useState(false);
  const [openWeek, setOpenWeek] = useState(0); // index of expanded week card

  // ── Manual tasks state ───────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch study plan ─────────────────────────────────────────────
  const fetchStudyPlan = async () => {
    setPlanLoading(true);
    setPlanError(null);
    try {
      const res = await fetch(
        'http://localhost/smart-ai-interview-prep/backend/api/study_plan.php',
        { credentials: 'include' }
      );
      const data = await res.json();
      if (data.success) {
        setPlanData(data);
        setNoInterviewData(false);
      } else if (data.no_data) {
        setNoInterviewData(true);
      } else {
        setPlanError(data.message || 'Failed to load study plan.');
      }
    } catch (err) {
      setPlanError('Network error while loading study plan.');
    } finally {
      setPlanLoading(false);
    }
  };

  // ── Fetch manual tasks ───────────────────────────────────────────
  const fetchTasks = async () => {
    try {
      const res = await fetch(
        'http://localhost/smart-ai-interview-prep/backend/api/planner.php?action=tasks',
        { credentials: 'include' }
      );
      const data = await res.json();
      if (data.success) setTasks(data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyPlan();
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !newDate) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        'http://localhost/smart-ai-interview-prep/backend/api/planner.php?action=add',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: newTask, date: newDate }),
          credentials: 'include',
        }
      );
      const data = await res.json();
      if (data.success) {
        setNewTask('');
        setNewDate('');
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const completeTask = async (taskId) => {
    try {
      const res = await fetch(
        'http://localhost/smart-ai-interview-prep/backend/api/planner.php?action=complete',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task_id: taskId }),
          credentials: 'include',
        }
      );
      const data = await res.json();
      if (data.success) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(
        'http://localhost/smart-ai-interview-prep/backend/api/planner.php?action=delete',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task_id: taskId }),
          credentials: 'include',
        }
      );
      const data = await res.json();
      if (data.success) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1>Study Planner</h1>
        <p>Your AI-powered preparation roadmap, built from your actual interview performance.</p>
      </header>

      {/* ════════════════════════════════════════
          SECTION 1 — AI STUDY PLAN
      ════════════════════════════════════════ */}
      <section style={{ marginBottom: '3rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Brain size={20} color="var(--primary)" />
            AI-Generated Study Plan
          </h2>

          {!planLoading && planData && (
            <button
              onClick={fetchStudyPlan}
              title="Regenerate plan"
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <RefreshCw size={13} /> Regenerate
            </button>
          )}
        </div>

        {/* Loading */}
        {planLoading && (
          <div
            className="glass-panel"
            style={{
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                border: '3px solid var(--primary)33',
                borderTop: '3px solid var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p>Analyzing your interview scores and generating your personalized plan...</p>
          </div>
        )}

        {/* No interview data */}
        {!planLoading && noInterviewData && (
          <div
            className="glass-panel"
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <AlertCircle size={48} style={{ opacity: 0.3 }} />
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>
                No Interview Data Yet
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Complete at least one interview session to unlock your personalized AI study plan.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!planLoading && planError && (
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--danger)',
              border: '1px solid var(--danger)33',
            }}
          >
            <p>{planError}</p>
          </div>
        )}

        {/* Study plan content */}
        {!planLoading && planData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Score performance cards */}
            <div
              className="glass-panel"
              style={{ padding: '1.5rem' }}
            >
              <h3
                style={{
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <TrendingUp size={14} /> Your Score Breakdown
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {planData.score_summary.map((item, i) => {
                  const avg = parseFloat(item.avg_score);
                  const pct = (avg / 10) * 100;
                  const barColor =
                    avg >= 8 ? '#10b981' : avg >= 6 ? '#6366f1' : avg >= 4 ? '#f59e0b' : '#ef4444';

                  return (
                    <div
                      key={i}
                      style={{
                        background: 'var(--background)',
                        borderRadius: '10px',
                        padding: '1rem 1.1rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.6rem',
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          {item.type}
                        </span>
                        <ScoreBadge score={avg} />
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: 'var(--surface)',
                          borderRadius: 3,
                          overflow: 'hidden',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: barColor,
                            borderRadius: 3,
                            transition: 'width 0.6s ease',
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <span>
                          Avg:{' '}
                          <strong style={{ color: barColor }}>
                            {avg.toFixed(1)}/10
                          </strong>
                        </span>
                        <span>{item.count} Q's answered</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Plan header */}
            <div
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.6rem',
                  }}
                >
                  <Target size={18} color="var(--primary)" />
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                    Your Current Level
                  </span>
                  <LevelPill level={planData.study_plan.overall_level} />
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                  {planData.study_plan.summary}
                </p>
              </div>
            </div>

            {/* Week cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3
                style={{
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <CalendarIcon size={14} /> 4-Week Roadmap
              </h3>
              {planData.study_plan.weeks?.map((week, idx) => (
                <WeekCard
                  key={idx}
                  week={week}
                  isActive={openWeek === idx}
                  onToggle={() => setOpenWeek(openWeek === idx ? -1 : idx)}
                />
              ))}
            </div>

            {/* Tips */}
            {planData.study_plan.tips && planData.study_plan.tips.length > 0 && (
              <div
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  borderLeft: '4px solid #f59e0b',
                  background: 'linear-gradient(135deg, #f59e0b08 0%, transparent 100%)',
                }}
              >
                <h3
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    marginBottom: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#f59e0b',
                  }}
                >
                  <Lightbulb size={16} /> Coach's Pro Tips
                </h3>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  {planData.study_plan.tips.map((tip, i) => (
                    <li key={i} style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════
          SECTION 2 — MANUAL TASK MANAGER
      ════════════════════════════════════════ */}
      <section>
        <h2
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem',
          }}
        >
          <Zap size={20} color="var(--primary)" />
          My Study Tasks
        </h2>

        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-muted)',
            }}
          >
            <Plus size={16} /> Add a New Task
          </h3>

          <form onSubmit={addTask} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="What do you need to study?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: '1 1 140px' }}>
              <input
                type="date"
                className="form-control"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Plus size={18} /> Add
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Upcoming Tasks</h3>

          {tasksLoading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading planner...</p>
          ) : tasks.length === 0 ? (
            <div
              style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}
            >
              <CalendarIcon size={48} style={{ opacity: 0.2, margin: '0 auto 1rem', display: 'block' }} />
              <p>Your planner is beautifully empty.</p>
            </div>
          ) : (
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              {tasks.map((task) => (
                <li
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.1rem 1.25rem',
                    background: 'var(--surface)',
                    borderRadius: '10px',
                    borderLeft: `4px solid ${task.completed ? '#10b981' : 'var(--primary)'}`,
                    opacity: task.completed ? 0.6 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={() => !task.completed && completeTask(task.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: task.completed ? 'default' : 'pointer',
                        color: task.completed ? '#10b981' : 'var(--text-muted)',
                        padding: 0,
                      }}
                    >
                      {task.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
                    </button>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          textDecoration: task.completed ? 'line-through' : 'none',
                        }}
                      >
                        {task.task}
                      </p>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(task.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--danger)',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = '#ef444422')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'transparent')
                    }
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Planner;
