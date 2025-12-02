import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid #e8e8e8',
      padding: '20px 40px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '60px',
      }}>
        {/* Left: Search + Find in stores */}
        <div style={{
          flex: 1,
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          minWidth: 0,
        }}>
          <input
            type="text"
            placeholder="Search"
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #e8e8e8',
              borderRadius: '4px',
              fontSize: '14px',
              background: '#ffffff',
            }}
          />
          <button style={{
            padding: '10px 0',
            border: 'none',
            background: 'none',
            color: '#666',
            cursor: 'pointer',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            fontWeight: '400',
          }}>
            Find in stores
          </button>
        </div>

        {/* Center: Logo */}
        <Link href="/" style={{
          fontSize: '14px',
          fontWeight: '600',
          textDecoration: 'none',
          color: '#1a1a1a',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          DRIZZL WELLNESS
        </Link>

        {/* Right: Login + Cart */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '24px',
        }}>
          <Link href="/auth" style={{
            color: '#666',
            fontSize: '14px',
            fontWeight: '400',
            textDecoration: 'none',
          }}>
            Log in
          </Link>
          <Link href="/cart" style={{
            fontSize: '14px',
            fontWeight: '400',
            color: '#666',
            textDecoration: 'none',
          }}>
            Your cart (0)
          </Link>
        </div>
      </div>
    </nav>
  );
}
