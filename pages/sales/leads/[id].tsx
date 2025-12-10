import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SalesLayout from '../../../components/sales/SalesLayout';
import {
  ArrowLeft,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Building2,
  User,
  DollarSign,
  Calendar,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Navigation,
  FileText,
  Plus,
  Upload,
  Flame,
  MessageSquare,
  Video,
  StickyNote,
  PhoneCall,
  MailOpen,
  MousePointer,
  Send,
  X,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface LeadData {
  id: string;
  companyName: string;
  contactName: string;
  contactTitle: string;
  email: string;
  phone: string;
  location: { city: string; state: string };
  score: number;
  status: string;
  estimatedValue: number;
  probability: number;
  expectedCloseDate: string;
  productsInterested: string[];
  unitsPerMonth: number;
  bant: {
    budget: 'confirmed' | 'unknown';
    authority: 'decision_maker' | 'influencer';
    need: 'urgent' | 'exploring';
    timeline: '30_days' | 'long_term';
  };
  nextAction: {
    type: string;
    dateTime: string;
    location?: string;
  };
  notes: string[];
  documents: { name: string; uploadedAt: string; size: string }[];
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  description: string;
  date: string;
  outcome?: string;
  emailOpened?: boolean;
  emailClicked?: boolean;
}

const MOCK_LEAD: LeadData = {
  id: '1',
  companyName: 'Whole Foods Market',
  contactName: 'Jennifer Smith',
  contactTitle: 'Buyer',
  email: 'jsmith@wholefoods.com',
  phone: '(555) 123-4567',
  location: { city: 'Los Angeles', state: 'CA' },
  score: 92,
  status: 'Demo Scheduled',
  estimatedValue: 85000,
  probability: 75,
  expectedCloseDate: '2025-01-15',
  productsInterested: ['Açaí Bowl Mix', 'Mango Jackfruit Smoothie', 'Strawberry Peach Blend'],
  unitsPerMonth: 500,
  bant: {
    budget: 'confirmed',
    authority: 'decision_maker',
    need: 'urgent',
    timeline: '30_days',
  },
  nextAction: {
    type: 'Product Demo',
    dateTime: new Date().toISOString().split('T')[0] + 'T14:00:00',
    location: '123 Whole Foods HQ, Los Angeles, CA 90001',
  },
  notes: [
    'Initial call went well - very interested in organic product line',
    'Budget approved for Q1 2025 trial program',
    'Competitor is currently in negotiations but we have better pricing',
  ],
  documents: [
    { name: 'Product_Catalog_2025.pdf', uploadedAt: '2024-12-05', size: '2.4 MB' },
    { name: 'Pricing_Proposal_WholeFoods.pdf', uploadedAt: '2024-12-08', size: '890 KB' },
  ],
};

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'email',
    title: 'Sent Pricing Proposal',
    description: 'Sent revised pricing proposal with volume discounts for Q1 rollout',
    date: '2024-12-09T10:30:00',
    emailOpened: true,
    emailClicked: true,
  },
  {
    id: '2',
    type: 'call',
    title: 'Discovery Call',
    description: 'Discussed product requirements and distribution logistics for West Coast stores',
    date: '2024-12-08T14:00:00',
    outcome: 'Positive - moving to demo stage',
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Virtual Product Showcase',
    description: 'Presented full product line via video call with buyer team (3 attendees)',
    date: '2024-12-05T11:00:00',
  },
  {
    id: '4',
    type: 'email',
    title: 'Introduction Email',
    description: 'Initial outreach with company overview and product highlights',
    date: '2024-12-01T09:15:00',
    emailOpened: true,
    emailClicked: false,
  },
  {
    id: '5',
    type: 'note',
    title: 'Research Notes',
    description: 'Contact prefers email communication. Decision expected by mid-January. Key competitor is Daily Harvest.',
    date: '2024-11-28T16:00:00',
  },
  {
    id: '6',
    type: 'call',
    title: 'Cold Call',
    description: 'Initial outreach - spoke with assistant, scheduled callback',
    date: '2024-11-25T10:00:00',
    outcome: 'Callback scheduled',
  },
];

