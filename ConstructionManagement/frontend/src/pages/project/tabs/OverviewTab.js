import { format } from 'date-fns';
import { Sparkles, AlertTriangle } from 'lucide-react';

export default function OverviewTab({ project, summary }) {
  const budgetPct = project.totalBudget > 0 ? Math.round((project.spentBudget / project.totalBudget) * 100) : 0;

  return (
    <div>
      {summary?.aiSummary && (
        <div className="ai-summary">
          <div className="ai-label"><Sparkles size={14} /> AI Project Summary</div>
          <div className="ai-text">{summary.aiSummary}</div>
        </div>
      )}

      {summary?.budgetAlert && (
        <div className="alert alert-warning">
          <AlertTriangle size={16} />
          Budget alert: {budgetPct}% of budget has been spent. Review expenses immediately.
        </div>
      )}

      {summary?.predictedOverrun && (
        <div className="alert alert-danger">
          <AlertTriangle size={16} />
          Budget overrun predicted: High spending with low progress completion.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Project Details</div>
          <table style={{ width: '100%' }}>
            <tbody>
              {[
                ['Status', <span className={`badge badge-${project.status?.toLowerCase()}`}>{project.status}</span>],
                ['Client', project.clientName || '—'],
                ['Location', project.location || '—'],
                ['Manager', project.manager?.fullName || project.manager?.username || '—'],
                ['Start Date', project.startDate ? format(new Date(project.startDate), 'MMM d, yyyy') : '—'],
                ['End Date', project.endDate ? format(new Date(project.endDate), 'MMM d, yyyy') : '—'],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td style={{ padding: '8px 0', color: 'var(--text-muted)', fontSize: 13, width: 120 }}>{k}</td>
                  <td style={{ padding: '8px 0', fontWeight: 500 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Progress & Budget</div>
          <div style={{ marginBottom: 20 }}>
            <div className="flex justify-between text-sm" style={{ marginBottom: 6 }}>
              <span>Overall Progress</span><span style={{ fontWeight: 600 }}>{project.progress || 0}%</span>
            </div>
            <div className="progress-bar" style={{ height: 10 }}>
              <div className="progress-fill" style={{ width: `${project.progress || 0}%` }} />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div className="flex justify-between text-sm" style={{ marginBottom: 6 }}>
              <span>Budget Used</span>
              <span style={{ fontWeight: 600, color: budgetPct > 80 ? 'var(--danger)' : 'var(--text)' }}>{budgetPct}%</span>
            </div>
            <div className="progress-bar" style={{ height: 10 }}>
              <div className={`progress-fill ${budgetPct > 80 ? 'danger' : budgetPct > 60 ? 'warning' : ''}`} style={{ width: `${budgetPct}%` }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Total Budget', `$${(project.totalBudget || 0).toLocaleString()}`],
              ['Spent', `$${(project.spentBudget || 0).toLocaleString()}`],
              ['Tasks Done', `${summary?.doneTasks || 0}/${summary?.totalTasks || 0}`],
              ['In Progress', summary?.inProgressTasks || 0],
            ].map(([k, v]) => (
              <div key={k} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {project.description && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 12 }}>Description</div>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{project.description}</p>
        </div>
      )}
    </div>
  );
}
