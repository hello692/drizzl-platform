import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  XCircle,
  Boxes,
  Truck,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  Phone,
  ClipboardList,
  BarChart3,
  RefreshCw,
  Building2,
  Star,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  Box,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const isDemoMode = true;

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface OverviewMetric {
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
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  lastRestocked: string;
}

interface PackagingItem {
  id: string;
  name: string;
  currentStock: number;
  targetStock: number;
  unit: string;
  reorderStatus: 'ok' | 'order_soon' | 'order_now';
}

interface FinishedGood {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  ageInDays: number;
  location: string;
}

interface ReorderAlert {
  id: string;
  item: string;
  category: string;
  supplier: string;
  leadTime: string;
  suggestedQty: number;
  urgency: 'critical' | 'high' | 'medium';
  currentStock: number;
  reorderPoint: number;
}

interface LotRecord {
  id: string;
  lotNumber: string;
  product: string;
  productionDate: string;
  expiryDate: string;
  quantity: number;
  status: 'active' | 'expiring_soon' | 'expired';
}

interface Supplier {
  id: string;
  name: string;
  category: string;
  lastOrderDate: string;
  reliabilityScore: number;
  status: 'active' | 'pending' | 'issue';
  ordersThisMonth: number;
}

const overviewMetrics: OverviewMetric[] = [
  { id: 'skus', label: 'Total SKUs', value: '156', icon: <Package size={20} /> },
  { id: 'low-stock', label: 'Low Stock Alerts', value: '8', icon: <AlertTriangle size={20} />, subtitle: 'items' },
  { id: 'reorder', label: 'Items to Reorder', value: '12', icon: <ShoppingCart size={20} />, subtitle: 'pending' },
  { id: 'value', label: 'Inventory Value', value: '$428,500', icon: <DollarSign size={20} />, change: '5.2%', changeType: 'up' },
  { id: 'stockouts', label: 'Stockouts Today', value: '0', icon: <XCircle size={20} />, subtitle: 'none' },
];

const ingredientInventory: IngredientItem[] = [
  { id: 'ing-001', name: 'Strawberry Base', currentStock: 180, reorderPoint: 200, maxStock: 500, unit: 'kg', status: 'warning', lastRestocked: 'Dec 5, 2025' },
  { id: 'ing-002', name: 'Mango Puree', currentStock: 320, reorderPoint: 150, maxStock: 400, unit: 'kg', status: 'good', lastRestocked: 'Dec 8, 2025' },
  { id: 'ing-003', name: 'Protein Powder', currentStock: 45, reorderPoint: 100, maxStock: 300, unit: 'kg', status: 'critical', lastRestocked: 'Nov 28, 2025' },
  { id: 'ing-004', name: 'Spinach Extract', currentStock: 85, reorderPoint: 50, maxStock: 200, unit: 'kg', status: 'good', lastRestocked: 'Dec 6, 2025' },
  { id: 'ing-005', name: 'Banana Puree', currentStock: 250, reorderPoint: 100, maxStock: 350, unit: 'kg', status: 'good', lastRestocked: 'Dec 7, 2025' },
  { id: 'ing-006', name: 'Açaí Concentrate', currentStock: 60, reorderPoint: 80, maxStock: 200, unit: 'kg', status: 'warning', lastRestocked: 'Dec 2, 2025' },
  { id: 'ing-007', name: 'Almond Butter', currentStock: 120, reorderPoint: 75, maxStock: 250, unit: 'kg', status: 'good', lastRestocked: 'Dec 4, 2025' },
  { id: 'ing-008', name: 'Cocoa Powder', currentStock: 95, reorderPoint: 60, maxStock: 200, unit: 'kg', status: 'good', lastRestocked: 'Dec 3, 2025' },
  { id: 'ing-009', name: 'Matcha Powder', currentStock: 28, reorderPoint: 40, maxStock: 120, unit: 'kg', status: 'critical', lastRestocked: 'Nov 25, 2025' },
  { id: 'ing-010', name: 'Peach Puree', currentStock: 145, reorderPoint: 100, maxStock: 300, unit: 'kg', status: 'good', lastRestocked: 'Dec 6, 2025' },
  { id: 'ing-011', name: 'Coffee Extract', currentStock: 72, reorderPoint: 50, maxStock: 150, unit: 'L', status: 'good', lastRestocked: 'Dec 5, 2025' },
  { id: 'ing-012', name: 'Jackfruit Puree', currentStock: 55, reorderPoint: 60, maxStock: 180, unit: 'kg', status: 'warning', lastRestocked: 'Dec 1, 2025' },
];

