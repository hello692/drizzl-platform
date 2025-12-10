import React, { useState } from 'react';
import SalesLayout from '../../components/sales/SalesLayout';
import {
  Plus,
  Search,
  Phone,
  Mail,
  Calendar,
  Eye,
  ChevronDown,
  X,
  Building2,
  User,
  DollarSign,
  Clock,
  Filter,
  Flame,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Demo Scheduled' | 'Proposal Sent' | 'Negotiation';

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactTitle: string;
  email: string;
  phone: string;
  score: number;
  status: LeadStatus;
  estimatedValue: number;
  expectedCloseDate: string;
  nextAction: string;
  source: string;
}

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    companyName: 'Whole Foods Market',
    contactName: 'Sarah Johnson',
    contactTitle: 'Procurement Director',
    email: 'sjohnson@wholefoods.com',
    phone: '+1 (512) 477-4455',
    score: 92,
    status: 'Demo Scheduled',
    estimatedValue: 85000,
    expectedCloseDate: '2025-01-15',
    nextAction: 'Prepare demo presentation for Tuesday',
    source: 'Trade Show',
  },
  {
    id: '2',
    companyName: 'Target Corporation',
    contactName: 'Michael Chen',
    contactTitle: 'Category Manager',
    email: 'mchen@target.com',
    phone: '+1 (612) 304-6073',
    score: 88,
    status: 'Proposal Sent',
    estimatedValue: 120000,
    expectedCloseDate: '2025-01-20',
    nextAction: 'Follow up on proposal review',
    source: 'Referral',
  },
  {
    id: '3',
    companyName: 'Costco Wholesale',
    contactName: 'Emily Rodriguez',
    contactTitle: 'Buying Manager',
    email: 'erodriguez@costco.com',
    phone: '+1 (425) 313-8100',
    score: 85,
    status: 'Qualified',
    estimatedValue: 200000,
    expectedCloseDate: '2025-02-01',
    nextAction: 'Schedule discovery call',
    source: 'Cold Call',
  },
  {
    id: '4',
    companyName: "Trader Joe's",
    contactName: 'David Williams',
    contactTitle: 'Regional Buyer',
    email: 'dwilliams@traderjoes.com',
    phone: '+1 (626) 599-3700',
    score: 78,
    status: 'Contacted',
    estimatedValue: 65000,
    expectedCloseDate: '2025-02-15',
    nextAction: 'Send product samples',
    source: 'LinkedIn',
  },
  {
    id: '5',
    companyName: 'Sprouts Farmers Market',
    contactName: 'Jessica Martinez',
    contactTitle: 'Purchasing Coordinator',
    email: 'jmartinez@sprouts.com',
    phone: '+1 (480) 814-8016',
    score: 75,
    status: 'New',
    estimatedValue: 45000,
    expectedCloseDate: '2025-02-28',
    nextAction: 'Initial outreach call',
    source: 'Website',
  },
  {
    id: '6',
    companyName: 'Safeway',
    contactName: 'Robert Brown',
    contactTitle: 'VP Merchandising',
    email: 'rbrown@safeway.com',
    phone: '+1 (925) 467-3000',
    score: 70,
    status: 'Negotiation',
    estimatedValue: 95000,
    expectedCloseDate: '2025-01-10',
    nextAction: 'Final contract review',
    source: 'Trade Show',
  },
  {
    id: '7',
    companyName: 'Kroger',
    contactName: 'Amanda Taylor',
    contactTitle: 'Category Director',
    email: 'ataylor@kroger.com',
    phone: '+1 (513) 762-4000',
    score: 65,
    status: 'Demo Scheduled',
    estimatedValue: 110000,
    expectedCloseDate: '2025-01-25',
    nextAction: 'Confirm demo attendees',
    source: 'Referral',
  },
  {
    id: '8',
    companyName: 'Natural Grocers',
    contactName: 'James Wilson',
    contactTitle: 'Buyer',
    email: 'jwilson@naturalgrocers.com',
    phone: '+1 (303) 986-4600',
    score: 60,
    status: 'New',
    estimatedValue: 35000,
    expectedCloseDate: '2025-03-01',
    nextAction: 'Research company background',
    source: 'Website',
  },
];

const FILTER_TABS = ['All', 'My Leads', 'New', 'Hot 🔥', 'Closing Soon'];
const SORT_OPTIONS = ['Lead Score', 'Recent', 'Value'];
const STATUS_COLORS: Record<LeadStatus, string> = {
  'New': '#6366f1',
  'Contacted': '#8b5cf6',
  'Qualified': '#06b6d4',
  'Demo Scheduled': '#14b8a6',
  'Proposal Sent': '#f59e0b',
  'Negotiation': '#ec4899',
};
const SOURCES = ['Website', 'Referral', 'Cold Call', 'Trade Show', 'LinkedIn'];
const BUSINESS_TYPES = ['Grocery Chain', 'Health Food Store', 'Convenience Store', 'Wholesale Distributor', 'Other'];

