'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

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
      {menuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 9998,
          }}
          onClick={() => setMenuOpen(false)} 
        />
      )}
      
      {menuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100%',
            maxWidth: '480px',
            height: '100vh',
            background: '#f5f5f5',
            zIndex: 9999,
            boxShadow: '-8px 0 24px rgba(0,0,0,0.08)',
            overflowY: 'auto',
            borderLeft: '1px solid #e0e0e0',
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            padding: '20px 24px',
            borderBottom: '1px solid #e0e0e0',
            background: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            <button 
              onClick={() => setMenuOpen(false)}
              style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', fontWeight: '300', color: '#000' }}
            >
              ✕
            </button>
          </div>
          
          <div style={{ padding: '24px 0' }}>
            <div style={{ padding: '12px 24px 8px', fontSize: '11px', fontWeight: '600', color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>Products</div>
            <button onClick={() => navigateTo('/smoothies')} style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', padding: '12px 24px', background: '#f5f5f5', border: 'none', textAlign: 'left', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', fontFamily: "'JetBrains Mono', 'Space Mono', monospace" }}>Smoothies</span>
              <span style={{ fontSize: '12px', color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>Fresh Frozen Blends</span>
            </button>
            <button onClick={() => navigateTo('/bowls')} style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', padding: '12px 24px', background: '#f5f5f5', border: 'none', textAlign: 'left', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', fontFamily: "'JetBrains Mono', 'Space Mono', monospace" }}>Bowls</span>
              <span style={{ fontSize: '12px', color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>Nutrient Packed</span>
            </button>
            <button onClick={() => navigateTo('/juices')} style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', padding: '12px 24px', background: '#f5f5f5', border: 'none', textAlign: 'left', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', fontFamily: "'JetBrains Mono', 'Space Mono', monospace" }}>Juices</span>
              <span style={{ fontSize: '12px', color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>Cold Pressed</span>
            </button>
            <button onClick={() => navigateTo('/wellness')} style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', padding: '12px 24px', background: '#f5f5f5', border: 'none', textAlign: 'left', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', fontFamily: "'JetBrains Mono', 'Space Mono', monospace" }}>Wellness</span>
              <span style={{ fontSize: '12px', color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>Health Boosters</span>
            </button>
            
            <div style={{ height: '1px', background: '#e0e0e0', margin: '8px 0' }}></div>
            
            <div style={{ padding: '12px 24px 8px', fontSize: '11px', fontWeight: '600', color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>Company</div>
            <button onClick={() => navigateTo('/about')} style={{ display: 'block', width: '100%', padding: '12px 24px', background: '#f5f5f5', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', fontFamily: "'JetBrains Mono', 'Space Mono', monospace", transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}>About Us</button>
            <button onClick={() => navigateTo('/sustainability')} style={{ display: 'block', width: '100%', padding: '12px 24px', background: '#f5f5f5', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', fontFamily: "'JetBrains Mono', 'Space Mono', monospace", transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}>Sustainability</button>
            <button onClick={() => navigateTo('/careers')} style={{ display: 'block', width: '100%', padding: '12px 24px', background: '#f5f5f5', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', fontFamily: "'JetBrains Mono', 'Space Mono', monospace", transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}>Careers</button>
            <button onClick={() => navigateTo('/blog')} style={{ display: 'block', width: '100%', padding: '12px 24px', background: '#f5f5f5', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', fontFamily: "'JetBrains Mono', 'Space Mono', monospace", transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}>Blog</button>
            
            <div style={{ height: '1px', background: '#e0e0e0', margin: '8px 0' }}></div>
            
            <div style={{ padding: '12px 24px 8px', fontSize: '11px', fontWeight: '600', color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>Support</div>
            <button onClick={() => navigateTo('/contact')} style={{ display: 'block', width: '100%', padding: '12px 24px', background: '#f5f5f5', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', fontFamily: "'JetBrains Mono', 'Space Mono', monospace", transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}>Contact</button>
            <button onClick={() => navigateTo('/faq')} style={{ display: 'block', width: '100%', padding: '12px 24px', background: '#f5f5f5', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', fontFamily: "'JetBrains Mono', 'Space Mono', monospace", transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}>FAQ</button>
            <button onClick={() => navigateTo('/shipping')} style={{ display: 'block', width: '100%', padding: '12px 24px', background: '#f5f5f5', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', fontFamily: "'JetBrains Mono', 'Space Mono', monospace", transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}>Shipping</button>
            <button onClick={() => navigateTo('/returns')} style={{ display: 'block', width: '100%', padding: '12px 24px', background: '#f5f5f5', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', fontFamily: "'JetBrains Mono', 'Space Mono', monospace", transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e8e8e8'} onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}>Returns</button>
          </div>
        </div>
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
            <Link href="/" style={{ fontSize: '28px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.3s ease', fontWeight: '900', letterSpacing: '-0.02em', fontFamily: 'Geist, system-ui, sans-serif', color: '#000' }}>
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
          </div>
        </div>
      </nav>
    </>
  );
}
