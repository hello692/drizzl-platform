import Link from 'next/link';
import { useState } from 'react';
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

export default function LVHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const router = useRouter();

  const toggleExpandedMenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  const navigateTo = (href: string) => {
    setMenuOpen(false);
    setExpandedMenu(null);
    router.push(href);
  };

  return (
    <>
      <header className="lv-header">
        <div className="lv-header-left">
          <button className="lv-header-link" onClick={() => setMenuOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
            </svg>
            <span>Menu</span>
          </button>
          <button className="lv-header-link" onClick={() => router.push('/products?search=')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
            </svg>
            <span>Search</span>
          </button>
        </div>

        <div className="lv-header-center">
          <Link href="/" className="lv-header-logo-link">
            <img 
              src="/logo.gif" 
              alt="DRIZZL" 
              className="lv-header-logo"
            />
          </Link>
        </div>

        <div className="lv-header-right">
          <Link href="/auth?type=retail" className="lv-header-link">
            <span>Wholesale</span>
          </Link>
          <Link href="/auth" className="lv-header-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4"/>
              <path d="M5 20c0-2.76 3.13-5 7-5s7 2.24 7 5" strokeLinecap="round"/>
            </svg>
          </Link>
          <Link href="/cart" className="lv-header-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6h-2l-2 12h18l-2-12h-2M6 6V5a4 4 0 018 0v1M6 6h8"/>
            </svg>
          </Link>
        </div>
      </header>

      {/* Full Screen Dark Menu Overlay */}
      <div className={`navbar-menu-overlay ${menuOpen ? 'active' : ''}`}>
        <button 
          onClick={() => setMenuOpen(false)}
          className="navbar-menu-close"
          aria-label="Close menu"
        >
          <svg className="navbar-menu-close-icon" viewBox="0 0 18 18" fill="none">
            <path d="M1 1L17 17M17 1L1 17" stroke="#f5f5f7" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        
        <div className="navbar-menu-content">
          <nav className="navbar-menu-nav">
            {MENU_ITEMS.map((menuItem, index) => (
              <div 
                key={menuItem.title}
                className="navbar-menu-item"
                style={{
                  transitionDelay: `${0.1 + index * 0.05}s`,
                }}
              >
                <button
                  onClick={() => menuItem.items.length > 0 ? toggleExpandedMenu(menuItem.title) : navigateTo(menuItem.href)}
                  className="navbar-menu-btn"
                >
                  <div className="navbar-menu-title-group">
                    <span className="navbar-menu-title">
                      {menuItem.title}
                    </span>
                    {menuItem.subtitle && (
                      <span className="navbar-menu-subtitle">
                        {menuItem.subtitle}
                      </span>
                    )}
                  </div>
                  {menuItem.items.length > 0 && (
                    <svg 
                      className={`navbar-menu-expand-icon ${expandedMenu === menuItem.title ? 'expanded' : ''}`}
                      viewBox="0 0 16 16" 
                      fill="none"
                    >
                      <path d="M8 3v10M3 8h10" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
                
                {menuItem.items.length > 0 && (
                  <div className={`navbar-menu-submenu ${expandedMenu === menuItem.title ? 'expanded' : ''}`}>
                    <div className="navbar-menu-submenu-inner">
                      {menuItem.items.map((item, subIdx) => (
                        <button
                          key={item}
                          onClick={() => navigateTo(menuItem.href)}
                          className="navbar-menu-subitem"
                          style={{
                            transitionDelay: expandedMenu === menuItem.title ? `${subIdx * 0.03}s` : '0s',
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
