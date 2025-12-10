import PageLayout, { PageHero, PageSection, SectionHeader, AnimatedSection } from '../../components/PageLayout';
import Link from 'next/link';

const PRICING_TIERS = [
  {
    name: 'Starter',
    minOrder: '50 units',
    discount: '25%',
    features: ['Standard delivery', 'Basic POS materials', 'Email support', 'Net 30 terms'],
    highlighted: false,
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
    highlighted: false,
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
    <PageLayout>
      <PageHero
        badge="B2B Pricing"
        badgeColor="linear-gradient(135deg, #00C9A7, #6B5CE7)"
        title="Wholesale Pricing"
        subtitle="Competitive margins designed for your business success."
      />
      
      <PageSection background="white">
        <SectionHeader
          centered
          title="Partnership Tiers"
          subtitle="Choose the level that fits your business"
        />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {PRICING_TIERS.map((tier, index) => (
            <AnimatedSection key={tier.name} animation="fadeUp" delay={index * 100}>
              <div 
                className="tiktok-card" 
                style={{ 
                  height: '100%',
                  border: tier.highlighted ? '2px solid #6B5CE7' : undefined,
                  position: 'relative',
                }}
              >
                {tier.highlighted && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #6B5CE7, #FF4F7B)',
                    color: '#fff',
                    padding: '4px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>{tier.name}</h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>Min. {tier.minOrder}/order</p>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: '700', 
                  background: 'linear-gradient(135deg, #6B5CE7, #00C9A7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '24px',
                }}>
                  {tier.discount} OFF
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {tier.features.map((feature) => (
                    <li key={feature} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      padding: '8px 0',
                      fontSize: '15px',
                      color: '#444',
                    }}>
                      <span style={{ color: '#00C9A7' }}>✓</span>
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
                    background: tier.highlighted ? 'linear-gradient(135deg, #6B5CE7, #00C9A7)' : '#f5f5f7',
                    color: tier.highlighted ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '15px',
                    fontWeight: '600',
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
      </PageSection>

      <PageSection background="cream">
        <SectionHeader
          centered
          title="Sample Product Pricing"
          subtitle="Wholesale prices for Growth tier partners"
        />
        
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              padding: '16px 24px',
              background: '#f5f5f7',
              fontWeight: '600',
              fontSize: '14px',
              color: '#666',
            }}>
              <span>Product</span>
              <span style={{ textAlign: 'center' }}>Retail</span>
              <span style={{ textAlign: 'center' }}>Wholesale</span>
            </div>
            {PRODUCTS.map((product) => (
              <div 
                key={product.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  padding: '16px 24px',
                  borderBottom: '1px solid #eee',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: '500' }}>{product.name}</span>
                <span style={{ textAlign: 'center', color: '#666' }}>${product.retail.toFixed(2)}</span>
                <span style={{ 
                  textAlign: 'center', 
                  fontWeight: '600',
                  color: '#00C9A7',
                }}>
                  ${product.wholesale.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#666', marginTop: '24px', fontSize: '14px' }}>
            * Prices shown for Growth tier. Contact us for Enterprise pricing.
          </p>
        </div>
      </PageSection>

      <PageSection background="black">
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
            Ready to Partner?
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>
            Fill out our quick application and we'll get back to you within 48 hours.
          </p>
          <Link 
            href="/wholesale"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #6B5CE7, #FF4F7B)',
              color: '#fff',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '16px',
              textDecoration: 'none',
            }}
          >
            Apply Now
          </Link>
        </div>
      </PageSection>
    </PageLayout>
  );
}
