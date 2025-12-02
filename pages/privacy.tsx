import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '32px' }}>Privacy Policy</h1>
          <div style={{ lineHeight: '1.8', color: '#666' }}>
            <h3 style={{ color: '#000' }}>Introduction</h3>
            <p>At Drizzl Wellness, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.</p>
            
            <h3 style={{ color: '#000', marginTop: '24px' }}>Information We Collect</h3>
            <p>We collect information you provide directly, such as when you create an account, make a purchase, or contact us for support.</p>
            
            <h3 style={{ color: '#000', marginTop: '24px' }}>How We Use Your Information</h3>
            <p>We use your information to provide, maintain, and improve our services, process transactions, and send you updates.</p>

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
