import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

const STEPS = [
  { step: '1', title: 'Share Your Link', description: 'Get your unique referral link from your account dashboard.' },
  { step: '2', title: 'Friend Orders', description: 'Your friend places their first order using your link.' },
  { step: '3', title: 'You Both Save', description: 'You get $10 off, they get $10 off. Everybody wins.' },
];

export default function Refer() {
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
                REFERRAL PROGRAM
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Give $10, Get $10
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '480px',
                margin: '0 auto',
              }}>
                Share the love of wellness and you both save.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              marginBottom: '48px',
            }}>
              {STEPS.map((step, index) => (
                <div key={step.step} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: 'var(--fs-body)',
                    fontWeight: 500,
                    color: '#ffffff',
                  }}>
                    {step.step}
                  </div>
                  <h3 style={{
                    fontSize: 'var(--fs-body)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--color-text-tertiary)',
                    lineHeight: 1.5,
                  }}>
                    {step.description}
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
                Ready to Start Sharing?
              </h2>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
                marginBottom: '24px',
              }}>
                Sign in to your account to get your unique referral link.
              </p>
              <Link
                href="/auth"
                style={{
                  display: 'inline-block',
                  padding: '16px 40px',
                  background: '#ffffff',
                  color: '#000000',
                  borderRadius: '50px',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
