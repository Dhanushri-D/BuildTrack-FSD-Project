import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { projectApi, analyticsApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, FolderOpen, CheckCircle, DollarSign, AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell
} from 'recharts';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const STATUS_COLORS = { ACTIVE: '#6366f1', PLANNING: '#0ea5e9', ON_HOLD: '#f59e0b', COMPLETED: '#10b981', CANCELLED: '#ef4444' };
const BADGE = { ACTIVE: 'active', PLANNING: 'planning', ON_HOLD: 'on_hold', COMPLETED: 'completed', CANCELLED: 'cancelled' };

const CustomAreaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', boxShadow: 'var(--shadow-md)' }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontSize: 13 }}>{p.name}: <strong>{p.value}%</strong></p>
      ))}
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', boxShadow: 'var(--shadow-md)' }}>
      <p style={{ fontWeight: 600, color: payload[0].payload.fill }}>{payload[0].name}</p>
      <p style={{ fontSize: 13 }}>Count: <strong>{payload[0].value}</strong></p>
      <p style={{ fontSize: 13 }}>Share: <strong>{(payload[0].percent * 100).toFixed(1)}%</strong></p>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([projectApi.getAll(), analyticsApi.getDashboard()])
      .then(([p, s]) => { setProjects(p.data); setStats(s.data); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const activeProjects = projects.filter(p => p.status === 'ACTIVE');
  const overBudget = projects.filter(p => p.totalBudget > 0 && (p.spentBudget / p.totalBudget) > 0.8);
  const recentProjects = [...projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  // Area chart: progress distribution across active projects
  const progressAreaData = activeProjects.map(p => ({
    name: p.name.length > 12 ? p.name.slice(0, 12) + '…' : p.name,
    progress: p.progress || 0,
    budget: p.totalBudget > 0 ? Math.round((p.spentBudget / p.totalBudget) * 100) : 0,
  }));

  // Pie: status breakdown
  const statusPieData = [
    { name: 'Active', value: stats.activeProjects || 0, fill: '#6366f1' },
    { name: 'Planning', value: (stats.totalProjects || 0) - (stats.activeProjects || 0) - (stats.completedProjects || 0) - (stats.onHoldProjects || 0), fill: '#0ea5e9' },
    { name: 'On Hold', value: stats.onHoldProjects || 0, fill: '#f59e0b' },
    { name: 'Completed', value: stats.completedProjects || 0, fill: '#10b981' },
  ].filter(d => d.value > 0);

  // Radial: avg progress
  const radialData = [{ name: 'Progress', value: stats.averageProgress || 0, fill: '#6366f1' }];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects || 0, icon: FolderOpen, color: '#6366f1', bg: '#e0e7ff', sub: `${stats.activeProjects || 0} active` },
    { label: 'Completed', value: stats.completedProjects || 0, icon: CheckCircle, color: '#10b981', bg: '#dcfce7', sub: 'finished projects' },
    { label: 'Total Budget', value: `$${((stats.totalBudget || 0) / 1000000).toFixed(1)}M`, icon: DollarSign, color: '#f59e0b', bg: '#fef9c3', sub: `$${((stats.totalSpent || 0) / 1000000).toFixed(1)}M spent` },
    { label: 'Avg Progress', value: `${stats.averageProgress || 0}%`, icon: TrendingUp, color: '#0ea5e9', bg: '#e0f2fe', sub: 'across all projects' },
  ];

  return (
    <AppLayout title="Dashboard">
      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{greeting}, {user?.fullName?.split(' ')[0] || user?.username}! 👋</div>
          <div style={{ opacity: 0.85, fontSize: 14 }}>Here's what's happening across your construction projects today.</div>
          {overBudget.length > 0 && (
            <div style={{ marginTop: 10, background: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <AlertTriangle size={14} /> {overBudget.length} project{overBudget.length > 1 ? 's' : ''} over 80% budget
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', opacity: 0.9 }}>
          <div style={{ fontSize: 13 }}>{format(new Date(), 'EEEE, MMMM d yyyy')}</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{activeProjects.length} Active</div>
          <div style={{ fontSize: 13 }}>projects running</div>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? <div className="spinner" /> : (
        <>
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            {statCards.map(({ label, value, icon: Icon, color, bg, sub }) => (
              <div key={label} className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="stat-label">{label}</div>
                    <div className="stat-value" style={{ color, fontSize: 26 }}>{value}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>
                  </div>
                  <div className="stat-icon" style={{ background: bg }}><Icon size={20} color={color} /></div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
            {/* Area Chart */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Active Projects — Progress vs Budget</div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Hover for details</span>
              </div>
              {progressAreaData.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}>No active projects</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={progressAreaData} margin={{ top: 5, right: 10, left: -20, bottom: 40 }}>
                    <defs>
                      <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip content={<CustomAreaTooltip />} />
                    <Area type="monotone" dataKey="progress" name="Progress %" stroke="#6366f1" strokeWidth={2} fill="url(#progressGrad)" dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                    <Area type="monotone" dataKey="budget" name="Budget Used %" stroke="#f59e0b" strokeWidth={2} fill="url(#budgetGrad)" dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Radial + Pie stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ flex: 1 }}>
                <div className="card-title" style={{ marginBottom: 8 }}>Avg Completion</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <ResponsiveContainer width={100} height={100}>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
                      <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'var(--surface2)' }} />
                      <Tooltip formatter={v => `${v}%`} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#6366f1' }}>{stats.averageProgress || 0}%</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>average across<br />all projects</div>
                  </div>
                </div>
              </div>
              <div className="card" style={{ flex: 1 }}>
                <div className="card-title" style={{ marginBottom: 4 }}>Status Breakdown</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ResponsiveContainer width={80} height={80}>
                    <PieChart>
                      <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={22} outerRadius={36} dataKey="value">
                        {statusPieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1 }}>
                    {statusPieData.map(d => (
                      <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.fill, display: 'inline-block' }} />
                          {d.name}
                        </span>
                        <strong>{d.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Recent Projects + Alerts */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Recent Projects</div>
                <Link to="/projects" className="btn btn-secondary btn-sm">View All <ArrowRight size={12} /></Link>
              </div>
              {recentProjects.map(p => {return (
                  <Link key={p.id} to={`/projects/${p.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: STATUS_COLORS[p.status] + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Activity size={18} color={STATUS_COLORS[p.status]} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.clientName}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span className={`badge badge-${BADGE[p.status]}`} style={{ fontSize: 11 }}>{p.status}</span>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{p.progress || 0}% done</div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Budget Alerts</div>
                <AlertTriangle size={16} color="var(--warning)" />
              </div>
              {overBudget.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                  <CheckCircle size={32} color="var(--success)" style={{ margin: '0 auto 8px' }} />
                  All projects within budget
                </div>
              ) : overBudget.map(p => {
                const pct = Math.round((p.spentBudget / p.totalBudget) * 100);
                return (
                  <Link key={p.id} to={`/projects/${p.id}`} style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                      <span style={{ fontWeight: 700, color: pct >= 100 ? 'var(--danger)' : 'var(--warning)', fontSize: 13 }}>{pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill danger" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                      ${(p.spentBudget || 0).toLocaleString()} / ${(p.totalBudget || 0).toLocaleString()}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
