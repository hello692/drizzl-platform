import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  Calendar,
  Users,
  TrendingUp,
  Plus,
  UserPlus,
  Bell,
  CalendarDays,
  FileText,
  CheckCircle2,
  Circle,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  MoreHorizontal,
} from 'lucide-react';

const isDemoMode = true;

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface Task {
  id: string;
  title: string;
  assignee: string;
  assigneeInitials: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
}

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  tasksAssigned: number;
  capacity: number;
  avatarColor: string;
}

interface Activity {
  id: string;
  type: 'completed' | 'assigned' | 'commented' | 'created' | 'updated';
  user: string;
  userInitials: string;
  taskTitle: string;
  timestamp: string;
}

interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  dayLabel: string;
  priority: 'high' | 'medium' | 'low';
}

const overviewMetrics = [
  { id: 'total', label: 'Total Tasks', value: 47, icon: <CheckSquare size={20} />, color: NEON_GREEN },
  { id: 'progress', label: 'In Progress', value: 12, icon: <Clock size={20} />, color: '#3B82F6' },
  { id: 'today', label: 'Due Today', value: 5, icon: <Calendar size={20} />, color: '#F59E0B' },
  { id: 'overdue', label: 'Overdue', value: 2, icon: <AlertTriangle size={20} />, color: '#EF4444' },
  { id: 'completed', label: 'Completed This Week', value: 23, icon: <TrendingUp size={20} />, color: '#10B981' },
];

