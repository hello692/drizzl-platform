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
          {/* Left: Search + Find in stores */}
          <div style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
            flex: 0,
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: '#000',
              cursor: 'pointer',
              opacity: 0.7,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              whiteSpace: 'nowrap',
            }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}>
              <div style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
              }}>
                <SearchIcon />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500', letterSpacing: '-0.3px' }}>Search</span>
            </div>

            <button style={{
              padding: '0',
              border: 'none',
              background: 'none',
              color: '#000',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: 0.7,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '-0.3px',
              whiteSpace: 'nowrap',
            }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}>
              <div style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
              }}>
                <LocationIcon />
              </div>
              Find in stores
            </button>
          </div>

          {/* Center: Logo */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Link href="/" className="heading-2100 text-glow" style={{
              fontSize: '32px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              lineHeight: '1',
              letterSpacing: '0.2px',
            }} onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = '0 0 20px rgba(66, 133, 244, 0.6)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = '0 0 10px rgba(66, 133, 244, 0.3)';
            }}>
              DRIZZL
            </Link>
          </div>

          {/* Right: Login + Cart + Menu */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flex: 0,
          }}>
            <Link href="/auth" style={{
              color: '#000',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: 0.7,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '-0.3px',
              whiteSpace: 'nowrap',
            }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}>
              <UserIcon />
              Log in
            </Link>

            <Link href="/retail-partner" style={{
              color: '#000',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: 0.7,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '-0.3px',
              whiteSpace: 'nowrap',
            }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}>
              <BriefcaseIcon />
              Partner Login
            </Link>

            <Link href="/cart" style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#000',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: 0.7,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '-0.3px',
              whiteSpace: 'nowrap',
            }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}>
              <CartIcon />
              <span>Cart (0)</span>
            </Link>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                marginLeft: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{
                width: '24px',
                height: '2.5px',
                background: 'linear-gradient(135deg, #000 0%, #4285f4 100%)',
                borderRadius: '2px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'rotate(0)',
                boxShadow: '0 0 8px rgba(66, 133, 244, 0.3)',
              }}></div>
              <div style={{
                width: '24px',
                height: '2.5px',
                background: 'linear-gradient(135deg, #000 0%, #4285f4 100%)',
                borderRadius: '2px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: menuOpen ? 0 : 1,
                boxShadow: '0 0 8px rgba(66, 133, 244, 0.3)',
              }}></div>
              <div style={{
                width: '24px',
                height: '2.5px',
                background: 'linear-gradient(135deg, #000 0%, #4285f4 100%)',
                borderRadius: '2px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'rotate(0)',
                boxShadow: '0 0 8px rgba(66, 133, 244, 0.3)',
              }}></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Full-Screen Menu */}
      {menuOpen && (
        <>
          {/* Overlay Background with Dripping Effect */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, #4285f4 0%, #2e5dd9 50%, #1a73e8 100%)',
              zIndex: 200,
              animation: 'menuFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
            }}
          >
            {/* Dripping Effect SVG */}
            <svg
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                width: '100%',
                height: '200px',
                preserveAspectRatio: 'none',
              }}
              viewBox="0 0 1000 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="dripGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#4285f4', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#1a73e8', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              {/* Main wavy top edge */}
              <path
                d="M 0,60 Q 125,20 250,50 T 500,40 T 750,55 T 1000,45 L 1000,200 L 0,200 Z"
                fill="rgba(255,255,255,0.08)"
              />
              {/* Drips */}
              <ellipse cx="150" cy="55" rx="25" ry="40" fill="url(#dripGradient)" opacity="0.6" />
              <ellipse cx="350" cy="50" rx="30" ry="50" fill="url(#dripGradient)" opacity="0.5" />
              <ellipse cx="550" cy="42" rx="28" ry="45" fill="url(#dripGradient)" opacity="0.6" />
              <ellipse cx="750" cy="58" rx="32" ry="48" fill="url(#dripGradient)" opacity="0.5" />
              <ellipse cx="900" cy="50" rx="26" ry="42" fill="url(#dripGradient)" opacity="0.6" />
            </svg>

            {/* Left Content */}
            <div style={{
              position: 'absolute',
              left: '80px',
              top: '140px',
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
              zIndex: 10,
            }}>
              {menuItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize: '48px',
                    fontWeight: '700',
                    fontFamily: "'Space Mono', monospace",
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    lineHeight: '1.1',
                    display: 'inline-block',
                    animation: `menuItemSlideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textShadow = '0 0 30px rgba(255, 255, 255, 0.5)';
                    e.currentTarget.style.transform = 'translateX(20px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textShadow = 'none';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {item.label} →
                </Link>
              ))}
            </div>

            {/* Right Visual Elements */}
            <div style={{
              position: 'absolute',
              right: '80px',
              top: '140px',
              fontSize: '120px',
              opacity: 0.3,
              display: 'flex',
              alignItems: 'center',
              height: '400px',
              gap: '60px',
              zIndex: 10,
            }}>
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
