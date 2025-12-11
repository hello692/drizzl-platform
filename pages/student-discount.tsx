import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

const BENEFITS = [
  { title: '15% Off Every Order', description: 'Student discount applied automatically at checkout.' },
  { title: 'Free Shipping', description: 'On all orders over $50.' },
  { title: 'Exclusive Drops', description: 'Early access to new flavors and limited editions.' },
];

export default function StudentDiscount() {
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
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 80px)' }}>
              <span style={{
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                STUDENT PERKS
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                15% Off for Students
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '480px',
                margin: '0 auto',
              }}>
                Fuel your studies with the good stuff. Students and educators get exclusive savings.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '16px',
              marginBottom: '48px',
            }}>
              {BENEFITS.map((benefit, index) => (
                <div 
                  key={benefit.title}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px',
                    padding: '24px 20px',
                    textAlign: 'center',
                  }}
                >
                  <h3 style={{
                    fontSize: 'var(--fs-body)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}>
                    {benefit.title}
                  </h3>
                  <p style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--color-text-tertiary)',
                    lineHeight: 1.5,
                  }}>
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={150}>
            <div style={{
              background: '#0a0a0a',
              borderRadius: '14px',
              padding: '40px',
              textAlign: 'center',
            }}>
              <h2 style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: 500,
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                How to Get Your Discount
              </h2>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
                marginBottom: '24px',
                maxWidth: '400px',
                margin: '0 auto 24px',
              }}>
                Verify your student or educator status through SheerID. It only takes a minute.
              </p>
              <button
                style={{
                  display: 'inline-block',
                  padding: '16px 40px',
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Verify Now
              </button>
              <p style={{
                fontSize: 'var(--fs-small)',
                color: 'var(--color-text-tertiary)',
                marginTop: '16px',
              }}>
                Works with .edu emails and valid student IDs
              </p>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