const packagingInventory: PackagingItem[] = [
  { id: 'pkg-001', name: '16oz Glass Bottles', currentStock: 4500, targetStock: 5000, unit: 'units', reorderStatus: 'order_soon' },
  { id: 'pkg-002', name: 'Aluminum Caps', currentStock: 8200, targetStock: 5000, unit: 'units', reorderStatus: 'ok' },
  { id: 'pkg-003', name: 'Product Labels (Strawberry)', currentStock: 1200, targetStock: 3000, unit: 'sheets', reorderStatus: 'order_now' },
  { id: 'pkg-004', name: 'Product Labels (Mango)', currentStock: 2800, targetStock: 3000, unit: 'sheets', reorderStatus: 'ok' },
  { id: 'pkg-005', name: 'Shipping Boxes (6-pack)', currentStock: 650, targetStock: 1000, unit: 'units', reorderStatus: 'order_soon' },
  { id: 'pkg-006', name: 'Shipping Boxes (12-pack)', currentStock: 1100, targetStock: 800, unit: 'units', reorderStatus: 'ok' },
  { id: 'pkg-007', name: 'Bubble Wrap Rolls', currentStock: 45, targetStock: 50, unit: 'rolls', reorderStatus: 'order_soon' },
  { id: 'pkg-008', name: 'Packing Tape', currentStock: 120, targetStock: 100, unit: 'rolls', reorderStatus: 'ok' },
];

const finishedGoods: FinishedGood[] = [
  { id: 'fg-001', sku: 'DRZ-STR-16', productName: 'Strawberry Peach Smoothie', quantity: 1250, ageInDays: 3, location: 'Warehouse A' },
  { id: 'fg-002', sku: 'DRZ-MNG-16', productName: 'Mango Jackfruit Smoothie', quantity: 980, ageInDays: 5, location: 'Warehouse A' },
  { id: 'fg-003', sku: 'DRZ-ACA-16', productName: 'Açaí Berry Smoothie', quantity: 750, ageInDays: 2, location: 'Warehouse A' },
  { id: 'fg-004', sku: 'DRZ-GRN-16', productName: 'Green Power Smoothie', quantity: 420, ageInDays: 7, location: 'Warehouse B' },
  { id: 'fg-005', sku: 'DRZ-CHO-16', productName: 'Chocolate Berry Smoothie', quantity: 890, ageInDays: 4, location: 'Warehouse A' },
  { id: 'fg-006', sku: 'DRZ-COF-16', productName: 'Coffee Mushroom Smoothie', quantity: 650, ageInDays: 6, location: 'Warehouse B' },
  { id: 'fg-007', sku: 'DRZ-MAT-16', productName: 'Matcha Zen Smoothie', quantity: 380, ageInDays: 8, location: 'Warehouse B' },
  { id: 'fg-008', sku: 'DRZ-ALM-16', productName: 'Almond Bliss Smoothie', quantity: 560, ageInDays: 3, location: 'Warehouse A' },
];

