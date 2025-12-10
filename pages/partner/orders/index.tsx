import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PartnerLayout from '../../../components/partner/PartnerLayout';
import Link from 'next/link';
import {
  Search,
  Filter,
  Plus,
  Package,
  Eye,
  RotateCcw,
  ChevronDown,
  Calendar,
  X,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface Order {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  tracking?: string;
}

const allOrders: Order[] = [
  { id: 'ORD-2847', date: 'Dec 8, 2025', items: [{ name: 'Strawberry Peach Smoothie', quantity: 48, price: 85.00 }, { name: 'Mango Jackfruit Blend', quantity: 36, price: 65.00 }], total: 2450.00, status: 'Delivered', tracking: '1Z999AA10123456784' },
  { id: 'ORD-2831', date: 'Dec 5, 2025', items: [{ name: 'Açai Berry Bowl Mix', quantity: 24, price: 70.00 }], total: 1680.00, status: 'Shipped', tracking: '1Z999AA10123456785' },
  { id: 'ORD-2819', date: 'Dec 1, 2025', items: [{ name: 'Green Detox Blend', quantity: 60, price: 52.00 }], total: 3120.00, status: 'Delivered', tracking: '1Z999AA10123456786' },
  { id: 'ORD-2805', date: 'Nov 28, 2025', items: [{ name: 'Coffee Mushroom Blend', quantity: 20, price: 62.00 }], total: 1240.00, status: 'Delivered', tracking: '1Z999AA10123456787' },
  { id: 'ORD-2791', date: 'Nov 24, 2025', items: [{ name: 'Tropical Paradise Mix', quantity: 40, price: 52.00 }], total: 2080.00, status: 'Delivered', tracking: '1Z999AA10123456788' },
  { id: 'ORD-2778', date: 'Nov 20, 2025', items: [{ name: 'Strawberry Peach Smoothie', quantity: 36, price: 85.00 }], total: 3060.00, status: 'Delivered', tracking: '1Z999AA10123456789' },
  { id: 'ORD-2764', date: 'Nov 15, 2025', items: [{ name: 'Mango Jackfruit Blend', quantity: 24, price: 65.00 }], total: 1560.00, status: 'Delivered', tracking: '1Z999AA10123456790' },
  { id: 'ORD-2750', date: 'Nov 10, 2025', items: [{ name: 'Açai Berry Bowl Mix', quantity: 48, price: 70.00 }], total: 3360.00, status: 'Delivered', tracking: '1Z999AA10123456791' },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  Pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' },
  Processing: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' },
  Shipped: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8B5CF6' },
  Delivered: { bg: 'rgba(0, 255, 133, 0.1)', text: NEON_GREEN },
  Cancelled: { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444' },
};

export default function PartnerOrders() {
  const router = useRouter();
  const [partnerName, setPartnerName] = useState('Partner');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('partnerSession');
    if (!session) {
      router.push('/partner/login');
      return;
    }
    const data = JSON.parse(session);
    setPartnerName(data.businessName);
  }, [router]);

  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PartnerLayout title="Orders" partnerName={partnerName}>
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Order History</h1>
            <p style={styles.subtitle}>View and manage your wholesale orders</p>
          </div>
          <Link href="/partner/orders/new" style={styles.primaryButton}>
            <Plus size={18} />
            New Order
          </Link>
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

          <div style={styles.filterGroup}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.select}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Products</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td style={styles.td}>
                    <span style={styles.orderId}>{order.id}</span>
                  </td>
                  <td style={styles.td}>{order.date}</td>
                  <td style={styles.td}>
                    <div style={styles.productCell}>
                      {order.items.map((item, idx) => (
                        <span key={idx} style={styles.productName}>
                          {item.name} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.totalAmount}>${order.total.toLocaleString()}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: statusColors[order.status].bg,
                      color: statusColors[order.status].text,
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={styles.actionButton}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => router.push('/partner/orders/new')}
                        style={styles.actionButton}
                        title="Reorder"
                      >
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedOrder && (
          <div style={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} style={styles.closeButton}>
                  <X size={20} />
                </button>
              </div>

              <div style={styles.modalContent}>
                <div style={styles.orderInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Order ID</span>
                    <span style={styles.infoValue}>{selectedOrder.id}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Date</span>
                    <span style={styles.infoValue}>{selectedOrder.date}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Status</span>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: statusColors[selectedOrder.status].bg,
                      color: statusColors[selectedOrder.status].text,
                    }}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  {selectedOrder.tracking && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Tracking</span>
                      <span style={styles.trackingNumber}>{selectedOrder.tracking}</span>
                    </div>
                  )}
                </div>

                <h3 style={styles.itemsTitle}>Items</h3>
                <div style={styles.itemsList}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} style={styles.itemRow}>
                      <span style={styles.itemName}>{item.name}</span>
                      <span style={styles.itemQty}>x{item.quantity}</span>
                      <span style={styles.itemPrice}>${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.totalRow}>
                  <span>Total</span>
                  <span style={styles.totalValue}>${selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    router.push('/partner/orders/new');
                  }}
                  style={styles.reorderButton}
                >
                  <RotateCcw size={16} />
                  Reorder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PartnerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 32,
    maxWidth: 1400,
    margin: '0 auto',
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
    marginTop: 4,
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
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
    padding: '12px 12px 12px 44px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
  },
  filterGroup: {
    display: 'flex',
    gap: 12,
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
  },
  tableCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 500,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  td: {
    padding: '14px 16px',
    fontSize: 14,
    color: '#CCCCCC',
    borderBottom: `1px solid ${CARD_BORDER}`,
    verticalAlign: 'top',
  },
  orderId: {
    fontFamily: 'monospace',
    color: NEON_GREEN,
    fontWeight: 500,
  },
  productCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  productName: {
    fontSize: 13,
  },
  totalAmount: {
    fontWeight: 600,
    color: '#FFFFFF',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 500,
  },
  actions: {
    display: 'flex',
    gap: 8,
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 6,
    color: '#999999',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#111111',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  closeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666666',
    cursor: 'pointer',
  },
  modalContent: {
    padding: 24,
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 500,
  },
  trackingNumber: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#999999',
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 12px 0',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#CCCCCC',
  },
  itemQty: {
    fontSize: 13,
    color: '#666666',
    marginRight: 16,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTop: `1px solid ${CARD_BORDER}`,
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  totalValue: {
    color: NEON_GREEN,
  },
  modalFooter: {
    padding: '16px 24px',
    borderTop: `1px solid ${CARD_BORDER}`,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  reorderButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
