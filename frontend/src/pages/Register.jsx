import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm_password: '' });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        'http://localhost/smart-ai-interview-prep/backend/api/auth.php?action=register',
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData), credentials: 'include' }
      );
      const data = await res.json();

      if (data.success) {
        setSuccess('Account created! Redirecting to login…');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('An error occurred while communicating with the server.');
    } finally {
      setLoading(false);
    }
  };

  const FIELDS = [
    { id: 'name',             icon: User,  type: 'text',     label: 'Full Name',        placeholder: 'John Doe'         },
    { id: 'email',            icon: Mail,  type: 'email',    label: 'Email Address',    placeholder: 'you@example.com'  },
    { id: 'password',         icon: Lock,  type: 'password', label: 'Password',         placeholder: '••••••••', min: 6 },
    { id: 'confirm_password', icon: Lock,  type: 'password', label: 'Confirm Password', placeholder: '••••••••', min: 6 },
  ];

  return (
    <div className="auth-container">
      {/* Decorative blobs */}
      <div style={{
        position: 'fixed', top: '-100px', right: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-100px', left: '-60px',
        width: '360px', height: '360px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.14) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="auth-card">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '68px', height: '68px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #059669, #047857)',
            boxShadow: '0 12px 28px rgba(5,150,105,0.45)',
            marginBottom: '1.25rem',
          }}>
            <UserPlus size={30} color="white" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Start your AI interview preparation journey
          </p>
        </div>

        {error   && <div className="error-message"   style={{ marginBottom: '1.25rem' }}>{error}</div>}
        {success && <div className="success-message" style={{ marginBottom: '1.25rem' }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {FIELDS.map(({ id, icon: Icon, type, label, placeholder, min }) => (
            <div className="form-group" key={id}>
              <label htmlFor={id}>{label}</label>
              <div style={{ position: 'relative' }}>
                <Icon size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={type} id={id} className="form-control"
                  value={formData[id]} onChange={handleChange}
                  required placeholder={placeholder}
                  minLength={min}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !!success}
            style={{
              marginTop: '0.5rem', width: '100%',
              fontSize: '1rem', padding: '0.95rem',
              background: 'linear-gradient(135deg, #059669, #047857)',
              boxShadow: '0 8px 24px rgba(5,150,105,0.4)',
            }}
          >
            {loading ? 'Creating Account…' : <><span>Sign Up</span> <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#34D399', fontWeight: 600 }}>Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
