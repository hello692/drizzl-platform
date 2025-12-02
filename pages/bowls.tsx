import PageLayout, { PageHero, PageSection, SectionHeader, AnimatedSection } from '../components/PageLayout';
import Link from 'next/link';

const BOWLS = [
  { id: '1', name: 'Acai + Blueberry Bowl', price: 9.99, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500', category: 'Superfood', reviews: 156 },
  { id: '2', name: 'Dragon Fruit Bowl', price: 9.99, image: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=500', category: 'Tropical', reviews: 134 },
  { id: '3', name: 'Green Power Bowl', price: 10.49, image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500', category: 'Green', reviews: 98 },
  { id: '4', name: 'Mango Paradise Bowl', price: 9.99, image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=500', category: 'Tropical', reviews: 187 },
  { id: '5', name: 'Berry Blast Bowl', price: 9.49, image: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=500', category: 'Antioxidant', reviews: 145 },
  { id: '6', name: 'Chocolate Peanut Butter Bowl', price: 10.99, image: 'https://images.unsplash.com/photo-1577003833619-76bbd7f82948?w=500', category: 'Protein', reviews: 203 },
];

export default function Bowls() {
  return (
    <PageLayout>
      <PageHero
        badge="Breakfast Favorites"
        badgeColor="linear-gradient(135deg, #FF8A4B, #FFD166)"
        title="Breakfast Bowls"
        subtitle="Start your day with a burst of nutrition. Our bowls are packed with superfoods and topped with goodness."
      />
      
      <PageSection background="white">
        <SectionHeader
          emoji="🥣"
          title="All Bowls"
          subtitle="Nutrient-packed bowls to fuel your morning"
        />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '32px',
        }}>
          {BOWLS.map((product, index) => (
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
                  <span className="energy-badge" style={{ marginBottom: '12px', display: 'inline-block' }}>
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
                    background: 'linear-gradient(135deg, #FF8A4B, #FF4F7B)',
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

      <PageSection background="light">
        <AnimatedSection animation="fadeUp">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '40px',
            textAlign: 'center',
            padding: '40px 0'
          }}>
            <div className="tiktok-stat">
              <div className="tiktok-stat-number">15g</div>
              <div className="tiktok-stat-label">Protein Per Bowl</div>
            </div>
            <div className="tiktok-stat">
              <div className="tiktok-stat-number">100%</div>
              <div className="tiktok-stat-label">Organic Fruits</div>
            </div>
            <div className="tiktok-stat">
              <div className="tiktok-stat-number">0g</div>
              <div className="tiktok-stat-label">Added Sugar</div>
            </div>
          </div>
        </AnimatedSection>
      </PageSection>
      
      <PageSection background="cream">
        <AnimatedSection animation="fadeUp" style={{ textAlign: 'center', padding: '40px 0' }}>
          <h2 className="tiktok-heading" style={{ marginBottom: '16px' }}>
            Ready to <span className="tiktok-heading-gradient">fuel up</span>?
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
