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

interface KPICard {
  id: string;
  label: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down';
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
  d2c: number;
  b2b: number;
}

const kpiCards: KPICard[] = [
  {
    id: 'revenue',
    label: 'Revenue Today',
    value: '$47.3K',
    change: '+23%',
    changeType: 'up',
    icon: <DollarSign size={20} />,
  },
  {
    id: 'orders',
    label: 'Orders Placed',
    value: '127',
    change: '+18%',
    changeType: 'up',
    icon: <ShoppingCart size={20} />,
  },
  {
    id: 'cash',
    label: 'Cash Balance',
    value: '$284K',
    icon: <Wallet size={20} />,
  },
  {
    id: 'deals',
    label: 'B2B Pipeline',
    value: '$1.2M',
    change: '14 deals',
    icon: <Briefcase size={20} />,
  },
];

const criticalAlerts: Alert[] = [
  {
    id: '1',
    title: 'Low Stock: Strawberry Base',
    description: 'Only 12 units remaining. Reorder needed.',
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
];

const aiRecommendations: AIRecommendation[] = [
  {
    id: '1',
    emoji: '🚀',
    title: 'Production Opportunity',
    description: 'Increasing Strawberry Peach production by 20% could capture $45K additional revenue this month.',
  },
  {
    id: '2',
    emoji: '💰',
    title: 'Cash Flow Warning',
    description: 'Projected cash position in 14 days: $142K. Consider accelerating receivables collection.',
  },
  {
    id: '3',
    emoji: '📈',
    title: 'Marketing Scale-Up',
    description: 'Meta ads ROAS increased 35% this week. Consider increasing daily budget for optimal returns.',
  },
];

const revenueTrendData: RevenueTrendPoint[] = [
  { date: 'Nov 11', d2c: 28500, b2b: 15200 },
  { date: 'Nov 13', d2c: 29800, b2b: 16300 },
  { date: 'Nov 15', d2c: 35200, b2b: 17500 },
  { date: 'Nov 17', d2c: 36400, b2b: 16900 },
  { date: 'Nov 19', d2c: 29600, b2b: 14200 },
  { date: 'Nov 21', d2c: 34500, b2b: 18100 },
  { date: 'Nov 23', d2c: 39800, b2b: 21200 },
  { date: 'Nov 25', d2c: 38600, b2b: 20100 },
  { date: 'Nov 27', d2c: 33200, b2b: 17200 },
  { date: 'Nov 29', d2c: 41200, b2b: 21800 },
  { date: 'Dec 1', d2c: 42800, b2b: 22100 },
  { date: 'Dec 3', d2c: 37200, b2b: 18800 },
  { date: 'Dec 5', d2c: 38400, b2b: 19200 },
  { date: 'Dec 7', d2c: 43900, b2b: 22800 },
  { date: 'Dec 9', d2c: 47800, b2b: 24500 },
  { date: 'Dec 10', d2c: 48500, b2b: 25200 },
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
            <span style={styles.liveText}>Live</span>
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
                      color: card.changeType === 'up' ? NEON_GREEN : '#FF6B6B',
                    }}>
                      {card.changeType === 'up' ? <ArrowUpRight size={14} /> : <TrendingDown size={14} />}
                      {card.change}
                    </span>
                  )}
                </div>
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
                  <linearGradient id="colorD2C" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={NEON_GREEN} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={NEON_GREEN} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorB2B" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: `1px solid ${CARD_BORDER}`,
                    borderRadius: 8,
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="d2c"
                  stroke={NEON_GREEN}
                  fillOpacity={1}
                  fill="url(#colorD2C)"
                  name="D2C Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="b2b"
                  stroke="#60A5FA"
                  fillOpacity={1}
                  fill="url(#colorB2B)"
                  name="B2B Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 24,
    marginBottom: 32,
  },
  kpiCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 24,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  kpiIcon: {
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 12,
    color: NEON_GREEN,
  },
  kpiContent: {
    flex: 1,
  },
  kpiLabel: {
    fontSize: 13,
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
    fontSize: 24,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  kpiChange: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    fontSize: 13,
    fontWeight: 500,
  },
  twoColumnSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: 24,
    marginBottom: 32,
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
    gap: 16,
  },
  alertItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
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
    gap: 16,
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
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
};
