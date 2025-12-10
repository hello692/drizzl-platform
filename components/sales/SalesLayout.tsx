import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Home,
  Target,
  Phone,
  DollarSign,
  User,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Bell,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';

interface SalesLayoutProps {
  children: React.ReactNode;
  title?: string;
  repName?: string;
}

const NEON_GREEN = '#00FF85';

const navItems = [
  { label: 'Dashboard', href: '/sales/dashboard', icon: Home },
  { label: 'Leads', href: '/sales/leads', icon: Target },
  { label: 'Activity', href: '/sales/activity', icon: Phone },
  { label: 'Commission', href: '/sales/commission', icon: DollarSign },
  { label: 'Profile', href: '/sales/profile', icon: User },
];

export default function SalesLayout({ children, title, repName = 'Sales Rep' }: SalesLayoutProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem('salesSidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('salesSidebarCollapsed', JSON.stringify(newState));
  };

  const isActive = (href: string) => {
    if (href === '/sales/dashboard') {
      return router.pathname === '/sales/dashboard' || router.pathname === '/sales';
    }
    return router.pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem('salesSession');
    router.push('/sales/login');
  };

  const sidebarWidth = isMobile ? 0 : (sidebarCollapsed ? 64 : 240);

  return (
    <>
      <Head>
        <title>{title ? `${title} | DRIZZL Sales Portal` : 'DRIZZL Sales Portal'}</title>
      </Head>

      <div style={styles.container}>
        {!isMobile && (
          <>
            {mobileMenuOpen && (
              <div style={styles.overlay} onClick={() => setMobileMenuOpen(false)} />
            )}

            <aside
              style={{
                ...styles.sidebar,
                width: sidebarWidth,
              }}
            >
              <div style={{
                ...styles.logoContainer,
                height: 80,
                padding: sidebarCollapsed ? '0 12px' : '0 20px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              }}>
                {!sidebarCollapsed && (
                  <Link href="/sales/dashboard" style={styles.logoLink}>
                    <img
                      src="/logo.gif"
                      alt="DRIZZL"
                      style={styles.logo}
                    />
                  </Link>
                )}
              </div>

              <nav style={styles.nav}>
                <div style={styles.navSection}>
                  {navItems.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="sales-nav-link"
                        style={{
                          ...styles.navLink,
                          ...(active ? styles.navLinkActive : {}),
                          height: 48,
                          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                          padding: sidebarCollapsed ? '0 12px' : '0 20px',
                          borderLeft: active ? `3px solid ${NEON_GREEN}` : '3px solid transparent',
                        }}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <Icon size={20} style={{ color: active ? NEON_GREEN : 'rgba(255,255,255,0.7)', flexShrink: 0 }} />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>

                <div style={styles.collapseSection}>
                  <button
                    onClick={toggleCollapse}
                    style={{
                      ...styles.collapseButton,
                      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                      padding: sidebarCollapsed ? '0 12px' : '0 20px',
                    }}
                    aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    className="sales-collapse-btn"
                  >
                    {sidebarCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
                    {!sidebarCollapsed && <span>Collapse</span>}
                  </button>
                </div>
              </nav>
            </aside>
          </>
        )}

        <div style={{
          ...styles.mainWrapper,
          marginLeft: sidebarWidth,
          paddingBottom: isMobile ? 72 : 0,
        }}>
          <header style={styles.header}>
            <div style={styles.headerLeft}>
              {title && <h1 style={styles.headerTitle}>{title}</h1>}
            </div>
            <div style={styles.headerRight}>
              <button style={styles.headerIconButton} className="sales-header-icon" aria-label="Notifications">
                <Bell size={20} />
              </button>
              <button style={styles.headerIconButton} className="sales-header-icon" aria-label="Messages">
                <MessageSquare size={20} />
              </button>
              
              <div style={styles.userMenuContainer}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={styles.userButton}
                >
                  <div style={styles.userAvatar}>
                    <User size={18} />
                  </div>
                  <span style={styles.userName}>{repName}</span>
                  <ChevronDown size={16} style={{ 
                    transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }} />
                </button>

                {userMenuOpen && (
                  <>
                    <div style={styles.menuOverlay} onClick={() => setUserMenuOpen(false)} />
                    <div style={styles.userMenu}>
                      <Link href="/sales/profile" style={styles.menuItem} className="sales-menu-item" onClick={() => setUserMenuOpen(false)}>
                        <User size={16} />
                        <span>Profile Settings</span>
                      </Link>
                      <button onClick={handleLogout} style={styles.menuItem} className="sales-menu-item">
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          <main style={styles.main}>
            {children}
          </main>
        </div>

        {isMobile && (
          <nav style={styles.bottomNav}>
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    ...styles.bottomNavItem,
                    color: active ? NEON_GREEN : 'rgba(255,255,255,0.5)',
                  }}
                >
                  <Icon size={24} />
                  <span style={styles.bottomNavLabel}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      <style jsx global>{`
        .sales-nav-link:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
        
        .sales-header-icon:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: #FFFFFF;
        }
        
        .sales-collapse-btn:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.7);
        }
        
        .sales-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 999,
  },
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#000000',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    transition: 'width 0.2s ease',
    overflow: 'hidden',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    flexShrink: 0,
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: 32,
    width: 'auto',
    objectFit: 'contain',
    filter: 'brightness(0) invert(1)',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 16,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  navSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  navLinkActive: {
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
  },
  collapseSection: {
    marginTop: 'auto',
    padding: '8px 0 16px 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  collapseButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    height: 48,
    backgroundColor: 'transparent',
    border: 'none',
    borderLeft: '3px solid transparent',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  mainWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    transition: 'margin-left 0.2s ease',
  },
  header: {
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 clamp(12px, 4vw, 24px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  userMenuContainer: {
    position: 'relative',
  },
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: 14,
    minHeight: 44,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  userName: {
    maxWidth: 120,
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
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    padding: 8,
    minWidth: 180,
    zIndex: 100,
    backdropFilter: 'blur(20px)',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 12px',
    borderRadius: 6,
    color: '#CCCCCC',
    textDecoration: 'none',
    fontSize: 14,
    backgroundColor: 'transparent',
    border: 'none',
    width: '100%',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    minHeight: 44,
  },
  main: {
    flex: 1,
    padding: 'clamp(12px, 4vw, 24px)',
    backgroundColor: '#000000',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 'calc(72px + env(safe-area-inset-bottom))',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    padding: '8px 4px',
    paddingBottom: 'env(safe-area-inset-bottom)',
    zIndex: 1000,
    backdropFilter: 'blur(20px)',
  },
  bottomNavItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    padding: '6px 8px',
    textDecoration: 'none',
    transition: 'color 0.2s',
    minWidth: 56,
    minHeight: 48,
    flex: 1,
    maxWidth: 80,
  },
  bottomNavLabel: {
    fontSize: 11,
    fontWeight: 500,
    textAlign: 'center' as const,
  },
};
