import React from 'react';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
import {
  DollarSign,
  ShoppingCart,
  Wallet,
  Briefcase,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  ArrowUpRight,
  Package,
  Users,
  Zap,
  Factory,
  Gauge,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Truck,
  FileText,
  CreditCard,
  Mail,
  Phone,
  User,
  Building2,
  Target,
  Activity,
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
  LineChart,
  Line,
} from 'recharts';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface KPICard {
  id: string;
  label: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  icon: React.ReactNode;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'urgent' | 'warning';
}

interface QuickStat {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface AIRecommendation {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

interface RevenueTrendPoint {
  date: string;
  revenue: number;
}

interface ProductionBatch {
  id: string;
  batchNumber: string;
  product: string;
  status: 'running' | 'queued' | 'completed' | 'paused';
  progress: number;
  unitsTarget: number;
}

interface B2BDeal {
  id: string;
  partner: string;
  value: number;
  stage: 'negotiation' | 'proposal' | 'closing' | 'contract';
  probability: number;
}

interface ActivityItem {
  id: string;
  type: 'order' | 'payment' | 'production' | 'shipping' | 'lead' | 'alert';
  title: string;
  description: string;
  time: string;
}

const kpiCards: KPICard[] = [
  {
    id: 'revenue',
    label: "Today's Revenue",
    value: '$47,392',
    change: '+23%',
    changeType: 'up',
    subtitle: 'vs yesterday',
    icon: <DollarSign size={20} />,
  },
  {
    id: 'orders',
    label: 'Orders Today',
    value: '127',
    change: '+18%',
    changeType: 'up',
    icon: <ShoppingCart size={20} />,
  },
  {
    id: 'cash',
    label: 'Cash Balance',
    value: '$284,392',
    subtitle: 'from Mercury',
    icon: <Wallet size={20} />,
  },
  {
    id: 'pipeline',
    label: 'B2B Pipeline Value',
    value: '$1.2M',
    subtitle: '14 active deals',
    icon: <Briefcase size={20} />,
  },
  {
    id: 'production',
    label: 'Production Output',
    value: '12,450',
    subtitle: 'units today',
    icon: <Factory size={20} />,
  },
];

const criticalAlerts: Alert[] = [
  {
    id: '1',
    title: 'Low Stock: Strawberry Base',
    description: '12 units remaining, reorder needed',
    type: 'urgent',
  },
  {
    id: '2',
    title: 'Payment Overdue: Whole Foods',
    description: 'Invoice #4521 - $24,500 (5 days overdue)',
    type: 'urgent',
  },
  {
    id: '3',
    title: 'Equipment Alert: Blender Unit #3',
    description: 'Scheduled maintenance required',
    type: 'warning',
  },
  {
    id: '4',
    title: 'Shipping Delay: Batch #2845',
    description: 'Carrier reported 2-day delay',
    type: 'warning',
  },
];

const quickStats: QuickStat[] = [
  {
    id: '1',
    label: 'Active Visitors',
    value: '43',
    icon: <Users size={18} />,
  },
  {
    id: '2',
    label: 'Conversion Rate',
    value: '3.8%',
    icon: <TrendingUp size={18} />,
  },
  {
    id: '3',
    label: 'Inventory Alerts',
    value: '3 items',
    icon: <Package size={18} />,
  },
  {
    id: '4',
    label: 'Production Efficiency',
    value: '94%',
    icon: <Gauge size={18} />,
  },
];

const aiRecommendations: AIRecommendation[] = [
  {
    id: '1',
    emoji: '📈',
    title: 'Scale Production',
    description: 'Scale Immune Boost production +40% - trending product with high demand signals.',
  },
  {
    id: '2',
    emoji: '🤝',
    title: 'Hot B2B Opportunity',
    description: 'Follow up with Walmart buyer - hot deal worth $180K, decision expected this week.',
  },
  {
    id: '3',
    emoji: '💰',
    title: 'Collections Priority',
    description: 'Chase 3 overdue invoices totaling $34,500 - aging beyond 30 days.',
  },
];

const revenueTrendData: RevenueTrendPoint[] = [
  { date: 'Nov 10', revenue: 32500 },
  { date: 'Nov 11', revenue: 28500 },
  { date: 'Nov 12', revenue: 31200 },
  { date: 'Nov 13', revenue: 29800 },
  { date: 'Nov 14', revenue: 34500 },
  { date: 'Nov 15', revenue: 35200 },
  { date: 'Nov 16', revenue: 33800 },
  { date: 'Nov 17', revenue: 36400 },
  { date: 'Nov 18', revenue: 31200 },
  { date: 'Nov 19', revenue: 29600 },
  { date: 'Nov 20', revenue: 38500 },
  { date: 'Nov 21', revenue: 34500 },
  { date: 'Nov 22', revenue: 41200 },
  { date: 'Nov 23', revenue: 39800 },
  { date: 'Nov 24', revenue: 36500 },
  { date: 'Nov 25', revenue: 38600 },
  { date: 'Nov 26', revenue: 42300 },
  { date: 'Nov 27', revenue: 33200 },
  { date: 'Nov 28', revenue: 35800 },
  { date: 'Nov 29', revenue: 41200 },
  { date: 'Nov 30', revenue: 44500 },
  { date: 'Dec 1', revenue: 42800 },
  { date: 'Dec 2', revenue: 39200 },
  { date: 'Dec 3', revenue: 37200 },
  { date: 'Dec 4', revenue: 41500 },
  { date: 'Dec 5', revenue: 38400 },
  { date: 'Dec 6', revenue: 45200 },
  { date: 'Dec 7', revenue: 43900 },
  { date: 'Dec 8', revenue: 46200 },
  { date: 'Dec 9', revenue: 47800 },
  { date: 'Dec 10', revenue: 47392 },
];

const productionPipeline: ProductionBatch[] = [
  {
    id: 'batch-1',
    batchNumber: '#2847',
    product: 'Strawberry Peach Smoothie',
    status: 'running',
    progress: 72,
    unitsTarget: 4000,
  },
  {
    id: 'batch-2',
    batchNumber: '#2848',
    product: 'Mango Jackfruit Blend',
    status: 'running',
    progress: 45,
    unitsTarget: 4000,
  },
  {
    id: 'batch-3',
    batchNumber: '#2849',
    product: 'Açaí Berry Bowl Mix',
    status: 'queued',
    progress: 0,
    unitsTarget: 3500,
  },
  {
    id: 'batch-4',
    batchNumber: '#2850',
    product: 'Coffee Mushroom Blend',
    status: 'completed',
    progress: 100,
    unitsTarget: 3000,
  },
];

const topB2BDeals: B2BDeal[] = [
  {
    id: 'deal-1',
    partner: 'Walmart',
    value: 180000,
    stage: 'closing',
    probability: 85,
  },
  {
    id: 'deal-2',
    partner: 'Whole Foods',
    value: 245000,
    stage: 'negotiation',
    probability: 60,
  },
  {
    id: 'deal-3',
    partner: 'Target',
    value: 320000,
    stage: 'proposal',
    probability: 45,
  },
  {
    id: 'deal-4',
    partner: 'Costco',
    value: 425000,
    stage: 'proposal',
    probability: 35,
  },
  {
    id: 'deal-5',
    partner: "Trader Joe's",
    value: 156000,
    stage: 'contract',
    probability: 95,
  },
];

const recentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'order',
    title: 'New D2C Order #12847',
    description: '$342.00 - 12 items from Los Angeles, CA',
    time: '2 min ago',
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    description: 'Sprouts Farmers Market - $15,800',
    time: '8 min ago',
  },
  {
    id: '3',
    type: 'production',
    title: 'Batch #2846 Completed',
    description: 'Nutty Monkey Protein - 3,000 units',
    time: '15 min ago',
  },
  {
    id: '4',
    type: 'lead',
    title: 'New B2B Lead',
    description: 'Fresh Thyme Market - Regional grocery chain',
    time: '22 min ago',
  },
  {
    id: '5',
    type: 'shipping',
    title: 'Order Shipped',
    description: 'Whole Foods Phoenix - Tracking #WF2845',
    time: '35 min ago',
  },
  {
    id: '6',
    type: 'order',
    title: 'New D2C Order #12846',
    description: '$128.00 - 4 items from Seattle, WA',
    time: '42 min ago',
  },
  {
    id: '7',
    type: 'alert',
    title: 'Inventory Alert',
    description: 'Mango puree below reorder point',
    time: '1 hour ago',
  },
  {
    id: '8',
    type: 'payment',
    title: 'Invoice Sent',
    description: 'Target Corporation - $32,500',
    time: '1.5 hours ago',
  },
  {
    id: '9',
    type: 'production',
    title: 'Batch #2845 Started',
    description: 'Matcha Green Energy - 3,500 units',
    time: '2 hours ago',
  },
  {
    id: '10',
    type: 'lead',
    title: 'B2B Meeting Scheduled',
    description: 'Walmart buyer - Dec 12, 2025 at 2:00 PM',
    time: '3 hours ago',
  },
];

function formatDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'running':
    case 'completed':
    case 'contract':
      return NEON_GREEN;
    case 'queued':
    case 'negotiation':
    case 'proposal':
      return '#FFB800';
    case 'paused':
    case 'closing':
      return '#60A5FA';
    default:
      return 'rgba(255,255,255,0.5)';
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'order':
      return <ShoppingCart size={16} />;
    case 'payment':
      return <CreditCard size={16} />;
    case 'production':
      return <Factory size={16} />;
    case 'shipping':
      return <Truck size={16} />;
    case 'lead':
      return <Building2 size={16} />;
    case 'alert':
      return <AlertCircle size={16} />;
    default:
      return <Activity size={16} />;
  }
}

function getActivityColor(type: string): string {
  switch (type) {
    case 'order':
      return NEON_GREEN;
    case 'payment':
      return '#60A5FA';
    case 'production':
      return '#A78BFA';
    case 'shipping':
      return '#FFB800';
    case 'lead':
      return '#F472B6';
    case 'alert':
      return '#FF6B6B';
    default:
      return 'rgba(255,255,255,0.5)';
  }
}

export default function CommandCenterDashboard() {
  return (
    <CommandCenterLayout title="Dashboard">
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>MASTER COMMAND CENTER</h1>
            <p style={styles.date}>{formatDate()}</p>
          </div>
          <div style={styles.liveIndicator}>
            <span style={styles.liveDot} />
            <span style={styles.liveText}>LIVE</span>
          </div>
        </header>

        <section style={styles.kpiSection}>
          {kpiCards.map((card) => (
            <div key={card.id} style={styles.kpiCard}>
              <div style={styles.kpiIcon}>{card.icon}</div>
              <div style={styles.kpiContent}>
                <span style={styles.kpiLabel}>{card.label}</span>
                <div style={styles.kpiValueRow}>
                  <span style={styles.kpiValue}>{card.value}</span>
                  {card.change && (
                    <span style={{
                      ...styles.kpiChange,
                      color: card.changeType === 'up' ? NEON_GREEN : card.changeType === 'down' ? '#FF6B6B' : 'rgba(255,255,255,0.5)',
                    }}>
                      {card.changeType === 'up' && <ArrowUpRight size={14} />}
                      {card.changeType === 'down' && <TrendingDown size={14} />}
                      {card.change}
                    </span>
                  )}
                </div>
                {card.subtitle && (
                  <span style={styles.kpiSubtitle}>{card.subtitle}</span>
                )}
              </div>
            </div>
          ))}
        </section>

        <div style={styles.twoColumnSection}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <AlertTriangle size={18} color="#FF6B6B" />
              <h2 style={styles.cardTitle}>Critical Alerts</h2>
              <span style={styles.badge}>{criticalAlerts.length}</span>
            </div>
            <div style={styles.alertList}>
              {criticalAlerts.map((alert) => (
                <div key={alert.id} style={styles.alertItem}>
                  <div style={{
                    ...styles.alertDot,
                    backgroundColor: alert.type === 'urgent' ? '#FF6B6B' : '#FFB800',
                  }} />
                  <div style={styles.alertContent}>
                    <span style={styles.alertTitle}>{alert.title}</span>
                    <span style={styles.alertDescription}>{alert.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <Zap size={18} color={NEON_GREEN} />
              <h2 style={styles.cardTitle}>Quick Stats</h2>
            </div>
            <div style={styles.statList}>
              {quickStats.map((stat) => (
                <div key={stat.id} style={styles.statItem}>
                  <div style={styles.statIcon}>{stat.icon}</div>
                  <span style={styles.statLabel}>{stat.label}</span>
                  <span style={styles.statValue}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Lightbulb size={18} color="#FFB800" />
            <h2 style={styles.cardTitle}>AI Recommendations</h2>
          </div>
          <div style={styles.recommendationGrid}>
            {aiRecommendations.map((rec) => (
              <div key={rec.id} style={styles.recommendationCard}>
                <span style={styles.recommendationEmoji}>{rec.emoji}</span>
                <h3 style={styles.recommendationTitle}>{rec.title}</h3>
                <p style={styles.recommendationDescription}>{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <TrendingUp size={18} color={NEON_GREEN} />
            <h2 style={styles.cardTitle}>Revenue Trend (30 Days)</h2>
          </div>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={NEON_GREEN} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={NEON_GREEN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.4)" 
                  fontSize={11} 
                  tickLine={false}
                  interval={4}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.4)" 
                  fontSize={11} 
                  tickFormatter={(v) => `$${v / 1000}K`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: `1px solid ${CARD_BORDER}`,
                    borderRadius: 8,
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={NEON_GREEN}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Daily Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.twoColumnSection}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <Factory size={18} color="#A78BFA" />
              <h2 style={styles.cardTitle}>Production Pipeline</h2>
            </div>
            <div style={styles.pipelineList}>
              {productionPipeline.map((batch) => (
                <div key={batch.id} style={styles.pipelineItem}>
                  <div style={styles.pipelineHeader}>
                    <span style={styles.batchNumber}>{batch.batchNumber}</span>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: `${getStatusColor(batch.status)}20`,
                      color: getStatusColor(batch.status),
                    }}>
                      {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                    </span>
                  </div>
                  <span style={styles.productName}>{batch.product}</span>
                  <div style={styles.progressContainer}>
                    <div style={styles.progressBar}>
                      <div style={{
                        ...styles.progressFill,
                        width: `${batch.progress}%`,
                        backgroundColor: getStatusColor(batch.status),
                      }} />
                    </div>
                    <span style={styles.progressText}>{batch.progress}%</span>
                  </div>
                  <span style={styles.unitsTarget}>{batch.unitsTarget.toLocaleString()} units</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <Briefcase size={18} color="#60A5FA" />
              <h2 style={styles.cardTitle}>Top B2B Deals</h2>
            </div>
            <div style={styles.dealsList}>
              {topB2BDeals.map((deal) => (
                <div key={deal.id} style={styles.dealItem}>
                  <div style={styles.dealInfo}>
                    <span style={styles.dealPartner}>{deal.partner}</span>
                    <span style={{
                      ...styles.dealStage,
                      color: getStatusColor(deal.stage),
                    }}>
                      {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                    </span>
                  </div>
                  <div style={styles.dealMeta}>
                    <span style={styles.dealValue}>{formatCurrency(deal.value)}</span>
                    <span style={styles.dealProbability}>{deal.probability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Clock size={18} color="rgba(255,255,255,0.6)" />
            <h2 style={styles.cardTitle}>Recent Activity</h2>
          </div>
          <div style={styles.activityTimeline}>
            {recentActivity.map((item, index) => (
              <div key={item.id} style={styles.activityItem}>
                <div style={styles.activityIconWrapper}>
                  <div style={{
                    ...styles.activityIcon,
                    backgroundColor: `${getActivityColor(item.type)}20`,
                    color: getActivityColor(item.type),
                  }}>
                    {getActivityIcon(item.type)}
                  </div>
                  {index < recentActivity.length - 1 && (
                    <div style={styles.activityLine} />
                  )}
                </div>
                <div style={styles.activityContent}>
                  <span style={styles.activityTitle}>{item.title}</span>
                  <span style={styles.activityDescription}>{item.description}</span>
                </div>
                <span style={styles.activityTime}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  date: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    margin: '8px 0 0 0',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 20,
    border: `1px solid ${NEON_GREEN}`,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: NEON_GREEN,
    animation: 'pulse 2s infinite',
  },
  liveText: {
    fontSize: 12,
    fontWeight: 600,
    color: NEON_GREEN,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  kpiSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 20,
    marginBottom: 32,
  },
  kpiCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  kpiIcon: {
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 12,
    color: NEON_GREEN,
    flexShrink: 0,
  },
  kpiContent: {
    flex: 1,
    minWidth: 0,
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
    flexWrap: 'wrap',
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
  kpiSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    display: 'block',
    marginTop: 2,
  },
  twoColumnSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: 24,
    marginBottom: 24,
  },
  card: {
    padding: 24,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    marginBottom: 24,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    flex: 1,
  },
  badge: {
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 12,
  },
  alertList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  alertItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginTop: 6,
    flexShrink: 0,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    display: 'block',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  statList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
  },
  statIcon: {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 8,
    color: NEON_GREEN,
  },
  statLabel: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  recommendationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16,
  },
  recommendationCard: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.05)',
  },
  recommendationEmoji: {
    fontSize: 24,
    marginBottom: 12,
    display: 'block',
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 8px 0',
  },
  recommendationDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    margin: 0,
    lineHeight: 1.5,
  },
  chartContainer: {
    marginTop: 16,
  },
  pipelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  pipelineItem: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
  },
  pipelineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  batchNumber: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '4px 8px',
    borderRadius: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  productName: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    display: 'block',
    marginBottom: 12,
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
    minWidth: 36,
    textAlign: 'right',
  },
  unitsTarget: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  dealsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  dealItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
  },
  dealInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  dealPartner: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  dealStage: {
    fontSize: 12,
    fontWeight: 500,
  },
  dealMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  dealValue: {
    fontSize: 16,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  dealProbability: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  activityTimeline: {
    display: 'flex',
    flexDirection: 'column',
  },
  activityItem: {
    display: 'flex',
    gap: 16,
    paddingBottom: 16,
  },
  activityIconWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  activityIcon: {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flexShrink: 0,
  },
  activityLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 8,
    borderRadius: 1,
  },
  activityContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    paddingTop: 2,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  activityDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  activityTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    flexShrink: 0,
    paddingTop: 2,
  },
};
