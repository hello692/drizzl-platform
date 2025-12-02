import PageLayout, { PageHero, PageSection, SectionHeader, AnimatedSection } from '../components/PageLayout';
import Link from 'next/link';

const JUICES = [
  { id: '1', name: 'Green Glow', price: 7.99, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500', category: 'Detox', reviews: 134 },
  { id: '2', name: 'Citrus Sunrise', price: 7.49, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500', category: 'Immunity', reviews: 167 },
  { id: '3', name: 'Beet the Heat', price: 7.99, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500', category: 'Energy', reviews: 98 },
  { id: '4', name: 'Tropical Twist', price: 7.49, image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=500', category: 'Refreshing', reviews: 187 },
  { id: '5', name: 'Carrot Crush', price: 6.99, image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500', category: 'Vitamin A', reviews: 145 },
  { id: '6', name: 'Berry Bliss', price: 7.99, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500', category: 'Antioxidant', reviews: 203 },
];

export default function Juices() {
  return (
    <PageLayout>
      <PageHero
        badge="Cold Pressed"
        badgeColor="linear-gradient(135deg, #3FBF7F, #6B5CE7)"
        title="Fresh Juices"
        subtitle="Pure, cold-pressed goodness in every bottle. No added sugars, no preservatives."
      />
      
      <PageSection background="white">
        <SectionHeader
          emoji="🧃"
          title="All Juices"
          subtitle="Cold-pressed for maximum nutrients"
        />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '32px',
        }}>
          {JUICES.map((product, index) => (
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
                    background: 'linear-gradient(135deg, #3FBF7F, #6B5CE7)',
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
            Pure. <span className="tiktok-heading-gradient">Fresh.</span> Yours.
          </h2>
          <p className="tiktok-subheading" style={{ margin: '0 auto 32px' }}>
            Free shipping on orders over $50
          </p>
          <Link href="/products" className="tiktok-button tiktok-button-gradient">
            Shop All Products
          </Link>
        </AnimatedSection>
      </PageSection>
    </PageLayout>
  );
}
