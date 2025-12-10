import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  DollarSign,
  ShoppingCart,
  CreditCard,
  UserPlus,
  Heart,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  MapPin,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  Filter,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

const isDemoMode = true;

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

const kpiData = [
  { id: 'revenue', label: 'Total Revenue (MTD)', value: '$487,392', change: '+18.5%', changeType: 'up', icon: <DollarSign size={20} /> },
  { id: 'orders', label: 'Orders (MTD)', value: '1,247', change: '+12.3%', changeType: 'up', icon: <ShoppingCart size={20} /> },
  { id: 'aov', label: 'Avg Order Value', value: '$391', change: '+5.2%', changeType: 'up', icon: <CreditCard size={20} /> },
  { id: 'cac', label: 'Customer Acquisition Cost', value: '$42', change: '-8.4%', changeType: 'down', icon: <UserPlus size={20} /> },
  { id: 'clv', label: 'Customer Lifetime Value', value: '$847', change: '+15.7%', changeType: 'up', icon: <Heart size={20} /> },
];

const revenueByChannel = [
  { channel: 'D2C', revenue: 298450, percentage: 61 },
  { channel: 'B2B', revenue: 188942, percentage: 39 },
];

const revenueTrend30Days = [
  { date: 'Nov 11', revenue: 12500, d2c: 7800, b2b: 4700 },
  { date: 'Nov 12', revenue: 14200, d2c: 8900, b2b: 5300 },
  { date: 'Nov 13', revenue: 11800, d2c: 7200, b2b: 4600 },
  { date: 'Nov 14', revenue: 15600, d2c: 9500, b2b: 6100 },
  { date: 'Nov 15', revenue: 16800, d2c: 10200, b2b: 6600 },
  { date: 'Nov 16', revenue: 18200, d2c: 11100, b2b: 7100 },
  { date: 'Nov 17', revenue: 14500, d2c: 8800, b2b: 5700 },
  { date: 'Nov 18', revenue: 13200, d2c: 8000, b2b: 5200 },
  { date: 'Nov 19', revenue: 15800, d2c: 9600, b2b: 6200 },
  { date: 'Nov 20', revenue: 17400, d2c: 10600, b2b: 6800 },
  { date: 'Nov 21', revenue: 19200, d2c: 11700, b2b: 7500 },
  { date: 'Nov 22', revenue: 21500, d2c: 13100, b2b: 8400 },
  { date: 'Nov 23', revenue: 23800, d2c: 14500, b2b: 9300 },
  { date: 'Nov 24', revenue: 20100, d2c: 12300, b2b: 7800 },
  { date: 'Nov 25', revenue: 18600, d2c: 11300, b2b: 7300 },
  { date: 'Nov 26', revenue: 16400, d2c: 10000, b2b: 6400 },
  { date: 'Nov 27', revenue: 14800, d2c: 9000, b2b: 5800 },
  { date: 'Nov 28', revenue: 22500, d2c: 13700, b2b: 8800 },
  { date: 'Nov 29', revenue: 28400, d2c: 17300, b2b: 11100 },
  { date: 'Nov 30', revenue: 24200, d2c: 14800, b2b: 9400 },
  { date: 'Dec 1', revenue: 19800, d2c: 12100, b2b: 7700 },
  { date: 'Dec 2', revenue: 17600, d2c: 10700, b2b: 6900 },
  { date: 'Dec 3', revenue: 16200, d2c: 9900, b2b: 6300 },
  { date: 'Dec 4', revenue: 18400, d2c: 11200, b2b: 7200 },
  { date: 'Dec 5', revenue: 20800, d2c: 12700, b2b: 8100 },
  { date: 'Dec 6', revenue: 22400, d2c: 13600, b2b: 8800 },
  { date: 'Dec 7', revenue: 19600, d2c: 11900, b2b: 7700 },
  { date: 'Dec 8', revenue: 17200, d2c: 10500, b2b: 6700 },
  { date: 'Dec 9', revenue: 15800, d2c: 9600, b2b: 6200 },
  { date: 'Dec 10', revenue: 18900, d2c: 11500, b2b: 7400 },
];