const allTasks: Task[] = [
  { id: 't1', title: 'Review Q4 inventory report', assignee: 'Sarah Chen', assigneeInitials: 'SC', priority: 'high', dueDate: 'Dec 10', status: 'todo' },
  { id: 't2', title: 'Update supplier contracts', assignee: 'Mike Johnson', assigneeInitials: 'MJ', priority: 'high', dueDate: 'Dec 11', status: 'todo' },
  { id: 't3', title: 'Prepare monthly production schedule', assignee: 'Emily Davis', assigneeInitials: 'ED', priority: 'medium', dueDate: 'Dec 12', status: 'todo' },
  { id: 't4', title: 'QC audit for Batch #2847', assignee: 'James Wilson', assigneeInitials: 'JW', priority: 'high', dueDate: 'Dec 10', status: 'todo' },
  { id: 't5', title: 'Update product photos', assignee: 'Lisa Brown', assigneeInitials: 'LB', priority: 'low', dueDate: 'Dec 15', status: 'todo' },
  { id: 't6', title: 'Review new packaging designs', assignee: 'Sarah Chen', assigneeInitials: 'SC', priority: 'medium', dueDate: 'Dec 13', status: 'todo' },
  { id: 't7', title: 'Coordinate with logistics team', assignee: 'Mike Johnson', assigneeInitials: 'MJ', priority: 'low', dueDate: 'Dec 14', status: 'todo' },
  { id: 't8', title: 'Update safety compliance docs', assignee: 'Emily Davis', assigneeInitials: 'ED', priority: 'medium', dueDate: 'Dec 16', status: 'todo' },
  { id: 't9', title: 'Negotiate vendor pricing', assignee: 'Sarah Chen', assigneeInitials: 'SC', priority: 'high', dueDate: 'Dec 10', status: 'in_progress' },
  { id: 't10', title: 'Complete B2B order processing', assignee: 'Mike Johnson', assigneeInitials: 'MJ', priority: 'high', dueDate: 'Dec 11', status: 'in_progress' },
  { id: 't11', title: 'Analyze sales trends Q4', assignee: 'Emily Davis', assigneeInitials: 'ED', priority: 'medium', dueDate: 'Dec 12', status: 'in_progress' },
  { id: 't12', title: 'Coordinate factory inspection', assignee: 'James Wilson', assigneeInitials: 'JW', priority: 'high', dueDate: 'Dec 10', status: 'in_progress' },
  { id: 't13', title: 'Update CRM records', assignee: 'Lisa Brown', assigneeInitials: 'LB', priority: 'low', dueDate: 'Dec 14', status: 'in_progress' },
  { id: 't14', title: 'Process wholesale inquiries', assignee: 'Sarah Chen', assigneeInitials: 'SC', priority: 'medium', dueDate: 'Dec 11', status: 'in_progress' },
  { id: 't15', title: 'Review shipping delays', assignee: 'Mike Johnson', assigneeInitials: 'MJ', priority: 'high', dueDate: 'Dec 10', status: 'in_progress' },
  { id: 't16', title: 'Prepare investor update', assignee: 'Emily Davis', assigneeInitials: 'ED', priority: 'medium', dueDate: 'Dec 13', status: 'in_progress' },
  { id: 't17', title: 'Audit ingredient suppliers', assignee: 'James Wilson', assigneeInitials: 'JW', priority: 'medium', dueDate: 'Dec 12', status: 'in_progress' },
  { id: 't18', title: 'Update employee handbook', assignee: 'Lisa Brown', assigneeInitials: 'LB', priority: 'low', dueDate: 'Dec 18', status: 'in_progress' },
  { id: 't19', title: 'Schedule team training', assignee: 'Sarah Chen', assigneeInitials: 'SC', priority: 'medium', dueDate: 'Dec 15', status: 'in_progress' },
  { id: 't20', title: 'Review insurance policies', assignee: 'Mike Johnson', assigneeInitials: 'MJ', priority: 'low', dueDate: 'Dec 17', status: 'in_progress' },
  { id: 't21', title: 'Finalize Q4 budget report', assignee: 'Emily Davis', assigneeInitials: 'ED', priority: 'high', dueDate: 'Dec 11', status: 'review' },
  { id: 't22', title: 'Marketing campaign approval', assignee: 'Lisa Brown', assigneeInitials: 'LB', priority: 'medium', dueDate: 'Dec 12', status: 'review' },
  { id: 't23', title: 'New hire onboarding docs', assignee: 'Sarah Chen', assigneeInitials: 'SC', priority: 'medium', dueDate: 'Dec 13', status: 'review' },
  { id: 't24', title: 'Product label compliance check', assignee: 'James Wilson', assigneeInitials: 'JW', priority: 'high', dueDate: 'Dec 10', status: 'review' },
  { id: 't25', title: 'Complete inventory recount', assignee: 'Mike Johnson', assigneeInitials: 'MJ', priority: 'high', dueDate: 'Dec 8', status: 'done' },
  { id: 't26', title: 'Ship Whole Foods order', assignee: 'Sarah Chen', assigneeInitials: 'SC', priority: 'high', dueDate: 'Dec 7', status: 'done' },
  { id: 't27', title: 'Update pricing spreadsheet', assignee: 'Emily Davis', assigneeInitials: 'ED', priority: 'medium', dueDate: 'Dec 6', status: 'done' },
  { id: 't28', title: 'Review quality metrics', assignee: 'James Wilson', assigneeInitials: 'JW', priority: 'medium', dueDate: 'Dec 5', status: 'done' },
  { id: 't29', title: 'Process returns batch', assignee: 'Lisa Brown', assigneeInitials: 'LB', priority: 'low', dueDate: 'Dec 5', status: 'done' },
  { id: 't30', title: 'Approve vendor invoices', assignee: 'Mike Johnson', assigneeInitials: 'MJ', priority: 'medium', dueDate: 'Dec 4', status: 'done' },
  { id: 't31', title: 'Update social media calendar', assignee: 'Sarah Chen', assigneeInitials: 'SC', priority: 'low', dueDate: 'Dec 4', status: 'done' },
  { id: 't32', title: 'Complete staff evaluations', assignee: 'Emily Davis', assigneeInitials: 'ED', priority: 'medium', dueDate: 'Dec 3', status: 'done' },
  { id: 't33', title: 'Finalize holiday schedule', assignee: 'Lisa Brown', assigneeInitials: 'LB', priority: 'medium', dueDate: 'Dec 3', status: 'done' },
  { id: 't34', title: 'Order packaging materials', assignee: 'James Wilson', assigneeInitials: 'JW', priority: 'high', dueDate: 'Dec 2', status: 'done' },
  { id: 't35', title: 'Update website product info', assignee: 'Sarah Chen', assigneeInitials: 'SC', priority: 'low', dueDate: 'Dec 2', status: 'done' },
  { id: 't36', title: 'Process payroll adjustments', assignee: 'Emily Davis', assigneeInitials: 'ED', priority: 'high', dueDate: 'Dec 1', status: 'done' },
  { id: 't37', title: 'Coordinate team meeting', assignee: 'Mike Johnson', assigneeInitials: 'MJ', priority: 'low', dueDate: 'Dec 1', status: 'done' },
  { id: 't38', title: 'Review customer feedback', assignee: 'Lisa Brown', assigneeInitials: 'LB', priority: 'medium', dueDate: 'Nov 30', status: 'done' },
  { id: 't39', title: 'Complete compliance training', assignee: 'James Wilson', assigneeInitials: 'JW', priority: 'high', dueDate: 'Nov 29', status: 'done' },
];

