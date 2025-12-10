import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Home,
  Building2,
  Loader2,
} from 'lucide-react';
import { getCustomerAddresses } from '../../lib/api/customers';
import { supabase } from '../../lib/supabase';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface Address {
  id: string;
  label: string;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    type: 'home',
    firstName: 'John',
    lastName: 'Doe',
    street: '123 Main Street',
    apartment: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    phone: '(555) 123-4567',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Office',
    type: 'work',
    firstName: 'John',
    lastName: 'Doe',
    street: '456 Business Ave',
    apartment: 'Suite 1200',
    city: 'New York',
    state: 'NY',
    zip: '10018',
    phone: '(555) 987-6543',
    isDefault: false,
  },
];

const emptyAddress: Omit<Address, 'id'> = {
  label: '',
  type: 'home',
  firstName: '',
  lastName: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  isDefault: false,
};

export default function CustomerAddresses() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const loadAddresses = async () => {
      const session = localStorage.getItem('customerSession');
      if (!session) {
        router.push('/account/login');
        return;
      }

      const parsedSession = JSON.parse(session);
      setCustomerId(parsedSession.id);

      try {
        if (parsedSession.id && parsedSession.id !== 'demo-customer') {
          const dbAddresses = await getCustomerAddresses(parsedSession.id);
          
          if (dbAddresses && dbAddresses.length > 0) {
            const formattedAddresses: Address[] = dbAddresses.map(addr => ({
              id: addr.id,
              label: addr.label || 'Address',
              type: addr.address_type as 'home' | 'work' | 'other',
              firstName: addr.street_address?.split(' ')[0] || 'Customer',
              lastName: addr.street_address?.split(' ')[1] || '',
              street: addr.street_address,
              apartment: addr.apartment || undefined,
              city: addr.city,
              state: addr.state,
              zip: addr.zip_code,
              phone: '',
              isDefault: addr.is_default,
            }));
            setAddresses(formattedAddresses);
          }
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      }
      
      setLoading(false);
    };

    loadAddresses();
  }, [router]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSetDefault = async (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
    
    if (customerId && customerId !== 'demo-customer') {
      try {
        await supabase
          .from('customer_addresses')
          .update({ is_default: false })
          .eq('customer_id', customerId);
        
        await supabase
          .from('customer_addresses')
          .update({ is_default: true })
          .eq('id', id);
      } catch (error) {
        console.error('Error updating default address:', error);
      }
    }
    
    showToast('Default address updated');
  };

  const handleDelete = async (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    
    if (customerId && customerId !== 'demo-customer') {
      try {
        await supabase
          .from('customer_addresses')
          .delete()
          .eq('id', id);
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
    
    showToast('Address deleted');
  };

  const handleSave = async (address: Address) => {
    const newId = address.id || `addr-${Date.now()}`;
    
    if (editingAddress) {
      setAddresses(prev => prev.map(addr => 
        addr.id === address.id ? address : addr
      ));
      
      if (customerId && customerId !== 'demo-customer') {
        try {
          await supabase
            .from('customer_addresses')
            .update({
              label: address.label,
              address_type: address.type,
              street_address: address.street,
              apartment: address.apartment,
              city: address.city,
              state: address.state,
              zip_code: address.zip,
              is_default: address.isDefault,
            })
            .eq('id', address.id);
        } catch (error) {
          console.error('Error updating address:', error);
        }
      }
      
      showToast('Address updated');
    } else {
      const newAddress = { ...address, id: newId };
      setAddresses(prev => [...prev, newAddress]);
      
      if (customerId && customerId !== 'demo-customer') {
        try {
          await supabase
            .from('customer_addresses')
            .insert({
              customer_id: customerId,
              label: address.label,
              address_type: address.type,
              street_address: address.street,
              apartment: address.apartment,
              city: address.city,
              state: address.state,
              zip_code: address.zip,
              country: 'USA',
              is_default: address.isDefault || addresses.length === 0,
            });
        } catch (error) {
          console.error('Error adding address:', error);
        }
      }
      
      showToast('Address added');
    }
    setEditingAddress(null);
    setIsAdding(false);
  };

  const AddressForm = ({ address, onSave, onCancel }: { 
    address: Address | null; 
    onSave: (addr: Address) => void;
    onCancel: () => void;
  }) => {
    const [form, setForm] = useState<Omit<Address, 'id'> & { id?: string }>(
      address || { ...emptyAddress }
    );

    return (
      <div style={styles.formCard}>
        <h3 style={styles.formTitle}>
          {address ? 'Edit Address' : 'Add New Address'}
        </h3>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Address Label</label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="e.g., Home, Office"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              style={styles.select}
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
            <label style={styles.label}>Street Address</label>
            <input
              type="text"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Apartment, Suite, etc.</label>
            <input
              type="text"
              value={form.apartment}
              onChange={(e) => setForm({ ...form, apartment: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>State</label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>ZIP Code</label>
            <input
              type="text"
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
              style={styles.input}
            />
          </div>
        </div>
        <div style={styles.formActions}>
          <button onClick={onCancel} style={styles.cancelButton}>
            Cancel
          </button>
          <button 
            onClick={() => onSave(form as Address)}
            style={styles.saveButton}
          >
            <Check size={16} />
            Save Address
          </button>
        </div>
      </div>
    );
  };

  return (
    <CustomerLayout title="Addresses">
      <div style={styles.page}>
        {toast && (
          <div style={styles.toast}>
            <Check size={16} color={NEON_GREEN} />
            <span>{toast}</span>
          </div>
        )}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Saved Addresses</h1>
            <p style={styles.subtitle}>Manage your shipping addresses</p>
          </div>
          {!isAdding && !editingAddress && (
            <button 
              onClick={() => setIsAdding(true)}
              style={styles.addButton}
            >
              <Plus size={18} />
              Add Address
            </button>
          )}
        </div>

        {(isAdding || editingAddress) && (
          <AddressForm
            address={editingAddress}
            onSave={handleSave}
            onCancel={() => {
              setIsAdding(false);
              setEditingAddress(null);
            }}
          />
        )}

        {loading ? (
          <div style={styles.loadingContainer}>
            <Loader2 size={32} color={NEON_GREEN} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={styles.loadingText}>Loading your addresses...</p>
          </div>
        ) : (
          <div style={styles.addressGrid}>
            {addresses.map((address) => {
              const TypeIcon = address.type === 'home' ? Home : Building2;
              return (
                <div 
                  key={address.id} 
                  style={{
                    ...styles.addressCard,
                    ...(address.isDefault ? styles.addressCardDefault : {}),
                  }}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.cardLabel}>
                      <TypeIcon size={18} color={address.isDefault ? NEON_GREEN : '#666666'} />
                      <span style={{ color: address.isDefault ? NEON_GREEN : '#FFFFFF' }}>
                        {address.label}
                      </span>
                    </div>
                    {address.isDefault && (
                      <span style={styles.defaultBadge}>Default</span>
                    )}
                  </div>

                  <div style={styles.cardContent}>
                    <p style={styles.name}>
                      {address.firstName} {address.lastName}
                    </p>
                    <p style={styles.addressLine}>{address.street}</p>
                    {address.apartment && (
                      <p style={styles.addressLine}>{address.apartment}</p>
                    )}
                    <p style={styles.addressLine}>
                      {address.city}, {address.state} {address.zip}
                    </p>
                    <p style={styles.phone}>{address.phone}</p>
                  </div>

                  <div style={styles.cardActions}>
                    <button 
                      onClick={() => setEditingAddress(address)}
                      style={styles.actionBtn}
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                    {!address.isDefault && (
                      <>
                        <button 
                          onClick={() => handleSetDefault(address.id)}
                          style={styles.actionBtn}
                        >
                          <MapPin size={16} />
                          Set Default
                        </button>
                        <button 
                          onClick={() => handleDelete(address.id)}
                          style={{ ...styles.actionBtn, color: '#EF4444' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && addresses.length === 0 && !isAdding && (
          <div style={styles.emptyState}>
            <MapPin size={48} color="#333333" />
            <h3 style={styles.emptyTitle}>No saved addresses</h3>
            <p style={styles.emptyText}>Add an address to get started</p>
            <button 
              onClick={() => setIsAdding(true)}
              style={{ ...styles.addButton, marginTop: 16 }}
            >
              <Plus size={18} />
              Add Address
            </button>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </CustomerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 900,
    margin: '0 auto',
  },
  toast: {
    position: 'fixed',
    top: 24,
    right: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 20px',
    backgroundColor: '#111111',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    zIndex: 1000,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
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
    marginTop: 8,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 64,
    gap: 16,
  },
  loadingText: {
    color: '#666666',
    fontSize: 14,
  },
  formCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 20px 0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: '#999999',
  },
  input: {
    padding: '12px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
  },
  select: {
    padding: '12px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    cursor: 'pointer',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
    paddingTop: 20,
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  cancelButton: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 8,
    color: '#000000',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  addressGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 16,
  },
  addressCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 20,
  },
  addressCardDefault: {
    borderColor: 'rgba(0, 255, 133, 0.3)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 15,
    fontWeight: 600,
  },
  defaultBadge: {
    padding: '4px 10px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 500,
    color: NEON_GREEN,
  },
  cardContent: {
    marginBottom: 16,
  },
  name: {
    fontSize: 14,
    fontWeight: 500,
    color: '#FFFFFF',
    margin: '0 0 8px 0',
  },
  addressLine: {
    fontSize: 13,
    color: '#999999',
    margin: '0 0 4px 0',
  },
  phone: {
    fontSize: 13,
    color: '#666666',
    margin: '8px 0 0 0',
  },
  cardActions: {
    display: 'flex',
    gap: 8,
    paddingTop: 16,
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#999999',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '16px 0 8px',
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
  },
};
