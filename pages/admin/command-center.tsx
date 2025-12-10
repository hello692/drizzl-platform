import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useRequireAdmin } from '../../hooks/useRole';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Wallet,
  Clock,
  Factory,
  AlertTriangle,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  AlertCircle,
  Lightbulb,
  Rocket,
  Target,
  Zap,
  BarChart3,
  Package,
  Megaphone,
  Headphones,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface TodayMetric {
  id: string;
  label: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down';
  subtitle?: string;
  icon: React.ReactNode;
  live?: boolean;
}

interface ProductionBatch {
  id: string;
  batchNumber: string;
  units: number;
  stage: string;
  progress: number;
  status: 'green' | 'yellow' | 'blue';
  timeNote?: string;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'urgent' | 'warning';
  action: string;
}

interface AIInsight {
  id: string;
  emoji: string;
  title: string;
  description: string;
  actions: { label: string; primary?: boolean }[];
}

interface RevenueTrendPoint {
  date: string;
  d2c: number;
  b2b: number;
}

const mockMetrics: TodayMetric[] = [
  {
    id: 'revenue',
    label: 'Revenue Today',
    value: '$47,382',
    change: '23%',
    changeType: 'up',
    icon: <DollarSign size={20} />,
  },
  {
    id: 'orders',
    label: 'Orders Placed',
    value: '127',
    change: '18%',
    changeType: 'up',
    icon: <ShoppingCart size={20} />,
  },
  {
    id: 'visitors',
    label: 'Active Visitors',
    value: '43',
    live: true,
    icon: <Users size={20} />,
  },
  {
    id: 'conversion',
    label: 'Conversion Rate',
    value: '3.8%',
    change: '0.4%',
    changeType: 'up',
    icon: <TrendingUp size={20} />,
  },
  {
    id: 'aov',
    label: 'Average Order Value',
    value: '$373',
    change: '$21',
    changeType: 'up',
    icon: <Wallet size={20} />,
  },
  {
    id: 'cash',
    label: 'Cash Balance',
    value: '$284,392',
    subtitle: 'Mercury',
    icon: <DollarSign size={20} />,
  },
  {
    id: 'payables',
    label: 'Pending Payables',
    value: '$82,104',
    subtitle: '8 days',
    icon: <Clock size={20} />,
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing Status',
    value: '78%',
    subtitle: 'capacity',
    icon: <Factory size={20} />,
  },
  {
    id: 'inventory',
    label: 'Inventory Alerts',
    value: '3',
    subtitle: 'items',
    icon: <AlertTriangle size={20} />,
  },
  {
    id: 'b2b',
    label: 'B2B Pipeline',
    value: '$1.2M',
    subtitle: '14 deals',
    icon: <Briefcase size={20} />,
  },
];

const mockRevenueTrend: RevenueTrendPoint[] = [
  { date: 'Nov 11', d2c: 28500, b2b: 15200 },
  { date: 'Nov 12', d2c: 31200, b2b: 14800 },
  { date: 'Nov 13', d2c: 29800, b2b: 16300 },
  { date: 'Nov 14', d2c: 33500, b2b: 18200 },
  { date: 'Nov 15', d2c: 35200, b2b: 17500 },
  { date: 'Nov 16', d2c: 38900, b2b: 19800 },
  { date: 'Nov 17', d2c: 36400, b2b: 16900 },
  { date: 'Nov 18', d2c: 32100, b2b: 15400 },
  { date: 'Nov 19', d2c: 29600, b2b: 14200 },
  { date: 'Nov 20', d2c: 31800, b2b: 16800 },
  { date: 'Nov 21', d2c: 34500, b2b: 18100 },
  { date: 'Nov 22', d2c: 37200, b2b: 19500 },
  { date: 'Nov 23', d2c: 39800, b2b: 21200 },
  { date: 'Nov 24', d2c: 42500, b2b: 22800 },
  { date: 'Nov 25', d2c: 38600, b2b: 20100 },
  { date: 'Nov 26', d2c: 35400, b2b: 18400 },
  { date: 'Nov 27', d2c: 33200, b2b: 17200 },
  { date: 'Nov 28', d2c: 36800, b2b: 19600 },
  { date: 'Nov 29', d2c: 41200, b2b: 21800 },
  { date: 'Nov 30', d2c: 44500, b2b: 23500 },
  { date: 'Dec 1', d2c: 42800, b2b: 22100 },
  { date: 'Dec 2', d2c: 39600, b2b: 20400 },
  { date: 'Dec 3', d2c: 37200, b2b: 18800 },
  { date: 'Dec 4', d2c: 35800, b2b: 17500 },
  { date: 'Dec 5', d2c: 38400, b2b: 19200 },
  { date: 'Dec 6', d2c: 41600, b2b: 21400 },
  { date: 'Dec 7', d2c: 43900, b2b: 22800 },
  { date: 'Dec 8', d2c: 45200, b2b: 23600 },
  { date: 'Dec 9', d2c: 47800, b2b: 24500 },
  { date: 'Dec 10', d2c: 48500, b2b: 25200 },
];

