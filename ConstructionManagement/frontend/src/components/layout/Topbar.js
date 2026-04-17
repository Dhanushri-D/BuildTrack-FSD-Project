import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { notificationApi } from '../../api';
import { formatDistanceToNow } from 'date-fns';

export default function Topbar({ title }) {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef();

  useEffect(() => {
    notificationApi.getUnreadCount().then(r => setUnread(r.data.count)).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openNotif = async () => {
    if (!showNotif) {
      const r = await notificationApi.getAll().catch(() => ({ data: [] }));
      setNotifications(r.data);
      if (unread > 0) {
        await notificationApi.markAllRead().catch(() => {});
        setUnread(0);
      }
    }
    setShowNotif(v => !v);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="topbar-right" ref={ref} style={{ position: 'relative' }}>
        <button className="btn-icon" onClick={openNotif} style={{ position: 'relative' }}>
          <Bell size={18} />
          {unread > 0 && (
            <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, background: 'var(--danger)', borderRadius: '50%' }} />
          )}
        </button>
        {showNotif && (
          <div className="notif-panel">
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
              Notifications
            </div>
            {notifications.length === 0 ? (
              <div className="empty-state" style={{ padding: 24 }}>No notifications</div>
            ) : notifications.slice(0, 10).map(n => (
              <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                <div className="notif-title">{n.title}</div>
                <div className="notif-msg">{n.message}</div>
                <div className="notif-time">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
