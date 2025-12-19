import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

export default function Sustainability() {
  return (
    <>
      <Navbar />
      
      <main style={{ background: '#000000', minHeight: '100vh', paddingTop: '120px' }}>
        <section style={{
          padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 48px)',
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <AnimatedSection animation="fadeUp">
            <span style={{
              fontSize: 'var(--fs-label)',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)',
              marginBottom: '12px',
              display: 'block',
            }}>
              GOOD FOR YOU, GOOD FOR THE PLANET.
            </span>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '24px',
            }}>
              We believe sexy is sustainable.
            </h1>
            
            <p style={{
              fontSize: 'var(--fs-body)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              maxWidth: '560px',
              margin: '0 auto 48px',
            }}>
              We're obsessed with making you feel good, and that includes feeling good about our impact. We're crafting a commitment to the planet that's as meaningful as our ingredients.
            </p>
            
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 48px',
              fontSize: '32px',
            }}>
              🌱
            </div>
            
            <p style={{
              fontSize: 'var(--fs-body)',
              color: 'var(--color-text-tertiary)',
              lineHeight: 1.7,
              maxWidth: '480px',
              margin: '0 auto 48px',
            }}>
              The details are coming soon. Get ready for a glow-up that goes deeper.
            </p>
            
            <Link 
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#ffffff',
                fontSize: 'var(--fs-body)',
                fontWeight: 500,
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.3)',
                paddingBottom: '4px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Home
            </Link>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
