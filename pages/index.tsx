import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <div style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 16px 0' }}>
          Welcome to Drizzl
        </h1>
        <p style={{ fontSize: '18px', color: '#666', margin: '0 0 32px 0', maxWidth: '600px' }}>
          Premium direct-to-consumer products delivered to your door.
        </p>

        <Link href="/products" style={{
          padding: '12px 32px',
          background: '#111',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
        }}>
          Start Shopping
        </Link>
      </div>
    </>
  );
}
