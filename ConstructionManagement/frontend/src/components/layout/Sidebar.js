import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FolderKanban, Users, BarChart3,
  Bell, LogOut, HardHat, UserCircle
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/users', icon: Users, label: 'Team' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <HardHat size={24} color="var(--primary)" />
        <span>BuildTrack</span>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-label">Main</div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
      <div className="sidebar-footer">
        <div className="user-card" style={{ cursor: 'default' }}>
          <div className="avatar" title="View Profile" onClick={() => navigate('/profile')}
            style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            {user?.fullName?.[0] || user?.username?.[0] || 'U'}
          </div>
          <div className="user-info" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
            <div className="user-name">{user?.fullName || user?.username}</div>
            <div className="user-role" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <UserCircle size={11} />{user?.role}
            </div>
          </div>
          <button className="btn-icon" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
