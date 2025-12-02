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

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
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
      
      <div className={`menu-sidebar-animated ${menuOpen ? 'active' : ''}`}>
        <div className="menu-header-animated" style={{ padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.5px', color: '#000' }}>Menu</span>
          <button 
            className="close-btn-animated"
            onClick={() => setMenuOpen(false)}
          >
            <span className="close-line"></span>
            <span className="close-line"></span>
          </button>
        </div>
        
        <div className="menu-content-animated" style={{ padding: '32px 28px' }}>
          <div className="menu-section-animated">
            <div className="section-title-animated" style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#999', marginBottom: '20px' }}>Shop</div>
            <button className="menu-item-animated" onClick={() => navigateTo('/smoothies')} style={{ fontSize: '17px', fontWeight: '500', letterSpacing: '-0.3px', padding: '14px 0' }}>Smoothies</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/bowls')} style={{ fontSize: '17px', fontWeight: '500', letterSpacing: '-0.3px', padding: '14px 0' }}>Bowls</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/juices')} style={{ fontSize: '17px', fontWeight: '500', letterSpacing: '-0.3px', padding: '14px 0' }}>Juices</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/wellness')} style={{ fontSize: '17px', fontWeight: '500', letterSpacing: '-0.3px', padding: '14px 0' }}>Wellness</button>
          </div>
          
          <div className="menu-divider-animated" style={{ margin: '32px 0', height: '1px', background: 'rgba(0, 0, 0, 0.08)' }}></div>
          
          <div className="menu-section-animated">
            <div className="section-title-animated" style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#999', marginBottom: '20px' }}>Company</div>
            <button className="menu-item-animated" onClick={() => navigateTo('/about')} style={{ fontSize: '17px', fontWeight: '500', letterSpacing: '-0.3px', padding: '14px 0' }}>About</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/sustainability')} style={{ fontSize: '17px', fontWeight: '500', letterSpacing: '-0.3px', padding: '14px 0' }}>Sustainability</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/careers')} style={{ fontSize: '17px', fontWeight: '500', letterSpacing: '-0.3px', padding: '14px 0' }}>Careers</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/blog')} style={{ fontSize: '17px', fontWeight: '500', letterSpacing: '-0.3px', padding: '14px 0' }}>Blog</button>
          </div>
          
          <div className="menu-divider-animated" style={{ margin: '32px 0', height: '1px', background: 'rgba(0, 0, 0, 0.08)' }}></div>
          
          <div className="menu-section-animated">
            <div className="section-title-animated" style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#999', marginBottom: '20px' }}>Support</div>
            <button className="menu-item-animated" onClick={() => navigateTo('/contact')} style={{ fontSize: '17px', fontWeight: '500', letterSpacing: '-0.3px', padding: '14px 0' }}>Contact</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/faq')} style={{ fontSize: '17px', fontWeight: '500', letterSpacing: '-0.3px', padding: '14px 0' }}>FAQ</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/shipping')} style={{ fontSize: '17px', fontWeight: '500', letterSpacing: '-0.3px', padding: '14px 0' }}>Shipping</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/returns')} style={{ fontSize: '17px', fontWeight: '500', letterSpacing: '-0.3px', padding: '14px 0' }}>Returns</button>
          </div>
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
            <Link href="/" style={{ fontSize: 'clamp(14px, 4vw, 18px)', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)', fontWeight: '900', letterSpacing: '-0.4px', color: '#000' }}>
              DRIZZL WELLNESS
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 24px)', flex: 0, flexShrink: 0 }}>
            <Link href="/contact" style={{ fontSize: '13px', fontWeight: '500', color: '#000', padding: '6px 14px', background: '#f5f5f5', borderRadius: '20px', textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)', display: 'inline-block' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#ececec'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#f5f5f5'; }}>
              Retail Partner
            </Link>

            <Link href="/shop-all" style={{ fontSize: '16px', color: '#000', opacity: 0.6, transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              🏪
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
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }} 
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} 
                onMouseLeave={(e) => !langOpen && (e.currentTarget.style.opacity = '0.6')}
              >
                <span>🌐</span>
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

            <Link href="/cart" style={{ fontSize: '16px', color: '#000', opacity: 0.6, transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              🛍
            </Link>

            <Link href="/auth" style={{ fontSize: '16px', color: '#000', opacity: 0.6, transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              👤
            </Link>

            <button style={{ padding: '0', border: 'none', background: 'none', color: '#000', cursor: 'pointer', opacity: 0.6, transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)', fontSize: '16px' }} onClick={toggleMenu} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              ≡
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
