import React, { useState, useEffect, useCallback } from 'react';
import { useRequireAdmin } from '../../hooks/useRole';
import AdminLayout from '../../components/AdminLayout';
import PartnerSearchBar from '../../components/PartnerSearchBar';
import PartnerProfileModal from '../../components/PartnerProfileModal';

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
  latest_score?: number;
  risk_level?: string;
  agreement_status?: string;
  partner_code?: string;
  qr_code_data?: string;
  account_manager?: {
    id: string;
    name: string;
    email: string;
  };
  contract_status?: string;
  total_orders?: number;
  total_revenue_cents?: number;
}

interface PartnerScoring {
  id: string;
  partner_id: string;
  score: number;
  risk_level: string;
  explanation: string;
  scoring_factors: {
    businessTypeScore: number;
    locationScore: number;
    volumeScore: number;
    infrastructureScore: number;
    verificationScore: number;
  };
  created_at: string;
}

interface Agreement {
  id: string;
  partner_id: string;
  agreement_type: string;
  envelope_id?: string;
  envelope_status?: string;
  signer_email: string;
  signer_name: string;
  sent_at?: string;
  viewed_at?: string;
  signed_at?: string;
  declined_at?: string;
  decline_reason?: string;
  created_at: string;
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

const ScoreBadge = ({ score, riskLevel }: { score?: number; riskLevel?: string }) => {
  if (!score && score !== 0) return null;
  
  const getColors = () => {
    if (riskLevel === 'Low' || score >= 70) {
      return { bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.15))', border: 'rgba(16, 185, 129, 0.3)', text: '#34d399' };
    }
    if (riskLevel === 'Medium' || score >= 50) {
      return { bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.15))', border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24' };
    }
    return { bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(248, 113, 113, 0.15))', border: 'rgba(239, 68, 68, 0.3)', text: '#f87171' };
  };
  
  const colors = getColors();
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      color: colors.text,
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
      {score}
      {riskLevel && <span style={{ opacity: 0.7, marginLeft: '2px' }}>({riskLevel})</span>}
    </span>
  );
};

const PartnerCodeBadge = ({ code, onQRClick }: { code?: string; onQRClick?: () => void }) => {
  if (!code) return null;
  
  return (
    <div style={styles.partnerCodeBadge}>
      <span style={styles.partnerCodeText}>{code}</span>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onQRClick?.();
        }}
        style={styles.qrIconButton}
        title="Show QR Code"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="3" height="3" />
          <path d="M21 14v3h-3M21 21h-3M18 21v-3" />
        </svg>
      </button>
    </div>
  );
};

const ContractStatusBadge = ({ status }: { status?: string }) => {
  if (!status) return null;
  
  const getColors = () => {
    switch (status) {
      case 'signed':
      case 'active':
        return { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)', text: '#34d399', icon: '✓' };
      case 'sent':
      case 'pending':
        return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24', icon: '◷' };
      case 'expired':
      case 'declined':
        return { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', text: '#f87171', icon: '✕' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.15)', border: 'rgba(107, 114, 128, 0.3)', text: '#9ca3af', icon: '—' };
    }
  };
  
  const colors = getColors();
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 8px',
      borderRadius: '8px',
      fontSize: '10px',
      fontWeight: '600',
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      color: colors.text,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    }}>
      <span>{colors.icon}</span>
      Contract: {status}
    </span>
  );
};

const QRModal = ({ qrData, partnerCode, onClose }: { qrData?: string; partnerCode?: string; onClose: () => void }) => {
  return (
    <div style={styles.qrModalOverlay} onClick={onClose}>
      <div style={styles.qrModalContent} onClick={(e) => e.stopPropagation()}>
        <button style={styles.qrModalClose} onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div style={styles.qrModalHeader}>
          <h3 style={styles.qrModalTitle}>Partner QR Code</h3>
          <p style={styles.qrModalCode}>{partnerCode}</p>
        </div>
        <div style={styles.qrCodeDisplay}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="4" height="4" />
            <path d="M18 14h3v3M21 21h-3v-3M18 18h3v3" />
            <rect x="5" y="5" width="3" height="3" fill="currentColor" />
            <rect x="16" y="5" width="3" height="3" fill="currentColor" />
            <rect x="5" y="16" width="3" height="3" fill="currentColor" />
          </svg>
        </div>
        <p style={styles.qrModalSubtext}>Scan to access partner portal</p>
      </div>
    </div>
  );
};

