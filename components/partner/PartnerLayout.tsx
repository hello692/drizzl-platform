import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  DollarSign,
  User,
  HelpCircle,
  ChevronDown,
  LogOut,
  Menu,
  X,
  BarChart3,
  Palette,
  CreditCard,
  PlayCircle,
  Plug,
  MapPin,
} from 'lucide-react';

interface PartnerLayoutProps {
  children: React.ReactNode;
  title?: string;
  partnerName?: string;
}

const NEON_GREEN = '#00FF85';

const navItems = [
  { label: 'Dashboard', href: '/partner/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/partner/orders', icon: ShoppingCart },
  { label: 'Invoices', href: '/partner/invoices', icon: FileText },
  { label: 'Pricing', href: '/partner/pricing', icon: DollarSign },
  { label: 'Analytics', href: '/partner/analytics', icon: BarChart3 },
  { label: 'Marketing', href: '/partner/marketing-hub', icon: Palette },
  { label: 'Financing', href: '/partner/financing', icon: CreditCard },
  { label: 'How-To', href: '/partner/how-to-guide', icon: PlayCircle },
  { label: 'Integrations', href: '/partner/integrations', icon: Plug },
  { label: 'Track Orders', href: '/partner/track-orders', icon: MapPin },
  { label: 'Account', href: '/partner/account', icon: User },
  { label: 'Support', href: '/partner/support', icon: HelpCircle },
];

export default function PartnerLayout({ children, title, partnerName = 'Partner' }: PartnerLayoutProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/partner/dashboard') {
      return router.pathname === '/partner/dashboard' || router.pathname === '/partner';
    }
    return router.pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem('partnerSession');
    router.push('/partner/login');
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} | DRIZZL Partner Portal` : 'DRIZZL Partner Portal'}</title>
      </Head>

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <div style={styles.headerLeft}>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={styles.mobileMenuButton}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <Link href="/partner/dashboard" style={styles.logoLink}>
                <img
                  src="/logo.gif"
                  alt="DRIZZL"
                  style={styles.logo}
                />
              </Link>

              <nav style={styles.desktopNav}>
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        ...styles.navLink,
                        ...(active ? styles.navLinkActive : {}),
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div style={styles.headerRight}>
              <div style={styles.userMenuContainer}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={styles.userButton}
                >
                  <span style={styles.userName}>{partnerName}</span>
                  <ChevronDown size={16} style={{ 
                    transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }} />
                </button>

                {userMenuOpen && (
                  <>
                    <div style={styles.menuOverlay} onClick={() => setUserMenuOpen(false)} />
                    <div style={styles.userMenu}>
                      <Link href="/partner/account" style={styles.menuItem} onClick={() => setUserMenuOpen(false)}>
                        <User size={16} />
                        <span>Account Settings</span>
                      </Link>
                      <button onClick={handleLogout} style={styles.menuItem}>
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav style={styles.mobileNav}>
              {navItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      ...styles.mobileNavLink,
                      ...(active ? styles.mobileNavLinkActive : {}),
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </header>

        <main style={styles.main}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    zIndex: 1000,
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: 64,
    maxWidth: 1400,
    margin: '0 auto',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  mobileMenuButton: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#FFFFFF',
    cursor: 'pointer',
    padding: 8,
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: 28,
    width: 'auto',
    filter: 'brightness(0) invert(1)',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  navLink: {
    padding: '8px 16px',
    borderRadius: 8,
    color: '#999999',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  navLinkActive: {
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
  },
  userMenuContainer: {
    position: 'relative',
  },
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: 14,
  },
  userName: {
    maxWidth: 150,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  menuOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
  userMenu: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    backgroundColor: '#111111',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
    minWidth: 180,
    zIndex: 100,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 6,
    color: '#CCCCCC',
    textDecoration: 'none',
    fontSize: 14,
    backgroundColor: 'transparent',
    border: 'none',
    width: '100%',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    gap: 4,
  },
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 8,
    color: '#999999',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
  },
  mobileNavLinkActive: {
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
  },
  main: {
    paddingTop: 64,
    minHeight: '100vh',
  },
};
