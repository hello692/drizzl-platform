import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function StudentDiscount() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '24px' }}>Student & Educator Discount</h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '32px' }}>
            Get 15% off all purchases with a valid student or educator ID.
          </p>
          <button style={{
            padding: '14px 40px',
            background: '#000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
            Verify Now
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