const ACTIVITY_TABS = ['All', 'Calls', 'Emails', 'Meetings', 'Notes'];

function formatCurrency(amount: number): string {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' at ' + 
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateString);
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'call': return <PhoneCall size={16} />;
    case 'email': return <Mail size={16} />;
    case 'meeting': return <Video size={16} />;
    case 'note': return <StickyNote size={16} />;
    default: return <MessageSquare size={16} />;
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case 'call': return '#22c55e';
    case 'email': return '#3b82f6';
    case 'meeting': return '#8b5cf6';
    case 'note': return '#f59e0b';
    default: return '#6b7280';
  }
}

export default function LeadDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [activeActivityTab, setActiveActivityTab] = useState('All');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

  const lead = MOCK_LEAD;
  
  const filteredActivities = MOCK_ACTIVITIES.filter(activity => {
    if (activeActivityTab === 'All') return true;
    if (activeActivityTab === 'Calls') return activity.type === 'call';
    if (activeActivityTab === 'Emails') return activity.type === 'email';
    if (activeActivityTab === 'Meetings') return activity.type === 'meeting';
    if (activeActivityTab === 'Notes') return activity.type === 'note';
    return true;
  });

  const isHotLead = lead.score >= 80;
  const today = new Date().toISOString().split('T')[0];
  const isNextActionToday = lead.nextAction.dateTime.startsWith(today);

  return (
    <SalesLayout title="">
      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <Link href="/sales/leads" style={styles.backButton}>
              <ArrowLeft size={20} />
            </Link>
            <h1 style={styles.companyName}>{lead.companyName}</h1>
          </div>
          <div style={styles.headerRight}>
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)} 
              style={styles.moreButton}
            >
              <MoreHorizontal size={20} />
            </button>
            {showMoreMenu && (
              <>
                <div style={styles.menuOverlay} onClick={() => setShowMoreMenu(false)} />
                <div style={styles.moreMenu}>
                  <button style={styles.menuItem}>Edit Lead</button>
                  <button style={styles.menuItem}>Transfer Lead</button>
                  <button style={styles.menuItem}>Mark as Lost</button>
                  <button style={{ ...styles.menuItem, color: '#ef4444' }}>Delete Lead</button>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={styles.scoreBanner}>
          <div style={styles.scoreSection}>
            {isHotLead && <span style={styles.fireEmoji}>🔥</span>}
            <span style={styles.scoreText}>
              Score: {lead.score} {isHotLead && '(Hot Lead!)'}
            </span>
          </div>
          <span style={styles.statusBadge}>{lead.status}</span>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <User size={18} color={NEON_GREEN} />
            Contact Information
          </h3>
          <div style={styles.cardContent}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Name</span>
              <span style={styles.infoValue}>{lead.contactName}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Title</span>
              <span style={styles.infoValue}>{lead.contactTitle}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Email</span>
              <a href={`mailto:${lead.email}`} style={styles.infoLink}>
                <Mail size={14} />
                {lead.email}
              </a>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Phone</span>
              <a href={`tel:${lead.phone}`} style={styles.infoLink}>
                <Phone size={14} />
                {lead.phone}
              </a>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Company</span>
              <span style={styles.infoValue}>
                <Building2 size={14} style={{ marginRight: 6 }} />
                {lead.companyName}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Location</span>
              <span style={styles.infoValue}>
                <MapPin size={14} style={{ marginRight: 6 }} />
                {lead.location.city}, {lead.location.state}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <DollarSign size={18} color={NEON_GREEN} />
            Deal Information
          </h3>
          <div style={styles.cardContent}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Estimated Value</span>
              <span style={styles.valueHighlight}>{formatCurrency(lead.estimatedValue)}/year</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Probability</span>
              <div style={styles.probabilityContainer}>
                <div style={styles.probabilityBar}>
                  <div style={{ ...styles.probabilityFill, width: `${lead.probability}%` }} />
                </div>
                <span style={styles.probabilityText}>{lead.probability}%</span>
              </div>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Expected Close</span>
              <span style={styles.infoValue}>
                <Calendar size={14} style={{ marginRight: 6 }} />
                {formatDate(lead.expectedCloseDate)}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Products Interested</span>
              <div style={styles.productsList}>
                {lead.productsInterested.map((product, idx) => (
                  <span key={idx} style={styles.productTag}>{product}</span>
                ))}
              </div>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Units/Month</span>
              <span style={styles.infoValue}>{lead.unitsPerMonth.toLocaleString()} units</span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <Target size={18} color={NEON_GREEN} />
            BANT Qualification
          </h3>
          <div style={styles.bantGrid}>
            <div style={styles.bantItem}>
              <span style={styles.bantLabel}>Budget</span>
              <span style={lead.bant.budget === 'confirmed' ? styles.bantConfirmed : styles.bantUnknown}>
                {lead.bant.budget === 'confirmed' ? (
                  <><CheckCircle2 size={16} /> Confirmed</>
                ) : (
                  <><XCircle size={16} /> Unknown</>
                )}
              </span>
            </div>
            <div style={styles.bantItem}>
              <span style={styles.bantLabel}>Authority</span>
              <span style={lead.bant.authority === 'decision_maker' ? styles.bantConfirmed : styles.bantWarning}>
                {lead.bant.authority === 'decision_maker' ? (
                  <><CheckCircle2 size={16} /> Decision Maker</>
                ) : (
                  <><AlertCircle size={16} /> Influencer</>
                )}
              </span>
            </div>
            <div style={styles.bantItem}>
              <span style={styles.bantLabel}>Need</span>
              <span style={lead.bant.need === 'urgent' ? styles.bantConfirmed : styles.bantWarning}>
                {lead.bant.need === 'urgent' ? (
                  <><CheckCircle2 size={16} /> Urgent</>
                ) : (
                  <><AlertCircle size={16} /> Exploring</>
                )}
              </span>
            </div>
            <div style={styles.bantItem}>
              <span style={styles.bantLabel}>Timeline</span>
              <span style={lead.bant.timeline === '30_days' ? styles.bantConfirmed : styles.bantWarning}>
                {lead.bant.timeline === '30_days' ? (
                  <><CheckCircle2 size={16} /> 30 Days</>
                ) : (
                  <><AlertCircle size={16} /> Long Term</>
                )}
              </span>
            </div>
          </div>
        </div>

        <div style={{ ...styles.card, ...(isNextActionToday ? styles.urgentCard : {}) }}>
          <h3 style={styles.cardTitle}>
            <Clock size={18} color={isNextActionToday ? '#ef4444' : NEON_GREEN} />
            Next Action
          </h3>
          <div style={styles.cardContent}>
            <div style={styles.nextActionHeader}>
              <span style={styles.nextActionType}>{lead.nextAction.type}</span>
              {isNextActionToday && <span style={styles.todayBadge}>TODAY</span>}
            </div>
            <div style={styles.nextActionTime}>
              <Calendar size={16} />
              {formatDateTime(lead.nextAction.dateTime)}
            </div>
            {lead.nextAction.location && (
              <>
                <div style={styles.nextActionLocation}>
                  <MapPin size={16} />
                  {lead.nextAction.location}
                </div>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(lead.nextAction.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.directionsButton}
                >
                  <Navigation size={16} />
                  Get Directions
                </a>
              </>
            )}
          </div>
        </div>

        <div style={styles.quickActions}>
          <a href={`tel:${lead.phone}`} style={styles.quickActionButton}>
            <Phone size={18} />
            <span>Call Now</span>
          </a>
          <a href={`mailto:${lead.email}`} style={styles.quickActionButton}>
            <Mail size={18} />
            <span>Send Email</span>
          </a>
          <button onClick={() => setShowAddNoteModal(true)} style={styles.quickActionButton}>
            <StickyNote size={18} />
            <span>Add Note</span>
          </button>
          <button style={styles.quickActionButton}>
            <Calendar size={18} />
            <span>Schedule</span>
          </button>
          <button style={styles.quickActionButton}>
            <Send size={18} />
            <span>Proposal</span>
          </button>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <MessageSquare size={18} color={NEON_GREEN} />
            Activity Timeline
          </h3>
          <div style={styles.activityTabs}>
            {ACTIVITY_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveActivityTab(tab)}
                style={{
                  ...styles.activityTab,
                  ...(activeActivityTab === tab ? styles.activityTabActive : {}),
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div style={styles.activityList}>
            {filteredActivities.map((activity, idx) => (
              <div key={activity.id} style={styles.activityItem}>
                <div style={styles.activityTimeline}>
                  <div style={{ 
                    ...styles.activityDot, 
                    backgroundColor: getActivityColor(activity.type),
                    boxShadow: `0 0 8px ${getActivityColor(activity.type)}50`,
                  }}>
                    {getActivityIcon(activity.type)}
                  </div>
                  {idx < filteredActivities.length - 1 && <div style={styles.activityLine} />}
                </div>
                <div style={styles.activityContent}>
                  <div style={styles.activityHeader}>
                    <span style={styles.activityTitle}>{activity.title}</span>
                    <span style={styles.activityDate}>{formatRelativeDate(activity.date)}</span>
                  </div>
                  <p style={styles.activityDescription}>{activity.description}</p>
                  {activity.outcome && (
                    <span style={styles.activityOutcome}>Outcome: {activity.outcome}</span>
                  )}
                  {activity.type === 'email' && (
                    <div style={styles.emailStats}>
                      {activity.emailOpened && (
                        <span style={styles.emailStat}>
                          <MailOpen size={12} /> Opened
                        </span>
                      )}
                      {activity.emailClicked && (
                        <span style={styles.emailStat}>
                          <MousePointer size={12} /> Clicked
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            <StickyNote size={18} color={NEON_GREEN} />
            Private Notes
          </h3>
          <textarea
            placeholder="Add a private note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            style={styles.notesTextarea}
          />
          <button style={styles.saveNoteButton} disabled={!newNote.trim()}>
            Save Note
          </button>
          <div style={styles.notesList}>
            {lead.notes.map((note, idx) => (
              <div key={idx} style={styles.noteItem}>
                <p style={styles.noteText}>{note}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitleRow}>
            <h3 style={styles.cardTitle}>
              <FileText size={18} color={NEON_GREEN} />
              Documents
            </h3>
            <button style={styles.uploadButton}>
              <Upload size={14} />
              Upload
            </button>
          </div>
          <div style={styles.documentsList}>
            {lead.documents.map((doc, idx) => (
              <div key={idx} style={styles.documentItem}>
                <div style={styles.documentIcon}>
                  <FileText size={20} />
                </div>
                <div style={styles.documentInfo}>
                  <span style={styles.documentName}>{doc.name}</span>
                  <span style={styles.documentMeta}>
                    {formatDate(doc.uploadedAt)} • {doc.size}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddNoteModal && (
        <>
          <div style={styles.modalOverlay} onClick={() => setShowAddNoteModal(false)} />
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Add Note</h3>
              <button onClick={() => setShowAddNoteModal(false)} style={styles.modalClose}>
                <X size={20} />
              </button>
            </div>
            <textarea
              placeholder="Enter your note..."
              style={styles.modalTextarea}
              autoFocus
            />
            <div style={styles.modalActions}>
              <button onClick={() => setShowAddNoteModal(false)} style={styles.modalCancelBtn}>
                Cancel
              </button>
              <button onClick={() => setShowAddNoteModal(false)} style={styles.modalSaveBtn}>
                Save Note
              </button>
            </div>
          </div>
        </>
      )}
    </SalesLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '0 16px 32px',
    maxWidth: 800,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 0',
    marginBottom: 8,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
  },
  headerRight: {
    position: 'relative' as const,
  },
  moreButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
  },
  menuOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  moreMenu: {
    position: 'absolute' as const,
    top: '100%',
    right: 0,
    marginTop: 8,
    backgroundColor: '#1a1a1a',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 8,
    zIndex: 101,
    minWidth: 160,
  },
  menuItem: {
    display: 'block',
    width: '100%',
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'left' as const,
    cursor: 'pointer',
    borderRadius: 8,
  },
  scoreBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 16,
    marginBottom: 16,
  },
  scoreSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  fireEmoji: {
    fontSize: 20,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#ef4444',
  },
  statusBadge: {
    padding: '6px 12px',
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    color: '#14b8a6',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
  },
  card: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  urgentCard: {
    border: '1px solid rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 16px 0',
  },
  cardTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '8px 0',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  infoLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'right' as const,
    flex: 1,
    justifyContent: 'flex-end',
  },
  infoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: NEON_GREEN,
    textDecoration: 'none',
    fontSize: 14,
  },
  valueHighlight: {
    fontSize: 18,
    fontWeight: 700,
    color: NEON_GREEN,
  },
  probabilityContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    justifyContent: 'flex-end',
  },
  probabilityBar: {
    width: 100,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  probabilityFill: {
    height: '100%',
    backgroundColor: NEON_GREEN,
    borderRadius: 3,
  },
  probabilityText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    minWidth: 40,
    textAlign: 'right' as const,
  },
  productsList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 6,
    justifyContent: 'flex-end',
    flex: 1,
  },
  productTag: {
    padding: '4px 10px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 500,
  },
  bantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
  },
  bantItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
  },
  bantLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  bantConfirmed: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 500,
    color: '#22c55e',
  },
  bantWarning: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 500,
    color: '#f59e0b',
  },
  bantUnknown: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 500,
    color: '#ef4444',
  },
  nextActionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  nextActionType: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  todayBadge: {
    padding: '4px 10px',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  nextActionTime: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  nextActionLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  directionsButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
    border: `1px solid ${NEON_GREEN}30`,
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 8,
    marginBottom: 16,
  },
  quickActionButton: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 6,
    padding: '14px 8px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: 500,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  activityTabs: {
    display: 'flex',
    gap: 4,
    marginBottom: 16,
    overflowX: 'auto' as const,
    paddingBottom: 4,
  },
  activityTab: {
    padding: '8px 14px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 20,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  },
  activityTabActive: {
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  activityItem: {
    display: 'flex',
    gap: 12,
  },
  activityTimeline: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    width: 36,
    flexShrink: 0,
  },
  activityDot: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    flexShrink: 0,
  },
  activityLine: {
    width: 2,
    flex: 1,
    backgroundColor: CARD_BORDER,
    minHeight: 20,
  },
  activityContent: {
    flex: 1,
    paddingBottom: 20,
  },
  activityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  activityDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  activityDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    margin: '4px 0 0 0',
    lineHeight: 1.5,
  },
  activityOutcome: {
    display: 'inline-block',
    marginTop: 8,
    padding: '4px 10px',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: '#22c55e',
    borderRadius: 12,
    fontSize: 12,
  },
  emailStats: {
    display: 'flex',
    gap: 12,
    marginTop: 8,
  },
  emailStat: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  notesTextarea: {
    width: '100%',
    minHeight: 80,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 10,
    color: '#FFFFFF',
    fontSize: 14,
    resize: 'vertical' as const,
    outline: 'none',
    marginBottom: 12,
  },
  saveNoteButton: {
    padding: '10px 20px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 16,
  },
  notesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  noteItem: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    borderLeft: `3px solid ${NEON_GREEN}`,
  },
  noteText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    margin: 0,
    lineHeight: 1.5,
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    border: `1px solid ${NEON_GREEN}30`,
    color: NEON_GREEN,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },
  documentsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  documentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: NEON_GREEN,
  },
  documentInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  documentMeta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
  },
  modal: {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#1a1a1a',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 24,
    zIndex: 1001,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  modalClose: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    padding: 4,
  },
  modalTextarea: {
    width: '100%',
    minHeight: 120,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 10,
    color: '#FFFFFF',
    fontSize: 14,
    resize: 'vertical' as const,
    outline: 'none',
    marginBottom: 20,
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    color: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  modalSaveBtn: {
    padding: '10px 20px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
