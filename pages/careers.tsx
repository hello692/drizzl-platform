import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Careers() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>Careers</h1>

          <div style={{
            background: '#f9f9f9',
            border: '1px solid #e8e8e8',
            borderRadius: '4px',
            padding: '40px',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Join Our Team</h2>
            <p style={{ marginBottom: '24px' }}>
              We're always looking for passionate people to join the Drizzl Wellness team.
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>
              Check back soon for open positions.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
