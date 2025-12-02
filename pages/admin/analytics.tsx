import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';

export default function AdminAnalytics() {
  const { loading, authorized } = useRequireAdmin();
  const [stats, setStats] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}><p>Loading...</p></div>;
  }

  if (!authorized) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}><p>Checking authorization...</p></div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700' }}>DRIZZL ADMIN</Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Products</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Orders</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Partners</Link>
          <Link href="/admin/analytics" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Analytics</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Analytics</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Performance metrics and insights</p>
        </div>

        {error && (
          <div style={{ background: '#fff3e0', border: '1px solid #ffcc02', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ color: '#e65100', fontSize: '14px' }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <StatCard title="Orders (7 days)" value={stats?.ordersLast7Days || 0} loading={loadingData} />
          <StatCard title="D2C Orders" value={stats?.d2cOrders || 0} loading={loadingData} />
          <StatCard title="B2B Orders" value={stats?.b2bOrders || 0} loading={loadingData} />
          <StatCard title="Revenue (30 days)" value={`$${((revenue?.totalRevenue || 0) / 100).toFixed(2)}`} loading={loadingData} />
          <StatCard title="D2C Revenue" value={`$${((revenue?.d2cRevenue || 0) / 100).toFixed(2)}`} loading={loadingData} />
          <StatCard title="B2B Revenue" value={`$${((revenue?.b2bRevenue || 0) / 100).toFixed(2)}`} loading={loadingData} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Top Products</h2>
            {loadingData ? (
              <p style={{ color: '#666' }}>Loading...</p>
            ) : topProducts.length === 0 ? (
              <p style={{ color: '#666', fontSize: '14px' }}>No product data yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topProducts.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.products?.name || 'Unknown'}</span>
                    <span style={{ fontSize: '14px', color: '#666' }}>{item.quantity} sold</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Recent Events</h2>
            {loadingData ? (
              <p style={{ color: '#666' }}>Loading...</p>
            ) : recentEvents.length === 0 ? (
              <p style={{ color: '#666', fontSize: '14px' }}>No events yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {recentEvents.map((event) => (
                  <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f9f9f9', borderRadius: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{event.event_type}</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>{new Date(event.created_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, loading }: { title: string; value: string | number; loading: boolean }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
      <p style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-1px' }}>{loading ? '...' : value}</p>
    </div>
  );
}
