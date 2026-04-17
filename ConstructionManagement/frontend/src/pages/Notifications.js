import { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { notificationApi } from '../api';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const typeColors = { INFO: '#dbeafe', WARNING: '#fef9c3', ALERT: '#fee2e2', SUCCESS: '#dcfce7' };

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => notificationApi.getAll().then(r => setNotifications(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const markAllRead = async () => {
    try { await notificationApi.markAllRead(); toast.success('All marked as read'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <AppLayout title="Notifications">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Notifications</h2>
          <button className="btn btn-secondary btn-sm" onClick={markAllRead}>
            <CheckCheck size={14} /> Mark All Read
          </button>
        </div>
        {loading ? <div className="spinner" /> : notifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <p>No notifications</p>
          </div>
        ) : (
          <div>
            {notifications.map(n => (
              <div key={n.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'flex-start', opacity: n.read ? 0.6 : 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: typeColors[n.type] || '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bell size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: n.read ? 400 : 600, fontSize: 14 }}>{n.title}</div>
                  {n.message && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{n.message}</div>}
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ''}
                  </div>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: 6, flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
