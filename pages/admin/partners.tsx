import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import { supabase } from '../../lib/supabaseClient';

interface Partner {
  id: string;
  user_id: string;
  status: string;
  legal_business_name: string;
  dba_store_name: string;
  business_address: string;
  business_email: string;
  business_phone: string;
  business_type: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  website: string;
  ein_tax_id: string;
  resale_certificate_url: string;
  years_in_business: number;
  decision_maker_name: string;
  decision_maker_role: string;
  decision_maker_email: string;
  decision_maker_phone: string;
  estimated_monthly_volume: string;
  preferred_delivery_schedule: string;
  receiving_hours: string;
  has_loading_dock: boolean;
  preferred_payment_method: string;
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

export default function AdminPartners() {
  const { user, loading, authorized } = useRequireAdmin();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingData, setLoadingData] = useState(true);
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
      const { data, error } = await supabase
        .from('retail_partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPartners(data);
      }
    } catch (err) {
      console.error('Error loading partners:', err);
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
          adminId: user.id,
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

  if (loading || !authorized) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}><p>Loading...</p></div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700' }}>DRIZZL ADMIN</Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', opacity: 0.7 }}>Dashboard</Link>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', opacity: 0.7 }}>Products</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', opacity: 0.7 }}>Orders</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>Partners</Link>
          <Link href="/admin/analytics" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', opacity: 0.7 }}>Analytics</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', opacity: 0.6 }}>Exit</Link>
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
                filteredPartners.map(partner => (
                  <tr key={partner.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '16px' }}>
                      <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{partner.legal_business_name}</p>
                      {partner.dba_store_name && <p style={{ fontSize: '12px', color: '#666' }}>DBA: {partner.dba_store_name}</p>}
                      <p style={{ fontSize: '12px', color: '#999' }}>{partner.business_email}</p>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{businessTypeLabels[partner.business_type] || partner.business_type || '-'}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{partner.city}, {partner.state}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{volumeLabels[partner.estimated_monthly_volume] || partner.estimated_monthly_volume || '-'}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showDetail && selectedPartner && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{selectedPartner.legal_business_name}</h2>
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
              <button onClick={() => { setShowDetail(false); setSelectedPartner(null); }} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#999', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                <div>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999', marginBottom: '16px', letterSpacing: '0.5px', fontWeight: '600' }}>Business Information</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Legal Name:</span> <strong>{selectedPartner.legal_business_name}</strong></p>
                    {selectedPartner.dba_store_name && <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>DBA:</span> {selectedPartner.dba_store_name}</p>}
                    <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Type:</span> {businessTypeLabels[selectedPartner.business_type] || selectedPartner.business_type}</p>
                    <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Years in Business:</span> {selectedPartner.years_in_business || 'Not specified'}</p>
                    {selectedPartner.website && <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Website:</span> {selectedPartner.website}</p>}
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999', marginBottom: '16px', letterSpacing: '0.5px', fontWeight: '600' }}>Location</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontSize: '14px' }}>{selectedPartner.business_address}</p>
                    <p style={{ fontSize: '14px' }}>{selectedPartner.city}, {selectedPartner.state} {selectedPartner.zip}</p>
                    <p style={{ fontSize: '14px' }}>{selectedPartner.country}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                <div>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999', marginBottom: '16px', letterSpacing: '0.5px', fontWeight: '600' }}>Business Verification</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>EIN/Tax ID:</span> {selectedPartner.ein_tax_id || 'Not provided'}</p>
                    {selectedPartner.resale_certificate_url && (
                      <p style={{ fontSize: '14px' }}>
                        <span style={{ color: '#666' }}>Resale Certificate:</span>{' '}
                        <a href={selectedPartner.resale_certificate_url} target="_blank" rel="noopener noreferrer" style={{ color: '#1565c0' }}>View Document</a>
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999', marginBottom: '16px', letterSpacing: '0.5px', fontWeight: '600' }}>Decision Maker</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontSize: '14px' }}><strong>{selectedPartner.decision_maker_name}</strong></p>
                    <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Role:</span> {roleLabels[selectedPartner.decision_maker_role] || selectedPartner.decision_maker_role}</p>
                    <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Email:</span> {selectedPartner.decision_maker_email}</p>
                    {selectedPartner.decision_maker_phone && <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Phone:</span> {selectedPartner.decision_maker_phone}</p>}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                <div>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999', marginBottom: '16px', letterSpacing: '0.5px', fontWeight: '600' }}>Order & Logistics</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Est. Monthly Volume:</span> <strong>{volumeLabels[selectedPartner.estimated_monthly_volume] || selectedPartner.estimated_monthly_volume}</strong></p>
                    <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Delivery Schedule:</span> {deliveryLabels[selectedPartner.preferred_delivery_schedule] || selectedPartner.preferred_delivery_schedule}</p>
                    {selectedPartner.receiving_hours && <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Receiving Hours:</span> {selectedPartner.receiving_hours}</p>}
                    <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Loading Dock:</span> {selectedPartner.has_loading_dock ? 'Yes' : 'No'}</p>
                    <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Payment Method:</span> {paymentLabels[selectedPartner.preferred_payment_method] || selectedPartner.preferred_payment_method}</p>
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999', marginBottom: '16px', letterSpacing: '0.5px', fontWeight: '600' }}>Contact Information</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Business Email:</span> {selectedPartner.business_email}</p>
                    <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Business Phone:</span> {selectedPartner.business_phone}</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}><span style={{ color: '#666' }}>Applied:</span> {new Date(selectedPartner.created_at).toLocaleString()}</p>
                    {selectedPartner.reviewed_at && <p style={{ fontSize: '14px' }}><span style={{ color: '#666' }}>Reviewed:</span> {new Date(selectedPartner.reviewed_at).toLocaleString()}</p>}
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
                    style={{ padding: '14px 24px', background: '#1e7e34', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: actionLoading ? 'default' : 'pointer' }}
                  >
                    Approve / Reactivate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showRejectionModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Reject Application</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Please provide a reason for rejecting this application. This will be shared with the applicant.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', minHeight: '100px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '20px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { setShowRejectionModal(false); setRejectionReason(''); }}
                style={{ flex: 1, padding: '12px', background: '#f5f5f5', color: '#000', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => selectedPartner && updatePartnerStatus(selectedPartner.id, 'rejected')}
                disabled={!rejectionReason.trim() || actionLoading}
                style={{ flex: 1, padding: '12px', background: '#c53929', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: !rejectionReason.trim() || actionLoading ? 'default' : 'pointer', opacity: !rejectionReason.trim() || actionLoading ? 0.7 : 1 }}
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
