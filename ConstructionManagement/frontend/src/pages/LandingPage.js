import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HardHat, BarChart3, CheckSquare, DollarSign, Users, FileText,
  Bell, Zap, Shield, ArrowRight, ChevronRight,
  Building2, Globe
} from 'lucide-react';

const features = [
  { icon: BarChart3,    color: '#6366f1', bg: '#e0e7ff', title: 'Analytics Dashboard',     desc: 'Real-time charts and KPIs — area, radar, scatter, treemap — all with rich hover tooltips.' },
  { icon: CheckSquare, color: '#0ea5e9', bg: '#e0f2fe', title: 'Kanban Task Board',        desc: 'Drag tasks across TODO → IN PROGRESS → REVIEW → DONE with priority and assignee tracking.' },
  { icon: DollarSign,  color: '#10b981', bg: '#dcfce7', title: 'Budget Tracking',          desc: 'Track expenses by category with pie and bar charts. Get alerts when spending exceeds 80%.' },
  { icon: BarChart3,   color: '#f59e0b', bg: '#fef9c3', title: 'Gantt Timeline',           desc: 'Visualize project schedules with an interactive Gantt chart built from your task dates.' },
  { icon: Users,       color: '#8b5cf6', bg: '#ede9fe', title: 'Contractor Management',    desc: 'Manage contractors, contracts, specialties, and values all in one place per project.' },
  { icon: FileText,    color: '#ec4899', bg: '#fce7f3', title: 'Document Management',      desc: 'Upload blueprints, permits, invoices and contracts. Download them anytime.' },
  { icon: Bell,        color: '#ef4444', bg: '#fee2e2', title: 'Smart Notifications',      desc: 'Budget alerts, task deadlines, and project milestones delivered in real time.' },
  { icon: Zap,         color: '#06b6d4', bg: '#cffafe', title: 'AI Project Summaries',     desc: 'Auto-generated project health summaries with budget prediction and overrun alerts.' },
];

const stats = [
  { value: '10+',  label: 'Project Modules',    icon: Building2 },
  { value: '3',    label: 'Role Levels',         icon: Shield },
  { value: '100%', label: 'JWT Secured',         icon: Shield },
  { value: '∞',    label: 'Projects Supported',  icon: Globe },
];

const roles = [
  { role: 'Admin',    color: '#dc2626', bg: '#fee2e2',  desc: 'Full access to all projects, all users, all analytics. Manage the entire platform.' },
  { role: 'Manager',  color: '#2563eb', bg: '#dbeafe',  desc: 'Manage your assigned projects, tasks, budgets, contractors and site updates.' },
  { role: 'Engineer', color: '#16a34a', bg: '#dcfce7',  desc: 'View and update tasks assigned to you. Track progress and post site updates.' },
];

