import React, { useState, useEffect } from 'react';
import { useRequireAdmin } from '../../hooks/useRole';
import AdminLayout from '../../components/AdminLayout';

interface ApplicationData {
  legalBusinessName?: string;
  dbaStoreName?: string;
  businessAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  businessPhone?: string;
  businessEmail?: string;
  website?: string;
  einTaxId?: string;
  resaleCertificateUrl?: string;
  businessType?: string;
  yearsInBusiness?: string;
  decisionMakerName?: string;
  decisionMakerRole?: string;
  decisionMakerEmail?: string;
  decisionMakerPhone?: string;
  estimatedMonthlyVolume?: string;
  preferredDeliverySchedule?: string;
  receivingHours?: string;
  hasLoadingDock?: string;
  preferredPaymentMethod?: string;
  agreedToTerms?: boolean;
  submittedAt?: string;
}

interface Partner {
  id: string;
  user_id: string;
  status: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  application_data: ApplicationData;
  admin_notes: string;
  rejection_reason: string;
  created_at: string;
  reviewed_at: string;
}

const volumeLabels: Record<string, string> = {
  under_500: 'Under $500',
  '500_2000': '$500 - $2,000',
  '2000_5000': '$2,000 - $5,000',
  '5000_10000': '$5,000 - $10,000',
  over_10000: 'Over $10,000',
};

const businessTypeLabels: Record<string, string> = {
  retail_store: 'Retail Store',
  cafe: 'Cafe / Coffee Shop',
  gym: 'Gym / Fitness',
  hotel: 'Hotel / Hospitality',
  distributor: 'Distributor',
  other: 'Other',
};

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  buyer: 'Buyer / Purchasing',
  manager: 'Manager',
  other: 'Other',
};

const paymentLabels: Record<string, string> = {
  credit_card: 'Credit Card',
  ach: 'ACH / Bank Transfer',
  net_30: 'Net-30',
  net_60: 'Net-60',
};

const deliveryLabels: Record<string, string> = {
  weekly: 'Weekly',
  bi_weekly: 'Bi-Weekly',
  monthly: 'Monthly',
};

function getAppData(partner: Partner): ApplicationData {
  return partner.application_data || {};
}

const StatusIcon = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    approved: '#10b981',
    pending: '#f59e0b',
    rejected: '#6b7280',
    suspended: '#6b7280',
  };
  return (
    <span style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: colors[status] || colors.suspended,
      display: 'inline-block',
      marginRight: '8px',
    }} />
  );
};

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    style={{
      transition: 'transform 0.2s ease',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const StatusBadge = ({ status }: { status: string }) => {
  const getColor = () => {
    switch (status) {
      case 'approved': return { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)', text: '#34d399' };
      case 'pending': return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24' };
      default: return { bg: 'rgba(107, 114, 128, 0.15)', border: 'rgba(107, 114, 128, 0.3)', text: '#9ca3af' };
    }
  };
  const colors = getColor();
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '500',
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      color: colors.text,
      textTransform: 'capitalize',
    }}>
      <StatusIcon status={status} />
      {status}
    </span>
  );
};