function formatCurrency(amount: number): string {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function SalesLeadsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [sortBy, setSortBy] = useState('Lead Score');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    source: '',
    estimatedValue: '',
    notes: '',
  });

  const filteredLeads = MOCK_LEADS.filter((lead) => {
    const matchesSearch = searchQuery === '' ||
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTab = true;
    if (activeTab === 'New') matchesTab = lead.status === 'New';
    if (activeTab === 'Hot 🔥') matchesTab = lead.score > 80;
    if (activeTab === 'Closing Soon') {
      const closeDate = new Date(lead.expectedCloseDate);
      const now = new Date();
      const diffDays = Math.ceil((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      matchesTab = diffDays <= 14 && diffDays >= 0;
    }

    return matchesSearch && matchesTab;
  }).sort((a, b) => {
    if (sortBy === 'Lead Score') return b.score - a.score;
    if (sortBy === 'Value') return b.estimatedValue - a.estimatedValue;
    return 0;
  });

  const handleAddLead = () => {
    console.log('Adding lead:', newLead);
    setShowAddModal(false);
    setNewLead({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      businessType: '',
      source: '',
      estimatedValue: '',
      notes: '',
    });
  };

  return (
    <SalesLayout title="Leads">
      <div style={styles.page}>
        <div style={styles.searchContainer}>
          <div style={styles.searchInputWrapper}>
            <Search size={18} color="rgba(255,255,255,0.5)" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        <div style={styles.filtersContainer}>
          <div style={styles.tabsWrapper}>
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab ? styles.tabActive : {}),
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={styles.sortContainer}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              style={styles.sortButton}
            >
              <Filter size={14} />
              <span>{sortBy}</span>
              <ChevronDown size={14} style={{ transform: showSortDropdown ? 'rotate(180deg)' : 'none' }} />
            </button>
            {showSortDropdown && (
              <>
                <div style={styles.dropdownOverlay} onClick={() => setShowSortDropdown(false)} />
                <div style={styles.sortDropdown}>
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setShowSortDropdown(false);
                      }}
                      style={{
                        ...styles.sortOption,
                        backgroundColor: sortBy === option ? 'rgba(0, 255, 133, 0.1)' : 'transparent',
                        color: sortBy === option ? NEON_GREEN : 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div style={styles.leadsList}>
          {filteredLeads.map((lead) => (
            <div key={lead.id} style={styles.leadCard}>
              <div style={styles.cardHeader}>
                <div style={styles.companyRow}>
                  {lead.score > 80 && (
                    <span style={styles.hotIndicator}>🔥</span>
                  )}
                  <h3 style={styles.companyName}>{lead.companyName.toUpperCase()}</h3>
                </div>
                <div style={styles.scoreBadge}>
                  Score: {lead.score}
                </div>
              </div>

              <div style={styles.contactInfo}>
                <div style={styles.contactName}>
                  <User size={14} color="rgba(255,255,255,0.5)" />
                  <span>{lead.contactName}</span>
                  <span style={styles.contactTitle}>• {lead.contactTitle}</span>
                </div>
                <div style={styles.contactDetails}>
                  <a href={`mailto:${lead.email}`} style={styles.contactLink}>
                    <Mail size={14} />
                    <span>{lead.email}</span>
                  </a>
                  <a href={`tel:${lead.phone}`} style={styles.contactLink}>
                    <Phone size={14} />
                    <span>{lead.phone}</span>
                  </a>
                </div>
              </div>

              <div style={styles.cardMeta}>
                <span style={{ ...styles.statusBadge, backgroundColor: `${STATUS_COLORS[lead.status]}20`, color: STATUS_COLORS[lead.status] }}>
                  {lead.status}
                </span>
                <span style={styles.metaItem}>
                  <DollarSign size={14} />
                  {formatCurrency(lead.estimatedValue)} annual
                </span>
                <span style={styles.metaItem}>
                  <Clock size={14} />
                  Close: {formatDate(lead.expectedCloseDate)}
                </span>
              </div>

              <div style={styles.nextAction}>
                <span style={styles.nextActionLabel}>Next:</span>
                <span style={styles.nextActionText}>{lead.nextAction}</span>
              </div>

              <div style={styles.cardActions}>
                <a href={`tel:${lead.phone}`} style={styles.actionButton}>
                  <Phone size={16} />
                  <span>Call</span>
                </a>
                <a href={`mailto:${lead.email}`} style={styles.actionButton}>
                  <Mail size={16} />
                  <span>Email</span>
                </a>
                <button style={styles.actionButton}>
                  <Calendar size={16} />
                  <span>Schedule</span>
                </button>
                <button style={{ ...styles.actionButton, ...styles.actionButtonPrimary }}>
                  <Eye size={16} />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={styles.fab}
          aria-label="Add Lead"
        >
          <Plus size={24} />
        </button>

        {showAddModal && (
          <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Add New Lead</h2>
                <button onClick={() => setShowAddModal(false)} style={styles.modalClose}>
                  <X size={20} />
                </button>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Company Name *</label>
                  <div style={styles.inputWrapper}>
                    <Building2 size={16} color="rgba(255,255,255,0.5)" />
                    <input
                      type="text"
                      value={newLead.companyName}
                      onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
                      placeholder="Enter company name"
                      style={styles.formInput}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Contact Name *</label>
                  <div style={styles.inputWrapper}>
                    <User size={16} color="rgba(255,255,255,0.5)" />
                    <input
                      type="text"
                      value={newLead.contactName}
                      onChange={(e) => setNewLead({ ...newLead, contactName: e.target.value })}
                      placeholder="Enter contact name"
                      style={styles.formInput}
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Email</label>
                    <div style={styles.inputWrapper}>
                      <Mail size={16} color="rgba(255,255,255,0.5)" />
                      <input
                        type="email"
                        value={newLead.email}
                        onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                        placeholder="email@company.com"
                        style={styles.formInput}
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Phone</label>
                    <div style={styles.inputWrapper}>
                      <Phone size={16} color="rgba(255,255,255,0.5)" />
                      <input
                        type="tel"
                        value={newLead.phone}
                        onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        style={styles.formInput}
                      />
                    </div>
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Business Type</label>
                    <select
                      value={newLead.businessType}
                      onChange={(e) => setNewLead({ ...newLead, businessType: e.target.value })}
                      style={styles.formSelect}
                    >
                      <option value="">Select type</option>
                      {BUSINESS_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Source</label>
                    <select
                      value={newLead.source}
                      onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                      style={styles.formSelect}
                    >
                      <option value="">Select source</option>
                      {SOURCES.map((source) => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Estimated Annual Value</label>
                  <div style={styles.inputWrapper}>
                    <DollarSign size={16} color="rgba(255,255,255,0.5)" />
                    <input
                      type="text"
                      value={newLead.estimatedValue}
                      onChange={(e) => setNewLead({ ...newLead, estimatedValue: e.target.value })}
                      placeholder="50000"
                      style={styles.formInput}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Notes</label>
                  <textarea
                    value={newLead.notes}
                    onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                    placeholder="Add any relevant notes..."
                    style={styles.formTextarea}
                    rows={3}
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button onClick={() => setShowAddModal(false)} style={styles.cancelButton}>
                  Cancel
                </button>
                <button onClick={handleAddLead} style={styles.saveButton}>
                  Save Lead
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .sales-lead-card:hover {
          border-color: rgba(0, 255, 133, 0.3) !important;
        }
      `}</style>
    </SalesLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 800,
    margin: '0 auto',
    paddingBottom: 'clamp(80px, 20vw, 100px)',
    position: 'relative',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: '14px 16px',
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#FFFFFF',
    fontSize: 16,
  },
  filtersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20,
  },
  tabsWrapper: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: 4,
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
  },
  tab: {
    padding: '12px 18px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 24,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    minHeight: 44,
  },
  tabActive: {
    backgroundColor: `${NEON_GREEN}15`,
    borderColor: NEON_GREEN,
    color: NEON_GREEN,
  },
  sortContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  sortButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    cursor: 'pointer',
    minHeight: 44,
  },
  dropdownOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
  sortDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 4,
    backgroundColor: '#1a1a1a',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 100,
    minWidth: 140,
  },
  sortOption: {
    display: 'block',
    width: '100%',
    padding: '10px 14px',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  leadsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  leadCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 16,
    transition: 'border-color 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  hotIndicator: {
    fontSize: 16,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
    letterSpacing: 0.5,
  },
  scoreBadge: {
    backgroundColor: `${NEON_GREEN}20`,
    color: NEON_GREEN,
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 600,
  },
  contactInfo: {
    marginBottom: 12,
  },
  contactName: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 8,
  },
  contactTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 400,
  },
  contactDetails: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  cardMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  nextAction: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    padding: '10px 12px',
    marginBottom: 12,
  },
  nextActionLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginRight: 6,
  },
  nextActionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  cardActions: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '10px 14px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
    minHeight: 44,
  },
  actionButtonPrimary: {
    backgroundColor: `${NEON_GREEN}15`,
    borderColor: `${NEON_GREEN}50`,
    color: NEON_GREEN,
  },
  fab: {
    position: 'fixed',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: '50%',
    backgroundColor: NEON_GREEN,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: `0 4px 20px ${NEON_GREEN}40`,
    color: '#000000',
    zIndex: 50,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#0a0a0a',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90vh',
    overflow: 'auto',
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
    backgroundColor: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
    flex: 1,
  },
  formRow: {
    display: 'flex',
    gap: 12,
  },
  formLabel: {
    display: 'block',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 8,
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    padding: '12px 14px',
    minHeight: 48,
  },
  formInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#FFFFFF',
    fontSize: 16,
  },
  formSelect: {
    width: '100%',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    padding: '14px',
    color: '#FFFFFF',
    fontSize: 16,
    outline: 'none',
    cursor: 'pointer',
    minHeight: 48,
  },
  formTextarea: {
    width: '100%',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    padding: '16px 20px',
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  cancelButton: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    minHeight: 44,
  },
  saveButton: {
    padding: '12px 20px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 8,
    color: '#000000',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: 44,
  },
};
