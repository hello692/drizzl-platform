import React, { useState, useRef } from 'react';
import SalesLayout from '../../components/sales/SalesLayout';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Users,
  Video,
  Clock,
  MapPin,
  Navigation,
  CheckCircle,
  X,
  Calendar,
  FileText,
  Send,
  Target,
  BarChart3,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

type ActivityType = 'call' | 'email' | 'meeting' | 'demo' | 'task';

interface ScheduledActivity {
  id: string;
  time: string;
  endTime: string;
  title: string;
  type: ActivityType;
  contact?: string;
  phone?: string;
  address?: string;
  location?: string;
  isEmpty?: boolean;
}

interface ActivityStats {
  type: string;
  current: number;
  goal: number;
  color: string;
}

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  call: '#3B82F6',
  email: '#8B5CF6',
  meeting: '#10B981',
  demo: '#A855F7',
  task: '#F59E0B',
};

const ACTIVITY_ICONS: Record<ActivityType, React.ElementType> = {
  call: Phone,
  email: Mail,
  meeting: Users,
  demo: Video,
  task: FileText,
};

const MOCK_SCHEDULE: ScheduledActivity[] = [
  { id: '1', time: '9:00 AM', endTime: '9:30 AM', title: 'Team standup', type: 'meeting', location: 'Zoom' },
  { id: '2', time: '10:00 AM', endTime: '10:30 AM', title: 'Call: Target buyer', type: 'call', contact: 'Michael Chen', phone: '+1 (612) 304-6073' },
  { id: '3', time: '12:00 PM', endTime: '12:30 PM', title: 'Available', type: 'task', isEmpty: true },
  { id: '4', time: '2:00 PM', endTime: '3:30 PM', title: 'Demo: Whole Foods', type: 'demo', contact: 'Jennifer Smith', address: '525 N Lamar Blvd, Austin, TX 78703' },
  { id: '5', time: '4:30 PM', endTime: '5:00 PM', title: 'Follow-up: Kroger', type: 'call', contact: 'Amanda Taylor', phone: '+1 (513) 762-4000' },
];

const ACTIVITY_STATS: ActivityStats[] = [
  { type: 'Calls', current: 68, goal: 100, color: '#3B82F6' },
  { type: 'Emails', current: 42, goal: 50, color: '#8B5CF6' },
  { type: 'Meetings', current: 12, goal: 20, color: '#10B981' },
  { type: 'Demos', current: 8, goal: 15, color: '#A855F7' },
  { type: 'Proposals', current: 5, goal: 10, color: '#F59E0B' },
];

const LEADS_OPTIONS = [
  'Whole Foods Market',
  'Target Corporation',
  'Costco Wholesale',
  "Trader Joe's",
  'Sprouts Farmers Market',
  'Safeway',
  'Kroger',
  'Natural Grocers',
];

const ACTIVITY_TYPES = ['Phone Call', 'Email', 'Meeting', 'Demo', 'Task'];
const OUTCOMES = ['Positive', 'Neutral', 'Negative', 'No Answer'];
const NEXT_STEPS = ['Send Proposal', 'Schedule Demo', 'Follow Up', 'Send Samples', 'Close Deal', 'No Action'];
const DURATIONS = ['15 min', '30 min', '45 min', '1 hour', '1.5 hours', '2 hours'];

function generateDates(centerDate: Date): Date[] {
  const dates: Date[] = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(centerDate);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatDateNum(date: Date): number {
  return date.getDate();
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.toDateString() === d2.toDateString();
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 6; h <= 20; h++) {
    const hour = h > 12 ? h - 12 : h;
    const ampm = h >= 12 ? 'PM' : 'AM';
    slots.push(`${hour}:00 ${ampm}`);
  }
  return slots;
}

function timeToPosition(time: string): number {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return ((hours - 6) * 60 + minutes) / (14 * 60) * 100;
}

function getDuration(start: string, end: string): number {
  const startPos = timeToPosition(start);
  const endPos = timeToPosition(end);
  return endPos - startPos;
}

