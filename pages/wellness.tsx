import PageLayout, { PageHero, PageSection, SectionHeader, AnimatedSection } from '../components/PageLayout';
import Link from 'next/link';

const WELLNESS_PRODUCTS = [
  { id: '1', name: 'Immunity Boost Shot', price: 4.99, image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500', category: 'Immunity', reviews: 234 },
  { id: '2', name: 'Energy Elixir', price: 5.49, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500', category: 'Energy', reviews: 187 },
  { id: '3', name: 'Gut Health Probiotic', price: 6.99, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500', category: 'Digestion', reviews: 156 },
  { id: '4', name: 'Stress Relief Blend', price: 5.99, image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=500', category: 'Calm', reviews: 145 },
  { id: '5', name: 'Collagen Glow', price: 7.99, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500', category: 'Beauty', reviews: 198 },
  { id: '6', name: 'Sleep Well Tonic', price: 5.49, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500', category: 'Rest', reviews: 167 },
];

const BENEFITS = [
  { emoji: '🛡️', title: 'Boost Immunity', description: 'Supercharge your defenses with vitamin-rich formulas' },
  { emoji: '⚡', title: 'Increase Energy', description: 'Natural energy without the crash or jitters' },
  { emoji: '🧘', title: 'Reduce Stress', description: 'Adaptogenic herbs to help you stay balanced' },
  { emoji: '✨', title: 'Glow From Within', description: 'Beauty nutrients for radiant skin and hair' },
];

export default function Wellness() {
  return (
    <PageLayout>
      <PageHero
        badge="Health Boosters"
        badgeColor="linear-gradient(135deg, #6B5CE7, #3FBF7F)"
        title="Wellness Shots"
        subtitle="Concentrated nutrition for targeted results. Small shots, big benefits."
      />
      
      <PageSection background="light">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
        }}>
          {BENEFITS.map((benefit, index) => (
            <AnimatedSection key={benefit.title} animation="fadeUp" delay={index * 100}>
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <span style={{ fontSize: '40px', display: 'block', marginBottom: '16px' }}>{benefit.emoji}</span>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{benefit.title}</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>{benefit.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </PageSection>
      
      <PageSection background="white">
        <SectionHeader
          emoji="💊"
          title="All Wellness Products"
          subtitle="Targeted nutrition for your specific needs"
        />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '32px',
        }}>
          {WELLNESS_PRODUCTS.map((product, index) => (
            <AnimatedSection key={product.id} animation="fadeUp" delay={index * 80}>
              <Link href={`/products/${product.id}`} className="tiktok-card" style={{
                textDecoration: 'none',
                color: 'inherit',
                padding: '0',
                overflow: 'hidden',
                display: 'block',
              }}>
                <div className="tiktok-image-reveal" style={{ marginBottom: '16px' }}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '240px',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div style={{ padding: '0 20px 20px' }}>
                  <span className="health-badge" style={{ marginBottom: '12px', display: 'inline-block' }}>
                    {product.category}
                  </span>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    letterSpacing: '-0.3px',
                  }}>
                    {product.name}
                  </h3>
                  <p className="stars-vibrant" style={{
                    fontSize: '13px',
                    marginBottom: '12px',
                  }}>
                    ★★★★★ {product.reviews} reviews
                  </p>
                  <p style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #6B5CE7, #3FBF7F)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </PageSection>
      
      <PageSection background="cream">
        <AnimatedSection animation="fadeUp" style={{ textAlign: 'center', padding: '40px 0' }}>
          <h2 className="tiktok-heading" style={{ marginBottom: '16px' }}>
            Feel the <span className="tiktok-heading-gradient">difference</span>
          </h2>
          <p className="tiktok-subheading" style={{ margin: '0 auto 32px' }}>
            Start your wellness journey today
          </p>
          <Link href="/products" className="tiktok-button tiktok-button-gradient">
            Shop All Products
          </Link>
        </AnimatedSection>
      </PageSection>
    </PageLayout>
  );
}
