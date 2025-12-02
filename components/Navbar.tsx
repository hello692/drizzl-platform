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
    { label: 'Smoothies', href: '/products/smoothies', description: 'Frozen blends crafted with superfoods' },
    { label: 'High Protein', href: '/products/high-protein', description: 'Maximum nutrition for active lifestyles' },
    { label: 'Bowls', href: '/products/bowls', description: 'Nutrient-dense breakfast bowls' },
    { label: 'Bites', href: '/products/bites', description: 'Convenient snacks on the go' },
    { label: 'Protein Shop', href: '/products/protein', description: 'Premium protein supplements' },
    { label: 'Gift Guide', href: '/products/gift', description: 'Perfect gifts for wellness lovers' },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="glass" style={{
      background: 'rgba(255, 255, 255, 0.85)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
      padding: '14px 60px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
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
          {/* Search */}
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

          {/* Find in stores */}
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

        {/* Right: Login + Cart */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flex: 0,
          position: 'relative',
        }}>
          {/* Login */}
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
            <div style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
            }}>
              <UserIcon />
            </div>
            Log in
          </Link>

          {/* Retail Partner Login */}
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
            <div style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
            }}>
              <BriefcaseIcon />
            </div>
            Partner Login
          </Link>

          {/* Cart */}
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
            <div style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
            }}>
              <CartIcon />
            </div>
            <span>Cart (0)</span>
          </Link>

          {/* Hamburger Menu - Desktop & Mobile */}
          <button
            className="hamburger-icon-2100"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              marginLeft: '8px',
            }}
            title="Menu"
          >
            <div className="hamburger-line" style={{
              transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'rotate(0) translateY(0)',
            }}></div>
            <div className="hamburger-line" style={{
              opacity: menuOpen ? 0 : 1,
            }}></div>
            <div className="hamburger-line" style={{
              transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'rotate(0) translateY(0)',
            }}></div>
          </button>

          {/* Full-Screen Menu Overlay & Dropdown */}
          {menuOpen && (
            <>
              {/* Overlay */}
              <div
                className="menu-overlay-2100"
                onClick={closeMenu}
                style={{ position: 'fixed' }}
              ></div>

              {/* Full-Screen Dropdown Menu */}
              <div className="menu-dropdown-2100">
                <div className="menu-grid-2100">
                  {menuItems.map((item, index) => (
                    <div
                      key={item.href}
                      className="menu-item-2100"
                      style={{
                        animation: `menuItemSlideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${
                          index * 0.08
                        }s both`,
                      }}
                    >
                      <Link href={item.href} onClick={closeMenu}>
                        {item.label}
                      </Link>
                      <p className="menu-description">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
