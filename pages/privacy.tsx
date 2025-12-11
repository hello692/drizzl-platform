import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AnimatedSection } from '../components/ScrollAnimations';

export default function Privacy() {
  return (
    <>
      <Navbar />
      
      <main style={{ background: '#000000', minHeight: '100vh', paddingTop: '120px' }}>
        <section style={{
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ marginBottom: '48px' }}>
              <span style={{
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                LEGAL
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Privacy Policy
              </h1>
              <p style={{
                fontSize: 'var(--fs-small)',
                color: 'var(--color-text-tertiary)',
              }}>
                Last updated: January 2025
              </p>
            </div>
          </AnimatedSection>

          <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            <AnimatedSection animation="fadeUp" delay={100}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  Introduction
                </h2>
                <p style={{ marginBottom: '16px' }}>
                  At Drizzl Wellness, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={150}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  Information We Collect
                </h2>
                <p style={{ marginBottom: '16px' }}>
                  We collect information you provide directly, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us for support. This may include:
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '8px' }}>Name and contact information</li>
                  <li style={{ marginBottom: '8px' }}>Billing and shipping addresses</li>
                  <li style={{ marginBottom: '8px' }}>Payment information</li>
                  <li style={{ marginBottom: '8px' }}>Order history and preferences</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={200}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  How We Use Your Information
                </h2>
                <p style={{ marginBottom: '16px' }}>
                  We use your information to:
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '8px' }}>Process and fulfill your orders</li>
                  <li style={{ marginBottom: '8px' }}>Communicate with you about your orders and account</li>
                  <li style={{ marginBottom: '8px' }}>Send promotional emails (with your consent)</li>
                  <li style={{ marginBottom: '8px' }}>Improve our products and services</li>
                  <li style={{ marginBottom: '8px' }}>Comply with legal obligations</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={250}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={300}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at privacy@drizzlwellness.com.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
