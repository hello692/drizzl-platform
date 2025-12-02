import PageLayout, { PageHero, PageSection, SectionHeader, ProductGrid, AnimatedSection } from '../components/PageLayout';
import Link from 'next/link';

const SMOOTHIES = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, image: 'https://daily-harvest.com/cdn/shop/files/strawberry-peach-smoothie-daily-harvest-3657974.jpg?v=1760509351&width=500', category: 'Fruity', reviews: 185 },
  { id: '2', name: 'Acai + Cherry', price: 8.49, image: 'https://daily-harvest.com/cdn/shop/files/acai-cherry-smoothie-daily-harvest-8004331.jpg?v=1760509351&width=500', category: 'Antioxidant', reviews: 142 },
  { id: '3', name: 'Mixed Berry Protein', price: 9.49, image: 'https://daily-harvest.com/cdn/shop/files/mixed-berry-protein-smoothie-daily-harvest-3950952.jpg?v=1760509317&width=500', category: 'Protein', reviews: 203 },
  { id: '4', name: 'Dark Chocolate Protein', price: 9.49, image: 'https://daily-harvest.com/cdn/shop/files/dark-chocolate-protein-smoothie-daily-harvest-4692961.jpg?v=1760509316&width=500', category: 'Protein', reviews: 167 },
  { id: '5', name: 'Vanilla Bean Protein', price: 9.49, image: 'https://daily-harvest.com/cdn/shop/files/vanilla-bean-protein-smoothie-daily-harvest-1407106.jpg?v=1760509317&width=500', category: 'Protein', reviews: 134 },
  { id: '6', name: 'Tropical Greens Protein', price: 9.49, image: 'https://daily-harvest.com/cdn/shop/files/tropical-greens-protein-smoothie-daily-harvest-8021323.jpg?v=1760509314&width=500', category: 'Green', reviews: 156 },
  { id: '7', name: 'Mango + Greens', price: 8.49, image: 'https://daily-harvest.com/cdn/shop/files/mango-greens-smoothie-daily-harvest-1932842.jpg?v=1760509351&width=500', category: 'Green', reviews: 178 },
  { id: '8', name: 'Strawberry Banana Protein', price: 9.49, image: 'https://daily-harvest.com/cdn/shop/files/strawberry-banana-protein-smoothie-daily-harvest-3370693.jpg?v=1760509314&width=500', category: 'Protein', reviews: 221 },
];

export default function Smoothies() {
  return (
    <PageLayout>
      <PageHero
        badge="Our Bestsellers"
        title="Smoothies"
        subtitle="Fresh frozen blends packed with whole fruits, vegetables, and superfoods. Just add liquid and blend."
      />
      
      <PageSection background="white">
        <SectionHeader
          emoji="🥤"
          title="All Smoothies"
          subtitle="Choose your flavor adventure"
        />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '32px',
        }}>
          {SMOOTHIES.map((product, index) => (
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
      
      <PageSection background="cream">
        <AnimatedSection animation="fadeUp" style={{ textAlign: 'center', padding: '40px 0' }}>
          <h2 className="tiktok-heading" style={{ marginBottom: '16px' }}>
            Ready to <span className="tiktok-heading-gradient">blend</span>?
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
