import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequirePartner } from '../../hooks/useRole';
import { getProducts, getOrders, createOrder, getRetailPartnerByUserId } from '../../lib/db';
import { logEvent } from '../../lib/analytics';
import { Product, RetailPartner } from '../../lib/supabaseClient';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function RetailPartnerDashboard() {
  const { user, loading, authorized } = useRequirePartner();
  const [partner, setPartner] = useState<RetailPartner | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'cart' | 'orders'>('catalog');
  const [loadingData, setLoadingData] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (authorized && user) {
      loadData();
    }
  }, [authorized, user]);

  async function loadData() {
    try {
      const [productsData, ordersData, partnerData] = await Promise.all([
        getProducts(true),
        getOrders({ orderType: 'b2b', userId: user?.id }),
        getRetailPartnerByUserId(user?.id || ''),
      ]);

      setProducts(productsData);
      setOrders(ordersData || []);
      setPartner(partnerData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingData(false);
    }
  }

  function addToCart(product: Product) {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    
    logEvent('add_to_cart', { product_id: product.id, product_name: product.name });
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev => prev.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      ));
    }
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.product.wholesale_price_cents * item.quantity), 0);
  }

  async function placeOrder() {
    if (!user || cart.length === 0) return;
    
    setPlacingOrder(true);
    try {
      const items = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPriceCents: item.product.wholesale_price_cents,
      }));

      const order = await createOrder(user.id, 'b2b', items);
      
      await logEvent('b2b_order_created', { 
        order_id: order.id, 
        order_total: getCartTotal(),
        order_type: 'b2b',
      });

      setCart([]);
      setActiveTab('orders');
      loadData();
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading || !authorized) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}><p>Loading...</p></div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link href="/retail-partner/dashboard" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700' }}>DRIZZL WHOLESALE</Link>
          {partner && <span style={{ marginLeft: '12px', fontSize: '13px', opacity: 0.7 }}>| {partner.store_name}</span>}
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <button onClick={() => setActiveTab('catalog')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '13px', cursor: 'pointer', opacity: activeTab === 'catalog' ? 1 : 0.7 }}>Catalog</button>
          <button onClick={() => setActiveTab('cart')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '13px', cursor: 'pointer', opacity: activeTab === 'cart' ? 1 : 0.7, display: 'flex', alignItems: 'center', gap: '6px' }}>
            Cart {cart.length > 0 && <span style={{ background: '#fff', color: '#000', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', fontWeight: '600' }}>{cart.length}</span>}
          </button>
          <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '13px', cursor: 'pointer', opacity: activeTab === 'orders' ? 1 : 0.7 }}>Orders</button>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {activeTab === 'catalog' && (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Wholesale Catalog</h1>
              <p style={{ color: '#666', fontSize: '14px' }}>Browse products at wholesale pricing</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {loadingData ? (
                <p style={{ color: '#666' }}>Loading products...</p>
              ) : products.map(product => (
                <div key={product.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  {product.hero_image_url && (
                    <img src={product.hero_image_url} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{product.name}</h3>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>{product.category}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <p style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>Retail: ${(product.price_cents / 100).toFixed(2)}</p>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#1e7e34' }}>Wholesale: ${(product.wholesale_price_cents / 100).toFixed(2)}</p>
                      </div>
                      <span style={{ background: '#e6f4ea', color: '#1e7e34', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                        {Math.round((1 - product.wholesale_price_cents / product.price_cents) * 100)}% off
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'cart' && (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Your Cart</h1>
              <p style={{ color: '#666', fontSize: '14px' }}>{cart.length} items</p>
            </div>

            {cart.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '60px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <p style={{ color: '#666', marginBottom: '20px' }}>Your cart is empty</p>
                <button onClick={() => setActiveTab('catalog')} style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>Browse Catalog</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
                <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  {cart.map(item => (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #eee' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {item.product.hero_image_url && (
                          <img src={item.product.hero_image_url} alt={item.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                        )}
                        <div>
                          <p style={{ fontWeight: '600', fontSize: '14px' }}>{item.product.name}</p>
                          <p style={{ fontSize: '13px', color: '#666' }}>${(item.product.wholesale_price_cents / 100).toFixed(2)} each</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ width: '28px', height: '28px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '16px' }}>-</button>
                        <span style={{ fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{ width: '28px', height: '28px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '16px' }}>+</button>
                        <p style={{ fontWeight: '700', minWidth: '80px', textAlign: 'right' }}>${((item.product.wholesale_price_cents * item.quantity) / 100).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', height: 'fit-content' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Order Summary</h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#666' }}>Subtotal</span>
                    <span style={{ fontWeight: '600' }}>${(getCartTotal() / 100).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                    <span style={{ fontWeight: '700' }}>Total</span>
                    <span style={{ fontWeight: '700', fontSize: '20px' }}>${(getCartTotal() / 100).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={placeOrder}
                    disabled={placingOrder}
                    style={{ width: '100%', padding: '14px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: placingOrder ? 'default' : 'pointer', opacity: placingOrder ? 0.7 : 1 }}
                  >
                    {placingOrder ? 'Placing Order...' : 'Place B2B Order'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Your Orders</h1>
              <p style={{ color: '#666', fontSize: '14px' }}>{orders.length} orders</p>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Order ID</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Date</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Items</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Total</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingData ? (
                    <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No orders yet</td></tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '13px' }}>{order.id.slice(0, 8)}...</td>
                        <td style={{ padding: '16px', fontSize: '14px' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '16px', fontSize: '14px' }}>{order.order_items?.length || 0} items</td>
                        <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600' }}>${(order.total_cents / 100).toFixed(2)}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: getStatusColor(order.status).bg, color: getStatusColor(order.status).text }}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'paid': return { bg: '#e6f4ea', text: '#1e7e34' };
    case 'shipped': return { bg: '#e3f2fd', text: '#1565c0' };
    case 'delivered': return { bg: '#e8f5e9', text: '#2e7d32' };
    case 'cancelled': return { bg: '#fce8e6', text: '#c53929' };
    default: return { bg: '#fff3e0', text: '#e65100' };
  }
}
