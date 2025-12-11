import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AnimatedSection } from '../../components/ScrollAnimations';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', href: '/wholesale' },
  { id: 'pricing', label: 'Pricing', href: '/wholesale/pricing' },
  { id: 'apply', label: 'Apply', href: '/wholesale/apply', isCta: true },
  { id: 'signin', label: 'Sign In', href: '/wholesale/signin' },
];

const PRICING_TIERS = [
  {
    name: 'Starter',
    units: '50-100 units',
    discount: '30%',
    terms: 'Net 30',
    features: [
      'Standard delivery',
      'Basic POS materials',
      'Email support',
    ],
    isPopular: false,
  },
  {
    name: 'Growth',
    units: '100-500 units',
    discount: '35%',
    terms: 'Net 45',
    features: [
      'Priority delivery',
      'Full marketing kit',
      'Dedicated account rep',
      'Staff training',
    ],
    isPopular: true,
  },
  {
    name: 'Enterprise',
    units: '500+ units',
    discount: '40%',
    terms: 'Net 60',
    features: [
      'Same-day delivery',
      'Custom marketing',
      'Executive support',
      'On-site training',
      'Exclusive products',
    ],
    isPopular: false,
  },
];

const REQUIREMENTS = [
  'Minimum order: 50 units',
  'Valid business license required',
  'Retail/commercial location required',
];

export default function WholesalePricing() {
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
            <div style={{ marginBottom: 'clamp(48px, 6vw, 64px)', textAlign: 'center' }}>
              <span style={{
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                B2B PRICING
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Wholesale Pricing
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
                margin: '0 auto',
              }}>
                Transparent pricing designed for your business success.
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '24px',
            marginBottom: '64px',
          }}>
            {PRICING_TIERS.map((tier, index) => (
              <AnimatedSection key={tier.name} animation="fadeUp" delay={index * 100}>
                <div style={{
                  background: tier.isPopular ? 'rgba(0, 255, 133, 0.05)' : 'transparent',
                  border: tier.isPopular ? '2px solid #00FF85' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '32px 28px',
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {tier.isPopular && (
                    <span style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#00FF85',
                      color: '#000000',
                      padding: '6px 16px',
                      borderRadius: '50px',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}>
                      MOST POPULAR
                    </span>
                  )}
                  
                  <h3 style={{
                    fontSize: 'var(--fs-h3)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: '8px',
                    marginTop: tier.isPopular ? '8px' : '0',
                  }}>
                    {tier.name}
                  </h3>
                  
                  <p style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--color-text-tertiary)',
                    marginBottom: '24px',
                  }}>
                    {tier.units}
                  </p>
                  
                  <div style={{
                    marginBottom: '24px',
                  }}>
                    <span style={{
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                      fontWeight: 300,
                      color: tier.isPopular ? '#00FF85' : '#ffffff',
                      letterSpacing: '-0.02em',
                    }}>
                      {tier.discount}
                    </span>
                    <span style={{
                      fontSize: 'var(--fs-body)',
                      color: 'var(--color-text-secondary)',
                      marginLeft: '8px',
                    }}>
                      off MSRP
                    </span>
                  </div>
                  
                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    marginBottom: '24px',
                  }}>
                    <span style={{
                      fontSize: 'var(--fs-small)',
                      fontWeight: 500,
                      color: 'var(--color-text-secondary)',
                    }}>
                      Payment: {tier.terms}
                    </span>
                  </div>
                  
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    flex: 1,
                  }}>
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                        fontSize: 'var(--fs-small)',
                        color: 'var(--color-text-secondary)',
                      }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M13.5 4.5L6 12L2.5 8.5" stroke={tier.isPopular ? '#00FF85' : '#ffffff'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="fadeUp" delay={300}>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '48px',
            }}>
              <h3 style={{
                fontSize: 'var(--fs-h4)',
                fontWeight: 500,
                color: '#ffffff',
                marginBottom: '20px',
              }}>
                Requirements
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                {REQUIREMENTS.map((req, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: 'var(--fs-body)',
                    color: 'var(--color-text-secondary)',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="10" cy="10" r="9" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
                      <path d="M6 10L9 13L14 7" stroke="#00FF85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={400}>
            <div style={{ textAlign: 'center' }}>
              <Link
                href="/wholesale/apply"
                style={{
                  padding: '18px 40px',
                  background: '#00FF85',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.2s ease',
                }}
              >
                Apply for Wholesale Access
              </Link>
            </div>
          </AnimatedSection>
        </section>

      </main>

      <Footer />
    </>
  );
}