export default function AdminPartners() {
  const { user, loading, authorized } = useRequireAdmin();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  useEffect(() => {
    if (authorized) {
      loadPartners();
    }
  }, [authorized]);

  async function loadPartners() {
    setLoadingData(true);
    try {
      const response = await fetch('/api/admin/partners');
      const data = await response.json();
      setPartners(data.partners || []);
      if (data.message) {
        setError(data.message);
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error loading partners:', err);
      setError('Unable to load partners');
      setPartners([]);
    } finally {
      setLoadingData(false);
    }
  }

  async function updatePartnerStatus(partnerId: string, newStatus: string, notes?: string) {
    console.log('[Partners] updatePartnerStatus called:', { partnerId, newStatus, user: user?.id });
    
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminId: user?.id || 'dev-admin',
          adminNotes: notes || adminNotes,
          rejectionReason: newStatus === 'rejected' ? rejectionReason : undefined,
        }),
      });

      const result = await response.json();
      console.log('[Partners] API response:', result);

      if (response.ok) {
        await loadPartners();
        setExpandedId(null);
        setRejectionReason('');
        setAdminNotes('');
        setShowRejectionForm(false);
      } else {
        console.error('[Partners] API error:', result);
        alert('Error: ' + (result.error || 'Failed to update partner'));
      }
    } catch (err) {
      console.error('[Partners] Error updating partner:', err);
      alert('Failed to update partner. Check console for details.');
    } finally {
      setActionLoading(false);
    }
  }

  function toggleExpand(partner: Partner) {
    if (expandedId === partner.id) {
      setExpandedId(null);
      setShowRejectionForm(false);
    } else {
      setExpandedId(partner.id);
      setAdminNotes(partner.admin_notes || '');
      setShowRejectionForm(false);
      setRejectionReason('');
    }
  }

  const filteredPartners = filter === 'all' 
    ? partners 
    : partners.filter(p => p.status === filter);

  const pendingCount = partners.filter(p => p.status === 'pending').length;

  if (loading || !authorized) {
    return (
      <AdminLayout title="Partners" subtitle="Retail Partner Management">
        <div style={styles.loadingContainer}>
          <div style={styles.loadingOrb} />
          <p style={styles.loadingText}>{loading ? 'Initializing' : 'Authenticating'}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Partners" subtitle="Retail Partner Management">
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{partners.length}</span>
          <span style={styles.statLabel}>Total Applications</span>
        </div>
        {pendingCount > 0 && (
          <div style={styles.pendingBadge}>
            <StatusIcon status="pending" />
            {pendingCount} pending review
          </div>
        )}
      </div>

      {error && (
        <div style={styles.errorCard}>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      <div style={styles.filterContainer}>
        {['all', 'pending', 'approved', 'rejected', 'suspended'].map(status => {
          const count = status === 'all' ? partners.length : partners.filter(p => p.status === status).length;
          const isActive = filter === status;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                ...styles.filterButton,
                background: isActive ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255,255,255,0.03)',
                borderColor: isActive ? 'rgba(102, 126, 234, 0.4)' : 'rgba(255,255,255,0.08)',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
              }}
            >
              {status !== 'all' && <StatusIcon status={status} />}
              <span style={{ textTransform: 'capitalize' }}>{status}</span>
              <span style={styles.filterCount}>{count}</span>
            </button>
          );
        })}
      </div>

      <div style={styles.tableCard}>
        {loadingData ? (
          <div style={styles.emptyState}>
            <div style={styles.loadingSpinner} />
            <span>Loading partners...</span>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ opacity: 0.5 }}>No partners found</span>
          </div>
        ) : (
          filteredPartners.map((partner) => {
            const appData = getAppData(partner);
            const isExpanded = expandedId === partner.id;
            
            return (
              <div key={partner.id} style={styles.partnerCard}>
                <div 
                  onClick={() => toggleExpand(partner)}
                  style={{
                    ...styles.partnerRow,
                    background: isExpanded ? 'rgba(102, 126, 234, 0.08)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div style={styles.partnerInfo}>
                    <div style={styles.businessCol}>
                      <p style={styles.businessName}>{partner.company_name || appData.legalBusinessName || '-'}</p>
                      <p style={styles.email}>{partner.email || appData.businessEmail || '-'}</p>
                    </div>
                    <div style={styles.metaCol}>
                      <span style={styles.metaLabel}>{businessTypeLabels[appData.businessType || ''] || '-'}</span>
                    </div>
                    <div style={styles.metaCol}>
                      <span style={styles.metaLabel}>{appData.city || '-'}{appData.state ? `, ${appData.state}` : ''}</span>
                    </div>
                    <div style={styles.metaCol}>
                      <span style={styles.metaLabel}>{volumeLabels[appData.estimatedMonthlyVolume || ''] || '-'}</span>
                    </div>
                    <div style={styles.statusCol}>
                      <StatusBadge status={partner.status} />
                    </div>
                    <div style={styles.dateCol}>
                      <span style={styles.dateText}>{new Date(partner.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{
                    ...styles.expandButton,
                    background: isExpanded ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255,255,255,0.05)',
                    color: isExpanded ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                  }}>
                    <ChevronIcon isOpen={isExpanded} />
                  </div>
                </div>

                {isExpanded && (
                  <div style={styles.expandedPanel} onClick={(e) => e.stopPropagation()}>
                    <div style={styles.detailGrid}>
                      <div style={styles.detailSection}>
                        <h4 style={styles.sectionTitle}>Business Information</h4>
                        <div style={styles.detailContent}>
                          <p><span style={styles.label}>Legal Name:</span> {appData.legalBusinessName || '-'}</p>
                          {appData.dbaStoreName && <p><span style={styles.label}>DBA:</span> {appData.dbaStoreName}</p>}
                          <p><span style={styles.label}>Type:</span> {businessTypeLabels[appData.businessType || ''] || '-'}</p>
                          <p><span style={styles.label}>Years in Business:</span> {appData.yearsInBusiness || '-'}</p>
                          {appData.website && <p><span style={styles.label}>Website:</span> {appData.website}</p>}
                        </div>
                      </div>

                      <div style={styles.detailSection}>
                        <h4 style={styles.sectionTitle}>Location</h4>
                        <div style={styles.detailContent}>
                          <p>{appData.businessAddress || '-'}</p>
                          <p>{appData.city || '-'}{appData.state ? `, ${appData.state}` : ''} {appData.zip || ''}</p>
                          <p>{appData.country || '-'}</p>
                        </div>
                      </div>

                      <div style={styles.detailSection}>
                        <h4 style={styles.sectionTitle}>Decision Maker</h4>
                        <div style={styles.detailContent}>
                          <p><strong>{appData.decisionMakerName || '-'}</strong></p>
                          <p><span style={styles.label}>Role:</span> {roleLabels[appData.decisionMakerRole || ''] || '-'}</p>
                          <p><span style={styles.label}>Email:</span> {appData.decisionMakerEmail || '-'}</p>
                          {appData.decisionMakerPhone && <p><span style={styles.label}>Phone:</span> {appData.decisionMakerPhone}</p>}
                        </div>
                      </div>

                      <div style={styles.detailSection}>
                        <h4 style={styles.sectionTitle}>Order & Logistics</h4>
                        <div style={styles.detailContent}>
                          <p><span style={styles.label}>Est. Volume:</span> <strong>{volumeLabels[appData.estimatedMonthlyVolume || ''] || '-'}</strong></p>
                          <p><span style={styles.label}>Delivery:</span> {deliveryLabels[appData.preferredDeliverySchedule || ''] || '-'}</p>
                          <p><span style={styles.label}>Payment:</span> {paymentLabels[appData.preferredPaymentMethod || ''] || '-'}</p>
                          <p><span style={styles.label}>Loading Dock:</span> {appData.hasLoadingDock === 'yes' ? 'Yes' : appData.hasLoadingDock === 'no' ? 'No' : '-'}</p>
                        </div>
                      </div>

                      <div style={styles.detailSection}>
                        <h4 style={styles.sectionTitle}>Verification</h4>
                        <div style={styles.detailContent}>
                          <p><span style={styles.label}>EIN/Tax ID:</span> {appData.einTaxId || 'Not provided'}</p>
                          {appData.resaleCertificateUrl && (
                            <p><a href={appData.resaleCertificateUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>View Certificate</a></p>
                          )}
                          {appData.agreedToTerms && <p style={{ color: '#34d399' }}>Agreed to Terms</p>}
                        </div>
                      </div>

                      <div style={styles.detailSection}>
                        <h4 style={styles.sectionTitle}>Contact</h4>
                        <div style={styles.detailContent}>
                          <p><span style={styles.label}>Email:</span> {appData.businessEmail || partner.email || '-'}</p>
                          <p><span style={styles.label}>Phone:</span> {appData.businessPhone || partner.phone || '-'}</p>
                          <p><span style={styles.label}>Applied:</span> {new Date(partner.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div style={styles.notesBox} onClick={(e) => e.stopPropagation()}>
                      <label style={styles.notesLabel}>Admin Notes</label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Internal notes about this partner..."
                        style={styles.textarea}
                      />
                    </div>

                    {partner.status === 'pending' && !showRejectionForm && (
                      <div style={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePartnerStatus(partner.id, 'approved');
                          }}
                          disabled={actionLoading}
                          style={styles.approveBtn}
                        >
                          {actionLoading ? 'Processing...' : 'Approve Partner'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowRejectionForm(true);
                          }}
                          disabled={actionLoading}
                          style={styles.rejectBtn}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {partner.status === 'pending' && showRejectionForm && (
                      <div style={styles.rejectionBox} onClick={(e) => e.stopPropagation()}>
                        <label style={styles.notesLabel}>Rejection Reason</label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Provide a reason for rejection..."
                          style={styles.textarea}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div style={styles.actionButtons}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updatePartnerStatus(partner.id, 'rejected');
                            }}
                            disabled={actionLoading || !rejectionReason.trim()}
                            style={{
                              ...styles.confirmRejectBtn,
                              opacity: actionLoading || !rejectionReason.trim() ? 0.5 : 1,
                            }}
                          >
                            {actionLoading ? 'Processing...' : 'Confirm Rejection'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowRejectionForm(false);
                              setRejectionReason('');
                            }}
                            style={styles.cancelBtn}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {partner.status === 'approved' && (
                      <div style={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePartnerStatus(partner.id, 'suspended', 'Account suspended by admin');
                          }}
                          disabled={actionLoading}
                          style={styles.suspendBtn}
                        >
                          Suspend Account
                        </button>
                      </div>
                    )}

                    {(partner.status === 'rejected' || partner.status === 'suspended') && (
                      <div onClick={(e) => e.stopPropagation()}>
                        {partner.rejection_reason && (
                          <div style={styles.rejectionReasonCard}>
                            <p style={styles.rejectionLabel}>Rejection Reason:</p>
                            <p style={styles.rejectionText}>{partner.rejection_reason}</p>
                          </div>
                        )}
                        <div style={styles.actionButtons}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updatePartnerStatus(partner.id, 'approved', 'Account reactivated by admin');
                            }}
                            disabled={actionLoading}
                            style={styles.approveBtn}
                          >
                            {actionLoading ? 'Processing...' : 'Reactivate Partner'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AdminLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  loadingContainer: {
    minHeight: '50vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
  },
  loadingOrb: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '24px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
  },
  pendingBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    background: 'rgba(245, 158, 11, 0.15)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderRadius: '20px',
    color: '#fbbf24',
    fontSize: '13px',
  },
  errorCard: {
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    borderRadius: '12px',
    padding: '14px 18px',
    marginBottom: '20px',
  },
  errorText: {
    color: '#fbbf24',
    fontSize: '14px',
    margin: 0,
  },
  filterContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  filterButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    border: '1px solid',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: 'none',
  },
  filterCount: {
    fontSize: '11px',
    padding: '2px 8px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    marginLeft: '4px',
  },
  tableCard: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  emptyState: {
    padding: '60px 40px',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    gap: '12px',
  },
  loadingSpinner: {
    width: '24px',
    height: '24px',
    border: '2px solid rgba(255,255,255,0.1)',
    borderTopColor: 'rgba(102, 126, 234, 0.8)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  partnerCard: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  partnerRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    transition: 'background 0.2s',
  },
  partnerInfo: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 100px 90px',
    gap: '16px',
    alignItems: 'center',
  },
  businessCol: {
    minWidth: 0,
  },
  businessName: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#fff',
    margin: 0,
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  email: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  metaCol: {
    minWidth: 0,
  },
  metaLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
  },
  statusCol: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  dateCol: {
    textAlign: 'right',
  },
  dateText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
  },
  expandButton: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '16px',
    transition: 'all 0.2s',
  },
  expandedPanel: {
    padding: '0 20px 24px 20px',
    background: 'rgba(0,0,0,0.2)',
    borderTop: '1px solid rgba(255,255,255,0.04)',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    paddingTop: '20px',
  },
  detailSection: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  sectionTitle: {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '12px',
    letterSpacing: '0.5px',
    fontWeight: '600',
  },
  detailContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
  },
  label: {
    color: 'rgba(255,255,255,0.4)',
    marginRight: '4px',
  },
  link: {
    color: '#4facfe',
    textDecoration: 'none',
  },
  notesBox: {
    marginTop: '20px',
  },
  notesLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '8px',
    color: 'rgba(255,255,255,0.7)',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#fff',
    minHeight: '80px',
    resize: 'vertical',
    boxSizing: 'border-box',
    outline: 'none',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  approveBtn: {
    flex: 1,
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  rejectBtn: {
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  rejectionBox: {
    marginTop: '20px',
    padding: '16px',
    background: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.1)',
    borderRadius: '12px',
  },
  confirmRejectBtn: {
    flex: 1,
    padding: '12px 20px',
    background: 'rgba(107, 114, 128, 0.3)',
    color: '#fff',
    border: '1px solid rgba(107, 114, 128, 0.4)',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cancelBtn: {
    padding: '12px 20px',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  suspendBtn: {
    padding: '12px 20px',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  rejectionReasonCard: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '14px 16px',
    borderRadius: '10px',
    marginTop: '16px',
  },
  rejectionLabel: {
    fontSize: '11px',
    color: 'rgba(239, 68, 68, 0.8)',
    fontWeight: '600',
    marginBottom: '4px',
  },
  rejectionText: {
    fontSize: '13px',
    color: 'rgba(239, 68, 68, 0.9)',
    margin: 0,
  },
};
