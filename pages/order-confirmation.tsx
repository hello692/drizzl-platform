import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function OrderConfirmation() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '24px',
          }}>
            ✓
          </div>
          <h1 style={{ marginBottom: '16px' }}>Order Confirmed</h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
            Thank you for your purchase! Your order has been received and will be processed shortly.
          </p>

          <div style={{
            background: '#f9f9f9',
            border: '1px solid #e8e8e8',
            borderRadius: '4px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left',
          }}>
            <p style={{ margin: '0 0 12px 0', color: '#999', fontSize: '14px' }}>ORDER NUMBER</p>
            <p style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600' }}>#DW-2024-001234</p>

            <p style={{ margin: '0 0 12px 0', color: '#999', fontSize: '14px' }}>ESTIMATED DELIVERY</p>
            <p style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: '600' }}>January 15-17, 2024</p>

            <p style={{ margin: '0 0 12px 0', color: '#999', fontSize: '14px' }}>TOTAL</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>$59.99</p>
          </div>

          <p style={{ fontSize: '14px', color: '#666', marginBottom: '32px' }}>
            A confirmation email has been sent to your inbox. You can track your order in your account.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/orders" style={{
              padding: '14px 32px',
              background: '#000',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: '600',
            }}>
              Track Order
            </Link>
            <Link href="/products" style={{
              padding: '14px 32px',
              background: '#f9f9f9',
              color: '#000',
              textDecoration: 'none',
              border: '1px solid #e8e8e8',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: '600',
            }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