const teamMembers: TeamMember[] = [
  { id: 'tm1', name: 'Sarah Chen', initials: 'SC', tasksAssigned: 9, capacity: 12, avatarColor: '#8B5CF6' },
  { id: 'tm2', name: 'Mike Johnson', initials: 'MJ', tasksAssigned: 8, capacity: 10, avatarColor: '#3B82F6' },
  { id: 'tm3', name: 'Emily Davis', initials: 'ED', tasksAssigned: 7, capacity: 10, avatarColor: '#EC4899' },
  { id: 'tm4', name: 'James Wilson', initials: 'JW', tasksAssigned: 6, capacity: 8, avatarColor: '#F59E0B' },
  { id: 'tm5', name: 'Lisa Brown', initials: 'LB', tasksAssigned: 5, capacity: 8, avatarColor: '#10B981' },
  { id: 'tm6', name: 'David Kim', initials: 'DK', tasksAssigned: 4, capacity: 8, avatarColor: '#6366F1' },
];

const recentActivity: Activity[] = [
  { id: 'a1', type: 'completed', user: 'Sarah Chen', userInitials: 'SC', taskTitle: 'Ship Whole Foods order', timestamp: '2 hours ago' },
  { id: 'a2', type: 'assigned', user: 'Mike Johnson', userInitials: 'MJ', taskTitle: 'Review shipping delays', timestamp: '3 hours ago' },
  { id: 'a3', type: 'commented', user: 'Emily Davis', userInitials: 'ED', taskTitle: 'Finalize Q4 budget report', timestamp: '4 hours ago' },
  { id: 'a4', type: 'created', user: 'James Wilson', userInitials: 'JW', taskTitle: 'QC audit for Batch #2847', timestamp: '5 hours ago' },
  { id: 'a5', type: 'completed', user: 'Lisa Brown', userInitials: 'LB', taskTitle: 'Process returns batch', timestamp: '6 hours ago' },
  { id: 'a6', type: 'updated', user: 'Sarah Chen', userInitials: 'SC', taskTitle: 'Negotiate vendor pricing', timestamp: '7 hours ago' },
  { id: 'a7', type: 'assigned', user: 'Emily Davis', userInitials: 'ED', taskTitle: 'Prepare investor update', timestamp: '8 hours ago' },
  { id: 'a8', type: 'completed', user: 'Mike Johnson', userInitials: 'MJ', taskTitle: 'Complete inventory recount', timestamp: '1 day ago' },
  { id: 'a9', type: 'commented', user: 'James Wilson', userInitials: 'JW', taskTitle: 'Product label compliance check', timestamp: '1 day ago' },
  { id: 'a10', type: 'created', user: 'Lisa Brown', userInitials: 'LB', taskTitle: 'Update employee handbook', timestamp: '1 day ago' },
];

