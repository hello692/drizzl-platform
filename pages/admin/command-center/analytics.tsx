import React from 'react';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
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
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

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
  { date: 'Nov 11', revenue: 12500 },
  { date: 'Nov 13', revenue: 11800 },
  { date: 'Nov 15', revenue: 16800 },
  { date: 'Nov 17', revenue: 14500 },
  { date: 'Nov 19', revenue: 15800 },
  { date: 'Nov 21', revenue: 19200 },
  { date: 'Nov 23', revenue: 23800 },
  { date: 'Nov 25', revenue: 18600 },
  { date: 'Nov 27', revenue: 14800 },
  { date: 'Nov 29', revenue: 28400 },
  { date: 'Dec 1', revenue: 19800 },
  { date: 'Dec 3', revenue: 16200 },
  { date: 'Dec 5', revenue: 20800 },
  { date: 'Dec 7', revenue: 19600 },
  { date: 'Dec 9', revenue: 15800 },
  { date: 'Dec 10', revenue: 18900 },
];

const revenueByCategory = [
  { category: 'Immunity', revenue: 145000 },
  { category: 'Energy', revenue: 98000 },
  { category: 'Detox', revenue: 87000 },
  { category: 'Protein', revenue: 82000 },
  { category: 'Relaxation', revenue: 45000 },
  { category: 'Kids', revenue: 30000 },
];

const customerNewVsReturning = [
  { name: 'New Customers', value: 542, color: NEON_GREEN },
  { name: 'Returning Customers', value: 705, color: '#8B5CF6' },
];

const acquisitionFunnel = [
  { stage: 'Visitors', count: 45200, percentage: 100 },
  { stage: 'Signups', count: 8400, percentage: 18.6 },
  { stage: 'First Purchase', count: 1247, percentage: 2.8 },
  { stage: 'Repeat', count: 705, percentage: 1.6 },
];

const topCustomerSegments = [
  { segment: 'Health Enthusiasts', customers: 3842, revenue: 189400, avgOrder: 412 },
  { segment: 'Young Professionals', customers: 2156, revenue: 142800, avgOrder: 478 },
  { segment: 'Parents', customers: 1847, revenue: 98200, avgOrder: 289 },
  { segment: 'Fitness Athletes', customers: 892, revenue: 87400, avgOrder: 645 },
  { segment: 'Seniors', customers: 1245, revenue: 42100, avgOrder: 186 },
];

const bestSellers = [
  { rank: 1, product: 'Immunity Defense Bundle', unitsSold: 2847, revenue: 42705 },
  { rank: 2, product: 'Energy Boost Pack', unitsSold: 2156, revenue: 32340 },
  { rank: 3, product: 'Detox Starter Kit', unitsSold: 1892, revenue: 28380 },
  { rank: 4, product: 'Protein Power Mix', unitsSold: 1654, revenue: 24810 },
  { rank: 5, product: 'Daily Wellness Box', unitsSold: 1423, revenue: 21345 },
];