const reorderAlerts: ReorderAlert[] = [
  { id: 'ro-001', item: 'Protein Powder', category: 'Ingredient', supplier: 'NutraPro Supply', leadTime: '5 days', suggestedQty: 200, urgency: 'critical', currentStock: 45, reorderPoint: 100 },
  { id: 'ro-002', item: 'Matcha Powder', category: 'Ingredient', supplier: 'Kyoto Organics', leadTime: '14 days', suggestedQty: 80, urgency: 'critical', currentStock: 28, reorderPoint: 40 },
  { id: 'ro-003', item: 'Strawberry Base', category: 'Ingredient', supplier: 'Fresh Farms Co', leadTime: '3 days', suggestedQty: 300, urgency: 'high', currentStock: 180, reorderPoint: 200 },
  { id: 'ro-004', item: 'Product Labels (Strawberry)', category: 'Packaging', supplier: 'PrintMaster Inc', leadTime: '7 days', suggestedQty: 5000, urgency: 'high', currentStock: 1200, reorderPoint: 2000 },
  { id: 'ro-005', item: 'Açaí Concentrate', category: 'Ingredient', supplier: 'Amazonia Direct', leadTime: '10 days', suggestedQty: 120, urgency: 'high', currentStock: 60, reorderPoint: 80 },
  { id: 'ro-006', item: 'Jackfruit Puree', category: 'Ingredient', supplier: 'Tropical Harvest', leadTime: '7 days', suggestedQty: 100, urgency: 'medium', currentStock: 55, reorderPoint: 60 },
  { id: 'ro-007', item: '16oz Glass Bottles', category: 'Packaging', supplier: 'GlassCraft USA', leadTime: '10 days', suggestedQty: 2000, urgency: 'medium', currentStock: 4500, reorderPoint: 4000 },
  { id: 'ro-008', item: 'Shipping Boxes (6-pack)', category: 'Packaging', supplier: 'BoxPro Packaging', leadTime: '5 days', suggestedQty: 500, urgency: 'medium', currentStock: 650, reorderPoint: 800 },
];

const lotRecords: LotRecord[] = [
  { id: 'lot-001', lotNumber: 'LOT-2025-1210-A', product: 'Strawberry Peach', productionDate: 'Dec 10, 2025', expiryDate: 'Mar 10, 2026', quantity: 500, status: 'active' },
  { id: 'lot-002', lotNumber: 'LOT-2025-1209-B', product: 'Mango Jackfruit', productionDate: 'Dec 9, 2025', expiryDate: 'Mar 9, 2026', quantity: 480, status: 'active' },
  { id: 'lot-003', lotNumber: 'LOT-2025-1208-A', product: 'Açaí Berry', productionDate: 'Dec 8, 2025', expiryDate: 'Mar 8, 2026', quantity: 420, status: 'active' },
  { id: 'lot-004', lotNumber: 'LOT-2025-1207-C', product: 'Chocolate Berry', productionDate: 'Dec 7, 2025', expiryDate: 'Mar 7, 2026', quantity: 350, status: 'active' },
  { id: 'lot-005', lotNumber: 'LOT-2025-1125-A', product: 'Green Power', productionDate: 'Nov 25, 2025', expiryDate: 'Feb 25, 2026', quantity: 180, status: 'expiring_soon' },
  { id: 'lot-006', lotNumber: 'LOT-2025-1120-B', product: 'Coffee Mushroom', productionDate: 'Nov 20, 2025', expiryDate: 'Feb 20, 2026', quantity: 95, status: 'expiring_soon' },
  { id: 'lot-007', lotNumber: 'LOT-2025-1206-A', product: 'Matcha Zen', productionDate: 'Dec 6, 2025', expiryDate: 'Mar 6, 2026', quantity: 300, status: 'active' },
  { id: 'lot-008', lotNumber: 'LOT-2025-1205-B', product: 'Almond Bliss', productionDate: 'Dec 5, 2025', expiryDate: 'Mar 5, 2026', quantity: 280, status: 'active' },
];

const suppliers: Supplier[] = [
  { id: 'sup-001', name: 'Fresh Farms Co', category: 'Ingredients', lastOrderDate: 'Dec 8, 2025', reliabilityScore: 98, status: 'active', ordersThisMonth: 4 },
  { id: 'sup-002', name: 'Organic Produce Direct', category: 'Ingredients', lastOrderDate: 'Dec 5, 2025', reliabilityScore: 95, status: 'active', ordersThisMonth: 3 },
  { id: 'sup-003', name: 'NutraPro Supply', category: 'Supplements', lastOrderDate: 'Nov 28, 2025', reliabilityScore: 92, status: 'pending', ordersThisMonth: 1 },
  { id: 'sup-004', name: 'GlassCraft USA', category: 'Packaging', lastOrderDate: 'Dec 1, 2025', reliabilityScore: 97, status: 'active', ordersThisMonth: 2 },
  { id: 'sup-005', name: 'PrintMaster Inc', category: 'Labels', lastOrderDate: 'Nov 30, 2025', reliabilityScore: 88, status: 'issue', ordersThisMonth: 2 },
  { id: 'sup-006', name: 'Amazonia Direct', category: 'Specialty', lastOrderDate: 'Dec 2, 2025', reliabilityScore: 94, status: 'active', ordersThisMonth: 1 },
];