const steps = [
  { n: '01', title: 'Create Account',    desc: 'Register with your name, email and choose your role.' },
  { n: '02', title: 'Add Projects',      desc: 'Create projects with budget, timeline, client and location.' },
  { n: '03', title: 'Assign Tasks',      desc: 'Break projects into tasks, assign to engineers, set priorities.' },
  { n: '04', title: 'Track & Deliver',   desc: 'Monitor progress, budgets and milestones in real time.' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: '#0f172a', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', padding: '0 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <HardHat size={28} color="#6366f1" />
            <span style={{ fontSize: 20, fontWeight: 800, color: '#6366f1' }}>BuildTrack</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {isAuthenticated ? (
              <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: '#6366f1', color: 'white', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                Go to Dashboard <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '9px 20px', border: '1.5px solid #e2e8f0', color: '#0f172a', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none', background: 'white' }}>
                  Sign In
                </Link>
                <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: '#6366f1', color: 'white', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                  Get Started Free <ChevronRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', padding: '100px 5% 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* background blobs */}
        <div style={{ position: 'absolute', top: -100, left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: '10%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 99, padding: '6px 16px', fontSize: 13, color: '#a5b4fc', marginBottom: 24 }}>
            <Zap size={13} /> Construction Management, Reimagined
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20 }}>
            Manage Construction Projects<br />
            <span style={{ background: 'linear-gradient(90deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Like a Pro
            </span>
          </h1>
          <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            BuildTrack brings your entire construction workflow into one platform — projects, tasks, budgets, contractors, documents and analytics — all secured with role-based access.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: '#6366f1', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
                Open Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: '#6366f1', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
                  Start for Free <ArrowRight size={18} />
                </Link>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'rgba(255,255,255,0.08)', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* mock dashboard preview */}
        <div style={{ maxWidth: 900, margin: '60px auto 0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {['#ef4444','#f59e0b','#10b981'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
            {[['12','Total Projects','#6366f1'],['5','Active','#0ea5e9'],['3','Completed','#10b981'],['$4.2M','Budget','#f59e0b']].map(([v,l,c]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: 14, height: 80, display: 'flex', alignItems: 'center', gap: 8 }}>
              {[38,65,72,50,18,100,40,8].map((h,i) => (
                <div key={i} style={{ flex: 1, background: ['#6366f1','#0ea5e9','#6366f1','#10b981','#f59e0b','#10b981','#6366f1','#0ea5e9'][i], borderRadius: 4, height: `${h * 0.5}px`, opacity: 0.8 }} />
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: 14, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', border: '6px solid #6366f1', borderTopColor: '#10b981', borderRightColor: '#f59e0b' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#6366f1', padding: '48px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 14, opacity: 0.85 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '80px 5%', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-block', background: '#e0e7ff', color: '#6366f1', borderRadius: 99, padding: '4px 16px', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Features</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, marginBottom: 12 }}>Everything you need to build smarter</h2>
            <p style={{ color: '#64748b', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>From planning to handover — every module you need is built in.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {features.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24, transition: 'all 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = color; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={22} color={color} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px 5%', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-block', background: '#dcfce7', color: '#16a34a', borderRadius: 99, padding: '4px 16px', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>How It Works</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800 }}>Up and running in minutes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 24 }}>
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} style={{ position: 'relative', textAlign: 'center', padding: '32px 20px' }}>
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', top: 44, right: -12, width: 24, height: 2, background: '#e2e8f0', display: 'none' }} />
                )}
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, margin: '0 auto 16px' }}>{n}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section style={{ padding: '80px 5%', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', background: '#ede9fe', color: '#7c3aed', borderRadius: 99, padding: '4px 16px', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Role-Based Access</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800 }}>The right access for every team member</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {roles.map(({ role, color, bg, desc }) => (
              <div key={role} style={{ background: 'white', border: `2px solid ${bg}`, borderRadius: 16, padding: 28, textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: '6px 20px', borderRadius: 99, background: bg, color, fontWeight: 800, fontSize: 15, marginBottom: 16 }}>{role}</div>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 5%', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <HardHat size={48} color="#818cf8" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: 'white', marginBottom: 16 }}>
            Ready to build smarter?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Join BuildTrack today and take full control of your construction projects — from foundation to handover.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', background: '#6366f1', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 0 40px rgba(99,102,241,0.5)' }}>
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', background: '#6366f1', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 0 40px rgba(99,102,241,0.5)' }}>
                  Create Free Account <ArrowRight size={18} />
                </Link>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 36px', background: 'rgba(255,255,255,0.08)', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HardHat size={20} color="#6366f1" />
            <span style={{ fontWeight: 700, color: 'white', fontSize: 15 }}>BuildTrack</span>
            <span style={{ color: '#475569', fontSize: 13, marginLeft: 8 }}>© 2024 Construction Project Management</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['Sign In', '/login'], ['Register', '/register']].map(([label, to]) => (
              <Link key={to} to={to} style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = '#64748b'}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
