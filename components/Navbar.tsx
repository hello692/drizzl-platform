import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid #d0d0d0',
      padding: '20px 80px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'nowrap',
      }}>
        {/* Left: Search + Find in stores */}
        <div style={{
          display: 'flex',
          gap: '56px',
          alignItems: 'center',
          flex: 0,
          minWidth: 0,
        }}>
          {/* Search */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            color: '#000',
            cursor: 'pointer',
            opacity: 0.9,
            transition: 'all 0.2s ease-out',
            whiteSpace: 'nowrap',
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}>
            <div style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '700',
            }}>
              🔍
            </div>
            <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.2px' }}>Search</span>
          </div>

          {/* Find in stores */}
          <button style={{
            padding: '0',
            border: 'none',
            background: 'none',
            color: '#000',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: 0.9,
            transition: 'all 0.2s ease-out',
            letterSpacing: '-0.2px',
            whiteSpace: 'nowrap',
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}>
            <div style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '700',
            }}>
              ◎
            </div>
            Find in stores
          </button>
        </div>

        {/* Center: Logo */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
          <Link href="/" style={{
            fontSize: '36px',
            fontWeight: '900',
            textDecoration: 'none',
            color: '#000',
            letterSpacing: '-1px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease-out',
            fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
            lineHeight: '1',
          }} onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
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
          gap: '56px',
          flex: 0,
          minWidth: 0,
        }}>
          {/* Login */}
          <Link href="/auth" style={{
            color: '#000',
            fontSize: '15px',
            fontWeight: '700',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: 0.9,
            transition: 'all 0.2s ease-out',
            letterSpacing: '-0.2px',
            whiteSpace: 'nowrap',
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}>
            <div style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '700',
            }}>
              👤
            </div>
            Log in
          </Link>

          {/* Cart */}
          <Link href="/cart" style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#000',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: 0.9,
            transition: 'all 0.2s ease-out',
            letterSpacing: '-0.2px',
            whiteSpace: 'nowrap',
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}>
            <div style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '700',
            }}>
              🛍️
            </div>
            <span>Your cart (0)</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
