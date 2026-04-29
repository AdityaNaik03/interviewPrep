import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Mic2, BookOpen, FileText,
  Calendar, TrendingUp, LogOut, Zap
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard',  gradient: 'linear-gradient(135deg,#4F46E5,#7C3AED)' },
  { to: '/interview', icon: Mic2,            label: 'Interview',  gradient: 'linear-gradient(135deg,#0891B2,#0E7490)' },
  { to: '/practice',  icon: BookOpen,        label: 'Practice',   gradient: 'linear-gradient(135deg,#059669,#047857)' },
  { to: '/resume',    icon: FileText,        label: 'Resume CV',  gradient: 'linear-gradient(135deg,#D97706,#B45309)' },
  { to: '/planner',   icon: Calendar,        label: 'Planner',    gradient: 'linear-gradient(135deg,#7C3AED,#6D28D9)' },
  { to: '/progress',  icon: TrendingUp,      label: 'Progress',   gradient: 'linear-gradient(135deg,#BE123C,#9F1239)' },
];

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Zap size={22} color="white" />
        </div>
        <h2>SmartPrep</h2>
      </div>

      {/* Nav */}
      <nav className="nav-links">
        {NAV_ITEMS.map(({ to, icon: Icon, label, gradient }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            style={({ isActive }) => isActive ? { '--active-gradient': gradient } : {}}
          >
            {({ isActive }) => (
              <>
                <span
                  className="nav-icon-wrap"
                  style={isActive ? { background: gradient, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' } : {}}
                >
                  <Icon size={16} />
                </span>
                <span>{label}</span>
                {isActive && (
                  <span style={{
                    marginLeft: 'auto',
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: gradient,
                    boxShadow: '0 0 8px rgba(129,140,248,0.7)',
                  }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--glass-border)',
      }}>
        <button
          onClick={logout}
          className="nav-link"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
            e.currentTarget.style.color = '#EF4444';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <span className="nav-icon-wrap" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
            <LogOut size={16} />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
