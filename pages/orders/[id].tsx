import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useRequireAuth } from '../../hooks/useAuth';
import { getOrderById } from '../../lib/db';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price_cents: number;
  products: {
    id: string;
    name: string;
    slug: string;
    hero_image_url?: string;
  } | null;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_cents: number;
  order_type: string;
  order_items: OrderItem[] | null;
  profiles?: {
    id: string;
    email: string;
    name?: string;
  } | null;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'paid':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="#22c55e" strokeWidth="1.5" />
          <path d="M6 10l3 3 5-5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'processing':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="#f59e0b" strokeWidth="1.5" />
          <path d="M10 5v5l3 3" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'shipped':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M1 5h12v9H1z" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M13 7h4l2 4v3h-6V7z" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="5" cy="16" r="2" stroke="#3b82f6" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="2" stroke="#3b82f6" strokeWidth="1.5" />
        </svg>
      );
    case 'delivered':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 1l3 3-8 8-4-4 3-3 1 1 5-5z" fill="#10b981" />
          <path d="M18 7l-8 8-2-2" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'cancelled':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="#ef4444" strokeWidth="1.5" />
          <path d="M6 6l8 8M14 6l-8 8" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="#9ca3af" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="3" fill="#9ca3af" />
        </svg>
      );
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return '#22c55e';
    case 'processing': return '#f59e0b';
    case 'shipped': return '#3b82f6';
    case 'delivered': return '#10b981';
    case 'cancelled': return '#ef4444';
    default: return '#9ca3af';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'paid': return 'Payment Confirmed';
    case 'processing': return 'Processing';
    case 'shipped': return 'Shipped';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export default function OrderDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useRequireAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && id && typeof id === 'string') {
      loadOrder(id);
    }
  }, [user, id]);

  async function loadOrder(orderId: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderById(orderId);
      if (data.user_id !== user?.id) {
        setError('Order not found');
        return;
      }
      setOrder(data as Order);
    } catch (err) {
      console.error('Error loading order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <main style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f0f0f0',
              borderTopColor: '#000',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }} />
            <p style={{ color: '#666', fontSize: '14px' }}>Loading order...</p>
          </div>
        </main>
        <Footer />
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <main style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#fef2f2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#dc2626" strokeWidth="1.5">
                <circle cx="14" cy="14" r="11" />
                <path d="M14 9v6M14 19v.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{error || 'Order not found'}</h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>We couldn't find the order you're looking for.</p>
            <Link href="/dashboard" style={{
              display: 'inline-block',
              padding: '12px 28px',
              background: '#000',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              Back to Dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '80vh',
        background: '#ffffff',
        padding: 'clamp(32px, 6vw, 80px) clamp(16px, 4vw, 60px)',
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <Link href="/dashboard" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#666',
            textDecoration: 'none',
            fontSize: '14px',
            marginBottom: '24px',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 4l-4 4 4 4" />
            </svg>
            Back to Dashboard
          </Link>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(24px, 5vw, 32px)',
                fontWeight: '700',
                letterSpacing: '-0.5px',
                marginBottom: '8px',
              }}>
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0,
              }}>
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: getStatusColor(order.status) + '15',
              borderRadius: '24px',
            }}>
              <StatusIcon status={order.status} />
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: getStatusColor(order.status),
              }}>
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>

          <div style={{
            background: '#fafafa',
            borderRadius: '16px',
            padding: 'clamp(20px, 4vw, 32px)',
            marginBottom: '24px',
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '20px',
            }}>
              Order Items
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              {order.order_items?.map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#fff',
                  borderRadius: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {item.products?.hero_image_url && (
                      <img 
                        src={item.products.hero_image_url} 
                        alt={item.products.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                    )}
                    <div>
                      <p style={{ fontWeight: '500', marginBottom: '4px' }}>{item.products?.name || 'Product'}</p>
                      <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p style={{ fontWeight: '600' }}>${((item.unit_price_cents * item.quantity) / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: '#fafafa',
            borderRadius: '16px',
            padding: 'clamp(20px, 4vw, 32px)',
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '20px',
            }}>
              Order Summary
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#666' }}>Subtotal</span>
                <span>${(order.total_cents / 100).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#666' }}>Shipping</span>
                <span>Free</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid #e8e8e8',
                fontSize: '16px',
                fontWeight: '600',
              }}>
                <span>Total</span>
                <span>${(order.total_cents / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '32px',
            textAlign: 'center',
          }}>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
              Need help with your order?
            </p>
            <Link href="/contact" style={{
              display: 'inline-block',
              padding: '12px 28px',
              background: '#f5f5f5',
              color: '#000',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
