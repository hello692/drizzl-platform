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
    title: 'BEST SELLERS', 
    items: ['Strawberry + Peach', 'Matcha', 'Acai', 'Coffee Mushroom'] 
  },
  { 
    title: 'NEW ARRIVALS', 
    items: ['Pink Piyata', 'Mango Jackfruit', 'Chocolate Berry'] 
  },
  { 
    title: 'COLLECTIONS', 
    items: ['Smoothies', 'High Protein', 'Low Sugar', 'Immunity Boost'] 
  },
  { 
    title: 'DIETARY NEEDS', 
    items: ['Gluten Free', 'Dairy Free', 'Vegan', 'Keto Friendly'] 
  },
  { 
    title: 'SMOOTHIE BOXES', 
    items: ['Starter Box', 'Family Box', 'Weekly Box', 'Monthly Box'] 
  },
  { 
    title: 'GIFTS', 
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
      <div 
        className={`menu-overlay-animated ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(false)} 
        style={{ zIndex: 998 }}
      />
      
      <div className={`menu-sidebar-animated ${menuOpen ? 'active' : ''}`} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        background: '#fff'
      }}>
        <div style={{ 
          padding: '32px 24px 24px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start' 
        }}>
          <span style={{ 
            fontSize: '32px', 
            fontWeight: '300', 
            letterSpacing: '-0.5px', 
            color: '#000',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>Menu</span>
          <button 
            onClick={() => setMenuOpen(false)}
            style={{
              padding: '8px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              marginTop: '4px'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
        
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: '16px 24px'
        }}>
          {MENU_ITEMS.map((menuItem) => (
            <div key={menuItem.title} style={{ borderBottom: 'none' }}>
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
                  textAlign: 'left'
                }}
              >
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  letterSpacing: '0.5px', 
                  color: '#000' 
                }}>
                  {menuItem.title}
                </span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#000" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  style={{
                    transform: expandedMenu === menuItem.title ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              
              {expandedMenu === menuItem.title && (
                <div style={{ 
                  paddingBottom: '16px',
                  paddingLeft: '8px'
                }}>
                  {menuItem.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => navigateTo(`/collections/${item.toLowerCase().replace(/\s+/g, '-')}`)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '12px 0',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px',
                        color: '#666',
                        fontWeight: '400'
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <button
            onClick={() => navigateTo('/offers')}
            style={{
              display: 'block',
              width: '100%',
              padding: '24px 0',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '13px',
              color: '#000',
              fontWeight: '400',
              letterSpacing: '0.3px'
            }}
          >
            GET $25 OFF
          </button>
        </div>
        
        <div style={{ 
          borderTop: '1px solid #e8e8e8',
          padding: '24px',
          marginTop: 'auto'
        }}>
          <button
            onClick={() => navigateTo('/auth')}
            style={{
              display: 'block',
              width: '100%',
              padding: '0',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '14px',
              color: '#000',
              fontWeight: '400'
            }}
          >
            Log in
          </button>
        </div>
      </div>
      
      <nav className="glass" style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        padding: 'clamp(12px, 3vw, 14px) clamp(16px, 4vw, 60px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: 'clamp(16px, 4vw, 32px)',
        }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', minWidth: 0 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/logo.gif" 
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
            <Link href="/auth?type=retail" prefetch={true} style={{ fontSize: '13px', fontWeight: '500', color: '#000', padding: '6px 14px', background: '#f5f5f5', borderRadius: '20px', textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#ececec'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#f5f5f5'; }}>
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
                  color: '#000', 
                  cursor: 'pointer', 
                  opacity: langOpen ? 1 : 0.6, 
                  transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)',
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

            <Link href="/cart" style={{ fontSize: '16px', color: '#000', opacity: 0.6, transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 6h10l-1 8H6L5 6z" />
                <path d="M8 6V4c0-1 0.5-1.5 1-1.5h2c.5 0 1 .5 1 1.5v2" />
              </svg>
            </Link>

            <Link href="/auth" style={{ fontSize: '16px', color: '#000', opacity: 0.6, transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10" cy="7" r="3" />
                <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              </svg>
            </Link>

            <button style={{ padding: '0', border: 'none', background: 'none', color: '#000', cursor: 'pointer', opacity: 0.6, transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px' }} onClick={toggleMenu} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="3" y1="5" x2="17" y2="5" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="15" x2="17" y2="15" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
