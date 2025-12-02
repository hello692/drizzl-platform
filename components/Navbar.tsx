import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../lib/auth';

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      borderBottom: '1px solid #eee',
      background: 'white',
    }}>
      <Link href="/" style={{ fontSize: '20px', fontWeight: 'bold', textDecoration: 'none', color: '#111' }}>
        Drizzl Store
      </Link>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link href="/products" style={{ textDecoration: 'none', color: '#555' }}>
          Shop
        </Link>
        <Link href="/cart" style={{ textDecoration: 'none', color: '#555' }}>
          Cart
        </Link>

        {loading ? (
          <span style={{ color: '#999' }}>Loading...</span>
        ) : user ? (
          <>
            <span style={{ color: '#555', fontSize: '14px' }}>
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              style={{
                padding: '8px 16px',
                background: '#111',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <Link href="/auth" style={{
            padding: '8px 16px',
            background: '#111',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
          }}>
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
