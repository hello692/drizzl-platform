import React, { useState, useEffect, useCallback } from 'react';

interface PartnerProfile {
  id: string;
  partner_code: string;
  qr_code_data: string;
  company_name: string;
  store_name?: string;
  contact_name: string;
  contact_email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  status: string;
  account_manager?: {
    id: string;
    name: string;
    email: string;
  };
  total_revenue_cents: number;
  total_orders: number;
  contract_status: string;
  contract_expiry_date?: string;
  license_verified: boolean;
  compliance_status: string;
  risk_level?: string;
  latest_score?: number;
  notes?: string;
  risk_flags: RiskFlag[];
  created_at: string;
  updated_at: string;
}

interface RiskFlag {
  id: string;
  type: string;
  description: string;
  severity: string;
  created_at: string;
}

interface PartnerOrder {
  id: string;
  order_number?: string;
  total_cents: number;
  status: string;
  created_at: string;
}

interface PartnerInvoice {
  id: string;
  invoice_number: string;
  amount_cents: number;
  total_cents: number;
  status: string;
  due_date?: string;
  paid_at?: string;
  created_at: string;
}

interface PartnerDelivery {
  id: string;
  tracking_number?: string;
  status: string;
  driver_name?: string;
  estimated_arrival?: string;
  actual_arrival?: string;
  proof_of_delivery_url?: string;
  created_at: string;
}

interface PartnerAgreement {
  id: string;
  envelope_id: string;
  template_id?: string;
  status: string;
  signed_at?: string;
  created_at: string;
}

interface PartnerDocument {
  id: string;
  document_type: string;
  document_name: string;
  status: string;
  expiry_date?: string;
  created_at: string;
}

interface PartnerStats {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  openTickets: number;
  pendingInvoices: number;
  upcomingDeliveries: number;
}

interface AccountManager {
  id: string;
  name: string;
  email: string;
}

interface PartnerProfileModalProps {
  partnerId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

type TabId = 'overview' | 'orders' | 'invoices' | 'deliveries' | 'agreements' | 'documents' | 'notes';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
      </svg>
    ),
  },
  {
    id: 'invoices',
    label: 'Invoices',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
  {
    id: 'deliveries',
    label: 'Deliveries',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 3v5h-7V8zM1 12h15" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    id: 'agreements',
    label: 'Agreements',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
    ),
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
];

