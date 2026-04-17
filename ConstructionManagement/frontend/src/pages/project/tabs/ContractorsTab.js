import { useState, useEffect } from 'react';
import { contractorApi } from '../../../api';
import Modal from '../../../components/ui/Modal';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

function ContractorForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', specialty: '', contractValue: '', contractStart: '', contractEnd: '', status: 'ACTIVE', ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ ...form, contractValue: form.contractValue ? parseFloat(form.contractValue) : null }); }}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Name *</label>
          <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Company</label>
          <input className="form-input" value={form.company} onChange={e => set('company', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Specialty</label>
          <input className="form-input" value={form.specialty} onChange={e => set('specialty', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Contract Value ($)</label>
          <input className="form-input" type="number" value={form.contractValue} onChange={e => set('contractValue', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Contract Start</label>
          <input className="form-input" type="date" value={form.contractStart} onChange={e => set('contractStart', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Contract End</label>
          <input className="form-input" type="date" value={form.contractEnd} onChange={e => set('contractEnd', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Status</label>
        <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
          {['ACTIVE', 'COMPLETED', 'TERMINATED'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Contractor</button>
      </div>
    </form>
  );
}

export default function ContractorsTab({ projectId }) {
  const [contractors, setContractors] = useState([]);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => contractorApi.getAll(projectId).then(r => setContractors(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (data) => {
    try { await contractorApi.create(projectId, data); toast.success('Contractor added'); setModal(null); load(); }
    catch { toast.error('Failed'); }
  };
  const handleUpdate = async (data) => {
    try { await contractorApi.update(projectId, modal.contractor.id, data); toast.success('Updated'); setModal(null); load(); }
    catch { toast.error('Failed'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete contractor?')) return;
    try { await contractorApi.delete(projectId, id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Contractors</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: 'create' })}>
          <Plus size={14} /> Add Contractor
        </button>
      </div>
      {loading ? <div className="spinner" /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Company</th><th>Specialty</th><th>Contract Value</th><th>Period</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {contractors.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>No contractors yet</td></tr>
              ) : contractors.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.email}</div>
                  </td>
                  <td>{c.company || '—'}</td>
                  <td>{c.specialty || '—'}</td>
                  <td style={{ fontWeight: 600 }}>{c.contractValue ? `$${parseFloat(c.contractValue).toLocaleString()}` : '—'}</td>
                  <td style={{ fontSize: 12 }}>
                    {c.contractStart ? format(new Date(c.contractStart), 'MMM d') : '—'} → {c.contractEnd ? format(new Date(c.contractEnd), 'MMM d, yyyy') : '—'}
                  </td>
                  <td><span className={`badge badge-${c.status?.toLowerCase()}`}>{c.status}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-secondary btn-sm" onClick={() => setModal({ type: 'edit', contractor: c })}><Edit size={12} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal?.type === 'create' && <Modal title="Add Contractor" onClose={() => setModal(null)}><ContractorForm onSubmit={handleCreate} onCancel={() => setModal(null)} /></Modal>}
      {modal?.type === 'edit' && <Modal title="Edit Contractor" onClose={() => setModal(null)}><ContractorForm initial={modal.contractor} onSubmit={handleUpdate} onCancel={() => setModal(null)} /></Modal>}
    </div>
  );
}
