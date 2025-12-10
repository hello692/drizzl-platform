import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  ChevronDown,
  MapPin,
  Calendar,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  tracking?: string;
  address: string;
}

const orders: Order[] = [
  { 
    id: 'ORD-78542', 
    date: 'Dec 8, 2025', 
    items: [
      { name: 'Strawberry Peach Smoothie', quantity: 2, price: 29.99, image: '/products/strawberry-peach/Strawbery peach-TG-1.jpg' },
      { name: 'Mango Jackfruit Blend', quantity: 1, price: 29.99, image: '/products/mango-jackfruit/Mango Jackfruit-1.png' },
    ],
    total: 89.97, 
    status: 'Delivered',
    tracking: '1Z999AA10123456784',
    address: '123 Main St, New York, NY 10001'
  },
  { 
    id: 'ORD-78401', 
    date: 'Dec 3, 2025', 
    items: [
      { name: 'Coffee Mushroom Blend', quantity: 3, price: 14.99, image: '/products/coffee-mushroom/Coffee Mushroom-1.png' },
    ],
    total: 44.97, 
    status: 'Shipped',
    tracking: '1Z999AA10123456785',
    address: '123 Main St, New York, NY 10001'
  },
  { 
    id: 'ORD-78256', 
    date: 'Nov 28, 2025', 
    items: [
      { name: 'Açai Berry Bowl Mix', quantity: 4, price: 14.99, image: '/products/acai/Acai-1.png' },
    ],
    total: 59.96, 
    status: 'Delivered',
    tracking: '1Z999AA10123456786',
    address: '123 Main St, New York, NY 10001'
  },
  { 
    id: 'ORD-78124', 
    date: 'Nov 20, 2025', 
    items: [
      { name: 'Matcha Green Smoothie', quantity: 2, price: 14.99, image: '/products/matcha/Matcha-1.png' },
      { name: 'Chocolate Berry Blend', quantity: 2, price: 14.99, image: '/products/chocolate-berry/Chocolate Berry-1.png' },
    ],
    total: 59.96, 
    status: 'Delivered',
    tracking: '1Z999AA10123456787',
    address: '456 Oak Ave, Brooklyn, NY 11201'
  },
  { 
    id: 'ORD-78001', 
    date: 'Nov 15, 2025', 
    items: [
      { name: 'Almond Butter Smoothie', quantity: 6, price: 14.99, image: '/products/almond/Almond-1.png' },
    ],
    total: 89.94, 
    status: 'Delivered',
    tracking: '1Z999AA10123456788',
    address: '123 Main St, New York, NY 10001'
  },
  { 
    id: 'ORD-77892', 
    date: 'Nov 8, 2025', 
    items: [
      { name: 'Pink Pitaya Bowl Mix', quantity: 3, price: 14.99, image: '/products/pink-piyata/Pink Piyata-1.png' },
    ],
    total: 44.97, 
    status: 'Delivered',
    tracking: '1Z999AA10123456789',
    address: '123 Main St, New York, NY 10001'
  },
  { 
    id: 'ORD-77756', 
    date: 'Oct 30, 2025', 
    items: [
      { name: 'Nutty Monkey Blend', quantity: 2, price: 14.99, image: '/products/nutty-monkey/Nutty Monkey-1.png' },
    ],
    total: 29.98, 
    status: 'Cancelled',
    address: '123 Main St, New York, NY 10001'
  },
];

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  Processing: { icon: Clock, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  Shipped: { icon: Truck, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  Delivered: { icon: CheckCircle, color: NEON_GREEN, bg: 'rgba(0, 255, 133, 0.1)' },
  Cancelled: { icon: X, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export default function CustomerOrders() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('customerSession');
    if (!session) {
      router.push('/account/login');
    }
  }, [router]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <CustomerLayout title="Orders">
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Order History</h1>
            <p style={styles.subtitle}>View and track all your orders</p>
          </div>
        </div>

        <div style={styles.filters}>
          <div style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
          >
            <option value="All">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div style={styles.ordersGrid}>
          {filteredOrders.map((order) => {
            const statusInfo = statusConfig[order.status];
            const StatusIcon = statusInfo.icon;
            const isExpanded = expandedOrder === order.id;

            return (
              <div key={order.id} style={styles.orderCard}>
                <div 
                  style={styles.orderHeader}
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div style={styles.orderHeaderLeft}>
                    <span style={styles.orderId}>{order.id}</span>
                    <div style={styles.orderMeta}>
                      <Calendar size={14} />
                      <span>{order.date}</span>
                    </div>
                  </div>
                  <div style={styles.orderHeaderRight}>
                    <div style={{ ...styles.orderStatus, backgroundColor: statusInfo.bg }}>
                      <StatusIcon size={14} color={statusInfo.color} />
                      <span style={{ color: statusInfo.color }}>{order.status}</span>
                    </div>
                    <ChevronDown 
                      size={20} 
                      style={{ 
                        color: '#666666',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }} 
                    />
                  </div>
                </div>

                <div style={styles.orderItems}>
                  {order.items.slice(0, isExpanded ? undefined : 2).map((item, idx) => (
                    <div key={idx} style={styles.orderItem}>
                      <div style={styles.itemImage}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={styles.itemInfo}>
                        <span style={styles.itemName}>{item.name}</span>
                        <span style={styles.itemDetails}>Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                      </div>
                      <span style={styles.itemTotal}>${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                  {!isExpanded && order.items.length > 2 && (
                    <span style={styles.moreItems}>+{order.items.length - 2} more items</span>
                  )}
                </div>

                {isExpanded && (
                  <div style={styles.orderDetails}>
                    <div style={styles.detailRow}>
                      <MapPin size={16} color="#666666" />
                      <div>
                        <span style={styles.detailLabel}>Shipping Address</span>
                        <span style={styles.detailValue}>{order.address}</span>
                      </div>
                    </div>
                    {order.tracking && (
                      <div style={styles.detailRow}>
                        <Package size={16} color="#666666" />
                        <div>
                          <span style={styles.detailLabel}>Tracking Number</span>
                          <span style={styles.detailValue}>{order.tracking}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div style={styles.orderFooter}>
                  <span style={styles.orderTotal}>Total: ${order.total.toFixed(2)}</span>
                  {order.status === 'Shipped' && order.tracking && (
                    <button style={styles.trackButton}>
                      <Truck size={16} />
                      Track Package
                    </button>
                  )}
                  {order.status === 'Delivered' && (
                    <button style={styles.reorderButton}>
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div style={styles.emptyState}>
            <Package size={48} color="#333333" />
            <h3 style={styles.emptyTitle}>No orders found</h3>
            <p style={styles.emptyText}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 900,
    margin: '0 auto',
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
  filters: {
    display: 'flex',
    gap: 12,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: 200,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666666',
  },
  searchInput: {
    width: '100%',
    padding: '12px 14px 12px 44px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
  },
  select: {
    padding: '12px 16px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    cursor: 'pointer',
    minWidth: 140,
  },
  ordersGrid: {
    display: 'flex',
    flexDirection: 'column',
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
    alignItems: 'center',
    padding: 16,
    cursor: 'pointer',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  orderHeaderLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  orderMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: '#666666',
  },
  orderHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  orderStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 13,
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
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  itemName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 500,
  },
  itemDetails: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  moreItems: {
    fontSize: 13,
    color: '#666666',
    fontStyle: 'italic',
  },
  orderDetails: {
    padding: '0 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 8,
  },
  detailLabel: {
    display: 'block',
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  detailValue: {
    display: 'block',
    fontSize: 13,
    color: '#FFFFFF',
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
  trackButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: 8,
    color: '#3B82F6',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },
  reorderButton: {
    padding: '10px 20px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 8,
    color: '#000000',
    fontSize: 13,
    fontWeight: 600,
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
};
