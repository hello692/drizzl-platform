import React from 'react';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  XCircle,
  Truck,
  FileText,
  Phone,
  ClipboardList,
  BarChart3,
  Building2,
  Star,
  ChevronRight,
  ArrowUpRight,
  Box,
  MapPin,
  Calendar,
  Clock,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface KPICard {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'up' | 'down';
  subtitle?: string;
}

interface IngredientItem {
  id: string;
  name: string;
  currentStock: string;
  reorderLevel: string;
  status: 'OK' | 'Low' | 'Critical';
  lastUpdated: string;
}

interface PackagingItem {
  id: string;
  name: string;
  currentStock: string;
  reorderLevel: string;
  status: 'OK' | 'Low' | 'Critical';
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  items: number;
  total: string;
  status: 'Ordered' | 'In Transit' | 'Delivered';
  eta: string;
}

interface Supplier {
  id: string;
  name: string;
  rating: number;
  leadTime: string;
  onTimePercent: number;
  lastOrder: string;
}

interface LotRecord {
  id: string;
  batchNumber: string;
  ingredient: string;
  quantity: string;
  expiryDate: string;
  location: string;
}

interface ReorderAlert {
  id: string;
  item: string;
  currentStock: string;
  suggestedQty: string;
  urgency: 'critical' | 'high';
}

const kpiCards: KPICard[] = [
  { id: 'skus', label: 'Total SKUs', value: '156', icon: <Package size={20} /> },
  { id: 'low-stock', label: 'Low Stock Alerts', value: '8', icon: <AlertTriangle size={20} />, subtitle: 'items' },
  { id: 'reorder', label: 'Items to Reorder', value: '12', icon: <ShoppingCart size={20} />, subtitle: 'pending' },
  { id: 'value', label: 'Inventory Value', value: '$428,500', icon: <DollarSign size={20} />, change: '+5.2%', changeType: 'up' },
  { id: 'stockouts', label: 'Stockouts Today', value: '0', icon: <XCircle size={20} /> },
];

const ingredientInventory: IngredientItem[] = [
  { id: 'ing-001', name: 'Strawberry Base', currentStock: '180 kg', reorderLevel: '200 kg', status: 'Low', lastUpdated: 'Dec 10, 2025' },
  { id: 'ing-002', name: 'Mango Puree', currentStock: '320 kg', reorderLevel: '150 kg', status: 'OK', lastUpdated: 'Dec 9, 2025' },
  { id: 'ing-003', name: 'Acai Powder', currentStock: '45 kg', reorderLevel: '100 kg', status: 'Critical', lastUpdated: 'Dec 8, 2025' },
  { id: 'ing-004', name: 'Banana', currentStock: '250 kg', reorderLevel: '100 kg', status: 'OK', lastUpdated: 'Dec 10, 2025' },
  { id: 'ing-005', name: 'Spinach', currentStock: '85 kg', reorderLevel: '50 kg', status: 'OK', lastUpdated: 'Dec 9, 2025' },
  { id: 'ing-006', name: 'Kale', currentStock: '60 kg', reorderLevel: '80 kg', status: 'Low', lastUpdated: 'Dec 8, 2025' },
  { id: 'ing-007', name: 'Protein Powder', currentStock: '28 kg', reorderLevel: '75 kg', status: 'Critical', lastUpdated: 'Dec 7, 2025' },
  { id: 'ing-008', name: 'Almond Milk', currentStock: '450 L', reorderLevel: '200 L', status: 'OK', lastUpdated: 'Dec 10, 2025' },
  { id: 'ing-009', name: 'Coconut Water', currentStock: '380 L', reorderLevel: '150 L', status: 'OK', lastUpdated: 'Dec 9, 2025' },
  { id: 'ing-010', name: 'Honey', currentStock: '95 kg', reorderLevel: '60 kg', status: 'OK', lastUpdated: 'Dec 10, 2025' },
  { id: 'ing-011', name: 'Chia Seeds', currentStock: '35 kg', reorderLevel: '40 kg', status: 'Low', lastUpdated: 'Dec 8, 2025' },
  { id: 'ing-012', name: 'Flax Seeds', currentStock: '55 kg', reorderLevel: '30 kg', status: 'OK', lastUpdated: 'Dec 9, 2025' },
];