const upcomingDeadlines: Deadline[] = [
  { id: 'd1', title: 'Review Q4 inventory report', dueDate: 'Dec 10, 2025', dayLabel: 'Today', priority: 'high' },
  { id: 'd2', title: 'QC audit for Batch #2847', dueDate: 'Dec 10, 2025', dayLabel: 'Today', priority: 'high' },
  { id: 'd3', title: 'Negotiate vendor pricing', dueDate: 'Dec 10, 2025', dayLabel: 'Today', priority: 'high' },
  { id: 'd4', title: 'Product label compliance check', dueDate: 'Dec 10, 2025', dayLabel: 'Today', priority: 'high' },
  { id: 'd5', title: 'Review shipping delays', dueDate: 'Dec 10, 2025', dayLabel: 'Today', priority: 'high' },
  { id: 'd6', title: 'Update supplier contracts', dueDate: 'Dec 11, 2025', dayLabel: 'Tomorrow', priority: 'high' },
  { id: 'd7', title: 'Complete B2B order processing', dueDate: 'Dec 11, 2025', dayLabel: 'Tomorrow', priority: 'high' },
  { id: 'd8', title: 'Finalize Q4 budget report', dueDate: 'Dec 11, 2025', dayLabel: 'Tomorrow', priority: 'high' },
  { id: 'd9', title: 'Prepare monthly production schedule', dueDate: 'Dec 12, 2025', dayLabel: 'Dec 12', priority: 'medium' },
  { id: 'd10', title: 'Analyze sales trends Q4', dueDate: 'Dec 12, 2025', dayLabel: 'Dec 12', priority: 'medium' },
  { id: 'd11', title: 'Marketing campaign approval', dueDate: 'Dec 12, 2025', dayLabel: 'Dec 12', priority: 'medium' },
  { id: 'd12', title: 'Review new packaging designs', dueDate: 'Dec 13, 2025', dayLabel: 'Dec 13', priority: 'medium' },
  { id: 'd13', title: 'Prepare investor update', dueDate: 'Dec 13, 2025', dayLabel: 'Dec 13', priority: 'medium' },
  { id: 'd14', title: 'Coordinate with logistics team', dueDate: 'Dec 14, 2025', dayLabel: 'Dec 14', priority: 'low' },
  { id: 'd15', title: 'Update CRM records', dueDate: 'Dec 14, 2025', dayLabel: 'Dec 14', priority: 'low' },
  { id: 'd16', title: 'Update product photos', dueDate: 'Dec 15, 2025', dayLabel: 'Dec 15', priority: 'low' },
  { id: 'd17', title: 'Schedule team training', dueDate: 'Dec 15, 2025', dayLabel: 'Dec 15', priority: 'medium' },
];

const myTasks = allTasks.filter(t => t.assignee === 'Sarah Chen' && t.status !== 'done').slice(0, 6);

const quickActions = [
  { label: 'Create Task', icon: <Plus size={16} />, primary: true },
  { label: 'Assign to Team', icon: <UserPlus size={16} /> },
  { label: 'Set Reminder', icon: <Bell size={16} /> },
  { label: 'View Calendar', icon: <CalendarDays size={16} /> },
  { label: 'Generate Report', icon: <FileText size={16} /> },
];

function getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high': return '#EF4444';
    case 'medium': return '#F59E0B';
    case 'low': return '#10B981';
  }
}

function getPriorityLabel(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
  }
}

function getActivityIcon(type: Activity['type']) {
  switch (type) {
    case 'completed': return <CheckCircle2 size={14} color="#10B981" />;
    case 'assigned': return <UserPlus size={14} color="#3B82F6" />;
    case 'commented': return <MessageSquare size={14} color="#8B5CF6" />;
    case 'created': return <Plus size={14} color={NEON_GREEN} />;
    case 'updated': return <ArrowRight size={14} color="#F59E0B" />;
  }
}

function getActivityText(type: Activity['type']): string {
  switch (type) {
    case 'completed': return 'completed';
    case 'assigned': return 'was assigned to';
    case 'commented': return 'commented on';
    case 'created': return 'created';
    case 'updated': return 'updated';
  }
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div style={styles.taskCard}>
      <div style={styles.taskCardHeader}>
        <span style={styles.taskTitle}>{task.title}</span>
        <button style={styles.taskMenuBtn}>
          <MoreHorizontal size={14} />
        </button>
      </div>
      <div style={styles.taskCardFooter}>
        <div style={styles.taskAssignee}>
          <span style={{ ...styles.avatar, background: '#8B5CF6' }}>{task.assigneeInitials}</span>
        </div>
        <span style={{ ...styles.priorityBadge, background: `${getPriorityColor(task.priority)}20`, color: getPriorityColor(task.priority) }}>
          {getPriorityLabel(task.priority)}
        </span>
        <span style={styles.taskDueDate}>
          <Calendar size={12} />
          {task.dueDate}
        </span>
      </div>
    </div>
  );
}

