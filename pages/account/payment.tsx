import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  Shield,
  Star,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
  name: string;
  isDefault: boolean;
}

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: 'card-1',
    type: 'visa',
    last4: '4242',
    expiry: '12/26',
    name: 'John Doe',
    isDefault: true,
  },
  {
    id: 'card-2',
    type: 'mastercard',
    last4: '8888',
    expiry: '08/25',
    name: 'John Doe',
    isDefault: false,
  },
];

const cardBrandColors = {
  visa: { bg: 'linear-gradient(135deg, #1a1f71 0%, #2557d6 100%)', text: '#FFFFFF' },
  mastercard: { bg: 'linear-gradient(135deg, #eb001b 0%, #f79e1b 100%)', text: '#FFFFFF' },
  amex: { bg: 'linear-gradient(135deg, #006fcf 0%, #00a1e4 100%)', text: '#FFFFFF' },
};

export default function CustomerPayment() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('customerSession');
    if (!session) {
      router.push('/account/login');
    }
  }, [router]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => prev.map(pm => ({
      ...pm,
      isDefault: pm.id === id,
    })));
    showToast('Default payment method updated');
  };

  const handleDelete = (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    showToast('Payment method removed');
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: PaymentMethod = {
      id: `card-${Date.now()}`,
      type: 'visa',
      last4: '1234',
      expiry: '12/28',
      name: 'John Doe',
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods(prev => [...prev, newCard]);
    setIsAdding(false);
    showToast('Payment method added');
  };

  return (
    <CustomerLayout title="Payment Methods">
      <div style={styles.page}>
        {toast && (
          <div style={styles.toast}>
            <Check size={16} color={NEON_GREEN} />
            <span>{toast}</span>
          </div>
        )}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Payment Methods</h1>
            <p style={styles.subtitle}>Manage your saved payment methods</p>
          </div>
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              style={styles.addButton}
            >
              <Plus size={18} />
              Add Card
            </button>
          )}
        </div>

        {isAdding && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Add Payment Method</h3>
            <form onSubmit={handleAddCard}>
              <div style={styles.formGrid}>
                <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>Card Number</label>
                  <div style={styles.cardInputWrapper}>
                    <CreditCard size={18} style={styles.cardInputIcon} />
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      style={styles.cardInput}
                      maxLength={19}
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    style={styles.input}
                    maxLength={5}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    style={styles.input}
                    maxLength={4}
                  />
                </div>
                <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>Name on Card</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.formActions}>
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.saveButton}>
                  <Check size={16} />
                  Add Card
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={styles.cardsGrid}>
          {paymentMethods.map((card) => {
            const brandStyle = cardBrandColors[card.type];
            return (
              <div key={card.id} style={styles.cardWrapper}>
                <div style={{ ...styles.creditCard, background: brandStyle.bg }}>
                  <div style={styles.cardChip}>
                    <div style={styles.chipLines} />
                  </div>
                  <div style={styles.cardNumber}>
                    •••• •••• •••• {card.last4}
                  </div>
                  <div style={styles.cardBottom}>
                    <div>
                      <div style={styles.cardLabel}>CARDHOLDER</div>
                      <div style={styles.cardValue}>{card.name.toUpperCase()}</div>
                    </div>
                    <div>
                      <div style={styles.cardLabel}>EXPIRES</div>
                      <div style={styles.cardValue}>{card.expiry}</div>
                    </div>
                    <div style={styles.cardBrand}>
                      {card.type.toUpperCase()}
                    </div>
                  </div>
                  {card.isDefault && (
                    <div style={styles.defaultIndicator}>
                      <Star size={14} fill={NEON_GREEN} color={NEON_GREEN} />
                    </div>
                  )}
                </div>
                <div style={styles.cardActions}>
                  {card.isDefault ? (
                    <span style={styles.defaultText}>Default Card</span>
                  ) : (
                    <button 
                      onClick={() => handleSetDefault(card.id)}
                      style={styles.actionBtn}
                    >
                      Set as Default
                    </button>
                  )}
                  {!card.isDefault && (
                    <button 
                      onClick={() => handleDelete(card.id)}
                      style={{ ...styles.actionBtn, color: '#EF4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {paymentMethods.length === 0 && !isAdding && (
          <div style={styles.emptyState}>
            <CreditCard size={48} color="#333333" />
            <h3 style={styles.emptyTitle}>No payment methods</h3>
            <p style={styles.emptyText}>Add a card to make checkout faster</p>
            <button 
              onClick={() => setIsAdding(true)}
              style={{ ...styles.addButton, marginTop: 16 }}
            >
              <Plus size={18} />
              Add Card
            </button>
          </div>
        )}

        <div style={styles.securitySection}>
          <Shield size={20} color={NEON_GREEN} />
          <div>
            <h4 style={styles.securityTitle}>Your payment info is secure</h4>
            <p style={styles.securityText}>
              We use industry-standard encryption to protect your payment information. 
              Your full card number is never stored on our servers.
            </p>
          </div>
        </div>
      </div>
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
    gridTemplateColumns: 'repeat(2, 1fr)',
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
  cardInputWrapper: {
    position: 'relative',
  },
  cardInputIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666666',
  },
  cardInput: {
    width: '100%',
    padding: '12px 14px 12px 44px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    letterSpacing: 2,
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
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 20,
    marginBottom: 32,
  },
  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  creditCard: {
    position: 'relative',
    padding: 24,
    borderRadius: 16,
    aspectRatio: '1.586',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  cardChip: {
    width: 45,
    height: 35,
    backgroundColor: '#d4af37',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.1)',
  },
  chipLines: {
    width: 28,
    height: 20,
    borderRadius: 4,
    background: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 4px, transparent 4px, transparent 8px)',
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: 3,
    color: '#FFFFFF',
    marginTop: 'auto',
    fontFamily: 'monospace',
  },
  cardBottom: {
    display: 'flex',
    gap: 24,
    alignItems: 'flex-end',
  },
  cardLabel: {
    fontSize: 9,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 12,
    fontWeight: 600,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  cardBrand: {
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: 700,
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  defaultIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  defaultText: {
    fontSize: 13,
    color: NEON_GREEN,
    fontWeight: 500,
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
  securitySection: {
    display: 'flex',
    gap: 16,
    padding: 20,
    backgroundColor: 'rgba(0, 255, 133, 0.03)',
    border: `1px solid rgba(0, 255, 133, 0.1)`,
    borderRadius: 12,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 6px 0',
  },
  securityText: {
    fontSize: 13,
    color: '#999999',
    margin: 0,
    lineHeight: 1.5,
  },
};
