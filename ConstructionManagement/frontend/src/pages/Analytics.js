import { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { analyticsApi, projectApi } from '../api';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis, Treemap, BarChart
} from 'recharts';

const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

/* ── Tooltip components ── */
const ComposedTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 180 }}>
      <p style={{ fontWeight: 700, marginBottom: 8, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13, marginBottom: 4 }}>
          <span style={{ color: p.color, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
            {p.name}
          </span>
          <strong>{p.name.includes('%') ? `${p.value}%` : p.name.includes('$') ? `$${Number(p.value).toLocaleString()}` : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
      <p style={{ fontWeight: 700, color: d.payload.fill, marginBottom: 4 }}>{d.name}</p>
      <p style={{ fontSize: 13 }}>Projects: <strong>{d.value}</strong></p>
      <p style={{ fontSize: 13 }}>Share: <strong>{(d.percent * 100).toFixed(1)}%</strong></p>
    </div>
  );
};

const ScatterTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 160 }}>
      <p style={{ fontWeight: 700, marginBottom: 6 }}>{d?.name}</p>
      <p style={{ fontSize: 13, color: '#6366f1' }}>Progress: <strong>{d?.x}%</strong></p>
      <p style={{ fontSize: 13, color: '#f59e0b' }}>Budget Used: <strong>{d?.y}%</strong></p>
      <p style={{ fontSize: 13, color: '#10b981' }}>Budget: <strong>${Number(d?.z || 0).toLocaleString()}</strong></p>
    </div>
  );
};

const RadarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
      <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ fontSize: 13, color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 170 }}>
      <p style={{ fontWeight: 700, marginBottom: 6, borderBottom: '1px solid var(--border)', paddingBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, marginBottom: 3 }}>
          <span style={{ color: p.fill || p.color, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: p.fill || p.color, display: 'inline-block' }} />
            {p.name}
          </span>
          <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  );
};

const STATUS_COLORS = { ACTIVE: '#6366f1', PLANNING: '#0ea5e9', ON_HOLD: '#f59e0b', COMPLETED: '#10b981', CANCELLED: '#ef4444' };

const TreemapTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
      <p style={{ fontWeight: 700, marginBottom: 4 }}>{d?.name}</p>
      <p style={{ fontSize: 13 }}>Budget: <strong>${Number(d?.size || 0).toLocaleString()}</strong></p>
      <p style={{ fontSize: 13 }}>Progress: <strong>{d?.progress}%</strong></p>
    </div>
  );
};

const CustomTreemapContent = ({ x, y, width, height, name, progress, index }) => {
  if (width < 30 || height < 20) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={COLORS[index % COLORS.length]} rx={4} opacity={0.85} />
      <rect x={x} y={y + height - 4} width={width * (progress / 100)} height={4} fill="rgba(255,255,255,0.6)" rx={2} />
      {width > 60 && height > 30 && (
        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={11} fontWeight={600}>
          {name?.length > 12 ? name.slice(0, 12) + '…' : name}
        </text>
      )}
    </g>
  );
};

