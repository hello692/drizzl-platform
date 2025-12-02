import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRequireAuth } from '../hooks/useAuth';
import { signOut } from '../lib/auth';
import { useRouter } from 'next/router';

export default function Account() {
  const router = useRouter();
  const { user } = useRequireAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '40px' }}>My Account</h1>

          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
            {/* Sidebar */}
            <div>
              <div style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: '20px', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#999' }}>Email</p>
                <p style={{ margin: 0, fontWeight: '500' }}>{user?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: 'none',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Sign out
              </button>
            </div>

            {/* Main Content */}
            <div>
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Order History</h2>
                <p style={{ color: '#999' }}>Your orders will appear here</p>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Addresses</h2>
                <p style={{ color: '#999' }}>No addresses saved yet</p>
              </div>

              <div>
                <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Payment Methods</h2>
                <p style={{ color: '#999' }}>No payment methods saved yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
