import PageLayout, { PageHero, PageSection, SectionHeader, AnimatedSection } from '../components/PageLayout';
import SmoothieCard from '../components/SmoothieCard';
import Link from 'next/link';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { getMessages } from '../lib/getMessages';

const SMOOTHIES = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, image: '/products/strawberry-peach/gallery-1.png', hoverImage: '/products/strawberry-peach/gallery-2.png', category: 'Fruity', rating: 4.5, reviews: 4619 },
  { id: '9', name: 'Pink Piyata', price: 8.99, image: '/products/pink-piyata/gallery-1.jpg', hoverImage: '/products/pink-piyata/gallery-2.jpg', category: 'Tropical', rating: 4.7, reviews: 127 },
  { id: '10', name: 'Matcha', price: 9.49, image: '/products/matcha/gallery-1.jpg', hoverImage: '/products/matcha/gallery-2.jpg', category: 'Energy', rating: 4.8, reviews: 312 },
  { id: '11', name: 'Mocha', price: 9.49, image: '/products/mocha/gallery-1.jpg', hoverImage: '/products/mocha/gallery-2.jpg', category: 'Energy', rating: 4.6, reviews: 245 },
  { id: '12', name: 'Nutty Monkey', price: 8.99, image: '/products/nutty-monkey/Nutty Monkey-1.png', hoverImage: '/products/nutty-monkey/Nutty Monkey-2.png', category: 'Nutty', rating: 4.7, reviews: 389 },
  { id: '13', name: 'Mango Jackfruit', price: 8.99, image: '/products/mango-jackfruit/Mango Jackfruit-1.png', hoverImage: '/products/mango-jackfruit/Mango Jackfruit-2.png', category: 'Tropical', rating: 4.8, reviews: 156 },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, image: '/products/coffee-mushroom/gallery-1.jpg', hoverImage: '/products/coffee-mushroom/gallery-2.jpg', category: 'Energy', rating: 4.8, reviews: 203 },
  { id: '15', name: 'Chocolate Berry', price: 8.99, image: '/products/chocolate-berry/gallery-1.jpg', hoverImage: '/products/chocolate-berry/gallery-2.jpg', category: 'Indulgent', rating: 4.8, reviews: 278 },
  { id: '16', name: 'Almond', price: 8.99, image: '/products/almond/gallery-1.jpg', hoverImage: '/products/almond/gallery-2.jpg', category: 'Nutty', rating: 4.7, reviews: 187 },
  { id: '17', name: 'Acai', price: 9.49, image: '/products/acai/gallery-1.jpg', hoverImage: '/products/acai/gallery-2.jpg', category: 'Antioxidant', rating: 4.9, reviews: 487 },
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
          title={t('allTitle')}
          subtitle={t('allSubtitle')}
        />
        
        <div className="smoothie-grid-dh">
          {SMOOTHIES.map((product, index) => (
            <AnimatedSection key={product.id} animation="fadeUp" delay={index * 80}>
              <SmoothieCard
                id={product.id}
                name={product.name}
                image={product.image}
                hoverImage={product.hoverImage}
                badge={product.category === 'Tropical' ? 'NEW' : 'BEST SELLER'}
                price={product.price}
                rating={product.rating}
                reviews={product.reviews}
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
