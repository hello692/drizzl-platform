import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';

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

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fff3e0', text: '#e65100' },
  approved: { bg: '#e6f4ea', text: '#1e7e34' },
  rejected: { bg: '#fce8e6', text: '#c53929' },
  suspended: { bg: '#f5f5f5', text: '#666' },
};

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
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}><p>Loading...</p></div>;
  }

  if (!authorized) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}><p>Checking authorization...</p></div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700' }}>DRIZZL ADMIN</Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/admin/command-center" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Command Center</Link>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Products</Link>
          <Link href="/admin/product-intel" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Product Intel</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Orders</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Partners</Link>
          <Link href="/admin/banking" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Banking</Link>
          <Link href="/admin/analytics" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Analytics</Link>
          <Link href="/admin/ai" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>AI Tools</Link>
          <Link href="/admin/ai-assistant" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>AI Assistant</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Wholesale Partners</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>
              {partners.length} total applications
              {pendingCount > 0 && <span style={{ color: '#e65100', fontWeight: '600' }}> | {pendingCount} pending review</span>}
            </p>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fff3e0', border: '1px solid #ffcc02', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ color: '#e65100', fontSize: '14px' }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'approved', 'rejected', 'suspended'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '8px 16px',
                background: filter === status ? '#000' : '#fff',
                color: filter === status ? '#fff' : '#666',
                border: '1px solid #e0e0e0',
                borderRadius: '20px',
                fontSize: '13px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {status} {status !== 'all' && `(${partners.filter(p => p.status === status).length})`}
            </button>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Business</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Type</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Location</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Est. Volume</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Applied</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading...</td></tr>
              ) : filteredPartners.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No partners found</td></tr>
              ) : (
                filteredPartners.map(partner => {
                  const appData = getAppData(partner);
                  return (
                    <tr key={partner.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '16px' }}>
                        <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{partner.company_name || appData.legalBusinessName || '-'}</p>
                        {appData.dbaStoreName && <p style={{ fontSize: '12px', color: '#666' }}>DBA: {appData.dbaStoreName}</p>}
                        <p style={{ fontSize: '12px', color: '#999' }}>{partner.email || appData.businessEmail || '-'}</p>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{businessTypeLabels[appData.businessType || ''] || appData.businessType || '-'}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{appData.city || '-'}{appData.state ? `, ${appData.state}` : ''}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{volumeLabels[appData.estimatedMonthlyVolume || ''] || appData.estimatedMonthlyVolume || '-'}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: statusColors[partner.status]?.bg || '#f5f5f5',
                          color: statusColors[partner.status]?.text || '#666',
                          textTransform: 'capitalize',
                        }}>
                          {partner.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '13px', color: '#666' }}>{new Date(partner.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '16px' }}>
                        <button
                          onClick={() => { setSelectedPartner(partner); setShowDetail(true); setAdminNotes(partner.admin_notes || ''); }}
                          style={{ padding: '6px 14px', background: partner.status === 'pending' ? '#e65100' : '#000', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          {partner.status === 'pending' ? 'Review' : 'View'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showDetail && selectedPartner && (() => {
        const appData = getAppData(selectedPartner);
        return (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{selectedPartner.company_name || appData.legalBusinessName}</h2>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: statusColors[selectedPartner.status]?.bg || '#f5f5f5',
                    color: statusColors[selectedPartner.status]?.text || '#666',
                    textTransform: 'capitalize',
                  }}>
                    {selectedPartner.status}
                  </span>
                </div>
                <button onClick={() => { setShowDetail(false); setSelectedPartner(null); }} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#999', lineHeight: 1 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                  <div>
                    <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999', marginBottom: '16px', letterSpacing: '0.5px', fontWeight: '600' }}>Business Information</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Legal Name:</span> <strong>{appData.legalBusinessName || '-'}</strong></p>
                      {appData.dbaStoreName && <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>DBA:</span> {appData.dbaStoreName}</p>}
                      <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Type:</span> {businessTypeLabels[appData.businessType || ''] || appData.businessType || '-'}</p>
                      <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Years in Business:</span> {appData.yearsInBusiness || 'Not specified'}</p>
                      {appData.website && <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Website:</span> {appData.website}</p>}
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999', marginBottom: '16px', letterSpacing: '0.5px', fontWeight: '600' }}>Location</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p style={{ fontSize: '14px' }}>{appData.businessAddress || '-'}</p>
                      <p style={{ fontSize: '14px' }}>{appData.city || '-'}{appData.state ? `, ${appData.state}` : ''} {appData.zip || ''}</p>
                      <p style={{ fontSize: '14px' }}>{appData.country || '-'}</p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                  <div>
                    <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999', marginBottom: '16px', letterSpacing: '0.5px', fontWeight: '600' }}>Business Verification</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>EIN/Tax ID:</span> {appData.einTaxId || 'Not provided'}</p>
                      {appData.resaleCertificateUrl && (
                        <p style={{ fontSize: '14px' }}>
                          <span style={{ color: '#666' }}>Resale Certificate:</span>{' '}
                          <a href={appData.resaleCertificateUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1565c0' }}>View Document</a>
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999', marginBottom: '16px', letterSpacing: '0.5px', fontWeight: '600' }}>Decision Maker</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p style={{ fontSize: '14px' }}><strong>{appData.decisionMakerName || '-'}</strong></p>
                      <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Role:</span> {roleLabels[appData.decisionMakerRole || ''] || appData.decisionMakerRole || '-'}</p>
                      <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Email:</span> {appData.decisionMakerEmail || '-'}</p>
                      {appData.decisionMakerPhone && <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Phone:</span> {appData.decisionMakerPhone}</p>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                  <div>
                    <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999', marginBottom: '16px', letterSpacing: '0.5px', fontWeight: '600' }}>Order & Logistics</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Est. Monthly Volume:</span> <strong>{volumeLabels[appData.estimatedMonthlyVolume || ''] || appData.estimatedMonthlyVolume || '-'}</strong></p>
                      <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Delivery Schedule:</span> {deliveryLabels[appData.preferredDeliverySchedule || ''] || appData.preferredDeliverySchedule || '-'}</p>
                      {appData.receivingHours && <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Receiving Hours:</span> {appData.receivingHours}</p>}
                      <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Loading Dock:</span> {appData.hasLoadingDock === 'yes' ? 'Yes' : appData.hasLoadingDock === 'no' ? 'No' : '-'}</p>
                      <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Payment Method:</span> {paymentLabels[appData.preferredPaymentMethod || ''] || appData.preferredPaymentMethod || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999', marginBottom: '16px', letterSpacing: '0.5px', fontWeight: '600' }}>Contact Information</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Business Email:</span> {appData.businessEmail || selectedPartner.email || '-'}</p>
                      <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Business Phone:</span> {appData.businessPhone || selectedPartner.phone || '-'}</p>
                      <p style={{ fontSize: '14px', marginTop: '8px' }}><span style={{ color: '#666' }}>Applied:</span> {new Date(selectedPartner.created_at).toLocaleString()}</p>
                      {selectedPartner.reviewed_at && <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Reviewed:</span> {new Date(selectedPartner.reviewed_at).toLocaleString()}</p>}
                      {appData.agreedToTerms && <p style={{ fontSize: '14px', color: '#1e7e34' }}>Agreed to Terms</p>}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal notes about this partner..."
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                {selectedPartner.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                    <button
                      onClick={() => updatePartnerStatus(selectedPartner.id, 'approved')}
                      disabled={actionLoading}
                      style={{ flex: 1, padding: '14px', background: '#1e7e34', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: actionLoading ? 'default' : 'pointer', opacity: actionLoading ? 0.7 : 1 }}
                    >
                      {actionLoading ? 'Processing...' : 'Approve Partner'}
                    </button>
                    <button
                      onClick={() => setShowRejectionModal(true)}
                      disabled={actionLoading}
                      style={{ flex: 1, padding: '14px', background: '#c53929', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: actionLoading ? 'default' : 'pointer', opacity: actionLoading ? 0.7 : 1 }}
                    >
                      Reject Application
                    </button>
                  </div>
                )}

                {selectedPartner.status === 'approved' && (
                  <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                    <button
                      onClick={() => updatePartnerStatus(selectedPartner.id, 'suspended', 'Account suspended by admin')}
                      disabled={actionLoading}
                      style={{ padding: '14px 24px', background: '#f5f5f5', color: '#666', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: actionLoading ? 'default' : 'pointer' }}
                    >
                      Suspend Account
                    </button>
                  </div>
                )}

                {(selectedPartner.status === 'rejected' || selectedPartner.status === 'suspended') && (
                  <div style={{ paddingTop: '16px', borderTop: '1px solid #eee' }}>
                    {selectedPartner.rejection_reason && (
                      <div style={{ background: '#fce8e6', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
                        <p style={{ fontSize: '12px', color: '#c53929', fontWeight: '600', marginBottom: '4px' }}>Rejection Reason:</p>
                        <p style={{ fontSize: '14px', color: '#c53929' }}>{selectedPartner.rejection_reason}</p>
                      </div>
                    )}
                    <button
                      onClick={() => updatePartnerStatus(selectedPartner.id, 'approved', 'Account reactivated by admin')}
                      disabled={actionLoading}
                      style={{ padding: '14px 24px', background: '#1e7e34', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: actionLoading ? 'default' : 'pointer', opacity: actionLoading ? 0.7 : 1 }}
                    >
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Reject Application</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Please provide a reason for rejecting this application. This will be visible to the applicant.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', minHeight: '120px', resize: 'vertical', marginBottom: '24px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => updatePartnerStatus(selectedPartner.id, 'rejected')}
                disabled={actionLoading || !rejectionReason.trim()}
                style={{ flex: 1, padding: '14px', background: '#c53929', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: actionLoading || !rejectionReason.trim() ? 'default' : 'pointer', opacity: actionLoading || !rejectionReason.trim() ? 0.7 : 1 }}
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => { setShowRejectionModal(false); setRejectionReason(''); }}
                style={{ padding: '14px 24px', background: '#f5f5f5', color: '#000', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
