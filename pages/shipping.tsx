import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

const SHIPPING_INFO = [
  { title: 'Standard Shipping', description: '3-5 business days', price: '$5.99 (Free on orders $75+)' },
  { title: 'Express Shipping', description: '2-3 business days', price: '$12.99' },
  { title: 'Overnight Shipping', description: 'Next business day', price: '$24.99' },
];

export default function Shipping() {
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
            <div style={{ marginBottom: 'clamp(32px, 5vw, 48px)' }}>
              <span style={{
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                SUPPORT
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Shipping & Returns
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
              }}>
                No stress, just smoothies
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: 500,
                color: '#ffffff',
                marginBottom: '20px',
              }}>
                Shipping Options
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {SHIPPING_INFO.map((option) => (
                  <div 
                    key={option.title}
                    style={{
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '14px',
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: 'var(--fs-body)', fontWeight: 500, color: '#ffffff', marginBottom: '4px' }}>
                        {option.title}
                      </h3>
                      <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)' }}>
                        {option.description}
                      </p>
                    </div>
                    <span style={{ fontSize: 'var(--fs-body)', fontWeight: 500, color: '#ffffff' }}>
                      {option.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={150}>
            <div style={{
              background: '#0a0a0a',
              borderRadius: '14px',
              padding: '32px',
              marginBottom: '48px',
            }}>
              <h2 style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: 500,
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Returns & Exchanges
              </h2>
              <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                <p style={{ marginBottom: '16px' }}>
                  We want you to love your smoothies. If you're not completely satisfied, we'll make it right.
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '8px' }}>Returns accepted within 30 days of delivery</li>
                  <li style={{ marginBottom: '8px' }}>Products must be unopened and in original packaging</li>
                  <li style={{ marginBottom: '8px' }}>We cover return shipping for defective products</li>
                  <li style={{ marginBottom: '8px' }}>Refunds processed within 5-7 business days</li>
                </ul>
                <p>
                  For quality issues with your order, please contact us within 48 hours of delivery for a full replacement.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={200}>
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
                marginBottom: '20px',
              }}>
                Have questions about your order?
              </p>
              <Link
                href="/contact"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  background: '#ffffff',
                  color: '#000000',
                  borderRadius: '50px',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
