import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid #e0e0e0',
      padding: '18px 60px',
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
          gap: '40px',
          alignItems: 'center',
          flex: 0,
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#555',
            cursor: 'pointer',
            opacity: 0.8,
            transition: 'opacity 0.2s ease-out'
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}>
            <span style={{ fontSize: '16px' }}>🔍</span>
            <span style={{ fontSize: '13px', fontWeight: '400' }}>Search</span>
          </div>

          <button style={{
            padding: '0',
            border: 'none',
            background: 'none',
            color: '#555',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: 0.8,
            transition: 'opacity 0.2s ease-out'
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}>
            <span style={{ fontSize: '14px' }}>📍</span>
            Find in stores
          </button>
        </div>

        {/* Center: Logo */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Link href="/" style={{
            fontSize: '11px',
            fontWeight: '700',
            textDecoration: 'none',
            color: '#000',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s ease-out',
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
            DRIZZL WELLNESS
          </Link>
        </div>

        {/* Right: Login + Cart */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
          flex: 0,
        }}>
          <Link href="/auth" style={{
            color: '#555',
            fontSize: '13px',
            fontWeight: '400',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: 0.8,
            transition: 'opacity 0.2s ease-out'
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}>
            <span style={{ fontSize: '16px' }}>👤</span>
            Log in
          </Link>
          <Link href="/cart" style={{
            fontSize: '13px',
            fontWeight: '400',
            color: '#555',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: 0.8,
            transition: 'opacity 0.2s ease-out'
          }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}>
            <span style={{ fontSize: '16px' }}>🛒</span>
            Your cart (0)
          </Link>
        </div>
      </div>
    </nav>
  );
}
