import React, { useState, useEffect } from 'react';
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
  Bell,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
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
  { label: 'Marketing Hub', href: '/partner/marketing-hub', icon: Palette },
  { label: 'Financing', href: '/partner/financing', icon: CreditCard },
  { label: 'How-To Guide', href: '/partner/how-to-guide', icon: PlayCircle },
  { label: 'Integrations', href: '/partner/integrations', icon: Plug },
  { label: 'Track Orders', href: '/partner/track-orders', icon: MapPin },
];

const bottomNavItems = [
  { label: 'Account', href: '/partner/account', icon: User },
  { label: 'Messages', href: '/partner/messages', icon: MessageSquare },
  { label: 'Support', href: '/partner/support', icon: HelpCircle },
];

export default function PartnerLayout({ children, title, partnerName = 'Partner' }: PartnerLayoutProps) {
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
    const savedState = localStorage.getItem('partnerSidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('partnerSidebarCollapsed', JSON.stringify(newState));
  };

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

  const sidebarWidth = isMobile ? 0 : (sidebarCollapsed ? 64 : 240);

  return (
    <>
      <Head>
        <title>{title ? `${title} | DRIZZL Partner Portal` : 'DRIZZL Partner Portal'}</title>
      </Head>

      <div style={styles.container}>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={styles.mobileMenuButton}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {mobileMenuOpen && isMobile && (
          <div style={styles.overlay} onClick={() => setMobileMenuOpen(false)} />
        )}

        <aside
          style={{
            ...styles.sidebar,
            width: isMobile ? 240 : sidebarWidth,
            transform: isMobile ? (mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
          }}
        >
          <div style={{
            ...styles.logoContainer,
            height: 80,
            padding: sidebarCollapsed && !isMobile ? '0 12px' : '0 20px',
            justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
          }}>
            {(!sidebarCollapsed || isMobile) && (
              <Link href="/partner/dashboard" style={styles.logoLink}>
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
                    className="partner-nav-link"
                    style={{
                      ...styles.navLink,
                      ...(active ? styles.navLinkActive : {}),
                      height: 48,
                      justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
                      padding: sidebarCollapsed && !isMobile ? '0 12px' : '0 20px',
                      borderLeft: active ? `3px solid ${NEON_GREEN}` : '3px solid transparent',
                    }}
                    title={sidebarCollapsed && !isMobile ? item.label : undefined}
                    onClick={() => {
                      if (isMobile) setMobileMenuOpen(false);
                    }}
                  >
                    <Icon size={20} style={{ color: active ? NEON_GREEN : 'rgba(255,255,255,0.7)', flexShrink: 0 }} />
                    {(!sidebarCollapsed || isMobile) && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>

            <div style={styles.divider} />

            <div style={styles.navSection}>
              {bottomNavItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="partner-nav-link"
                    style={{
                      ...styles.navLink,
                      ...(active ? styles.navLinkActive : {}),
                      height: 48,
                      justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
                      padding: sidebarCollapsed && !isMobile ? '0 12px' : '0 20px',
                      borderLeft: active ? `3px solid ${NEON_GREEN}` : '3px solid transparent',
                    }}
                    title={sidebarCollapsed && !isMobile ? item.label : undefined}
                    onClick={() => {
                      if (isMobile) setMobileMenuOpen(false);
                    }}
                  >
                    <Icon size={20} style={{ color: active ? NEON_GREEN : 'rgba(255,255,255,0.7)', flexShrink: 0 }} />
                    {(!sidebarCollapsed || isMobile) && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>

            <div style={styles.collapseSection}>
              <button
                onClick={toggleCollapse}
                style={{
                  ...styles.collapseButton,
                  justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
                  padding: sidebarCollapsed && !isMobile ? '0 12px' : '0 20px',
                }}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="collapse-btn partner-collapse-btn"
              >
                {sidebarCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
                {(!sidebarCollapsed || isMobile) && <span>Collapse</span>}
              </button>
            </div>
          </nav>
        </aside>

        <div style={{
          ...styles.mainWrapper,
          marginLeft: sidebarWidth,
        }}>
          <header style={styles.header}>
            <div style={styles.headerLeft} className="partner-header-left">
              {title && <h1 style={styles.headerTitle} className="partner-header-title">{title}</h1>}
            </div>
            <div style={styles.headerRight}>
              <button style={styles.headerIconButton} className="partner-header-icon" aria-label="Notifications">
                <Bell size={20} />
              </button>
              <button style={styles.headerIconButton} className="partner-header-icon" aria-label="Messages">
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
                  <span style={styles.userName} className="partner-user-name">{partnerName}</span>
                  <ChevronDown size={16} style={{ 
                    transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }} />
                </button>

                {userMenuOpen && (
                  <>
                    <div style={styles.menuOverlay} onClick={() => setUserMenuOpen(false)} />
                    <div style={styles.userMenu}>
                      <Link href="/partner/account" style={styles.menuItem} className="partner-menu-item" onClick={() => setUserMenuOpen(false)}>
                        <User size={16} />
                        <span>Account Settings</span>
                      </Link>
                      <button onClick={handleLogout} style={styles.menuItem} className="partner-menu-item">
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
      </div>

      <style jsx global>{`
        @media (max-width: 767px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          .collapse-btn {
            display: none !important;
          }
          .partner-header-left {
            padding-left: 52px !important;
          }
          .partner-header-title {
            font-size: clamp(16px, 4vw, 20px) !important;
          }
          .partner-user-name {
            display: none !important;
          }
        }
        @media (min-width: 768px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
        
        .partner-nav-link:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
        
        .partner-header-icon:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: #FFFFFF;
        }
        
        .partner-collapse-btn:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.7);
        }
        
        .partner-menu-item:hover {
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
  },
  mobileMenuButton: {
    position: 'fixed',
    top: 16,
    left: 16,
    zIndex: 1001,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    width: 44,
    height: 44,
    padding: 0,
    cursor: 'pointer',
    color: '#FFFFFF',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
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
    transition: 'width 0.2s ease, transform 0.3s ease',
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
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    margin: '16px 12px',
    marginTop: 'auto',
  },
  collapseSection: {
    padding: '8px 0 16px 0',
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
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 clamp(16px, 4vw, 32px)',
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
  main: {
    flex: 1,
    padding: 'clamp(16px, 4vw, 32px)',
    backgroundColor: '#000000',
  },
};