const packagingInventory: PackagingItem[] = [
  { id: 'pkg-001', name: '16oz Glass Bottles', currentStock: '4,500 units', reorderLevel: '5,000 units', status: 'Low' },
  { id: 'pkg-002', name: 'Aluminum Caps', currentStock: '8,200 units', reorderLevel: '5,000 units', status: 'OK' },
  { id: 'pkg-003', name: 'Labels (Small)', currentStock: '12,000 sheets', reorderLevel: '8,000 sheets', status: 'OK' },
  { id: 'pkg-004', name: 'Labels (Medium)', currentStock: '6,500 sheets', reorderLevel: '8,000 sheets', status: 'Low' },
  { id: 'pkg-005', name: 'Shrink Wrap', currentStock: '180 rolls', reorderLevel: '100 rolls', status: 'OK' },
  { id: 'pkg-006', name: 'Cardboard Boxes', currentStock: '2,800 units', reorderLevel: '2,000 units', status: 'OK' },
  { id: 'pkg-007', name: 'Shipping Labels', currentStock: '15,000 sheets', reorderLevel: '10,000 sheets', status: 'OK' },
  { id: 'pkg-008', name: 'Ice Packs', currentStock: '450 units', reorderLevel: '800 units', status: 'Critical' },
];

const purchaseOrders: PurchaseOrder[] = [
  { id: 'po-001', poNumber: 'PO-2025-1201', supplier: 'Organic Farms Co', items: 5, total: '$12,450', status: 'In Transit', eta: 'Dec 12, 2025' },
  { id: 'po-002', poNumber: 'PO-2025-1198', supplier: 'Pacific Packaging', items: 3, total: '$8,900', status: 'Delivered', eta: 'Dec 8, 2025' },
  { id: 'po-003', poNumber: 'PO-2025-1205', supplier: 'Berry Direct', items: 2, total: '$6,200', status: 'Ordered', eta: 'Dec 15, 2025' },
  { id: 'po-004', poNumber: 'PO-2025-1199', supplier: 'Protein Plus', items: 4, total: '$15,800', status: 'In Transit', eta: 'Dec 11, 2025' },
  { id: 'po-005', poNumber: 'PO-2025-1195', supplier: 'Eco Bottles', items: 6, total: '$22,100', status: 'Delivered', eta: 'Dec 6, 2025' },
  { id: 'po-006', poNumber: 'PO-2025-1208', supplier: 'Organic Farms Co', items: 3, total: '$9,750', status: 'Ordered', eta: 'Dec 18, 2025' },
];

const suppliers: Supplier[] = [
  { id: 'sup-001', name: 'Organic Farms Co', rating: 5, leadTime: '3-5 days', onTimePercent: 98, lastOrder: 'Dec 8, 2025' },
  { id: 'sup-002', name: 'Pacific Packaging', rating: 4, leadTime: '5-7 days', onTimePercent: 94, lastOrder: 'Dec 5, 2025' },
  { id: 'sup-003', name: 'Berry Direct', rating: 5, leadTime: '2-4 days', onTimePercent: 97, lastOrder: 'Dec 9, 2025' },
  { id: 'sup-004', name: 'Protein Plus', rating: 4, leadTime: '4-6 days', onTimePercent: 91, lastOrder: 'Dec 7, 2025' },
  { id: 'sup-005', name: 'Eco Bottles', rating: 5, leadTime: '7-10 days', onTimePercent: 96, lastOrder: 'Dec 3, 2025' },
];

