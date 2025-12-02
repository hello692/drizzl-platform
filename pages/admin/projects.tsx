import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useRequireAdmin } from '../../hooks/useRole';

type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
type Department = 'marketing' | 'factory' | 'finance' | 'tech' | 'sales' | 'operations';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  department: Department;
  assignee: string;
  dueDate: string;
  comments: Comment[];
  createdAt: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

const statusLabels: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  in_progress: 'In Progress',
  review: 'Review',
  completed: 'Completed',
};

const statusColors: Record<TaskStatus, string> = {
  backlog: '#6b7280',
  in_progress: '#3b82f6',
  review: '#f59e0b',
  completed: '#22c55e',
};

const priorityColors: Record<TaskPriority, string> = {
  low: '#6b7280',
  medium: '#3b82f6',
  high: '#f59e0b',
  urgent: '#ef4444',
};

const departmentColors: Record<Department, string> = {
  marketing: '#ec4899',
  factory: '#f97316',
  finance: '#22c55e',
  tech: '#8b5cf6',
  sales: '#06b6d4',
  operations: '#6366f1',
};

const demoTasks: Task[] = [
  { id: '1', title: 'Launch Summer Campaign', description: 'Create and launch summer smoothie promotional campaign across all channels', status: 'in_progress', priority: 'high', department: 'marketing', assignee: 'Sarah M.', dueDate: '2024-12-15', comments: [], createdAt: '2024-12-01' },
  { id: '2', title: 'New SKU Development', description: 'Develop formula for new protein smoothie variant', status: 'review', priority: 'high', department: 'factory', assignee: 'Mike R.', dueDate: '2024-12-10', comments: [], createdAt: '2024-11-28' },
  { id: '3', title: 'Q4 Financial Report', description: 'Prepare quarterly financial statements and analysis', status: 'backlog', priority: 'medium', department: 'finance', assignee: 'John D.', dueDate: '2024-12-20', comments: [], createdAt: '2024-12-02' },
  { id: '4', title: 'Inventory System Upgrade', description: 'Implement new barcode scanning system in warehouse', status: 'in_progress', priority: 'medium', department: 'tech', assignee: 'Alex K.', dueDate: '2024-12-18', comments: [], createdAt: '2024-11-25' },
  { id: '5', title: 'Retail Partner Onboarding', description: 'Complete onboarding for 5 new retail partners in NYC', status: 'in_progress', priority: 'high', department: 'sales', assignee: 'Lisa P.', dueDate: '2024-12-12', comments: [], createdAt: '2024-12-01' },
  { id: '6', title: 'Production Line Maintenance', description: 'Scheduled maintenance for bottling line A', status: 'backlog', priority: 'low', department: 'operations', assignee: 'Tom B.', dueDate: '2024-12-22', comments: [], createdAt: '2024-12-03' },
  { id: '7', title: 'Social Media Content Calendar', description: 'Plan and schedule content for December', status: 'completed', priority: 'medium', department: 'marketing', assignee: 'Emma W.', dueDate: '2024-12-05', comments: [], createdAt: '2024-11-20' },
  { id: '8', title: 'Supplier Contract Review', description: 'Review and negotiate terms with fruit suppliers', status: 'review', priority: 'high', department: 'finance', assignee: 'John D.', dueDate: '2024-12-08', comments: [], createdAt: '2024-11-30' },
];

const teamMembers = ['Sarah M.', 'Mike R.', 'John D.', 'Alex K.', 'Lisa P.', 'Tom B.', 'Emma W.', 'Chris L.'];

