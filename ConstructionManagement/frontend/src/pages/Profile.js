import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { userApi } from '../api';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import { Edit, Trash2, Mail, Phone, Shield, User, Save, X } from 'lucide-react';
import { format } from 'date-fns';

const ROLE_COLORS = { ADMIN: { bg: '#fee2e2', color: '#dc2626' }, MANAGER: { bg: '#dbeafe', color: '#2563eb' }, ENGINEER: { bg: '#dcfce7', color: '#16a34a' } };

export default function Profile() {
  const { user: authUser, login, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    userApi.getMe()
      .then(r => { setProfile(r.data); setForm(r.data); })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/users/${profile.id}`, {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
      });
      setProfile(data);
      // update auth context so sidebar reflects changes
      login({ ...authUser, fullName: data.fullName, email: data.email }, localStorage.getItem('token'));
      toast.success('Profile updated!');
      setEditing(false);
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${profile.id}`);
      toast.success('Account deleted');
      logout();
      navigate('/login');
    } catch { toast.error('Failed to delete account'); }
  };

  if (loading) return <AppLayout title="Profile"><div className="spinner" /></AppLayout>;
  if (!profile) return <AppLayout title="Profile"><div className="empty-state">Profile not found</div></AppLayout>;

  const roleStyle = ROLE_COLORS[profile.role] || ROLE_COLORS.ENGINEER;
  const initials = (profile.fullName || profile.username || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <AppLayout title="My Profile">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Cover + Avatar */}
        <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: 24 }}>
          <div style={{ height: 140, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #0ea5e9 100%)', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)' }} />
          </div>
          <div style={{ background: 'var(--surface)', padding: '0 28px 24px', position: 'relative' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -44, fontSize: 28, fontWeight: 800, color: 'white', boxShadow: '0 4px 12px rgba(99,102,241,0.4)', flexShrink: 0 }}>
                {initials}
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 12 }}>
                {!editing ? (
                  <>
                    <button className="btn btn-secondary" onClick={() => { setForm(profile); setEditing(true); }}>
                      <Edit size={15} /> Edit Profile
                    </button>
                    <button className="btn btn-danger" onClick={() => setShowDelete(true)}>
                      <Trash2 size={15} /> Delete Account
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-secondary" onClick={() => setEditing(false)}>
                      <X size={15} /> Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                      <Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Name + Role */}
            <div style={{ marginTop: 12 }}>
              {editing ? (
                <input className="form-input" value={form.fullName || ''} onChange={e => set('fullName', e.target.value)}
                  style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, maxWidth: 320 }} placeholder="Full Name" />
              ) : (
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{profile.fullName || profile.username}</h2>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>@{profile.username}</span>
                <span style={{ padding: '3px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: roleStyle.bg, color: roleStyle.color }}>
                  <Shield size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />{profile.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={16} color="var(--primary)" /> Contact Information
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Mail size={12} /> Email Address
                </div>
                {editing ? (
                  <input className="form-input" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} />
                ) : (
                  <div style={{ fontWeight: 500 }}>{profile.email}</div>
                )}
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Phone size={12} /> Phone Number
                </div>
                {editing ? (
                  <input className="form-input" value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+1 234 567 8900" />
                ) : (
                  <div style={{ fontWeight: 500 }}>{profile.phone || <span style={{ color: 'var(--text-muted)' }}>Not provided</span>}</div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={16} color="var(--primary)" /> Account Details
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Username', profile.username],
                ['Role', <span style={{ padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: roleStyle.bg, color: roleStyle.color }}>{profile.role}</span>],
                ['Member Since', profile.createdAt ? format(new Date(profile.createdAt), 'MMMM d, yyyy') : '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Password change hint */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #f0f4ff, #faf5ff)', border: '1px solid #e0e7ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Password & Security</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Keep your account secure with a strong password.</div>
            </div>
            <button className="btn btn-secondary" onClick={() => toast('Password change coming soon!', { icon: '🔒' })}>
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <Modal title="Delete Account" onClose={() => setShowDelete(false)}>
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={28} color="var(--danger)" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Are you absolutely sure?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
              This will permanently delete your account <strong>{profile.username}</strong> and all associated data. This action cannot be undone.
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete My Account</button>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
