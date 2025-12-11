import React, { useState } from 'react';
import PartnerLayout from '../../components/partner/PartnerLayout';
import {
  MapPin,
  Truck,
  Package,
  CheckCircle,
  Clock,
  ExternalLink,
  Bell,
  Mail,
  MessageSquare,
  Filter,
  Calendar,
  ChevronDown,
  Box,
  Scale,
  Layers,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

type OrderStatus = 'processing' | 'in_transit' | 'out_for_delivery' | 'delivered';

interface TrackingEvent {
  date: string;
  time: string;
  description: string;
  location?: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  sku: string;
}

interface ActiveOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  placedDate: string;
  estimatedDelivery: string;
  carrier: string;
  trackingNumber: string;
  currentLocation: string;
  estimatedArrival: string;
  items: OrderItem[];
  totalWeight: string;
  palletCount: number;
  trackingHistory: TrackingEvent[];
  completedSteps: number;
}

const timelineSteps = [
  { label: 'Order Placed', icon: Package },
  { label: 'Production', icon: Box },
  { label: 'Quality Check', icon: CheckCircle },
  { label: 'Shipped', icon: Truck },
  { label: 'Delivered', icon: MapPin },
];

const mockActiveOrders: ActiveOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-2847',
    status: 'in_transit',
    placedDate: 'Jan 15, 2025',
    estimatedDelivery: 'Jan 19, 2025',
    carrier: 'FedEx Freight',
    trackingNumber: '783910492',
    currentLocation: 'Phoenix, AZ',
    estimatedArrival: 'Jan 19, 2025 - 2:00 PM',
    items: [
      { name: 'Açaí Berry Smoothie Mix', quantity: 48, sku: 'ACAI-24OZ' },
      { name: 'Mango Jackfruit Blend', quantity: 36, sku: 'MANGO-24OZ' },
      { name: 'Strawberry Peach Fusion', quantity: 24, sku: 'STRW-24OZ' },
    ],
    totalWeight: '320 lbs',
    palletCount: 2,
    trackingHistory: [
      { date: 'Jan 18', time: '2:15 PM', description: 'Out for delivery', location: 'Los Angeles, CA' },
      { date: 'Jan 18', time: '9:30 AM', description: 'Arrived at distribution center', location: 'Los Angeles, CA' },
      { date: 'Jan 17', time: '6:45 PM', description: 'In transit from Phoenix', location: 'Phoenix, AZ' },
      { date: 'Jan 17', time: '8:00 AM', description: 'Departed sorting facility', location: 'Phoenix, AZ' },
      { date: 'Jan 16', time: '4:30 PM', description: 'Shipment picked up', location: 'Scottsdale, AZ' },
      { date: 'Jan 15', time: '10:00 AM', description: 'Order placed', location: 'Online' },
    ],
    completedSteps: 4,
  },
  {
    id: '2',
    orderNumber: 'ORD-2851',
    status: 'processing',
    placedDate: 'Jan 17, 2025',
    estimatedDelivery: 'Jan 24, 2025',
    carrier: 'FedEx Freight',
    trackingNumber: 'Pending',
    currentLocation: 'Scottsdale, AZ (Warehouse)',
    estimatedArrival: 'Jan 24, 2025',
    items: [
      { name: 'Coffee Mushroom Blend', quantity: 60, sku: 'COFF-24OZ' },
      { name: 'Matcha Energy Mix', quantity: 48, sku: 'MATC-24OZ' },
    ],
    totalWeight: '280 lbs',
    palletCount: 2,
    trackingHistory: [
      { date: 'Jan 18', time: '11:00 AM', description: 'Production in progress', location: 'Scottsdale, AZ' },
      { date: 'Jan 17', time: '2:00 PM', description: 'Order confirmed', location: 'Online' },
      { date: 'Jan 17', time: '9:30 AM', description: 'Order placed', location: 'Online' },
    ],
    completedSteps: 2,
  },
  {
    id: '3',
    orderNumber: 'ORD-2849',
    status: 'out_for_delivery',
    placedDate: 'Jan 14, 2025',
    estimatedDelivery: 'Jan 18, 2025',
    carrier: 'FedEx Freight',
    trackingNumber: '783910501',
    currentLocation: 'San Diego, CA',
    estimatedArrival: 'Today by 5:00 PM',
    items: [
      { name: 'Pink Pitaya Blend', quantity: 36, sku: 'PINK-24OZ' },
      { name: 'Nutty Monkey Mix', quantity: 24, sku: 'NUTT-24OZ' },
      { name: 'Chocolate Berry Fusion', quantity: 48, sku: 'CHOC-24OZ' },
    ],
    totalWeight: '400 lbs',
    palletCount: 3,
    trackingHistory: [
      { date: 'Jan 18', time: '8:00 AM', description: 'Out for delivery', location: 'San Diego, CA' },
      { date: 'Jan 18', time: '6:30 AM', description: 'On delivery vehicle', location: 'San Diego, CA' },
      { date: 'Jan 17', time: '10:00 PM', description: 'Arrived at local facility', location: 'San Diego, CA' },
      { date: 'Jan 17', time: '2:00 PM', description: 'In transit', location: 'Los Angeles, CA' },
      { date: 'Jan 16', time: '8:00 AM', description: 'Shipped', location: 'Phoenix, AZ' },
      { date: 'Jan 15', time: '3:00 PM', description: 'Quality check completed', location: 'Scottsdale, AZ' },
      { date: 'Jan 14', time: '11:00 AM', description: 'Order placed', location: 'Online' },
    ],
    completedSteps: 4,
  },
];

