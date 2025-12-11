import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

const POSITIONS = [
  { title: 'Production Manager', location: 'Los Angeles, CA', type: 'Full-time' },
  { title: 'Marketing Coordinator', location: 'Remote', type: 'Full-time' },
  { title: 'Customer Experience Lead', location: 'Remote', type: 'Full-time' },
];

const VALUES = [
  { title: 'Passion for Wellness', description: 'We live and breathe healthy living.' },
  { title: 'Innovation', description: 'Always pushing boundaries in flavor and nutrition.' },
  { title: 'Teamwork', description: 'We succeed together, learn together, grow together.' },
  { title: 'Fun', description: 'Life is too short for boring work. Let\'s have fun.' },
];

export default function Careers() {
  return (
    <>
      <Navbar />
      
      <main style={{ background: '#000000', minHeight: '100vh', paddingTop: '120px' }}>
        <section style={{
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
          maxWidth: '900px',
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
                CAREERS
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Blend Your Talents Here
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '480px',
                margin: '0 auto',
              }}>
                Join a team that's passionate about making wellness delicious.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: 500,
                color: '#ffffff',
                marginBottom: '24px',
              }}>
                Open Positions
              </h2>
              {POSITIONS.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {POSITIONS.map((position) => (
                    <div 
                      key={position.title}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '14px',
                        padding: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: 'var(--fs-body)', fontWeight: 500, color: '#ffffff', marginBottom: '4px' }}>
                          {position.title}
                        </h3>
                        <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)' }}>
                          {position.location} · {position.type}
                        </p>
                      </div>
                      <Link
                        href="/contact"
                        style={{
                          padding: '10px 20px',
                          background: 'transparent',
                          color: '#ffffff',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '50px',
                          fontSize: 'var(--fs-small)',
                          fontWeight: 500,
                          textDecoration: 'none',
                        }}
                      >
                        Apply
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '48px',
                  textAlign: 'center',
                }}>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    No open positions at this time. Check back soon.
                  </p>
                </div>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={150}>
            <div style={{
              background: '#0a0a0a',
              borderRadius: '14px',
              padding: '32px',
            }}>
              <h2 style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: 500,
                color: '#ffffff',
                marginBottom: '24px',
              }}>
                What We Value
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
              }}>
                {VALUES.map((value) => (
                  <div key={value.title}>
                    <h3 style={{ fontSize: 'var(--fs-body)', fontWeight: 500, color: '#ffffff', marginBottom: '8px' }}>
                      {value.title}
                    </h3>
                    <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)', lineHeight: 1.5 }}>
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