export default function ProjectManagement() {
  const { loading, authorized } = useRequireAdmin();
  const [tasks, setTasks] = useState<Task[]>(demoTasks);
  const [filterDepartment, setFilterDepartment] = useState<Department | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    if (filterDepartment === 'all') return tasks;
    return tasks.filter(t => t.department === filterDepartment);
  }, [tasks, filterDepartment]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      backlog: [],
      in_progress: [],
      review: [],
      completed: [],
    };
    filteredTasks.forEach(task => {
      grouped[task.status].push(task);
    });
    return grouped;
  }, [filteredTasks]);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggedTask) {
      setTasks(prev => prev.map(t => 
        t.id === draggedTask ? { ...t, status } : t
      ));
      setDraggedTask(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Projects" subtitle="Project Management">
        <div style={styles.loadingContainer}>
          <div style={styles.loadingOrb} />
          <p style={styles.loadingText}>Loading projects...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!authorized) {
    return (
      <AdminLayout title="Projects" subtitle="Project Management">
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Authenticating...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Project Management" subtitle="Kanban Board">
      <div style={styles.toolbar}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Department:</span>
          <div style={styles.filterButtons}>
            <button
              style={{ ...styles.filterBtn, ...(filterDepartment === 'all' ? styles.filterBtnActive : {}) }}
              onClick={() => setFilterDepartment('all')}
            >
              All
            </button>
            {(Object.keys(departmentColors) as Department[]).map(dept => (
              <button
                key={dept}
                style={{
                  ...styles.filterBtn,
                  ...(filterDepartment === dept ? styles.filterBtnActive : {}),
                  borderColor: filterDepartment === dept ? departmentColors[dept] : 'transparent',
                }}
                onClick={() => setFilterDepartment(dept)}
              >
                <span style={{ ...styles.deptDot, background: departmentColors[dept] }} />
                {dept.charAt(0).toUpperCase() + dept.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button style={styles.addButton} onClick={() => { setSelectedTask(null); setShowModal(true); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Task
        </button>
      </div>

      <div style={styles.kanbanBoard}>
        {(Object.keys(statusLabels) as TaskStatus[]).map(status => (
          <div
            key={status}
            style={styles.column}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(status)}
          >
            <div style={styles.columnHeader}>
              <span style={{ ...styles.statusDot, background: statusColors[status] }} />
              <span style={styles.columnTitle}>{statusLabels[status]}</span>
              <span style={styles.columnCount}>{tasksByStatus[status].length}</span>
            </div>
            <div style={styles.columnContent}>
              {tasksByStatus[status].map(task => (
                <div
                  key={task.id}
                  style={{
                    ...styles.taskCard,
                    opacity: draggedTask === task.id ? 0.5 : 1,
                  }}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onClick={() => { setSelectedTask(task); setShowModal(true); }}
                >
                  <div style={styles.taskHeader}>
                    <span style={{ ...styles.priorityBadge, background: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority] }}>
                      {task.priority}
                    </span>
                    <span style={{ ...styles.deptBadge, background: `${departmentColors[task.department]}20`, color: departmentColors[task.department] }}>
                      {task.department}
                    </span>
                  </div>
                  <h4 style={styles.taskTitle}>{task.title}</h4>
                  <p style={styles.taskDesc}>{task.description}</p>
                  <div style={styles.taskFooter}>
                    <div style={styles.assignee}>
                      <div style={styles.avatar}>{task.assignee.split(' ').map(n => n[0]).join('')}</div>
                      <span style={styles.assigneeName}>{task.assignee}</span>
                    </div>
                    <span style={styles.dueDate}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{selectedTask ? 'Edit Task' : 'New Task'}</h3>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input type="text" style={styles.input} placeholder="Task title..." defaultValue={selectedTask?.title || ''} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea style={styles.textarea} placeholder="Task description..." defaultValue={selectedTask?.description || ''} />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Status</label>
                  <select style={styles.select} defaultValue={selectedTask?.status || 'backlog'}>
                    {(Object.keys(statusLabels) as TaskStatus[]).map(s => (
                      <option key={s} value={s}>{statusLabels[s]}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Priority</label>
                  <select style={styles.select} defaultValue={selectedTask?.priority || 'medium'}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Department</label>
                  <select style={styles.select} defaultValue={selectedTask?.department || 'operations'}>
                    {(Object.keys(departmentColors) as Department[]).map(d => (
                      <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Assignee</label>
                  <select style={styles.select} defaultValue={selectedTask?.assignee || teamMembers[0]}>
                    {teamMembers.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Due Date</label>
                <input type="date" style={styles.input} defaultValue={selectedTask?.dueDate || ''} />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={() => setShowModal(false)}>
                {selectedTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); } 50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); } }
      `}</style>
    </AdminLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '20px' },
  loadingOrb: { width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', animation: 'pulse 2s infinite, glow 2s infinite' },
  loadingText: { color: 'rgba(255,255,255,0.5)', fontSize: '14px' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  filterLabel: { color: 'rgba(255,255,255,0.5)', fontSize: '13px' },
  filterButtons: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  filterBtn: { padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.7)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' },
  filterBtnActive: { background: 'rgba(102, 126, 234, 0.15)', borderColor: 'rgba(102, 126, 234, 0.3)', color: '#fff' },
  deptDot: { width: '8px', height: '8px', borderRadius: '50%' },
  addButton: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
  kanbanBoard: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', minHeight: '600px' },
  column: { background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' },
  columnHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  statusDot: { width: '10px', height: '10px', borderRadius: '50%' },
  columnTitle: { fontSize: '14px', fontWeight: '600', color: '#fff' },
  columnCount: { marginLeft: 'auto', fontSize: '12px', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px' },
  columnContent: { display: 'flex', flexDirection: 'column', gap: '12px' },
  taskCard: { background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.2s' },
  taskHeader: { display: 'flex', gap: '8px', marginBottom: '10px' },
  priorityBadge: { fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' },
  deptBadge: { fontSize: '10px', fontWeight: '500', padding: '2px 8px', borderRadius: '4px' },
  taskTitle: { fontSize: '14px', fontWeight: '600', color: '#fff', margin: '0 0 8px 0' },
  taskDesc: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '0 0 12px 0', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  taskFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  assignee: { display: 'flex', alignItems: 'center', gap: '8px' },
  avatar: { width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '600' },
  assigneeName: { fontSize: '12px', color: 'rgba(255,255,255,0.6)' },
  dueDate: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { width: '100%', maxWidth: '560px', background: 'rgba(20,20,20,0.95)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  modalTitle: { fontSize: '18px', fontWeight: '600', margin: 0 },
  closeBtn: { background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px' },
  modalBody: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  formRow: { display: 'flex', gap: '16px' },
  label: { fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.6)' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' },
  textarea: { padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', minHeight: '80px', resize: 'vertical', outline: 'none' },
  select: { padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  cancelBtn: { padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: '13px', cursor: 'pointer' },
  saveBtn: { padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
};