function KanbanColumn({ title, tasks, count }: { title: string; tasks: Task[]; count: number }) {
  return (
    <div style={styles.kanbanColumn}>
      <div style={styles.kanbanHeader}>
        <span style={styles.kanbanTitle}>{title}</span>
        <span style={styles.kanbanCount}>{count}</span>
      </div>
      <div style={styles.kanbanTasks}>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const todoTasks = allTasks.filter(t => t.status === 'todo').slice(0, 8);
  const inProgressTasks = allTasks.filter(t => t.status === 'in_progress').slice(0, 12);
  const reviewTasks = allTasks.filter(t => t.status === 'review').slice(0, 4);
  const doneTasks = allTasks.filter(t => t.status === 'done').slice(0, 15);

  const groupedDeadlines = upcomingDeadlines.reduce((acc, deadline) => {
    if (!acc[deadline.dayLabel]) {
      acc[deadline.dayLabel] = [];
    }
    acc[deadline.dayLabel].push(deadline);
    return acc;
  }, {} as Record<string, Deadline[]>);

  return (
    <AdminLayout title="Task Manager" subtitle="Operations Workflow & Task Management">
      {isDemoMode && (
        <div style={styles.demoTag}>
          <AlertCircle size={14} />
          <span>Demo Mode - Sample task data displayed</span>
        </div>
      )}

      <div style={styles.quickActionsBar}>
        {quickActions.map((action, index) => (
          <button
            key={index}
            style={{
              ...styles.quickActionBtn,
              ...(action.primary ? styles.quickActionBtnPrimary : {}),
            }}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <CheckSquare size={18} color={NEON_GREEN} />
          Task Overview
        </h2>
        <div style={styles.metricsGrid}>
          {overviewMetrics.map(metric => (
            <div key={metric.id} style={styles.metricCard}>
              <div style={{ ...styles.metricIcon, color: metric.color }}>{metric.icon}</div>
              <div style={styles.metricContent}>
                <span style={styles.metricValue}>{metric.value}</span>
                <span style={styles.metricLabel}>{metric.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <CheckSquare size={18} color={NEON_GREEN} />
          Kanban Board
        </h2>
        <div style={styles.kanbanBoard}>
          <KanbanColumn title="To Do" tasks={todoTasks} count={8} />
          <KanbanColumn title="In Progress" tasks={inProgressTasks} count={12} />
          <KanbanColumn title="Review" tasks={reviewTasks} count={4} />
          <KanbanColumn title="Done" tasks={doneTasks} count={15} />
        </div>
      </section>

      <div style={styles.twoColumnGrid}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Circle size={18} color={NEON_GREEN} />
            My Tasks
          </h2>
          <div style={styles.myTasksList}>
            {myTasks.map(task => (
              <div key={task.id} style={styles.myTaskItem}>
                <button
                  onClick={() => toggleTask(task.id)}
                  style={{
                    ...styles.checkbox,
                    ...(completedTasks.has(task.id) ? styles.checkboxChecked : {}),
                  }}
                >
                  {completedTasks.has(task.id) && <CheckCircle2 size={16} />}
                </button>
                <div style={styles.myTaskContent}>
                  <span style={{
                    ...styles.myTaskTitle,
                    ...(completedTasks.has(task.id) ? styles.myTaskTitleCompleted : {}),
                  }}>
                    {task.title}
                  </span>
                  <div style={styles.myTaskMeta}>
                    <span style={{ ...styles.priorityBadgeSmall, background: `${getPriorityColor(task.priority)}20`, color: getPriorityColor(task.priority) }}>
                      {getPriorityLabel(task.priority)}
                    </span>
                    <span style={styles.myTaskDue}>
                      <Calendar size={10} />
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Users size={18} color={NEON_GREEN} />
            Team Workload
          </h2>
          <div style={styles.teamList}>
            {teamMembers.map(member => (
              <div key={member.id} style={styles.teamMember}>
                <div style={{ ...styles.teamAvatar, background: member.avatarColor }}>
                  {member.initials}
                </div>
                <div style={styles.teamInfo}>
                  <div style={styles.teamNameRow}>
                    <span style={styles.teamName}>{member.name}</span>
                    <span style={styles.teamTaskCount}>{member.tasksAssigned} tasks</span>
                  </div>
                  <div style={styles.capacityBar}>
                    <div
                      style={{
                        ...styles.capacityFill,
                        width: `${(member.tasksAssigned / member.capacity) * 100}%`,
                        background: member.tasksAssigned >= member.capacity ? '#EF4444' : NEON_GREEN,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div style={styles.twoColumnGrid}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Clock size={18} color={NEON_GREEN} />
            Recent Activity
          </h2>
          <div style={styles.activityList}>
            {recentActivity.map(activity => (
              <div key={activity.id} style={styles.activityItem}>
                <div style={styles.activityIcon}>
                  {getActivityIcon(activity.type)}
                </div>
                <div style={styles.activityContent}>
                  <span style={styles.activityText}>
                    <strong>{activity.user}</strong> {getActivityText(activity.type)} <span style={styles.activityTask}>"{activity.taskTitle}"</span>
                  </span>
                  <span style={styles.activityTime}>{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Calendar size={18} color={NEON_GREEN} />
            Upcoming Deadlines
          </h2>
          <div style={styles.deadlinesList}>
            {Object.entries(groupedDeadlines).slice(0, 5).map(([dayLabel, deadlines]) => (
              <div key={dayLabel} style={styles.deadlineGroup}>
                <div style={styles.deadlineDayLabel}>{dayLabel}</div>
                {deadlines.slice(0, 3).map(deadline => (
                  <div key={deadline.id} style={styles.deadlineItem}>
                    <div style={{ ...styles.priorityDot, background: getPriorityColor(deadline.priority) }} />
                    <span style={styles.deadlineTitle}>{deadline.title}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  demoTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderRadius: 8,
    color: '#F59E0B',
    fontSize: 13,
    marginBottom: 24,
  },
  quickActionsBar: {
    display: 'flex',
    gap: 12,
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 10,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  quickActionBtnPrimary: {
    background: `linear-gradient(135deg, ${NEON_GREEN}20, ${NEON_GREEN}10)`,
    borderColor: `${NEON_GREEN}40`,
    color: NEON_GREEN,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 16,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
  },
  metricCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  metricIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.05)',
  },
  metricContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
  },
  metricLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  kanbanBoard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  kanbanColumn: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 16,
    minHeight: 400,
  },
  kanbanHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  kanbanTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  },
  kanbanCount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 6,
    background: 'rgba(255,255,255,0.1)',
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
  },
  kanbanTasks: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    maxHeight: 500,
    overflowY: 'auto',
  },
  taskCard: {
    padding: 12,
    background: 'rgba(255,255,255,0.02)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 10,
  },
  taskCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#fff',
    lineHeight: 1.4,
    flex: 1,
  },
  taskMenuBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    background: 'transparent',
    border: 'none',
    borderRadius: 4,
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
  },
  taskCardFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  taskAssignee: {
    display: 'flex',
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: '50%',
    fontSize: 10,
    fontWeight: 600,
    color: '#fff',
  },
  priorityBadge: {
    padding: '3px 8px',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  taskDueDate: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 'auto',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24,
    marginBottom: 24,
  },
  card: {
    padding: 20,
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  myTasksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  myTaskItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 6,
    border: `2px solid rgba(255,255,255,0.2)`,
    background: 'transparent',
    cursor: 'pointer',
    color: '#fff',
    flexShrink: 0,
    marginTop: 2,
  },
  checkboxChecked: {
    background: NEON_GREEN,
    borderColor: NEON_GREEN,
  },
  myTaskContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  myTaskTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#fff',
  },
  myTaskTitleCompleted: {
    textDecoration: 'line-through',
    color: 'rgba(255,255,255,0.4)',
  },
  myTaskMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  priorityBadgeSmall: {
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  myTaskDue: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  teamList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  teamMember: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
  },
  teamAvatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: '50%',
    fontSize: 12,
    fontWeight: 600,
    color: '#fff',
    flexShrink: 0,
  },
  teamInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  teamNameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#fff',
  },
  teamTaskCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  capacityBar: {
    height: 4,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.3s ease',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    maxHeight: 400,
    overflowY: 'auto',
  },
  activityItem: {
    display: 'flex',
    gap: 10,
    padding: 10,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 8,
  },
  activityIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 6,
    background: 'rgba(255,255,255,0.05)',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  activityText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.4,
  },
  activityTask: {
    color: '#fff',
  },
  activityTime: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  deadlinesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxHeight: 400,
    overflowY: 'auto',
  },
  deadlineGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  deadlineDayLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: NEON_GREEN,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  deadlineItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 8,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  deadlineTitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
};
