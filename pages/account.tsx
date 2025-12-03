import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRequireAuth } from '../hooks/useAuth';
import { signOut } from '../lib/auth';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_cents: number;
  order_items: {
    id: string;
    quantity: number;
    unit_price_cents: number;
    products: {
      id: string;
      name: string;
      slug: string;
    } | null;
  }[] | null;
}

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
}

export default function Account() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [profile, setProfile] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  async function loadUserData() {
    setLoadingData(true);
    try {
      const [ordersResult, profileResult] = await Promise.all([
        supabase
          .from('orders')
          .select(`
            id,
            created_at,
            status,
            total_cents,
            order_items (
              id,
              quantity,
              unit_price_cents,
              products:product_id (id, name, slug)
            )
          `)
          .eq('user_id', user?.id)
          .eq('order_type', 'd2c')
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('name, email')
          .eq('id', user?.id)
          .single()
      ]);

      if (ordersResult.data) {
        setOrders(ordersResult.data as unknown as Order[]);
      }
      if (profileResult.data) {
        setProfile(profileResult.data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
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
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#22c55e';
      case 'shipped': return '#3b82f6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '70vh', padding: '60px 20px', background: '#fafafa' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>My Account</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Manage your orders, addresses, and account settings</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }}>
            <div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
                  {(profile?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
                <p style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{profile?.name || 'Customer'}</p>
                <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>{user?.email}</p>
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                {[
                  { key: 'orders', label: 'Order History', icon: '📦' },
                  { key: 'addresses', label: 'Addresses', icon: '📍' },
                  { key: 'settings', label: 'Settings', icon: '⚙️' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      background: activeTab === tab.key ? '#f5f5f5' : 'transparent',
                      border: 'none',
                      borderLeft: activeTab === tab.key ? '3px solid #000' : '3px solid transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: activeTab === tab.key ? '600' : '400',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span>{tab.icon}</span> {tab.label}
                  </button>
                ))}
                <button
                  onClick={handleSignOut}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    background: 'transparent',
                    border: 'none',
                    borderTop: '1px solid #eee',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span>🚪</span> Sign Out
                </button>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              {activeTab === 'orders' && (
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Order History</h2>
                  
                  {loadingData ? (
                    <p style={{ color: '#666' }}>Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No orders yet</h3>
                      <p style={{ color: '#666', marginBottom: '24px' }}>Start shopping to see your orders here</p>
                      <Link href="/collections/smoothies" style={{ padding: '12px 24px', background: '#000', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
                        Shop Now
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {orders.map((order) => (
                        <div key={order.id} style={{ border: '1px solid #e8e8e8', borderRadius: '12px', padding: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div>
                              <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Order #{order.id.slice(0, 8)}</p>
                              <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <span style={{ fontWeight: '600' }}>${(order.total_cents / 100).toFixed(2)}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {order.order_items?.map((item) => (
                              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f5f5f5', borderRadius: '8px', fontSize: '13px' }}>
                                <span>{item.products?.name || 'Product'}</span>
                                <span style={{ color: '#666' }}>x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Saved Addresses</h2>
                    <button style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                      Add Address
                    </button>
                  </div>
                  
                  {addresses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No addresses saved</h3>
                      <p style={{ color: '#666' }}>Add an address for faster checkout</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {addresses.map((addr) => (
                        <div key={addr.id} style={{ border: '1px solid #e8e8e8', borderRadius: '12px', padding: '20px' }}>
                          <p style={{ fontWeight: '600', marginBottom: '4px' }}>{addr.name}</p>
                          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Account Settings</h2>
                  
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Profile Information</h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Full Name</label>
                        <input
                          type="text"
                          defaultValue={profile?.name || ''}
                          style={{ width: '100%', padding: '12px 16px', border: '1px solid #d0d0d0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Email Address</label>
                        <input
                          type="email"
                          defaultValue={user?.email || ''}
                          disabled
                          style={{ width: '100%', padding: '12px 16px', border: '1px solid #d0d0d0', borderRadius: '8px', fontSize: '14px', background: '#f5f5f5', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Password</h3>
                    <button style={{ padding: '12px 24px', background: '#f5f5f5', color: '#000', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                      Change Password
                    </button>
                  </div>

                  <div style={{ paddingTop: '24px', borderTop: '1px solid #e8e8e8' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#dc2626' }}>Danger Zone</h3>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>Permanently delete your account and all associated data.</p>
                    <button style={{ padding: '12px 24px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
