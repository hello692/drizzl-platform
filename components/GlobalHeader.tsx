import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const MENU_ITEMS = [
  { 
    title: 'Shop', 
    subtitle: 'Explore our smoothie collection',
    href: '/products',
    items: ['Best Sellers', 'New Arrivals', 'Smoothie Boxes', 'Bundles', 'Gifts'] 
  },
  { 
    title: 'About', 
    subtitle: 'The Drizzl story',
    href: '/about',
    items: ['Our Story', 'Our Mission', 'Sustainability', 'Meet the Team'] 
  },
  { 
    title: 'Locations', 
    subtitle: 'Find us near you',
    href: '/locations',
    items: ['Store Locator', 'Delivery Areas', 'Pop-Up Events'] 
  },
  { 
    title: 'Wholesale', 
    subtitle: 'Partner with us',
    href: '/auth?type=retail',
    items: ['Partner With Us', 'Wholesale Pricing', 'Retail Inquiries', 'Food Service'] 
  },
  { 
    title: 'Ingredients', 
    subtitle: 'What goes in every cup',
    href: '/ingredients',
    items: ['Ingredients', 'Nutrition Facts', 'Dietary Options', 'Sourcing'] 
  },
  { 
    title: 'Membership', 
    subtitle: 'Join the wellness club',
    href: '/club',
    items: ['Join the Club', 'Member Benefits', 'Rewards', 'Refer a Friend'] 
  },
];

interface GlobalHeaderProps {
  variant?: 'transparent' | 'solid';
}

export default function GlobalHeader({ variant = 'transparent' }: GlobalHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const router = useRouter();

  const isTransparent = variant === 'transparent';

  const toggleExpandedMenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  const navigateTo = (href: string) => {
    setMenuOpen(false);
    setExpandedMenu(null);
    router.push(href);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const headerStyles: React.CSSProperties = isTransparent ? {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '28px clamp(40px, 6vw, 80px)',
    background: 'transparent',
    minHeight: '80px',
  } : {
    position: 'relative',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '28px clamp(40px, 6vw, 80px)',
    background: '#000000',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    minHeight: '80px',
  };

  const textColor = '#ffffff';
  const logoSrc = '/images/drizzl-logo-white.gif';

  return (
    <>
      <header style={headerStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', minWidth: '200px' }}>
          <button 
            onClick={() => setMenuOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: textColor,
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.875rem',
              fontWeight: 400,
              letterSpacing: '0.02em',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
            </svg>
            <span>Menu</span>
          </button>
          <button 
            onClick={() => router.push('/products')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: textColor,
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.875rem',
              fontWeight: 400,
              letterSpacing: '0.02em',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
            </svg>
            <span>Search</span>
          </button>
        </div>

        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Link href="/" style={{ display: 'block' }}>
            <img 
              src={logoSrc}
              alt="DRIZZL WELLNESS" 
              style={{ height: '42px', width: 'auto' }}
            />
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', minWidth: '200px', justifyContent: 'flex-end' }}>
          <Link 
            href="/auth?type=retail" 
            style={{
              color: textColor,
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 400,
              letterSpacing: '0.02em',
            }}
          >
            Wholesale
          </Link>
          <Link 
            href="/auth" 
            style={{ color: textColor, display: 'flex', alignItems: 'center' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4"/>
              <path d="M5 20c0-2.76 3.13-5 7-5s7 2.24 7 5" strokeLinecap="round"/>
            </svg>
          </Link>
          <Link 
            href="/cart" 
            style={{ color: textColor, display: 'flex', alignItems: 'center' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6h-2l-2 12h18l-2-12h-2M6 6V5a4 4 0 018 0v1M6 6h8"/>
            </svg>
          </Link>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      <div 
        className={`navbar-menu-overlay ${menuOpen ? 'active' : ''}`}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000000',
          zIndex: 9999,
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
          overflowY: 'auto',
        }}
      >
        <button 
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'absolute',
            top: '24px',
            right: '40px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            zIndex: 10,
          }}
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
            <path d="M1 1L17 17M17 1L1 17" stroke="#f5f5f7" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '100px 40px 60px',
        }}>
          <nav>
            {MENU_ITEMS.map((menuItem, index) => (
              <div 
                key={menuItem.title}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.4s ease ${0.1 + index * 0.05}s, transform 0.4s ease ${0.1 + index * 0.05}s`,
                }}
              >
                <button
                  onClick={() => menuItem.items.length > 0 ? toggleExpandedMenu(menuItem.title) : navigateTo(menuItem.href)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '28px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <span style={{
                      display: 'block',
                      fontSize: '1.75rem',
                      fontWeight: 300,
                      color: '#ffffff',
                      letterSpacing: '-0.02em',
                    }}>
                      {menuItem.title}
                    </span>
                    {menuItem.subtitle && (
                      <span style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        color: 'rgba(255,255,255,0.5)',
                        marginTop: '4px',
                      }}>
                        {menuItem.subtitle}
                      </span>
                    )}
                  </div>
                  {menuItem.items.length > 0 && (
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none"
                      style={{
                        transform: expandedMenu === menuItem.title ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <path d="M8 3v10M3 8h10" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
                
                {menuItem.items.length > 0 && (
                  <div style={{
                    maxHeight: expandedMenu === menuItem.title ? '400px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s ease',
                  }}>
                    <div style={{ paddingBottom: '20px' }}>
                      {menuItem.items.map((item, subIdx) => (
                        <button
                          key={item}
                          onClick={() => navigateTo(menuItem.href)}
                          style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                            padding: '12px 0 12px 20px',
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            opacity: expandedMenu === menuItem.title ? 1 : 0,
                            transform: expandedMenu === menuItem.title ? 'translateX(0)' : 'translateX(-10px)',
                            transition: `opacity 0.3s ease ${subIdx * 0.03}s, transform 0.3s ease ${subIdx * 0.03}s`,
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
