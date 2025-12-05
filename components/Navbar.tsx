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
      <div 
        className={`apple-menu-overlay ${menuOpen ? 'active' : ''}`}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 9999,
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s',
          overflowY: 'auto',
        }}
      >
        {/* Close Button - Top Right */}
        <button 
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            padding: '12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            zIndex: 10001,
            opacity: menuOpen ? 1 : 0,
            transition: 'opacity 0.3s ease 0.1s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1L17 17M17 1L1 17" stroke="#f5f5f7" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        
        {/* Menu Content */}
        <div style={{
          maxWidth: '980px',
          margin: '0 auto',
          padding: '80px 48px 48px 48px',
        }}>
          {/* Main Navigation Items */}
          <nav style={{ marginBottom: '48px' }}>
            {MENU_ITEMS.map((menuItem, index) => (
              <div 
                key={menuItem.title}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.5s ease ${0.1 + index * 0.05}s, transform 0.5s ease ${0.1 + index * 0.05}s`,
                }}
              >
                <button
                  onClick={() => toggleExpandedMenu(menuItem.title)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ 
                    fontSize: 'clamp(24px, 5vw, 28px)', 
                    fontWeight: '600',
                    letterSpacing: '-0.016em',
                    color: '#f5f5f7',
                    transition: 'color 0.2s ease',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#86868b'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#f5f5f7'}
                  >
                    {menuItem.title}
                  </span>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none"
                    style={{
                      transform: expandedMenu === menuItem.title ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <path d="M8 3v10M3 8h10" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                
                {/* Expanded Submenu */}
                <div style={{
                  maxHeight: expandedMenu === menuItem.title ? '400px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  <div style={{ 
                    paddingBottom: '20px',
                    paddingLeft: '4px',
                  }}>
                    {menuItem.items.map((item, subIdx) => (
                      <button
                        key={item}
                        onClick={() => navigateTo(`/collections/${item.toLowerCase().replace(/\s+/g, '-')}`)}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '10px 0',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '17px',
                          color: '#86868b',
                          fontWeight: '400',
                          letterSpacing: '-0.022em',
                          transition: 'color 0.2s ease',
                          opacity: expandedMenu === menuItem.title ? 1 : 0,
                          transform: expandedMenu === menuItem.title ? 'translateX(0)' : 'translateX(-10px)',
                          transitionDelay: `${subIdx * 0.03}s`,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#f5f5f7'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>
          
          {/* Secondary Links */}
          <div style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <button
              onClick={() => navigateTo('/offers')}
              style={{
                display: 'block',
                padding: '0',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                color: '#86868b',
                fontWeight: '400',
                letterSpacing: '-0.016em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f5f5f7'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
            >
              Get $25 Off Your First Order
            </button>
            <button
              onClick={() => navigateTo('/auth')}
              style={{
                display: 'block',
                padding: '0',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                color: '#86868b',
                fontWeight: '400',
                letterSpacing: '-0.016em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f5f5f7'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
            >
              Sign In or Create Account
            </button>
            <button
              onClick={() => navigateTo('/auth?type=retail')}
              style={{
                display: 'block',
                padding: '0',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                color: '#86868b',
                fontWeight: '400',
                letterSpacing: '-0.016em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f5f5f7'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
            >
              Wholesale Partners
            </button>
          </div>
        </div>
      </div>
      
      <nav className="glass" style={{
        background: 'rgba(0, 0, 0, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: 'clamp(12px, 3vw, 14px) clamp(16px, 4vw, 60px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        overflow: 'visible',
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: 'clamp(16px, 4vw, 32px)',
          overflow: 'visible',
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', minWidth: 0, flexShrink: 1 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/images/drizzl-logo-white.gif" 
                alt="Drizzl Wellness" 
                style={{ 
                  height: 'clamp(28px, 6vw, 40px)', 
                  width: 'auto',
                  objectFit: 'contain'
                }} 
              />
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 24px)', flex: 0, flexShrink: 0 }}>
            <Link href="/auth?type=retail" prefetch={true} style={{ fontSize: '13px', fontWeight: '500', color: '#fff', padding: '8px 16px', background: 'transparent', borderRadius: '980px', textDecoration: 'none', border: '1px solid rgba(255, 255, 255, 0.3)', cursor: 'pointer', transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'; }}>
              Wholesale
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 4h16l-1.5 9H3.5L2 4z" />
                <circle cx="5" cy="17" r="1" fill="currentColor" />
                <circle cx="14" cy="17" r="1" fill="currentColor" />
              </svg>
            </Link>

            <div style={{ position: 'relative' }}>
              <button 
                onClick={toggleLang}
                style={{ 
                  padding: '0', 
                  border: 'none', 
                  background: 'none', 
                  color: '#fff', 
                  cursor: 'pointer', 
                  opacity: langOpen ? 1 : 0.6, 
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }} 
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} 
                onMouseLeave={(e) => !langOpen && (e.currentTarget.style.opacity = '0.6')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="6" />
                  <path d="M2 8h12" />
                  <path d="M8 2c0 0-2 3-2 6s2 6 2 6" />
                  <path d="M8 2c0 0 2 3 2 6s-2 6-2 6" />
                </svg>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>{getCurrentLangData().code.toUpperCase()}</span>
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
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    right: 0,
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                    padding: '8px 0',
                    minWidth: '160px',
                    zIndex: 999,
                  }}>
                    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => selectLanguage(lang.code)}
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            border: 'none',
                            background: currentLang === lang.code ? '#f5f5f5' : 'transparent',
                            cursor: 'pointer',
                            fontSize: '13px',
                            color: '#333',
                            transition: 'background 0.6s cubic-bezier(0.32, 0, 0.67, 0)',
                            textAlign: 'left',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                          onMouseLeave={(e) => e.currentTarget.style.background = currentLang === lang.code ? '#f5f5f5' : 'transparent'}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link href="/cart" style={{ opacity: 1, transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H4.5L3 18H21L19.5 6H18M6 6H18M6 6V5C6 3.89543 6.89543 3 8 3H16C17.1046 3 18 3.89543 18 5V6M9 10V14M15 10V14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            <Link href="/auth" style={{ opacity: 1, transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="#ffffff" strokeWidth="1.5"/>
                <path d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>

            <button style={{ padding: '4px', border: 'none', background: 'none', cursor: 'pointer', opacity: 1, transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={toggleMenu} onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
