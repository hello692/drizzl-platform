import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import {
  RefreshCw,
  Calendar,
  Pause,
  Play,
  X,
  Edit3,
  ChevronRight,
  AlertCircle,
  Check,
  Loader2,
} from 'lucide-react';
import { getCustomerSubscriptions } from '../../lib/api/customers';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface Subscription {
  id: string;
  product: {
    name: string;
    image: string;
    price: number;
  };
  frequency: string;
  nextDelivery: string;
  status: 'active' | 'paused' | 'cancelled';
  quantity: number;
  createdAt: string;
}

const mockSubscriptions: Subscription[] = [
  {
    id: 'SUB-1001',
    product: {
      name: 'Strawberry Peach Smoothie',
      image: '/products/strawberry-peach/Strawbery peach-TG-1.jpg',
      price: 29.99,
    },
    frequency: 'Every 2 weeks',
    nextDelivery: 'Dec 22, 2025',
    status: 'active',
    quantity: 4,
    createdAt: 'Oct 15, 2025',
  },
  {
    id: 'SUB-1002',
    product: {
      name: 'Coffee Mushroom Blend',
      image: '/products/coffee-mushroom/Coffee Mushroom-1.png',
      price: 14.99,
    },
    frequency: 'Monthly',
    nextDelivery: 'Jan 3, 2026',
    status: 'active',
    quantity: 6,
    createdAt: 'Nov 3, 2025',
  },
];

const frequencyMap: Record<string, string> = {
  weekly: 'Weekly',
  biweekly: 'Every 2 weeks',
  monthly: 'Monthly',
  bimonthly: 'Every 2 months',
};

