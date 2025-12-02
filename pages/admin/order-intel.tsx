import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import { OrderIntelMetrics } from '../../lib/orderIntelService';

type TimeRange = '7d' | '30d' | '90d';

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Loading...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Checking authorization...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          DRIZZL ADMIN
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/admin/command-center" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Command Center</Link>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Products</Link>
          <Link href="/admin/product-intel" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Product Intel</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Orders</Link>
          <Link href="/admin/order-intel" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Order Intel</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Partners</Link>
          <Link href="/admin/banking" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Banking</Link>
          <Link href="/admin/analytics" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Analytics</Link>
          <Link href="/admin/ai" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>AI Tools</Link>
          <Link href="/admin/ai-assistant" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>AI Assistant</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '4px', color: '#000' }}>
              Order Intelligence
            </h1>
            <p style={{ color: '#666', fontSize: '14px' }}>
              D2C & B2B analytics dashboard
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {metrics?.demoMode && (
              <div style={{ background: '#f5f5f5', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', color: '#666', marginRight: '8px' }}>
                Demo Mode
              </div>
            )}
            <div style={{ display: 'flex', background: '#f5f5f5', borderRadius: '8px', padding: '4px' }}>
              {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    background: timeRange === range ? '#000' : 'transparent',
                    color: timeRange === range ? '#fff' : '#666',
                    transition: 'all 0.2s',
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ color: '#92400e', fontSize: '14px', margin: 0 }}>{error}</p>
          </div>
        )}

        {loadingMetrics ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
            Loading order intelligence...
          </div>
        ) : metrics ? (
          <>
            <section style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#000', margin: 0 }}>D2C Intelligence</h2>
                <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                  {metrics.d2c.totalOrders.toLocaleString()} orders
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <MetricCard
                  label="Total Revenue"
                  value={`$${metrics.d2c.totalRevenue.toLocaleString()}`}
                  trend={12.5}
                />
                <MetricCard
                  label="Avg Order Value"
                  value={`$${metrics.d2c.avgOrderValue.toFixed(2)}`}
                  trend={metrics.d2c.avgOrderValueTrend}
                />
                <MetricCard
                  label="Refund Rate"
                  value={`${metrics.d2c.refundRate}%`}
                  trend={metrics.d2c.refundRateTrend}
                  invertTrend
                />
                <MetricCard
                  label="Satisfaction Score"
                  value={`${metrics.d2c.satisfactionScore}/5`}
                  subtext="Based on reviews"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', marginBottom: '20px' }}>
                    Orders by Location
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {metrics.d2c.locationData.slice(0, 6).map((loc, idx) => (
                      <LocationBar key={idx} location={loc} maxOrders={metrics.d2c.locationData[0]?.orderCount || 1} />
                    ))}
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', marginBottom: '20px' }}>
                    Shipping Performance
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e', marginBottom: '4px' }}>
                        {metrics.d2c.shippingPerformance.onTimePercentage}%
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>On-Time Delivery</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>
                        {metrics.d2c.shippingPerformance.avgDeliveryDays}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Avg Delivery Days</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '13px', color: '#6b7280' }}>
                    <span>{metrics.d2c.shippingPerformance.totalShipped.toLocaleString()} shipped</span>
                    <span>{metrics.d2c.shippingPerformance.lateDeliveries} late</span>
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', marginBottom: '20px' }}>
                    New vs Returning Customers
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#f0fdf4', borderRadius: '8px' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>
                        {metrics.d2c.customerBreakdown.newCustomers.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>New</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#eff6ff', borderRadius: '8px' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>
                        {metrics.d2c.customerBreakdown.returningCustomers.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Returning</div>
                    </div>
                  </div>
                  <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(metrics.d2c.customerBreakdown.returningCustomers / (metrics.d2c.customerBreakdown.newCustomers + metrics.d2c.customerBreakdown.returningCustomers)) * 100}%`,
                        background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
                    <span>${metrics.d2c.customerBreakdown.newCustomerRevenue.toLocaleString()} revenue</span>
                    <span>${metrics.d2c.customerBreakdown.returningCustomerRevenue.toLocaleString()} revenue</span>
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', marginBottom: '20px' }}>
                    Customer Sentiment
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '48px' }}>😊</div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#000' }}>{metrics.d2c.satisfactionScore}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>Average rating from {Math.floor(metrics.d2c.totalOrders * 0.32)} reviews</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '16px', fontStyle: 'italic' }}>
                    AI sentiment analysis coming soon
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#000', margin: 0 }}>B2B Intelligence</h2>
                <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                  {metrics.b2b.totalOrders.toLocaleString()} orders
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <MetricCard
                  label="Total Revenue"
                  value={`$${metrics.b2b.totalRevenue.toLocaleString()}`}
                  trend={8.3}
                />
                <MetricCard
                  label="Active Accounts"
                  value={metrics.b2b.activeAccounts.toString()}
                  subtext="Wholesale partners"
                />
                <MetricCard
                  label="Avg Order Value"
                  value={`$${metrics.b2b.avgOrderValue.toLocaleString()}`}
                />
                <MetricCard
                  label="Predicted Reorders"
                  value={metrics.b2b.predictedReorders.toString()}
                  subtext="Next 30 days"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', gridColumn: 'span 1' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', marginBottom: '20px' }}>
                    Top B2B Customers by Volume
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {metrics.b2b.topAccounts.slice(0, 5).map((account, idx) => (
                      <div key={account.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                        <div style={{ width: '28px', height: '28px', background: '#000', color: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' }}>
                          {idx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>{account.name}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{account.totalOrders} orders</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>${account.totalVolume.toLocaleString()}</div>
                          <div style={{ fontSize: '11px', color: '#9ca3af' }}>{account.creditTerms}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', marginBottom: '20px' }}>
                    PO Tracking Summary
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <POStatusCard label="Pending" count={metrics.b2b.poSummary.pending} color="#fbbf24" />
                    <POStatusCard label="Processing" count={metrics.b2b.poSummary.processing} color="#3b82f6" />
                    <POStatusCard label="Shipped" count={metrics.b2b.poSummary.shipped} color="#8b5cf6" />
                    <POStatusCard label="Delivered" count={metrics.b2b.poSummary.delivered} color="#22c55e" />
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', marginBottom: '20px' }}>
                    Credit Terms Overview
                  </h3>
                  <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Most Common Terms</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#000' }}>Net 30</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                      {Math.floor(metrics.b2b.activeAccounts * 0.7)} of {metrics.b2b.activeAccounts} accounts
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '16px', fontStyle: 'italic' }}>
                    Credit scoring integration coming soon
                  </p>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', marginBottom: '20px' }}>
                    Predicted Reorders
                  </h3>
                  <div style={{ padding: '24px', background: 'linear-gradient(135deg, #f0fdf4, #eff6ff)', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>
                      {metrics.b2b.predictedReorders}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>accounts likely to reorder</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>in the next 30 days</div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '16px', fontStyle: 'italic' }}>
                    ML prediction model coming soon
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}

function MetricCard({ label, value, trend, subtext, invertTrend }: {
  label: string;
  value: string;
  trend?: number;
  subtext?: string;
  invertTrend?: boolean;
}) {
  const isPositive = invertTrend ? (trend && trend < 0) : (trend && trend > 0);
  const isNegative = invertTrend ? (trend && trend > 0) : (trend && trend < 0);

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '24px', fontWeight: '700', color: '#000' }}>{value}</span>
        {trend !== undefined && (
          <span style={{
            fontSize: '12px',
            fontWeight: '500',
            color: isPositive ? '#22c55e' : isNegative ? '#ef4444' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
          }}>
            {isPositive ? '↑' : isNegative ? '↓' : ''}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {subtext && (
        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{subtext}</div>
      )}
    </div>
  );
}

function LocationBar({ location, maxOrders }: { location: { state: string; city: string; orderCount: number; revenue: number }; maxOrders: number }) {
  const width = (location.orderCount / maxOrders) * 100;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', fontWeight: '500', color: '#000' }}>
          {location.city}, {location.state}
        </span>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          {location.orderCount} orders
        </span>
      </div>
      <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${width}%`,
            background: '#000',
            borderRadius: '3px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}

function POStatusCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
      <div style={{ fontSize: '24px', fontWeight: '700', color }}>{count}</div>
      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{label}</div>
    </div>
  );
}
