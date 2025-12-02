import Link from 'next/link';

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
      background: 'rgba(255, 255, 255, 0.99)',
      borderBottom: '1px solid #e8e8e8',
      padding: '14px 60px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(12px)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
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
        {/* Left: Find in stores */}
        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          flex: 0,
        }}>
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
          <Link href="/" style={{
            fontSize: '32px',
            fontWeight: '800',
            textDecoration: 'none',
            color: '#000',
            letterSpacing: '-1px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
            lineHeight: '1',
          }} onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.6';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}>
            DRIZZL WELLNESS
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
        </div>
      </div>
    </nav>
  );
}
