import { useState, useEffect } from 'react';
import { taskApi } from '../../../api';

function GanttChart({ tasks }) {
  if (!tasks.length) return <div className="empty-state">No tasks with dates to display</div>;

  const tasksWithDates = tasks.filter(t => t.startDate && t.dueDate);
  if (!tasksWithDates.length) return <div className="empty-state">Add start and due dates to tasks to see the Gantt chart</div>;

  const allDates = tasksWithDates.flatMap(t => [new Date(t.startDate), new Date(t.dueDate)]);
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));
  const totalDays = Math.max((maxDate - minDate) / (1000 * 60 * 60 * 24), 1);

  const statusColors = { TODO: '#94a3b8', IN_PROGRESS: '#6366f1', REVIEW: '#f59e0b', DONE: '#10b981' };

  return (
    <div className="gantt-container">
      <div style={{ minWidth: 700 }}>
        <div className="gantt-row" style={{ background: 'var(--surface2)', fontWeight: 600 }}>
          <div className="gantt-label" style={{ fontSize: 12, color: 'var(--text-muted)' }}>Task</div>
          <div className="gantt-timeline" style={{ display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: 11, color: 'var(--text-muted)' }}>
            <span>{minDate.toLocaleDateString()}</span>
            <span style={{ marginLeft: 'auto' }}>{maxDate.toLocaleDateString()}</span>
          </div>
        </div>
        {tasksWithDates.map(task => {
          const start = new Date(task.startDate);
          const end = new Date(task.dueDate);
          const left = ((start - minDate) / (1000 * 60 * 60 * 24) / totalDays) * 100;
          const width = Math.max(((end - start) / (1000 * 60 * 60 * 24) / totalDays) * 100, 2);
          return (
            <div key={task.id} className="gantt-row">
              <div className="gantt-label">
                <div style={{ fontWeight: 500, fontSize: 13 }}>{task.title}</div>
                <span className={`badge badge-${task.status?.toLowerCase()}`} style={{ fontSize: 10 }}>{task.status}</span>
              </div>
              <div className="gantt-timeline">
                <div className="gantt-bar" style={{ left: `${left}%`, width: `${width}%`, background: statusColors[task.status] || 'var(--primary)' }}>
                  {width > 8 && task.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TimelineTab({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskApi.getAll(projectId).then(r => setTasks(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [projectId]);

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: 20 }}>Project Timeline (Gantt Chart)</div>
      {loading ? <div className="spinner" /> : <GanttChart tasks={tasks} />}
    </div>
  );
}
