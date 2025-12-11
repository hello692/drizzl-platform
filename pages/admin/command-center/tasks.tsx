import React from 'react';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
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
  Briefcase,
  Megaphone,
  Factory,
  DollarSign,
  UserCog,
  MoreHorizontal,
} from 'lucide-react';

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
  tasksCompleted: number;
  capacity: number;
  avatarColor: string;
}

interface Activity {
  id: string;
  type: 'completed' | 'assigned' | 'created';
  user: string;
  userInitials: string;
  taskTitle: string;
  timestamp: string;
}

interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
}

interface Category {
  id: string;
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const overviewMetrics = [
  { id: 'total', label: 'Total Tasks', value: 47, icon: <CheckSquare size={20} />, color: NEON_GREEN },
  { id: 'progress', label: 'In Progress', value: 12, icon: <Clock size={20} />, color: '#3B82F6' },
  { id: 'today', label: 'Due Today', value: 5, icon: <Calendar size={20} />, color: '#F59E0B' },
  { id: 'overdue', label: 'Overdue', value: 2, icon: <AlertTriangle size={20} />, color: '#EF4444' },
  { id: 'completed', label: 'Completed This Week', value: 23, icon: <TrendingUp size={20} />, color: '#10B981' },
];

const allTasks: Task[] = [
  { id: 't1', title: 'Review Q4 inventory report', assignee: 'Sarah C', assigneeInitials: 'SC', priority: 'high', dueDate: 'Dec 10', status: 'todo' },
  { id: 't2', title: 'Update supplier contracts', assignee: 'Mike R', assigneeInitials: 'MR', priority: 'medium', dueDate: 'Dec 11', status: 'todo' },
  { id: 't3', title: 'Prepare board presentation', assignee: 'Emma T', assigneeInitials: 'ET', priority: 'high', dueDate: 'Dec 12', status: 'todo' },
  { id: 't4', title: 'QC audit for Batch #2847', assignee: 'James W', assigneeInitials: 'JW', priority: 'high', dueDate: 'Dec 10', status: 'todo' },
  { id: 't5', title: 'Update product photos', assignee: 'Lisa B', assigneeInitials: 'LB', priority: 'low', dueDate: 'Dec 15', status: 'todo' },
  { id: 't6', title: 'Review new packaging designs', assignee: 'Sarah C', assigneeInitials: 'SC', priority: 'medium', dueDate: 'Dec 13', status: 'todo' },
  { id: 't7', title: 'Coordinate with logistics team', assignee: 'Mike R', assigneeInitials: 'MR', priority: 'low', dueDate: 'Dec 14', status: 'todo' },
  { id: 't8', title: 'Update safety compliance docs', assignee: 'Emma T', assigneeInitials: 'ET', priority: 'medium', dueDate: 'Dec 16', status: 'todo' },
  { id: 't9', title: 'Negotiate vendor pricing', assignee: 'Sarah C', assigneeInitials: 'SC', priority: 'high', dueDate: 'Dec 10', status: 'in_progress' },
  { id: 't10', title: 'Design new product labels', assignee: 'Design Team', assigneeInitials: 'DT', priority: 'medium', dueDate: 'Dec 11', status: 'in_progress' },
  { id: 't11', title: 'Analyze sales trends Q4', assignee: 'Emma T', assigneeInitials: 'ET', priority: 'medium', dueDate: 'Dec 12', status: 'in_progress' },
  { id: 't12', title: 'Coordinate factory inspection', assignee: 'James W', assigneeInitials: 'JW', priority: 'high', dueDate: 'Dec 10', status: 'in_progress' },
  { id: 't13', title: 'Update CRM records', assignee: 'Lisa B', assigneeInitials: 'LB', priority: 'low', dueDate: 'Dec 14', status: 'in_progress' },
  { id: 't14', title: 'Process wholesale inquiries', assignee: 'Sarah C', assigneeInitials: 'SC', priority: 'medium', dueDate: 'Dec 11', status: 'in_progress' },
  { id: 't15', title: 'Review shipping delays', assignee: 'Mike R', assigneeInitials: 'MR', priority: 'high', dueDate: 'Dec 10', status: 'in_progress' },
  { id: 't16', title: 'Prepare investor update', assignee: 'Emma T', assigneeInitials: 'ET', priority: 'medium', dueDate: 'Dec 13', status: 'in_progress' },
  { id: 't17', title: 'Audit ingredient suppliers', assignee: 'James W', assigneeInitials: 'JW', priority: 'medium', dueDate: 'Dec 12', status: 'in_progress' },
  { id: 't18', title: 'Update employee handbook', assignee: 'Lisa B', assigneeInitials: 'LB', priority: 'low', dueDate: 'Dec 18', status: 'in_progress' },
  { id: 't19', title: 'Schedule team training', assignee: 'Sarah C', assigneeInitials: 'SC', priority: 'medium', dueDate: 'Dec 15', status: 'in_progress' },
  { id: 't20', title: 'Review insurance policies', assignee: 'Mike R', assigneeInitials: 'MR', priority: 'low', dueDate: 'Dec 17', status: 'in_progress' },
  { id: 't21', title: 'Finalize Q4 budget report', assignee: 'Finance', assigneeInitials: 'FN', priority: 'high', dueDate: 'Dec 11', status: 'review' },
  { id: 't22', title: 'Website redesign mockups', assignee: 'Marketing', assigneeInitials: 'MK', priority: 'medium', dueDate: 'Dec 12', status: 'review' },
  { id: 't23', title: 'New hire onboarding docs', assignee: 'HR Team', assigneeInitials: 'HR', priority: 'medium', dueDate: 'Dec 13', status: 'review' },
  { id: 't24', title: 'Product label compliance check', assignee: 'James W', assigneeInitials: 'JW', priority: 'high', dueDate: 'Dec 10', status: 'review' },
  { id: 't25', title: 'Complete inventory recount', assignee: 'Mike J', assigneeInitials: 'MJ', priority: 'high', dueDate: 'Dec 8', status: 'done' },
  { id: 't26', title: 'Send partner invoices', assignee: 'Accounting', assigneeInitials: 'AC', priority: 'medium', dueDate: 'Dec 7', status: 'done' },
  { id: 't27', title: 'Update pricing spreadsheet', assignee: 'Emma T', assigneeInitials: 'ET', priority: 'medium', dueDate: 'Dec 6', status: 'done' },
  { id: 't28', title: 'Review quality metrics', assignee: 'James W', assigneeInitials: 'JW', priority: 'medium', dueDate: 'Dec 5', status: 'done' },
  { id: 't29', title: 'Process returns batch', assignee: 'Lisa B', assigneeInitials: 'LB', priority: 'low', dueDate: 'Dec 5', status: 'done' },
  { id: 't30', title: 'Approve vendor invoices', assignee: 'Mike R', assigneeInitials: 'MR', priority: 'medium', dueDate: 'Dec 4', status: 'done' },
  { id: 't31', title: 'Update social media calendar', assignee: 'Sarah C', assigneeInitials: 'SC', priority: 'low', dueDate: 'Dec 4', status: 'done' },
  { id: 't32', title: 'Complete staff evaluations', assignee: 'Emma T', assigneeInitials: 'ET', priority: 'medium', dueDate: 'Dec 3', status: 'done' },
  { id: 't33', title: 'Finalize holiday schedule', assignee: 'Lisa B', assigneeInitials: 'LB', priority: 'medium', dueDate: 'Dec 3', status: 'done' },
  { id: 't34', title: 'Order packaging materials', assignee: 'James W', assigneeInitials: 'JW', priority: 'high', dueDate: 'Dec 2', status: 'done' },
  { id: 't35', title: 'Update website product info', assignee: 'Sarah C', assigneeInitials: 'SC', priority: 'low', dueDate: 'Dec 2', status: 'done' },
  { id: 't36', title: 'Process payroll adjustments', assignee: 'Finance', assigneeInitials: 'FN', priority: 'high', dueDate: 'Dec 1', status: 'done' },
  { id: 't37', title: 'Coordinate team meeting', assignee: 'Mike R', assigneeInitials: 'MR', priority: 'low', dueDate: 'Dec 1', status: 'done' },
  { id: 't38', title: 'Review customer feedback', assignee: 'Lisa B', assigneeInitials: 'LB', priority: 'medium', dueDate: 'Nov 30', status: 'done' },
  { id: 't39', title: 'Complete compliance training', assignee: 'James W', assigneeInitials: 'JW', priority: 'high', dueDate: 'Nov 29', status: 'done' },
];

const teamMembers: TeamMember[] = [
  { id: 'tm1', name: 'Sarah Chen', initials: 'SC', tasksAssigned: 9, tasksCompleted: 14, capacity: 12, avatarColor: '#8B5CF6' },
  { id: 'tm2', name: 'Mike Rodriguez', initials: 'MR', tasksAssigned: 8, tasksCompleted: 11, capacity: 10, avatarColor: '#3B82F6' },
  { id: 'tm3', name: 'Emma Thompson', initials: 'ET', tasksAssigned: 7, tasksCompleted: 9, capacity: 10, avatarColor: '#EC4899' },
  { id: 'tm4', name: 'James Wilson', initials: 'JW', tasksAssigned: 6, tasksCompleted: 8, capacity: 8, avatarColor: '#F59E0B' },
  { id: 'tm5', name: 'Lisa Brown', initials: 'LB', tasksAssigned: 5, tasksCompleted: 7, capacity: 8, avatarColor: '#10B981' },
];

const recentActivity: Activity[] = [
  { id: 'a1', type: 'completed', user: 'Sarah Chen', userInitials: 'SC', taskTitle: 'Ship Whole Foods order', timestamp: '2 hours ago' },
  { id: 'a2', type: 'assigned', user: 'Mike Rodriguez', userInitials: 'MR', taskTitle: 'Review shipping delays', timestamp: '3 hours ago' },
  { id: 'a3', type: 'created', user: 'Emma Thompson', userInitials: 'ET', taskTitle: 'Prepare investor update', timestamp: '4 hours ago' },
  { id: 'a4', type: 'completed', user: 'James Wilson', userInitials: 'JW', taskTitle: 'QC audit for Batch #2846', timestamp: '5 hours ago' },
  { id: 'a5', type: 'assigned', user: 'Lisa Brown', userInitials: 'LB', taskTitle: 'Update CRM records', timestamp: '6 hours ago' },
  { id: 'a6', type: 'completed', user: 'Sarah Chen', userInitials: 'SC', taskTitle: 'Update social media calendar', timestamp: '7 hours ago' },
  { id: 'a7', type: 'created', user: 'Mike Rodriguez', userInitials: 'MR', taskTitle: 'Coordinate with logistics team', timestamp: '8 hours ago' },
  { id: 'a8', type: 'completed', user: 'Emma Thompson', userInitials: 'ET', taskTitle: 'Complete staff evaluations', timestamp: '1 day ago' },
];

const upcomingDeadlines: Deadline[] = [
  { id: 'd1', title: 'Review Q4 inventory report', dueDate: 'Dec 10', assignee: 'Sarah C', priority: 'high' },
  { id: 'd2', title: 'Negotiate vendor pricing', dueDate: 'Dec 10', assignee: 'Sarah C', priority: 'high' },
  { id: 'd3', title: 'Finalize Q4 budget report', dueDate: 'Dec 11', assignee: 'Finance', priority: 'high' },
  { id: 'd4', title: 'Update supplier contracts', dueDate: 'Dec 11', assignee: 'Mike R', priority: 'medium' },
  { id: 'd5', title: 'Prepare board presentation', dueDate: 'Dec 12', assignee: 'Emma T', priority: 'high' },
];

const taskCategories: Category[] = [
  { id: 'c1', name: 'Operations', count: 18, icon: <Briefcase size={16} />, color: '#3B82F6' },
  { id: 'c2', name: 'Marketing', count: 12, icon: <Megaphone size={16} />, color: '#EC4899' },
  { id: 'c3', name: 'Production', count: 8, icon: <Factory size={16} />, color: '#F59E0B' },
  { id: 'c4', name: 'Finance', count: 5, icon: <DollarSign size={16} />, color: '#10B981' },
  { id: 'c5', name: 'HR', count: 4, icon: <UserCog size={16} />, color: '#8B5CF6' },
];

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
    case 'created': return <Plus size={14} color={NEON_GREEN} />;
  }
}

