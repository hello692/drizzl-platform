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
    }, 30);

    return () => clearInterval(interval);
  }, [label]);

  return (
    <Link
      href={href}
      style={{
        fontSize: '28px',
        fontWeight: '700',
        fontFamily: "'Space Mono', monospace",
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: '#1a1a1a',
        textDecoration: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'block',
        minHeight: '40px',
        animation: `slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s both`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#d4af00';
        e.currentTarget.style.textShadow = '0 0 15px rgba(212, 175, 0, 0.4)';
        e.currentTarget.style.transform = 'translateX(12px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#1a1a1a';
        e.currentTarget.style.textShadow = 'none';
        e.currentTarget.style.transform = 'translateX(0)';
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
        <div
          style={{
            position: 'fixed',
            top: 60,
            left: 0,
            right: 0,
            width: '100%',
            background: '#f0ed7f',
            zIndex: 99,
            animation: 'dropdownSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            overflow: 'visible',
          }}
        >
          <svg style={{ position: 'absolute', top: '-40px', left: 0, right: 0, width: '100%', height: '60px' }} viewBox="0 0 1000 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="dropGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f0ed7f" stopOpacity="1" />
                <stop offset="100%" stopColor="#f0ed7f" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <path d="M 0,30 Q 50,5 100,25 T 200,20 Q 250,0 300,25 T 400,15 Q 450,0 500,30 T 600,20 Q 650,0 700,25 T 800,15 Q 850,0 900,25 T 1000,20 L 1000,60 L 0,60 Z" fill="url(#dropGradient)" />
            <path d="M 100,25 Q 95,40 100,55" stroke="#f0ed7f" strokeWidth="8" fill="none" opacity="0.6" />
            <path d="M 350,25 Q 345,42 350,58" stroke="#f0ed7f" strokeWidth="8" fill="none" opacity="0.5" />
            <path d="M 550,30 Q 545,45 550,60" stroke="#f0ed7f" strokeWidth="8" fill="none" opacity="0.6" />
            <path d="M 750,25 Q 745,42 750,58" stroke="#f0ed7f" strokeWidth="8" fill="none" opacity="0.5" />
            <path d="M 900,25 Q 895,40 900,55" stroke="#f0ed7f" strokeWidth="8" fill="none" opacity="0.6" />
          </svg>

          <div style={{
            maxWidth: '1320px',
            margin: '0 auto',
            padding: '40px 60px 60px 60px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '40px 80px',
          }}>
            {menuItems.map((item, index) => (
              <AnimatedMenuItem key={item.href} label={item.label} href={item.href} index={index} />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
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
