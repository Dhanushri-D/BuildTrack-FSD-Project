import { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { userApi } from '../api';
import { useAuth } from '../context/AuthContext';

const roleColors = { ADMIN: '#fee2e2', MANAGER: '#dbeafe', ENGINEER: '#dcfce7' };
const roleTextColors = { ADMIN: '#dc2626', MANAGER: '#2563eb', ENGINEER: '#16a34a' };

export default function Users() {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getAll().then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const isAdmin = authUser?.role === 'ADMIN';

  return (
    <AppLayout title="Team">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{isAdmin ? `All Team Members (${users.length})` : 'My Profile'}</h2>
          {!isAdmin && (
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Only admins can view all team members</span>
          )}
        </div>
        {loading ? <div className="spinner" /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {users.map(u => (
              <div key={u.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>
                  {(u.fullName || u.username)?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{u.fullName || u.username}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{u.email}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{u.phone || ''}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: roleColors[u.role], color: roleTextColors[u.role] }}>
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
