'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ru', name: 'Русский' },
];

const MENU_ITEMS = [
  { 
    title: 'Smooch the Menu', 
    href: '/menu',
    items: ['Best Sellers', 'New Arrivals', 'Smoothie Boxes', 'Bundles', 'Gifts'] 
  },
  { 
    title: 'The Drizzl Wellness Way', 
    href: '/about',
    items: ['Our Story', 'Our Mission', 'Sustainability', 'Meet the Team'] 
  },
  { 
    title: 'Where to Get Smooched', 
    href: '/locations',
    items: ['Store Locator', 'Delivery Areas', 'Pop-Up Events'] 
  },
  { 
    title: 'Wanna Stock Kiss in Your Spot?', 
    href: '/wholesale',
    items: ['Partner With Us', 'Wholesale Pricing', 'Retail Inquiries', 'Food Service'] 
  },
  { 
    title: "What's in These Cups?", 
    href: '/ingredients',
    items: ['Ingredients', 'Nutrition Facts', 'Dietary Options', 'Sourcing'] 
  },
  { 
    title: 'The Kiss Club', 
    href: '/club',
    items: ['Join the Club', 'Member Benefits', 'Rewards', 'Refer a Friend'] 
  },
  { 
    title: 'Scan. Smooch. Sip', 
    href: '/app',
    items: ['Download the App', 'How It Works', 'Mobile Ordering', 'Track Your Order'] 
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const router = useRouter();
  const currentLang = router.locale || 'en';
  
  let t: (key: string) => string;
  try {
    t = useTranslations('nav');
  } catch {
    t = (key: string) => key;
  }
  
  let tMenu: (key: string) => string;
  try {
    tMenu = useTranslations('menu');
  } catch {
    tMenu = (key: string) => key;
  }

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleLang = () => setLangOpen(!langOpen);
  const toggleExpandedMenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };
  
  const selectLanguage = (code: string) => {
    if (code === currentLang) {
      setLangOpen(false);
      return;
    }
    setLangOpen(false);
    const path = code === 'en' ? router.pathname : `/${code}${router.pathname}`;
    window.location.href = path;
  };
  
  const getCurrentLangData = () => LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];
  
  const navigateTo = (path: string) => {
    console.log('Navigating to:', path);
    setMenuOpen(false);
    setTimeout(() => {
      window.location.href = path;
    }, 100);
  };

  return (
    <>
      {/* Apple-style Full Screen Dark Menu */}
      <div className={`navbar-menu-overlay ${menuOpen ? 'active' : ''}`}>
        {/* Close Button - Top Right */}
        <button 
          onClick={() => setMenuOpen(false)}
          className="navbar-menu-close"
          aria-label="Close menu"
        >
          <svg className="navbar-menu-close-icon" viewBox="0 0 18 18" fill="none">
            <path d="M1 1L17 17M17 1L1 17" stroke="#f5f5f7" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        
        {/* Menu Content */}
        <div className="navbar-menu-content">
          {/* Main Navigation Items */}
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
                  <span className="navbar-menu-title">
                    {menuItem.title}
                  </span>
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
                
                {/* Expanded Submenu - only if has items */}
                {menuItem.items.length > 0 && (
                  <div className={`navbar-menu-submenu ${expandedMenu === menuItem.title ? 'expanded' : ''}`}>
                    <div className="navbar-menu-submenu-inner">
                      {menuItem.items.map((item, subIdx) => (
                        <button
                          key={item}
                          onClick={() => navigateTo(`/collections/${item.toLowerCase().replace(/\s+/g, '-')}`)}
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
          
          {/* Secondary Links */}
          <div className="navbar-menu-secondary">
            <button
              onClick={() => navigateTo('/offers')}
              className="navbar-menu-link"
            >
              Get $25 Off Your First Order
            </button>
            <button
              onClick={() => navigateTo('/auth')}
              className="navbar-menu-link"
            >
              Sign In or Create Account
            </button>
            <button
              onClick={() => navigateTo('/auth?type=retail')}
              className="navbar-menu-link"
            >
              Wholesale Partners
            </button>
          </div>
        </div>
      </div>
      
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo-container">
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/images/drizzl-logo-white.gif" 
                alt="Drizzl Wellness" 
                className="navbar-logo"
              />
            </Link>
          </div>

          <div className="navbar-actions">
            <Link href="/auth?type=retail" prefetch={true} className="navbar-wholesale-btn">
              <span className="navbar-wholesale-text">Wholesale</span>
              <svg className="navbar-wholesale-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 4h16l-1.5 9H3.5L2 4z" />
                <circle cx="5" cy="17" r="1" fill="currentColor" />
                <circle cx="14" cy="17" r="1" fill="currentColor" />
              </svg>
            </Link>

            <div style={{ position: 'relative' }}>
              <button 
                onClick={toggleLang}
                className={`navbar-lang-btn ${langOpen ? 'active' : ''}`}
                aria-label="Select language"
              >
                <svg className="navbar-icon-sm" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="6" />
                  <path d="M2 8h12" />
                  <path d="M8 2c0 0-2 3-2 6s2 6 2 6" />
                  <path d="M8 2c0 0 2 3 2 6s-2 6-2 6" />
                </svg>
                <span className="navbar-lang-code">{getCurrentLangData().code.toUpperCase()}</span>
              </button>
              
              {langOpen && (
                <>
                  <div 
                    onClick={() => setLangOpen(false)}
                    style={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 998,
                    }}
                  />
                  <div className="navbar-lang-dropdown">
                    <div className="navbar-lang-list">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => selectLanguage(lang.code)}
                          className={`navbar-lang-option ${currentLang === lang.code ? 'active' : ''}`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link href="/cart" className="navbar-icon-btn" aria-label="View cart">
              <svg className="navbar-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H4.5L3 18H21L19.5 6H18M6 6H18M6 6V5C6 3.89543 6.89543 3 8 3H16C17.1046 3 18 3.89543 18 5V6M9 10V14M15 10V14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            <Link href="/auth" className="navbar-icon-btn" aria-label="Account">
              <svg className="navbar-icon-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="#ffffff" strokeWidth="1.5"/>
                <path d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>

            <button 
              className="navbar-icon-btn" 
              onClick={toggleMenu} 
              aria-label="Open menu"
            >
              <svg className="navbar-icon-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
