import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { projectApi } from '../api';
import { Plus, Search, FolderOpen, MapPin, Calendar, TrendingUp } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ProjectForm from './dashboard/ProjectForm';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const STATUS_COLORS = { ACTIVE: '#6366f1', PLANNING: '#0ea5e9', ON_HOLD: '#f59e0b', COMPLETED: '#10b981', CANCELLED: '#ef4444' };
const BADGE = { ACTIVE: 'active', PLANNING: 'planning', ON_HOLD: 'on_hold', COMPLETED: 'completed', CANCELLED: 'cancelled' };

function ProjectCard({ project, onDelete }) {
  const budgetPct = project.totalBudget > 0 ? Math.round((project.spentBudget / project.totalBudget) * 100) : 0;
  const daysLeft = project.endDate ? Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow)', transition: 'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'none'; }}>
      {/* Color top bar */}
      <div style={{ height: 4, background: STATUS_COLORS[project.status] || '#6366f1' }} />
      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Link to={`/projects/${project.id}`} style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', textDecoration: 'none', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {project.name}
            </Link>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{project.clientName}</div>
          </div>
          <span className={`badge badge-${BADGE[project.status]}`} style={{ marginLeft: 8, flexShrink: 0 }}>{project.status}</span>
        </div>

        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={11} />{project.location || 'N/A'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Calendar size={11} />
            {daysLeft !== null ? (daysLeft > 0 ? `${daysLeft}d left` : `${Math.abs(daysLeft)}d overdue`) : 'No deadline'}
          </span>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>Progress</span>
            <span style={{ fontWeight: 600 }}>{project.progress || 0}%</span>
          </div>
          <div className="progress-bar">
            <div className={`progress-fill ${project.progress >= 80 ? 'success' : project.progress >= 50 ? '' : 'warning'}`}
              style={{ width: `${project.progress || 0}%` }} />
          </div>
        </div>

        {/* Budget */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: 'var(--text-muted)' }}>Budget Used</span>
            <span style={{ fontWeight: 600, color: budgetPct > 80 ? 'var(--danger)' : 'var(--text)' }}>{budgetPct}%</span>
          </div>
          <div className="progress-bar">
            <div className={`progress-fill ${budgetPct > 80 ? 'danger' : budgetPct > 60 ? 'warning' : 'success'}`}
              style={{ width: `${Math.min(budgetPct, 100)}%` }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            ${(project.totalBudget || 0).toLocaleString()}
          </span>
          <Link to={`/projects/${project.id}`} className="btn btn-primary btn-sm">
            View <TrendingUp size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [view, setView] = useState('grid');
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const r = await projectApi.getAll(params);
      setProjects(r.data);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (data) => {
    try { await projectApi.create(data); toast.success('Project created!'); setShowCreate(false); load(); }
    catch { toast.error('Failed to create project'); }
  };

  const statusCounts = projects.reduce((acc, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; }, {});

  return (
    <AppLayout title="Projects">
      {/* Summary bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
            style={{ background: statusFilter === status ? STATUS_COLORS[status] : 'var(--surface)', border: `2px solid ${STATUS_COLORS[status]}`, borderRadius: 10, padding: '8px 16px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusFilter === status ? 'white' : STATUS_COLORS[status] }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: statusFilter === status ? 'white' : STATUS_COLORS[status] }}>{status}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: statusFilter === status ? 'white' : 'var(--text)' }}>{count}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: 10 }}>
          <h2 className="card-title">All Projects ({projects.length})</h2>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-bar">
              <Search size={16} color="var(--text-muted)" />
              <input placeholder="Search by name or client..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              {['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'].map(s => <option key={s}>{s}</option>)}
            </select>
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              {['grid', 'list'].map(v => (
                <button key={v} onClick={() => setView(v)}
                  style={{ padding: '7px 12px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, background: view === v ? 'var(--primary)' : 'var(--surface)', color: view === v ? 'white' : 'var(--text-muted)', transition: 'all 0.15s' }}>
                  {v === 'grid' ? '⊞ Grid' : '☰ List'}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={16} /> New Project
            </button>
          </div>
        </div>

        {loading ? <div className="spinner" /> : projects.length === 0 ? (
          <div className="empty-state"><FolderOpen size={48} /><p>No projects found</p></div>
        ) : view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {projects.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Project</th><th>Client</th><th>Status</th><th>Progress</th><th>Budget Used</th><th>End Date</th><th></th></tr>
              </thead>
              <tbody>
                {projects.map(p => {
                  const budgetPct = p.totalBudget > 0 ? Math.round((p.spentBudget / p.totalBudget) * 100) : 0;
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.location}</div>
                      </td>
                      <td>{p.clientName}</td>
                      <td><span className={`badge badge-${BADGE[p.status]}`}>{p.status}</span></td>
                      <td style={{ minWidth: 120 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ flex: 1 }}>
                            <div className="progress-fill" style={{ width: `${p.progress || 0}%` }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, width: 32 }}>{p.progress || 0}%</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: budgetPct > 80 ? 'var(--danger)' : 'var(--text)' }}>{budgetPct}%</td>
                      <td style={{ fontSize: 13 }}>{p.endDate ? format(new Date(p.endDate), 'MMM d, yyyy') : '—'}</td>
                      <td><Link to={`/projects/${p.id}`} className="btn btn-secondary btn-sm">View</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Create Project" onClose={() => setShowCreate(false)}>
          <ProjectForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
        </Modal>
      )}
    </AppLayout>
  );
}
