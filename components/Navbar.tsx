import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../lib/auth';

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #f0f0f0',
      padding: '20px 40px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '40px',
      }}>
        {/* Left: Search + Find in Stores */}
        <div style={{
          flex: 1,
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
        }}>
          <form onSubmit={handleSearch} style={{
            flex: 1,
            position: 'relative',
          }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                background: '#f9fafb',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#22c55e';
                e.target.style.background = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = '#f9fafb';
              }}
            />
          </form>
          <button style={{
            padding: '10px 16px',
            border: 'none',
            background: 'white',
            color: '#6b7280',
            cursor: 'pointer',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            fontWeight: '500',
          }}>
            Find in stores
          </button>
        </div>

        {/* Center: Logo */}
        <Link href="/" style={{
          fontSize: '20px',
          fontWeight: '700',
          textDecoration: 'none',
          color: '#15803d',
          letterSpacing: '-0.5px',
          textTransform: 'capitalize',
        }} className="logo">
          Drizzl
        </Link>

        {/* Right: Login + Cart */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '20px',
        }}>
          {loading ? (
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>Loading...</span>
          ) : user ? (
            <>
              <button
                onClick={handleSignOut}
                style={{
                  padding: '8px 0',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/auth" style={{
              padding: '8px 0',
              background: 'none',
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
            }}>
              Log in
            </Link>
          )}
          <Link href="/cart" style={{
            padding: '10px 20px',
            background: '#22c55e',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background 0.2s',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#22c55e'}
          >
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}
