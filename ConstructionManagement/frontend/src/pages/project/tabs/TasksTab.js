import { useState, useEffect } from 'react';
import { taskApi, userApi } from '../../../api';
import Modal from '../../../components/ui/Modal';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

function TaskForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', startDate: '', dueDate: '', progress: 0, assigneeId: '', ...initial });
  const [users, setUsers] = useState([]);
  useEffect(() => { userApi.getAll().then(r => setUsers(r.data)).catch(() => {}); }, []);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ ...form, progress: parseInt(form.progress) || 0, assigneeId: form.assigneeId ? parseInt(form.assigneeId) : null }); }}>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
            {['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select className="form-select" value={form.priority} onChange={e => set('priority', e.target.value)}>
            {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input className="form-input" type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input className="form-input" type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Assignee</label>
          <select className="form-select" value={form.assigneeId} onChange={e => set('assigneeId', e.target.value)}>
            <option value="">Unassigned</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.fullName || u.username}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Progress ({form.progress}%)</label>
          <input type="range" min="0" max="100" value={form.progress} onChange={e => set('progress', e.target.value)} style={{ width: '100%', marginTop: 8 }} />
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Task</button>
      </div>
    </form>
  );
}

export default function TasksTab({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => taskApi.getAll(projectId).then(r => setTasks(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (data) => {
    try { await taskApi.create(projectId, data); toast.success('Task created'); setModal(null); load(); }
    catch { toast.error('Failed'); }
  };
  const handleUpdate = async (data) => {
    try { await taskApi.update(projectId, modal.task.id, data); toast.success('Task updated'); setModal(null); load(); }
    catch { toast.error('Failed'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete task?')) return;
    try { await taskApi.delete(projectId, id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  const columns = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
  const colLabels = { TODO: 'To Do', IN_PROGRESS: 'In Progress', REVIEW: 'Review', DONE: 'Done' };

  return (
    <div>
      <div className="flex justify-between items-center mb-4" style={{ marginBottom: 16 }}>
        <h3 style={{ fontWeight: 600 }}>Task Board</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: 'create' })}>
          <Plus size={14} /> Add Task
        </button>
      </div>
      {loading ? <div className="spinner" /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {columns.map(col => (
            <div key={col} style={{ background: 'var(--surface2)', borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                {colLabels[col]}
                <span style={{ background: 'var(--border)', borderRadius: 99, padding: '1px 8px', fontSize: 12 }}>
                  {tasks.filter(t => t.status === col).length}
                </span>
              </div>
              {tasks.filter(t => t.status === col).map(task => (
                <div key={task.id} style={{ background: 'white', borderRadius: 8, padding: 12, marginBottom: 8, border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{task.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span className={`badge badge-${task.priority?.toLowerCase()}`}>{task.priority}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{task.progress || 0}%</span>
                  </div>
                  {task.assignee && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>👤 {task.assignee.fullName || task.assignee.username}</div>}
                  {task.dueDate && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>📅 {task.dueDate}</div>}
                  <div className="flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={() => setModal({ type: 'edit', task })}>
                      <Edit size={12} />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {modal?.type === 'create' && (
        <Modal title="Add Task" onClose={() => setModal(null)}>
          <TaskForm onSubmit={handleCreate} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === 'edit' && (
        <Modal title="Edit Task" onClose={() => setModal(null)}>
          <TaskForm initial={{ ...modal.task, assigneeId: modal.task.assignee?.id || '' }} onSubmit={handleUpdate} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}
