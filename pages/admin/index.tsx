import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import { getOrderStats } from '../../lib/db';
import { getAnalyticsSummary, getRevenueStats } from '../../lib/analytics';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  d2cOrders: number;
  b2bOrders: number;
  ordersLast7Days: number;
}

export default function AdminDashboard() {
  const { user, loading, authorized } = useRequireAdmin();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [orderStats, analyticsSummary, revenueStats] = await Promise.all([
          getOrderStats(),
          getAnalyticsSummary(),
          getRevenueStats(),
        ]);

        setStats({
          totalOrders: orderStats.totalOrders,
          totalRevenue: revenueStats.totalRevenue,
          d2cOrders: analyticsSummary.d2cOrders,
          b2bOrders: analyticsSummary.b2bOrders,
          ordersLast7Days: analyticsSummary.ordersLast7Days,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoadingStats(false);
      }
    }

    if (authorized) {
      loadStats();
    }
  }, [authorized]);

  if (loading || !authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          DRIZZL ADMIN
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Products</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Orders</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Partners</Link>
          <Link href="/admin/analytics" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Analytics</Link>
          <Link href="/admin/ai" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>AI Tools</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.5px' }}>Dashboard</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Welcome back, {user?.email}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            loading={loadingStats}
          />
          <StatCard
            title="Total Revenue"
            value={`$${((stats?.totalRevenue || 0) / 100).toFixed(2)}`}
            loading={loadingStats}
          />
          <StatCard
            title="D2C Orders"
            value={stats?.d2cOrders || 0}
            loading={loadingStats}
          />
          <StatCard
            title="B2B Orders"
            value={stats?.b2bOrders || 0}
            loading={loadingStats}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <QuickActionCard
            title="Products"
            description="Manage your product catalog"
            link="/admin/products"
            icon="📦"
          />
          <QuickActionCard
            title="Orders"
            description="View and manage orders"
            link="/admin/orders"
            icon="🛒"
          />
          <QuickActionCard
            title="Partners"
            description="Manage retail partners"
            link="/admin/partners"
            icon="🤝"
          />
          <QuickActionCard
            title="Analytics"
            description="View performance metrics"
            link="/admin/analytics"
            icon="📊"
          />
          <QuickActionCard
            title="AI Content"
            description="Generate marketing copy"
            link="/admin/ai"
            icon="✨"
          />
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, loading }: { title: string; value: string | number; loading: boolean }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }}>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
      <p style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-1px' }}>
        {loading ? '...' : value}
      </p>
    </div>
  );
}

function QuickActionCard({ title, description, link, icon }: { title: string; description: string; link: string; icon: string }) {
  return (
    <Link href={link} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span style={{ fontSize: '32px', marginBottom: '16px', display: 'block' }}>{icon}</span>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{title}</h3>
        <p style={{ fontSize: '13px', color: '#666' }}>{description}</p>
      </div>
    </Link>
  );
}