function getActivityText(type: Activity['type']): string {
  switch (type) {
    case 'completed': return 'completed';
    case 'assigned': return 'was assigned';
    case 'created': return 'created';
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
  const todoTasks = allTasks.filter(t => t.status === 'todo').slice(0, 8);
  const inProgressTasks = allTasks.filter(t => t.status === 'in_progress').slice(0, 12);
  const reviewTasks = allTasks.filter(t => t.status === 'review').slice(0, 4);
  const doneTasks = allTasks.filter(t => t.status === 'done').slice(0, 15);

  return (
    <CommandCenterLayout title="Tasks">
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.iconWrapper}>
            <CheckSquare size={24} color={NEON_GREEN} />
          </div>
          <div>
            <h1 style={styles.headerTitle}>Tasks</h1>
            <p style={styles.subtitle}>Operations workflow and team management</p>
          </div>
        </header>

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
            <KanbanColumn title="TO DO" tasks={todoTasks} count={8} />
            <KanbanColumn title="IN PROGRESS" tasks={inProgressTasks} count={12} />
            <KanbanColumn title="REVIEW" tasks={reviewTasks} count={4} />
            <KanbanColumn title="DONE" tasks={doneTasks} count={15} />
          </div>
        </section>

        <div style={styles.twoColumnGrid}>
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
                      <span style={styles.teamTaskCount}>{member.tasksAssigned} assigned / {member.tasksCompleted} completed</span>
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

          <section style={styles.card}>
            <h2 style={styles.cardTitle}>
              <Calendar size={18} color={NEON_GREEN} />
              Upcoming Deadlines
            </h2>
            <div style={styles.deadlinesList}>
              {upcomingDeadlines.map(deadline => (
                <div key={deadline.id} style={styles.deadlineItem}>
                  <div style={{ ...styles.priorityDot, background: getPriorityColor(deadline.priority) }} />
                  <div style={styles.deadlineContent}>
                    <span style={styles.deadlineTitle}>{deadline.title}</span>
                    <div style={styles.deadlineMeta}>
                      <span style={styles.deadlineDate}>{deadline.dueDate}</span>
                      <span style={styles.deadlineAssignee}>{deadline.assignee}</span>
                      <span style={{ ...styles.priorityBadgeSmall, background: `${getPriorityColor(deadline.priority)}20`, color: getPriorityColor(deadline.priority) }}>
                        {getPriorityLabel(deadline.priority)}
                      </span>
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
              <Briefcase size={18} color={NEON_GREEN} />
              Task Categories
            </h2>
            <div style={styles.categoriesList}>
              {taskCategories.map(category => (
                <div key={category.id} style={styles.categoryItem}>
                  <div style={{ ...styles.categoryIcon, background: `${category.color}20`, color: category.color }}>
                    {category.icon}
                  </div>
                  <span style={styles.categoryName}>{category.name}</span>
                  <span style={styles.categoryCount}>{category.count} tasks</span>
                  <div style={styles.categoryBar}>
                    <div
                      style={{
                        ...styles.categoryBarFill,
                        width: `${(category.count / 47) * 100}%`,
                        background: category.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

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
        </div>
      </div>
    </CommandCenterLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1400,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    margin: '4px 0 0 0',
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
    fontSize: 12,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '0.5px',
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
  priorityBadgeSmall: {
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 9,
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
    fontSize: 11,
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
  deadlinesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  deadlineItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 10,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginTop: 6,
    flexShrink: 0,
  },
  deadlineContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  deadlineTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#fff',
  },
  deadlineMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  deadlineDate: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  deadlineAssignee: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  categoriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
  },
  categoryIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 8,
    flexShrink: 0,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#fff',
    flex: 1,
  },
  categoryCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginRight: 12,
  },
  categoryBar: {
    width: 80,
    height: 4,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 10,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
  },
  activityIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: '50%',
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
    color: NEON_GREEN,
  },
  activityTime: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
};
