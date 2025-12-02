import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid #e0e0e0',
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
      }}>
        {/* Left: Search + Find in stores */}
        <div style={{
          display: 'flex',
          gap: '48px',
          alignItems: 'center',
          flex: 0,
        }}>
          {/* Search */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            color: '#000',
            cursor: 'pointer',
            opacity: 0.85,
            transition: 'all 0.2s ease-out'
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}>
            <div style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '600',
            }}>
              ⌕
            </div>
            <span style={{ fontSize: '14px', fontWeight: '500', letterSpacing: '-0.1px' }}>Search</span>
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
            gap: '10px',
            opacity: 0.85,
            transition: 'all 0.2s ease-out',
            letterSpacing: '-0.1px'
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}>
            <div style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '600',
            }}>
              ◎
            </div>
            Find in stores
          </button>
        </div>

        {/* Center: Logo */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Link href="/" style={{
            fontSize: '13px',
            fontWeight: '800',
            textDecoration: 'none',
            color: '#000',
            letterSpacing: '-0.3px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease-out',
            fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
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
          gap: '48px',
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
            gap: '10px',
            opacity: 0.85,
            transition: 'all 0.2s ease-out',
            letterSpacing: '-0.1px'
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}>
            <div style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '600',
            }}>
              ◈
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
            gap: '10px',
            opacity: 0.85,
            transition: 'all 0.2s ease-out',
            letterSpacing: '-0.1px'
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}>
            <div style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '600',
            }}>
              ◆
            </div>
            <span>Your cart (0)</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