const revenueByCategory = [
  { category: 'Smoothie Boxes', revenue: 156800, units: 412 },
  { category: 'Individual Smoothies', revenue: 98400, units: 1847 },
  { category: 'High Protein', revenue: 87200, units: 298 },
  { category: 'Gift Sets', revenue: 72500, units: 189 },
  { category: 'Subscriptions', revenue: 48200, units: 127 },
  { category: 'Accessories', revenue: 24292, units: 374 },
];

const customerNewVsReturning = [
  { name: 'New Customers', value: 542, color: NEON_GREEN },
  { name: 'Returning Customers', value: 705, color: '#8B5CF6' },
];

const acquisitionFunnel = [
  { stage: 'Website Visitors', count: 45200, percentage: 100 },
  { stage: 'Product Views', count: 18400, percentage: 40.7 },
  { stage: 'Add to Cart', count: 4850, percentage: 10.7 },
  { stage: 'Checkout Started', count: 2180, percentage: 4.8 },
  { stage: 'Purchase Completed', count: 1247, percentage: 2.8 },
];

const topCustomerSegments = [
  { segment: 'Health Enthusiasts', customers: 3842, revenue: 189400, avgOrder: 412 },
  { segment: 'Fitness Professionals', customers: 2156, revenue: 142800, avgOrder: 478 },
  { segment: 'Busy Parents', customers: 1847, revenue: 98200, avgOrder: 289 },
  { segment: 'Corporate Wellness', customers: 892, revenue: 87400, avgOrder: 645 },
  { segment: 'Students', customers: 1245, revenue: 42100, avgOrder: 186 },
];

const bestSellers = [
  { rank: 1, product: 'Strawberry Peach Smoothie', unitsSold: 2847, revenue: 42705 },
  { rank: 2, product: 'Mango Jackfruit Blend', unitsSold: 2156, revenue: 32340 },
  { rank: 3, product: 'Açaí Power Bowl', unitsSold: 1892, revenue: 28380 },
  { rank: 4, product: 'Coffee Mushroom Boost', unitsSold: 1654, revenue: 24810 },
  { rank: 5, product: 'Chocolate Berry Fusion', unitsSold: 1423, revenue: 21345 },
];

const lowPerformers = [
  { product: 'Mint Cacao Smoothie', unitsSold: 127, revenue: 1905, trend: -23 },
  { product: 'Pink Piyata Special', unitsSold: 189, revenue: 2835, trend: -18 },
  { product: 'Almond Butter Blend', unitsSold: 234, revenue: 3510, trend: -12 },
];

const productCategoryBreakdown = [
  { category: 'Fruit Blends', percentage: 42, revenue: 204500 },
  { category: 'Protein Smoothies', percentage: 28, revenue: 136400 },
  { category: 'Coffee & Energy', percentage: 18, revenue: 87700 },
  { category: 'Specialty Bowls', percentage: 12, revenue: 58400 },
];

const salesByRegion = [
  { rank: 1, state: 'California', orders: 312, revenue: 124800, percentage: 25.6 },
  { rank: 2, state: 'Texas', orders: 198, revenue: 79200, percentage: 16.3 },
  { rank: 3, state: 'New York', orders: 167, revenue: 66800, percentage: 13.7 },
  { rank: 4, state: 'Florida', orders: 143, revenue: 57200, percentage: 11.7 },
  { rank: 5, state: 'Washington', orders: 89, revenue: 35600, percentage: 7.3 },
  { rank: 6, state: 'Colorado', orders: 76, revenue: 30400, percentage: 6.2 },
  { rank: 7, state: 'Arizona', orders: 64, revenue: 25600, percentage: 5.3 },
  { rank: 8, state: 'Oregon', orders: 52, revenue: 20800, percentage: 4.3 },
  { rank: 9, state: 'Nevada', orders: 41, revenue: 16400, percentage: 3.4 },
  { rank: 10, state: 'Illinois', orders: 38, revenue: 15200, percentage: 3.1 },
];

