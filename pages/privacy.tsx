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
                THE BORING (BUT IMPORTANT) STUFF
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Our Privacy Promise
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
                <p style={{ marginBottom: '16px' }}>
                  At Drizzl Wellness, your trust is everything. We're committed to protecting your privacy, and this policy explains how we handle your information when you visit our site or buy our products. We believe in transparency, so let's get into it.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={150}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  What We Collect
                </h2>
                <p style={{ marginBottom: '16px' }}>
                  To make your experience seamless, we collect information you give us directly. This happens when you create an account, place an order, sign up for emails, or reach out for help. This includes:
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '8px' }}>Your name and contact details</li>
                  <li style={{ marginBottom: '8px' }}>Billing and shipping information</li>
                  <li style={{ marginBottom: '8px' }}>Payment details</li>
                  <li style={{ marginBottom: '8px' }}>Your order history and product preferences</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={200}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  How We Use It
                </h2>
                <p style={{ marginBottom: '16px' }}>
                  We use your information to make things run smoothly. Specifically, we use it to:
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '8px' }}>Process and ship your orders.</li>
                  <li style={{ marginBottom: '8px' }}>Keep you updated on your orders and account status.</li>
                  <li style={{ marginBottom: '8px' }}>Send you promotional emails (only if you say yes).</li>
                  <li style={{ marginBottom: '8px' }}>Make our products and services even better.</li>
                  <li style={{ marginBottom: '8px' }}>Meet our legal requirements.</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={250}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  Keeping Your Data Safe
                </h2>
                <p>
                  Your privacy is not a small thing to us. We use strong technical and organizational measures to protect your personal information from being accessed, altered, or shared without permission.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={300}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  Questions?
                </h2>
                <p>
                  If you have any questions about this policy or your privacy, please get in touch with us at{' '}
                  <a href="mailto:hello@drizzlwellness.com" style={{ color: '#ffffff', textDecoration: 'underline' }}>
                    hello@drizzlwellness.com
                  </a>.
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
