import { useState, useEffect } from 'react';
import { siteUpdateApi } from '../../../api';
import Modal from '../../../components/ui/Modal';
import toast from 'react-hot-toast';
import { Plus, Trash2, Image, FileText, Video } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const typeIcons = { IMAGE: Image, VIDEO: Video, DOCUMENT: FileText, NOTE: FileText };

function UpdateForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ title: '', notes: '', mediaUrls: '', mediaType: 'NOTE' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <form onSubmit={e => {
      e.preventDefault();
      onSubmit({ ...form, mediaUrls: form.mediaUrls ? form.mediaUrls.split('\n').filter(Boolean) : [] });
    }}>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label">Type</label>
        <select className="form-select" value={form.mediaType} onChange={e => set('mediaType', e.target.value)}>
          {['NOTE', 'IMAGE', 'VIDEO', 'DOCUMENT'].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} rows={4} />
      </div>
      <div className="form-group">
        <label className="form-label">Media URLs (one per line)</label>
        <textarea className="form-textarea" value={form.mediaUrls} onChange={e => set('mediaUrls', e.target.value)} placeholder="https://..." rows={3} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Post Update</button>
      </div>
    </form>
  );
}

export default function SiteUpdatesTab({ projectId }) {
  const [updates, setUpdates] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => siteUpdateApi.getAll(projectId).then(r => setUpdates(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (data) => {
    try { await siteUpdateApi.create(projectId, data); toast.success('Update posted'); setShowCreate(false); load(); }
    catch { toast.error('Failed'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete update?')) return;
    try { await siteUpdateApi.delete(projectId, id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4" style={{ marginBottom: 16 }}>
        <h3 style={{ fontWeight: 600 }}>Site Updates</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
          <Plus size={14} /> Post Update
        </button>
      </div>
      {loading ? <div className="spinner" /> : updates.length === 0 ? (
        <div className="empty-state"><p>No site updates yet</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {updates.map(u => {
            const Icon = typeIcons[u.mediaType] || FileText;
            return (
              <div key={u.id} className="card">
                <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
                  <div className="flex items-center gap-2">
                    <Icon size={16} color="var(--primary)" />
                    <span style={{ fontWeight: 600 }}>{u.title}</span>
                    <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>{u.mediaType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted text-sm">{u.postedBy?.fullName || u.postedBy?.username}</span>
                    <span className="text-muted text-sm">• {u.createdAt ? formatDistanceToNow(new Date(u.createdAt), { addSuffix: true }) : ''}</span>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}><Trash2 size={12} /></button>
                  </div>
                </div>
                {u.notes && <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{u.notes}</p>}
                {u.mediaUrls?.length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {u.mediaUrls.map((url, i) => (
                      u.mediaType === 'IMAGE' ? (
                        <img key={i} src={url} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
                      ) : (
                        <a key={i} href={url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">View Media {i + 1}</a>
                      )
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {showCreate && <Modal title="Post Site Update" onClose={() => setShowCreate(false)}><UpdateForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} /></Modal>}
    </div>
  );
}
