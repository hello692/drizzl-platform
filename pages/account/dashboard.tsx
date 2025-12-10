import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CustomerLayout, { CustomerSession } from '../../components/customer/CustomerLayout';
import {
  ShoppingBag,
  Gift,
  RefreshCw,
  Heart,
  ArrowRight,
  Package,
  Truck,
  CheckCircle,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

const recentOrders = [
  { 
    id: 'ORD-78542', 
    date: 'Dec 8, 2025', 
    items: [
      { name: 'Strawberry Peach Smoothie', quantity: 2, image: '/products/strawberry-peach/Strawbery peach-TG-1.jpg' },
      { name: 'Mango Jackfruit Blend', quantity: 1, image: '/products/mango-jackfruit/Mango Jackfruit-1.png' },
    ],
    total: 89.97, 
    status: 'Delivered' 
  },
  { 
    id: 'ORD-78401', 
    date: 'Dec 3, 2025', 
    items: [
      { name: 'Coffee Mushroom Blend', quantity: 3, image: '/products/coffee-mushroom/Coffee Mushroom-1.png' },
    ],
    total: 44.97, 
    status: 'Shipped' 
  },
  { 
    id: 'ORD-78256', 
    date: 'Nov 28, 2025', 
    items: [
      { name: 'Açai Berry Bowl Mix', quantity: 4, image: '/products/acai/Acai-1.png' },
    ],
    total: 59.96, 
    status: 'Delivered' 
  },
];

const quickActions = [
  { label: 'Track Order', href: '/account/orders', icon: Truck },
  { label: 'Manage Subscriptions', href: '/account/subscriptions', icon: RefreshCw },
  { label: 'Earn Rewards', href: '/account/rewards', icon: Gift },
  { label: 'Update Address', href: '/account/addresses', icon: Package },
];

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  Delivered: { icon: CheckCircle, color: NEON_GREEN, bg: 'rgba(0, 255, 133, 0.1)' },
  Shipped: { icon: Truck, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  Processing: { icon: Package, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
};

export default function CustomerDashboard() {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerSession | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('customerSession');
    if (!session) {
      router.push('/account/login');
      return;
    }
    setCustomer(JSON.parse(session));
  }, [router]);

  if (!customer) return null;

  const stats = [
    { 
      label: 'Total Orders', 
      value: '12', 
      icon: ShoppingBag, 
      color: NEON_GREEN,
      bg: 'rgba(0, 255, 133, 0.1)',
    },
    { 
      label: 'Loyalty Points', 
      value: '1,240 pts', 
      subtext: '$12.40 value',
      icon: Gift, 
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.1)',
    },
    { 
      label: 'Active Subscriptions', 
      value: '2', 
      icon: RefreshCw, 
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.1)',
    },
    { 
      label: 'Saved Items', 
      value: '5', 
      icon: Heart, 
      color: '#EC4899',
      bg: 'rgba(236, 72, 153, 0.1)',
    },
  ];

  return (
    <CustomerLayout title="Dashboard">
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Welcome back, {customer.firstName}!</h1>
            <p style={styles.subtitle}>Here's what's happening with your account</p>
          </div>
          <Link href="/shop-all" style={styles.shopButton}>
            <ShoppingBag size={18} />
            Shop Now
          </Link>
        </div>

        <div style={styles.statsGrid}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} style={styles.statCard}>
                <div style={{ ...styles.statIcon, backgroundColor: stat.bg }}>
                  <Icon size={20} color={stat.color} />
                </div>
                <div style={styles.statContent}>
                  <span style={styles.statLabel}>{stat.label}</span>
                  <span style={styles.statValue}>{stat.value}</span>
                  {stat.subtext && (
                    <span style={styles.statSubtext}>{stat.subtext}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.quickActionsSection}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href} style={styles.quickAction}>
                  <Icon size={20} color={NEON_GREEN} />
                  <span>{action.label}</span>
                  <ArrowRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </Link>
              );
            })}
          </div>
        </div>

        <div style={styles.ordersSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Orders</h2>
            <Link href="/account/orders" style={styles.viewAllLink}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div style={styles.ordersGrid}>
            {recentOrders.map((order) => {
              const statusInfo = statusConfig[order.status];
              const StatusIcon = statusInfo.icon;
              return (
                <div key={order.id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <div>
                      <span style={styles.orderId}>{order.id}</span>
                      <span style={styles.orderDate}>{order.date}</span>
                    </div>
                    <div style={{ ...styles.orderStatus, backgroundColor: statusInfo.bg }}>
                      <StatusIcon size={14} color={statusInfo.color} />
                      <span style={{ color: statusInfo.color }}>{order.status}</span>
                    </div>
                  </div>
                  <div style={styles.orderItems}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={styles.orderItem}>
                        <div style={styles.itemImage}>
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={styles.itemInfo}>
                          <span style={styles.itemName}>{item.name}</span>
                          <span style={styles.itemQty}>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={styles.orderFooter}>
                    <span style={styles.orderTotal}>${order.total.toFixed(2)}</span>
                    <Link href={`/account/orders?id=${order.id}`} style={styles.viewOrderLink}>
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 1200,
    margin: '0 auto',
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
    marginTop: 8,
  },
  shopButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    textDecoration: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  statSubtext: {
    fontSize: 12,
    color: NEON_GREEN,
    marginTop: 2,
  },
  quickActionsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 16px 0',
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 12,
  },
  quickAction: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    color: '#FFFFFF',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  ordersSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: NEON_GREEN,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
  },
  ordersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 16,
  },
  orderCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  orderId: {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  orderDate: {
    display: 'block',
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  orderStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
  },
  orderItems: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemName: {
    fontSize: 13,
    color: '#FFFFFF',
  },
  itemQty: {
    fontSize: 12,
    color: '#666666',
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  viewOrderLink: {
    color: NEON_GREEN,
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
  },
};
