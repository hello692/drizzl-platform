import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PartnerLayout from '../../components/partner/PartnerLayout';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { getPartnerById, getPartnerAddresses } from '../../lib/api/partners';
import { supabase } from '../../lib/supabase';
import type { PartnerAddress } from '../../types/database';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface DisplayAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

const mockAddresses: DisplayAddress[] = [
  { id: '1', label: 'Main Store', street: '123 Business Ave', city: 'New York', state: 'NY', zip: '10001', isDefault: true },
  { id: '2', label: 'Warehouse', street: '456 Storage Lane', city: 'Brooklyn', state: 'NY', zip: '11201', isDefault: false },
];

export default function PartnerAccount() {
  const router = useRouter();
  const [partnerName, setPartnerName] = useState('Partner');
  const [partnerId, setPartnerId] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState<DisplayAddress[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    taxId: '',
  });

  const [preferences, setPreferences] = useState({
    orderConfirmation: true,
    shipmentUpdates: true,
    invoiceReminders: true,
    promotionalEmails: false,
    weeklyReports: true,
  });

  useEffect(() => {
    const loadData = async () => {
      const session = localStorage.getItem('partnerSession');
      if (!session) {
        router.push('/partner/login');
        return;
      }
      const data = JSON.parse(session);
      setPartnerName(data.businessName);
      setPartnerId(data.id);

      setFormData({
        businessName: data.businessName || 'Fresh Foods Market',
        contactName: data.contactName || 'John Smith',
        email: data.email || 'partner@company.com',
        phone: data.phone || '(555) 123-4567',
        taxId: data.taxId || '12-3456789',
      });

      try {
        if (data.id && data.id !== 'demo-partner') {
          const [partnerData, addressesData] = await Promise.all([
            getPartnerById(data.id),
            getPartnerAddresses(data.id),
          ]);

          if (partnerData) {
            setFormData({
              businessName: partnerData.business_name,
              contactName: partnerData.contact_name,
              email: partnerData.email,
              phone: partnerData.phone,
              taxId: partnerData.tax_id || '',
            });
          }

          if (addressesData.length > 0) {
            setAddresses(addressesData.map(addr => ({
              id: addr.id,
              label: addr.label,
              street: addr.street_address,
              city: addr.city,
              state: addr.state,
              zip: addr.zip_code,
              isDefault: addr.is_default,
            })));
          } else {
            setAddresses(mockAddresses);
          }
        } else {
          setAddresses(mockAddresses);
        }
      } catch (error) {
        console.error('Error loading account data:', error);
        setAddresses(mockAddresses);
      }

      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);

    try {
      if (partnerId && partnerId !== 'demo-partner') {
        await supabase
          .from('partners')
          .update({
            business_name: formData.businessName,
            contact_name: formData.contactName,
            phone: formData.phone,
            tax_id: formData.taxId,
          })
          .eq('id', partnerId);

        const session = localStorage.getItem('partnerSession');
        if (session) {
          const sessionData = JSON.parse(session);
          sessionData.businessName = formData.businessName;
          sessionData.contactName = formData.contactName;
          sessionData.phone = formData.phone;
          sessionData.taxId = formData.taxId;
          localStorage.setItem('partnerSession', JSON.stringify(sessionData));
        }
      }
    } catch (error) {
      console.error('Error saving account:', error);
    }

    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const setDefaultAddress = async (id: string) => {
    setAddresses(prev =>
      prev.map(addr => ({ ...addr, isDefault: addr.id === id }))
    );

    if (partnerId && partnerId !== 'demo-partner') {
      try {
        await supabase
          .from('partner_addresses')
          .update({ is_default: false })
          .eq('partner_id', partnerId);

        await supabase
          .from('partner_addresses')
          .update({ is_default: true })
          .eq('id', id);
      } catch (error) {
        console.error('Error updating default address:', error);
      }
    }
  };

  const deleteAddress = async (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));

    if (partnerId && partnerId !== 'demo-partner') {
      try {
        await supabase
          .from('partner_addresses')
          .delete()
          .eq('id', id);
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  if (loading) {
    return (
      <PartnerLayout title="Account" partnerName={partnerName}>
        <div style={styles.loadingPage}>
          <Loader2 size={32} color={NEON_GREEN} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={styles.loadingText}>Loading account...</p>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout title="Account" partnerName={partnerName}>
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Account Settings</h1>
            <p style={styles.subtitle}>Manage your business information and preferences</p>
          </div>
          <button onClick={handleSave} style={styles.saveButton} disabled={saving}>
            {saving ? (
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            ) : saved ? (
              <CheckCircle size={18} />
            ) : (
              <Save size={18} />
            )}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div style={styles.grid}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <Building2 size={20} />
              Business Information
            </h2>
            <div style={styles.card}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tax ID / EIN</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <User size={20} />
              Contact Information
            </h2>
            <div style={styles.card}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Contact Name</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={styles.input}
                    disabled
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <MapPin size={20} />
                Shipping Addresses
              </h2>
              <button style={styles.addButton}>
                <Plus size={16} />
                Add Address
              </button>
            </div>
            <div style={styles.addressGrid}>
              {addresses.map((address) => (
                <div
                  key={address.id}
                  style={{
                    ...styles.addressCard,
                    ...(address.isDefault ? styles.addressCardDefault : {}),
                  }}
                >
                  <div style={styles.addressHeader}>
                    <span style={styles.addressLabel}>{address.label}</span>
                    {address.isDefault && (
                      <span style={styles.defaultBadge}>Default</span>
                    )}
                  </div>
                  <p style={styles.addressText}>
                    {address.street}<br />
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <div style={styles.addressActions}>
                    {!address.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(address.id)}
                        style={styles.addressBtn}
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddress(address.id)}
                      style={styles.deleteBtn}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <CreditCard size={20} />
              Payment Methods
            </h2>
            <div style={styles.card}>
              <div style={styles.paymentMethod}>
                <div style={styles.paymentIcon}>💳</div>
                <div style={styles.paymentInfo}>
                  <span style={styles.paymentTitle}>Net 30 Credit Account</span>
                  <span style={styles.paymentSubtitle}>Primary payment method</span>
                </div>
                <span style={styles.paymentStatus}>Active</span>
              </div>
              <div style={styles.paymentMethod}>
                <div style={styles.paymentIcon}>🏦</div>
                <div style={styles.paymentInfo}>
                  <span style={styles.paymentTitle}>Bank Account ****4567</span>
                  <span style={styles.paymentSubtitle}>ACH Transfer</span>
                </div>
                <span style={styles.paymentStatus}>Verified</span>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <Bell size={20} />
              Communication Preferences
            </h2>
            <div style={styles.card}>
              <div style={styles.preferencesList}>
                {Object.entries(preferences).map(([key, value]) => (
                  <label key={key} style={styles.preferenceItem}>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setPreferences({ ...preferences, [key]: e.target.checked })}
                      style={styles.checkbox}
                    />
                    <span style={styles.preferenceLabel}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 32,
    maxWidth: 1200,
    margin: '0 auto',
  },
  loadingPage: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
  section: {},
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 16px 0',
  },
  card: {
    padding: 24,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 20,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  input: {
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    border: `1px solid rgba(0, 255, 133, 0.2)`,
    borderRadius: 6,
    color: NEON_GREEN,
    fontSize: 13,
    cursor: 'pointer',
  },
  addressGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16,
  },
  addressCard: {
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  addressCardDefault: {
    borderColor: 'rgba(0, 255, 133, 0.3)',
  },
  addressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  defaultBadge: {
    padding: '4px 10px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 500,
  },
  addressText: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 1.5,
    margin: '0 0 16px 0',
  },
  addressActions: {
    display: 'flex',
    gap: 8,
  },
  addressBtn: {
    padding: '8px 14px',
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 6,
    color: '#999999',
    fontSize: 13,
    cursor: 'pointer',
  },
  deleteBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 6,
    color: '#666666',
    cursor: 'pointer',
  },
  paymentMethod: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentIcon: {
    fontSize: 24,
  },
  paymentInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  paymentSubtitle: {
    fontSize: 13,
    color: '#666666',
  },
  paymentStatus: {
    padding: '4px 12px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 500,
  },
  preferencesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  preferenceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
  },
  checkbox: {
    width: 18,
    height: 18,
    accentColor: NEON_GREEN,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#CCCCCC',
  },
};
