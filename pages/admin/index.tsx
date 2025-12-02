import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import AdminLayout from '../../components/AdminLayout';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  d2cOrders: number;
  b2bOrders: number;
  ordersLast7Days: number;
}

const modules = [
  { title: 'Command Center', description: 'Real-time business intelligence', link: '/admin/command-center', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { title: 'AI Assistant', description: 'Natural language business queries', link: '/admin/ai-assistant', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { title: 'Product Intel', description: 'SKU costing & margin analysis', link: '/admin/product-intel', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { title: 'Inventory', description: 'Track ingredients & packaging', link: '/admin/inventory', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { title: 'Factory', description: 'Production monitoring & batches', link: '/admin/factory', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { title: 'Order Intel', description: 'D2C & B2B order analytics', link: '/admin/order-intel', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { title: 'Video Manager', description: 'Landing page video CMS', link: '/admin/video-manager', gradient: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)' },
  { title: 'Social Media', description: 'Manage accounts & performance', link: '/admin/social', gradient: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)' },
  { title: 'Banking', description: 'Financial intelligence & cash flow', link: '/admin/banking', gradient: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)' },
  { title: 'Products', description: 'Manage your product catalog', link: '/admin/products', gradient: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)' },
  { title: 'Orders', description: 'View and manage orders', link: '/admin/orders', gradient: 'linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)' },
  { title: 'Partners', description: 'Manage retail partners', link: '/admin/partners', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
];

export default function AdminDashboard() {
  const { user, loading, authorized } = useRequireAdmin();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error loading stats:', err);
        setStats({ totalOrders: 0, totalRevenue: 0, d2cOrders: 0, b2bOrders: 0, ordersLast7Days: 0 });
      } finally {
        setLoadingStats(false);
      }
    }

    if (authorized) loadStats();
  }, [authorized]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Initializing</p>
        <style jsx global>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
            50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
          }
        `}</style>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Authenticating</p>
        <style jsx global>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
            50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back">
      <section style={styles.statsGrid}>
        <StatCard label="Total Orders" value={stats?.totalOrders || 0} loading={loadingStats} accent="#667eea" />
        <StatCard label="Revenue" value={`$${((stats?.totalRevenue || 0) / 100).toLocaleString()}`} loading={loadingStats} accent="#43e97b" />
        <StatCard label="D2C Orders" value={stats?.d2cOrders || 0} loading={loadingStats} accent="#4facfe" />
        <StatCard label="B2B Orders" value={stats?.b2bOrders || 0} loading={loadingStats} accent="#f093fb" />
      </section>

      <section style={styles.modulesSection}>
        <h2 style={styles.sectionTitle}>Intelligence Modules</h2>
        <div style={styles.modulesGrid}>
          {modules.map((mod) => (
            <ModuleCard key={mod.title} {...mod} />
          ))}
        </div>
      </section>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </AdminLayout>
  );
}

function StatCard({ label, value, loading, accent }: { label: string; value: string | number; loading: boolean; accent: string }) {
  return (
    <div style={{ ...styles.statCard, borderColor: `${accent}20` }}>
      <div style={{ ...styles.statAccent, background: accent }} />
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>
        {loading ? <span style={styles.skeleton} /> : value}
      </p>
    </div>
  );
}

function ModuleCard({ title, description, link, gradient }: { title: string; description: string; link: string; gradient: string }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Link href={link} style={{ textDecoration: 'none' }}>
      <div
        style={{
          ...styles.moduleCard,
          transform: hovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.2)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ ...styles.moduleGradient, background: gradient, opacity: hovered ? 0.15 : 0.08 }} />
        <div style={{ ...styles.moduleIcon, background: gradient }}>
          {title.charAt(0)}
        </div>
        <h3 style={styles.moduleTitle}>{title}</h3>
        <p style={styles.moduleDesc}>{description}</p>
        <div style={{ ...styles.moduleArrow, opacity: hovered ? 1 : 0.5 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '60px',
  },
  statCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  },
  statAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '3px',
    height: '100%',
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '600',
    letterSpacing: '-1px',
  },
  skeleton: {
    display: 'inline-block',
    width: '80px',
    height: '32px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '4px',
  },
  modulesSection: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '24px',
    fontWeight: '500',
  },
  modulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  moduleCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  },
  moduleGradient: {
    position: 'absolute',
    inset: 0,
    transition: 'opacity 0.3s',
  },
  moduleIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '20px',
    position: 'relative',
  },
  moduleTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    position: 'relative',
  },
  moduleDesc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: '1.5',
    position: 'relative',
  },
  moduleArrow: {
    position: 'absolute',
    bottom: '24px',
    right: '24px',
    color: 'rgba(255,255,255,0.6)',
    transition: 'opacity 0.3s',
  },
};
