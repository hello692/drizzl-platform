import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRequirePartner } from '../../hooks/useRole';
import { getProducts, getOrders, createOrder, getRetailPartnerByUserId } from '../../lib/db';
import { logEvent } from '../../lib/analytics';
import { Product, RetailPartner } from '../../lib/supabaseClient';

interface CartItem {
  product: Product;
  quantity: number;
}

interface Message {
  id: string;
  from: 'partner' | 'admin';
  text: string;
  timestamp: string;
  read: boolean;
}

interface RestockRecommendation {
  productId: string;
  productName: string;
  currentStock: number;
  recommendedQty: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  projectedSellout: string;
}

type TabType = 'dashboard' | 'catalog' | 'cart' | 'orders' | 'analytics' | 'messages' | 'pos' | 'restock';

export default function RetailPartnerDashboard() {
  const { user, loading, authorized } = useRequirePartner();
  const [partner, setPartner] = useState<RetailPartner | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loadingData, setLoadingData] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [posConnected, setPosConnected] = useState(false);
  const [posProvider, setPosProvider] = useState<string | null>(null);
  const [restockRecs, setRestockRecs] = useState<RestockRecommendation[]>([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (authorized && user) {
      loadData();
      loadMessages();
      loadRestockRecommendations();
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

  function loadMessages() {
    setMessages([
      { id: '1', from: 'admin', text: 'Welcome to Drizzl Wholesale! Your account has been approved. Feel free to reach out with any questions.', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true },
      { id: '2', from: 'admin', text: 'New summer collection is now available! Check out our Tropical Greens line.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
    ]);
  }

  function loadRestockRecommendations() {
    setRestockRecs([
      { productId: '1', productName: 'Berry Blast Smoothie', currentStock: 12, recommendedQty: 48, reason: 'High velocity - sells out within 3 days', priority: 'high', projectedSellout: '2 days' },
      { productId: '2', productName: 'Green Goddess', currentStock: 24, recommendedQty: 36, reason: 'Trending upward - 40% increase this week', priority: 'medium', projectedSellout: '5 days' },
      { productId: '3', productName: 'Tropical Sunrise', currentStock: 8, recommendedQty: 24, reason: 'Low stock alert - below safety threshold', priority: 'high', projectedSellout: '1 day' },
      { productId: '4', productName: 'Protein Power', currentStock: 36, recommendedQty: 24, reason: 'Steady demand pattern', priority: 'low', projectedSellout: '8 days' },
    ]);
  }

  function addToCart(product: Product) {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    logEvent('add_to_cart', { product_id: product.id, product_name: product.name });
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
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
      await logEvent('b2b_order_created', { order_id: order.id, order_total: getCartTotal(), order_type: 'b2b' });
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

  function sendMessage() {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), from: 'partner', text: newMessage, timestamp: new Date().toISOString(), read: true }]);
    setNewMessage('');
  }

  function addRestockToCart(rec: RestockRecommendation) {
    const product = products.find(p => p.name === rec.productName);
    if (product) {
      setCart(prev => {
        const existing = prev.find(item => item.product.id === product.id);
        if (existing) {
          return prev.map(item => item.product.id === product.id ? { ...item, quantity: rec.recommendedQty } : item);
        }
        return [...prev, { product, quantity: rec.recommendedQty }];
      });
      setActiveTab('cart');
    }
  }

  const analytics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_cents || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const monthlyOrders = orders.filter(o => new Date(o.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
    const weeklyOrders = orders.filter(o => new Date(o.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
    return { totalOrders, totalRevenue, avgOrderValue, monthlyOrders, weeklyOrders };
  }, [orders]);

  const unreadMessages = messages.filter(m => !m.read && m.from === 'admin').length;

  if (loading || !authorized) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Loading your portal...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.meshGradient} />
      <div style={styles.orbOne} />
      <div style={styles.orbTwo} />

      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.logoIcon}>D</div>
          <span style={styles.logoText}>DRIZZL WHOLESALE</span>
          {partner && <span style={styles.storeName}>| {partner.company_name || partner.store_name}</span>}
        </div>
        <div style={styles.navTabs}>
          {[
            { key: 'dashboard', label: 'Dashboard', icon: '◉' },
            { key: 'catalog', label: 'Catalog', icon: '◎' },
            { key: 'cart', label: `Cart${cart.length > 0 ? ` (${cart.length})` : ''}`, icon: '◈' },
            { key: 'orders', label: 'Orders', icon: '◆' },
            { key: 'analytics', label: 'Analytics', icon: '◇' },
            { key: 'messages', label: `Messages${unreadMessages > 0 ? ` (${unreadMessages})` : ''}`, icon: '◐' },
            { key: 'pos', label: 'POS Integration', icon: '◑' },
            { key: 'restock', label: 'Restock AI', icon: '◒' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as TabType)} style={{ ...styles.navTab, ...(activeTab === tab.key ? styles.navTabActive : {}) }}>
              <span style={styles.tabIcon}>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
        <div style={styles.navRight}>
          <div style={styles.timeDisplay}>
            <span style={styles.timeText}>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <span style={styles.dateText}>{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <Link href="/" style={styles.exitBtn}>Exit</Link>
        </div>
      </nav>

      <main style={styles.main}>
        {activeTab === 'dashboard' && <DashboardTab analytics={analytics} orders={orders} restockRecs={restockRecs} unreadMessages={unreadMessages} setActiveTab={setActiveTab} />}
        {activeTab === 'catalog' && <CatalogTab products={products} addToCart={addToCart} loadingData={loadingData} />}
        {activeTab === 'cart' && <CartTab cart={cart} updateQuantity={updateQuantity} getCartTotal={getCartTotal} placeOrder={placeOrder} placingOrder={placingOrder} />}
        {activeTab === 'orders' && <OrdersTab orders={orders} />}
        {activeTab === 'analytics' && <AnalyticsTab analytics={analytics} orders={orders} />}
        {activeTab === 'messages' && <MessagesTab messages={messages} newMessage={newMessage} setNewMessage={setNewMessage} sendMessage={sendMessage} />}
        {activeTab === 'pos' && <POSTab posConnected={posConnected} setPosConnected={setPosConnected} posProvider={posProvider} setPosProvider={setPosProvider} />}
        {activeTab === 'restock' && <RestockTab restockRecs={restockRecs} addRestockToCart={addRestockToCart} />}
      </main>

      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); } 50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); } }
      `}</style>
    </div>
  );
}

function DashboardTab({ analytics, orders, restockRecs, unreadMessages, setActiveTab }: any) {
  const urgentRestocks = restockRecs.filter((r: RestockRecommendation) => r.priority === 'high').length;
  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Partner Dashboard</h1>
        <p style={styles.pageSubtitle}>Welcome back! Here&apos;s your business overview.</p>
      </div>
      <div style={styles.statsGrid}>
        <StatCard label="Total Orders" value={analytics.totalOrders} color="#667eea" />
        <StatCard label="Total Revenue" value={`$${(analytics.totalRevenue / 100).toFixed(2)}`} color="#22c55e" />
        <StatCard label="Avg Order Value" value={`$${(analytics.avgOrderValue / 100).toFixed(2)}`} color="#f59e0b" />
        <StatCard label="Orders This Month" value={analytics.monthlyOrders} color="#06b6d4" />
      </div>
      <div style={styles.alertsRow}>
        {urgentRestocks > 0 && (
          <div style={styles.alertCard} onClick={() => setActiveTab('restock')}>
            <div style={styles.alertIcon}>!</div>
            <div><strong>{urgentRestocks} products</strong> need restocking</div>
            <span style={styles.alertLink}>View AI Recommendations →</span>
          </div>
        )}
        {unreadMessages > 0 && (
          <div style={{ ...styles.alertCard, borderColor: 'rgba(102, 126, 234, 0.3)' }} onClick={() => setActiveTab('messages')}>
            <div style={{ ...styles.alertIcon, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>✉</div>
            <div><strong>{unreadMessages} new messages</strong> from Drizzl</div>
            <span style={styles.alertLink}>Read Messages →</span>
          </div>
        )}
      </div>
      <div style={styles.sectionTitle}>Recent Orders</div>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Items</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order: any) => (
              <tr key={order.id} style={styles.tr}>
                <td style={styles.td}>{order.id?.slice(0, 8)}...</td>
                <td style={styles.td}>{new Date(order.created_at).toLocaleDateString()}</td>
                <td style={styles.td}>{order.order_items?.length || 0}</td>
                <td style={styles.td}>${((order.total_cents || 0) / 100).toFixed(2)}</td>
                <td style={styles.td}><span style={{ ...styles.statusBadge, background: order.status === 'delivered' ? '#22c55e' : order.status === 'shipped' ? '#3b82f6' : '#f59e0b' }}>{order.status}</span></td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={5} style={{ ...styles.td, textAlign: 'center', opacity: 0.5 }}>No orders yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statAccent, background: color }} />
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

function CatalogTab({ products, addToCart, loadingData }: any) {
  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Product Catalog</h1>
        <p style={styles.pageSubtitle}>Browse our wholesale products at partner pricing.</p>
      </div>
      {loadingData ? <p>Loading products...</p> : (
        <div style={styles.productGrid}>
          {products.map((product: Product) => (
            <div key={product.id} style={styles.productCard}>
              <div style={styles.productImage}>{product.name.charAt(0)}</div>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productPrice}>${(product.wholesale_price_cents / 100).toFixed(2)}<span style={styles.priceUnit}>/unit</span></p>
              <button style={styles.addBtn} onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CartTab({ cart, updateQuantity, getCartTotal, placeOrder, placingOrder }: any) {
  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Your Cart</h1>
        <p style={styles.pageSubtitle}>{cart.length} items in your wholesale order.</p>
      </div>
      {cart.length === 0 ? <p style={{ opacity: 0.5 }}>Your cart is empty. Browse the catalog to add products.</p> : (
        <>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>Product</th><th style={styles.th}>Unit Price</th><th style={styles.th}>Quantity</th><th style={styles.th}>Subtotal</th></tr></thead>
              <tbody>
                {cart.map((item: CartItem) => (
                  <tr key={item.product.id} style={styles.tr}>
                    <td style={styles.td}>{item.product.name}</td>
                    <td style={styles.td}>${(item.product.wholesale_price_cents / 100).toFixed(2)}</td>
                    <td style={styles.td}>
                      <div style={styles.qtyControl}>
                        <button style={styles.qtyBtn} onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                        <span style={styles.qtyValue}>{item.quantity}</span>
                        <button style={styles.qtyBtn} onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td style={styles.td}>${((item.product.wholesale_price_cents * item.quantity) / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={styles.cartFooter}>
            <div style={styles.cartTotal}>Total: <strong>${(getCartTotal() / 100).toFixed(2)}</strong></div>
            <button style={styles.placeOrderBtn} onClick={placeOrder} disabled={placingOrder}>{placingOrder ? 'Placing Order...' : 'Place Order'}</button>
          </div>
        </>
      )}
    </div>
  );
}

function OrdersTab({ orders }: any) {
  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Order History</h1>
        <p style={styles.pageSubtitle}>View all your past wholesale orders.</p>
      </div>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Order ID</th><th style={styles.th}>Date</th><th style={styles.th}>Items</th><th style={styles.th}>Total</th><th style={styles.th}>Status</th></tr></thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id} style={styles.tr}>
                <td style={styles.td}>{order.id?.slice(0, 8)}...</td>
                <td style={styles.td}>{new Date(order.created_at).toLocaleDateString()}</td>
                <td style={styles.td}>{order.order_items?.length || 0}</td>
                <td style={styles.td}>${((order.total_cents || 0) / 100).toFixed(2)}</td>
                <td style={styles.td}><span style={{ ...styles.statusBadge, background: order.status === 'delivered' ? '#22c55e' : order.status === 'shipped' ? '#3b82f6' : '#f59e0b' }}>{order.status}</span></td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={5} style={{ ...styles.td, textAlign: 'center', opacity: 0.5 }}>No orders yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsTab({ analytics, orders }: any) {
  const monthlyRevenue = orders.filter((o: any) => new Date(o.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).reduce((sum: number, o: any) => sum + (o.total_cents || 0), 0);
  const weeklyRevenue = orders.filter((o: any) => new Date(o.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).reduce((sum: number, o: any) => sum + (o.total_cents || 0), 0);
  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Analytics & Insights</h1>
        <p style={styles.pageSubtitle}>Track your sales performance and trends.</p>
      </div>
      <div style={styles.statsGrid}>
        <StatCard label="Total Revenue" value={`$${(analytics.totalRevenue / 100).toFixed(2)}`} color="#22c55e" />
        <StatCard label="This Month" value={`$${(monthlyRevenue / 100).toFixed(2)}`} color="#3b82f6" />
        <StatCard label="This Week" value={`$${(weeklyRevenue / 100).toFixed(2)}`} color="#8b5cf6" />
        <StatCard label="Avg Order Value" value={`$${(analytics.avgOrderValue / 100).toFixed(2)}`} color="#f59e0b" />
      </div>
      <div style={styles.chartSection}>
        <h3 style={styles.sectionTitle}>Sales Trend (Last 30 Days)</h3>
        <div style={styles.chartPlaceholder}>
          <div style={styles.chartBars}>
            {[65, 78, 52, 89, 95, 72, 88, 60, 75, 82, 90, 85].map((h, i) => (
              <div key={i} style={{ ...styles.chartBar, height: `${h}%` }} />
            ))}
          </div>
          <p style={styles.chartLabel}>Revenue performance over time</p>
        </div>
      </div>
      <div style={styles.insightCards}>
        <div style={styles.insightCard}>
          <h4 style={styles.insightTitle}>Top Selling Product</h4>
          <p style={styles.insightValue}>Berry Blast Smoothie</p>
          <p style={styles.insightDetail}>42 units sold this month</p>
        </div>
        <div style={styles.insightCard}>
          <h4 style={styles.insightTitle}>Growth Rate</h4>
          <p style={{ ...styles.insightValue, color: '#22c55e' }}>+18.5%</p>
          <p style={styles.insightDetail}>Compared to last month</p>
        </div>
        <div style={styles.insightCard}>
          <h4 style={styles.insightTitle}>Reorder Rate</h4>
          <p style={styles.insightValue}>78%</p>
          <p style={styles.insightDetail}>Customers who reordered</p>
        </div>
      </div>
    </div>
  );
}

function MessagesTab({ messages, newMessage, setNewMessage, sendMessage }: any) {
  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Messages</h1>
        <p style={styles.pageSubtitle}>Communicate with Drizzl Wellness team.</p>
      </div>
      <div style={styles.messagesContainer}>
        <div style={styles.messagesList}>
          {messages.map((msg: Message) => (
            <div key={msg.id} style={{ ...styles.messageCard, ...(msg.from === 'partner' ? styles.messagePartner : styles.messageAdmin) }}>
              <div style={styles.messageHeader}>
                <span style={styles.messageSender}>{msg.from === 'admin' ? 'Drizzl Team' : 'You'}</span>
                <span style={styles.messageTime}>{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
              <p style={styles.messageText}>{msg.text}</p>
            </div>
          ))}
        </div>
        <div style={styles.messageInput}>
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." style={styles.msgInput} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
          <button style={styles.sendBtn} onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

function POSTab({ posConnected, setPosConnected, posProvider, setPosProvider }: any) {
  const posProviders = [
    { id: 'square', name: 'Square', logo: '■' },
    { id: 'clover', name: 'Clover', logo: '☘' },
    { id: 'toast', name: 'Toast', logo: '◉' },
    { id: 'lightspeed', name: 'Lightspeed', logo: '⚡' },
    { id: 'shopify', name: 'Shopify POS', logo: '◈' },
  ];
  function connectPOS(provider: string) {
    setPosProvider(provider);
    setPosConnected(true);
  }
  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>POS Integration</h1>
        <p style={styles.pageSubtitle}>Connect your point-of-sale system for live inventory tracking.</p>
      </div>
      {!posConnected ? (
        <div>
          <h3 style={styles.sectionTitle}>Select Your POS Provider</h3>
          <div style={styles.posGrid}>
            {posProviders.map(p => (
              <button key={p.id} style={styles.posCard} onClick={() => connectPOS(p.id)}>
                <span style={styles.posLogo}>{p.logo}</span>
                <span style={styles.posName}>{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={styles.posConnectedCard}>
            <div style={styles.posStatus}>
              <span style={styles.statusDot} />
              Connected to {posProviders.find(p => p.id === posProvider)?.name}
            </div>
            <button style={styles.disconnectBtn} onClick={() => { setPosConnected(false); setPosProvider(null); }}>Disconnect</button>
          </div>
          <div style={styles.statsGrid}>
            <StatCard label="Items Sold Today" value="47" color="#22c55e" />
            <StatCard label="Revenue Today" value="$892" color="#3b82f6" />
            <StatCard label="Avg Transaction" value="$18.98" color="#f59e0b" />
            <StatCard label="Sync Status" value="Live" color="#10b981" />
          </div>
          <h3 style={styles.sectionTitle}>Live Transactions Feed</h3>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead><tr><th style={styles.th}>Time</th><th style={styles.th}>Product</th><th style={styles.th}>Qty</th><th style={styles.th}>Amount</th></tr></thead>
              <tbody>
                <tr style={styles.tr}><td style={styles.td}>2 min ago</td><td style={styles.td}>Berry Blast Smoothie</td><td style={styles.td}>2</td><td style={styles.td}>$15.98</td></tr>
                <tr style={styles.tr}><td style={styles.td}>8 min ago</td><td style={styles.td}>Green Goddess</td><td style={styles.td}>1</td><td style={styles.td}>$8.49</td></tr>
                <tr style={styles.tr}><td style={styles.td}>15 min ago</td><td style={styles.td}>Protein Power</td><td style={styles.td}>3</td><td style={styles.td}>$26.97</td></tr>
                <tr style={styles.tr}><td style={styles.td}>22 min ago</td><td style={styles.td}>Tropical Sunrise</td><td style={styles.td}>1</td><td style={styles.td}>$7.99</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function RestockTab({ restockRecs, addRestockToCart }: any) {
  const priorityColors: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Restock AI Automation</h1>
        <p style={styles.pageSubtitle}>AI-powered restocking recommendations based on your sales velocity.</p>
      </div>
      <div style={styles.restockInfo}>
        <div style={styles.aiIcon}>AI</div>
        <p>Our AI analyzes your POS data and order history to predict when you&apos;ll need to restock. Recommendations update automatically as new sales data comes in.</p>
      </div>
      <h3 style={styles.sectionTitle}>Restocking Recommendations</h3>
      <div style={styles.restockGrid}>
        {restockRecs.map((rec: RestockRecommendation) => (
          <div key={rec.productId} style={styles.restockCard}>
            <div style={styles.restockHeader}>
              <span style={{ ...styles.priorityBadge, background: priorityColors[rec.priority] }}>{rec.priority.toUpperCase()}</span>
              <span style={styles.selloutText}>Sells out in {rec.projectedSellout}</span>
            </div>
            <h4 style={styles.restockProduct}>{rec.productName}</h4>
            <p style={styles.restockReason}>{rec.reason}</p>
            <div style={styles.restockStats}>
              <div style={styles.restockStat}><span style={styles.restockStatLabel}>Current Stock</span><span style={styles.restockStatValue}>{rec.currentStock}</span></div>
              <div style={styles.restockStat}><span style={styles.restockStatLabel}>Recommended</span><span style={{ ...styles.restockStatValue, color: '#22c55e' }}>+{rec.recommendedQty}</span></div>
            </div>
            <button style={styles.restockBtn} onClick={() => addRestockToCart(rec)}>Add {rec.recommendedQty} to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: '#050505', color: '#fff', position: 'relative', overflow: 'hidden' },
  meshGradient: { position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 20% 20%, rgba(102, 126, 234, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(34, 197, 94, 0.06) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 0 },
  orbOne: { position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)', top: '-100px', right: '-100px', animation: 'float 20s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 },
  orbTwo: { position: 'fixed', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%)', bottom: '-50px', left: '-50px', animation: 'float 25s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 },
  loadingContainer: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#050505', gap: '20px' },
  loadingOrb: { width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #22c55e)', animation: 'pulse 2s infinite, glow 2s infinite' },
  loadingText: { color: 'rgba(255,255,255,0.5)', fontSize: '14px' },
  nav: { position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '60px', background: 'rgba(5, 5, 5, 0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  navBrand: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700' },
  logoText: { fontSize: '14px', fontWeight: '600', letterSpacing: '1px' },
  storeName: { fontSize: '12px', opacity: 0.6, marginLeft: '8px' },
  navTabs: { display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' },
  navTab: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' },
  navTabActive: { color: '#fff', background: 'rgba(34, 197, 94, 0.15)' },
  tabIcon: { fontSize: '10px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  timeDisplay: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  timeText: { fontSize: '13px', fontWeight: '500' },
  dateText: { fontSize: '10px', opacity: 0.5 },
  exitBtn: { padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '12px', textDecoration: 'none' },
  main: { position: 'relative', zIndex: 1, padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' },
  pageHeader: { marginBottom: '32px' },
  pageTitle: { fontSize: '32px', fontWeight: '700', margin: 0, marginBottom: '8px' },
  pageSubtitle: { fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' },
  statCard: { position: 'relative', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' },
  statAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', borderRadius: '4px 0 0 4px' },
  statLabel: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  statValue: { fontSize: '28px', fontWeight: '700', margin: 0 },
  alertsRow: { display: 'flex', gap: '16px', marginBottom: '32px' },
  alertCard: { flex: 1, display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', transition: 'all 0.2s' },
  alertIcon: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700' },
  alertLink: { marginLeft: 'auto', fontSize: '12px', color: '#ef4444' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px' },
  tableContainer: { background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '14px 20px', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)' },
  td: { padding: '14px 20px', fontSize: '13px' },
  statusBadge: { padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500', textTransform: 'capitalize' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
  productCard: { background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' },
  productImage: { width: '80px', height: '80px', borderRadius: '12px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700' },
  productName: { fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0' },
  productPrice: { fontSize: '18px', fontWeight: '700', color: '#22c55e', margin: '0 0 16px 0' },
  priceUnit: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '400' },
  addBtn: { width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: '8px' },
  qtyBtn: { width: '28px', height: '28px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', fontSize: '14px', cursor: 'pointer' },
  qtyValue: { fontSize: '14px', fontWeight: '600', minWidth: '24px', textAlign: 'center' },
  cartFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' },
  cartTotal: { fontSize: '18px' },
  placeOrderBtn: { padding: '12px 32px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  chartSection: { marginBottom: '32px' },
  chartPlaceholder: { background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '32px', border: '1px solid rgba(255,255,255,0.06)' },
  chartBars: { display: 'flex', alignItems: 'flex-end', gap: '12px', height: '150px' },
  chartBar: { flex: 1, background: 'linear-gradient(180deg, #22c55e, rgba(34, 197, 94, 0.3))', borderRadius: '4px 4px 0 0' },
  chartLabel: { textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '16px' },
  insightCards: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  insightCard: { background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' },
  insightTitle: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '0 0 8px 0', textTransform: 'uppercase' },
  insightValue: { fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' },
  insightDetail: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 },
  messagesContainer: { display: 'flex', flexDirection: 'column', height: '500px' },
  messagesList: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' },
  messageCard: { padding: '16px', borderRadius: '12px', maxWidth: '70%' },
  messageAdmin: { background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.2)', alignSelf: 'flex-start' },
  messagePartner: { background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', alignSelf: 'flex-end' },
  messageHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  messageSender: { fontSize: '12px', fontWeight: '600' },
  messageTime: { fontSize: '10px', color: 'rgba(255,255,255,0.4)' },
  messageText: { fontSize: '13px', margin: 0, lineHeight: 1.5 },
  messageInput: { display: 'flex', gap: '12px' },
  msgInput: { flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: '#fff', fontSize: '13px', outline: 'none' },
  sendBtn: { padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  posGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' },
  posCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s' },
  posLogo: { fontSize: '32px' },
  posName: { fontSize: '13px', fontWeight: '500' },
  posConnectedCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', marginBottom: '32px' },
  posStatus: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '500' },
  statusDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' },
  disconnectBtn: { padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', fontSize: '12px', cursor: 'pointer' },
  restockInfo: { display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '12px', background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.2)', marginBottom: '32px' },
  aiIcon: { width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  restockGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' },
  restockCard: { background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' },
  restockHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  priorityBadge: { padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '600' },
  selloutText: { fontSize: '11px', color: 'rgba(255,255,255,0.4)' },
  restockProduct: { fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' },
  restockReason: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '0 0 16px 0' },
  restockStats: { display: 'flex', gap: '24px', marginBottom: '16px' },
  restockStat: { display: 'flex', flexDirection: 'column', gap: '4px' },
  restockStatLabel: { fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' },
  restockStatValue: { fontSize: '18px', fontWeight: '700' },
  restockBtn: { width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
};
