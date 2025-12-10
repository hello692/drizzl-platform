import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  DollarSign,
  Factory,
  Package,
  Bot,
  BarChart3,
  Megaphone,
  Handshake,
  CheckSquare,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';

interface CommandCenterSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  onCollapse: () => void;
}

const NEON_GREEN = '#00FF85';

const navItems = [
  { label: 'Dashboard', href: '/admin/command-center', icon: LayoutDashboard },
  { label: 'Finance', href: '/admin/command-center/finance', icon: DollarSign },
  { label: 'Production', href: '/admin/command-center/production', icon: Factory },
  { label: 'Supply Chain', href: '/admin/command-center/supply-chain', icon: Package },
  { label: 'AI Assistant', href: '/admin/command-center/ai-assistant', icon: Bot },
  { label: 'Analytics', href: '/admin/command-center/analytics', icon: BarChart3 },
  { label: 'Marketing', href: '/admin/command-center/marketing', icon: Megaphone },
  { label: 'B2B Pipeline', href: '/admin/command-center/b2b-pipeline', icon: Handshake },
  { label: 'Tasks', href: '/admin/command-center/tasks', icon: CheckSquare },
];

const bottomNavItems = [
  { label: 'Settings', href: '/admin/command-center/settings', icon: Settings },
  { label: 'Profile', href: '/admin/command-center/profile', icon: User },
  { label: 'Exit', href: '/admin', icon: LogOut },
];

export default function CommandCenterSidebar({ isOpen, isCollapsed, onToggle, onCollapse }: CommandCenterSidebarProps) {
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === '/admin/command-center') {
      return router.pathname === '/admin/command-center' || router.pathname === '/admin/command-center/';
    }
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  const sidebarWidth = isCollapsed ? 64 : 240;

  return (
    <>
      <button
        onClick={onToggle}
        style={styles.mobileMenuButton}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && <div style={styles.overlay} onClick={onToggle} />}

      <aside style={{
        ...styles.sidebar,
        width: sidebarWidth,
        transform: isOpen ? 'translateX(0)' : undefined,
      }}>
        <div style={{
          ...styles.logoContainer,
          padding: isCollapsed ? '24px 12px' : '24px 16px',
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }}>
          {!isCollapsed && (
            <Link href="/admin/command-center" style={styles.logoLink}>
              <img
                src="/logo.gif"
                alt="DRIZZL"
                style={styles.logo}
              />
            </Link>
          )}
          <button
            onClick={onCollapse}
            style={styles.collapseButton}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
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
                  style={{
                    ...styles.navLink,
                    ...(active ? styles.navLinkActive : {}),
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    padding: isCollapsed ? '10px' : '10px 16px',
                  }}
                  title={isCollapsed ? item.label : undefined}
                  onClick={() => {
                    if (window.innerWidth < 768) onToggle();
                  }}
                >
                  <Icon size={18} style={{ color: active ? NEON_GREEN : '#999999', flexShrink: 0 }} />
                  {!isCollapsed && <span>{item.label}</span>}
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
                  style={{
                    ...styles.navLink,
                    ...(active ? styles.navLinkActive : {}),
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    padding: isCollapsed ? '10px' : '10px 16px',
                  }}
                  title={isCollapsed ? item.label : undefined}
                  onClick={() => {
                    if (window.innerWidth < 768) onToggle();
                  }}
                >
                  <Icon size={18} style={{ color: active ? NEON_GREEN : '#999999', flexShrink: 0 }} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      <style jsx global>{`
        @media (max-width: 767px) {
          .command-center-sidebar {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
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
  },
  logoLink: {
    display: 'block',
    textDecoration: 'none',
  },
  logo: {
    height: 28,
    width: 'auto',
    objectFit: 'contain',
    filter: 'brightness(0) invert(1)',
  },
  collapseButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 6,
    padding: 6,
    cursor: 'pointer',
    color: '#666666',
    transition: 'color 0.2s, background-color 0.2s',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 8px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  navSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    borderRadius: 8,
    color: '#999999',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 400,
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  navLinkActive: {
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
    fontWeight: 600,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    margin: '16px 4px',
    flex: 0,
    marginTop: 'auto',
  },
  mobileMenuButton: {
    position: 'fixed',
    top: 16,
    left: 16,
    zIndex: 1001,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
    cursor: 'pointer',
    color: '#FFFFFF',
    display: 'none',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
};
