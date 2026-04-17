import { useState, useEffect } from 'react';
import { userApi } from '../../api';

export default function ProjectForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: '', description: '', status: 'PLANNING', startDate: '', endDate: '',
    totalBudget: '', spentBudget: '', progress: 0, location: '', clientName: '', managerId: '',
    ...initial
  });
  const [users, setUsers] = useState([]);

  useEffect(() => { userApi.getAll().then(r => setUsers(r.data)).catch(() => {}); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      totalBudget: form.totalBudget ? parseFloat(form.totalBudget) : null,
      spentBudget: form.spentBudget ? parseFloat(form.spentBudget) : null,
      progress: parseInt(form.progress) || 0,
      managerId: form.managerId ? parseInt(form.managerId) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Project Name *</label>
        <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Client Name</label>
          <input className="form-input" value={form.clientName} onChange={e => set('clientName', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
            {['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Manager</label>
          <select className="form-select" value={form.managerId} onChange={e => set('managerId', e.target.value)}>
            <option value="">Select Manager</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.fullName || u.username}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input className="form-input" type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input className="form-input" type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Total Budget ($)</label>
          <input className="form-input" type="number" value={form.totalBudget} onChange={e => set('totalBudget', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Spent Budget ($)</label>
          <input className="form-input" type="number" value={form.spentBudget} onChange={e => set('spentBudget', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Progress ({form.progress}%)</label>
        <input type="range" min="0" max="100" value={form.progress} onChange={e => set('progress', e.target.value)} style={{ width: '100%' }} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Project</button>
      </div>
    </form>
  );
}
