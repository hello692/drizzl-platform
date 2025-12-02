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

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Smoothies', href: '/products/smoothies' },
    { label: 'High Protein', href: '/products/high-protein' },
    { label: 'Bowls', href: '/products/bowls' },
    { label: 'Bites', href: '/products/bites' },
    { label: 'Protein Shop', href: '/products/protein' },
    { label: 'Gift Guide', href: '/products/gift' },
  ];

  return (
    <>
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
            <Link href="/" className="heading-2100 text-glow" style={{ fontSize: '32px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', lineHeight: '1' }} onMouseEnter={(e) => { e.currentTarget.style.textShadow = '0 0 20px rgba(66, 133, 244, 0.6)'; }} onMouseLeave={(e) => { e.currentTarget.style.textShadow = '0 0 10px rgba(66, 133, 244, 0.3)'; }}>
              DRIZZL
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 0 }}>
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

            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', marginLeft: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ width: '24px', height: '2.5px', background: 'linear-gradient(135deg, #000 0%, #4285f4 100%)', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'rotate(0)', boxShadow: '0 0 8px rgba(66, 133, 244, 0.3)' }}></div>
              <div style={{ width: '24px', height: '2.5px', background: 'linear-gradient(135deg, #000 0%, #4285f4 100%)', borderRadius: '2px', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1, boxShadow: '0 0 8px rgba(66, 133, 244, 0.3)' }}></div>
              <div style={{ width: '24px', height: '2.5px', background: 'linear-gradient(135deg, #000 0%, #4285f4 100%)', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'rotate(0)', boxShadow: '0 0 8px rgba(66, 133, 244, 0.3)' }}></div>
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, #4285f4 0%, #2e5dd9 50%, #1a73e8 100%)', zIndex: 200, animation: 'menuFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'hidden' }}>
            <svg style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: '250px' }} viewBox="0 0 1000 250" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="dripGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4285f4" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#2e5dd9" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1a73e8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 0,80 Q 50,40 100,60 T 200,50 Q 250,30 300,70 T 400,45 Q 450,25 500,65 T 600,50 Q 650,30 700,70 T 800,45 Q 850,25 900,65 T 1000,50 L 1000,250 L 0,250 Z" fill="url(#dripGradient)" />
              <path d="M 80,65 Q 75,90 80,120 Q 85,150 80,180 Q 75,200 80,220 L 90,220 Q 95,200 90,180 Q 95,150 90,120 Q 95,90 90,65 Z" fill="url(#dripGradient)" opacity="0.8" />
              <path d="M 300,70 Q 295,100 305,135 Q 310,165 305,195 Q 300,215 305,235 L 315,235 Q 320,215 315,195 Q 320,165 315,135 Q 325,100 315,70 Z" fill="url(#dripGradient)" opacity="0.7" />
              <path d="M 500,65 Q 492,95 505,130 Q 512,170 505,205 Q 500,230 505,250 L 520,250 Q 525,230 520,205 Q 528,170 520,130 Q 533,95 520,65 Z" fill="url(#dripGradient)" opacity="0.8" />
              <path d="M 700,70 Q 695,100 710,140 Q 718,170 710,200 Q 705,220 710,238 L 720,238 Q 725,220 720,200 Q 728,170 720,140 Q 735,100 720,70 Z" fill="url(#dripGradient)" opacity="0.7" />
              <path d="M 920,50 Q 912,80 925,115 Q 932,150 925,185 Q 920,210 925,235 L 935,235 Q 940,210 935,185 Q 942,150 935,115 Q 948,80 935,50 Z" fill="url(#dripGradient)" opacity="0.75" />
            </svg>

            <div style={{ position: 'absolute', left: '80px', top: '140px', display: 'flex', flexDirection: 'column', gap: '40px', zIndex: 10 }}>
              {menuItems.map((item, index) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{ fontSize: '48px', fontWeight: '700', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.5px', color: 'white', textDecoration: 'none', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', lineHeight: '1.1', display: 'inline-block', animation: `menuItemSlideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both` }} onMouseEnter={(e) => { e.currentTarget.style.textShadow = '0 0 30px rgba(255, 255, 255, 0.5)'; e.currentTarget.style.transform = 'translateX(20px)'; }} onMouseLeave={(e) => { e.currentTarget.style.textShadow = 'none'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  {item.label} →
                </Link>
              ))}
            </div>

            <div style={{ position: 'absolute', right: '80px', top: '140px', fontSize: '120px', opacity: 0.3, display: 'flex', alignItems: 'center', height: '400px', gap: '60px', zIndex: 10 }}>
              <span style={{ animation: 'float 4s ease-in-out infinite' }}>🥤</span>
              <span style={{ animation: 'float 4s ease-in-out infinite', animationDelay: '0.5s' }}>🍹</span>
              <span style={{ animation: 'float 4s ease-in-out infinite', animationDelay: '1s' }}>🥑</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
