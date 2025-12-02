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
  const gradients: Record<string, { start: string; end: string }> = {
    approved: { start: '#10b981', end: '#34d399' },
    pending: { start: '#f59e0b', end: '#fbbf24' },
    rejected: { start: '#6b7280', end: '#9ca3af' },
    suspended: { start: '#6b7280', end: '#9ca3af' },
  };
  
  const gradient = gradients[status] || gradients.suspended;
  
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginRight: '6px' }}>
      <defs>
        <linearGradient id={`status-${status}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradient.start} />
          <stop offset="100%" stopColor={gradient.end} />
        </linearGradient>
      </defs>
      <circle cx="6" cy="6" r="5" fill={`url(#status-${status})`} />
    </svg>
  );
};

const BuildingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f6d365" />
        <stop offset="100%" stopColor="#fda085" />
      </linearGradient>
    </defs>
    <path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 3v15M9 9v.01M9 13v.01M9 17v.01M17 9v.01M17 13v.01M17 17v.01" stroke="url(#buildingGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="usersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" stroke="url(#usersGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="clockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4facfe" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#clockGrad)" strokeWidth="2"/>
    <path d="M12 6v6l4 2" stroke="url(#clockGrad)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f093fb" />
        <stop offset="100%" stopColor="#f5576c" />
      </linearGradient>
    </defs>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="url(#mapGrad)" strokeWidth="2"/>
    <circle cx="12" cy="10" r="3" stroke="url(#mapGrad)" strokeWidth="2"/>
  </svg>
);

const DollarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="dollarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#43e97b" />
        <stop offset="100%" stopColor="#38f9d7" />
      </linearGradient>
    </defs>
    <line x1="12" y1="1" x2="12" y2="23" stroke="url(#dollarGrad)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="url(#dollarGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const StatusBadge = ({ status }: { status: string }) => {
  const getGradient = () => {
    switch (status) {
      case 'approved': return 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.2) 100%)';
      case 'pending': return 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%)';
      case 'rejected': 
      case 'suspended': 
      default: return 'linear-gradient(135deg, rgba(107, 114, 128, 0.2) 0%, rgba(156, 163, 175, 0.2) 100%)';
    }
  };
  
  const getBorder = () => {
    switch (status) {
      case 'approved': return 'rgba(16, 185, 129, 0.4)';
      case 'pending': return 'rgba(245, 158, 11, 0.4)';
      case 'rejected':
      case 'suspended':
      default: return 'rgba(107, 114, 128, 0.4)';
    }
  };
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      background: getGradient(),
      border: `1px solid ${getBorder()}`,
      color: 'rgba(255,255,255,0.9)',
      textTransform: 'capitalize',
      backdropFilter: 'blur(8px)',
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
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

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
    if (!user) return;
    
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminId: user.id || 'dev-admin',
          adminNotes: notes || adminNotes,
          rejectionReason: newStatus === 'rejected' ? rejectionReason : undefined,
        }),
      });

      if (response.ok) {
        await loadPartners();
        setShowDetail(false);
        setSelectedPartner(null);
        setRejectionReason('');
        setAdminNotes('');
        setShowRejectionModal(false);
      }
    } catch (err) {
      console.error('Error updating partner:', err);
    } finally {
      setActionLoading(false);
    }
  }

  const filteredPartners = filter === 'all' 
    ? partners 
    : partners.filter(p => p.status === filter);

  const pendingCount = partners.filter(p => p.status === 'pending').length;

  if (loading) {
    return (
      <AdminLayout title="Partners" subtitle="Retail Partner Management">
        <div style={styles.loadingContainer}>
          <div style={styles.loadingOrb} />
          <p style={styles.loadingText}>Initializing</p>
        </div>
      </AdminLayout>
    );
  }

  if (!authorized) {
    return (
      <AdminLayout title="Partners" subtitle="Retail Partner Management">
        <div style={styles.loadingContainer}>
          <div style={styles.loadingOrb} />
          <p style={styles.loadingText}>Authenticating</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Partners" subtitle="Retail Partner Management">
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <UsersIcon />
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px' }}>
            <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill="#f59e0b"/>
          </svg>
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
                background: isActive ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)' : 'rgba(255,255,255,0.03)',
                borderColor: isActive ? 'rgba(102, 126, 234, 0.5)' : 'rgba(255,255,255,0.08)',
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
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}><div style={styles.thContent}><BuildingIcon /><span style={{ marginLeft: '8px' }}>Business</span></div></th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}><div style={styles.thContent}><MapPinIcon /><span style={{ marginLeft: '6px' }}>Location</span></div></th>
              <th style={styles.th}><div style={styles.thContent}><DollarIcon /><span style={{ marginLeft: '6px' }}>Est. Volume</span></div></th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}><div style={styles.thContent}><ClockIcon /><span style={{ marginLeft: '6px' }}>Applied</span></div></th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingData ? (
              <tr>
                <td colSpan={7} style={styles.emptyCell}>
                  <div style={styles.loadingSpinner} />
                  <span>Loading partners...</span>
                </td>
              </tr>
            ) : filteredPartners.length === 0 ? (
              <tr>
                <td colSpan={7} style={styles.emptyCell}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '12px', opacity: 0.3 }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="1.5"/>
                    <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="1.5"/>
                    <line x1="23" y1="21" x2="17" y2="15" stroke="white" strokeWidth="1.5"/>
                  </svg>
                  <span>No partners found</span>
                </td>
              </tr>
            ) : (
              filteredPartners.map((partner, index) => {
                const appData = getAppData(partner);
                return (
                  <tr key={partner.id} style={{
                    ...styles.tr,
                    animationDelay: `${index * 0.05}s`,
                  }}>
                    <td style={styles.td}>
                      <p style={styles.businessName}>{partner.company_name || appData.legalBusinessName || '-'}</p>
                      {appData.dbaStoreName && <p style={styles.dbaName}>DBA: {appData.dbaStoreName}</p>}
                      <p style={styles.email}>{partner.email || appData.businessEmail || '-'}</p>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.typeLabel}>{businessTypeLabels[appData.businessType || ''] || appData.businessType || '-'}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.location}>{appData.city || '-'}{appData.state ? `, ${appData.state}` : ''}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.volume}>{volumeLabels[appData.estimatedMonthlyVolume || ''] || appData.estimatedMonthlyVolume || '-'}</span>
                    </td>
                    <td style={styles.td}>
                      <StatusBadge status={partner.status} />
                    </td>
                    <td style={styles.td}>
                      <span style={styles.date}>{new Date(partner.created_at).toLocaleDateString()}</span>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => { setSelectedPartner(partner); setShowDetail(true); setAdminNotes(partner.admin_notes || ''); }}
                        style={{
                          ...styles.actionButton,
                          background: partner.status === 'pending' 
                            ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' 
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                      >
                        {partner.status === 'pending' ? 'Review' : 'View'}
                        <ArrowIcon />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showDetail && selectedPartner && (() => {
        const appData = getAppData(selectedPartner);
        return (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <div>
                  <h2 style={styles.modalTitle}>{selectedPartner.company_name || appData.legalBusinessName}</h2>
                  <StatusBadge status={selectedPartner.status} />
                </div>
                <button onClick={() => { setShowDetail(false); setSelectedPartner(null); }} style={styles.closeButton}>
                  <CloseIcon />
                </button>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.infoGrid}>
                  <div style={styles.infoSection}>
                    <h4 style={styles.sectionTitle}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                        <defs>
                          <linearGradient id="infoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#667eea" />
                            <stop offset="100%" stopColor="#764ba2" />
                          </linearGradient>
                        </defs>
                        <path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 3v15" stroke="url(#infoGrad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Business Information
                    </h4>
                    <div style={styles.infoContent}>
                      <p style={styles.infoRow}><span style={styles.infoLabel}>Legal Name:</span> <strong>{appData.legalBusinessName || '-'}</strong></p>
                      {appData.dbaStoreName && <p style={styles.infoRow}><span style={styles.infoLabel}>DBA:</span> {appData.dbaStoreName}</p>}
                      <p style={styles.infoRow}><span style={styles.infoLabel}>Type:</span> {businessTypeLabels[appData.businessType || ''] || appData.businessType || '-'}</p>
                      <p style={styles.infoRow}><span style={styles.infoLabel}>Years in Business:</span> {appData.yearsInBusiness || 'Not specified'}</p>
                      {appData.website && <p style={styles.infoRow}><span style={styles.infoLabel}>Website:</span> {appData.website}</p>}
                    </div>
                  </div>
                  <div style={styles.infoSection}>
                    <h4 style={styles.sectionTitle}>
                      <MapPinIcon />
                      <span style={{ marginLeft: '8px' }}>Location</span>
                    </h4>
                    <div style={styles.infoContent}>
                      <p style={styles.infoRow}>{appData.businessAddress || '-'}</p>
                      <p style={styles.infoRow}>{appData.city || '-'}{appData.state ? `, ${appData.state}` : ''} {appData.zip || ''}</p>
                      <p style={styles.infoRow}>{appData.country || '-'}</p>
                    </div>
                  </div>
                </div>

                <div style={styles.infoGrid}>
                  <div style={styles.infoSection}>
                    <h4 style={styles.sectionTitle}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                        <defs>
                          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#34d399" />
                          </linearGradient>
                        </defs>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="url(#shieldGrad)" strokeWidth="2"/>
                      </svg>
                      Business Verification
                    </h4>
                    <div style={styles.infoContent}>
                      <p style={styles.infoRow}><span style={styles.infoLabel}>EIN/Tax ID:</span> {appData.einTaxId || 'Not provided'}</p>
                      {appData.resaleCertificateUrl && (
                        <p style={styles.infoRow}>
                          <span style={styles.infoLabel}>Resale Certificate:</span>{' '}
                          <a href={appData.resaleCertificateUrl} target="_blank" rel="noopener noreferrer" style={styles.linkText}>View Document</a>
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={styles.infoSection}>
                    <h4 style={styles.sectionTitle}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                        <defs>
                          <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f093fb" />
                            <stop offset="100%" stopColor="#f5576c" />
                          </linearGradient>
                        </defs>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="url(#userGrad)" strokeWidth="2"/>
                        <circle cx="12" cy="7" r="4" stroke="url(#userGrad)" strokeWidth="2"/>
                      </svg>
                      Decision Maker
                    </h4>
                    <div style={styles.infoContent}>
                      <p style={styles.infoRow}><strong>{appData.decisionMakerName || '-'}</strong></p>
                      <p style={styles.infoRow}><span style={styles.infoLabel}>Role:</span> {roleLabels[appData.decisionMakerRole || ''] || appData.decisionMakerRole || '-'}</p>
                      <p style={styles.infoRow}><span style={styles.infoLabel}>Email:</span> {appData.decisionMakerEmail || '-'}</p>
                      {appData.decisionMakerPhone && <p style={styles.infoRow}><span style={styles.infoLabel}>Phone:</span> {appData.decisionMakerPhone}</p>}
                    </div>
                  </div>
                </div>

                <div style={styles.infoGrid}>
                  <div style={styles.infoSection}>
                    <h4 style={styles.sectionTitle}>
                      <DollarIcon />
                      <span style={{ marginLeft: '8px' }}>Order & Logistics</span>
                    </h4>
                    <div style={styles.infoContent}>
                      <p style={styles.infoRow}><span style={styles.infoLabel}>Est. Monthly Volume:</span> <strong>{volumeLabels[appData.estimatedMonthlyVolume || ''] || appData.estimatedMonthlyVolume || '-'}</strong></p>
                      <p style={styles.infoRow}><span style={styles.infoLabel}>Delivery Schedule:</span> {deliveryLabels[appData.preferredDeliverySchedule || ''] || appData.preferredDeliverySchedule || '-'}</p>
                      {appData.receivingHours && <p style={styles.infoRow}><span style={styles.infoLabel}>Receiving Hours:</span> {appData.receivingHours}</p>}
                      <p style={styles.infoRow}><span style={styles.infoLabel}>Loading Dock:</span> {appData.hasLoadingDock === 'yes' ? 'Yes' : appData.hasLoadingDock === 'no' ? 'No' : '-'}</p>
                      <p style={styles.infoRow}><span style={styles.infoLabel}>Payment Method:</span> {paymentLabels[appData.preferredPaymentMethod || ''] || appData.preferredPaymentMethod || '-'}</p>
                    </div>
                  </div>
                  <div style={styles.infoSection}>
                    <h4 style={styles.sectionTitle}>
                      <ClockIcon />
                      <span style={{ marginLeft: '8px' }}>Contact Information</span>
                    </h4>
                    <div style={styles.infoContent}>
                      <p style={styles.infoRow}><span style={styles.infoLabel}>Business Email:</span> {appData.businessEmail || selectedPartner.email || '-'}</p>
                      <p style={styles.infoRow}><span style={styles.infoLabel}>Business Phone:</span> {appData.businessPhone || selectedPartner.phone || '-'}</p>
                      <p style={styles.infoRow}><span style={styles.infoLabel}>Applied:</span> {new Date(selectedPartner.created_at).toLocaleString()}</p>
                      {selectedPartner.reviewed_at && <p style={styles.infoRow}><span style={styles.infoLabel}>Reviewed:</span> {new Date(selectedPartner.reviewed_at).toLocaleString()}</p>}
                      {appData.agreedToTerms && <p style={styles.agreedText}>Agreed to Terms</p>}
                    </div>
                  </div>
                </div>

                <div style={styles.notesSection}>
                  <label style={styles.notesLabel}>Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal notes about this partner..."
                    style={styles.textarea}
                  />
                </div>

                {selectedPartner.status === 'pending' && (
                  <div style={styles.actionRow}>
                    <button
                      onClick={() => updatePartnerStatus(selectedPartner.id, 'approved')}
                      disabled={actionLoading}
                      style={{ ...styles.approveButton, opacity: actionLoading ? 0.7 : 1 }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {actionLoading ? 'Processing...' : 'Approve Partner'}
                    </button>
                    <button
                      onClick={() => setShowRejectionModal(true)}
                      disabled={actionLoading}
                      style={{ ...styles.rejectButton, opacity: actionLoading ? 0.7 : 1 }}
                    >
                      <CloseIcon />
                      <span style={{ marginLeft: '6px' }}>Reject Application</span>
                    </button>
                  </div>
                )}

                {selectedPartner.status === 'approved' && (
                  <div style={styles.actionRow}>
                    <button
                      onClick={() => updatePartnerStatus(selectedPartner.id, 'suspended', 'Account suspended by admin')}
                      disabled={actionLoading}
                      style={styles.suspendButton}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Suspend Account
                    </button>
                  </div>
                )}

                {(selectedPartner.status === 'rejected' || selectedPartner.status === 'suspended') && (
                  <div style={styles.actionRow}>
                    {selectedPartner.rejection_reason && (
                      <div style={styles.rejectionReasonCard}>
                        <p style={styles.rejectionLabel}>Rejection Reason:</p>
                        <p style={styles.rejectionText}>{selectedPartner.rejection_reason}</p>
                      </div>
                    )}
                    <button
                      onClick={() => updatePartnerStatus(selectedPartner.id, 'approved', 'Account reactivated by admin')}
                      disabled={actionLoading}
                      style={{ ...styles.reactivateButton, opacity: actionLoading ? 0.7 : 1 }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {actionLoading ? 'Processing...' : 'Reactivate Partner'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {showRejectionModal && selectedPartner && (
        <div style={styles.rejectionOverlay}>
          <div style={styles.rejectionModal}>
            <h3 style={styles.rejectionModalTitle}>Reject Application</h3>
            <p style={styles.rejectionModalDesc}>
              Please provide a reason for rejecting this application. This will be visible to the applicant.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              style={styles.rejectionTextarea}
            />
            <div style={styles.rejectionActions}>
              <button
                onClick={() => updatePartnerStatus(selectedPartner.id, 'rejected')}
                disabled={actionLoading || !rejectionReason.trim()}
                style={{ 
                  ...styles.confirmRejectButton, 
                  opacity: actionLoading || !rejectionReason.trim() ? 0.5 : 1,
                  cursor: actionLoading || !rejectionReason.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => { setShowRejectionModal(false); setRejectionReason(''); }}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
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
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    animation: 'pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '28px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  statValue: {
    fontSize: '24px',
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
    fontWeight: '500',
  },
  errorCard: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '24px',
    backdropFilter: 'blur(10px)',
  },
  errorText: {
    color: '#fbbf24',
    fontSize: '14px',
    margin: 0,
  },
  filterContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '28px',
    flexWrap: 'wrap',
  },
  filterButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backdropFilter: 'blur(10px)',
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
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '16px 20px',
    textAlign: 'left' as const,
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: 'rgba(255,255,255,0.4)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  thContent: {
    display: 'flex',
    alignItems: 'center',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    transition: 'background 0.2s',
    animation: 'fadeInUp 0.4s ease forwards',
  },
  td: {
    padding: '18px 20px',
    fontSize: '14px',
  },
  businessName: {
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '4px',
    color: '#fff',
  },
  dbaName: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '4px',
  },
  email: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
  },
  typeLabel: {
    color: 'rgba(255,255,255,0.7)',
  },
  location: {
    color: 'rgba(255,255,255,0.7)',
  },
  volume: {
    color: 'rgba(255,255,255,0.7)',
  },
  date: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
  },
  emptyCell: {
    padding: '60px 40px',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  loadingSpinner: {
    width: '24px',
    height: '24px',
    border: '2px solid rgba(255,255,255,0.1)',
    borderTopColor: 'rgba(102, 126, 234, 0.8)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '12px',
  },
  actionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: 'linear-gradient(135deg, rgba(20, 20, 25, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%)',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '950px',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
  },
  modalHeader: {
    padding: '28px 32px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    background: 'rgba(15, 15, 20, 0.95)',
    backdropFilter: 'blur(20px)',
    zIndex: 10,
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#fff',
  },
  closeButton: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.6)',
    transition: 'all 0.2s',
  },
  modalBody: {
    padding: '32px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '28px',
  },
  infoSection: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '18px',
    letterSpacing: '1px',
    fontWeight: '600',
  },
  infoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  infoRow: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
    margin: 0,
    lineHeight: '1.6',
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.4)',
    marginRight: '4px',
  },
  linkText: {
    color: '#4facfe',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  agreedText: {
    marginTop: '8px',
    fontSize: '13px',
    color: '#34d399',
    fontWeight: '500',
  },
  notesSection: {
    marginBottom: '28px',
  },
  notesLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '12px',
    color: 'rgba(255,255,255,0.8)',
  },
  textarea: {
    width: '100%',
    padding: '16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    fontSize: '14px',
    color: '#fff',
    minHeight: '100px',
    resize: 'vertical',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  actionRow: {
    display: 'flex',
    gap: '14px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    flexWrap: 'wrap',
  },
  approveButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  rejectButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.3) 0%, rgba(75, 85, 99, 0.3) 100%)',
    color: '#fff',
    border: '1px solid rgba(107, 114, 128, 0.4)',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  suspendButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 24px',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  rejectionReasonCard: {
    width: '100%',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '16px 20px',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  rejectionLabel: {
    fontSize: '12px',
    color: 'rgba(239, 68, 68, 0.8)',
    fontWeight: '600',
    marginBottom: '6px',
  },
  rejectionText: {
    fontSize: '14px',
    color: 'rgba(239, 68, 68, 0.9)',
    margin: 0,
  },
  reactivateButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 28px',
    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  rejectionOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    padding: '20px',
  },
  rejectionModal: {
    background: 'linear-gradient(135deg, rgba(20, 20, 25, 0.98) 0%, rgba(10, 10, 15, 0.99) 100%)',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '520px',
    padding: '36px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    boxShadow: '0 0 60px rgba(239, 68, 68, 0.1)',
  },
  rejectionModalTitle: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#fff',
  },
  rejectionModalDesc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  rejectionTextarea: {
    width: '100%',
    padding: '16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    fontSize: '14px',
    color: '#fff',
    minHeight: '140px',
    resize: 'vertical',
    marginBottom: '28px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  rejectionActions: {
    display: 'flex',
    gap: '14px',
  },
  confirmRejectButton: {
    flex: 1,
    padding: '16px 24px',
    background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.4) 0%, rgba(75, 85, 99, 0.4) 100%)',
    color: '#fff',
    border: '1px solid rgba(107, 114, 128, 0.5)',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  cancelButton: {
    padding: '16px 28px',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
