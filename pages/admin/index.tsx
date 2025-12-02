import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';

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
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
        <div style={styles.navLeft}>
          <Link href="/admin" style={styles.logo}>
            <span style={styles.logoIcon}>D</span>
            <span style={styles.logoText}>DRIZZL</span>
          </Link>
        </div>
        <div style={styles.navLinks}>
          {['Command Center', 'Products', 'Orders', 'Banking', 'AI Assistant'].map((item) => (
            <Link key={item} href={`/admin/${item.toLowerCase().replace(' ', '-')}`} style={styles.navLink}>
              {item}
            </Link>
          ))}
          <Link href="/" style={styles.exitLink}>Exit</Link>
        </div>
      </nav>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <p style={styles.greeting}>Welcome back</p>
            <h1 style={styles.title}>Dashboard</h1>
          </div>
          <div style={styles.timeDisplay}>
            <span style={styles.timeText}>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <span style={styles.dateText}>{time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
        </header>

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
      `}</style>
    </div>
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