const mockProductionPipeline: ProductionBatch[] = [
  { id: '1', batchNumber: '#2847', units: 5000, stage: 'Bottling', progress: 89, status: 'green' },
  { id: '2', batchNumber: '#2848', units: 3200, stage: 'Mixing', progress: 45, status: 'yellow' },
  { id: '3', batchNumber: '#2849', units: 8000, stage: 'Scheduled', progress: 0, status: 'blue', timeNote: 'Starts in 6hrs' },
  { id: '4', batchNumber: '#2850', units: 4500, stage: 'Quality Testing', progress: 100, status: 'green' },
];

const mockAlerts: Alert[] = [
  { id: '1', title: 'Low Stock: Strawberry Base', description: 'Only 12 units remaining. Reorder needed.', type: 'urgent', action: 'Reorder Now' },
  { id: '2', title: 'Payment Overdue: Whole Foods', description: 'Invoice #4521 - $24,500 (5 days overdue)', type: 'urgent', action: 'Send Reminder' },
  { id: '3', title: 'Shipping Delay: Batch #2845', description: 'Carrier reported 2-day delay', type: 'urgent', action: 'Contact Carrier' },
  { id: '4', title: 'Inventory approaching reorder point', description: 'Mango base at 85 units (threshold: 100)', type: 'warning', action: 'Review' },
  { id: '5', title: 'New B2B inquiry pending', description: 'Sprouts Farmers Market - bulk order request', type: 'warning', action: 'View Request' },
  { id: '6', title: 'Equipment maintenance due', description: 'Mixer #3 scheduled for service', type: 'warning', action: 'Schedule' },
  { id: '7', title: 'Certificate expiring soon', description: 'Organic certification expires in 30 days', type: 'warning', action: 'Renew' },
  { id: '8', title: 'Customer feedback spike', description: '15 new reviews today (avg: 5)', type: 'warning', action: 'View' },
  { id: '9', title: 'Supplier price change', description: 'Açaí supplier increasing prices 5%', type: 'warning', action: 'Negotiate' },
  { id: '10', title: 'Social mention trending', description: 'TikTok video gaining traction', type: 'warning', action: 'Engage' },
];

