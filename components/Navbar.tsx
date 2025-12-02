import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../lib/auth';

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  };

  return (
    <>
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
            <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 0 }}>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: '#ffffff',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#999'}
                onBlur={(e) => e.target.style.borderColor = '#e8e8e8'}
              />
            </form>
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
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Drizzl Wellness
          </Link>

          {/* Right: Login + Cart */}
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '24px',
          }}>
            {loading ? (
              <span style={{ color: '#999', fontSize: '14px' }}>...</span>
            ) : user ? (
              <button
                onClick={handleSignOut}
                style={{
                  padding: 0,
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '400',
                }}
              >
                Sign out
              </button>
            ) : (
              <Link href="/auth" style={{
                color: '#666',
                fontSize: '14px',
                fontWeight: '400',
              }}>
                Log in
              </Link>
            )}
            <Link href="/cart" style={{
              fontSize: '14px',
              fontWeight: '400',
              color: '#666',
            }}>
              Your cart (0)
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          background: 'white',
          borderBottom: '1px solid #e8e8e8',
          padding: '20px 40px',
          display: 'none',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 999,
        }}>
          <Link href="/auth">Log in</Link>
          <Link href="/cart">Your cart</Link>
        </div>
      )}
    </>
  );
}