const lotRecords: LotRecord[] = [
  { id: 'lot-001', batchNumber: 'LOT-2025-1210-A', ingredient: 'Strawberry Base', quantity: '500 kg', expiryDate: 'Mar 10, 2026', location: 'Warehouse A' },
  { id: 'lot-002', batchNumber: 'LOT-2025-1209-B', ingredient: 'Mango Puree', quantity: '480 kg', expiryDate: 'Mar 9, 2026', location: 'Warehouse A' },
  { id: 'lot-003', batchNumber: 'LOT-2025-1208-A', ingredient: 'Acai Powder', quantity: '120 kg', expiryDate: 'Jun 8, 2026', location: 'Warehouse B' },
  { id: 'lot-004', batchNumber: 'LOT-2025-1207-C', ingredient: 'Protein Powder', quantity: '200 kg', expiryDate: 'Sep 7, 2026', location: 'Warehouse B' },
  { id: 'lot-005', batchNumber: 'LOT-2025-1206-B', ingredient: 'Banana', quantity: '350 kg', expiryDate: 'Dec 20, 2025', location: 'Cold Storage' },
];

const reorderAlerts: ReorderAlert[] = [
  { id: 'alert-001', item: 'Protein Powder', currentStock: '28 kg', suggestedQty: '150 kg', urgency: 'critical' },
  { id: 'alert-002', item: 'Acai Powder', currentStock: '45 kg', suggestedQty: '100 kg', urgency: 'critical' },
  { id: 'alert-003', item: 'Ice Packs', currentStock: '450 units', suggestedQty: '500 units', urgency: 'critical' },
  { id: 'alert-004', item: 'Strawberry Base', currentStock: '180 kg', suggestedQty: '200 kg', urgency: 'high' },
  { id: 'alert-005', item: 'Kale', currentStock: '60 kg', suggestedQty: '80 kg', urgency: 'high' },
];

const quickActions = [
  { label: 'Create Purchase Order', icon: <ShoppingCart size={16} /> },
  { label: 'Adjust Inventory', icon: <ClipboardList size={16} /> },
  { label: 'Run Audit', icon: <BarChart3 size={16} /> },
  { label: 'Export Report', icon: <FileText size={16} /> },
  { label: 'Contact Supplier', icon: <Phone size={16} />, primary: true },
];

function getStatusColor(status: string): string {
  switch (status) {
    case 'OK':
    case 'Delivered':
      return NEON_GREEN;
    case 'Low':
    case 'In Transit':
    case 'Ordered':
      return '#FFA500';
    case 'Critical':
      return '#FF6B6B';
    default:
      return 'rgba(255,255,255,0.5)';
  }
}

function renderStars(rating: number) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          fill={star <= rating ? '#FFD700' : 'transparent'}
          color={star <= rating ? '#FFD700' : 'rgba(255,255,255,0.2)'}
        />
      ))}
    </div>
  );
}

