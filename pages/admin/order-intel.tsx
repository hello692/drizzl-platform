import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import { OrderIntelMetrics } from '../../lib/orderIntelService';

type TimeRange = '7d' | '30d' | '90d';

const D2C_GRADIENT = 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)';
const B2B_GRADIENT = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';

function ChartIcon({ gradient }: { gradient: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradient.includes('#00d4ff') ? '#00d4ff' : '#a855f7'} />
          <stop offset="100%" stopColor={gradient.includes('#0066ff') ? '#0066ff' : '#ec4899'} />
        </linearGradient>
      </defs>
      <path d="M3 3v18h18" stroke="url(#chartGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 14l4-4 4 4 5-6" stroke="url(#chartGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="trendUpGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
      </defs>
      <path d="M7 17l5-5 4 4 5-6" stroke="url(#trendUpGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 7h4v4" stroke="url(#trendUpGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="trendDownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#f87171" />
        </linearGradient>
      </defs>
      <path d="M7 7l5 5 4-4 5 6" stroke="url(#trendDownGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 17h4v-4" stroke="url(#trendDownGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShippingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="shipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#0066ff" />
        </linearGradient>
      </defs>
      <path d="M1 3h15v13H1z" stroke="url(#shipGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 8h4l3 3v5h-7V8z" stroke="url(#shipGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5.5" cy="18.5" r="2.5" stroke="url(#shipGrad)" strokeWidth="2" />
      <circle cx="18.5" cy="18.5" r="2.5" stroke="url(#shipGrad)" strokeWidth="2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="usersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#0066ff" />
        </linearGradient>
      </defs>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="url(#usersGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" stroke="url(#usersGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="url(#usersGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="url(#usersGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SentimentIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="sentimentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#0066ff" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" stroke="url(#sentimentGrad)" strokeWidth="2" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="url(#sentimentGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="9" y1="9" x2="9.01" y2="9" stroke="url(#sentimentGrad)" strokeWidth="2" strokeLinecap="round" />
      <line x1="15" y1="9" x2="15.01" y2="9" stroke="url(#sentimentGrad)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="locGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#0066ff" />
        </linearGradient>
      </defs>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="url(#locGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" stroke="url(#locGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function B2BIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="b2bGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="url(#b2bGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 22V12h6v10" stroke="url(#b2bGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CreditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="creditGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="url(#creditGrad)" strokeWidth="2" />
      <line x1="1" y1="10" x2="23" y2="10" stroke="url(#creditGrad)" strokeWidth="2" />
    </svg>
  );
}

function PredictIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="predictGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" stroke="url(#predictGrad)" strokeWidth="2" />
      <polyline points="12 6 12 12 16 14" stroke="url(#predictGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="pkgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="url(#pkgGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="url(#pkgGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="22.08" x2="12" y2="12" stroke="url(#pkgGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OrderIntelligence() {
  const { loading, authorized } = useRequireAdmin();
  const [metrics, setMetrics] = useState<OrderIntelMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  useEffect(() => {
    if (authorized) {
      loadMetrics();
    }
  }, [authorized, timeRange]);

  async function loadMetrics() {
    setLoadingMetrics(true);
    try {
      const response = await fetch(`/api/admin/order-intel?timeRange=${timeRange}`);
      const data = await response.json();
      setMetrics(data);
      if (data.message) {
        setError(data.message);
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error loading order intel:', err);
      setError('Unable to load order intelligence');
    } finally {
      setLoadingMetrics(false);
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

  return (
    <div style={styles.container}>
      <div style={styles.meshGradient} />
      <div style={styles.orbOne} />
      <div style={styles.orbTwo} />
      <div style={styles.orbThree} />

      <nav style={styles.nav}>
        <Link href="/admin" style={styles.logo}>
          <span style={styles.logoIcon}>D</span>
          <span style={styles.logoText}>DRIZZL ADMIN</span>
        </Link>
        <div style={styles.navLinks}>
          <Link href="/admin/command-center" style={styles.navLink}>Command Center</Link>
          <Link href="/admin/products" style={styles.navLink}>Products</Link>
          <Link href="/admin/product-intel" style={styles.navLink}>Product Intel</Link>
          <Link href="/admin/orders" style={styles.navLink}>Orders</Link>
          <Link href="/admin/order-intel" style={styles.navLinkActive}>Order Intel</Link>
          <Link href="/admin/partners" style={styles.navLink}>Partners</Link>
          <Link href="/admin/banking" style={styles.navLink}>Banking</Link>
          <Link href="/admin/ai-assistant" style={styles.navLink}>AI Assistant</Link>
          <Link href="/" style={styles.exitLink}>Exit</Link>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <p style={styles.greeting}>Intelligence Hub</p>
            <h1 style={styles.title}>Order Intelligence</h1>
            <p style={styles.subtitle}>D2C & B2B analytics dashboard</p>
          </div>
          <div style={styles.headerRight}>
            {metrics?.demoMode && (
              <div style={styles.demoBadge}>
                <div style={styles.demoDot} />
                Demo Mode
              </div>
            )}
            <div style={styles.timeFilter}>
              {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  style={timeRange === range ? styles.timeButtonActive : styles.timeButton}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {loadingMetrics ? (
          <div style={styles.loadingContent}>
            <div style={styles.loadingOrb} />
            <p style={styles.loadingText}>Loading order intelligence...</p>
          </div>
        ) : metrics ? (
          <>
            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitleWrapper}>
                  <div style={styles.d2cIconWrapper}>
                    <ChartIcon gradient={D2C_GRADIENT} />
                  </div>
                  <h2 style={styles.sectionTitle}>D2C Intelligence</h2>
                </div>
                <span style={styles.d2cBadge}>
                  {metrics.d2c.totalOrders.toLocaleString()} orders
                </span>
              </div>

              <div style={styles.metricsGrid}>
                <MetricCard
                  label="Total Revenue"
                  value={`$${metrics.d2c.totalRevenue.toLocaleString()}`}
                  trend={12.5}
                  accent="#00d4ff"
                  type="d2c"
                />
                <MetricCard
                  label="Avg Order Value"
                  value={`$${metrics.d2c.avgOrderValue.toFixed(2)}`}
                  trend={metrics.d2c.avgOrderValueTrend}
                  accent="#0066ff"
                  type="d2c"
                />
                <MetricCard
                  label="Refund Rate"
                  value={`${metrics.d2c.refundRate}%`}
                  trend={metrics.d2c.refundRateTrend}
                  invertTrend
                  accent="#00d4ff"
                  type="d2c"
                />
                <MetricCard
                  label="Satisfaction Score"
                  value={`${metrics.d2c.satisfactionScore}/5`}
                  subtext="Based on reviews"
                  accent="#0066ff"
                  type="d2c"
                />
              </div>

              <div style={styles.cardsGrid}>
                <div style={styles.glassCard}>
                  <div style={styles.cardHeader}>
                    <LocationIcon />
                    <h3 style={styles.cardTitle}>Orders by Location</h3>
                  </div>
                  <div style={styles.cardContent}>
                    {metrics.d2c.locationData.slice(0, 6).map((loc, idx) => (
                      <LocationBar key={idx} location={loc} maxOrders={metrics.d2c.locationData[0]?.orderCount || 1} type="d2c" />
                    ))}
                  </div>
                </div>

                <div style={styles.glassCard}>
                  <div style={styles.cardHeader}>
                    <ShippingIcon />
                    <h3 style={styles.cardTitle}>Shipping Performance</h3>
                  </div>
                  <div style={styles.shippingGrid}>
                    <div style={styles.shippingStatD2C}>
                      <div style={styles.shippingValue}>{metrics.d2c.shippingPerformance.onTimePercentage}%</div>
                      <div style={styles.shippingLabel}>On-Time Delivery</div>
                    </div>
                    <div style={styles.shippingStatD2C}>
                      <div style={styles.shippingValueAlt}>{metrics.d2c.shippingPerformance.avgDeliveryDays}</div>
                      <div style={styles.shippingLabel}>Avg Delivery Days</div>
                    </div>
                  </div>
                  <div style={styles.shippingFooter}>
                    <span>{metrics.d2c.shippingPerformance.totalShipped.toLocaleString()} shipped</span>
                    <span>{metrics.d2c.shippingPerformance.lateDeliveries} late</span>
                  </div>
                </div>

                <div style={styles.glassCard}>
                  <div style={styles.cardHeader}>
                    <UsersIcon />
                    <h3 style={styles.cardTitle}>New vs Returning Customers</h3>
                  </div>
                  <div style={styles.customerGrid}>
                    <div style={styles.customerStatNew}>
                      <div style={styles.customerValue}>{metrics.d2c.customerBreakdown.newCustomers.toLocaleString()}</div>
                      <div style={styles.customerLabel}>New</div>
                    </div>
                    <div style={styles.customerStatReturning}>
                      <div style={styles.customerValueReturning}>{metrics.d2c.customerBreakdown.returningCustomers.toLocaleString()}</div>
                      <div style={styles.customerLabel}>Returning</div>
                    </div>
                  </div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFillD2C,
                        width: `${(metrics.d2c.customerBreakdown.returningCustomers / (metrics.d2c.customerBreakdown.newCustomers + metrics.d2c.customerBreakdown.returningCustomers)) * 100}%`,
                      }}
                    />
                  </div>
                  <div style={styles.customerFooter}>
                    <span>${metrics.d2c.customerBreakdown.newCustomerRevenue.toLocaleString()} revenue</span>
                    <span>${metrics.d2c.customerBreakdown.returningCustomerRevenue.toLocaleString()} revenue</span>
                  </div>
                </div>

                <div style={styles.glassCard}>
                  <div style={styles.cardHeader}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <defs>
                        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00d4ff" />
                          <stop offset="100%" stopColor="#0066ff" />
                        </linearGradient>
                      </defs>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="url(#starGrad)" strokeWidth="2" fill="none" />
                    </svg>
                    <h3 style={styles.cardTitle}>Customer Sentiment</h3>
                  </div>
                  <div style={styles.sentimentWrapper}>
                    <SentimentIcon />
                    <div>
                      <div style={styles.sentimentScore}>{metrics.d2c.satisfactionScore}</div>
                      <div style={styles.sentimentLabel}>Average rating from {Math.floor(metrics.d2c.totalOrders * 0.32)} reviews</div>
                    </div>
                  </div>
                  <p style={styles.comingSoon}>AI sentiment analysis coming soon</p>
                </div>
              </div>
            </section>

            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitleWrapper}>
                  <div style={styles.b2bIconWrapper}>
                    <B2BIcon />
                  </div>
                  <h2 style={styles.sectionTitle}>B2B Intelligence</h2>
                </div>
                <span style={styles.b2bBadge}>
                  {metrics.b2b.totalOrders.toLocaleString()} orders
                </span>
              </div>

              <div style={styles.metricsGrid}>
                <MetricCard
                  label="Total Revenue"
                  value={`$${metrics.b2b.totalRevenue.toLocaleString()}`}
                  trend={8.3}
                  accent="#a855f7"
                  type="b2b"
                />
                <MetricCard
                  label="Active Accounts"
                  value={metrics.b2b.activeAccounts.toString()}
                  subtext="Wholesale partners"
                  accent="#ec4899"
                  type="b2b"
                />
                <MetricCard
                  label="Avg Order Value"
                  value={`$${metrics.b2b.avgOrderValue.toLocaleString()}`}
                  accent="#a855f7"
                  type="b2b"
                />
                <MetricCard
                  label="Predicted Reorders"
                  value={metrics.b2b.predictedReorders.toString()}
                  subtext="Next 30 days"
                  accent="#ec4899"
                  type="b2b"
                />
              </div>

              <div style={styles.cardsGrid}>
                <div style={styles.glassCard}>
                  <div style={styles.cardHeader}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <defs>
                        <linearGradient id="trophyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" stroke="url(#trophyGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h3 style={styles.cardTitle}>Top B2B Customers by Volume</h3>
                  </div>
                  <div style={styles.cardContent}>
                    {metrics.b2b.topAccounts.slice(0, 5).map((account, idx) => (
                      <div key={account.id} style={styles.accountRow}>
                        <div style={styles.accountRank}>{idx + 1}</div>
                        <div style={styles.accountInfo}>
                          <div style={styles.accountName}>{account.name}</div>
                          <div style={styles.accountOrders}>{account.totalOrders} orders</div>
                        </div>
                        <div style={styles.accountVolume}>
                          <div style={styles.accountVolumeValue}>${account.totalVolume.toLocaleString()}</div>
                          <div style={styles.accountTerms}>{account.creditTerms}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.glassCard}>
                  <div style={styles.cardHeader}>
                    <PackageIcon />
                    <h3 style={styles.cardTitle}>PO Tracking Summary</h3>
                  </div>
                  <div style={styles.poGrid}>
                    <POStatusCard label="Pending" count={metrics.b2b.poSummary.pending} color="#fbbf24" />
                    <POStatusCard label="Processing" count={metrics.b2b.poSummary.processing} color="#3b82f6" />
                    <POStatusCard label="Shipped" count={metrics.b2b.poSummary.shipped} color="#8b5cf6" />
                    <POStatusCard label="Delivered" count={metrics.b2b.poSummary.delivered} color="#22c55e" />
                  </div>
                </div>

                <div style={styles.glassCard}>
                  <div style={styles.cardHeader}>
                    <CreditIcon />
                    <h3 style={styles.cardTitle}>Credit Terms Overview</h3>
                  </div>
                  <div style={styles.creditWrapper}>
                    <div style={styles.creditLabel}>Most Common Terms</div>
                    <div style={styles.creditValue}>Net 30</div>
                    <div style={styles.creditSubtext}>
                      {Math.floor(metrics.b2b.activeAccounts * 0.7)} of {metrics.b2b.activeAccounts} accounts
                    </div>
                  </div>
                  <p style={styles.comingSoon}>Credit scoring integration coming soon</p>
                </div>

                <div style={styles.glassCard}>
                  <div style={styles.cardHeader}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <defs>
                        <linearGradient id="refreshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                      <polyline points="23 4 23 10 17 10" stroke="url(#refreshGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" stroke="url(#refreshGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h3 style={styles.cardTitle}>Predicted Reorders</h3>
                  </div>
                  <div style={styles.predictWrapper}>
                    <PredictIcon />
                    <div style={styles.predictValue}>{metrics.b2b.predictedReorders}</div>
                    <div style={styles.predictLabel}>accounts likely to reorder</div>
                    <div style={styles.predictSubtext}>in the next 30 days</div>
                  </div>
                  <p style={styles.comingSoon}>ML prediction model coming soon</p>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </main>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 212, 255, 0.6); }
        }
        @keyframes glowB2B {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6); }
        }
      `}</style>
    </div>
  );
}

function MetricCard({ label, value, trend, subtext, invertTrend, accent, type }: {
  label: string;
  value: string;
  trend?: number;
  subtext?: string;
  invertTrend?: boolean;
  accent: string;
  type: 'd2c' | 'b2b';
}) {
  const isPositive = invertTrend ? (trend && trend < 0) : (trend && trend > 0);
  const isNegative = invertTrend ? (trend && trend > 0) : (trend && trend < 0);

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  };

  const accentBarStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: type === 'd2c' ? D2C_GRADIENT : B2B_GRADIENT,
    boxShadow: type === 'd2c' ? '0 0 20px rgba(0, 212, 255, 0.5)' : '0 0 20px rgba(168, 85, 247, 0.5)',
  };

  return (
    <div style={cardStyle}>
      <div style={accentBarStyle} />
      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <span style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>{value}</span>
        {trend !== undefined && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            background: isPositive ? 'rgba(34, 197, 94, 0.15)' : isNegative ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.1)',
            color: isPositive ? '#4ade80' : isNegative ? '#f87171' : 'rgba(255, 255, 255, 0.6)',
          }}>
            {isPositive ? <TrendUpIcon /> : isNegative ? <TrendDownIcon /> : null}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {subtext && (
        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '8px' }}>{subtext}</div>
      )}
    </div>
  );
}

function LocationBar({ location, maxOrders, type }: { location: { state: string; city: string; orderCount: number; revenue: number }; maxOrders: number; type: 'd2c' | 'b2b' }) {
  const width = (location.orderCount / maxOrders) * 100;

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>
          {location.city}, {location.state}
        </span>
        <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
          {location.orderCount} orders
        </span>
      </div>
      <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${width}%`,
            background: type === 'd2c' ? D2C_GRADIENT : B2B_GRADIENT,
            borderRadius: '4px',
            transition: 'width 0.5s ease',
            boxShadow: type === 'd2c' ? '0 0 10px rgba(0, 212, 255, 0.5)' : '0 0 10px rgba(168, 85, 247, 0.5)',
          }}
        />
      </div>
    </div>
  );
}

function POStatusCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: color,
        boxShadow: `0 0 10px ${color}`,
      }} />
      <div style={{ fontSize: '28px', fontWeight: '700', color }}>{count}</div>
      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
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
    background: 'radial-gradient(ellipse at 20% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(168, 85, 247, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.04) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  orbOne: {
    position: 'fixed',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 212, 255, 0.12) 0%, transparent 70%)',
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
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
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
    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
    top: '50%',
    left: '30%',
    animation: 'float 25s ease-in-out infinite',
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
    background: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)',
    animation: 'pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px',
    gap: '24px',
  },
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    background: 'rgba(5, 5, 5, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
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
    background: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
  },
  logoText: {
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '1px',
  },
  navLinks: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  navLink: {
    color: 'rgba(255, 255, 255, 0.6)',
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
    background: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  exitLink: {
    color: 'rgba(255, 255, 255, 0.4)',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
    padding: '8px 16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
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
    alignItems: 'flex-start',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '24px',
  },
  greeting: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    letterSpacing: '-1px',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  demoBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  demoDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#fbbf24',
    animation: 'pulse 2s ease-in-out infinite',
  },
  timeFilter: {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '4px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  timeButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.6)',
    transition: 'all 0.2s',
  },
  timeButtonActive: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
    transition: 'all 0.2s',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(251, 191, 36, 0.1)',
    border: '1px solid rgba(251, 191, 36, 0.3)',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '24px',
    backdropFilter: 'blur(10px)',
  },
  errorText: {
    color: '#fbbf24',
    fontSize: '14px',
    margin: 0,
  },
  section: {
    marginBottom: '60px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  sectionTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  d2cIconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'rgba(0, 212, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(0, 212, 255, 0.2)',
  },
  b2bIconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'rgba(168, 85, 247, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(168, 85, 247, 0.2)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
  },
  d2cBadge: {
    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 102, 255, 0.15) 100%)',
    color: '#00d4ff',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid rgba(0, 212, 255, 0.3)',
  },
  b2bBadge: {
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
    color: '#a855f7',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid rgba(168, 85, 247, 0.3)',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '28px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '24px',
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  shippingGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  },
  shippingStatD2C: {
    textAlign: 'center',
    padding: '24px',
    background: 'rgba(0, 212, 255, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(0, 212, 255, 0.1)',
  },
  shippingValue: {
    fontSize: '32px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '4px',
  },
  shippingValueAlt: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '4px',
  },
  shippingLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  shippingFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  customerGrid: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  },
  customerStatNew: {
    flex: 1,
    textAlign: 'center',
    padding: '20px',
    background: 'rgba(34, 197, 94, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(34, 197, 94, 0.2)',
  },
  customerStatReturning: {
    flex: 1,
    textAlign: 'center',
    padding: '20px',
    background: 'rgba(0, 212, 255, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(0, 212, 255, 0.2)',
  },
  customerValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#4ade80',
  },
  customerValueReturning: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#00d4ff',
  },
  customerLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  progressBar: {
    height: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFillD2C: {
    height: '100%',
    background: 'linear-gradient(90deg, #22c55e, #00d4ff)',
    borderRadius: '4px',
    boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
  },
  customerFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '16px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  sentimentWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '24px',
    background: 'rgba(0, 212, 255, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(0, 212, 255, 0.1)',
  },
  sentimentScore: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#fff',
  },
  sentimentLabel: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  comingSoon: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.3)',
    marginTop: '20px',
    fontStyle: 'italic',
  },
  accountRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    marginBottom: '8px',
  },
  accountRank: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    color: '#fff',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
  },
  accountOrders: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  accountVolume: {
    textAlign: 'right',
  },
  accountVolumeValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },
  accountTerms: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  poGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  creditWrapper: {
    padding: '28px',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid rgba(168, 85, 247, 0.2)',
  },
  creditLabel: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '8px',
  },
  creditValue: {
    fontSize: '36px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  creditSubtext: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: '8px',
  },
  predictWrapper: {
    padding: '28px',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid rgba(168, 85, 247, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  predictValue: {
    fontSize: '48px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginTop: '12px',
    marginBottom: '4px',
  },
  predictLabel: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  predictSubtext: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: '4px',
  },
};
