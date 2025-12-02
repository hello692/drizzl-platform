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
    // TODO: Implement search functionality
    console.log('Search:', searchQuery);
  };

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #f0f0f0',
      padding: '16px 40px',
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
              placeholder="Search smoothies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                background: '#fafafa',
              }}
            />
          </form>
          <button style={{
            padding: '10px 16px',
            border: 'none',
            background: 'white',
            color: '#555',
            cursor: 'pointer',
            fontSize: '14px',
            whiteSpace: 'nowrap',
          }}>
            Find in stores
          </button>
        </div>

        {/* Center: Logo */}
        <Link href="/" style={{
          fontSize: '20px',
          fontWeight: '700',
          textDecoration: 'none',
          color: '#111',
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
            <span style={{ color: '#999', fontSize: '14px' }}>Loading...</span>
          ) : user ? (
            <>
              <button
                onClick={handleSignOut}
                style={{
                  padding: '8px 0',
                  background: 'none',
                  border: 'none',
                  color: '#555',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textDecoration: 'underline',
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/auth" style={{
              padding: '8px 0',
              background: 'none',
              color: '#555',
              textDecoration: 'underline',
              fontSize: '14px',
            }}>
              Log in
            </Link>
          )}
          <Link href="/cart" style={{
            padding: '8px 16px',
            background: '#111',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
          }}>
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}