const mockHistoricalOrders = [
  { id: 'ORD-2820', date: 'Jan 10, 2025', deliveredDate: 'Jan 14, 2025', items: 5, total: 2850.00, status: 'delivered' },
  { id: 'ORD-2798', date: 'Jan 3, 2025', deliveredDate: 'Jan 8, 2025', items: 8, total: 4200.00, status: 'delivered' },
  { id: 'ORD-2776', date: 'Dec 28, 2024', deliveredDate: 'Jan 2, 2025', items: 6, total: 3100.00, status: 'delivered' },
  { id: 'ORD-2754', date: 'Dec 20, 2024', deliveredDate: 'Dec 26, 2024', items: 10, total: 5500.00, status: 'delivered' },
  { id: 'ORD-2732', date: 'Dec 15, 2024', deliveredDate: 'Dec 20, 2024', items: 4, total: 1800.00, status: 'delivered' },
];

function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'processing': return 'Processing';
    case 'in_transit': return 'In Transit';
    case 'out_for_delivery': return 'Out for Delivery';
    case 'delivered': return 'Delivered';
  }
}

function getStatusColor(status: OrderStatus): { bg: string; text: string } {
  switch (status) {
    case 'processing': return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' };
    case 'in_transit': return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' };
    case 'out_for_delivery': return { bg: 'rgba(139, 92, 246, 0.15)', text: '#8B5CF6' };
    case 'delivered': return { bg: 'rgba(0, 255, 133, 0.15)', text: NEON_GREEN };
  }
}