const lowPerformers = [
  { product: 'Kids Vitamin Gummies', unitsSold: 127, revenue: 1905, trend: -23 },
  { product: 'Sleep Support Blend', unitsSold: 189, revenue: 2835, trend: -18 },
  { product: 'Focus Formula', unitsSold: 234, revenue: 3510, trend: -12 },
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

const shippingZones = [
  { zone: 'West Coast', states: 'CA, OR, WA, NV', orders: 492, avgShipDays: 2.1 },
  { zone: 'Southwest', states: 'AZ, NM, TX', orders: 287, avgShipDays: 2.8 },
  { zone: 'Mountain', states: 'CO, UT, ID, MT', orders: 156, avgShipDays: 3.2 },
  { zone: 'Midwest', states: 'IL, OH, MI, WI', orders: 134, avgShipDays: 3.8 },
  { zone: 'Southeast', states: 'FL, GA, NC, SC', orders: 178, avgShipDays: 4.1 },
  { zone: 'Northeast', states: 'NY, NJ, PA, MA', orders: 198, avgShipDays: 4.5 },
];

const salesByDayOfWeek = [
  { day: 'Mon', orders: 178, revenue: 71200 },
  { day: 'Tue', orders: 156, revenue: 62400 },
  { day: 'Wed', orders: 189, revenue: 75600 },
  { day: 'Thu', orders: 201, revenue: 80400 },
  { day: 'Fri', orders: 234, revenue: 93600 },
  { day: 'Sat', orders: 167, revenue: 66800 },
  { day: 'Sun', orders: 122, revenue: 48800 },
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
    <CommandCenterLayout title="Analytics">
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.iconWrapper}>
            <BarChart3 size={24} color={NEON_GREEN} />
          </div>
          <div>
            <h1 style={styles.title}>Analytics</h1>
            <p style={styles.subtitle}>Business intelligence and performance metrics</p>
          </div>
        </header>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <BarChart3 size={18} color={NEON_GREEN} />
            Analytics KPIs
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
                      color: kpi.id === 'cac' ? NEON_GREEN : (kpi.changeType === 'up' ? NEON_GREEN : '#FF6B6B'),
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
                <ResponsiveContainer width="100%" height={200}>
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
                  <span>D2C: {formatCurrency(298450)} (61%)</span>
                </div>
                <div style={styles.legendItem}>
                  <span style={{ ...styles.legendDot, background: '#8B5CF6' }} />
                  <span>B2B: {formatCurrency(188942)} (39%)</span>
                </div>
              </div>
            </div>

            <div style={styles.glassCard}>
              <h3 style={styles.cardTitle}>30-Day Revenue Trend</h3>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={revenueTrend30Days}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={NEON_GREEN} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={NEON_GREEN} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} tickLine={false} interval={2} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke={NEON_GREEN} strokeWidth={2} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={{ ...styles.glassCard, marginTop: 16 }}>
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
                </div>
              ))}
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
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Pie
                      data={customerNewVsReturning}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
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
                          background: `linear-gradient(90deg, ${NEON_GREEN} 0%, ${NEON_GREEN}${Math.round((1 - index * 0.2) * 255).toString(16).padStart(2, '0')} 100%)`,
                        }}
                      />
                    </div>
                    <span style={styles.funnelCount}>{stage.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ ...styles.glassCard, marginTop: 16 }}>
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
                      <th style={styles.tableHeader}>Units</th>
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
                Low Performers
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
                      <th style={styles.tableHeader}>Ship Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shippingZones.map((zone) => (
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
                <ResponsiveContainer width="100%" height={220}>
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
              <h3 style={styles.cardTitle}>Peak Hours</h3>
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
          </div>
        </section>
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
    marginBottom: 32,
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
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
  },
  kpiCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  kpiIcon: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 10,
    color: NEON_GREEN,
  },
  kpiContent: {
    flex: 1,
  },
  kpiLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    display: 'block',
    marginBottom: 4,
  },
  kpiValueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: 700,
    color: '#FFFFFF',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: 16,
  },
  glassCard: {
    padding: 24,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 8,
  },
  channelLegend: {
    display: 'flex',
    gap: 24,
    marginTop: 16,
    justifyContent: 'center',
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
    gap: 12,
  },
  horizontalBarItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  horizontalBarLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  horizontalBarRank: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    width: 24,
  },
  horizontalBarName: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
  },
  horizontalBarValue: {
    fontSize: 13,
    fontWeight: 600,
    color: NEON_GREEN,
  },
  horizontalBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  horizontalBarFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  customerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: 16,
  },
  pieLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  funnelContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  funnelStage: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
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
    fontSize: 12,
    color: NEON_GREEN,
    fontWeight: 600,
  },
  funnelBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  funnelBarFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  funnelCount: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    textAlign: 'left' as const,
    padding: '12px 16px',
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  tableRow: {
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  tableCell: {
    padding: '12px 16px',
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  segmentName: {
    fontWeight: 500,
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: 16,
  },
  rankBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
  },
  lowPerformersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  lowPerformerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
    border: '1px solid rgba(255, 107, 107, 0.1)',
    borderRadius: 10,
  },
  lowPerformerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  lowPerformerName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  lowPerformerStats: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  lowPerformerTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    fontWeight: 600,
    color: '#FF6B6B',
  },
  geoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: 16,
  },
  zoneBadge: {
    fontSize: 12,
    fontWeight: 500,
    color: NEON_GREEN,
  },
  timeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: 16,
  },
  dayInsight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: '12px 16px',
    backgroundColor: 'rgba(0, 255, 133, 0.05)',
    borderRadius: 8,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  hourGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(18, 1fr)',
    gap: 4,
    height: 140,
  },
  hourItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  hourLabel: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.4)',
    transform: 'rotate(-45deg)',
    whiteSpace: 'nowrap' as const,
  },
  hourBarTrack: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  hourBarFill: {
    width: '100%',
    borderRadius: 4,
    transition: 'height 0.3s ease',
  },
  hourValue: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.4)',
  },
  hourInsight: {
    display: 'flex',
    gap: 24,
    marginTop: 16,
    justifyContent: 'center',
  },
  peakIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: '12px 16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  tooltipLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tooltipRow: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
};
