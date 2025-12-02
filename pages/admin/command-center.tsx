import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';

type TimeFilter = 'today' | '7days' | '30days' | '90days' | 'year';

interface TopProduct {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  revenue: number;
}

interface RevenueTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface ChannelBreakdown {
  channel: 'd2c' | 'b2b';
  orders: number;
  revenue: number;
  percentage: number;
}

interface ConversionMetrics {
  visits: number;
  addedToCart: number;
  checkout: number;
  purchased: number;
  visitToCartRate: number;
  cartToCheckoutRate: number;
  checkoutToPurchaseRate: number;
}

interface CommandCenterStats {
  ordersToday: number;
  ordersThisWeek: number;
  ordersThisMonth: number;
  d2cOrders: number;
  d2cRevenue: number;
  b2bOrders: number;
  b2bRevenue: number;
  totalRevenue: number;
  netMargin: number;
  averageOrderValue: number;
  topProducts: TopProduct[];
  revenueTrend: RevenueTrendPoint[];
  channelBreakdown: ChannelBreakdown[];
  conversionMetrics: ConversionMetrics;
  isDemo: boolean;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

const gradientAccents = {
  purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  pink: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  cyan: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  green: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  orange: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  teal: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
};

const accentColors = {
  purple: '#667eea',
  pink: '#f093fb',
  cyan: '#4facfe',
  green: '#43e97b',
  orange: '#fa709a',
  teal: '#a8edea',
};

export default function CommandCenter() {
  const { loading, authorized } = useRequireAdmin();
  const [stats, setStats] = useState<CommandCenterStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [filter, setFilter] = useState<TimeFilter>('30days');
  const [exporting, setExporting] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const response = await fetch(`/api/admin/command-center?filter=${filter}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching command center data:', error);
    } finally {
      setLoadingStats(false);
    }
  }, [filter]);

  useEffect(() => {
    if (authorized) {
      fetchStats();
    }
  }, [authorized, fetchStats]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch(`/api/admin/command-center?filter=${filter}&format=csv`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `command-center-${filter}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Initializing</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Authenticating</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.meshGradient} />
      <div style={styles.orbOne} />
      <div style={styles.orbTwo} />
      <div style={styles.orbThree} />
      <div style={styles.orbFour} />

      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <Link href="/admin" style={styles.logo}>
            <span style={styles.logoIcon}>D</span>
            <span style={styles.logoText}>DRIZZL</span>
          </Link>
        </div>
        <div style={styles.navLinks}>
          <Link href="/admin/command-center" style={styles.navLinkActive}>Command Center</Link>
          <Link href="/admin/products" style={styles.navLink}>Products</Link>
          <Link href="/admin/orders" style={styles.navLink}>Orders</Link>
          <Link href="/admin/banking" style={styles.navLink}>Banking</Link>
          <Link href="/admin/ai-assistant" style={styles.navLink}>AI Assistant</Link>
          <Link href="/" style={styles.exitLink}>Exit</Link>
        </div>
      </nav>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <p style={styles.greeting}>Intelligence Hub</p>
            <h1 style={styles.title}>Command Center</h1>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.timeDisplay}>
              <span style={styles.timeText}>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              <span style={styles.dateText}>{time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        <div style={styles.controlsRow}>
          {stats?.isDemo && (
            <div style={styles.demoBadge}>
              <div style={styles.demoDot} />
              <span style={styles.demoText}>Demo Mode</span>
            </div>
          )}
          <TimeFilterButtons filter={filter} setFilter={setFilter} />
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{
              ...styles.exportButton,
              opacity: exporting ? 0.6 : 1,
              cursor: exporting ? 'not-allowed' : 'pointer',
            }}
          >
            <ExportIcon />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>

