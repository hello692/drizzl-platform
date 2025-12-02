import Link from 'next/link';

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

export default function Navbar() {
  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid #e5e5e5',
      padding: '16px 60px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
    }}>
      <div style={{
        maxWidth: '1400px',
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
            opacity: 0.85,
            transition: 'all 0.2s ease-out',
            whiteSpace: 'nowrap',
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}>
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
            <span style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '-0.3px' }}>Search</span>
          </div>

          {/* Find in stores */}
          <button style={{
            padding: '0',
            border: 'none',
            background: 'none',
            color: '#000',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: 0.85,
            transition: 'all 0.2s ease-out',
            letterSpacing: '-0.3px',
            whiteSpace: 'nowrap',
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}>
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
          <Link href="/" style={{
            textDecoration: 'none',
            color: '#000',
            transition: 'all 0.2s ease-out',
            fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            lineHeight: '1.1',
          }} onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '900',
              letterSpacing: '-1.2px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              DRIZZL
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              maxWidth: '52px',
              textAlign: 'center',
            }}>
              WELLNESS
            </div>
          </Link>
        </div>

        {/* Right: Login + Cart */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flex: 0,
        }}>
          {/* Login */}
          <Link href="/auth" style={{
            color: '#000',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: 0.85,
            transition: 'all 0.2s ease-out',
            letterSpacing: '-0.3px',
            whiteSpace: 'nowrap',
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}>
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

          {/* Cart */}
          <Link href="/cart" style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#000',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: 0.85,
            transition: 'all 0.2s ease-out',
            letterSpacing: '-0.3px',
            whiteSpace: 'nowrap',
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}>
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
        </div>
      </div>
    </nav>
  );
}
