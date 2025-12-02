'use client';

import Link from 'next/link';
import { useState } from 'react';

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(66, 133, 244, 0.3))' }}>
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(66, 133, 244, 0.3))' }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(66, 133, 244, 0.3))' }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(66, 133, 244, 0.3))' }}>
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(66, 133, 244, 0.3))' }}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(66, 133, 244, 0.3))' }}>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {menuOpen && (
        <div className="menu-overlay-2100" onClick={() => setMenuOpen(false)} />
      )}
      
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
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flex: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000', cursor: 'pointer', opacity: 0.7, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', whiteSpace: 'nowrap' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}>
              <SearchIcon />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Search</span>
            </div>
            <button style={{ padding: '0', border: 'none', background: 'none', color: '#000', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', whiteSpace: 'nowrap' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}>
              <LocationIcon />
              Find in stores
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Link href="/" style={{ fontSize: '20px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.3s ease', fontWeight: '700', letterSpacing: '-0.01em', fontFamily: 'Geist, system-ui, sans-serif', color: '#000' }}>
              DRIZZL WELLNESS
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 0, position: 'relative' }}>
            <Link href="/auth" style={{ color: '#000', fontSize: '14px', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', whiteSpace: 'nowrap' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}>
              <UserIcon />
              Log in
            </Link>

            <Link href="/retail-partner" style={{ color: '#000', fontSize: '14px', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', whiteSpace: 'nowrap' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}>
              <BriefcaseIcon />
              Partner Login
            </Link>

            <Link href="/cart" style={{ fontSize: '14px', fontWeight: '500', color: '#000', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', whiteSpace: 'nowrap' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}>
              <CartIcon />
              <span>Cart (0)</span>
            </Link>

            <button className="menu-button" style={{ padding: '0', border: 'none', background: 'none', color: '#000', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', whiteSpace: 'nowrap' }} onClick={toggleMenu} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}>
              <MenuIcon />
            </button>
            
            <div className={`menu-sidebar-2100 ${menuOpen ? 'open' : ''}`}>
              <div className="menu-header-sidebar">
                <button 
                  className="menu-close-btn"
                  onClick={() => setMenuOpen(false)}
                  style={{ padding: '0', border: 'none', background: 'none', color: '#000', cursor: 'pointer', fontSize: '24px', fontWeight: '300', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}
                >
                  ✕
                </button>
              </div>
              
              <div className="menu-content-sidebar">
                <div className="menu-header-2100">
                  <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: '700', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#666' }}>Products</span>
                </div>
                
                <div className="menu-section-2100">
                  <a href="/smoothies" className="menu-item-2100" onClick={() => setMenuOpen(false)}>
                    <span className="item-label">Smoothies</span>
                    <span className="item-subtitle">Fresh Frozen Blends</span>
                  </a>
                  <a href="/bowls" className="menu-item-2100" onClick={() => setMenuOpen(false)}>
                    <span className="item-label">Bowls</span>
                    <span className="item-subtitle">Nutrient Packed</span>
                  </a>
                  <a href="/juices" className="menu-item-2100" onClick={() => setMenuOpen(false)}>
                    <span className="item-label">Juices</span>
                    <span className="item-subtitle">Cold Pressed</span>
                  </a>
                  <a href="/wellness" className="menu-item-2100" onClick={() => setMenuOpen(false)}>
                    <span className="item-label">Wellness</span>
                    <span className="item-subtitle">Health Boosters</span>
                  </a>
                </div>
                
                <div className="menu-divider-2100"></div>
                
                <div className="menu-header-2100">
                  <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: '700', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#666' }}>Company</span>
                </div>
                
                <div className="menu-section-2100">
                  <a href="/about" className="menu-item-2100" onClick={() => setMenuOpen(false)}>
                    <span className="item-label">About Us</span>
                  </a>
                  <a href="/sustainability" className="menu-item-2100" onClick={() => setMenuOpen(false)}>
                    <span className="item-label">Sustainability</span>
                  </a>
                  <a href="/careers" className="menu-item-2100" onClick={() => setMenuOpen(false)}>
                    <span className="item-label">Careers</span>
                  </a>
                  <a href="/blog" className="menu-item-2100" onClick={() => setMenuOpen(false)}>
                    <span className="item-label">Blog</span>
                  </a>
                </div>
                
                <div className="menu-divider-2100"></div>
                
                <div className="menu-header-2100">
                  <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: '700', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#666' }}>Support</span>
                </div>
                
                <div className="menu-section-2100">
                  <a href="/contact" className="menu-item-2100" onClick={() => setMenuOpen(false)}>
                    <span className="item-label">Contact</span>
                  </a>
                  <a href="/faq" className="menu-item-2100" onClick={() => setMenuOpen(false)}>
                    <span className="item-label">FAQ</span>
                  </a>
                  <a href="/shipping" className="menu-item-2100" onClick={() => setMenuOpen(false)}>
                    <span className="item-label">Shipping</span>
                  </a>
                  <a href="/returns" className="menu-item-2100" onClick={() => setMenuOpen(false)}>
                    <span className="item-label">Returns</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