        <section style={styles.statsGrid}>
          <StatCard 
            label="Orders Today" 
            value={stats?.ordersToday || 0} 
            loading={loadingStats} 
            accent={accentColors.purple}
            gradient={gradientAccents.purple}
          />
          <StatCard 
            label="Orders This Week" 
            value={stats?.ordersThisWeek || 0} 
            loading={loadingStats} 
            accent={accentColors.cyan}
            gradient={gradientAccents.cyan}
          />
          <StatCard 
            label="Orders This Month" 
            value={stats?.ordersThisMonth || 0} 
            loading={loadingStats} 
            accent={accentColors.green}
            gradient={gradientAccents.green}
          />
          <StatCard 
            label="Total Revenue" 
            value={formatCurrency(stats?.totalRevenue || 0)} 
            loading={loadingStats} 
            accent={accentColors.pink}
            gradient={gradientAccents.pink}
            highlight
          />
          <StatCard 
            label="Net Margin" 
            value={formatCurrency(stats?.netMargin || 0)} 
            loading={loadingStats} 
            accent={accentColors.orange}
            gradient={gradientAccents.orange}
          />
          <StatCard 
            label="Avg Order Value" 
            value={formatCurrency(stats?.averageOrderValue || 0)} 
            loading={loadingStats} 
            accent={accentColors.teal}
            gradient={gradientAccents.teal}
          />
        </section>

        <div style={styles.channelGrid}>
          <GlassCard title="D2C Orders" icon={<D2CIcon />} gradient={gradientAccents.cyan}>
            {loadingStats ? <Skeleton height={80} /> : (
              <div style={styles.channelContent}>
                <div>
                  <p style={styles.channelValue}>{formatNumber(stats?.d2cOrders || 0)}</p>
                  <p style={styles.channelLabel}>orders</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={styles.channelRevenue}>{formatCurrency(stats?.d2cRevenue || 0)}</p>
                  <p style={styles.channelLabel}>revenue</p>
                </div>
              </div>
            )}
          </GlassCard>
          <GlassCard title="B2B Orders" icon={<B2BIcon />} gradient={gradientAccents.purple}>
            {loadingStats ? <Skeleton height={80} /> : (
              <div style={styles.channelContent}>
                <div>
                  <p style={styles.channelValue}>{formatNumber(stats?.b2bOrders || 0)}</p>
                  <p style={styles.channelLabel}>orders</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={styles.channelRevenue}>{formatCurrency(stats?.b2bRevenue || 0)}</p>
                  <p style={styles.channelLabel}>revenue</p>
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        <div style={styles.chartsGrid}>
          <GlassCard title="Revenue Trend" icon={<ChartIcon />} gradient={gradientAccents.green}>
            {loadingStats ? <Skeleton height={200} /> : (
              <RevenueChart data={stats?.revenueTrend || []} />
            )}
          </GlassCard>
          <GlassCard title="Channel Distribution" icon={<PieIcon />} gradient={gradientAccents.pink}>
            {loadingStats ? <Skeleton height={200} /> : (
              <ChannelPieChart data={stats?.channelBreakdown || []} />
            )}
          </GlassCard>
        </div>

        <div style={styles.bottomGrid}>
          <GlassCard title="Top 5 Best-Selling SKUs" icon={<TrophyIcon />} gradient={gradientAccents.orange}>
            {loadingStats ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[...Array(5)].map((_, i) => <Skeleton key={i} height={56} />)}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(stats?.topProducts || []).map((product, i) => (
                  <ProductRow key={product.id} product={product} rank={i + 1} />
                ))}
              </div>
            )}
          </GlassCard>
          <GlassCard title="Conversion Funnel" icon={<FunnelIcon />} gradient={gradientAccents.teal}>
            {loadingStats ? <Skeleton height={200} /> : (
              <ConversionFunnel metrics={stats?.conversionMetrics} />
            )}
          </GlassCard>
        </div>

        <GlassCard title="AI Insights" icon={<AIIcon />} gradient={gradientAccents.purple}>
          <div style={styles.aiInsightsContent}>
            <div style={styles.aiIconContainer}>
              <div style={styles.aiIconInner}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#aiGradient)" strokeWidth="1.5">
                  <defs>
                    <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#f093fb" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>
            <p style={styles.aiTitle}>AI-Powered Insights Coming Soon</p>
            <p style={styles.aiDescription}>
              Get intelligent recommendations, anomaly detection, and predictive analytics powered by machine learning.
            </p>
          </div>
        </GlassCard>
      </main>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 3px currentColor); }
          50% { filter: drop-shadow(0 0 8px currentColor); }
        }
      `}</style>
    </div>
  );
}

function ExportIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function D2CIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function B2BIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function PieIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function FunnelIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
    </svg>
  );
}

function AIIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

function TimeFilterButtons({ filter, setFilter }: { filter: TimeFilter; setFilter: (f: TimeFilter) => void }) {
  const filters: { value: TimeFilter; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' },
    { value: '90days', label: '90 Days' },
    { value: 'year', label: 'Year' },
  ];

  return (
    <div style={styles.filterContainer}>
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          style={{
            ...styles.filterButton,
            background: filter === value ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: filter === value ? '#fff' : 'rgba(255,255,255,0.5)',
            fontWeight: filter === value ? '600' : '400',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function StatCard({ label, value, loading, accent, gradient, highlight }: { 
  label: string; 
  value: string | number; 
  loading: boolean; 
  accent: string;
  gradient: string;
  highlight?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      style={{
        ...styles.statCard,
        borderColor: hovered ? `${accent}40` : 'rgba(255,255,255,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${accent}20` : '0 4px 20px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.statAccent, background: gradient }} />
      <div style={{ ...styles.statGlow, background: `radial-gradient(ellipse at top left, ${accent}15 0%, transparent 50%)`, opacity: hovered ? 1 : 0.5 }} />
      <p style={styles.statLabel}>{label}</p>
      {loading ? (
        <Skeleton height={36} />
      ) : (
        <p style={{
          ...styles.statValue,
          background: highlight ? gradient : undefined,
          WebkitBackgroundClip: highlight ? 'text' : undefined,
          WebkitTextFillColor: highlight ? 'transparent' : undefined,
        }}>{value}</p>
      )}
    </div>
  );
}

