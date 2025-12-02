import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function CheckoutSuccess() {
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
        <div style={{
          background: '#e6ffed',
          color: '#126b34',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '48px',
        }}>
          ✓
        </div>
        <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>
          Order Confirmed!
        </h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px', maxWidth: '600px' }}>
          Thank you for your purchase. You'll receive an email confirmation shortly with your order details and tracking information.
        </p>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/" style={{
            padding: '12px 32px',
            background: '#111',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
          }}>
            Home
          </Link>
          <Link href="/products" style={{
            padding: '12px 32px',
            background: 'white',
            color: '#111',
            border: '1px solid #111',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
          }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}
