import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const navItems = [
  { label: 'Command Center', href: '/admin/command-center', icon: 'command' },
  { label: 'Orders', href: '/admin/orders', icon: 'orders' },
  { label: 'Products', href: '/admin/products', icon: 'products' },
  { label: 'Inventory', href: '/admin/inventory', icon: 'inventory' },
  { label: 'Factory', href: '/admin/factory', icon: 'factory' },
  { label: 'Partners', href: '/admin/partners', icon: 'partners' },
  { label: 'Banking', href: '/admin/banking', icon: 'banking' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'analytics' },
  { label: 'AI Assistant', href: '/admin/ai-assistant', icon: 'ai' },
  { label: 'Projects', href: '/admin/projects', icon: 'projects' },
  { label: 'Social', href: '/admin/social', icon: 'social' },
  { label: 'Content', href: '/admin/video-manager', icon: 'videos' },
  { label: 'Security', href: '/admin/security', icon: 'security' },
  { label: 'Settings', href: '/admin/settings', icon: 'settings' },
];

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const color = active ? 'url(#activeGrad)' : 'rgba(255,255,255,0.5)';
  
  const icons: Record<string, React.ReactNode> = {
    command: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    orders: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h6" />
      </svg>
    ),
    products: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    ),
    inventory: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    factory: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M2 20h20M4 20V10l4 2V8l4 2V6l4 2v10" />
        <path d="M20 20V8l-4 2" />
      </svg>
    ),
    partners: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    banking: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    analytics: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    ai: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2z" />
        <circle cx="8" cy="14" r="1" fill={color} />
        <circle cx="16" cy="14" r="1" fill={color} />
      </svg>
    ),
    projects: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    social: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
      </svg>
    ),
    videos: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M10 9l5 3-5 3V9z" fill={active ? 'rgba(102,126,234,0.5)' : 'none'} />
      </svg>
    ),
    security: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    settings: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  };
  
  return (
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      {icons[type] || icons.command}
    </span>
  );
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const router = useRouter();
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isActive = (href: string) => {
    if (href === '/admin/command-center' && router.pathname === '/admin') return true;
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.meshGradient} />
      <div style={styles.orbOne} />
      <div style={styles.orbTwo} />
      <div style={styles.orbThree} />
      <div style={styles.orbFour} />

      <nav style={styles.topNav}>
        <div style={styles.navBrand}>
          <Link href="/admin" style={styles.logo}>
            <span style={styles.logoIcon}>D</span>
            <span style={styles.logoText}>DRIZZL WELLNESS</span>
          </Link>
        </div>
        
        <div style={styles.navTabs}>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  ...styles.navTab,
                  ...(active ? styles.navTabActive : {}),
                }}
              >
                <NavIcon type={item.icon} active={active} />
                <span style={styles.navTabLabel}>{item.label}</span>
                {active && <div style={styles.activeIndicator} />}
              </Link>
            );
          })}
        </div>

        <div style={styles.navRight}>
          <div style={styles.timeDisplay}>
            {mounted && (
              <>
                <span style={styles.timeText}>
                  {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span style={styles.dateText}>
                  {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </>
            )}
          </div>
          <Link href="/" style={styles.exitButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Exit
          </Link>
        </div>
      </nav>

      <main style={styles.main}>
        {(title || subtitle) && (
          <header style={styles.header}>
            <div>
              {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
              {title && <h1 style={styles.title}>{title}</h1>}
            </div>
          </header>
        )}
        <div style={styles.content}>{children}</div>
      </main>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-3deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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
    background: 'radial-gradient(ellipse at 20% 20%, rgba(102, 126, 234, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(240, 147, 251, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 40% 60%, rgba(67, 233, 123, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 60% 30%, rgba(79, 172, 254, 0.05) 0%, transparent 50%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  orbOne: {
    position: 'fixed',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.12) 0%, transparent 70%)',
    top: '-150px',
    right: '-150px',
    animation: 'float 25s ease-in-out infinite',
    pointerEvents: 'none',
    zIndex: 0,
  },
  orbTwo: {
    position: 'fixed',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(240, 147, 251, 0.1) 0%, transparent 70%)',
    bottom: '-100px',
    left: '-100px',
    animation: 'floatReverse 20s ease-in-out infinite',
    pointerEvents: 'none',
    zIndex: 0,
  },
  orbThree: {
    position: 'fixed',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(67, 233, 123, 0.08) 0%, transparent 70%)',
    top: '40%',
    left: '20%',
    animation: 'float 30s ease-in-out infinite',
    pointerEvents: 'none',
    zIndex: 0,
  },
  orbFour: {
    position: 'fixed',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(79, 172, 254, 0.08) 0%, transparent 70%)',
    bottom: '20%',
    right: '10%',
    animation: 'floatReverse 22s ease-in-out infinite',
    pointerEvents: 'none',
    zIndex: 0,
  },
  topNav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '60px',
    background: 'rgba(5, 5, 5, 0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: '#fff',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
  },
  logoText: {
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '1.5px',
  },
  navTabs: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    overflowX: 'auto',
    padding: '0 16px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  navTab: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
  },
  navTabActive: {
    color: '#fff',
    background: 'rgba(102, 126, 234, 0.15)',
  },
  navTabLabel: {
    display: 'block',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '2px',
    background: 'linear-gradient(90deg, #667eea, #a855f7)',
    borderRadius: '1px',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexShrink: 0,
  },
  timeDisplay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  dateText: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
  exitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '12px',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  main: {
    position: 'relative',
    zIndex: 1,
    padding: '32px 40px',
    maxWidth: '1600px',
    margin: '0 auto',
    animation: 'fadeIn 0.4s ease-out',
  },
  header: {
    marginBottom: '32px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '8px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  content: {
    animation: 'fadeIn 0.5s ease-out 0.1s both',
  },
};