export default function SalesActivityPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [dates, setDates] = useState(generateDates(new Date()));
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const [quickLog, setQuickLog] = useState({
    who: '',
    what: '',
    outcome: '',
    nextStep: '',
    notes: '',
  });

  const [newActivity, setNewActivity] = useState({
    type: '',
    lead: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    notes: '',
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + (diff > 0 ? 1 : -1));
      setSelectedDate(newDate);
      setDates(generateDates(newDate));
    }
    setTouchStart(null);
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
    setDates(generateDates(newDate));
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setDates(generateDates(today));
  };

  const handleLogActivity = () => {
    setQuickLog({ who: '', what: '', outcome: '', nextStep: '', notes: '' });
  };

  const handleCreateActivity = () => {
    setShowAddModal(false);
    setNewActivity({ type: '', lead: '', date: '', time: '', duration: '', location: '', notes: '' });
  };

  const timeSlots = getTimeSlots();

  return (
    <SalesLayout title="Activity">
      <div style={styles.page}>
        <div style={styles.headerRow}>
          <button onClick={() => setShowAddModal(true)} style={styles.addButton}>
            <Plus size={18} />
            <span>Add Activity</span>
          </button>
        </div>

        <section style={styles.section}>
          <div style={styles.dateSelector}>
            <button onClick={() => navigateDate(-1)} style={styles.navButton}>
              <ChevronLeft size={20} />
            </button>

            <div
              ref={dateScrollRef}
              style={styles.datesScroll}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {dates.map((date) => {
                const selected = isSameDay(date, selectedDate);
                const today = isToday(date);
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    style={{
                      ...styles.dateItem,
                      ...(selected ? styles.dateItemSelected : {}),
                      ...(today && !selected ? styles.dateItemToday : {}),
                    }}
                  >
                    <span style={styles.dateDay}>{formatDateShort(date)}</span>
                    <span style={{
                      ...styles.dateNum,
                      ...(selected ? styles.dateNumSelected : {}),
                    }}>{formatDateNum(date)}</span>
                  </button>
                );
              })}
            </div>

            <button onClick={() => navigateDate(1)} style={styles.navButton}>
              <ChevronRight size={20} />
            </button>

            <button onClick={goToToday} style={styles.todayButton}>
              Today
            </button>
          </div>

          <div style={styles.selectedDateDisplay}>
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Timeline</h2>
          <div style={styles.timelineContainer}>
            <div style={styles.timelineHours}>
              {timeSlots.map((slot) => (
                <div key={slot} style={styles.timeSlot}>
                  <span style={styles.timeSlotLabel}>{slot}</span>
                </div>
              ))}
            </div>
            <div style={styles.timelineEvents}>
              {MOCK_SCHEDULE.filter(a => !a.isEmpty).map((activity) => {
                const top = timeToPosition(activity.time);
                const height = getDuration(activity.time, activity.endTime);
                return (
                  <div
                    key={activity.id}
                    style={{
                      ...styles.timelineEvent,
                      top: `${top}%`,
                      height: `${Math.max(height, 5)}%`,
                      backgroundColor: `${ACTIVITY_COLORS[activity.type]}20`,
                      borderLeft: `3px solid ${ACTIVITY_COLORS[activity.type]}`,
                    }}
                  >
                    <span style={{ ...styles.eventTime, color: ACTIVITY_COLORS[activity.type] }}>{activity.time}</span>
                    <span style={styles.eventTitle}>{activity.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Today's Schedule</h2>
          <div style={styles.scheduleList}>
            {MOCK_SCHEDULE.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.type];
              return (
                <div
                  key={activity.id}
                  style={{
                    ...styles.scheduleItem,
                    ...(activity.isEmpty ? styles.scheduleItemEmpty : {}),
                  }}
                >
                  <div style={styles.scheduleTime}>
                    <Clock size={14} color="rgba(255,255,255,0.5)" />
                    <span>{activity.time}</span>
                  </div>

                  <div style={styles.scheduleContent}>
                    <div style={styles.scheduleHeader}>
                      <div style={{ ...styles.scheduleIcon, backgroundColor: `${ACTIVITY_COLORS[activity.type]}20` }}>
                        <Icon size={16} color={ACTIVITY_COLORS[activity.type]} />
                      </div>
                      <span style={styles.scheduleTitle}>
                        {activity.type === 'call' && '📞 '}
                        {activity.type === 'demo' && '🤝 '}
                        {activity.title}
                      </span>
                    </div>

                    {activity.contact && (
                      <div style={styles.scheduleContact}>
                        <span>{activity.contact}</span>
                      </div>
                    )}

                    {activity.phone && (
                      <div style={styles.scheduleDetail}>
                        <Phone size={12} color="rgba(255,255,255,0.5)" />
                        <span>{activity.phone}</span>
                      </div>
                    )}

                    {activity.address && (
                      <div style={styles.scheduleDetail}>
                        <MapPin size={12} color="rgba(255,255,255,0.5)" />
                        <span>{activity.address}</span>
                      </div>
                    )}

                    {activity.location && (
                      <div style={styles.scheduleDetail}>
                        <Video size={12} color="rgba(255,255,255,0.5)" />
                        <span>{activity.location}</span>
                      </div>
                    )}
                  </div>

                  <div style={styles.scheduleActions}>
                    {activity.type === 'call' && activity.phone && (
                      <a href={`tel:${activity.phone}`} style={styles.actionBtn}>
                        <Phone size={14} />
                        <span>Join Call</span>
                      </a>
                    )}
                    {activity.type === 'demo' && activity.address && (
                      <>
                        <a href={`https://maps.google.com/?q=${encodeURIComponent(activity.address)}`} target="_blank" rel="noopener noreferrer" style={styles.actionBtn}>
                          <Navigation size={14} />
                          <span>Navigate</span>
                        </a>
                        <button style={{ ...styles.actionBtn, ...styles.actionBtnPrimary }}>
                          <CheckCircle size={14} />
                          <span>Check In</span>
                        </button>
                      </>
                    )}
                    {activity.isEmpty && (
                      <button onClick={() => setShowAddModal(true)} style={styles.actionBtn}>
                        <Plus size={14} />
                        <span>Book</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.quickLogCard}>
            <div style={styles.quickLogHeader}>
              <span style={styles.quickLogTitle}>⚡ Quick Log</span>
              <span style={styles.quickLogSubtitle}>Just finished a call/meeting? Log it in 10 seconds</span>
            </div>

            <div style={styles.quickLogForm}>
              <div style={styles.formRow}>
                <label style={styles.formLabel}>Who</label>
                <select
                  value={quickLog.who}
                  onChange={(e) => setQuickLog({ ...quickLog, who: e.target.value })}
                  style={styles.formSelect}
                >
                  <option value="">Select lead/partner...</option>
                  {LEADS_OPTIONS.map((lead) => (
                    <option key={lead} value={lead}>{lead}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formRow}>
                <label style={styles.formLabel}>What</label>
                <select
                  value={quickLog.what}
                  onChange={(e) => setQuickLog({ ...quickLog, what: e.target.value })}
                  style={styles.formSelect}
                >
                  <option value="">Select activity type...</option>
                  {ACTIVITY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formRow}>
                <label style={styles.formLabel}>Outcome</label>
                <select
                  value={quickLog.outcome}
                  onChange={(e) => setQuickLog({ ...quickLog, outcome: e.target.value })}
                  style={styles.formSelect}
                >
                  <option value="">Select outcome...</option>
                  {OUTCOMES.map((outcome) => (
                    <option key={outcome} value={outcome}>{outcome}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formRow}>
                <label style={styles.formLabel}>Next Step</label>
                <select
                  value={quickLog.nextStep}
                  onChange={(e) => setQuickLog({ ...quickLog, nextStep: e.target.value })}
                  style={styles.formSelect}
                >
                  <option value="">Select next step...</option>
                  {NEXT_STEPS.map((step) => (
                    <option key={step} value={step}>{step}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formRow}>
                <label style={styles.formLabel}>Quick Note</label>
                <textarea
                  value={quickLog.notes}
                  onChange={(e) => setQuickLog({ ...quickLog, notes: e.target.value })}
                  placeholder="Add a quick note..."
                  style={styles.formTextarea}
                  rows={2}
                />
              </div>

              <button onClick={handleLogActivity} style={styles.logButton}>
                <Send size={16} />
                <span>Log Activity</span>
              </button>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📊 Your Activity This Month</h2>
          <div style={styles.heatmapCard}>
            <div style={styles.statsGrid}>
              {ACTIVITY_STATS.map((stat) => {
                const percentage = Math.min((stat.current / stat.goal) * 100, 100);
                return (
                  <div key={stat.type} style={styles.statItem}>
                    <div style={styles.statHeader}>
                      <span style={styles.statLabel}>{stat.type}</span>
                      <span style={styles.statValue}>{stat.current}/{stat.goal}</span>
                    </div>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${percentage}%`,
                          backgroundColor: stat.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={styles.activityInsights}>
              <div style={styles.insightItem}>
                <span style={styles.insightLabel}>🔥 Most active day:</span>
                <span style={styles.insightValue}>Tuesday (23 activities)</span>
              </div>
              <div style={styles.insightItem}>
                <span style={styles.insightLabel}>📉 Least active day:</span>
                <span style={styles.insightValue}>Friday (8 activities)</span>
              </div>
            </div>
          </div>
        </section>

        {showAddModal && (
          <>
            <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)} />
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Add Activity</h3>
                <button onClick={() => setShowAddModal(false)} style={styles.modalClose}>
                  <X size={20} />
                </button>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.typeSelector}>
                  {(['call', 'email', 'meeting', 'demo', 'task'] as ActivityType[]).map((type) => {
                    const Icon = ACTIVITY_ICONS[type];
                    const selected = newActivity.type === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setNewActivity({ ...newActivity, type })}
                        style={{
                          ...styles.typeButton,
                          ...(selected ? { backgroundColor: `${ACTIVITY_COLORS[type]}20`, borderColor: ACTIVITY_COLORS[type] } : {}),
                        }}
                      >
                        <Icon size={20} color={selected ? ACTIVITY_COLORS[type] : 'rgba(255,255,255,0.5)'} />
                        <span style={{ color: selected ? ACTIVITY_COLORS[type] : 'rgba(255,255,255,0.7)' }}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div style={styles.formRow}>
                  <label style={styles.formLabel}>Related Lead/Partner</label>
                  <select
                    value={newActivity.lead}
                    onChange={(e) => setNewActivity({ ...newActivity, lead: e.target.value })}
                    style={styles.formSelect}
                  >
                    <option value="">Select lead/partner...</option>
                    {LEADS_OPTIONS.map((lead) => (
                      <option key={lead} value={lead}>{lead}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGrid}>
                  <div style={styles.formRow}>
                    <label style={styles.formLabel}>Date</label>
                    <input
                      type="date"
                      value={newActivity.date}
                      onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                      style={styles.formInput}
                    />
                  </div>

                  <div style={styles.formRow}>
                    <label style={styles.formLabel}>Time</label>
                    <input
                      type="time"
                      value={newActivity.time}
                      onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                      style={styles.formInput}
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <label style={styles.formLabel}>Duration</label>
                  <select
                    value={newActivity.duration}
                    onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                    style={styles.formSelect}
                  >
                    <option value="">Select duration...</option>
                    {DURATIONS.map((dur) => (
                      <option key={dur} value={dur}>{dur}</option>
                    ))}
                  </select>
                </div>

                {(newActivity.type === 'meeting' || newActivity.type === 'demo') && (
                  <div style={styles.formRow}>
                    <label style={styles.formLabel}>Location</label>
                    <input
                      type="text"
                      value={newActivity.location}
                      onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                      placeholder="Address or meeting link..."
                      style={styles.formInput}
                    />
                  </div>
                )}

                <div style={styles.formRow}>
                  <label style={styles.formLabel}>Notes</label>
                  <textarea
                    value={newActivity.notes}
                    onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                    placeholder="Add notes..."
                    style={styles.formTextarea}
                    rows={3}
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button onClick={() => setShowAddModal(false)} style={styles.cancelButton}>
                  Cancel
                </button>
                <button onClick={handleCreateActivity} style={styles.createButton}>
                  <Calendar size={16} />
                  <span>Create Activity</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </SalesLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 800,
    margin: '0 auto',
    paddingBottom: 40,
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 12,
  },
  dateSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
  },
  datesScroll: {
    display: 'flex',
    gap: 8,
    flex: 1,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  dateItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    cursor: 'pointer',
    minWidth: 52,
    transition: 'all 0.2s',
  },
  dateItemSelected: {
    backgroundColor: `${NEON_GREEN}20`,
    borderColor: NEON_GREEN,
  },
  dateItemToday: {
    borderColor: 'rgba(255,255,255,0.3)',
  },
  dateDay: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
  },
  dateNum: {
    fontSize: 18,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  dateNumSelected: {
    color: NEON_GREEN,
  },
  todayButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: NEON_GREEN,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },
  selectedDateDisplay: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  timelineContainer: {
    display: 'flex',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
    height: 300,
  },
  timelineHours: {
    width: 70,
    borderRight: `1px solid ${CARD_BORDER}`,
    flexShrink: 0,
  },
  timeSlot: {
    height: 20,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 8,
  },
  timeSlotLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  timelineEvents: {
    flex: 1,
    position: 'relative',
    padding: 8,
  },
  timelineEvent: {
    position: 'absolute',
    left: 8,
    right: 8,
    borderRadius: 6,
    padding: '4px 8px',
    overflow: 'hidden',
  },
  eventTime: {
    fontSize: 10,
    fontWeight: 600,
  },
  eventTitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  scheduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  scheduleItem: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 16,
  },
  scheduleItemEmpty: {
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  scheduleTime: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
  },
  scheduleContent: {
    marginBottom: 12,
  },
  scheduleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  scheduleIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  scheduleContact: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 42,
  },
  scheduleDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 42,
    marginTop: 4,
  },
  scheduleActions: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 6,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    textDecoration: 'none',
  },
  actionBtnPrimary: {
    backgroundColor: `${NEON_GREEN}15`,
    borderColor: NEON_GREEN,
    color: NEON_GREEN,
  },
  quickLogCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 20,
  },
  quickLogHeader: {
    marginBottom: 16,
  },
  quickLogTitle: {
    display: 'block',
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quickLogSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  quickLogForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  formRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formSelect: {
    padding: '10px 12px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
  },
  formInput: {
    padding: '10px 12px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
  },
  formTextarea: {
    padding: '10px 12px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    resize: 'none',
    fontFamily: 'inherit',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  logButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 20px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
  },
  heatmapCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 20,
  },
  statsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  statValue: {
    fontSize: 13,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s',
  },
  activityInsights: {
    marginTop: 20,
    paddingTop: 16,
    borderTop: `1px solid ${CARD_BORDER}`,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  insightItem: {
    display: 'flex',
    gap: 8,
    fontSize: 13,
  },
  insightLabel: {
    color: 'rgba(255,255,255,0.5)',
  },
  insightValue: {
    color: '#FFFFFF',
    fontWeight: 500,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1000,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 480,
    maxHeight: '90vh',
    backgroundColor: '#111111',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    zIndex: 1001,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  modalClose: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    backgroundColor: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
  },
  modalBody: {
    padding: 20,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  typeSelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 8,
  },
  typeButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '12px 8px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    padding: '16px 20px',
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
