import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Refer() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>Refer a Friend</h1>

          <div style={{
            background: '#f9f9f9',
            border: '1px solid #e8e8e8',
            borderRadius: '4px',
            padding: '40px',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Share the Love</h2>
            <p style={{ marginBottom: '24px' }}>
              Refer a friend and both of you get $10 off your next order when they complete their first purchase.
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>
              Sign in to your account to get your unique referral link.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
