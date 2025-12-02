'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"></circle>
    <path d="M20 21a8 8 0 1 0-16 0"></path>
  </svg>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
  </svg>
);

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"></line>
    <line x1="4" y1="12" x2="20" y2="12"></line>
    <line x1="4" y1="18" x2="20" y2="18"></line>
  </svg>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
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
            <div className="section-title-animated">Products</div>
            <button className="menu-item-animated" onClick={() => navigateTo('/smoothies')} style={{ animationDelay: '0.05s' }}>
              <span className="item-text">Smoothies</span>
              <span className="item-sub">Fresh Frozen Blends</span>
              <span className="item-arrow">→</span>
            </button>
            <button className="menu-item-animated" onClick={() => navigateTo('/bowls')} style={{ animationDelay: '0.1s' }}>
              <span className="item-text">Bowls</span>
              <span className="item-sub">Nutrient Packed</span>
              <span className="item-arrow">→</span>
            </button>
            <button className="menu-item-animated" onClick={() => navigateTo('/juices')} style={{ animationDelay: '0.15s' }}>
              <span className="item-text">Juices</span>
              <span className="item-sub">Cold Pressed</span>
              <span className="item-arrow">→</span>
            </button>
            <button className="menu-item-animated" onClick={() => navigateTo('/wellness')} style={{ animationDelay: '0.2s' }}>
              <span className="item-text">Wellness</span>
              <span className="item-sub">Health Boosters</span>
              <span className="item-arrow">→</span>
            </button>
          </div>
          
          <div className="menu-divider-animated"></div>
          
          <div className="menu-section-animated">
            <div className="section-title-animated">Company</div>
            <button className="menu-item-animated simple" onClick={() => navigateTo('/about')} style={{ animationDelay: '0.25s' }}>
              <span className="item-text">About Us</span>
              <span className="item-arrow">→</span>
            </button>
            <button className="menu-item-animated simple" onClick={() => navigateTo('/sustainability')} style={{ animationDelay: '0.3s' }}>
              <span className="item-text">Sustainability</span>
              <span className="item-arrow">→</span>
            </button>
            <button className="menu-item-animated simple" onClick={() => navigateTo('/careers')} style={{ animationDelay: '0.35s' }}>
              <span className="item-text">Careers</span>
              <span className="item-arrow">→</span>
            </button>
            <button className="menu-item-animated simple" onClick={() => navigateTo('/blog')} style={{ animationDelay: '0.4s' }}>
              <span className="item-text">Blog</span>
              <span className="item-arrow">→</span>
            </button>
          </div>
          
          <div className="menu-divider-animated"></div>
          
          <div className="menu-section-animated">
            <div className="section-title-animated">Support</div>
            <button className="menu-item-animated simple" onClick={() => navigateTo('/contact')} style={{ animationDelay: '0.45s' }}>
              <span className="item-text">Contact</span>
              <span className="item-arrow">→</span>
            </button>
            <button className="menu-item-animated simple" onClick={() => navigateTo('/faq')} style={{ animationDelay: '0.5s' }}>
              <span className="item-text">FAQ</span>
              <span className="item-arrow">→</span>
            </button>
            <button className="menu-item-animated simple" onClick={() => navigateTo('/shipping')} style={{ animationDelay: '0.55s' }}>
              <span className="item-text">Shipping</span>
              <span className="item-arrow">→</span>
            </button>
            <button className="menu-item-animated simple" onClick={() => navigateTo('/returns')} style={{ animationDelay: '0.6s' }}>
              <span className="item-text">Returns</span>
              <span className="item-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
      
      <nav className="glass" style={{
        background: 'rgba(255, 255, 255, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
        padding: '14px 60px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(66, 133, 244, 0.08)',
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
            <Link href="/" style={{ fontSize: '24px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.3s ease', fontWeight: '900', letterSpacing: '-0.02em', fontFamily: 'Geist, system-ui, sans-serif', color: '#000' }}>
              DRIZZL WELLNESS
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 0 }}>
            <button style={{ padding: '8px', border: 'none', background: 'none', color: '#000', cursor: 'pointer', opacity: 0.6, transition: 'all 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              <SearchIcon />
            </button>

            <button style={{ padding: '8px', border: 'none', background: 'none', color: '#000', cursor: 'pointer', opacity: 0.6, transition: 'all 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              <GlobeIcon />
            </button>

            <Link href="/cart" style={{ padding: '8px', color: '#000', opacity: 0.6, transition: 'all 0.2s ease', display: 'flex' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              <CartIcon />
            </Link>

            <Link href="/auth" style={{ padding: '8px', color: '#000', opacity: 0.6, transition: 'all 0.2s ease', display: 'flex' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              <UserIcon />
            </Link>

            <button className="menu-button" style={{ padding: '8px', border: 'none', background: 'none', color: '#000', cursor: 'pointer', opacity: 0.6, transition: 'all 0.2s ease' }} onClick={toggleMenu} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