const mockInsights: AIInsight[] = [
  {
    id: '1',
    emoji: '🚀',
    title: 'Production Opportunity',
    description: 'Based on current demand trends, increasing Strawberry Peach production by 20% could capture $45K additional revenue this month.',
    actions: [{ label: 'Increase Production', primary: true }, { label: 'View Analysis' }],
  },
  {
    id: '2',
    emoji: '💰',
    title: 'Cash Flow Warning',
    description: 'Projected cash position in 14 days: $142K. Consider accelerating receivables collection or delaying non-critical expenses.',
    actions: [{ label: 'View Cash Flow', primary: true }, { label: 'Dismiss' }],
  },
  {
    id: '3',
    emoji: '📈',
    title: 'Marketing Scale-Up',
    description: 'Meta ads ROAS increased 35% this week. Consider increasing daily budget from $500 to $800 for optimal returns.',
    actions: [{ label: 'Adjust Budget', primary: true }, { label: 'View Performance' }],
  },
  {
    id: '4',
    emoji: '🎯',
    title: 'Customer Retention Alert',
    description: '47 high-value customers haven\'t reordered in 45+ days. Personalized win-back campaign could recover $28K in revenue.',
    actions: [{ label: 'Launch Campaign', primary: true }, { label: 'View Customers' }],
  },
  {
    id: '5',
    emoji: '🏪',
    title: 'B2B Expansion Opportunity',
    description: 'Regional grocery chain "Fresh Market" matches your ideal customer profile. They\'re actively seeking new wellness brands.',
    actions: [{ label: 'Create Proposal', primary: true }, { label: 'Research' }],
  },
];

const quickActions = [
  { label: 'View Cash Flow', icon: <DollarSign size={16} /> },
  { label: 'Check Inventory', icon: <Package size={16} /> },
  { label: 'B2B Deals', icon: <Briefcase size={16} /> },
  { label: 'Production', icon: <Factory size={16} /> },
  { label: 'Marketing Performance', icon: <Megaphone size={16} /> },
  { label: 'Customer Tickets', icon: <Headphones size={16} /> },
  { label: 'Ask AI', icon: <Sparkles size={16} />, primary: true },
];

function Skeleton({ height = 20, width = '100%' }: { height?: number; width?: string | number }) {
  return (
    <div
      style={{
        height,
        width,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: 8,
      }}
    />
  );
}

function MetricCard({ metric, loading }: { metric: TodayMetric; loading: boolean }) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricIcon}>{metric.icon}</div>
      <div style={styles.metricContent}>
        <span style={styles.metricLabel}>{metric.label}</span>
        {loading ? (
          <Skeleton height={28} width={80} />
        ) : (
          <div style={styles.metricValueRow}>
            <span style={styles.metricValue}>{metric.value}</span>
            {metric.live && (
              <span style={styles.liveIndicator}>
                <span style={styles.liveDot} />
                LIVE
              </span>
            )}
            {metric.change && (
              <span style={{ ...styles.metricChange, color: metric.changeType === 'up' ? NEON_GREEN : '#FF6B6B' }}>
                {metric.changeType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {metric.change}
              </span>
            )}
          </div>
        )}
        {metric.subtitle && <span style={styles.metricSubtitle}>{metric.subtitle}</span>}
      </div>
    </div>
  );
}

