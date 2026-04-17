import { useState, useEffect, useRef } from 'react';
import { documentApi } from '../../../api';
import toast from 'react-hot-toast';
import { Upload, Trash2, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = ['CONTRACT', 'BLUEPRINT', 'PERMIT', 'REPORT', 'INVOICE', 'OTHER'];

export default function DocumentsTab({ projectId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('OTHER');
  const fileRef = useRef();

  const load = () => documentApi.getAll(projectId).then(r => setDocuments(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', category);
      await documentApi.upload(projectId, fd);
      toast.success('Document uploaded');
      load();
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete document?')) return;
    try { await documentApi.delete(projectId, id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Documents</h3>
        <div className="flex gap-2 items-center">
          <select className="form-select" style={{ width: 'auto' }} value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => fileRef.current.click()} disabled={uploading}>
            <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleUpload} />
        </div>
      </div>
      {loading ? <div className="spinner" /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Category</th><th>Type</th><th>Size</th><th>Uploaded</th><th>Actions</th></tr></thead>
            <tbody>
              {documents.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>No documents uploaded</td></tr>
              ) : documents.map(d => (
                <tr key={d.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <FileText size={16} color="var(--primary)" />
                      <span style={{ fontWeight: 500 }}>{d.name}</span>
                    </div>
                  </td>
                  <td><span className="badge" style={{ background: 'var(--surface2)' }}>{d.category}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.fileType || '—'}</td>
                  <td>{formatSize(d.fileSize)}</td>
                  <td>{d.uploadedAt ? format(new Date(d.uploadedAt), 'MMM d, yyyy') : '—'}</td>
                  <td>
                    <div className="flex gap-2">
                      <a href={`https://buildtrack-fsd-project-production.up.railway.app${d.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                        <Download size={12} />
                      </a>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
