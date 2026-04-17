import { useState, useEffect } from 'react';
import { expenseApi } from '../../../api';
import Modal from '../../../components/ui/Modal';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const CATEGORIES = ['MATERIALS', 'LABOR', 'EQUIPMENT', 'PERMITS', 'OVERHEAD', 'OTHER'];

function ExpenseForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({ title: '', amount: '', category: 'MATERIALS', date: '', vendor: '', notes: '', ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ ...form, amount: parseFloat(form.amount) }); }}>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Amount ($) *</label>
          <input className="form-input" type="number" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Date</label>
          <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Vendor</label>
          <input className="form-input" value={form.vendor} onChange={e => set('vendor', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Expense</button>
      </div>
    </form>
  );
}

export default function BudgetTab({ projectId, project }) {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [eRes, aRes] = await Promise.all([expenseApi.getAll(projectId), expenseApi.getAnalytics(projectId)]);
      setExpenses(eRes.data);
      setAnalytics(aRes.data);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (data) => {
    try { await expenseApi.create(projectId, data); toast.success('Expense added'); setModal(null); load(); }
    catch { toast.error('Failed'); }
  };
  const handleUpdate = async (data) => {
    try { await expenseApi.update(projectId, modal.expense.id, data); toast.success('Updated'); setModal(null); load(); }
    catch { toast.error('Failed'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete expense?')) return;
    try { await expenseApi.delete(projectId, id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  const pieData = analytics.byCategory ? Object.entries(analytics.byCategory).map(([name, value]) => ({ name, value: parseFloat(value) })) : [];
  const budgetPct = project.totalBudget > 0 ? Math.round((analytics.total / project.totalBudget) * 100) : 0;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
        {[
          ['Total Budget', `$${(project.totalBudget || 0).toLocaleString()}`, 'var(--primary)'],
          ['Total Spent', `$${(analytics.total || 0).toLocaleString()}`, budgetPct > 80 ? 'var(--danger)' : 'var(--success)'],
          ['Remaining', `$${((project.totalBudget || 0) - (analytics.total || 0)).toLocaleString()}`, 'var(--text)'],
        ].map(([label, value, color]) => (
          <div key={label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {pieData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Spending by Category</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => `$${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Category Breakdown</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pieData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => `$${v.toLocaleString()}`} />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Expenses</h3>
          <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: 'create' })}>
            <Plus size={14} /> Add Expense
          </button>
        </div>
        {loading ? <div className="spinner" /> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Title</th><th>Category</th><th>Amount</th><th>Vendor</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>No expenses yet</td></tr>
                ) : expenses.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 500 }}>{e.title}</td>
                    <td><span className="badge" style={{ background: 'var(--surface2)' }}>{e.category}</span></td>
                    <td style={{ fontWeight: 600 }}>${parseFloat(e.amount).toLocaleString()}</td>
                    <td>{e.vendor || '—'}</td>
                    <td>{e.date ? format(new Date(e.date), 'MMM d, yyyy') : '—'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-secondary btn-sm" onClick={() => setModal({ type: 'edit', expense: e })}><Edit size={12} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e.id)}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal?.type === 'create' && <Modal title="Add Expense" onClose={() => setModal(null)}><ExpenseForm onSubmit={handleCreate} onCancel={() => setModal(null)} /></Modal>}
      {modal?.type === 'edit' && <Modal title="Edit Expense" onClose={() => setModal(null)}><ExpenseForm initial={modal.expense} onSubmit={handleUpdate} onCancel={() => setModal(null)} /></Modal>}
    </div>
  );
}