const shippingDestinations = [
  { zone: 'West Coast', states: 'CA, OR, WA, NV', orders: 492, avgShipDays: 2.1 },
  { zone: 'Southwest', states: 'AZ, NM, TX', orders: 287, avgShipDays: 2.8 },
  { zone: 'Mountain', states: 'CO, UT, ID, MT', orders: 156, avgShipDays: 3.2 },
  { zone: 'Midwest', states: 'IL, OH, MI, WI', orders: 134, avgShipDays: 3.8 },
  { zone: 'Southeast', states: 'FL, GA, NC, SC', orders: 178, avgShipDays: 4.1 },
  { zone: 'Northeast', states: 'NY, NJ, PA, MA', orders: 198, avgShipDays: 4.5 },
];

const salesByDayOfWeek = [
  { day: 'Monday', orders: 178, revenue: 71200 },
  { day: 'Tuesday', orders: 156, revenue: 62400 },
  { day: 'Wednesday', orders: 189, revenue: 75600 },
  { day: 'Thursday', orders: 201, revenue: 80400 },
  { day: 'Friday', orders: 234, revenue: 93600 },
  { day: 'Saturday', orders: 167, revenue: 66800 },
  { day: 'Sunday', orders: 122, revenue: 48800 },
];

const salesByHour = [
  { hour: '6am', orders: 23 },
  { hour: '7am', orders: 45 },
  { hour: '8am', orders: 89 },
  { hour: '9am', orders: 112 },
  { hour: '10am', orders: 98 },
  { hour: '11am', orders: 134 },
  { hour: '12pm', orders: 156 },
  { hour: '1pm', orders: 143 },
  { hour: '2pm', orders: 121 },
  { hour: '3pm', orders: 98 },
  { hour: '4pm', orders: 87 },
  { hour: '5pm', orders: 112 },
  { hour: '6pm', orders: 134 },
  { hour: '7pm', orders: 145 },
  { hour: '8pm', orders: 167 },
  { hour: '9pm', orders: 123 },
  { hour: '10pm', orders: 78 },
  { hour: '11pm', orders: 34 },
];