export default function CustomerSubscriptions() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [confirmModal, setConfirmModal] = useState<{ id: string; action: string } | null>(null);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscriptions = async () => {
      const session = localStorage.getItem('customerSession');
      if (!session) {
        router.push('/account/login');
        return;
      }

      const parsedSession = JSON.parse(session);

      try {
        if (parsedSession.id && parsedSession.id !== 'demo-customer') {
          const dbSubscriptions = await getCustomerSubscriptions(parsedSession.id);
          
          if (dbSubscriptions && dbSubscriptions.length > 0) {
            const formattedSubscriptions: Subscription[] = dbSubscriptions.map(sub => {
              const nextDate = sub.next_billing_date ? new Date(sub.next_billing_date) : new Date();
              nextDate.setDate(nextDate.getDate() + 14);
              
              return {
                id: sub.id,
                product: {
                  name: (sub.items as any)?.[0]?.product_name || 'Smoothie Subscription',
                  image: (sub.items as any)?.[0]?.image || '/products/acai/Acai-1.png',
                  price: ((sub.items as any)?.[0]?.price_cents || 1499) / 100,
                },
                frequency: frequencyMap[sub.frequency] || sub.frequency || 'Monthly',
                nextDelivery: nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: sub.status as 'active' | 'paused' | 'cancelled',
                quantity: (sub.items as any)?.[0]?.quantity || 1,
                createdAt: new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              };
            });
            setSubscriptions(formattedSubscriptions);
          }
        }
      } catch (error) {
        console.error('Error loading subscriptions:', error);
      }
      
      setLoading(false);
    };

    loadSubscriptions();
  }, [router]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAction = (id: string, action: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id !== id) return sub;
      
      switch (action) {
        case 'pause':
          showToast('Subscription paused');
          return { ...sub, status: 'paused' as const };
        case 'resume':
          showToast('Subscription resumed');
          return { ...sub, status: 'active' as const };
        case 'cancel':
          showToast('Subscription cancelled');
          return { ...sub, status: 'cancelled' as const };
        case 'skip':
          showToast('Next delivery skipped');
          return sub;
        default:
          return sub;
      }
    }));
    setConfirmModal(null);
  };

  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const pausedCount = subscriptions.filter(s => s.status === 'paused').length;

  return (
    <CustomerLayout title="Subscriptions">
      <div style={styles.page}>
        {toast && (
          <div style={styles.toast}>
            <Check size={16} color={NEON_GREEN} />
            <span>{toast}</span>
          </div>
        )}

        {confirmModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3 style={styles.modalTitle}>
                {confirmModal.action === 'cancel' ? 'Cancel Subscription?' : 'Pause Subscription?'}
              </h3>
              <p style={styles.modalText}>
                {confirmModal.action === 'cancel' 
                  ? 'This will cancel your subscription. You can always resubscribe later.'
                  : 'Your subscription will be paused until you resume it.'}
              </p>
              <div style={styles.modalActions}>
                <button 
                  onClick={() => setConfirmModal(null)}
                  style={styles.modalCancel}
                >
                  Keep Subscription
                </button>
                <button 
                  onClick={() => handleAction(confirmModal.id, confirmModal.action)}
                  style={styles.modalConfirm}
                >
                  {confirmModal.action === 'cancel' ? 'Cancel' : 'Pause'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Subscriptions</h1>
            <p style={styles.subtitle}>Manage your recurring deliveries</p>
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statBadge}>
            <RefreshCw size={16} color={NEON_GREEN} />
            <span>{activeCount} Active</span>
          </div>
          {pausedCount > 0 && (
            <div style={{ ...styles.statBadge, backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
              <Pause size={16} color="#F59E0B" />
              <span style={{ color: '#F59E0B' }}>{pausedCount} Paused</span>
            </div>
          )}
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <Loader2 size={32} color={NEON_GREEN} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={styles.loadingText}>Loading your subscriptions...</p>
          </div>
        ) : (
          <div style={styles.subscriptionsGrid}>
            {subscriptions.map((sub) => (
              <div key={sub.id} style={styles.subscriptionCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.productImage}>
                    <img src={sub.product.image} alt={sub.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={styles.productInfo}>
                    <h3 style={styles.productName}>{sub.product.name}</h3>
                    <p style={styles.productMeta}>Qty: {sub.quantity} × ${sub.product.price.toFixed(2)}</p>
                    <div style={{
                      ...styles.statusBadge,
                      backgroundColor: sub.status === 'active' 
                        ? 'rgba(0, 255, 133, 0.1)' 
                        : sub.status === 'paused'
                        ? 'rgba(245, 158, 11, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                      color: sub.status === 'active' 
                        ? NEON_GREEN 
                        : sub.status === 'paused'
                        ? '#F59E0B'
                        : '#EF4444',
                    }}>
                      {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div style={styles.cardDetails}>
                  <div style={styles.detailRow}>
                    <Calendar size={16} color="#666666" />
                    <span style={styles.detailLabel}>Frequency:</span>
                    <span style={styles.detailValue}>{sub.frequency}</span>
                  </div>
                  {sub.status !== 'cancelled' && (
                    <div style={styles.detailRow}>
                      <RefreshCw size={16} color="#666666" />
                      <span style={styles.detailLabel}>Next delivery:</span>
                      <span style={styles.detailValue}>{sub.nextDelivery}</span>
                    </div>
                  )}
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Subtotal:</span>
                    <span style={styles.detailPrice}>${(sub.quantity * sub.product.price).toFixed(2)}</span>
                  </div>
                </div>

                {sub.status !== 'cancelled' && (
                  <div style={styles.cardActions}>
                    {sub.status === 'active' && (
                      <>
                        <button 
                          onClick={() => handleAction(sub.id, 'skip')}
                          style={styles.actionButton}
                        >
                          <Calendar size={16} />
                          Skip Next
                        </button>
                        <button 
                          onClick={() => setConfirmModal({ id: sub.id, action: 'pause' })}
                          style={styles.actionButton}
                        >
                          <Pause size={16} />
                          Pause
                        </button>
                      </>
                    )}
                    {sub.status === 'paused' && (
                      <button 
                        onClick={() => handleAction(sub.id, 'resume')}
                        style={{ ...styles.actionButton, borderColor: NEON_GREEN, color: NEON_GREEN }}
                      >
                        <Play size={16} />
                        Resume
                      </button>
                    )}
                    <button 
                      onClick={() => setConfirmModal({ id: sub.id, action: 'cancel' })}
                      style={{ ...styles.actionButton, borderColor: '#EF4444', color: '#EF4444' }}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                )}

                {sub.status === 'cancelled' && (
                  <div style={styles.cancelledNote}>
                    <AlertCircle size={16} />
                    <span>This subscription has been cancelled</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && subscriptions.length === 0 && (
          <div style={styles.emptyState}>
            <RefreshCw size={48} color="#333333" />
            <h3 style={styles.emptyTitle}>No subscriptions yet</h3>
            <p style={styles.emptyText}>Subscribe to your favorite products and save 15%</p>
          </div>
        )}

        <div style={styles.infoCard}>
          <h3 style={styles.infoTitle}>Subscription Benefits</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoBenefit}>
              <div style={styles.infoIcon}>💰</div>
              <div>
                <strong>Save 15%</strong>
                <p>On every subscription order</p>
              </div>
            </div>
            <div style={styles.infoBenefit}>
              <div style={styles.infoIcon}>🚚</div>
              <div>
                <strong>Free Shipping</strong>
                <p>On all subscription orders</p>
              </div>
            </div>
            <div style={styles.infoBenefit}>
              <div style={styles.infoIcon}>⏸️</div>
              <div>
                <strong>Flexible Control</strong>
                <p>Skip, pause, or cancel anytime</p>
              </div>
            </div>
            <div style={styles.infoBenefit}>
              <div style={styles.infoIcon}>🎁</div>
              <div>
                <strong>Exclusive Perks</strong>
                <p>Early access to new flavors</p>
              </div>
            </div>
          </div>
        </div>
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
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#111111',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 12px 0',
  },
  modalText: {
    fontSize: 14,
    color: '#999999',
    margin: '0 0 24px 0',
  },
  modalActions: {
    display: 'flex',
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  modalConfirm: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 8,
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  header: {
    marginBottom: 24,
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
  statsRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 24,
  },
  statBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 500,
    color: NEON_GREEN,
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
  subscriptionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    marginBottom: 32,
  },
  subscriptionCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    gap: 16,
    padding: 20,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    flexShrink: 0,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 6px 0',
  },
  productMeta: {
    fontSize: 13,
    color: '#666666',
    margin: '0 0 10px 0',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 500,
  },
  cardDetails: {
    padding: '0 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 14,
  },
  detailLabel: {
    color: '#666666',
  },
  detailValue: {
    color: '#FFFFFF',
  },
  detailPrice: {
    color: NEON_GREEN,
    fontWeight: 600,
    marginLeft: 'auto',
  },
  cardActions: {
    display: 'flex',
    gap: 10,
    padding: 16,
    borderTop: `1px solid ${CARD_BORDER}`,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  actionButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '10px 12px',
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cancelledNote: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderTop: `1px solid ${CARD_BORDER}`,
    color: '#666666',
    fontSize: 13,
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
  infoCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 20px 0',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
  },
  infoBenefit: {
    display: 'flex',
    gap: 12,
  },
  infoIcon: {
    fontSize: 24,
  },
};
