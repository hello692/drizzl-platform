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

export default function CommandCenter() {
  const { loading, authorized } = useRequireAdmin();
  const [stats, setStats] = useState<CommandCenterStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [filter, setFilter] = useState<TimeFilter>('30days');
  const [exporting, setExporting] = useState(false);

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Loading...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Checking authorization...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          DRIZZL ADMIN
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/admin/command-center" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Command Center</Link>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Products</Link>
          <Link href="/admin/product-intel" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Product Intel</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Orders</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Partners</Link>
          <Link href="/admin/banking" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Banking</Link>
          <Link href="/admin/analytics" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Analytics</Link>
          <Link href="/admin/ai" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>AI Tools</Link>
          <Link href="/admin/ai-assistant" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>AI Assistant</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '48px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-1px', color: '#000' }}>Command Center</h1>
            <p style={{ color: '#666', fontSize: '15px' }}>Real-time business intelligence dashboard</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {stats?.isDemo && (
              <div style={{ 
                background: 'rgba(0,0,0,0.04)', 
                border: '1px solid rgba(0,0,0,0.08)', 
                borderRadius: '8px', 
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#999' }} />
                <span style={{ fontSize: '12px', color: '#666' }}>Demo Mode</span>
              </div>
            )}
            <TimeFilterButtons filter={filter} setFilter={setFilter} />
            <button
              onClick={handleExport}
              disabled={exporting}
              style={{
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: exporting ? 'not-allowed' : 'pointer',
                opacity: exporting ? 0.6 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <StatCard title="Orders Today" value={stats?.ordersToday || 0} loading={loadingStats} />
          <StatCard title="Orders This Week" value={stats?.ordersThisWeek || 0} loading={loadingStats} />
          <StatCard title="Orders This Month" value={stats?.ordersThisMonth || 0} loading={loadingStats} />
          <StatCard title="Total Revenue" value={formatCurrency(stats?.totalRevenue || 0)} loading={loadingStats} highlight />
          <StatCard title="Net Margin" value={formatCurrency(stats?.netMargin || 0)} loading={loadingStats} />
          <StatCard title="Avg Order Value" value={formatCurrency(stats?.averageOrderValue || 0)} loading={loadingStats} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
          <GlassCard title="D2C Orders">
            {loadingStats ? <Skeleton height={80} /> : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p style={{ fontSize: '42px', fontWeight: '700', letterSpacing: '-2px', marginBottom: '4px' }}>{formatNumber(stats?.d2cOrders || 0)}</p>
                  <p style={{ fontSize: '13px', color: '#666' }}>orders</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '24px', fontWeight: '600', letterSpacing: '-1px', color: '#000' }}>{formatCurrency(stats?.d2cRevenue || 0)}</p>
                  <p style={{ fontSize: '13px', color: '#666' }}>revenue</p>
                </div>
              </div>
            )}
          </GlassCard>
          <GlassCard title="B2B Orders">
            {loadingStats ? <Skeleton height={80} /> : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p style={{ fontSize: '42px', fontWeight: '700', letterSpacing: '-2px', marginBottom: '4px' }}>{formatNumber(stats?.b2bOrders || 0)}</p>
                  <p style={{ fontSize: '13px', color: '#666' }}>orders</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '24px', fontWeight: '600', letterSpacing: '-1px', color: '#000' }}>{formatCurrency(stats?.b2bRevenue || 0)}</p>
                  <p style={{ fontSize: '13px', color: '#666' }}>revenue</p>
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '40px' }}>
          <GlassCard title="Revenue Trend (30 Days)">
            {loadingStats ? <Skeleton height={200} /> : (
              <RevenueChart data={stats?.revenueTrend || []} />
            )}
          </GlassCard>
          <GlassCard title="Channel Distribution">
            {loadingStats ? <Skeleton height={200} /> : (
              <ChannelPieChart data={stats?.channelBreakdown || []} />
            )}
          </GlassCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
          <GlassCard title="Top 5 Best-Selling SKUs">
            {loadingStats ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[...Array(5)].map((_, i) => <Skeleton key={i} height={48} />)}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(stats?.topProducts || []).map((product, i) => (
                  <div key={product.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '14px 16px',
                    background: 'rgba(0,0,0,0.02)',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        background: '#000', 
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>{i + 1}</span>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>{product.name}</p>
                        <p style={{ fontSize: '11px', color: '#999' }}>{product.sku}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '14px', fontWeight: '600' }}>{formatNumber(product.quantity)} sold</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
          <GlassCard title="Conversion Funnel">
            {loadingStats ? <Skeleton height={200} /> : (
              <ConversionFunnel metrics={stats?.conversionMetrics} />
            )}
          </GlassCard>
        </div>

        <GlassCard title="AI Insights">
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.04) 100%)',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            border: '1px dashed rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: 'rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '20px'
            }}>✨</div>
            <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '8px', color: '#333' }}>AI-Powered Insights Coming Soon</p>
            <p style={{ fontSize: '13px', color: '#888', maxWidth: '400px', margin: '0 auto' }}>
              Get intelligent recommendations, anomaly detection, and predictive analytics powered by machine learning.
            </p>
          </div>
        </GlassCard>
      </main>
    </div>
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
    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.04)', borderRadius: '10px', padding: '4px' }}>
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          style={{
            background: filter === value ? '#fff' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: filter === value ? '600' : '400',
            color: filter === value ? '#000' : '#666',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: filter === value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function StatCard({ title, value, loading, highlight }: { title: string; value: string | number; loading: boolean; highlight?: boolean }) {
  return (
    <div style={{
      background: highlight ? '#000' : '#fff',
      borderRadius: '16px',
      padding: '24px',
      border: highlight ? 'none' : '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'all 0.3s ease',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
      }}
    >
      <p style={{ 
        fontSize: '11px', 
        color: highlight ? 'rgba(255,255,255,0.6)' : '#888', 
        marginBottom: '12px', 
        textTransform: 'uppercase', 
        letterSpacing: '0.5px',
        fontWeight: '500'
      }}>{title}</p>
      {loading ? (
        <Skeleton height={36} dark={highlight} />
      ) : (
        <p style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          letterSpacing: '-1px',
          color: highlight ? '#fff' : '#000'
        }}>{value}</p>
      )}
    </div>
  );
}

function GlassCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '28px',
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
    }}>
      <h3 style={{ 
        fontSize: '13px', 
        fontWeight: '600', 
        marginBottom: '24px', 
        textTransform: 'uppercase', 
        letterSpacing: '0.5px',
        color: '#666'
      }}>{title}</h3>
      {children}
    </div>
  );
}

function Skeleton({ height, dark }: { height: number; dark?: boolean }) {
  return (
    <div style={{
      height: `${height}px`,
      background: dark 
        ? 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)'
        : 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: '8px',
    }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

function RevenueChart({ data }: { data: RevenueTrendPoint[] }) {
  if (!data || data.length === 0) {
    return <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '40px' }}>No data available</p>;
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const minRevenue = Math.min(...data.map(d => d.revenue));
  const range = maxRevenue - minRevenue || 1;

  return (
    <div style={{ height: '200px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '2px', paddingBottom: '24px' }}>
        {data.map((point, i) => {
          const height = ((point.revenue - minRevenue) / range) * 100;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${Math.max(height, 5)}%`,
                background: 'linear-gradient(180deg, #000 0%, #333 100%)',
                borderRadius: '4px 4px 0 0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
              }}
              title={`${point.date}: ${formatCurrency(point.revenue)}`}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #333 0%, #555 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #000 0%, #333 100%)';
              }}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#999' }}>
        <span>{data[0]?.date?.split('-').slice(1).join('/')}</span>
        <span>{data[data.length - 1]?.date?.split('-').slice(1).join('/')}</span>
      </div>
    </div>
  );
}

function ChannelPieChart({ data }: { data: ChannelBreakdown[] }) {
  if (!data || data.length === 0) {
    return <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '40px' }}>No data available</p>;
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
        background: `conic-gradient(#000 0% ${d2cPercent}%, #ccc ${d2cPercent}% 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <span style={{ fontSize: '20px', fontWeight: '700' }}>{d2cPercent}%</span>
          <span style={{ fontSize: '10px', color: '#666' }}>D2C</span>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#000' }} />
          <div>
            <p style={{ fontSize: '13px', fontWeight: '500' }}>D2C</p>
            <p style={{ fontSize: '12px', color: '#666' }}>{formatNumber(d2c?.orders || 0)} orders • {formatCurrency(d2c?.revenue || 0)}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ccc' }} />
          <div>
            <p style={{ fontSize: '13px', fontWeight: '500' }}>B2B</p>
            <p style={{ fontSize: '12px', color: '#666' }}>{formatNumber(b2b?.orders || 0)} orders • {formatCurrency(b2b?.revenue || 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversionFunnel({ metrics }: { metrics?: ConversionMetrics }) {
  if (!metrics) {
    return <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '40px' }}>No data available</p>;
  }

  const stages = [
    { label: 'Visits', value: metrics.visits, rate: 100 },
    { label: 'Added to Cart', value: metrics.addedToCart, rate: metrics.visitToCartRate },
    { label: 'Checkout', value: metrics.checkout, rate: metrics.cartToCheckoutRate },
    { label: 'Purchased', value: metrics.purchased, rate: metrics.checkoutToPurchaseRate },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {stages.map((stage, i) => (
        <div key={stage.label} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '100px', fontSize: '12px', color: '#666' }}>{stage.label}</div>
          <div style={{ flex: 1, height: '32px', background: 'rgba(0,0,0,0.04)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${(stage.value / (metrics.visits || 1)) * 100}%`,
              background: i === stages.length - 1 ? '#000' : `rgba(0,0,0,${0.3 + (i * 0.2)})`,
              borderRadius: '6px',
              transition: 'width 0.5s ease',
              minWidth: stage.value > 0 ? '20px' : '0',
            }} />
          </div>
          <div style={{ width: '80px', textAlign: 'right' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>{formatNumber(stage.value)}</span>
            {i > 0 && <span style={{ fontSize: '11px', color: '#999', marginLeft: '4px' }}>{stage.rate}%</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
