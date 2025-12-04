import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRequireAuth } from '../hooks/useAuth';
import { getOrders, getUserProfile } from '../lib/db';
import { signOut } from '../lib/auth';

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
}

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  created_at?: string;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'paid':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#22c55e" strokeWidth="1.5" />
          <path d="M5 8l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'processing':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#f59e0b" strokeWidth="1.5" />
          <path d="M8 4v4l2.5 2.5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'shipped':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1 4h10v7H1z" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M11 6h3l2 3v3h-5V6z" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="4" cy="13" r="1.5" stroke="#3b82f6" strokeWidth="1.5" />
          <circle cx="13" cy="13" r="1.5" stroke="#3b82f6" strokeWidth="1.5" />
        </svg>
      );
    case 'delivered':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1l2 2-6 6-3-3 2-2 1 1 4-4z" fill="#10b981" />
          <path d="M14 6l-6 6-2-2" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'cancelled':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
          <path d="M5 5l6 6M11 5l-6 6" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#9ca3af" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2" fill="#9ca3af" />
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

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  async function loadDashboardData() {
    setLoadingData(true);
    setError(null);
    try {
      const [ordersData, profileData] = await Promise.all([
        getOrders({ userId: user?.id, orderType: 'd2c' }),
        getUserProfile(user?.id || '')
      ]);

      setOrders(ordersData as Order[]);
      setProfile(profileData as Profile);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load your data. Please try again.');
    } finally {
      setLoadingData(false);
    }
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading) {
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
            <p style={{ color: '#666', fontSize: '14px' }}>Loading...</p>
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

  const displayName = profile?.full_name || profile?.name || user?.email?.split('@')[0] || 'Customer';
  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Recently';

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '80vh',
        background: '#ffffff',
        padding: 'clamp(32px, 6vw, 80px) clamp(16px, 4vw, 60px)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <div style={{
            marginBottom: 'clamp(32px, 4vw, 48px)',
          }}>
            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: '700',
              letterSpacing: '-0.5px',
              marginBottom: '8px',
            }}>
              Welcome back, {displayName}
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: '#666',
              margin: 0,
            }}>
              Manage your orders and account details
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(20px, 3vw, 32px)',
            marginBottom: 'clamp(32px, 4vw, 48px)',
          }}>
            <div style={{
              background: '#fafafa',
              borderRadius: '16px',
              padding: 'clamp(20px, 3vw, 28px)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '22px',
                  fontWeight: '600',
                }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '16px', margin: '0 0 4px 0' }}>{displayName}</p>
                  <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>{user?.email}</p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '24px',
                paddingTop: '16px',
                borderTop: '1px solid #e8e8e8',
              }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Member Since</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>{memberSince}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Total Orders</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>{orders.length}</p>
                </div>
              </div>
            </div>

            <div style={{
              background: '#fafafa',
              borderRadius: '16px',
              padding: 'clamp(20px, 3vw, 28px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0' }}>Quick Actions</h3>
              <Link href="/account" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: '#fff',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#000',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background 0.2s',
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="5" r="3" />
                  <path d="M3 16v-1a6 6 0 0112 0v1" />
                </svg>
                Account Settings
              </Link>
              <Link href="/collections/smoothies" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: '#fff',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#000',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background 0.2s',
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 4h16l-1.5 9H2.5L1 4z" />
                  <circle cx="5" cy="16" r="1" fill="currentColor" />
                  <circle cx="13" cy="16" r="1" fill="currentColor" />
                </svg>
                Continue Shopping
              </Link>
              <button onClick={handleSignOut} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: '#fff',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                color: '#666',
                fontSize: '14px',
                fontWeight: '500',
                width: '100%',
                textAlign: 'left',
                transition: 'background 0.2s',
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 3H3v12h4" />
                  <path d="M11 6l4 3-4 3" />
                  <path d="M15 9H7" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'clamp(20px, 3vw, 28px)',
            }}>
              <h2 style={{
                fontSize: 'clamp(18px, 3vw, 22px)',
                fontWeight: '600',
                margin: 0,
              }}>
                Order History
              </h2>
              {orders.length > 0 && (
                <Link href="/account" style={{
                  fontSize: '14px',
                  color: '#666',
                  textDecoration: 'none',
                }}>
                  View All →
                </Link>
              )}
            </div>

            {error && (
              <div style={{
                padding: '16px 20px',
                background: '#fef2f2',
                borderRadius: '12px',
                marginBottom: '24px',
                color: '#dc2626',
                fontSize: '14px',
              }}>
                {error}
                <button 
                  onClick={loadDashboardData}
                  style={{
                    marginLeft: '12px',
                    padding: '4px 12px',
                    background: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {loadingData ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{
                    background: '#fafafa',
                    borderRadius: '12px',
                    padding: '24px',
                    animation: 'pulse 1.5s infinite',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ width: '120px', height: '16px', background: '#e8e8e8', borderRadius: '4px' }} />
                      <div style={{ width: '80px', height: '16px', background: '#e8e8e8', borderRadius: '4px' }} />
                    </div>
                    <div style={{ width: '200px', height: '14px', background: '#e8e8e8', borderRadius: '4px' }} />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: 'clamp(48px, 8vw, 80px) 24px',
                background: '#fafafa',
                borderRadius: '16px',
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: '#f0f0f0',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#999" strokeWidth="1.5">
                    <rect x="3" y="5" width="22" height="18" rx="2" />
                    <path d="M3 10h22" />
                    <path d="M10 15h8" />
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}>
                  No orders yet
                </h3>
                <p style={{
                  color: '#666',
                  fontSize: '14px',
                  marginBottom: '24px',
                  maxWidth: '280px',
                  margin: '0 auto 24px',
                  lineHeight: '1.5',
                }}>
                  When you place your first order, it will appear here for easy tracking.
                </p>
                <Link href="/collections/smoothies" style={{
                  display: 'inline-block',
                  padding: '12px 28px',
                  background: '#000',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                {orders.slice(0, 5).map((order) => (
                  <Link 
                    key={order.id}
                    href={`/orders/${order.id}`}
                    style={{
                      display: 'block',
                      background: '#fafafa',
                      borderRadius: '12px',
                      padding: 'clamp(16px, 3vw, 24px)',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'background 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fafafa';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}>
                      <div>
                        <p style={{
                          fontSize: '11px',
                          color: '#999',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '6px',
                        }}>
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p style={{
                          fontSize: '14px',
                          color: '#666',
                          margin: 0,
                        }}>
                          {new Date(order.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: getStatusColor(order.status) + '15',
                          borderRadius: '20px',
                        }}>
                          <StatusIcon status={order.status} />
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: getStatusColor(order.status),
                          }}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#000',
                        }}>
                          ${(order.total_cents / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {order.order_items && order.order_items.length > 0 && (
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}>
                        {order.order_items.slice(0, 3).map((item) => (
                          <div key={item.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            background: '#fff',
                            borderRadius: '6px',
                            fontSize: '13px',
                          }}>
                            <span style={{ color: '#000' }}>{item.products?.name || 'Product'}</span>
                            <span style={{ color: '#999' }}>×{item.quantity}</span>
                          </div>
                        ))}
                        {order.order_items.length > 3 && (
                          <div style={{
                            padding: '6px 12px',
                            background: '#fff',
                            borderRadius: '6px',
                            fontSize: '13px',
                            color: '#666',
                          }}>
                            +{order.order_items.length - 3} more
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '16px',
                      fontSize: '13px',
                      color: '#999',
                    }}>
                      <span>View Details</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 3l4 4-4 4" />
                      </svg>
                    </div>
                  </Link>
                ))}

                {orders.length > 5 && (
                  <Link href="/account" style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '16px',
                    fontSize: '14px',
                    color: '#666',
                    textDecoration: 'none',
                  }}>
                    View all {orders.length} orders →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
