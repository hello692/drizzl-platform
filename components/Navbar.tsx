import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid #e8e8e8',
      padding: '16px 40px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
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
          gap: '24px',
          alignItems: 'center',
          flex: 0,
        }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
            <span style={{ fontSize: '16px' }}>🔍</span>
            <span style={{ fontSize: '13px', color: '#666', cursor: 'pointer' }}>Search</span>
          </div>

          {/* Find in stores */}
          <button style={{
            padding: '0',
            border: 'none',
            background: 'none',
            color: '#666',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span style={{ fontSize: '14px' }}>📍</span>
            Find in stores
          </button>
        </div>

        {/* Center: Logo */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Link href="/" style={{
            fontSize: '12px',
            fontWeight: '700',
            textDecoration: 'none',
            color: '#000',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            DRIZZL WELLNESS
          </Link>
        </div>

        {/* Right: Login + Cart */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          flex: 0,
        }}>
          <Link href="/auth" style={{
            color: '#666',
            fontSize: '13px',
            fontWeight: '400',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{ fontSize: '16px' }}>👤</span>
            Log in
          </Link>
          <Link href="/cart" style={{
            fontSize: '13px',
            fontWeight: '400',
            color: '#666',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{ fontSize: '16px' }}>🛒</span>
            Your cart (0)
          </Link>
        </div>
      </div>
    </nav>
  );
}
