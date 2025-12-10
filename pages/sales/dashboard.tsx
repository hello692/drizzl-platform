import React from 'react';
import Link from 'next/link';
import SalesLayout from '../../components/sales/SalesLayout';
import {
  Target,
  Phone,
  TrendingUp,
  Calendar,
  Clock,
  AlertTriangle,
  ChevronRight,
  Flame,
  Building2,
  MessageSquare,
  Mail,
  Bell,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

const repName = 'Sarah Johnson';
const currentQuota = 38450;
const monthlyQuota = 50000;
const quotaPercentage = Math.round((currentQuota / monthlyQuota) * 100);
const daysLeft = 8;
const projectedTotal = 49800;
const projectedPercentage = ((projectedTotal / monthlyQuota) * 100).toFixed(1);

const snapshotStats = [
  { label: 'Leads', value: '12 active', icon: Target, color: NEON_GREEN },
  { label: 'Calls', value: '8 today', icon: Phone, color: '#60A5FA' },
  { label: 'Deals', value: '5 closing', icon: TrendingUp, color: '#F59E0B' },
];

const highPriorityActions = [
  { id: 1, icon: Phone, text: 'Call back Whole Foods buyer - left VM yesterday', time: 'Due: 10:00 AM' },
  { id: 2, icon: Building2, text: 'Send revised proposal to Target regional manager', time: 'Due: 12:00 PM' },
  { id: 3, icon: AlertTriangle, text: 'Follow up on Costco pilot program decision', time: 'Due: 2:00 PM' },
];

const scheduledToday = [
  { id: 1, time: '11:00 AM', title: 'Demo call with Sprouts Farmers Market', location: 'Zoom' },
  { id: 2, time: '2:30 PM', title: 'Site visit - Fresh Thyme Indianapolis', location: 'On-site' },
  { id: 3, time: '4:00 PM', title: 'Contract review with Kroger legal team', location: 'Teams' },
];

const leaderboard = [
  { rank: 1, name: 'Marcus Chen', amount: 62450, emoji: '🥇' },
  { rank: 2, name: 'Lisa Park', amount: 58200, emoji: '🥈' },
  { rank: 3, name: 'David Williams', amount: 51800, emoji: '🥉' },
];

const hotLeads = [
  { id: 'lead-1', company: 'Whole Foods Market', score: 94, stage: 'Negotiation', value: 180000 },
  { id: 'lead-2', company: 'Target Corporation', score: 87, stage: 'Proposal', value: 320000 },
  { id: 'lead-3', company: 'Costco Wholesale', score: 82, stage: 'Discovery', value: 425000 },
];

const recentMessages = [
  { id: 1, initials: 'MK', name: 'Mike Chen', role: 'Manager', time: '2m ago', message: 'Great work on the Target deal! 🎉', unreadCount: 0 },
  { id: 2, initials: 'WF', name: 'Whole Foods Team', role: 'Partner', time: '1h ago', message: 'Quick question about next month...', unreadCount: 2 },
  { id: 3, initials: 'ST', name: 'Support Team', role: 'Support', time: '3h ago', message: 'Your expense report approved', unreadCount: 0 },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SalesDashboard() {
  return (
    <SalesLayout title="Dashboard" repName={repName}>
      <div style={styles.page}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.greeting}>{getGreeting()}, {repName.split(' ')[0]}</h1>
            <p style={styles.date}>{formatDate()}</p>
          </div>
        </header>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Today's Snapshot</h2>
          <div style={styles.snapshotGrid}>
            {snapshotStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} style={styles.snapshotCard}>
                  <div style={{ ...styles.snapshotIcon, backgroundColor: `${stat.color}15` }}>
                    <Icon size={20} color={stat.color} />
                  </div>
                  <div style={styles.snapshotContent}>
                    <span style={styles.snapshotLabel}>{stat.label}</span>
                    <span style={styles.snapshotValue}>{stat.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Quota Progress</h2>
          <div style={styles.quotaCard}>
            <div style={styles.quotaHeader}>
              <div>
                <span style={styles.quotaLabel}>Monthly Quota</span>
                <span style={styles.quotaTarget}>{formatCurrency(monthlyQuota)}</span>
              </div>
              <div style={styles.quotaPercentage}>
                <span style={styles.quotaPercentValue}>{quotaPercentage}%</span>
              </div>
            </div>
            
            <div style={styles.quotaCurrent}>
              <span style={styles.quotaCurrentLabel}>Current:</span>
              <span style={styles.quotaCurrentValue}>{formatCurrency(currentQuota)}</span>
            </div>

            <div style={styles.progressBarContainer}>
              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: `${quotaPercentage}%` }} />
              </div>
            </div>

            <div style={styles.quotaFooter}>
              <div style={styles.daysLeft}>
                <Clock size={14} color="rgba(255,255,255,0.5)" />
                <span>{daysLeft} days left</span>
              </div>
              <div style={styles.projected}>
                <span>🔥 On track to: {formatCurrency(projectedTotal)} ({projectedPercentage}%)</span>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Next Actions</h2>
          
          <div style={styles.actionsCard}>
            <div style={styles.actionsHeader}>
              <span style={styles.priorityBadge}>⚠️ HIGH PRIORITY</span>
            </div>
            <div style={styles.actionsList}>
              {highPriorityActions.map((action) => {
                const Icon = action.icon;
                return (
                  <div key={action.id} style={styles.actionItem}>
                    <div style={styles.actionIcon}>
                      <Icon size={16} color={NEON_GREEN} />
                    </div>
                    <div style={styles.actionContent}>
                      <span style={styles.actionText}>{action.text}</span>
                      <span style={styles.actionTime}>{action.time}</span>
                    </div>
                    <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ ...styles.actionsCard, marginTop: 16 }}>
            <div style={styles.actionsHeader}>
              <span style={styles.scheduledBadge}>📅 SCHEDULED TODAY</span>
            </div>
            <div style={styles.actionsList}>
              {scheduledToday.map((appointment) => (
                <div key={appointment.id} style={styles.appointmentItem}>
                  <div style={styles.appointmentTime}>
                    <Calendar size={14} color="rgba(255,255,255,0.5)" />
                    <span>{appointment.time}</span>
                  </div>
                  <div style={styles.appointmentContent}>
                    <span style={styles.appointmentTitle}>{appointment.title}</span>
                    <span style={styles.appointmentLocation}>{appointment.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Leaderboard</h2>
          <div style={styles.leaderboardCard}>
            <div style={styles.leaderboardHeader}>
              <span style={styles.leaderboardTitle}>🏆 This Month's Top Reps</span>
            </div>
            <div style={styles.leaderboardList}>
              {leaderboard.map((rep) => (
                <div key={rep.rank} style={styles.leaderboardItem}>
                  <div style={styles.leaderboardRank}>
                    <span style={styles.leaderboardEmoji}>{rep.emoji}</span>
                  </div>
                  <div style={styles.leaderboardInfo}>
                    <span style={styles.leaderboardName}>{rep.name}</span>
                    <span style={styles.leaderboardAmount}>{formatCurrency(rep.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.leaderboardFooter}>
              <span style={styles.yourRank}>You're rank <strong>#8</strong> of 15 reps</span>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🔥 Hot Leads</h2>
          <div style={styles.hotLeadsGrid}>
            {hotLeads.map((lead) => (
              <Link key={lead.id} href={`/sales/leads/${lead.id}`} style={styles.hotLeadCard}>
                <div style={styles.hotLeadHeader}>
                  <div style={styles.hotLeadCompany}>
                    <Flame size={16} color="#FF6B35" />
                    <span>{lead.company}</span>
                  </div>
                  <div style={styles.hotLeadScore}>
                    <span>{lead.score}</span>
                  </div>
                </div>
                <div style={styles.hotLeadDetails}>
                  <div style={styles.hotLeadStage}>
                    <span style={styles.hotLeadStageLabel}>Stage:</span>
                    <span style={styles.hotLeadStageValue}>{lead.stage}</span>
                  </div>
                  <div style={styles.hotLeadValue}>
                    {formatCurrency(lead.value)}
                  </div>
                </div>
                <div style={styles.hotLeadAction}>
                  <span>View Details</span>
                  <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.messagesCard}>
            <div style={styles.messagesHeader}>
              <div style={styles.messagesTitle}>
                <MessageSquare size={18} color={NEON_GREEN} />
                <span>Recent Messages</span>
              </div>
              <Link href="/sales/messages" style={styles.viewAllLink}>
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div style={styles.messagesList}>
              {recentMessages.map((msg) => (
                <Link key={msg.id} href="/sales/messages" style={styles.messageItem}>
                  <div style={styles.messageAvatar}>
                    <span>{msg.initials}</span>
                  </div>
                  <div style={styles.messageContent}>
                    <div style={styles.messageTopRow}>
                      <span style={styles.messageName}>{msg.name}</span>
                      <span style={styles.messageRole}>({msg.role})</span>
                      <div style={styles.messageTimeContainer}>
                        <span style={styles.messageTime}>{msg.time}</span>
                        {msg.unreadCount > 0 && (
                          <span style={styles.unreadBadge}>●{msg.unreadCount}</span>
                        )}
                      </div>
                    </div>
                    <div style={styles.messagePreview}>"{msg.message}"</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.emailCard}>
            <div style={styles.emailHeader}>
              <div style={styles.emailTitle}>
                <Mail size={18} color={NEON_GREEN} />
                <span>Email Integration</span>
              </div>
              <span style={styles.comingSoonBadge}>Coming Soon</span>
            </div>
            <div style={styles.emailContent}>
              <p style={styles.emailDescription}>
                Gmail integration is coming soon. You'll be able to view and send emails directly from your dashboard.
              </p>
              <button
                style={styles.notifyButton}
                onClick={() => alert('Thanks! We\'ll notify you when Gmail integration is available.')}
              >
                <Bell size={16} />
                <span>Notify Me When Available</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </SalesLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 800,
    margin: '0 auto',
    paddingBottom: 'clamp(60px, 15vw, 80px)',
  },
  header: {
    marginBottom: 'clamp(16px, 4vw, 24px)',
  },
  greeting: {
    fontSize: 'clamp(22px, 5vw, 28px)',
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 4,
  },
  date: {
    fontSize: 'clamp(12px, 3vw, 14px)',
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
  },
  section: {
    marginBottom: 'clamp(16px, 4vw, 24px)',
  },
  sectionTitle: {
    fontSize: 'clamp(14px, 3.5vw, 16px)',
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 12,
  },
  snapshotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'clamp(8px, 2vw, 12px)',
  },
  snapshotCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 'clamp(10px, 3vw, 16px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  snapshotIcon: {
    width: 'clamp(36px, 10vw, 44px)',
    height: 'clamp(36px, 10vw, 44px)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapshotContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  snapshotLabel: {
    fontSize: 'clamp(10px, 2.5vw, 12px)',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  snapshotValue: {
    fontSize: 'clamp(12px, 3vw, 14px)',
    fontWeight: 600,
    color: '#FFFFFF',
  },
  quotaCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 'clamp(14px, 4vw, 20px)',
  },
  quotaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  quotaLabel: {
    display: 'block',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  quotaTarget: {
    display: 'block',
    fontSize: 'clamp(20px, 5vw, 24px)',
    fontWeight: 700,
    color: '#FFFFFF',
  },
  quotaPercentage: {
    backgroundColor: `${NEON_GREEN}15`,
    borderRadius: 8,
    padding: '8px 12px',
  },
  quotaPercentValue: {
    fontSize: 20,
    fontWeight: 700,
    color: NEON_GREEN,
  },
  quotaCurrent: {
    marginBottom: 16,
  },
  quotaCurrentLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginRight: 8,
  },
  quotaCurrentValue: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: NEON_GREEN,
    borderRadius: 6,
    transition: 'width 0.3s ease',
  },
  quotaFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  daysLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  projected: {
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: 500,
  },
  actionsCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionsHeader: {
    padding: '12px 16px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  priorityBadge: {
    fontSize: 12,
    fontWeight: 600,
    color: '#FF6B6B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scheduledBadge: {
    fontSize: 12,
    fontWeight: 600,
    color: '#60A5FA',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionsList: {
    padding: 8,
  },
  actionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${NEON_GREEN}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  actionText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 1.4,
  },
  actionTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  appointmentItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    padding: 12,
    borderRadius: 8,
  },
  appointmentTime: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    minWidth: 90,
    flexShrink: 0,
  },
  appointmentContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  appointmentTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 500,
  },
  appointmentLocation: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  leaderboardCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  leaderboardHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  leaderboardTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  leaderboardList: {
    padding: 12,
  },
  leaderboardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 8px',
    borderRadius: 8,
  },
  leaderboardRank: {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardEmoji: {
    fontSize: 24,
  },
  leaderboardInfo: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leaderboardName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 500,
  },
  leaderboardAmount: {
    fontSize: 14,
    color: NEON_GREEN,
    fontWeight: 600,
  },
  leaderboardFooter: {
    padding: '12px 20px',
    borderTop: `1px solid ${CARD_BORDER}`,
    textAlign: 'center',
  },
  yourRank: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  hotLeadsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: 12,
  },
  hotLeadCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 16,
    textDecoration: 'none',
    display: 'block',
    transition: 'border-color 0.2s, transform 0.2s',
  },
  hotLeadHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hotLeadCompany: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  hotLeadScore: {
    backgroundColor: `${NEON_GREEN}20`,
    borderRadius: 8,
    padding: '4px 10px',
    fontSize: 14,
    fontWeight: 700,
    color: NEON_GREEN,
  },
  hotLeadDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hotLeadStage: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  hotLeadStageLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  hotLeadStageValue: {
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: 500,
  },
  hotLeadValue: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  hotLeadAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    fontSize: 13,
    color: NEON_GREEN,
    fontWeight: 500,
  },
  messagesCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  messagesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  messagesTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  viewAllLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    color: NEON_GREEN,
    fontWeight: 500,
    textDecoration: 'none',
  },
  messagesList: {
    padding: 8,
  },
  messageItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${NEON_GREEN}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 600,
    color: NEON_GREEN,
    flexShrink: 0,
  },
  messageContent: {
    flex: 1,
    minWidth: 0,
  },
  messageTopRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  messageName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  messageRole: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  messageTimeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  messageTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  unreadBadge: {
    fontSize: 12,
    fontWeight: 600,
    color: NEON_GREEN,
  },
  messagePreview: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  emailCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  emailTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  comingSoonBadge: {
    fontSize: 11,
    fontWeight: 600,
    color: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    padding: '4px 10px',
    borderRadius: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emailContent: {
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  emailDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.6,
    margin: 0,
    marginBottom: 20,
    maxWidth: 320,
  },
  notifyButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${NEON_GREEN}15`,
    border: `1px solid ${NEON_GREEN}40`,
    borderRadius: 10,
    padding: '12px 20px',
    fontSize: 14,
    fontWeight: 600,
    color: NEON_GREEN,
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
  },
};
