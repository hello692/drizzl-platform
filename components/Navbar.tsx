'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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

const AnimatedMenuItem = ({ label, href, index }: { label: string; href: string; index: number }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= label.length) {
        setDisplayedText(label.substring(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [label]);

  return (
    <Link
      href={href}
      onClick={() => {}}
      style={{
        fontSize: '44px',
        fontWeight: '700',
        fontFamily: "'Space Mono', monospace",
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: '#1a1a1a',
        textDecoration: 'none',
        transition: 'all 0.3s ease-out',
        display: 'block',
        minHeight: '52px',
        animation: `slideDownMenu 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#d4af00';
        e.currentTarget.style.textShadow = '0 0 20px rgba(212, 175, 0, 0.6)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#1a1a1a';
        e.currentTarget.style.textShadow = 'none';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {displayedText}
    </Link>
  );
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Smoothies', href: '/products/smoothies' },
    { label: 'Bowls', href: '/products/bowls' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
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
              <div style={{ width: '24px', height: '2.5px', background: 'linear-gradient(135deg, #000 0%, #d4af00 100%)', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'rotate(0)', boxShadow: '0 0 8px rgba(212, 175, 0, 0.3)' }}></div>
              <div style={{ width: '24px', height: '2.5px', background: 'linear-gradient(135deg, #000 0%, #d4af00 100%)', borderRadius: '2px', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1, boxShadow: '0 0 8px rgba(212, 175, 0, 0.3)' }}></div>
              <div style={{ width: '24px', height: '2.5px', background: 'linear-gradient(135deg, #000 0%, #d4af00 100%)', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'rotate(0)', boxShadow: '0 0 8px rgba(212, 175, 0, 0.3)' }}></div>
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 60,
              left: 0,
              right: 0,
              width: '100%',
              background: '#f0ed7f',
              zIndex: 99,
              animation: 'dropdownOpen 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
            }}
          >
            {/* Dripping SVG at top */}
            <svg 
              style={{ 
                position: 'absolute', 
                top: '-80px', 
                left: 0, 
                right: 0, 
                width: '100%', 
                height: '100px',
                pointerEvents: 'none'
              }} 
              viewBox="0 0 1000 100" 
              preserveAspectRatio="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="dripTop" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f0ed7f" stopOpacity="1" />
                  <stop offset="100%" stopColor="#f0ed7f" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {/* Wavy top */}
              <path d="M 0,40 Q 50,0 100,30 T 200,25 Q 250,0 300,35 T 400,20 Q 450,0 500,40 T 600,25 Q 650,0 700,35 T 800,20 Q 850,0 900,30 T 1000,25 L 1000,100 L 0,100 Z" fill="url(#dripTop)" />
              
              {/* Large hanging drips */}
              <ellipse cx="120" cy="45" rx="14" ry="35" fill="#f0ed7f" opacity="0.9" />
              <path d="M 120,80 Q 115,95 118,105" stroke="#f0ed7f" strokeWidth="10" fill="none" opacity="0.7" strokeLinecap="round" />
              
              <ellipse cx="380" cy="40" rx="16" ry="40" fill="#f0ed7f" opacity="0.85" />
              <path d="M 380,80 Q 375,98 378,110" stroke="#f0ed7f" strokeWidth="11" fill="none" opacity="0.65" strokeLinecap="round" />
              
              <ellipse cx="620" cy="45" rx="15" ry="38" fill="#f0ed7f" opacity="0.9" />
              <path d="M 620,83 Q 615,100 618,112" stroke="#f0ed7f" strokeWidth="10" fill="none" opacity="0.7" strokeLinecap="round" />
              
              <ellipse cx="880" cy="40" rx="14" ry="36" fill="#f0ed7f" opacity="0.85" />
              <path d="M 880,76 Q 875,92 878,105" stroke="#f0ed7f" strokeWidth="10" fill="none" opacity="0.65" strokeLinecap="round" />
            </svg>

            {/* Menu items centered */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '32px', 
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              paddingTop: '60px',
              paddingBottom: '80px',
            }}>
              {menuItems.map((item, index) => (
                <div key={item.href} onClick={() => setMenuOpen(false)}>
                  <AnimatedMenuItem label={item.label} href={item.href} index={index} />
                </div>
              ))}
            </div>

            {/* Dripping SVG at bottom */}
            <svg 
              style={{ 
                position: 'absolute', 
                bottom: '-120px', 
                left: 0, 
                right: 0, 
                width: '100%', 
                height: '140px',
                pointerEvents: 'none'
              }} 
              viewBox="0 0 1000 140" 
              preserveAspectRatio="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="dripBottom" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f0ed7f" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f0ed7f" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Wavy bottom edge */}
              <path d="M 0,20 Q 50,50 100,30 T 200,35 Q 250,55 300,25 T 400,40 Q 450,60 500,20 T 600,35 Q 650,55 700,25 T 800,40 Q 850,60 900,30 T 1000,35 L 1000,0 L 0,0 Z" fill="url(#dripBottom)" />
              
              {/* Large hanging drips from bottom */}
              <ellipse cx="80" cy="28" rx="16" ry="28" fill="#f0ed7f" opacity="0.95" />
              <path d="M 80,56 Q 75,80 78,110 Q 80,130 78,140" stroke="#f0ed7f" strokeWidth="12" fill="none" opacity="0.8" strokeLinecap="round" />
              
              <ellipse cx="250" cy="32" rx="18" ry="32" fill="#f0ed7f" opacity="0.9" />
              <path d="M 250,64 Q 244,92 248,125 Q 250,138 248,145" stroke="#f0ed7f" strokeWidth="13" fill="none" opacity="0.75" strokeLinecap="round" />
              
              <ellipse cx="450" cy="25" rx="17" ry="30" fill="#f0ed7f" opacity="0.95" />
              <path d="M 450,55 Q 444,85 450,120 Q 452,135 450,142" stroke="#f0ed7f" strokeWidth="12" fill="none" opacity="0.8" strokeLinecap="round" />
              
              <ellipse cx="680" cy="30" rx="16" ry="29" fill="#f0ed7f" opacity="0.9" />
              <path d="M 680,59 Q 674,87 680,123 Q 682,137 680,145" stroke="#f0ed7f" strokeWidth="12" fill="none" opacity="0.75" strokeLinecap="round" />
              
              <ellipse cx="900" cy="28" rx="17" ry="31" fill="#f0ed7f" opacity="0.92" />
              <path d="M 900,59 Q 894,88 900,125 Q 902,138 900,142" stroke="#f0ed7f" strokeWidth="12" fill="none" opacity="0.78" strokeLinecap="round" />
              
              {/* Small drips */}
              <circle cx="180" cy="35" r="8" fill="#f0ed7f" opacity="0.7" />
              <path d="M 180,43 Q 177,65 180,95" stroke="#f0ed7f" strokeWidth="7" fill="none" opacity="0.6" strokeLinecap="round" />
              
              <circle cx="550" cy="38" r="9" fill="#f0ed7f" opacity="0.75" />
              <path d="M 550,47 Q 546,72 550,105" stroke="#f0ed7f" strokeWidth="8" fill="none" opacity="0.65" strokeLinecap="round" />
              
              <circle cx="800" cy="35" r="8" fill="#f0ed7f" opacity="0.7" />
              <path d="M 800,43 Q 797,68 800,100" stroke="#f0ed7f" strokeWidth="7" fill="none" opacity="0.6" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}

      <style>{`
        @keyframes dropdownOpen {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDownMenu {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