export default function TrackOrdersPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>('1');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('30');

  return (
    <PartnerLayout title="Track Orders" partnerName="Partner">
      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerIcon}>
              <MapPin size={28} color={NEON_GREEN} />
            </div>
            <div>
              <h1 style={styles.title}>Track Your Orders</h1>
              <p style={styles.subtitle}>Real-time GPS Tracking & Delivery Updates</p>
            </div>
          </div>

          <div style={styles.notificationCard}>
            <div style={styles.notificationHeader}>
              <Bell size={18} color={NEON_GREEN} />
              <span style={styles.notificationTitle}>Notification Preferences</span>
            </div>
            <div style={styles.toggleGroup}>
              <label style={styles.toggleLabel}>
                <div style={styles.toggleInfo}>
                  <Mail size={16} />
                  <span>Email Updates</span>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  style={{
                    ...styles.toggle,
                    backgroundColor: emailNotifications ? NEON_GREEN : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <span style={{
                    ...styles.toggleKnob,
                    transform: emailNotifications ? 'translateX(20px)' : 'translateX(2px)',
                  }} />
                </button>
              </label>
              <label style={styles.toggleLabel}>
                <div style={styles.toggleInfo}>
                  <MessageSquare size={16} />
                  <span>SMS Updates</span>
                </div>
                <button
                  onClick={() => setSmsNotifications(!smsNotifications)}
                  style={{
                    ...styles.toggle,
                    backgroundColor: smsNotifications ? NEON_GREEN : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <span style={{
                    ...styles.toggleKnob,
                    transform: smsNotifications ? 'translateX(20px)' : 'translateX(2px)',
                  }} />
                </button>
              </label>
            </div>
          </div>
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Active Orders</h2>
          <div style={styles.ordersGrid}>
            {mockActiveOrders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const statusColors = getStatusColor(order.status);
              
              return (
                <div key={order.id} style={styles.orderCard}>
                  <div 
                    style={styles.orderHeader}
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div style={styles.orderHeaderLeft}>
                      <span style={styles.orderNumber}>{order.orderNumber}</span>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: statusColors.bg,
                        color: statusColors.text,
                      }}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div style={styles.orderDates}>
                      <span style={styles.dateLabel}>Placed: {order.placedDate}</span>
                      <span style={styles.dateSeparator}>•</span>
                      <span style={styles.dateLabel}>Est. Delivery: {order.estimatedDelivery}</span>
                    </div>
                    <ChevronDown 
                      size={20} 
                      color="#666" 
                      style={{ 
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }} 
                    />
                  </div>

                  <div style={styles.timelineContainer}>
                    <div style={styles.timeline}>
                      {timelineSteps.map((step, index) => {
                        const isCompleted = index < order.completedSteps;
                        const isCurrent = index === order.completedSteps - 1;
                        const Icon = step.icon;
                        
                        return (
                          <div key={step.label} style={styles.timelineStep}>
                            <div style={{
                              ...styles.timelineIcon,
                              backgroundColor: isCompleted ? NEON_GREEN : 'rgba(255,255,255,0.1)',
                              border: isCurrent ? `2px solid ${NEON_GREEN}` : 'none',
                              boxShadow: isCurrent ? `0 0 12px ${NEON_GREEN}40` : 'none',
                            }}>
                              {isCurrent && order.status !== 'delivered' ? (
                                <Truck size={16} color="#000" />
                              ) : (
                                isCompleted ? (
                                  <CheckCircle size={16} color="#000" />
                                ) : (
                                  <Icon size={16} color="#666" />
                                )
                              )}
                            </div>
                            <span style={{
                              ...styles.timelineLabel,
                              color: isCompleted ? '#FFFFFF' : '#666666',
                            }}>
                              {step.label}
                            </span>
                            {index < timelineSteps.length - 1 && (
                              <div style={{
                                ...styles.timelineLine,
                                backgroundColor: index < order.completedSteps - 1 ? NEON_GREEN : 'rgba(255,255,255,0.1)',
                              }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={styles.orderDetails}>
                      <div style={styles.detailsGrid}>
                        <div style={styles.trackingSection}>
                          <h4 style={styles.detailTitle}>
                            <Truck size={16} color={NEON_GREEN} />
                            Live Tracking
                          </h4>
                          <div style={styles.trackingInfo}>
                            <div style={styles.trackingRow}>
                              <span style={styles.trackingLabel}>Carrier:</span>
                              <span style={styles.trackingValue}>{order.carrier}</span>
                            </div>
                            <div style={styles.trackingRow}>
                              <span style={styles.trackingLabel}>Tracking #:</span>
                              <span style={styles.trackingValue}>{order.trackingNumber}</span>
                            </div>
                            {order.trackingNumber !== 'Pending' && (
                              <a 
                                href={`https://www.fedex.com/fedextrack/?trknbr=${order.trackingNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={styles.trackButton}
                              >
                                <ExternalLink size={14} />
                                Track with FedEx
                              </a>
                            )}
                          </div>
                          
                          <div style={styles.mapPlaceholder}>
                            <MapPin size={32} color={NEON_GREEN} />
                            <span style={styles.mapText}>Live GPS tracking available</span>
                            <span style={styles.mapSubtext}>View real-time location on carrier website</span>
                          </div>

                          <div style={styles.locationInfo}>
                            <div style={styles.locationRow}>
                              <MapPin size={14} color={NEON_GREEN} />
                              <span style={styles.locationLabel}>Current Location:</span>
                              <span style={styles.locationValue}>{order.currentLocation}</span>
                            </div>
                            <div style={styles.locationRow}>
                              <Clock size={14} color="#F59E0B" />
                              <span style={styles.locationLabel}>Est. Arrival:</span>
                              <span style={styles.locationValue}>{order.estimatedArrival}</span>
                            </div>
                          </div>
                        </div>

                        <div style={styles.contentsSection}>
                          <h4 style={styles.detailTitle}>
                            <Package size={16} color={NEON_GREEN} />
                            Order Contents
                          </h4>
                          <div style={styles.itemsList}>
                            {order.items.map((item, idx) => (
                              <div key={idx} style={styles.itemRow}>
                                <span style={styles.itemName}>{item.name}</span>
                                <span style={styles.itemQty}>×{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div style={styles.shipmentInfo}>
                            <div style={styles.shipmentRow}>
                              <Scale size={14} />
                              <span>Total Weight: {order.totalWeight}</span>
                            </div>
                            <div style={styles.shipmentRow}>
                              <Layers size={14} />
                              <span>Pallets: {order.palletCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={styles.historySection}>
                        <h4 style={styles.detailTitle}>
                          <Clock size={16} color={NEON_GREEN} />
                          Tracking History
                        </h4>
                        <div style={styles.historyList}>
                          {order.trackingHistory.map((event, idx) => (
                            <div key={idx} style={styles.historyItem}>
                              <div style={styles.historyCheck}>
                                <CheckCircle size={14} color={NEON_GREEN} />
                              </div>
                              <div style={styles.historyContent}>
                                <div style={styles.historyTime}>
                                  {event.date}, {event.time}
                                </div>
                                <div style={styles.historyDesc}>{event.description}</div>
                                {event.location && (
                                  <div style={styles.historyLocation}>{event.location}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.historicalHeader}>
            <h2 style={styles.sectionTitle}>Delivery History</h2>
            <div style={styles.filters}>
              <div style={styles.filterGroup}>
                <Filter size={14} />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">All Status</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div style={styles.filterGroup}>
                <Calendar size={14} />
                <select 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="30">Last 30 Days</option>
                  <option value="60">Last 60 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
          </div>

          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Order Date</th>
                  <th style={styles.th}>Delivered Date</th>
                  <th style={styles.th}>Items</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockHistoricalOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={styles.td}>
                      <span style={styles.orderId}>{order.id}</span>
                    </td>
                    <td style={styles.td}>{order.date}</td>
                    <td style={styles.td}>{order.deliveredDate}</td>
                    <td style={styles.td}>{order.items} products</td>
                    <td style={styles.td}>${order.total.toLocaleString()}</td>
                    <td style={styles.td}>
                      <span style={styles.deliveredBadge}>
                        <CheckCircle size={12} />
                        Delivered
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
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
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 24,
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 14,
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
  notificationCard: {
    padding: 16,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    minWidth: 280,
  },
  notificationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  toggleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  toggleInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#999999',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s',
  },
  toggleKnob: {
    position: 'absolute',
    top: 2,
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    transition: 'transform 0.2s',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  ordersGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  orderCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  orderHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    cursor: 'pointer',
    flexWrap: 'wrap',
    gap: 12,
  },
  orderHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
  },
  orderDates: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#666666',
  },
  dateLabel: {},
  dateSeparator: {},
  timelineContainer: {
    padding: '0 20px 20px',
  },
  timeline: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
  },
  timelineStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    position: 'relative',
  },
  timelineIcon: {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    zIndex: 2,
  },
  timelineLabel: {
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 80,
  },
  timelineLine: {
    position: 'absolute',
    top: 18,
    left: 'calc(50% + 18px)',
    right: 'calc(-50% + 18px)',
    height: 2,
    zIndex: 1,
  },
  orderDetails: {
    padding: '0 20px 20px',
    borderTop: `1px solid ${CARD_BORDER}`,
    marginTop: 4,
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginTop: 20,
  },
  trackingSection: {},
  contentsSection: {},
  detailTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  trackingInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  trackingRow: {
    display: 'flex',
    gap: 8,
  },
  trackingLabel: {
    fontSize: 13,
    color: '#666666',
  },
  trackingValue: {
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  trackButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    textDecoration: 'none',
    marginTop: 4,
    width: 'fit-content',
  },
  mapPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 255, 133, 0.05)',
    border: `1px dashed rgba(0, 255, 133, 0.3)`,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  mapText: {
    fontSize: 14,
    fontWeight: 500,
    color: NEON_GREEN,
  },
  mapSubtext: {
    fontSize: 12,
    color: '#666666',
  },
  locationInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
  },
  locationLabel: {
    color: '#666666',
  },
  locationValue: {
    color: '#FFFFFF',
    fontWeight: 500,
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 6,
  },
  itemName: {
    fontSize: 13,
    color: '#CCCCCC',
  },
  itemQty: {
    fontSize: 13,
    color: NEON_GREEN,
    fontWeight: 600,
  },
  shipmentInfo: {
    display: 'flex',
    gap: 20,
  },
  shipmentRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: '#888888',
  },
  historySection: {
    marginTop: 24,
    paddingTop: 20,
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginLeft: 8,
    borderLeft: `2px solid rgba(0, 255, 133, 0.3)`,
    paddingLeft: 20,
  },
  historyItem: {
    display: 'flex',
    gap: 12,
    position: 'relative',
  },
  historyCheck: {
    position: 'absolute',
    left: -28,
    backgroundColor: '#000',
    padding: 2,
  },
  historyContent: {},
  historyTime: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  historyDesc: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 500,
  },
  historyLocation: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  historicalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 16,
  },
  filters: {
    display: 'flex',
    gap: 12,
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#999999',
  },
  filterSelect: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#FFFFFF',
    fontSize: 13,
    cursor: 'pointer',
    outline: 'none',
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
  },
  orderId: {
    fontFamily: 'monospace',
    color: NEON_GREEN,
  },
  deliveredBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 500,
  },
};