const quickActions = [
  { label: 'Create Purchase Order', icon: <ShoppingCart size={18} />, primary: false },
  { label: 'Adjust Inventory', icon: <ClipboardList size={18} />, primary: false },
  { label: 'Run Audit', icon: <BarChart3 size={18} />, primary: false },
  { label: 'Export Report', icon: <FileText size={18} />, primary: false },
  { label: 'Contact Supplier', icon: <Phone size={18} />, primary: true },
];

const inventoryByCategory = [
  { category: 'Ingredients', value: 245000 },
  { category: 'Packaging', value: 82500 },
  { category: 'Finished Goods', value: 98000 },
  { category: 'Supplies', value: 3000 },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStockLevelColor(current: number, reorderPoint: number, max: number): string {
  const percentage = (current / max) * 100;
  if (current <= reorderPoint * 0.5) return '#FF6B6B';
  if (current <= reorderPoint) return '#FFA500';
  return NEON_GREEN;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'good':
    case 'active':
    case 'ok':
      return NEON_GREEN;
    case 'warning':
    case 'order_soon':
    case 'pending':
    case 'expiring_soon':
      return '#FFA500';
    case 'critical':
    case 'order_now':
    case 'issue':
    case 'expired':
      return '#FF6B6B';
    default:
      return 'rgba(255,255,255,0.5)';
  }
}