function RevenueTrendChart({ data, loading }: { data: RevenueTrendPoint[]; loading: boolean }) {
  if (loading) {
    return <Skeleton height={300} />;
  }

  const totalD2C = data.reduce((sum, d) => sum + d.d2c, 0);
  const totalB2B = data.reduce((sum, d) => sum + d.b2b, 0);
  const total = totalD2C + totalB2B;
  const d2cPercent = Math.round((totalD2C / total) * 100);
  const b2bPercent = 100 - d2cPercent;

  return (
    <div>
      <div style={styles.chartLegend}>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: NEON_GREEN }} />
          <span>D2C ${(totalD2C / 1000).toFixed(0)}K ({d2cPercent}%)</span>
        </div>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: '#8B5CF6' }} />
          <span>B2B ${(totalB2B / 1000).toFixed(0)}K ({b2bPercent}%)</span>
        </div>
        <div style={{ ...styles.legendItem, marginLeft: 'auto' }}>
          <span style={{ color: '#fff', fontWeight: 600 }}>Total: ${(total / 1000).toFixed(0)}K</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorD2C" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={NEON_GREEN} stopOpacity={0.3} />
              <stop offset="95%" stopColor={NEON_GREEN} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorB2B" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
            tickLine={false}
            interval={4}
          />
          <YAxis
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
            tickLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(0,0,0,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#fff',
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
          />
          <Area
            type="monotone"
            dataKey="d2c"
            stroke={NEON_GREEN}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorD2C)"
            name="D2C"
          />
          <Area
            type="monotone"
            dataKey="b2b"
            stroke="#8B5CF6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorB2B)"
            name="B2B"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProductionCard({ batch }: { batch: ProductionBatch }) {
  const statusColors = {
    green: NEON_GREEN,
    yellow: '#FBBF24',
    blue: '#3B82F6',
  };
  const color = statusColors[batch.status];

  return (
    <div style={styles.productionCard}>
      <div style={styles.productionHeader}>
        <span style={styles.batchNumber}>Batch {batch.batchNumber}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{batch.units.toLocaleString()} units</span>
      </div>
      <div style={styles.productionStage}>
        <span style={{ color }}>{batch.stage}</span>
        {batch.timeNote && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{batch.timeNote}</span>}
      </div>
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${batch.progress}%`, background: color }} />
      </div>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{batch.progress}% complete</span>
    </div>
  );
}

function AlertItem({ alert }: { alert: Alert }) {
  const isUrgent = alert.type === 'urgent';
  return (
    <div style={{ ...styles.alertItem, borderLeftColor: isUrgent ? '#EF4444' : '#FBBF24' }}>
      <div style={styles.alertContent}>
        {isUrgent ? <AlertCircle size={16} color="#EF4444" /> : <Info size={16} color="#FBBF24" />}
        <div>
          <p style={styles.alertTitle}>{alert.title}</p>
          <p style={styles.alertDesc}>{alert.description}</p>
        </div>
      </div>
      <button style={styles.alertAction}>{alert.action}</button>
    </div>
  );
}

function InsightCard({ insight }: { insight: AIInsight }) {
  return (
    <div style={styles.insightCard}>
      <div style={styles.insightEmoji}>{insight.emoji}</div>
      <div style={styles.insightContent}>
        <h4 style={styles.insightTitle}>{insight.title}</h4>
        <p style={styles.insightDesc}>{insight.description}</p>
        <div style={styles.insightActions}>
          {insight.actions.map((action, i) => (
            <button
              key={i}
              style={action.primary ? styles.primaryButton : styles.secondaryButton}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const isDemoMode = true;

export default function CommandCenter() {
  const { loading, authorized } = useRequireAdmin();
  const [dataLoading, setDataLoading] = useState(false);

  if (!isDemoMode && loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Initializing Command Center...</p>
      </div>
    );
  }

  if (!isDemoMode && !authorized) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Authenticating...</p>
      </div>
    );
  }

  const urgentAlerts = mockAlerts.filter((a) => a.type === 'urgent');
  const warningAlerts = mockAlerts.filter((a) => a.type === 'warning');

  return (
    <AdminLayout title="Command Center" subtitle="Real-time Business Intelligence">
      <div style={styles.container}>
        {/* Today's Metrics */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Activity size={18} color={NEON_GREEN} />
            Today's Metrics
          </h2>
          <div style={styles.metricsGrid}>
            {mockMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} loading={dataLoading} />
            ))}
          </div>
        </section>

        {/* Revenue Trend Chart */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <BarChart3 size={18} color={NEON_GREEN} />
            30-Day Revenue Trend
          </h2>
          <div style={styles.card}>
            <RevenueTrendChart data={mockRevenueTrend} loading={dataLoading} />
          </div>
        </section>

        {/* Production Pipeline */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Factory size={18} color={NEON_GREEN} />
            Production Pipeline
          </h2>
          <div style={styles.productionGrid}>
            {dataLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={styles.productionCard}>
                    <Skeleton height={120} />
                  </div>
                ))
              : mockProductionPipeline.map((batch) => <ProductionCard key={batch.id} batch={batch} />)}
          </div>
        </section>

        {/* Critical Alerts */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <AlertTriangle size={18} color={NEON_GREEN} />
            Critical Alerts
          </h2>
          <div style={styles.alertsGrid}>
            <div style={styles.alertSection}>
              <div style={styles.alertHeader}>
                <span style={styles.urgentBadge}>
                  <XCircle size={14} />
                  URGENT
                </span>
                <span style={styles.alertCount}>{urgentAlerts.length} items</span>
              </div>
              {dataLoading ? (
                <Skeleton height={200} />
              ) : (
                urgentAlerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)
              )}
            </div>
            <div style={styles.alertSection}>
              <div style={styles.alertHeader}>
                <span style={styles.warningBadge}>
                  <AlertTriangle size={14} />
                  WARNING
                </span>
                <span style={styles.alertCount}>{warningAlerts.length} items</span>
              </div>
              {dataLoading ? (
                <Skeleton height={200} />
              ) : (
                warningAlerts.slice(0, 7).map((alert) => <AlertItem key={alert.id} alert={alert} />)
              )}
            </div>
          </div>
        </section>

        {/* AI Insights */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Lightbulb size={18} color={NEON_GREEN} />
            AI Insights & Recommendations
          </h2>
          <div style={styles.insightsGrid}>
            {dataLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={styles.insightCard}>
                    <Skeleton height={140} />
                  </div>
                ))
              : mockInsights.map((insight) => <InsightCard key={insight.id} insight={insight} />)}
          </div>
        </section>

        {/* Quick Actions */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Zap size={18} color={NEON_GREEN} />
            Quick Actions
          </h2>
          <div style={styles.quickActionsRow}>
            {quickActions.map((action, i) => (
              <button
                key={i}
                style={action.primary ? styles.quickActionPrimary : styles.quickAction}
              >
                {action.icon}
                {action.label}
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 133, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 255, 133, 0.6); }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </AdminLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
    gap: 24,
  },
  loadingOrb: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${NEON_GREEN} 0%, #00CC6A 100%)`,
    animation: 'pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    letterSpacing: 2,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 24,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
  },
  metricCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    transition: 'all 0.2s ease',
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'rgba(0, 255, 133, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: NEON_GREEN,
    flexShrink: 0,
  },
  metricContent: {
    flex: 1,
    minWidth: 0,
  },
  metricLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    display: 'block',
    marginBottom: 6,
  },
  metricValueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: -0.5,
  },
  metricChange: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    fontSize: 13,
    fontWeight: 500,
  },
  metricSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    display: 'block',
    marginTop: 4,
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 10,
    fontWeight: 600,
    color: NEON_GREEN,
    letterSpacing: 1,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: NEON_GREEN,
    animation: 'livePulse 1.5s ease-in-out infinite',
  },
  chartLegend: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
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
    borderRadius: 3,
  },
  productionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  productionCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 20,
  },
  productionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  batchNumber: {
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
  },
  productionStage: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    fontSize: 14,
    fontWeight: 500,
  },
  progressBar: {
    height: 6,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.5s ease',
  },
  alertsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
  alertSection: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 20,
  },
  alertHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  urgentBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#EF4444',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  warningBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    background: 'rgba(251, 191, 36, 0.15)',
    color: '#FBBF24',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  alertCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  alertItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
    marginBottom: 10,
    borderLeft: '3px solid',
  },
  alertContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  alertAction: {
    background: 'rgba(255,255,255,0.08)',
    border: 'none',
    borderRadius: 6,
    padding: '8px 14px',
    fontSize: 12,
    fontWeight: 500,
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  insightsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  insightCard: {
    display: 'flex',
    gap: 20,
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 24,
  },
  insightEmoji: {
    fontSize: 32,
    flexShrink: 0,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 8,
  },
  insightDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.5,
    marginBottom: 16,
  },
  insightActions: {
    display: 'flex',
    gap: 10,
  },
  primaryButton: {
    background: NEON_GREEN,
    color: '#000',
    border: 'none',
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  secondaryButton: {
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  quickActionsRow: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  quickAction: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 10,
    padding: '12px 18px',
    fontSize: 13,
    fontWeight: 500,
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  quickActionPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: NEON_GREEN,
    border: 'none',
    borderRadius: 10,
    padding: '12px 18px',
    fontSize: 13,
    fontWeight: 600,
    color: '#000',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
