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
        <div className="menu-header-animated">
          <button 
            className="close-btn-animated"
            onClick={() => setMenuOpen(false)}
          >
            <span className="close-line"></span>
            <span className="close-line"></span>
          </button>
        </div>
        
        <div className="menu-content-animated">
          <div className="menu-section-animated">
            <div className="section-title-animated">Shop</div>
            <button className="menu-item-animated" onClick={() => navigateTo('/smoothies')}>Smoothies</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/bowls')}>Bowls</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/juices')}>Juices</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/wellness')}>Wellness</button>
          </div>
          
          <div className="menu-divider-animated"></div>
          
          <div className="menu-section-animated">
            <div className="section-title-animated">Company</div>
            <button className="menu-item-animated" onClick={() => navigateTo('/about')}>About</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/sustainability')}>Sustainability</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/careers')}>Careers</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/blog')}>Blog</button>
          </div>
          
          <div className="menu-divider-animated"></div>
          
          <div className="menu-section-animated">
            <div className="section-title-animated">Support</div>
            <button className="menu-item-animated" onClick={() => navigateTo('/contact')}>Contact</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/faq')}>FAQ</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/shipping')}>Shipping</button>
            <button className="menu-item-animated" onClick={() => navigateTo('/returns')}>Returns</button>
          </div>
        </div>
      </div>
      
      <nav className="glass" style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        padding: '14px 60px',
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
          gap: '32px',
        }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Link href="/" style={{ fontSize: '16px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)', fontWeight: '600', letterSpacing: '-0.3px', color: '#000' }}>
              Drizzl
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flex: 0 }}>
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
                  fontSize: '13px',
                  fontWeight: '500',
                }} 
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} 
                onMouseLeave={(e) => !langOpen && (e.currentTarget.style.opacity = '0.6')}
              >
                {getCurrentLangData().code.toUpperCase()}
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

            <Link href="/cart" style={{ fontSize: '13px', color: '#000', opacity: 0.6, transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              Bag
            </Link>

            <Link href="/auth" style={{ fontSize: '13px', color: '#000', opacity: 0.6, transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              Account
            </Link>

            <button style={{ padding: '0', border: 'none', background: 'none', color: '#000', cursor: 'pointer', opacity: 0.6, transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)', fontSize: '13px', fontWeight: '500' }} onClick={toggleMenu} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              Menu
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
