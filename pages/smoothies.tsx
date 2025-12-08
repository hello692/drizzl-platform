import PageLayout, { PageHero, PageSection, SectionHeader, ProductGrid, AnimatedSection } from '../components/PageLayout';
import SmoothieCard from '../components/SmoothieCard';
import Link from 'next/link';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { getMessages } from '../lib/getMessages';

const SMOOTHIES = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, image: '/products/strawberry-peach/gallery-1.jpg', category: 'Fruity', reviews: 4619 },
  { id: '9', name: 'Pink Piyata', price: 8.99, image: '/products/pink-piyata/transparent-glass-1.png', category: 'Tropical', reviews: 127 },
  { id: '10', name: 'Matcha', price: 9.49, image: '/products/matcha/transparent-glass-1.png', category: 'Energy', reviews: 312 },
  { id: '11', name: 'Mocha', price: 9.49, image: '/products/mocha/transparent-glass-1.png', category: 'Energy', reviews: 245 },
  { id: '12', name: 'Nutty Monkey', price: 8.99, image: '/products/nutty-monkey/transparent-glass-1.png', category: 'Nutty', reviews: 389 },
  { id: '13', name: 'Mango Jackfruit', price: 8.99, image: '/products/mango-jackfruit/transparent-glass-1.png', category: 'Tropical', reviews: 156 },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, image: '/products/coffee-mushroom/transparent-glass-1.png', category: 'Energy', reviews: 203 },
  { id: '17', name: 'Acai', price: 9.49, image: '/products/acai/Acai-TG-1.jpg', category: 'Antioxidant', reviews: 487 },
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
      
      <PageSection background="black">
        <SectionHeader
          emoji="🥤"
          title={t('allTitle')}
          subtitle={t('allSubtitle')}
        />
        
        <div className="smoothie-grid">
          {SMOOTHIES.map((product, index) => (
            <AnimatedSection key={product.id} animation="fadeUp" delay={index * 80}>
              <SmoothieCard
                id={product.id}
                name={product.name}
                image={product.image}
                badge={product.category === 'Tropical' ? 'NEW' : 'BEST SELLER'}
                price={product.price}
                showPrice={true}
              />
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