const seasonalTrends = [
  { month: 'Jan', revenue: 312000, yoy: 12 },
  { month: 'Feb', revenue: 298000, yoy: 8 },
  { month: 'Mar', revenue: 345000, yoy: 15 },
  { month: 'Apr', revenue: 378000, yoy: 18 },
  { month: 'May', revenue: 412000, yoy: 22 },
  { month: 'Jun', revenue: 456000, yoy: 28 },
  { month: 'Jul', revenue: 489000, yoy: 32 },
  { month: 'Aug', revenue: 467000, yoy: 25 },
  { month: 'Sep', revenue: 423000, yoy: 20 },
  { month: 'Oct', revenue: 398000, yoy: 16 },
  { month: 'Nov', revenue: 445000, yoy: 24 },
  { month: 'Dec', revenue: 487000, yoy: 28 },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={styles.tooltip}>
        <p style={styles.tooltipLabel}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} style={styles.tooltipRow}>
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span style={{ marginLeft: 8 }}>
              {typeof entry.value === 'number' && entry.name?.toLowerCase().includes('revenue')
                ? formatCurrency(entry.value)
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function AnalyticsPage() {
  const maxCategoryRevenue = revenueByCategory.reduce((max, c) => Math.max(max, c.revenue), 0);
  const peakHourOrders = salesByHour.reduce((max, h) => Math.max(max, h.orders), 0);

  return (
    <AdminLayout title="Analytics" subtitle="Business Intelligence & Performance Metrics">
      {isDemoMode && (
        <div style={styles.demoBanner}>
          <AlertCircle size={16} />
          <span>Demo Mode - Displaying sample analytics data</span>
        </div>
      )}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <BarChart3 size={18} color={NEON_GREEN} />
          Analytics Overview
        </h2>
        <div style={styles.kpiGrid}>
          {kpiData.map((kpi) => (
            <div key={kpi.id} style={styles.kpiCard}>
              <div style={styles.kpiIcon}>{kpi.icon}</div>
              <div style={styles.kpiContent}>
                <span style={styles.kpiLabel}>{kpi.label}</span>
                <div style={styles.kpiValueRow}>
                  <span style={styles.kpiValue}>{kpi.value}</span>
                  <span style={{
                    ...styles.kpiChange,
                    color: kpi.changeType === 'up' ? NEON_GREEN : '#FF6B6B',
                  }}>
                    {kpi.changeType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {kpi.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <DollarSign size={18} color={NEON_GREEN} />
          Revenue Analytics
        </h2>
        <div style={styles.chartsGrid}>
          <div style={styles.glassCard}>
            <h3 style={styles.cardTitle}>Revenue by Channel</h3>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueByChannel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                  <YAxis type="category" dataKey="channel" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} width={50} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Revenue" radius={[0, 8, 8, 0]}>
                    <Cell fill={NEON_GREEN} />
                    <Cell fill="#8B5CF6" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.channelLegend}>
              <div style={styles.legendItem}>
                <span style={{ ...styles.legendDot, background: NEON_GREEN }} />
                <span>D2C: {formatCurrency(revenueByChannel[0].revenue)} ({revenueByChannel[0].percentage}%)</span>
              </div>
              <div style={styles.legendItem}>
                <span style={{ ...styles.legendDot, background: '#8B5CF6' }} />
                <span>B2B: {formatCurrency(revenueByChannel[1].revenue)} ({revenueByChannel[1].percentage}%)</span>
              </div>
            </div>
          </div>

          <div style={styles.glassCard}>
            <h3 style={styles.cardTitle}>Revenue Trend (30 Days)</h3>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueTrend30Days}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={NEON_GREEN} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={NEON_GREEN} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} tickLine={false} interval={4} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke={NEON_GREEN} strokeWidth={2} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ ...styles.glassCard, gridColumn: 'span 2' }}>
            <h3 style={styles.cardTitle}>Revenue by Product Category</h3>
            <div style={styles.horizontalBarList}>
              {revenueByCategory.map((cat, index) => (
                <div key={cat.category} style={styles.horizontalBarItem}>
                  <div style={styles.horizontalBarLabel}>
                    <span style={styles.horizontalBarRank}>#{index + 1}</span>
                    <span style={styles.horizontalBarName}>{cat.category}</span>
                    <span style={styles.horizontalBarValue}>{formatCurrency(cat.revenue)}</span>
                  </div>
                  <div style={styles.horizontalBarTrack}>
                    <div
                      style={{
                        ...styles.horizontalBarFill,
                        width: `${(cat.revenue / maxCategoryRevenue) * 100}%`,
                        background: `linear-gradient(90deg, ${NEON_GREEN} 0%, ${NEON_GREEN}80 100%)`,
                      }}
                    />
                  </div>
                  <span style={styles.horizontalBarUnits}>{cat.units.toLocaleString()} units</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <Users size={18} color={NEON_GREEN} />
          Customer Analytics
        </h2>
        <div style={styles.customerGrid}>
          <div style={styles.glassCard}>
            <h3 style={styles.cardTitle}>New vs Returning Customers</h3>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={220}>
                <RechartsPieChart>
                  <Pie
                    data={customerNewVsReturning}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {customerNewVsReturning.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.pieLegend}>
              {customerNewVsReturning.map((item) => (
                <div key={item.name} style={styles.legendItem}>
                  <span style={{ ...styles.legendDot, background: item.color }} />
                  <span>{item.name}: {item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.glassCard}>
            <h3 style={styles.cardTitle}>Customer Acquisition Funnel</h3>
            <div style={styles.funnelContainer}>
              {acquisitionFunnel.map((stage, index) => (
                <div key={stage.stage} style={styles.funnelStage}>
                  <div style={styles.funnelLabel}>
                    <span style={styles.funnelStageName}>{stage.stage}</span>
                    <span style={styles.funnelPercentage}>{stage.percentage}%</span>
                  </div>
                  <div style={styles.funnelBarTrack}>
                    <div
                      style={{
                        ...styles.funnelBarFill,
                        width: `${stage.percentage}%`,
                        background: `linear-gradient(90deg, ${NEON_GREEN} 0%, ${NEON_GREEN}${Math.round((1 - index * 0.15) * 255).toString(16).padStart(2, '0')} 100%)`,
                      }}
                    />
                  </div>
                  <span style={styles.funnelCount}>{stage.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...styles.glassCard, gridColumn: 'span 2' }}>
            <h3 style={styles.cardTitle}>Top Customer Segments</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Segment</th>
                    <th style={styles.tableHeader}>Customers</th>
                    <th style={styles.tableHeader}>Revenue</th>
                    <th style={styles.tableHeader}>Avg Order</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomerSegments.map((segment) => (
                    <tr key={segment.segment} style={styles.tableRow}>
                      <td style={styles.tableCell}>
                        <span style={styles.segmentName}>{segment.segment}</span>
                      </td>
                      <td style={styles.tableCell}>{segment.customers.toLocaleString()}</td>
                      <td style={styles.tableCell}>{formatCurrency(segment.revenue)}</td>
                      <td style={styles.tableCell}>{formatCurrency(segment.avgOrder)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <Package size={18} color={NEON_GREEN} />
          Product Performance
        </h2>
        <div style={styles.productGrid}>
          <div style={styles.glassCard}>
            <h3 style={styles.cardTitle}>
              <TrendingUp size={16} color={NEON_GREEN} style={{ marginRight: 8 }} />
              Best Sellers
            </h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>#</th>
                    <th style={styles.tableHeader}>Product</th>
                    <th style={styles.tableHeader}>Units Sold</th>
                    <th style={styles.tableHeader}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {bestSellers.map((product) => (
                    <tr key={product.rank} style={styles.tableRow}>
                      <td style={styles.tableCell}>
                        <span style={styles.rankBadge}>{product.rank}</span>
                      </td>
                      <td style={styles.tableCell}>{product.product}</td>
                      <td style={styles.tableCell}>{product.unitsSold.toLocaleString()}</td>
                      <td style={{ ...styles.tableCell, color: NEON_GREEN }}>{formatCurrency(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.glassCard}>
            <h3 style={styles.cardTitle}>
              <TrendingDown size={16} color="#FF6B6B" style={{ marginRight: 8 }} />
              Low Performers (Needs Attention)
            </h3>
            <div style={styles.lowPerformersList}>
              {lowPerformers.map((product) => (
                <div key={product.product} style={styles.lowPerformerItem}>
                  <div style={styles.lowPerformerInfo}>
                    <span style={styles.lowPerformerName}>{product.product}</span>
                    <span style={styles.lowPerformerStats}>
                      {product.unitsSold} units | {formatCurrency(product.revenue)}
                    </span>
                  </div>
                  <span style={styles.lowPerformerTrend}>
                    <TrendingDown size={14} />
                    {product.trend}%
                  </span>
                </div>
              ))}
            </div>

            <h3 style={{ ...styles.cardTitle, marginTop: 24 }}>Product Category Breakdown</h3>
            <div style={styles.categoryBreakdown}>
              {productCategoryBreakdown.map((cat) => (
                <div key={cat.category} style={styles.categoryItem}>
                  <div style={styles.categoryInfo}>
                    <span style={styles.categoryName}>{cat.category}</span>
                    <span style={styles.categoryRevenue}>{formatCurrency(cat.revenue)}</span>
                  </div>
                  <div style={styles.categoryBarTrack}>
                    <div
                      style={{
                        ...styles.categoryBarFill,
                        width: `${cat.percentage}%`,
                      }}
                    />
                  </div>
                  <span style={styles.categoryPercentage}>{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <MapPin size={18} color={NEON_GREEN} />
          Geographic Distribution
        </h2>
        <div style={styles.geoGrid}>
          <div style={styles.glassCard}>
            <h3 style={styles.cardTitle}>Sales by State (Top 10)</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>#</th>
                    <th style={styles.tableHeader}>State</th>
                    <th style={styles.tableHeader}>Orders</th>
                    <th style={styles.tableHeader}>Revenue</th>
                    <th style={styles.tableHeader}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {salesByRegion.map((region) => (
                    <tr key={region.state} style={styles.tableRow}>
                      <td style={styles.tableCell}>
                        <span style={styles.rankBadge}>{region.rank}</span>
                      </td>
                      <td style={styles.tableCell}>{region.state}</td>
                      <td style={styles.tableCell}>{region.orders.toLocaleString()}</td>
                      <td style={{ ...styles.tableCell, color: NEON_GREEN }}>{formatCurrency(region.revenue)}</td>
                      <td style={styles.tableCell}>{region.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.glassCard}>
            <h3 style={styles.cardTitle}>Shipping Zones Performance</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Zone</th>
                    <th style={styles.tableHeader}>States</th>
                    <th style={styles.tableHeader}>Orders</th>
                    <th style={styles.tableHeader}>Avg Ship Days</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingDestinations.map((zone) => (
                    <tr key={zone.zone} style={styles.tableRow}>
                      <td style={styles.tableCell}>
                        <span style={styles.zoneBadge}>{zone.zone}</span>
                      </td>
                      <td style={{ ...styles.tableCell, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{zone.states}</td>
                      <td style={styles.tableCell}>{zone.orders.toLocaleString()}</td>
                      <td style={styles.tableCell}>
                        <span style={{
                          color: zone.avgShipDays <= 3 ? NEON_GREEN : zone.avgShipDays <= 4 ? '#FBBF24' : '#FF6B6B',
                        }}>
                          {zone.avgShipDays} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <Clock size={18} color={NEON_GREEN} />
          Time-Based Analysis
        </h2>
        <div style={styles.timeGrid}>
          <div style={styles.glassCard}>
            <h3 style={styles.cardTitle}>Sales by Day of Week</h3>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesByDayOfWeek}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" name="Orders" fill={NEON_GREEN} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.dayInsight}>
              <Sparkles size={14} color={NEON_GREEN} />
              <span>Peak day: <strong>Friday</strong> with 234 orders ({formatCurrency(93600)} revenue)</span>
            </div>
          </div>

          <div style={styles.glassCard}>
            <h3 style={styles.cardTitle}>Sales by Hour (Peak Times)</h3>
            <div style={styles.hourGrid}>
              {salesByHour.map((hour) => (
                <div key={hour.hour} style={styles.hourItem}>
                  <span style={styles.hourLabel}>{hour.hour}</span>
                  <div style={styles.hourBarTrack}>
                    <div
                      style={{
                        ...styles.hourBarFill,
                        height: `${(hour.orders / peakHourOrders) * 100}%`,
                        background: hour.orders === peakHourOrders ? NEON_GREEN : `${NEON_GREEN}80`,
                      }}
                    />
                  </div>
                  <span style={styles.hourValue}>{hour.orders}</span>
                </div>
              ))}
            </div>
            <div style={styles.hourInsight}>
              <div style={styles.peakIndicator}>
                <Sun size={14} color="#FBBF24" />
                <span>Morning Peak: 9am</span>
              </div>
              <div style={styles.peakIndicator}>
                <Moon size={14} color="#8B5CF6" />
                <span>Evening Peak: 8pm</span>
              </div>
            </div>
          </div>

          <div style={{ ...styles.glassCard, gridColumn: 'span 2' }}>
            <h3 style={styles.cardTitle}>Seasonal Revenue Trends (Year Over Year)</h3>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={seasonalTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke={NEON_GREEN} strokeWidth={2} dot={{ fill: NEON_GREEN, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.seasonalInsights}>
              <div style={styles.seasonalItem}>
                <span style={styles.seasonalLabel}>Peak Season</span>
                <span style={styles.seasonalValue}>July ({formatCurrency(489000)})</span>
              </div>
              <div style={styles.seasonalItem}>
                <span style={styles.seasonalLabel}>Avg YoY Growth</span>
                <span style={{ ...styles.seasonalValue, color: NEON_GREEN }}>+20.7%</span>
              </div>
              <div style={styles.seasonalItem}>
                <span style={styles.seasonalLabel}>Best Growth Month</span>
                <span style={styles.seasonalValue}>July (+32% YoY)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </AdminLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  demoBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(0, 255, 133, 0.1)',
    border: `1px solid ${NEON_GREEN}30`,
    borderRadius: 12,
    padding: '12px 20px',
    marginBottom: 32,
    color: NEON_GREEN,
    fontSize: 14,
  },
  section: {
    marginBottom: 48,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 18,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 24,
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
    alignItems: 'flex-start',
    gap: 12,
    transition: 'all 0.2s ease',
  },
  kpiIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: `${NEON_GREEN}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: NEON_GREEN,
    flexShrink: 0,
  },
  kpiContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  kpiLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  kpiValueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: 600,
    color: '#fff',
  },
  kpiChange: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    fontSize: 12,
    fontWeight: 500,
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24,
  },
  glassCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 24,
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 20,
  },
  chartContainer: {
    width: '100%',
  },
  channelLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
  horizontalBarList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  horizontalBarItem: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr 80px',
    alignItems: 'center',
    gap: 16,
  },
  horizontalBarLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  horizontalBarRank: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    width: 24,
  },
  horizontalBarName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  horizontalBarValue: {
    fontSize: 13,
    color: NEON_GREEN,
    fontWeight: 500,
  },
  horizontalBarTrack: {
    height: 8,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  horizontalBarFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.5s ease',
  },
  horizontalBarUnits: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'right',
  },
  customerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24,
  },
  pieLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  funnelContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  funnelStage: {
    display: 'grid',
    gridTemplateColumns: '180px 1fr 80px',
    alignItems: 'center',
    gap: 16,
  },
  funnelLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  funnelStageName: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  funnelPercentage: {
    fontSize: 11,
    color: NEON_GREEN,
    fontWeight: 500,
  },
  funnelBarTrack: {
    height: 6,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  funnelBarFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.5s ease',
  },
  funnelCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'right',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 500,
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  tableRow: {
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  tableCell: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    padding: '12px 16px',
  },
  segmentName: {
    fontWeight: 500,
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
  },
  rankBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    background: `${NEON_GREEN}15`,
    color: NEON_GREEN,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
  },
  lowPerformersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  lowPerformerItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'rgba(255,107,107,0.05)',
    border: '1px solid rgba(255,107,107,0.1)',
    borderRadius: 10,
  },
  lowPerformerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  lowPerformerName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 500,
  },
  lowPerformerStats: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  lowPerformerTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: 500,
  },
  categoryBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  categoryItem: {
    display: 'grid',
    gridTemplateColumns: '150px 1fr 50px',
    alignItems: 'center',
    gap: 12,
  },
  categoryInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  categoryName: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  categoryRevenue: {
    fontSize: 11,
    color: NEON_GREEN,
  },
  categoryBarTrack: {
    height: 6,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${NEON_GREEN} 0%, #8B5CF6 100%)`,
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'right',
  },
  geoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
  },
  zoneBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    background: `${NEON_GREEN}15`,
    color: NEON_GREEN,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
  },
  timeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24,
  },
  dayInsight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: '12px 16px',
    background: `${NEON_GREEN}08`,
    borderRadius: 8,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  hourGrid: {
    display: 'flex',
    gap: 4,
    height: 150,
    alignItems: 'flex-end',
    padding: '0 8px',
  },
  hourItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  hourLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
  },
  hourBarTrack: {
    flex: 1,
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    minHeight: 80,
  },
  hourBarFill: {
    width: '100%',
    borderRadius: 3,
    transition: 'height 0.3s ease',
  },
  hourValue: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
  },
  hourInsight: {
    display: 'flex',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  peakIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  seasonalInsights: {
    display: 'flex',
    justifyContent: 'center',
    gap: 40,
    marginTop: 20,
    paddingTop: 20,
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  seasonalItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  seasonalLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  seasonalValue: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 500,
  },
  tooltip: {
    background: 'rgba(0,0,0,0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '12px 16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  tooltipLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
  },
  tooltipRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    color: '#fff',
    marginBottom: 4,
  },
};
