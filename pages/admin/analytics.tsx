import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';

const TrendUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="trendUp" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#43e97b" />
        <stop offset="100%" stopColor="#38f9d7" />
      </linearGradient>
    </defs>
    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="url(#trendUp)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const OrdersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="orders" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="url(#orders)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RevenueIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="revenue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#43e97b" />
        <stop offset="100%" stopColor="#38f9d7" />
      </linearGradient>
    </defs>
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="url(#revenue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const D2CIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="d2c" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4facfe" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
    </defs>
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="url(#d2c)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const B2BIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="b2b" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f093fb" />
        <stop offset="100%" stopColor="#f5576c" />
      </linearGradient>
    </defs>
    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 7h.01M9 11h.01M9 15h.01M15 7h.01M15 11h.01M15 15h.01" stroke="url(#b2b)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="chart" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fa709a" />
        <stop offset="100%" stopColor="#fee140" />
      </linearGradient>
    </defs>
    <path d="M18 20V10M12 20V4M6 20v-6" stroke="url(#chart)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EventIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="event" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a8edea" />
        <stop offset="100%" stopColor="#fed6e3" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#event)" strokeWidth="2"/>
    <path d="M12 6v6l4 2" stroke="url(#event)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ProductIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="product" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c471f5" />
        <stop offset="100%" stopColor="#fa71cd" />
      </linearGradient>
    </defs>
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="url(#product)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="url(#product)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function AdminAnalytics() {
  const { loading, authorized } = useRequireAdmin();
  const [stats, setStats] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (authorized) {
      loadAnalytics();
    }
  }, [authorized]);

  async function loadAnalytics() {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      
      setStats(data.stats || {
        ordersLast7Days: 0,
        d2cOrders: 0,
        b2bOrders: 0,
      });
      setRevenue(data.revenue || {
        totalRevenue: 0,
        d2cRevenue: 0,
        b2bRevenue: 0,
      });
      setTopProducts(data.topProducts || []);
      setRecentEvents(data.recentEvents || []);
      setError(null);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Unable to load analytics data');
      setStats({
        ordersLast7Days: 0,
        d2cOrders: 0,
        b2bOrders: 0,
      });
      setRevenue({
        totalRevenue: 0,
        d2cRevenue: 0,
        b2bRevenue: 0,
      });
      setTopProducts([]);
      setRecentEvents([]);
    } finally {
      setLoadingData(false);
    }
  }

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

  const maxProductQuantity = topProducts.reduce((max, p) => Math.max(max, p.quantity || 0), 1);

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
          <Link href="/admin/command-center" style={styles.navLink}>Command Center</Link>
          <Link href="/admin/products" style={styles.navLink}>Products</Link>
          <Link href="/admin/orders" style={styles.navLink}>Orders</Link>
          <Link href="/admin/banking" style={styles.navLink}>Banking</Link>
          <Link href="/admin/analytics" style={styles.navLinkActive}>Analytics</Link>
          <Link href="/admin/ai-assistant" style={styles.navLink}>AI Assistant</Link>
          <Link href="/" style={styles.exitLink}>Exit</Link>
        </div>
      </nav>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <p style={styles.greeting}>Performance Overview</p>
            <h1 style={styles.title}>Analytics</h1>
          </div>
          <div style={styles.timeDisplay}>
            <span style={styles.timeText}>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <span style={styles.dateText}>{time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
        </header>

        {error && (
          <div style={styles.errorBanner}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        <section style={styles.statsGrid}>
          <StatCard 
            label="Orders (7 days)" 
            value={stats?.ordersLast7Days || 0} 
            loading={loadingData} 
            accent="#667eea"
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            icon={<OrdersIcon />}
          />
          <StatCard 
            label="D2C Orders" 
            value={stats?.d2cOrders || 0} 
            loading={loadingData} 
            accent="#4facfe"
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            icon={<D2CIcon />}
          />
          <StatCard 
            label="B2B Orders" 
            value={stats?.b2bOrders || 0} 
            loading={loadingData} 
            accent="#f093fb"
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            icon={<B2BIcon />}
          />
          <StatCard 
            label="Revenue (30 days)" 
            value={`$${((revenue?.totalRevenue || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            loading={loadingData} 
            accent="#43e97b"
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            icon={<RevenueIcon />}
          />
          <StatCard 
            label="D2C Revenue" 
            value={`$${((revenue?.d2cRevenue || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            loading={loadingData} 
            accent="#4facfe"
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            icon={<TrendUpIcon />}
          />
          <StatCard 
            label="B2B Revenue" 
            value={`$${((revenue?.b2bRevenue || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            loading={loadingData} 
            accent="#f093fb"
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            icon={<ChartIcon />}
          />
        </section>

        <div style={styles.cardsGrid}>
          <div style={styles.glassCard}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIconWrapper}>
                <ProductIcon />
              </div>
              <h2 style={styles.cardTitle}>Top Products</h2>
            </div>
            {loadingData ? (
              <div style={styles.loadingContent}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={styles.skeletonRow} />
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <div style={styles.emptyState}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                </svg>
                <p style={styles.emptyText}>No product data yet</p>
              </div>
            ) : (
              <div style={styles.productList}>
                {topProducts.map((item, i) => (
                  <div key={i} style={styles.productItem}>
                    <div style={styles.productInfo}>
                      <span style={styles.productRank}>#{i + 1}</span>
                      <span style={styles.productName}>{item.products?.name || 'Unknown'}</span>
                    </div>
                    <div style={styles.productBarWrapper}>
                      <div 
                        style={{
                          ...styles.productBar,
                          width: `${(item.quantity / maxProductQuantity) * 100}%`,
                        }}
                      />
                    </div>
                    <span style={styles.productQuantity}>{item.quantity} sold</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.glassCard}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIconWrapper}>
                <EventIcon />
              </div>
              <h2 style={styles.cardTitle}>Recent Events</h2>
            </div>
            {loadingData ? (
              <div style={styles.loadingContent}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} style={styles.skeletonRow} />
                ))}
              </div>
            ) : recentEvents.length === 0 ? (
              <div style={styles.emptyState}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <p style={styles.emptyText}>No events yet</p>
              </div>
            ) : (
              <div style={styles.eventTable}>
                <div style={styles.eventTableHeader}>
                  <span style={styles.eventTableHeaderCell}>Event Type</span>
                  <span style={styles.eventTableHeaderCell}>Timestamp</span>
                </div>
                <div style={styles.eventTableBody}>
                  {recentEvents.map((event) => (
                    <div key={event.id} style={styles.eventRow}>
                      <span style={styles.eventType}>
                        <span style={styles.eventDot} />
                        {event.event_type}
                      </span>
                      <span style={styles.eventTime}>{new Date(event.created_at).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={styles.chartSection}>
          <div style={styles.glassCard}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIconWrapper}>
                <ChartIcon />
              </div>
              <h2 style={styles.cardTitle}>Revenue Distribution</h2>
            </div>
            <div style={styles.chartContainer}>
              <div style={styles.chartBars}>
                <ChartBar 
                  label="D2C" 
                  value={revenue?.d2cRevenue || 0} 
                  maxValue={Math.max(revenue?.d2cRevenue || 0, revenue?.b2bRevenue || 0, 1)} 
                  gradient="linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)"
                />
                <ChartBar 
                  label="B2B" 
                  value={revenue?.b2bRevenue || 0} 
                  maxValue={Math.max(revenue?.d2cRevenue || 0, revenue?.b2bRevenue || 0, 1)} 
                  gradient="linear-gradient(180deg, #f093fb 0%, #f5576c 100%)"
                />
              </div>
              <div style={styles.chartLegend}>
                <div style={styles.legendItem}>
                  <span style={{ ...styles.legendDot, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }} />
                  <span style={styles.legendLabel}>D2C Revenue</span>
                </div>
                <div style={styles.legendItem}>
                  <span style={{ ...styles.legendDot, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }} />
                  <span style={styles.legendLabel}>B2B Revenue</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        @keyframes barGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, loading, accent, gradient, icon }: { 
  label: string; 
  value: string | number; 
  loading: boolean; 
  accent: string;
  gradient: string;
  icon: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div 
      style={{ 
        ...styles.statCard, 
        borderColor: hovered ? `${accent}40` : `${accent}20`,
        boxShadow: hovered ? `0 0 30px ${accent}20, 0 8px 32px rgba(0,0,0,0.3)` : '0 4px 20px rgba(0,0,0,0.2)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.statAccent, background: gradient }} />
      <div style={styles.statIconWrapper}>{icon}</div>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>
        {loading ? <span style={styles.skeleton} /> : value}
      </p>
      <div style={{ ...styles.statGlow, background: `radial-gradient(ellipse at bottom, ${accent}15 0%, transparent 70%)` }} />
    </div>
  );
}

function ChartBar({ label, value, maxValue, gradient }: { 
  label: string; 
  value: number; 
  maxValue: number; 
  gradient: string;
}) {
  const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
  
  return (
    <div style={styles.chartBarContainer}>
      <div style={styles.chartBarTrack}>
        <div 
          style={{
            ...styles.chartBarFill,
            height: `${Math.max(heightPercent, 5)}%`,
            background: gradient,
          }}
        />
      </div>
      <span style={styles.chartBarLabel}>{label}</span>
      <span style={styles.chartBarValue}>${(value / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
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
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(79, 172, 254, 0.08) 0%, transparent 70%)',
    top: '20%',
    right: '10%',
    animation: 'float 18s ease-in-out infinite',
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
    position: 'relative',
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
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '48px',
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
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(245, 87, 108, 0.1)',
    border: '1px solid rgba(245, 87, 108, 0.3)',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '24px',
    color: '#f5576c',
  },
  errorText: {
    fontSize: '14px',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '16px',
    marginBottom: '40px',
  },
  statCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    cursor: 'default',
  },
  statAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '3px',
    height: '100%',
  },
  statIconWrapper: {
    marginBottom: '16px',
  },
  statLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '600',
    letterSpacing: '-0.5px',
  },
  statGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60px',
    pointerEvents: 'none',
  },
  skeleton: {
    display: 'inline-block',
    width: '60px',
    height: '24px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '4px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  glassCard: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(10px)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  cardIconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '-0.3px',
  },
  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  skeletonRow: {
    height: '44px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    gap: '16px',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '14px',
  },
  productList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  productItem: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr auto',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.04)',
  },
  productInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  productRank: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '500',
  },
  productName: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  productBarWrapper: {
    height: '6px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  productBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #c471f5 0%, #fa71cd 100%)',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  },
  productQuantity: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  eventTable: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '320px',
    overflowY: 'auto',
  },
  eventTableHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'sticky',
    top: 0,
    background: 'rgba(5, 5, 5, 0.9)',
    backdropFilter: 'blur(10px)',
  },
  eventTableHeaderCell: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '500',
  },
  eventTableBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  eventRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    transition: 'background 0.2s',
  },
  eventType: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  eventDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  eventTime: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
  },
  chartSection: {
    marginBottom: '40px',
  },
  chartContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '40px',
  },
  chartBars: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '60px',
    flex: 1,
    justifyContent: 'center',
    padding: '20px 0',
  },
  chartBarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  chartBarTrack: {
    width: '80px',
    height: '200px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: '8px 8px 0 0',
    transition: 'height 0.8s ease',
    transformOrigin: 'bottom',
    animation: 'barGrow 0.8s ease forwards',
  },
  chartBarLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '0.5px',
  },
  chartBarValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
  },
  chartLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '4px',
  },
  legendLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
  },
};
