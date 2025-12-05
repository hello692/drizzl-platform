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
    title: 'Best Sellers', 
    href: '/collections/best-sellers',
    items: ['Strawberry + Peach', 'Matcha', 'Acai', 'Coffee Mushroom'] 
  },
  { 
    title: 'New Arrivals', 
    href: '/collections/new-arrivals',
    items: ['Pink Piyata', 'Mango Jackfruit', 'Chocolate Berry'] 
  },
  { 
    title: 'Collections', 
    href: '/collections',
    items: ['Smoothies', 'High Protein', 'Low Sugar', 'Immunity Boost'] 
  },
  { 
    title: 'Dietary Needs', 
    href: '/collections/dietary',
    items: ['Gluten Free', 'Dairy Free', 'Vegan', 'Keto Friendly'] 
  },
  { 
    title: 'Smoothie Boxes', 
    href: '/collections/boxes',
    items: ['Starter Box', 'Family Box', 'Weekly Box', 'Monthly Box'] 
  },
  { 
    title: 'Gifts', 
    href: '/gifts',
    items: ['Gift Cards', 'Gift Sets', 'Subscriptions'] 
  },
];

const KISS_MENU_ITEMS = [
  { title: 'Smooch the Menu', href: '/menu' },
  { title: 'The Drizzl Wellness Way', href: '/about' },
  { title: 'Where to Get Smooched', href: '/locations' },
  { title: 'Wanna Stock Kiss in Your Spot?', href: '/wholesale' },
  { title: "What's in These Cups?", href: '/ingredients' },
  { title: 'The Kiss Club', href: '/club' },
  { title: 'Scan. Smooch. Sip', href: '/app' },
];

const DrippingLips = () => (
  <svg 
    width="80" 
    height="56" 
    viewBox="0 0 80 56" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="dripping-lips-icon"
  >
    <path 
      d="M40 4C25 4 12 14 12 22C12 30 25 38 40 38C55 38 68 30 68 22C68 14 55 4 40 4Z" 
      fill="#E85A71"
    />
    <path 
      d="M40 8C28 8 18 16 18 22C18 28 28 34 40 34C52 34 62 28 62 22C62 16 52 8 40 8Z" 
      fill="#D14B62"
    />
    <ellipse cx="40" cy="22" rx="18" ry="10" fill="#C03A52"/>
    <path 
      d="M40 2C20 2 8 14 8 24C8 34 20 42 40 42C60 42 72 34 72 24C72 14 60 2 40 2ZM40 6C55 6 66 15 66 24C66 33 55 40 40 40C25 40 14 33 14 24C14 15 25 6 40 6Z" 
      fill="#E85A71"
    />
    <path d="M22 38L22 48C22 50 24 52 26 52C28 52 30 50 30 48L30 42" stroke="#E85A71" strokeWidth="4" strokeLinecap="round"/>
    <path d="M35 40L35 50C35 52 36 54 38 54C40 54 41 52 41 50L41 42" stroke="#E85A71" strokeWidth="4" strokeLinecap="round"/>
    <path d="M50 38L50 46C50 48 51 50 53 50C55 50 56 48 56 46L56 40" stroke="#E85A71" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

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
                  onClick={() => toggleExpandedMenu(menuItem.title)}
                  className="navbar-menu-btn"
                >
                  <span className="navbar-menu-title">
                    {menuItem.title}
                  </span>
                  <svg 
                    className={`navbar-menu-expand-icon ${expandedMenu === menuItem.title ? 'expanded' : ''}`}
                    viewBox="0 0 16 16" 
                    fill="none"
                  >
                    <path d="M8 3v10M3 8h10" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                
                {/* Expanded Submenu */}
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
              </div>
            ))}
          </nav>
          
          {/* Kiss Menu Section */}
          <nav className="navbar-kiss-menu">
            {KISS_MENU_ITEMS.map((item, index) => (
              <button
                key={item.title}
                onClick={() => navigateTo(item.href)}
                className="navbar-kiss-item"
                style={{
                  transitionDelay: `${0.2 + index * 0.04}s`,
                }}
              >
                {item.title}
              </button>
            ))}
          </nav>
          
          {/* Dripping Lips Icon */}
          <div className="navbar-lips-container">
            <DrippingLips />
          </div>
          
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
