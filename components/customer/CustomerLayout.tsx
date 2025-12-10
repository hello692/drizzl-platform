import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  LayoutDashboard,
  ShoppingBag,
  RefreshCw,
  MapPin,
  CreditCard,
  Gift,
  Settings,
  ChevronDown,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';

interface CustomerLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

const navItems = [
  { label: 'Dashboard', href: '/account/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/account/orders', icon: ShoppingBag },
  { label: 'Subscriptions', href: '/account/subscriptions', icon: RefreshCw },
  { label: 'Addresses', href: '/account/addresses', icon: MapPin },
  { label: 'Payment', href: '/account/payment', icon: CreditCard },
  { label: 'Rewards', href: '/account/rewards', icon: Gift },
  { label: 'Settings', href: '/account/settings', icon: Settings },
];

export interface CustomerSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  loyaltyPoints: number;
  memberSince: string;
}

export default function CustomerLayout({ children, title }: CustomerLayoutProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('customerSession');
    if (!session) {
      router.push('/account/login');
      return;
    }
    setCustomer(JSON.parse(session));
  }, [router]);

  const isActive = (href: string) => {
    if (href === '/account/dashboard') {
      return router.pathname === '/account/dashboard' || router.pathname === '/account';
    }
    return router.pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem('customerSession');
    router.push('/account/login');
  };

  if (!customer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{title ? `${title} | DRIZZL Account` : 'DRIZZL Account'}</title>
      </Head>

      <div style={styles.container}>
        <aside style={styles.sidebar} className="customer-sidebar">
          <div style={styles.sidebarHeader}>
            <Link href="/" style={styles.logoLink}>
              <img
                src="/logo.gif"
                alt="DRIZZL"
                style={styles.logo}
              />
            </Link>
          </div>

          <nav style={styles.nav}>
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    ...styles.navLink,
                    ...(active ? styles.navLinkActive : {}),
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div style={styles.sidebarFooter}>
            <button onClick={handleLogout} style={styles.logoutButton}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        <div style={styles.mainWrapper}>
          <header style={styles.header}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={styles.mobileMenuButton}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div style={styles.headerRight}>
              <div style={styles.userMenuContainer}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={styles.userButton}
                >
                  <div style={styles.userAvatar}>
                    <User size={16} />
                  </div>
                  <span style={styles.userName}>{customer.firstName} {customer.lastName}</span>
                  <ChevronDown size={16} style={{ 
                    transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }} />
                </button>

                {userMenuOpen && (
                  <>
                    <div style={styles.menuOverlay} onClick={() => setUserMenuOpen(false)} />
                    <div style={styles.userMenu}>
                      <div style={styles.menuHeader}>
                        <span style={styles.menuEmail}>{customer.email}</span>
                        <span style={styles.menuPoints}>{customer.loyaltyPoints.toLocaleString()} pts</span>
                      </div>
                      <Link href="/account/settings" style={styles.menuItem} onClick={() => setUserMenuOpen(false)}>
                        <Settings size={16} />
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
          </header>

          {mobileMenuOpen && (
            <nav style={styles.mobileNav} className="mobile-nav">
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

          <main style={styles.main}>
            {children}
          </main>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .customer-sidebar { display: none !important; }
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
    display: 'flex',
  },
  sidebar: {
    width: 240,
    backgroundColor: '#000000',
    borderRight: `1px solid ${CARD_BORDER}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
  },
  sidebarHeader: {
    padding: '20px 24px',
    borderBottom: `1px solid ${CARD_BORDER}`,
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
  nav: {
    flex: 1,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
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
  sidebarFooter: {
    padding: '16px 12px',
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 8,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#999999',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s',
  },
  mainWrapper: {
    flex: 1,
    marginLeft: 240,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    height: 64,
    backgroundColor: '#000000',
    borderBottom: `1px solid ${CARD_BORDER}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 50,
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
    marginRight: 'auto',
  },
  userMenuContainer: {
    position: 'relative',
  },
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    padding: '8px 14px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: 14,
    transition: 'all 0.2s',
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: NEON_GREEN,
  },
  userName: {
    fontWeight: 500,
  },
  menuOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 40,
  },
  userMenu: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: 220,
    backgroundColor: '#111111',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 8,
    zIndex: 50,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  menuHeader: {
    padding: '12px 14px',
    borderBottom: `1px solid ${CARD_BORDER}`,
    marginBottom: 8,
  },
  menuEmail: {
    display: 'block',
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  menuPoints: {
    display: 'block',
    fontSize: 14,
    color: NEON_GREEN,
    fontWeight: 600,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    borderRadius: 8,
    color: '#FFFFFF',
    textDecoration: 'none',
    fontSize: 14,
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  main: {
    flex: 1,
    padding: 24,
  },
  mobileNav: {
    backgroundColor: '#000000',
    borderBottom: `1px solid ${CARD_BORDER}`,
    padding: '12px',
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
};
