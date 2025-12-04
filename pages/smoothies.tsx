import PageLayout, { PageHero, PageSection, SectionHeader, ProductGrid, AnimatedSection } from '../components/PageLayout';
import Link from 'next/link';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { getMessages } from '../lib/getMessages';

const SMOOTHIES = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, image: '/products/strawberry-peach/main-product.png', category: 'Fruity', reviews: 4619 },
  { id: '9', name: 'Pink Piyata', price: 8.99, image: '/products/pink-piyata/transparent-glass-1.png', category: 'Tropical', reviews: 127 },
  { id: '10', name: 'Matcha', price: 9.49, image: '/products/matcha/transparent-glass-1.png', category: 'Energy', reviews: 312 },
  { id: '11', name: 'Mocha', price: 9.49, image: '/products/mocha/transparent-glass-1.png', category: 'Energy', reviews: 245 },
  { id: '12', name: 'Nutty Monkey', price: 8.99, image: '/products/nutty-monkey/transparent-glass-1.png', category: 'Nutty', reviews: 389 },
  { id: '13', name: 'Mango Jackfruit', price: 8.99, image: '/products/mango-jackfruit/transparent-glass-1.png', category: 'Tropical', reviews: 156 },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, image: '/products/coffee-mushroom/transparent-glass-1.png', category: 'Energy', reviews: 203 },
  { id: '17', name: 'Acai', price: 9.49, image: '/products/acai/transparent-glass-1.png', category: 'Antioxidant', reviews: 487 },
];

export default function Smoothies() {
  let t: ReturnType<typeof useTranslations>;
  try {
    t = useTranslations('pages.smoothies');
  } catch {
    t = ((key: string) => key) as any;
  }
  
  let tCta: ReturnType<typeof useTranslations>;
  try {
    tCta = useTranslations('home.cta');
  } catch {
    tCta = ((key: string) => key) as any;
  }

  return (
    <PageLayout>
      <PageHero
        badge={t('badge')}
        title={t('title')}
        subtitle={t('subtitle')}
      />
      
      <PageSection background="white">
        <SectionHeader
          emoji="🥤"
          title={t('allTitle')}
          subtitle={t('allSubtitle')}
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
            {tCta('freeShipping')}
          </p>
          <Link href="/products" className="tiktok-button tiktok-button-gradient">
            {tCta('shopAll')}
          </Link>
        </AnimatedSection>
      </PageSection>
    </PageLayout>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale || 'en'),
    },
  };
}