function GlassCard({ title, children, icon, gradient }: { title: string; children: React.ReactNode; icon?: React.ReactNode; gradient?: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      style={{
        ...styles.glassCard,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.cardGradientOverlay, background: gradient, opacity: hovered ? 0.08 : 0.04 }} />
      <div style={styles.cardHeader}>
        {icon && (
          <div style={{ ...styles.cardIcon, background: gradient }}>
            {icon}
          </div>
        )}
        <h3 style={styles.cardTitle}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Skeleton({ height }: { height: number }) {
  return (
    <div style={{
      height: `${height}px`,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: '8px',
    }} />
  );
}

function ProductRow({ product, rank }: { product: TopProduct; rank: number }) {
  const [hovered, setHovered] = useState(false);
  const rankGradients = [
    gradientAccents.purple,
    gradientAccents.cyan,
    gradientAccents.green,
    gradientAccents.pink,
    gradientAccents.orange,
  ];

  return (
    <div 
      style={{
        ...styles.productRow,
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        borderColor: hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ ...styles.productRank, background: rankGradients[rank - 1] }}>{rank}</span>
        <div>
          <p style={styles.productName}>{product.name}</p>
          <p style={styles.productSku}>{product.sku}</p>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={styles.productQuantity}>{formatNumber(product.quantity)} sold</p>
        <p style={styles.productRevenue}>{formatCurrency(product.revenue)}</p>
      </div>
    </div>
  );
}

function RevenueChart({ data }: { data: RevenueTrendPoint[] }) {
  if (!data || data.length === 0) {
    return <p style={styles.noData}>No data available</p>;
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const minRevenue = Math.min(...data.map(d => d.revenue));
  const range = maxRevenue - minRevenue || 1;

  return (
    <div style={{ height: '200px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '3px', paddingBottom: '24px' }}>
        {data.map((point, i) => {
          const height = ((point.revenue - minRevenue) / range) * 100;
          return (
            <ChartBar 
              key={i} 
              height={height} 
              point={point} 
              index={i} 
              total={data.length} 
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
        <span>{data[0]?.date?.split('-').slice(1).join('/')}</span>
        <span>{data[data.length - 1]?.date?.split('-').slice(1).join('/')}</span>
      </div>
    </div>
  );
}

function ChartBar({ height, point, index, total }: { height: number; point: RevenueTrendPoint; index: number; total: number }) {
  const [hovered, setHovered] = useState(false);
  const hue = 250 + (index / total) * 60;

  return (
    <div
      style={{
        flex: 1,
        height: `${Math.max(height, 5)}%`,
        background: hovered 
          ? `linear-gradient(180deg, hsl(${hue}, 70%, 70%) 0%, hsl(${hue}, 60%, 50%) 100%)`
          : `linear-gradient(180deg, hsl(${hue}, 60%, 55%) 0%, hsl(${hue}, 50%, 35%) 100%)`,
        borderRadius: '4px 4px 0 0',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: hovered ? `0 0 15px hsla(${hue}, 70%, 60%, 0.5)` : 'none',
      }}
      title={`${point.date}: ${formatCurrency(point.revenue)}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div style={styles.chartTooltip}>
          <span style={{ fontWeight: '600' }}>{formatCurrency(point.revenue)}</span>
          <span style={{ fontSize: '10px', opacity: 0.7 }}>{point.orders} orders</span>
        </div>
      )}
    </div>
  );
}

function ChannelPieChart({ data }: { data: ChannelBreakdown[] }) {
  if (!data || data.length === 0) {
    return <p style={styles.noData}>No data available</p>;
  }

  const d2c = data.find(d => d.channel === 'd2c');
  const b2b = data.find(d => d.channel === 'b2b');
  const d2cPercent = d2c?.percentage || 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
      <div style={{ 
        width: '140px', 
        height: '140px', 
        borderRadius: '50%',
        background: `conic-gradient(#4facfe 0% ${d2cPercent}%, #667eea ${d2cPercent}% 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 30px rgba(79, 172, 254, 0.3)',
      }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>{d2cPercent}%</span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>D2C</span>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: gradientAccents.cyan }} />
          <div>
            <p style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>D2C</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{formatNumber(d2c?.orders || 0)} orders</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: gradientAccents.purple }} />
          <div>
            <p style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>B2B</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{formatNumber(b2b?.orders || 0)} orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversionFunnel({ metrics }: { metrics?: ConversionMetrics }) {
  if (!metrics) {
    return <p style={styles.noData}>No data available</p>;
  }

  const stages = [
    { label: 'Visits', value: metrics.visits, rate: 100, color: '#667eea' },
    { label: 'Added to Cart', value: metrics.addedToCart, rate: metrics.visitToCartRate, color: '#4facfe' },
    { label: 'Checkout', value: metrics.checkout, rate: metrics.cartToCheckoutRate, color: '#43e97b' },
    { label: 'Purchased', value: metrics.purchased, rate: metrics.checkoutToPurchaseRate, color: '#f093fb' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {stages.map((stage, i) => (
        <div key={stage.label} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '100px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{stage.label}</div>
          <div style={{ flex: 1, height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ 
              height: '100%', 
              width: `${(stage.value / (metrics.visits || 1)) * 100}%`,
              background: `linear-gradient(90deg, ${stage.color} 0%, ${stage.color}80 100%)`,
              borderRadius: '8px',
              transition: 'width 0.5s ease',
              minWidth: stage.value > 0 ? '20px' : '0',
              boxShadow: `0 0 15px ${stage.color}40`,
            }} />
          </div>
          <div style={{ width: '80px', textAlign: 'right' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{formatNumber(stage.value)}</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginLeft: '6px' }}>{stage.rate.toFixed(1)}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: '#050505',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  meshGradient: {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(ellipse at 20% 20%, rgba(102, 126, 234, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(240, 147, 251, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(67, 233, 123, 0.04) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  orbOne: {
    position: 'fixed',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
    top: '-200px',
    right: '-200px',
    animation: 'float 20s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orbTwo: {
    position: 'fixed',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(240, 147, 251, 0.12) 0%, transparent 70%)',
    bottom: '-100px',
    left: '-100px',
    animation: 'float 15s ease-in-out infinite reverse',
    pointerEvents: 'none',
  },
  orbThree: {
    position: 'fixed',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(67, 233, 123, 0.1) 0%, transparent 70%)',
    top: '50%',
    left: '30%',
    animation: 'float 25s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orbFour: {
    position: 'fixed',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(79, 172, 254, 0.1) 0%, transparent 70%)',
    top: '20%',
    right: '20%',
    animation: 'float 18s ease-in-out infinite reverse',
    pointerEvents: 'none',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#050505',
    gap: '24px',
  },
  loadingOrb: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    animation: 'pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: 'rgba(5, 5, 5, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: '#fff',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
  },
  logoText: {
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '2px',
  },
  navLinks: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  },
  navLink: {
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  navLinkActive: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
  },
  exitLink: {
    color: 'rgba(255,255,255,0.4)',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
    padding: '8px 16px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
  },
  main: {
    position: 'relative',
    zIndex: 1,
    padding: '40px',
    maxWidth: '1600px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '32px',
  },
  greeting: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '8px',
    letterSpacing: '1px',
  },
  title: {
    fontSize: '42px',
    fontWeight: '700',
    letterSpacing: '-1px',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  timeDisplay: {
    textAlign: 'right' as const,
  },
  timeText: {
    display: 'block',
    fontSize: '28px',
    fontWeight: '300',
    letterSpacing: '-0.5px',
    color: 'rgba(255,255,255,0.9)',
  },
  dateText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.5px',
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
  },
  demoBadge: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  demoDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.4)',
  },
  demoText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
  },
  filterContainer: {
    display: 'flex',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '4px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  filterButton: {
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  exportButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  statAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '3px',
    height: '100%',
  },
  statGlow: {
    position: 'absolute',
    inset: 0,
    transition: 'opacity 0.3s',
  },
  statLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
    position: 'relative',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '600',
    letterSpacing: '-1px',
    color: '#fff',
    position: 'relative',
  },
  channelGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '24px',
  },
  channelContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  channelValue: {
    fontSize: '42px',
    fontWeight: '700',
    letterSpacing: '-2px',
    marginBottom: '4px',
    color: '#fff',
  },
  channelLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
  },
  channelRevenue: {
    fontSize: '24px',
    fontWeight: '600',
    letterSpacing: '-1px',
    color: '#fff',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
    marginBottom: '24px',
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '24px',
  },
  glassCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  cardGradientOverlay: {
    position: 'absolute',
    inset: 0,
    transition: 'opacity 0.3s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    position: 'relative',
  },
  cardIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'rgba(255,255,255,0.7)',
  },
  productRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.04)',
    transition: 'all 0.2s ease',
  },
  productRank: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
  },
  productName: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '2px',
    color: '#fff',
  },
  productSku: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
  productQuantity: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },
  productRevenue: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
  },
  chartTooltip: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.9)',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    marginBottom: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  noData: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '14px',
    textAlign: 'center',
    padding: '40px',
  },
  aiInsightsContent: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(240, 147, 251, 0.05) 100%)',
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'center',
    border: '1px dashed rgba(255,255,255,0.1)',
  },
  aiIconContainer: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(240, 147, 251, 0.2) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  aiIconInner: {
    animation: 'glowPulse 2s ease-in-out infinite',
  },
  aiTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#fff',
  },
  aiDescription: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    maxWidth: '400px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
};
