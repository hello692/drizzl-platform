import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../../components/ScrollAnimations';

const PRICING_TIERS = [
  {
    name: 'Starter',
    minOrder: '50 units',
    discount: '25%',
    features: ['Standard delivery', 'Basic POS materials', 'Email support', 'Net 30 terms'],
  },
  {
    name: 'Growth',
    minOrder: '200 units',
    discount: '35%',
    features: ['Priority delivery', 'Full marketing kit', 'Dedicated account rep', 'Net 45 terms', 'Staff training'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    minOrder: '500+ units',
    discount: '45%',
    features: ['Same-day delivery', 'Custom marketing', 'Executive support', 'Net 60 terms', 'On-site training', 'Exclusive products'],
  },
];

const PRODUCTS = [
  { name: 'Berry Blast', retail: 7.99, wholesale: 4.79 },
  { name: 'Green Machine', retail: 8.49, wholesale: 5.09 },
  { name: 'Tropical Paradise', retail: 8.99, wholesale: 5.39 },
  { name: 'Chocolate Peanut Butter', retail: 9.49, wholesale: 5.69 },
  { name: 'Acai Energy', retail: 9.99, wholesale: 5.99 },
  { name: 'Coffee Kick', retail: 9.99, wholesale: 5.99 },
];

export default function WholesalePricing() {
  return (
    <>
      <Navbar hideCart hideSearch />
      
      <main style={{ background: '#000000', minHeight: '100vh', paddingTop: '120px' }}>
        <section style={{
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 48px)' }}>
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
                Competitive margins designed for your business success.
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: 'clamp(48px, 8vw, 80px)',
          }}>
            {PRICING_TIERS.map((tier, index) => (
              <AnimatedSection key={tier.name} animation="fadeUp" delay={index * 100}>
                <div style={{
                  background: 'transparent',
                  border: tier.highlighted ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '32px 24px',
                  height: '100%',
                  position: 'relative',
                }}>
                  {tier.highlighted && (
                    <div style={{
                      position: 'absolute',
                      top: '-1px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#ffffff',
                      color: '#000000',
                      padding: '4px 12px',
                      borderRadius: '0 0 8px 8px',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}>
                      MOST POPULAR
                    </div>
                  )}
                  <h3 style={{
                    fontSize: 'var(--fs-h3)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: '8px',
                    marginTop: tier.highlighted ? '16px' : '0',
                  }}>
                    {tier.name}
                  </h3>
                  <p style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--color-text-tertiary)',
                    marginBottom: '24px',
                  }}>
                    Min. {tier.minOrder}/order
                  </p>
                  <p style={{
                    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                    fontWeight: 300,
                    color: '#ffffff',
                    marginBottom: '24px',
                  }}>
                    {tier.discount} <span style={{ fontSize: 'var(--fs-body)', color: 'var(--color-text-tertiary)' }}>off retail</span>
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {tier.features.map((feature) => (
                      <li key={feature} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '8px 0',
                        fontSize: 'var(--fs-small)',
                        color: 'var(--color-text-secondary)',
                      }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href="/wholesale"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '14px',
                      marginTop: '24px',
                      background: tier.highlighted ? '#ffffff' : 'transparent',
                      color: tier.highlighted ? '#000000' : '#ffffff',
                      border: tier.highlighted ? 'none' : '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '50px',
                      fontSize: 'var(--fs-small)',
                      fontWeight: 500,
                      textAlign: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section style={{
          background: '#0a0a0a',
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeUp">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  marginBottom: '12px',
                }}>
                  Sample Product Pricing
                </h2>
                <p style={{
                  fontSize: 'var(--fs-small)',
                  color: 'var(--color-text-tertiary)',
                }}>
                  Wholesale prices for Growth tier partners
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fadeUp" delay={100}>
              <div style={{
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                overflow: 'hidden',
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  padding: '16px 24px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)' }}>Product</span>
                  <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>Retail</span>
                  <span style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>Wholesale</span>
                </div>
                {PRODUCTS.map((product, index) => (
                  <div 
                    key={product.name}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr',
                      padding: '16px 24px',
                      borderBottom: index < PRODUCTS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontWeight: 500, color: '#ffffff' }}>{product.name}</span>
                    <span style={{ textAlign: 'center', color: 'var(--color-text-tertiary)' }}>${product.retail.toFixed(2)}</span>
                    <span style={{ textAlign: 'center', fontWeight: 500, color: '#ffffff' }}>${product.wholesale.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <p style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', marginTop: '16px', fontSize: 'var(--fs-small)' }}>
                Prices shown for Growth tier. Contact us for Enterprise pricing.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section style={{
          background: '#000000',
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <AnimatedSection animation="fadeUp">
              <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 300,
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Ready to Partner?
              </h2>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
                marginBottom: '24px',
              }}>
                Fill out our quick application and we'll get back to you within 48 hours.
              </p>
              <Link 
                href="/wholesale"
                style={{
                  display: 'inline-block',
                  padding: '16px 40px',
                  background: '#ffffff',
                  color: '#000000',
                  borderRadius: '50px',
                  fontWeight: 500,
                  fontSize: 'var(--fs-body)',
                  textDecoration: 'none',
                }}
              >
                Apply Now
              </Link>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
