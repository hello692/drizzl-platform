import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '32px' }}>Terms of Service</h1>
          <div style={{ lineHeight: '1.8', color: '#666' }}>
            <h3 style={{ color: '#000' }}>Agreement to Terms</h3>
            <p>By accessing and using Drizzl Wellness, you accept and agree to be bound by the terms and provision of this agreement.</p>
            
            <h3 style={{ color: '#000', marginTop: '24px' }}>Use License</h3>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on Drizzl Wellness for personal, non-commercial transitory viewing only.</p>
            
            <h3 style={{ color: '#000', marginTop: '24px' }}>Disclaimer</h3>
            <p>The materials on Drizzl Wellness are provided on an 'as is' basis. Drizzl Wellness makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose.</p>

            <p style={{ marginTop: '24px', fontSize: '14px', color: '#999' }}>
              Last updated: January 2024
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