function getUrgencyLabel(urgency: string): string {
  switch (urgency) {
    case 'critical': return 'CRITICAL';
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    default: return 'LOW';
  }
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={styles.tooltip}>
        <p style={styles.tooltipLabel}>{label}</p>
        <p style={styles.tooltipValue}>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export default function SupplyChainDashboard() {
  return (
    <AdminLayout title="Supply Chain" subtitle="Inventory Management & Procurement">
      {isDemoMode && (
        <div style={styles.demoTag}>
          <AlertCircle size={14} />
          <span>Demo Mode - Connect ERP system for live data</span>
        </div>
      )}

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
          <Boxes size={18} color={NEON_GREEN} />
          Inventory Overview
        </h2>
        <div style={styles.metricsGrid}>
          {overviewMetrics.map((metric) => (
            <div key={metric.id} style={styles.metricCard}>
              <div style={styles.metricIcon}>{metric.icon}</div>
              <div style={styles.metricContent}>
                <span style={styles.metricLabel}>{metric.label}</span>
                <div style={styles.metricValueRow}>
                  <span style={styles.metricValue}>{metric.value}</span>
                  {metric.change && (
                    <span style={{ ...styles.metricChange, color: metric.changeType === 'up' ? NEON_GREEN : '#FF6B6B' }}>
                      {metric.changeType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {metric.change}
                    </span>
                  )}
                </div>
                {metric.subtitle && <span style={styles.metricSubtitle}>{metric.subtitle}</span>}
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
          <div style={styles.ingredientsList}>
            {ingredientInventory.map((item) => {
              const stockPercentage = (item.currentStock / item.maxStock) * 100;
              const barColor = getStockLevelColor(item.currentStock, item.reorderPoint, item.maxStock);
              return (
                <div key={item.id} style={styles.ingredientRow}>
                  <div style={styles.ingredientInfo}>
                    <div style={styles.ingredientNameRow}>
                      <span style={styles.ingredientName}>{item.name}</span>
                      <span style={{ ...styles.statusDot, background: getStatusColor(item.status) }} />
                    </div>
                    <div style={styles.stockInfo}>
                      <span style={styles.stockText}>
                        {item.currentStock} / {item.maxStock} {item.unit}
                      </span>
                      <span style={styles.reorderText}>
                        Reorder: {item.reorderPoint} {item.unit}
                      </span>
                    </div>
                    <div style={styles.stockBarContainer}>
                      <div style={{ ...styles.stockBar, width: `${stockPercentage}%`, background: barColor }} />
                      <div style={{ ...styles.reorderLine, left: `${(item.reorderPoint / item.maxStock) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
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
          <div style={styles.packagingList}>
            {packagingInventory.map((item) => {
              const percentage = (item.currentStock / item.targetStock) * 100;
              return (
                <div key={item.id} style={styles.packagingRow}>
                  <div style={styles.packagingInfo}>
                    <span style={styles.packagingName}>{item.name}</span>
                    <span style={styles.packagingStock}>
                      {item.currentStock.toLocaleString()} / {item.targetStock.toLocaleString()} {item.unit}
                    </span>
                  </div>
                  <div style={styles.packagingRight}>
                    <div style={styles.miniBarContainer}>
                      <div style={{ 
                        ...styles.miniBar, 
                        width: `${Math.min(percentage, 100)}%`,
                        background: getStatusColor(item.reorderStatus)
                      }} />
                    </div>
                    <span style={{ 
                      ...styles.reorderBadge, 
                      color: getStatusColor(item.reorderStatus),
                      background: `${getStatusColor(item.reorderStatus)}15`
                    }}>
                      {item.reorderStatus === 'ok' ? 'OK' : item.reorderStatus === 'order_soon' ? 'Order Soon' : 'Order Now'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div style={styles.twoColumnGrid}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <Layers size={16} color={NEON_GREEN} />
              Finished Goods
            </h3>
            <button style={styles.viewAllBtn}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div style={styles.finishedGoodsList}>
            <div style={styles.fgTableHeader}>
              <span style={styles.fgHeaderCell}>SKU</span>
              <span style={styles.fgHeaderCell}>Product</span>
              <span style={styles.fgHeaderCell}>Qty</span>
              <span style={styles.fgHeaderCell}>Age</span>
              <span style={styles.fgHeaderCell}>Location</span>
            </div>
            {finishedGoods.map((item) => (
              <div key={item.id} style={styles.fgRow}>
                <span style={styles.fgSku}>{item.sku}</span>
                <span style={styles.fgProduct}>{item.productName}</span>
                <span style={styles.fgQty}>{item.quantity.toLocaleString()}</span>
                <span style={{ ...styles.fgAge, color: item.ageInDays > 7 ? '#FFA500' : 'rgba(255,255,255,0.6)' }}>
                  {item.ageInDays}d
                </span>
                <span style={styles.fgLocation}>{item.location}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <BarChart3 size={16} color={NEON_GREEN} />
              Inventory Value by Category
            </h3>
          </div>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={inventoryByCategory} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="category" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {inventoryByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? NEON_GREEN : index === 1 ? '#8B5CF6' : index === 2 ? '#3B82F6' : '#FFA500'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>
            <AlertTriangle size={16} color="#FF6B6B" />
            Reorder Alerts
          </h3>
          <div style={styles.headerBadges}>
            <span style={styles.criticalBadge}>
              {reorderAlerts.filter(a => a.urgency === 'critical').length} Critical
            </span>
            <span style={styles.highBadge}>
              {reorderAlerts.filter(a => a.urgency === 'high').length} High
            </span>
          </div>
        </div>
        <div style={styles.alertsGrid}>
          {reorderAlerts.map((alert) => (
            <div key={alert.id} style={{
              ...styles.alertCard,
              borderLeft: `3px solid ${getStatusColor(alert.urgency)}`
            }}>
              <div style={styles.alertHeader}>
                <span style={styles.alertItem}>{alert.item}</span>
                <span style={{
                  ...styles.urgencyBadge,
                  background: `${getStatusColor(alert.urgency)}20`,
                  color: getStatusColor(alert.urgency)
                }}>
                  {getUrgencyLabel(alert.urgency)}
                </span>
              </div>
              <div style={styles.alertDetails}>
                <div style={styles.alertRow}>
                  <span style={styles.alertLabel}>Category:</span>
                  <span style={styles.alertValue}>{alert.category}</span>
                </div>
                <div style={styles.alertRow}>
                  <span style={styles.alertLabel}>Supplier:</span>
                  <span style={styles.alertValue}>{alert.supplier}</span>
                </div>
                <div style={styles.alertRow}>
                  <span style={styles.alertLabel}>Lead Time:</span>
                  <span style={styles.alertValue}>{alert.leadTime}</span>
                </div>
                <div style={styles.alertRow}>
                  <span style={styles.alertLabel}>Stock:</span>
                  <span style={{ ...styles.alertValue, color: getStatusColor(alert.urgency) }}>
                    {alert.currentStock} / {alert.reorderPoint}
                  </span>
                </div>
                <div style={styles.alertRow}>
                  <span style={styles.alertLabel}>Suggested Qty:</span>
                  <span style={{ ...styles.alertValue, color: NEON_GREEN, fontWeight: 600 }}>{alert.suggestedQty}</span>
                </div>
              </div>
              <button style={styles.orderBtn}>
                <ShoppingCart size={14} />
                Create Order
              </button>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.twoColumnGrid}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <Tag size={16} color={NEON_GREEN} />
              Lot Tracking
            </h3>
            <button style={styles.viewAllBtn}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div style={styles.lotList}>
            {lotRecords.map((lot) => (
              <div key={lot.id} style={styles.lotRow}>
                <div style={styles.lotInfo}>
                  <div style={styles.lotHeader}>
                    <span style={styles.lotNumber}>{lot.lotNumber}</span>
                    <span style={{
                      ...styles.lotStatus,
                      background: `${getStatusColor(lot.status)}20`,
                      color: getStatusColor(lot.status)
                    }}>
                      {lot.status === 'active' ? 'Active' : lot.status === 'expiring_soon' ? 'Expiring Soon' : 'Expired'}
                    </span>
                  </div>
                  <span style={styles.lotProduct}>{lot.product}</span>
                  <div style={styles.lotMeta}>
                    <span>Produced: {lot.productionDate}</span>
                    <span>Expires: {lot.expiryDate}</span>
                    <span>Qty: {lot.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <Building2 size={16} color={NEON_GREEN} />
              Supplier Overview
            </h3>
            <button style={styles.viewAllBtn}>
              Manage <ChevronRight size={14} />
            </button>
          </div>
          <div style={styles.supplierList}>
            {suppliers.map((supplier) => (
              <div key={supplier.id} style={styles.supplierRow}>
                <div style={styles.supplierInfo}>
                  <div style={styles.supplierNameRow}>
                    <span style={styles.supplierName}>{supplier.name}</span>
                    <span style={{
                      ...styles.supplierStatus,
                      background: `${getStatusColor(supplier.status)}20`,
                      color: getStatusColor(supplier.status)
                    }}>
                      {supplier.status === 'active' ? 'Active' : supplier.status === 'pending' ? 'Pending' : 'Issue'}
                    </span>
                  </div>
                  <span style={styles.supplierCategory}>{supplier.category}</span>
                  <div style={styles.supplierMeta}>
                    <span>Last Order: {supplier.lastOrderDate}</span>
                    <span>Orders: {supplier.ordersThisMonth}</span>
                  </div>
                </div>
                <div style={styles.reliabilityScore}>
                  <div style={styles.scoreCircle}>
                    <Star size={12} color={supplier.reliabilityScore >= 95 ? NEON_GREEN : supplier.reliabilityScore >= 90 ? '#FFA500' : '#FF6B6B'} />
                    <span style={{ color: supplier.reliabilityScore >= 95 ? NEON_GREEN : supplier.reliabilityScore >= 90 ? '#FFA500' : '#FF6B6B' }}>
                      {supplier.reliabilityScore}%
                    </span>
                  </div>
                  <span style={styles.scoreLabel}>Reliability</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  demoTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: 'rgba(255, 165, 0, 0.1)',
    border: '1px solid rgba(255, 165, 0, 0.2)',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '13px',
    color: '#FFA500',
  },
  quickActionsBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '10px',
    color: '#fff',
    fontSize: '13px',
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
    marginBottom: '24px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '16px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px',
  },
  metricCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  metricIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: NEON_GREEN,
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '4px',
  },
  metricValueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  metricValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.5px',
  },
  metricChange: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '12px',
    fontWeight: 500,
  },
  metricSubtitle: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    display: 'block',
    marginTop: '2px',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    marginBottom: '24px',
  },
  card: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '16px',
    padding: '24px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  countBadge: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    background: 'rgba(255,255,255,0.05)',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  viewAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    color: NEON_GREEN,
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  ingredientsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '8px',
  },
  ingredientRow: {
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
  },
  ingredientInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  ingredientNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  ingredientName: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#fff',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  stockInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
  },
  stockText: {
    color: 'rgba(255,255,255,0.7)',
  },
  reorderText: {
    color: 'rgba(255,255,255,0.4)',
  },
  stockBarContainer: {
    position: 'relative',
    height: '4px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    overflow: 'visible',
  },
  stockBar: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  reorderLine: {
    position: 'absolute',
    top: '-2px',
    width: '2px',
    height: '8px',
    background: 'rgba(255,255,255,0.4)',
    borderRadius: '1px',
  },
  packagingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  packagingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
  },
  packagingInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  packagingName: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#fff',
  },
  packagingStock: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
  },
  packagingRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
  },
  miniBarContainer: {
    width: '60px',
    height: '4px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  miniBar: {
    height: '100%',
    borderRadius: '2px',
  },
  reorderBadge: {
    fontSize: '10px',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  finishedGoodsList: {
    maxHeight: '320px',
    overflowY: 'auto',
  },
  fgTableHeader: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 80px 50px 100px',
    gap: '12px',
    padding: '8px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    marginBottom: '8px',
  },
  fgHeaderCell: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  fgRow: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 80px 50px 100px',
    gap: '12px',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '8px',
    marginBottom: '6px',
    alignItems: 'center',
  },
  fgSku: {
    fontSize: '11px',
    fontFamily: 'monospace',
    color: NEON_GREEN,
  },
  fgProduct: {
    fontSize: '12px',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  fgQty: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#fff',
  },
  fgAge: {
    fontSize: '11px',
  },
  fgLocation: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
  },
  chartContainer: {
    marginTop: '8px',
  },
  headerBadges: {
    display: 'flex',
    gap: '8px',
  },
  criticalBadge: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#FF6B6B',
    background: 'rgba(255, 107, 107, 0.15)',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  highBadge: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#FFA500',
    background: 'rgba(255, 165, 0, 0.15)',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  alertsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  alertCard: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  alertHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  alertItem: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#fff',
  },
  urgencyBadge: {
    fontSize: '9px',
    fontWeight: 700,
    padding: '3px 6px',
    borderRadius: '4px',
    letterSpacing: '0.5px',
  },
  alertDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  alertRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
  },
  alertLabel: {
    color: 'rgba(255,255,255,0.4)',
  },
  alertValue: {
    color: 'rgba(255,255,255,0.8)',
  },
  orderBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 12px',
    background: 'rgba(0, 255, 133, 0.1)',
    border: `1px solid ${NEON_GREEN}40`,
    borderRadius: '8px',
    color: NEON_GREEN,
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 'auto',
    fontFamily: 'Inter, sans-serif',
  },
  lotList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '350px',
    overflowY: 'auto',
  },
  lotRow: {
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
  },
  lotInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  lotHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lotNumber: {
    fontSize: '12px',
    fontFamily: 'monospace',
    color: NEON_GREEN,
    fontWeight: 600,
  },
  lotStatus: {
    fontSize: '9px',
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  lotProduct: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#fff',
  },
  lotMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
  supplierList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '350px',
    overflowY: 'auto',
  },
  supplierRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
  },
  supplierInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  supplierNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  supplierName: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#fff',
  },
  supplierStatus: {
    fontSize: '9px',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  supplierCategory: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
  },
  supplierMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
  reliabilityScore: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  scoreCircle: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 700,
  },
  scoreLabel: {
    fontSize: '9px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
  },
  tooltip: {
    background: 'rgba(0,0,0,0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '12px',
  },
  tooltipLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '4px',
  },
  tooltipValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
  },
};