export default function PartnerProfileModal({
  partnerId,
  isOpen,
  onClose,
  onUpdate,
}: PartnerProfileModalProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [orders, setOrders] = useState<PartnerOrder[]>([]);
  const [invoices, setInvoices] = useState<PartnerInvoice[]>([]);
  const [deliveries, setDeliveries] = useState<PartnerDelivery[]>([]);
  const [agreements, setAgreements] = useState<PartnerAgreement[]>([]);
  const [documents, setDocuments] = useState<PartnerDocument[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [notes, setNotes] = useState('');
  const [notesChanged, setNotesChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddFlag, setShowAddFlag] = useState(false);
  const [newFlag, setNewFlag] = useState({ type: '', description: '', severity: 'low' });
  const [managers, setManagers] = useState<AccountManager[]>([]);
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!partnerId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/partners/profile/${partnerId}?include=orders,invoices,deliveries,tickets,documents,agreements,stats`
      );
      const data = await response.json();

      if (data.profile) {
        setProfile(data.profile);
        setNotes(data.profile.notes || '');
      }
      if (data.stats) setStats(data.stats);
      if (data.orders) setOrders(data.orders);
      if (data.invoices) setInvoices(data.invoices);
      if (data.deliveries) setDeliveries(data.deliveries);
      if (data.agreements) setAgreements(data.agreements);
      if (data.documents) setDocuments(data.documents);
    } catch (error) {
      console.error('[PartnerProfile] Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  useEffect(() => {
    if (isOpen && partnerId) {
      loadProfile();
      setActiveTab('overview');
    }
  }, [isOpen, partnerId, loadProfile]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSaveNotes = async () => {
    if (!profile || !notesChanged) return;

    setSaving(true);
    try {
      await fetch(`/api/admin/partners/profile/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-notes', notes }),
      });
      setNotesChanged(false);
      onUpdate?.();
    } catch (error) {
      console.error('[PartnerProfile] Error saving notes:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddRiskFlag = async () => {
    if (!profile || !newFlag.type || !newFlag.description) return;

    setSaving(true);
    try {
      await fetch(`/api/admin/partners/profile/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-risk-flag', flag: newFlag }),
      });
      setShowAddFlag(false);
      setNewFlag({ type: '', description: '', severity: 'low' });
      loadProfile();
      onUpdate?.();
    } catch (error) {
      console.error('[PartnerProfile] Error adding risk flag:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveRiskFlag = async (flagId: string) => {
    if (!profile) return;

    setSaving(true);
    try {
      await fetch(`/api/admin/partners/profile/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove-risk-flag', flagId }),
      });
      loadProfile();
      onUpdate?.();
    } catch (error) {
      console.error('[PartnerProfile] Error removing risk flag:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAssignManager = async (managerId: string) => {
    if (!profile) return;

    setSaving(true);
    try {
      await fetch(`/api/admin/partners/profile/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assign-manager', managerId }),
      });
      setShowManagerDropdown(false);
      loadProfile();
      onUpdate?.();
    } catch (error) {
      console.error('[PartnerProfile] Error assigning manager:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'paid':
      case 'completed':
      case 'delivered':
      case 'signed':
      case 'verified':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
      case 'pending':
      case 'processing':
      case 'in_transit':
      case 'sent':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
      case 'rejected':
      case 'overdue':
      case 'failed':
      case 'expired':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.15)', text: '#9ca3af', border: 'rgba(107, 114, 128, 0.3)' };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'critical':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
      case 'medium':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
      default:
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner} />
            <span style={styles.loadingText}>Loading partner profile...</span>
          </div>
        ) : profile ? (
          <>
            <div style={styles.header}>
              <div style={styles.headerMain}>
                <div style={styles.qrCodeContainer}>
                  {profile.qr_code_data ? (
                    <div style={styles.qrCode}>
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="4" height="4" />
                        <path d="M18 14h3v3M21 21h-3v-3M18 18h3v3" />
                      </svg>
                    </div>
                  ) : (
                    <div style={styles.qrPlaceholder}>No QR</div>
                  )}
                </div>
                <div style={styles.headerInfo}>
                  <div style={styles.partnerCode}>{profile.partner_code || 'No Code'}</div>
                  <h2 style={styles.companyName}>{profile.company_name}</h2>
                  {profile.store_name && (
                    <div style={styles.storeName}>{profile.store_name}</div>
                  )}
                  <div style={styles.statusRow}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...getStatusColor(profile.status),
                      }}
                    >
                      {profile.status}
                    </span>
                    {profile.risk_level && (
                      <span
                        style={{
                          ...styles.riskBadge,
                          ...getSeverityColor(profile.risk_level),
                        }}
                      >
                        {profile.risk_level} Risk
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {stats && (
                <div style={styles.statsGrid}>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.totalOrders}</div>
                    <div style={styles.statLabel}>Total Orders</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{formatCurrency(stats.totalRevenue)}</div>
                    <div style={styles.statLabel}>Revenue</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.openTickets}</div>
                    <div style={styles.statLabel}>Open Tickets</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.pendingInvoices}</div>
                    <div style={styles.statLabel}>Pending Invoices</div>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.tabsContainer}>
              <div style={styles.tabs}>
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      ...styles.tab,
                      ...(activeTab === tab.id ? styles.tabActive : {}),
                    }}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.content}>
              {activeTab === 'overview' && (
                <div style={styles.overviewGrid}>
                  <div style={styles.infoSection}>
                    <h3 style={styles.sectionTitle}>Contact Information</h3>
                    <div style={styles.infoGrid}>
                      <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Contact Name</span>
                        <span style={styles.infoValue}>{profile.contact_name || '—'}</span>
                      </div>
                      <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Email</span>
                        <span style={styles.infoValue}>{profile.contact_email || '—'}</span>
                      </div>
                      <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Phone</span>
                        <span style={styles.infoValue}>{profile.phone || '—'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.infoSection}>
                    <h3 style={styles.sectionTitle}>Address</h3>
                    <div style={styles.addressBlock}>
                      {profile.address && <div>{profile.address}</div>}
                      {(profile.city || profile.state || profile.zip) && (
                        <div>
                          {profile.city}
                          {profile.city && profile.state ? ', ' : ''}
                          {profile.state} {profile.zip}
                        </div>
                      )}
                      {profile.country && <div>{profile.country}</div>}
                      {!profile.address && !profile.city && !profile.state && (
                        <div style={styles.noData}>No address on file</div>
                      )}
                    </div>
                  </div>

                  <div style={styles.infoSection}>
                    <div style={styles.sectionHeader}>
                      <h3 style={styles.sectionTitle}>Account Manager</h3>
                      <button
                        onClick={() => setShowManagerDropdown(!showManagerDropdown)}
                        style={styles.assignButton}
                      >
                        {profile.account_manager ? 'Change' : 'Assign'}
                      </button>
                    </div>
                    {profile.account_manager ? (
                      <div style={styles.managerCard}>
                        <div style={styles.managerAvatar}>
                          {profile.account_manager.name.charAt(0)}
                        </div>
                        <div style={styles.managerInfo}>
                          <div style={styles.managerName}>{profile.account_manager.name}</div>
                          <div style={styles.managerEmail}>{profile.account_manager.email}</div>
                        </div>
                      </div>
                    ) : (
                      <div style={styles.noData}>No account manager assigned</div>
                    )}
                    {showManagerDropdown && (
                      <div style={styles.managerDropdown}>
                        <div style={styles.dropdownOption} onClick={() => handleAssignManager('')}>
                          <span>Unassign Manager</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={styles.infoSection}>
                    <div style={styles.sectionHeader}>
                      <h3 style={styles.sectionTitle}>Risk Flags</h3>
                      <button onClick={() => setShowAddFlag(!showAddFlag)} style={styles.addButton}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Flag
                      </button>
                    </div>
                    {showAddFlag && (
                      <div style={styles.addFlagForm}>
                        <input
                          type="text"
                          placeholder="Flag type (e.g., Payment Issue)"
                          value={newFlag.type}
                          onChange={(e) => setNewFlag({ ...newFlag, type: e.target.value })}
                          style={styles.flagInput}
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={newFlag.description}
                          onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                          style={styles.flagInput}
                        />
                        <select
                          value={newFlag.severity}
                          onChange={(e) => setNewFlag({ ...newFlag, severity: e.target.value })}
                          style={styles.flagSelect}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <div style={styles.flagActions}>
                          <button onClick={() => setShowAddFlag(false)} style={styles.cancelButton}>
                            Cancel
                          </button>
                          <button onClick={handleAddRiskFlag} style={styles.saveButton} disabled={saving}>
                            {saving ? 'Adding...' : 'Add Flag'}
                          </button>
                        </div>
                      </div>
                    )}
                    {profile.risk_flags.length > 0 ? (
                      <div style={styles.flagsList}>
                        {profile.risk_flags.map((flag) => {
                          const colors = getSeverityColor(flag.severity);
                          return (
                            <div key={flag.id} style={styles.flagItem}>
                              <div style={styles.flagContent}>
                                <span
                                  style={{
                                    ...styles.flagSeverity,
                                    background: colors.bg,
                                    color: colors.text,
                                    border: `1px solid ${colors.border}`,
                                  }}
                                >
                                  {flag.severity}
                                </span>
                                <div style={styles.flagText}>
                                  <strong>{flag.type}</strong>
                                  <span>{flag.description}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveRiskFlag(flag.id)}
                                style={styles.removeFlagButton}
                                disabled={saving}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={styles.noData}>No risk flags</div>
                    )}
                  </div>

                  <div style={styles.infoSection}>
                    <h3 style={styles.sectionTitle}>Compliance Status</h3>
                    <div style={styles.complianceGrid}>
                      <div style={styles.complianceItem}>
                        <span style={styles.complianceLabel}>License Verified</span>
                        <span
                          style={{
                            ...styles.complianceBadge,
                            ...(profile.license_verified
                              ? getStatusColor('verified')
                              : getStatusColor('pending')),
                          }}
                        >
                          {profile.license_verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <div style={styles.complianceItem}>
                        <span style={styles.complianceLabel}>Contract Status</span>
                        <span
                          style={{
                            ...styles.complianceBadge,
                            ...getStatusColor(profile.contract_status),
                          }}
                        >
                          {profile.contract_status}
                        </span>
                      </div>
                      <div style={styles.complianceItem}>
                        <span style={styles.complianceLabel}>Compliance</span>
                        <span
                          style={{
                            ...styles.complianceBadge,
                            ...getStatusColor(profile.compliance_status),
                          }}
                        >
                          {profile.compliance_status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div style={styles.listContainer}>
                  {orders.length > 0 ? (
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Order #</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Amount</th>
                            <th style={styles.th}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => {
                            const colors = getStatusColor(order.status);
                            return (
                              <tr key={order.id} style={styles.tr}>
                                <td style={styles.td}>{order.order_number || order.id.slice(0, 8)}</td>
                                <td style={styles.td}>{formatDate(order.created_at)}</td>
                                <td style={styles.td}>{formatCurrency(order.total_cents)}</td>
                                <td style={styles.td}>
                                  <span
                                    style={{
                                      ...styles.tableBadge,
                                      background: colors.bg,
                                      color: colors.text,
                                      border: `1px solid ${colors.border}`,
                                    }}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={styles.emptyState}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                        <rect x="9" y="3" width="6" height="4" rx="1" />
                      </svg>
                      <span>No orders yet</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'invoices' && (
                <div style={styles.listContainer}>
                  {invoices.length > 0 ? (
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Invoice #</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Due Date</th>
                            <th style={styles.th}>Amount</th>
                            <th style={styles.th}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.map((invoice) => {
                            const colors = getStatusColor(invoice.status);
                            return (
                              <tr key={invoice.id} style={styles.tr}>
                                <td style={styles.td}>{invoice.invoice_number}</td>
                                <td style={styles.td}>{formatDate(invoice.created_at)}</td>
                                <td style={styles.td}>{invoice.due_date ? formatDate(invoice.due_date) : '—'}</td>
                                <td style={styles.td}>{formatCurrency(invoice.total_cents || invoice.amount_cents)}</td>
                                <td style={styles.td}>
                                  <span
                                    style={{
                                      ...styles.tableBadge,
                                      background: colors.bg,
                                      color: colors.text,
                                      border: `1px solid ${colors.border}`,
                                    }}
                                  >
                                    {invoice.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={styles.emptyState}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                      <span>No invoices yet</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'deliveries' && (
                <div style={styles.listContainer}>
                  {deliveries.length > 0 ? (
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Tracking #</th>
                            <th style={styles.th}>Driver</th>
                            <th style={styles.th}>ETA</th>
                            <th style={styles.th}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deliveries.map((delivery) => {
                            const colors = getStatusColor(delivery.status);
                            return (
                              <tr key={delivery.id} style={styles.tr}>
                                <td style={styles.td}>{delivery.tracking_number || '—'}</td>
                                <td style={styles.td}>{delivery.driver_name || '—'}</td>
                                <td style={styles.td}>
                                  {delivery.estimated_arrival ? formatDate(delivery.estimated_arrival) : '—'}
                                </td>
                                <td style={styles.td}>
                                  <span
                                    style={{
                                      ...styles.tableBadge,
                                      background: colors.bg,
                                      color: colors.text,
                                      border: `1px solid ${colors.border}`,
                                    }}
                                  >
                                    {delivery.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={styles.emptyState}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                        <rect x="1" y="3" width="15" height="13" rx="2" />
                        <path d="M16 8h4l3 3v5h-7V8z" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                      <span>No deliveries yet</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'agreements' && (
                <div style={styles.listContainer}>
                  {agreements.length > 0 ? (
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Envelope ID</th>
                            <th style={styles.th}>Created</th>
                            <th style={styles.th}>Signed</th>
                            <th style={styles.th}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {agreements.map((agreement) => {
                            const colors = getStatusColor(agreement.status);
                            return (
                              <tr key={agreement.id} style={styles.tr}>
                                <td style={styles.td}>{agreement.envelope_id?.slice(0, 12) || '—'}...</td>
                                <td style={styles.td}>{formatDate(agreement.created_at)}</td>
                                <td style={styles.td}>
                                  {agreement.signed_at ? formatDate(agreement.signed_at) : '—'}
                                </td>
                                <td style={styles.td}>
                                  <span
                                    style={{
                                      ...styles.tableBadge,
                                      background: colors.bg,
                                      color: colors.text,
                                      border: `1px solid ${colors.border}`,
                                    }}
                                  >
                                    {agreement.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={styles.emptyState}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      <span>No agreements yet</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'documents' && (
                <div style={styles.listContainer}>
                  {documents.length > 0 ? (
                    <div style={styles.documentsGrid}>
                      {documents.map((doc) => {
                        const colors = getStatusColor(doc.status);
                        return (
                          <div key={doc.id} style={styles.documentCard}>
                            <div style={styles.documentIcon}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <path d="M14 2v6h6" />
                              </svg>
                            </div>
                            <div style={styles.documentInfo}>
                              <div style={styles.documentName}>{doc.document_name}</div>
                              <div style={styles.documentType}>{doc.document_type}</div>
                              {doc.expiry_date && (
                                <div style={styles.documentExpiry}>Expires: {formatDate(doc.expiry_date)}</div>
                              )}
                            </div>
                            <span
                              style={{
                                ...styles.documentStatus,
                                background: colors.bg,
                                color: colors.text,
                                border: `1px solid ${colors.border}`,
                              }}
                            >
                              {doc.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={styles.emptyState}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                      <span>No documents yet</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div style={styles.notesContainer}>
                  <textarea
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      setNotesChanged(true);
                    }}
                    placeholder="Add notes about this partner..."
                    style={styles.notesTextarea}
                  />
                  <div style={styles.notesActions}>
                    <span style={styles.notesHint}>
                      {notesChanged ? 'Unsaved changes' : 'Notes are saved to the partner profile'}
                    </span>
                    <button
                      onClick={handleSaveNotes}
                      disabled={!notesChanged || saving}
                      style={{
                        ...styles.saveNotesButton,
                        opacity: !notesChanged || saving ? 0.5 : 1,
                      }}
                    >
                      {saving ? 'Saving...' : 'Save Notes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={styles.errorState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <span>Partner not found</span>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes modalSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3000,
    padding: '20px',
  },
  modal: {
    background: 'linear-gradient(180deg, rgba(30, 30, 45, 0.98) 0%, rgba(20, 20, 35, 0.98) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: '0 40px 120px rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '12px',
    padding: '10px',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    zIndex: 10,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 40px',
    gap: '20px',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: '#667eea',
    borderRadius: '50%',
    animation: 'modalSpin 0.8s linear infinite',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
  },
  errorState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 40px',
    gap: '16px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '16px',
  },
  header: {
    padding: '32px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  headerMain: {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px',
  },
  qrCodeContainer: {
    flexShrink: 0,
  },
  qrCode: {
    width: '100px',
    height: '100px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  qrPlaceholder: {
    width: '100px',
    height: '100px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: '12px',
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  partnerCode: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#a78bfa',
    fontFamily: 'monospace',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  companyName: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
    marginBottom: '4px',
  },
  storeName: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '12px',
  },
  statusRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '12px',
    textTransform: 'capitalize',
  },
  riskBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '12px',
    textTransform: 'capitalize',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '16px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tabsContainer: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    padding: '0 24px',
    overflowX: 'auto',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 20px',
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    color: '#fff',
    borderBottomColor: '#667eea',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
  },
  infoSection: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    padding: '20px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
    marginBottom: '16px',
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  infoValue: {
    fontSize: '13px',
    color: '#fff',
    fontWeight: '500',
  },
  addressBlock: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.6,
  },
  noData: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.3)',
    fontStyle: 'italic',
  },
  assignButton: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(168, 85, 247, 0.2))',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '8px',
    padding: '6px 12px',
    color: '#a78bfa',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  managerCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  managerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea, #a855f7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
  },
  managerInfo: {
    flex: 1,
  },
  managerName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
  },
  managerEmail: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  managerDropdown: {
    marginTop: '12px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  dropdownOption: {
    padding: '12px 16px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '8px',
    padding: '6px 12px',
    color: '#34d399',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  addFlagForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
    padding: '16px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
  },
  flagInput: {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
  },
  flagSelect: {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
  },
  flagActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  cancelButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  saveButton: {
    background: 'linear-gradient(135deg, #667eea, #a855f7)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  flagsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  flagItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '10px',
  },
  flagContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  flagSeverity: {
    fontSize: '10px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '8px',
    textTransform: 'capitalize',
    flexShrink: 0,
  },
  flagText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  removeFlagButton: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: 'none',
    borderRadius: '8px',
    padding: '6px',
    cursor: 'pointer',
    color: '#f87171',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  complianceGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  complianceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  complianceLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  complianceBadge: {
    fontSize: '10px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '10px',
    textTransform: 'capitalize',
  },
  listContainer: {
    minHeight: '300px',
  },
  tableWrapper: {
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  tr: {
    transition: 'background 0.2s ease',
  },
  td: {
    padding: '14px 16px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.8)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  tableBadge: {
    fontSize: '10px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '10px',
    textTransform: 'capitalize',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px',
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: '14px',
  },
  documentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  documentCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '14px',
  },
  documentIcon: {
    width: '48px',
    height: '48px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  documentInfo: {
    flex: 1,
    minWidth: 0,
  },
  documentName: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#fff',
    marginBottom: '2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  documentType: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'capitalize',
  },
  documentExpiry: {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: '4px',
  },
  documentStatus: {
    fontSize: '10px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '10px',
    textTransform: 'capitalize',
    flexShrink: 0,
  },
  notesContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '300px',
  },
  notesTextarea: {
    flex: 1,
    width: '100%',
    minHeight: '250px',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '14px',
    lineHeight: 1.6,
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
  },
  notesActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
  },
  notesHint: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  saveNotesButton: {
    background: 'linear-gradient(135deg, #667eea, #a855f7)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
