import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle, Circle, Trash2, Plus } from 'lucide-react';

const Planner = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost/smart-ai-interview-prep/backend/api/planner.php?action=tasks', {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !newDate) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost/smart-ai-interview-prep/backend/api/planner.php?action=add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask, date: newDate }),
        credentials: 'include'
      });
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
      const res = await fetch('http://localhost/smart-ai-interview-prep/backend/api/planner.php?action=complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch('http://localhost/smart-ai-interview-prep/backend/api/planner.php?action=delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: '3rem' }}>
        <h1>Study Planner</h1>
        <p>Organize your interview preparation schedule efficiently.</p>
      </header>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarIcon size={20} color="var(--primary)" />
          Add New Task
        </h2>
        
        <form onSubmit={addTask} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="What do you need to study?" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: '1 1 150px' }}>
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
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Upcoming Tasks</h2>
        
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading planner...</p>
        ) : tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <CalendarIcon size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
            <p>Your planner is beautifully empty.</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tasks.map(task => (
              <li key={task.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '1.25rem', 
                background: 'var(--surface)', 
                borderRadius: '8px',
                borderLeft: `4px solid ${task.completed ? 'var(--secondary)' : 'var(--primary)'}`,
                opacity: task.completed ? 0.6 : 1
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button 
                    onClick={() => !task.completed && completeTask(task.id)}
                    style={{ background: 'transparent', border: 'none', cursor: task.completed ? 'default' : 'pointer', color: task.completed ? 'var(--secondary)' : 'var(--text-muted)' }}
                  >
                    {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                  </button>
                  <div>
                    <h3 style={{ fontSize: '1rem', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.task}</h3>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{new Date(task.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => deleteTask(task.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '0.5rem' }}
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Planner;
