import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { projectApi, analyticsApi } from '../../api';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import ProjectForm from '../dashboard/ProjectForm';
import OverviewTab from './tabs/OverviewTab';
import TasksTab from './tabs/TasksTab';
import BudgetTab from './tabs/BudgetTab';
import TimelineTab from './tabs/TimelineTab';
import SiteUpdatesTab from './tabs/SiteUpdatesTab';
import ContractorsTab from './tabs/ContractorsTab';
import DocumentsTab from './tabs/DocumentsTab';

const TABS = ['Overview', 'Timeline', 'Tasks', 'Budget', 'Site Updates', 'Contractors', 'Documents'];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([
        projectApi.getById(id),
        analyticsApi.getProjectSummary(id)
      ]);
      setProject(pRes.data);
      setSummary(sRes.data);
    } catch { toast.error('Failed to load project'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdate = async (data) => {
    try {
      await projectApi.update(id, data);
      toast.success('Project updated!');
      setShowEdit(false);
      load();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectApi.delete(id);
      toast.success('Project deleted');
      navigate('/projects');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <AppLayout title="Project"><div className="spinner" /></AppLayout>;
  if (!project) return <AppLayout title="Project"><div className="empty-state">Project not found</div></AppLayout>;

  const initialForm = {
    ...project,
    startDate: project.startDate || '',
    endDate: project.endDate || '',
    managerId: project.manager?.id || '',
  };

  return (
    <AppLayout title={project.name}>
      <div className="flex items-center justify-between mb-6" style={{ marginBottom: 20 }}>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{project.name}</h2>
            <span className="text-muted text-sm">{project.clientName} • {project.location}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm" onClick={() => setShowEdit(true)}>
            <Edit size={14} /> Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && <OverviewTab project={project} summary={summary} />}
      {activeTab === 'Timeline' && <TimelineTab projectId={id} />}
      {activeTab === 'Tasks' && <TasksTab projectId={id} />}
      {activeTab === 'Budget' && <BudgetTab projectId={id} project={project} />}
      {activeTab === 'Site Updates' && <SiteUpdatesTab projectId={id} />}
      {activeTab === 'Contractors' && <ContractorsTab projectId={id} />}
      {activeTab === 'Documents' && <DocumentsTab projectId={id} />}

      {showEdit && (
        <Modal title="Edit Project" onClose={() => setShowEdit(false)}>
          <ProjectForm initial={initialForm} onSubmit={handleUpdate} onCancel={() => setShowEdit(false)} />
        </Modal>
      )}
    </AppLayout>
  );
}