export default function SupplyChainPage() {
  return (
    <CommandCenterLayout title="Supply Chain">
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.iconWrapper}>
            <Package size={24} color={NEON_GREEN} />
          </div>
          <div>
            <h1 style={styles.title}>Supply Chain</h1>
            <p style={styles.subtitle}>Inventory management and procurement</p>
          </div>
        </header>

        <div style={styles.quickActionsBar}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              style={{
                ...styles.quickActionBtn,
                ...(action.primary ? styles.quickActionBtnPrimary : {}),
              }}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <BarChart3 size={16} color={NEON_GREEN} />
            Inventory KPIs
          </h2>
          <div style={styles.kpiGrid}>
            {kpiCards.map((kpi) => (
              <div key={kpi.id} style={styles.kpiCard}>
                <div style={styles.kpiIcon}>{kpi.icon}</div>
                <div style={styles.kpiContent}>
                  <span style={styles.kpiLabel}>{kpi.label}</span>
                  <div style={styles.kpiValueRow}>
                    <span style={styles.kpiValue}>{kpi.value}</span>
                    {kpi.change && (
                      <span style={{ ...styles.kpiChange, color: kpi.changeType === 'up' ? NEON_GREEN : '#FF6B6B' }}>
                        <ArrowUpRight size={14} />
                        {kpi.change}
                      </span>
                    )}
                  </div>
                  {kpi.subtitle && <span style={styles.kpiSubtitle}>{kpi.subtitle}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={styles.twoColumnGrid}>
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <Package size={16} color={NEON_GREEN} />
                Ingredient Inventory
              </h3>
              <span style={styles.countBadge}>{ingredientInventory.length} items</span>
            </div>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Ingredient</th>
                    <th style={styles.th}>Current Stock</th>
                    <th style={styles.th}>Reorder Level</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientInventory.map((item) => (
                    <tr key={item.id} style={styles.tr}>
                      <td style={styles.td}>{item.name}</td>
                      <td style={styles.td}>{item.currentStock}</td>
                      <td style={styles.tdMuted}>{item.reorderLevel}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          background: `${getStatusColor(item.status)}20`,
                          color: getStatusColor(item.status),
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={styles.tdMuted}>{item.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <Box size={16} color={NEON_GREEN} />
                Packaging Inventory
              </h3>
              <span style={styles.countBadge}>{packagingInventory.length} items</span>
            </div>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Item</th>
                    <th style={styles.th}>Current Stock</th>
                    <th style={styles.th}>Reorder Level</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {packagingInventory.map((item) => (
                    <tr key={item.id} style={styles.tr}>
                      <td style={styles.td}>{item.name}</td>
                      <td style={styles.td}>{item.currentStock}</td>
                      <td style={styles.tdMuted}>{item.reorderLevel}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          background: `${getStatusColor(item.status)}20`,
                          color: getStatusColor(item.status),
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <Truck size={16} color={NEON_GREEN} />
              Active Purchase Orders
            </h3>
            <span style={styles.countBadge}>{purchaseOrders.length} orders</span>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>PO #</th>
                  <th style={styles.th}>Supplier</th>
                  <th style={styles.th}>Items</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>ETA</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((order) => (
                  <tr key={order.id} style={styles.tr}>
                    <td style={{ ...styles.td, color: NEON_GREEN, fontWeight: 500 }}>{order.poNumber}</td>
                    <td style={styles.td}>{order.supplier}</td>
                    <td style={styles.td}>{order.items}</td>
                    <td style={styles.td}>{order.total}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        background: `${getStatusColor(order.status)}20`,
                        color: getStatusColor(order.status),
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={styles.tdMuted}>{order.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <Building2 size={16} color={NEON_GREEN} />
              Supplier Management
            </h3>
            <button style={styles.viewAllBtn}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div style={styles.supplierGrid}>
            {suppliers.map((supplier) => (
              <div key={supplier.id} style={styles.supplierCard}>
                <div style={styles.supplierHeader}>
                  <span style={styles.supplierName}>{supplier.name}</span>
                  {renderStars(supplier.rating)}
                </div>
                <div style={styles.supplierMeta}>
                  <div style={styles.supplierMetaRow}>
                    <Clock size={12} color="rgba(255,255,255,0.4)" />
                    <span>Lead Time: {supplier.leadTime}</span>
                  </div>
                  <div style={styles.supplierMetaRow}>
                    <Truck size={12} color="rgba(255,255,255,0.4)" />
                    <span>On-Time: {supplier.onTimePercent}%</span>
                  </div>
                  <div style={styles.supplierMetaRow}>
                    <Calendar size={12} color="rgba(255,255,255,0.4)" />
                    <span>Last Order: {supplier.lastOrder}</span>
                  </div>
                </div>
                <div style={styles.supplierOnTime}>
                  <div style={styles.onTimeBar}>
                    <div style={{ ...styles.onTimeFill, width: `${supplier.onTimePercent}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={styles.twoColumnGrid}>
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <ClipboardList size={16} color={NEON_GREEN} />
                Lot Tracking
              </h3>
              <span style={styles.countBadge}>{lotRecords.length} recent lots</span>
            </div>
            <div style={styles.lotList}>
              {lotRecords.map((lot) => (
                <div key={lot.id} style={styles.lotRow}>
                  <div style={styles.lotInfo}>
                    <span style={styles.lotBatch}>{lot.batchNumber}</span>
                    <span style={styles.lotIngredient}>{lot.ingredient}</span>
                  </div>
                  <div style={styles.lotDetails}>
                    <span style={styles.lotDetail}>{lot.quantity}</span>
                    <span style={styles.lotDetail}>Exp: {lot.expiryDate}</span>
                    <div style={styles.lotLocation}>
                      <MapPin size={12} color="rgba(255,255,255,0.4)" />
                      <span>{lot.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <AlertTriangle size={16} color="#FF6B6B" />
                Reorder Alerts
              </h3>
              <span style={{ ...styles.countBadge, background: 'rgba(255,107,107,0.2)', color: '#FF6B6B' }}>
                {reorderAlerts.filter(a => a.urgency === 'critical').length} critical
              </span>
            </div>
            <div style={styles.alertList}>
              {reorderAlerts.map((alert) => (
                <div key={alert.id} style={{
                  ...styles.alertRow,
                  borderLeft: `3px solid ${alert.urgency === 'critical' ? '#FF6B6B' : '#FFA500'}`,
                }}>
                  <div style={styles.alertInfo}>
                    <div style={styles.alertHeader}>
                      <span style={styles.alertItem}>{alert.item}</span>
                      <span style={{
                        ...styles.urgencyBadge,
                        background: alert.urgency === 'critical' ? 'rgba(255,107,107,0.2)' : 'rgba(255,165,0,0.2)',
                        color: alert.urgency === 'critical' ? '#FF6B6B' : '#FFA500',
                      }}>
                        {alert.urgency.toUpperCase()}
                      </span>
                    </div>
                    <div style={styles.alertMeta}>
                      <span>Current: {alert.currentStock}</span>
                      <span style={{ color: NEON_GREEN }}>Suggested: {alert.suggestedQty}</span>
                    </div>
                  </div>
                  <button style={styles.reorderBtn}>
                    <ShoppingCart size={14} />
                    Reorder
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </CommandCenterLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1400,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    margin: '4px 0 0 0',
  },
  quickActionsBar: {
    display: 'flex',
    gap: 12,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 10,
    color: '#fff',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'Inter, sans-serif',
  },
  quickActionBtnPrimary: {
    background: `linear-gradient(135deg, ${NEON_GREEN}20 0%, ${NEON_GREEN}05 100%)`,
    border: `1px solid ${NEON_GREEN}40`,
    color: NEON_GREEN,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 16,
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
  },
  kpiCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
  },
  kpiIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: NEON_GREEN,
  },
  kpiContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  kpiLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  kpiValueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: 700,
    color: '#fff',
  },
  kpiChange: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    fontSize: 12,
    fontWeight: 500,
  },
  kpiSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 20,
    marginBottom: 20,
  },
  card: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    margin: 0,
  },
  countBadge: {
    fontSize: 12,
    padding: '4px 10px',
    background: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
    borderRadius: 20,
  },
  viewAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'transparent',
    border: 'none',
    color: NEON_GREEN,
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  tr: {
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  td: {
    padding: '12px',
    fontSize: 13,
    color: '#fff',
  },
  tdMuted: {
    padding: '12px',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  supplierGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
  },
  supplierCard: {
    background: 'rgba(255,255,255,0.02)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 16,
  },
  supplierHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 12,
  },
  supplierName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  },
  supplierMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  supplierMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  supplierOnTime: {
    marginTop: 12,
  },
  onTimeBar: {
    height: 4,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  onTimeFill: {
    height: '100%',
    background: NEON_GREEN,
    borderRadius: 2,
    transition: 'width 0.3s ease',
  },
  lotList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  lotRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
    border: `1px solid ${CARD_BORDER}`,
  },
  lotInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  lotBatch: {
    fontSize: 13,
    fontWeight: 600,
    color: NEON_GREEN,
  },
  lotIngredient: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  lotDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  lotDetail: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  lotLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  alertList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  alertRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
  },
  alertInfo: {
    flex: 1,
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  alertItem: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  },
  urgencyBadge: {
    fontSize: 10,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 12,
    textTransform: 'uppercase',
  },
  alertMeta: {
    display: 'flex',
    gap: 16,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  reorderBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    background: `${NEON_GREEN}15`,
    border: `1px solid ${NEON_GREEN}40`,
    borderRadius: 8,
    color: NEON_GREEN,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
};