export default function Analytics() {
  const [stats, setStats] = useState({});
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsApi.getDashboard(), projectApi.getAll()])
      .then(([s, p]) => { setStats(s.data); setProjects(p.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusData = [
    { name: 'Active', value: stats.activeProjects || 0, fill: '#6366f1' },
    { name: 'Planning', value: (stats.totalProjects || 0) - (stats.activeProjects || 0) - (stats.completedProjects || 0) - (stats.onHoldProjects || 0), fill: '#0ea5e9' },
    { name: 'On Hold', value: stats.onHoldProjects || 0, fill: '#f59e0b' },
    { name: 'Completed', value: stats.completedProjects || 0, fill: '#10b981' },
  ].filter(d => d.value > 0);

  // Composed chart: progress bars + budget line
  const composedData = projects.slice(0, 8).map(p => ({
    name: p.name.length > 12 ? p.name.slice(0, 12) + '…' : p.name,
    'Progress %': p.progress || 0,
    'Budget Used %': p.totalBudget > 0 ? Math.round((p.spentBudget / p.totalBudget) * 100) : 0,
    'Total Budget $': p.totalBudget || 0,
  }));

  // Bar chart: progress + budget side by side (moved from Projects page)
  const barData = projects.slice(0, 8).map(p => ({
    name: p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name,
    progress: p.progress || 0,
    budget: p.totalBudget > 0 ? Math.round((p.spentBudget / p.totalBudget) * 100) : 0,
    status: p.status,
  }));

  // Scatter: progress vs budget usage (bubble = budget size)
  const scatterData = projects.map(p => ({
    name: p.name,
    x: p.progress || 0,
    y: p.totalBudget > 0 ? Math.round((p.spentBudget / p.totalBudget) * 100) : 0,
    z: p.totalBudget || 0,
  }));

  // Radar: top 6 projects scored on multiple dimensions
  const radarData = projects.slice(0, 6).map(p => ({
    project: p.name.length > 10 ? p.name.slice(0, 10) + '…' : p.name,
    Progress: p.progress || 0,
    'Budget Ctrl': p.totalBudget > 0 ? Math.max(0, 100 - Math.round((p.spentBudget / p.totalBudget) * 100)) : 100,
    Timeline: p.endDate ? Math.max(0, Math.min(100, Math.round(((new Date(p.endDate) - new Date()) / (1000 * 60 * 60 * 24)) / 3))) : 50,
  }));

  // Treemap: budget allocation
  const treemapData = projects.filter(p => p.totalBudget > 0).map((p, i) => ({
    name: p.name,
    size: p.totalBudget,
    progress: p.progress || 0,
    index: i,
  }));

  return (
    <AppLayout title="Analytics">
      {loading ? <div className="spinner" /> : (
        <>
          {/* KPI Row */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            {[
              ['Total Projects', stats.totalProjects || 0, '#6366f1'],
              ['Active', stats.activeProjects || 0, '#0ea5e9'],
              ['Completed', stats.completedProjects || 0, '#10b981'],
              ['Avg Progress', `${stats.averageProgress || 0}%`, '#f59e0b'],
              ['Team Size', stats.totalUsers || 0, '#8b5cf6'],
            ].map(([label, value, color]) => (
              <div key={label} className="stat-card">
                <div className="stat-label">{label}</div>
                <div className="stat-value" style={{ fontSize: 26, color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Row 1: Composed + Pie */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 20 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Progress & Budget — Combined View</div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Bars = progress · Line = budget used</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={composedData} margin={{ top: 5, right: 20, left: -10, bottom: 55 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip content={<ComposedTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                  <Legend wrapperStyle={{ paddingTop: 8, fontSize: 12 }} />
                  <Bar yAxisId="left" dataKey="Progress %" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Line yAxisId="right" type="monotone" dataKey="Budget Used %" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 5, fill: '#ef4444' }} activeDot={{ r: 7 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Status Distribution</div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Hover slices</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="45%" outerRadius={90} innerRadius={40} dataKey="value"
                    paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: 'var(--text-muted)', strokeWidth: 1 }}>
                    {statusData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Scatter + Radar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Progress vs Budget Efficiency</div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Bubble size = total budget</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="x" name="Progress %" type="number" domain={[0, 100]} tick={{ fontSize: 11 }} label={{ value: 'Progress %', position: 'insideBottom', offset: -5, fontSize: 11 }} />
                  <YAxis dataKey="y" name="Budget Used %" type="number" domain={[0, 120]} tick={{ fontSize: 11 }} label={{ value: 'Budget %', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                  <ZAxis dataKey="z" range={[60, 400]} />
                  <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={scatterData} fill="#6366f1" opacity={0.75} />
                  {/* Reference line: ideal diagonal */}
                  <line x1="10%" y1="90%" x2="90%" y2="10%" stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} opacity={0.5} />
                </ScatterChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                Points above the diagonal = over budget relative to progress
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Project Health Radar</div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Top 6 projects · Hover for scores</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={85}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="project" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar name="Progress" dataKey="Progress" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} dot={{ r: 3 }} />
                  <Radar name="Budget Control" dataKey="Budget Ctrl" stroke="#10b981" fill="#10b981" fillOpacity={0.2} dot={{ r: 3 }} />
                  <Tooltip content={<RadarTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 3: Treemap */}
          {treemapData.length > 0 && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Budget Allocation Treemap</div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Box size = total budget · Bottom bar = progress · Hover for details</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <Treemap data={treemapData} dataKey="size" aspectRatio={4 / 3}
                  content={<CustomTreemapContent />}>
                  <Tooltip content={<TreemapTooltip />} />
                </Treemap>
              </ResponsiveContainer>
            </div>
          )}
          {/* Row 4: Progress & Budget Bar Chart (moved from Projects page) */}
          {barData.length > 0 && (
            <div className="card" style={{ marginTop: 20 }}>
              <div className="card-header">
                <div className="card-title">Project Progress vs Budget Used</div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Color = project status · Hover bars for details</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 55 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Bar dataKey="progress" name="Progress %" radius={[4, 4, 0, 0]} maxBarSize={28}>
                    {barData.map((d, i) => <Cell key={i} fill={STATUS_COLORS[d.status] || '#6366f1'} />)}
                  </Bar>
                  <Bar dataKey="budget" name="Budget Used %" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} opacity={0.75} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
}