const AgreementStatusBadge = ({ status }: { status?: string }) => {
  const getColors = () => {
    switch (status) {
      case 'completed':
      case 'signed':
        return { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)', text: '#34d399' };
      case 'sent':
      case 'delivered':
        return { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', text: '#60a5fa' };
      case 'viewed':
        return { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.3)', text: '#a78bfa' };
      case 'declined':
      case 'voided':
        return { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', text: '#f87171' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.15)', border: 'rgba(107, 114, 128, 0.3)', text: '#9ca3af' };
    }
  };
  
  const colors = getColors();
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      color: colors.text,
      textTransform: 'capitalize',
    }}>
      {status || 'None'}
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
  const [scoringLoading, setScoringLoading] = useState<string | null>(null);
  const [scoringResults, setScoringResults] = useState<Record<string, PartnerScoring>>({});
  
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState<{ qrData?: string; code?: string } | null>(null);
  
  const [agreements, setAgreements] = useState<Record<string, Agreement[]>>({});
  const [agreementLoading, setAgreementLoading] = useState<string | null>(null);
  const [sendingAgreement, setSendingAgreement] = useState<string | null>(null);

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

  async function loadAgreements(partnerId: string) {
    if (agreements[partnerId]) return;
    
    setAgreementLoading(partnerId);
    try {
      const response = await fetch(`/api/admin/docusign/agreements?partnerId=${partnerId}`);
      const data = await response.json();
      setAgreements(prev => ({
        ...prev,
        [partnerId]: data.agreements || [],
      }));
    } catch (err) {
      console.error('Error loading agreements:', err);
    } finally {
      setAgreementLoading(null);
    }
  }

  async function sendAgreement(partner: Partner) {
    setSendingAgreement(partner.id);
    try {
      const appData = getAppData(partner);
      const response = await fetch('/api/admin/docusign/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: partner.id,
          agreementType: 'retail_partner',
          signerEmail: appData.decisionMakerEmail || partner.email,
          signerName: appData.decisionMakerName || partner.contact_name || partner.company_name,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setAgreements(prev => ({
          ...prev,
          [partner.id]: [],
        }));
        await loadAgreements(partner.id);
      } else {
        alert('Error: ' + (result.error || 'Failed to send agreement'));
      }
    } catch (err) {
      console.error('Error sending agreement:', err);
      alert('Failed to send agreement');
    } finally {
      setSendingAgreement(null);
    }
  }

  async function performAgreementAction(envelopeId: string, action: string, partnerId: string, reason?: string) {
    setAgreementLoading(partnerId);
    try {
      const response = await fetch(`/api/admin/docusign/agreements?envelopeId=${envelopeId}&action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      const result = await response.json();
      if (result.success) {
        setAgreements(prev => ({ ...prev, [partnerId]: [] }));
        await loadAgreements(partnerId);
      } else {
        alert('Error: ' + (result.error || 'Action failed'));
      }
    } catch (err) {
      console.error('Error performing action:', err);
      alert('Action failed');
    } finally {
      setAgreementLoading(null);
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
      loadAgreements(partner.id);
    }
  }

  async function calculateScore(partnerId: string, useAI: boolean = false) {
    setScoringLoading(partnerId);
    try {
      const response = await fetch(`/api/admin/partners/scoring?useAI=${useAI}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId, forceRecalculate: true }),
      });
      
      const data = await response.json();
      
      if (data.scoring) {
        setScoringResults(prev => ({
          ...prev,
          [partnerId]: data.scoring,
        }));
        
        setPartners(prev => prev.map(p => 
          p.id === partnerId 
            ? { ...p, latest_score: data.scoring.score, risk_level: data.scoring.risk_level }
            : p
        ));
      }
    } catch (error) {
      console.error('[Partners] Error calculating score:', error);
    } finally {
      setScoringLoading(null);
    }
  }

  const handlePartnerSelect = useCallback((partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setShowProfileModal(true);
  }, []);

  const handleQRClick = useCallback((qrData?: string, code?: string) => {
    setShowQRModal({ qrData, code });
  }, []);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

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
      <div style={styles.searchSection}>
        <PartnerSearchBar 
          onSelect={handlePartnerSelect}
          placeholder="Search by partner code, name, email, or phone..."
        />
      </div>

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
            const partnerAgreements = agreements[partner.id] || [];
            const latestAgreement = partnerAgreements[0];
            
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
                      <div style={styles.businessHeader}>
                        <p style={styles.businessName}>{partner.company_name || appData.legalBusinessName || '-'}</p>
                        <PartnerCodeBadge 
                          code={partner.partner_code} 
                          onQRClick={() => handleQRClick(partner.qr_code_data, partner.partner_code)}
                        />
                      </div>
                      <p style={styles.email}>{partner.email || appData.businessEmail || '-'}</p>
                      {partner.account_manager && (
                        <p style={styles.accountManager}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                            <circle cx="12" cy="8" r="4" />
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          </svg>
                          {partner.account_manager.name}
                        </p>
                      )}
                    </div>
                    <div style={styles.metaCol}>
                      <span style={styles.metaLabel}>{businessTypeLabels[appData.businessType || ''] || '-'}</span>
                      <ContractStatusBadge status={partner.contract_status || partner.agreement_status} />
                    </div>
                    <div style={styles.metaCol}>
                      <span style={styles.metaLabel}>{appData.city || '-'}{appData.state ? `, ${appData.state}` : ''}</span>
                    </div>
                    <div style={styles.metaCol}>
                      <span style={styles.metaLabel}>{volumeLabels[appData.estimatedMonthlyVolume || ''] || '-'}</span>
                      {(partner.total_orders !== undefined || partner.total_revenue_cents !== undefined) && (
                        <div style={styles.quickStats}>
                          {partner.total_orders !== undefined && (
                            <span style={styles.quickStat}>{partner.total_orders} orders</span>
                          )}
                          {partner.total_revenue_cents !== undefined && partner.total_revenue_cents > 0 && (
                            <span style={styles.quickStat}>{formatCurrency(partner.total_revenue_cents)}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div style={styles.statusCol}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <StatusBadge status={partner.status} />
                        {(partner.latest_score || scoringResults[partner.id]) && (
                          <ScoreBadge 
                            score={scoringResults[partner.id]?.score ?? partner.latest_score} 
                            riskLevel={scoringResults[partner.id]?.risk_level ?? partner.risk_level} 
                          />
                        )}
                      </div>
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

                    <div style={styles.agreementSection} onClick={(e) => e.stopPropagation()}>
                      <div style={styles.agreementHeader}>
                        <h4 style={styles.sectionTitle}>DocuSign Agreements</h4>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {latestAgreement && (
                            <AgreementStatusBadge status={latestAgreement.envelope_status} />
                          )}
                        </div>
                      </div>
                      
                      {agreementLoading === partner.id ? (
                        <div style={styles.agreementLoading}>
                          <div style={styles.loadingSpinner} />
                          <span>Loading agreements...</span>
                        </div>
                      ) : partnerAgreements.length === 0 ? (
                        <div style={styles.noAgreements}>
                          <p>No agreements sent yet</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              sendAgreement(partner);
                            }}
                            disabled={sendingAgreement === partner.id}
                            style={styles.sendAgreementBtn}
                          >
                            {sendingAgreement === partner.id ? 'Sending...' : 'Send Agreement'}
                          </button>
                        </div>
                      ) : (
                        <div style={styles.agreementList}>
                          {partnerAgreements.map((agreement) => (
                            <div key={agreement.id} style={styles.agreementItem}>
                              <div style={styles.agreementInfo}>
                                <div style={styles.agreementMain}>
                                  <span style={styles.agreementType}>{agreement.agreement_type}</span>
                                  <AgreementStatusBadge status={agreement.envelope_status} />
                                </div>
                                <div style={styles.agreementMeta}>
                                  <span>To: {agreement.signer_email}</span>
                                  {agreement.sent_at && <span>Sent: {new Date(agreement.sent_at).toLocaleDateString()}</span>}
                                  {agreement.signed_at && <span style={{ color: '#34d399' }}>Signed: {new Date(agreement.signed_at).toLocaleDateString()}</span>}
                                  {agreement.declined_at && <span style={{ color: '#f87171' }}>Declined: {new Date(agreement.declined_at).toLocaleDateString()}</span>}
                                </div>
                                {agreement.decline_reason && (
                                  <p style={styles.declineReason}>Reason: {agreement.decline_reason}</p>
                                )}
                              </div>
                              {agreement.envelope_status === 'sent' || agreement.envelope_status === 'delivered' ? (
                                <div style={styles.agreementActions}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (agreement.envelope_id) {
                                        performAgreementAction(agreement.envelope_id, 'resend', partner.id);
                                      }
                                    }}
                                    style={styles.agreementActionBtn}
                                    disabled={agreementLoading === partner.id}
                                  >
                                    Resend
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (agreement.envelope_id) {
                                        performAgreementAction(agreement.envelope_id, 'void', partner.id, 'Voided by admin');
                                      }
                                    }}
                                    style={styles.agreementVoidBtn}
                                    disabled={agreementLoading === partner.id}
                                  >
                                    Void
                                  </button>
                                  <div style={styles.demoActions}>
                                    <span style={styles.demoLabel}>Demo:</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (agreement.envelope_id) {
                                          performAgreementAction(agreement.envelope_id, 'simulate-sign', partner.id);
                                        }
                                      }}
                                      style={styles.simulateSignBtn}
                                      disabled={agreementLoading === partner.id}
                                    >
                                      Simulate Sign
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (agreement.envelope_id) {
                                          performAgreementAction(agreement.envelope_id, 'simulate-decline', partner.id, 'Declined in demo mode');
                                        }
                                      }}
                                      style={styles.simulateDeclineBtn}
                                      disabled={agreementLoading === partner.id}
                                    >
                                      Simulate Decline
                                    </button>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          ))}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              sendAgreement(partner);
                            }}
                            disabled={sendingAgreement === partner.id}
                            style={styles.sendNewAgreementBtn}
                          >
                            {sendingAgreement === partner.id ? 'Sending...' : '+ Send New Agreement'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={styles.scoringSection} onClick={(e) => e.stopPropagation()}>
                      <div style={styles.scoringHeader}>
                        <label style={styles.notesLabel}>AI Fit Score</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              calculateScore(partner.id, false);
                            }}
                            disabled={scoringLoading === partner.id}
                            style={styles.scoreBtn}
                          >
                            {scoringLoading === partner.id ? 'Calculating...' : 'Calculate Score'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              calculateScore(partner.id, true);
                            }}
                            disabled={scoringLoading === partner.id}
                            style={styles.scoreAIBtn}
                          >
                            AI Score
                          </button>
                        </div>
                      </div>
                      {scoringResults[partner.id] && (
                        <div style={styles.scoringResult}>
                          <div style={styles.scoreDisplay}>
                            <span style={{
                              ...styles.scoreNumber,
                              color: scoringResults[partner.id].risk_level === 'Low' ? '#34d399' 
                                : scoringResults[partner.id].risk_level === 'Medium' ? '#fbbf24' 
                                : '#f87171'
                            }}>
                              {scoringResults[partner.id].score}
                            </span>
                            <span style={styles.scoreOutOf}>/100</span>
                            <span style={{
                              ...styles.riskBadge,
                              background: scoringResults[partner.id].risk_level === 'Low' ? 'rgba(16, 185, 129, 0.15)'
                                : scoringResults[partner.id].risk_level === 'Medium' ? 'rgba(245, 158, 11, 0.15)'
                                : 'rgba(239, 68, 68, 0.15)',
                              color: scoringResults[partner.id].risk_level === 'Low' ? '#34d399'
                                : scoringResults[partner.id].risk_level === 'Medium' ? '#fbbf24'
                                : '#f87171',
                            }}>
                              {scoringResults[partner.id].risk_level} Risk
                            </span>
                          </div>
                          <p style={styles.scoreExplanation}>{scoringResults[partner.id].explanation}</p>
                        </div>
                      )}
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

      {showProfileModal && selectedPartnerId && (
        <PartnerProfileModal
          partnerId={selectedPartnerId}
          isOpen={showProfileModal}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedPartnerId(null);
          }}
          onUpdate={loadPartners}
        />
      )}

      {showQRModal && (
        <QRModal
          qrData={showQRModal.qrData}
          partnerCode={showQRModal.code}
          onClose={() => setShowQRModal(null)}
        />
      )}

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
  searchSection: {
    marginBottom: '24px',
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
  businessHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
    flexWrap: 'wrap',
  },
  businessName: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#fff',
    margin: 0,
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
  accountManager: {
    fontSize: '11px',
    color: 'rgba(102, 126, 234, 0.9)',
    margin: '4px 0 0 0',
    display: 'flex',
    alignItems: 'center',
  },
  metaCol: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  metaLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
  },
  quickStats: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  quickStat: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.5)',
    background: 'rgba(255,255,255,0.05)',
    padding: '2px 6px',
    borderRadius: '4px',
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
  partnerCodeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '2px 8px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(168, 85, 247, 0.2))',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '6px',
    flexShrink: 0,
  },
  partnerCodeText: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#a78bfa',
    fontFamily: 'monospace',
    letterSpacing: '0.3px',
  },
  qrIconButton: {
    background: 'none',
    border: 'none',
    padding: '2px',
    cursor: 'pointer',
    color: 'rgba(167, 139, 250, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
  },
  qrModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  qrModalContent: {
    background: 'rgba(30, 30, 45, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '32px',
    width: '90%',
    maxWidth: '320px',
    position: 'relative',
    boxShadow: '0 32px 100px rgba(0, 0, 0, 0.8)',
  },
  qrModalClose: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '8px',
  },
  qrModalHeader: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  qrModalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 8px 0',
  },
  qrModalCode: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#a78bfa',
    fontFamily: 'monospace',
    margin: 0,
  },
  qrCodeDisplay: {
    display: 'flex',
    justifyContent: 'center',
    padding: '24px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    marginBottom: '16px',
  },
  qrModalSubtext: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    margin: 0,
  },
  agreementSection: {
    marginTop: '20px',
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(168, 85, 247, 0.05))',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    borderRadius: '12px',
  },
  agreementHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  agreementLoading: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
  },
  noAgreements: {
    textAlign: 'center',
    padding: '24px',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
  },
  sendAgreementBtn: {
    marginTop: '12px',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  agreementList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  agreementItem: {
    padding: '16px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  agreementInfo: {
    marginBottom: '12px',
  },
  agreementMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  agreementType: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  agreementMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    flexWrap: 'wrap',
  },
  declineReason: {
    fontSize: '12px',
    color: '#f87171',
    marginTop: '8px',
    fontStyle: 'italic',
  },
  agreementActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: '12px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  agreementActionBtn: {
    padding: '6px 14px',
    background: 'rgba(59, 130, 246, 0.2)',
    color: '#60a5fa',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  agreementVoidBtn: {
    padding: '6px 14px',
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  demoActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: 'auto',
    paddingLeft: '16px',
    borderLeft: '1px solid rgba(255,255,255,0.08)',
  },
  demoLabel: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  simulateSignBtn: {
    padding: '5px 10px',
    background: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '5px',
    fontSize: '11px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  simulateDeclineBtn: {
    padding: '5px 10px',
    background: 'rgba(245, 158, 11, 0.15)',
    color: '#fbbf24',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderRadius: '5px',
    fontSize: '11px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  sendNewAgreementBtn: {
    padding: '10px',
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(255,255,255,0.6)',
    border: '1px dashed rgba(255,255,255,0.15)',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
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
  scoringSection: {
    marginTop: '20px',
    padding: '16px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
    border: '1px solid rgba(102, 126, 234, 0.15)',
    borderRadius: '12px',
  },
  scoringHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  scoreBtn: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  scoreAIBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
    color: '#fff',
    border: '1px solid rgba(102, 126, 234, 0.4)',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  scoringResult: {
    marginTop: '12px',
  },
  scoreDisplay: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '8px',
  },
  scoreNumber: {
    fontSize: '36px',
    fontWeight: '700',
  },
  scoreOutOf: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.4)',
  },
  riskBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    marginLeft: '12px',
  },
  scoreExplanation: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: '1.5',
    margin: 0,
  },
};
