import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AnimatedSection } from '../../components/ScrollAnimations';

const BENEFITS = [
  { title: 'Competitive Margins', description: 'Attractive wholesale pricing designed to maximize your profit potential.' },
  { title: 'Reliable Delivery', description: 'Consistent, on-time delivery to keep your shelves stocked.' },
  { title: 'Marketing Support', description: 'Free POS materials, samples, and co-marketing opportunities.' },
  { title: 'Dedicated Rep', description: 'Personal account manager for all your partnership needs.' },
  { title: 'Training & Support', description: 'Staff training and product knowledge sessions.' },
  { title: 'Exclusive Products', description: 'Access to partner-only SKUs and limited editions.' },
];

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', href: '/wholesale' },
  { id: 'pricing', label: 'Pricing', href: '/wholesale/pricing' },
  { id: 'apply', label: 'Apply', href: '/wholesale/apply', isCta: true },
  { id: 'signin', label: 'Sign In', href: '/wholesale/signin' },
];

export default function Wholesale() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      
      <nav style={{
        position: 'sticky',
        top: '72px',
        zIndex: 100,
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 48px)',
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          <span style={{
            fontSize: 'var(--fs-body)',
            fontWeight: 500,
            color: '#ffffff',
            whiteSpace: 'nowrap',
            padding: '16px 0',
          }}>
            Wholesale
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {NAV_ITEMS.map((item) => (
              item.isCta ? (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    background: '#00FF85',
                    color: '#000000',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    fontSize: 'var(--fs-small)',
                    fontWeight: 500,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    background: 'none',
                    padding: '16px 16px',
                    fontSize: 'var(--fs-small)',
                    fontWeight: 400,
                    color: router.pathname === item.href ? '#ffffff' : 'rgba(255,255,255,0.5)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    borderBottom: router.pathname === item.href ? '2px solid #ffffff' : '2px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </div>
      </nav>

      <main style={{ background: '#000000', minHeight: '100vh' }}>
        
        <section style={{
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ marginBottom: 'clamp(32px, 5vw, 48px)' }}>
              <Link 
                href="/wholesale/signin"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: 'var(--fs-small)',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  marginBottom: '24px',
                  transition: 'color 0.2s ease',
                }}
              >
                Already a partner? Sign In →
              </Link>
              
              <span style={{
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                PARTNER WITH US
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Partner With Drizzl Wellness
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
              }}>
                Join the Drizzl family and bring wellness to your customers. We make it easy to succeed together.
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '16px',
            marginBottom: '48px',
          }}>
            {BENEFITS.map((benefit, index) => (
              <AnimatedSection key={benefit.title} animation="fadeUp" delay={index * 80}>
                <div style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '24px 20px',
                }}>
                  <h3 style={{
                    fontSize: 'var(--fs-h4)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}>
                    {benefit.title}
                  </h3>
                  <p style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--color-text-tertiary)',
                    lineHeight: 1.6,
                  }}>
                    {benefit.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="fadeUp" delay={500}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link
                href="/wholesale/apply"
                style={{
                  padding: '16px 32px',
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Apply Now
              </Link>
              <Link
                href="/wholesale/pricing"
                style={{
                  padding: '16px 32px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50px',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                View Pricing
              </Link>
            </div>
          </AnimatedSection>
        </section>

        <section style={{
          background: '#0a0a0a',
          padding: 'clamp(60px, 8vw, 80px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeUp">
              <div style={{ textAlign: 'center' }}>
                <span style={{
                  fontSize: 'var(--fs-label)',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-tertiary)',
                  marginBottom: '12px',
                  display: 'block',
                }}>
                  GET IN TOUCH
                </span>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  fontWeight: 300,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '24px',
                }}>
                  Contact Our Wholesale Team
                </h2>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <a 
                    href="mailto:wholesale@drizzlwellness.com"
                    style={{
                      fontSize: 'var(--fs-body)',
                      fontWeight: 400,
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    wholesale@drizzlwellness.com
                  </a>
                  <a 
                    href="tel:1-800-DRIZZL-1"
                    style={{
                      fontSize: 'var(--fs-body)',
                      fontWeight: 400,
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    1-800-DRIZZL-1
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
