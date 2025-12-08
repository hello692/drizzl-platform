import { useRef } from 'react';
import Link from 'next/link';
import { GetStaticPropsContext } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMessages } from '../lib/getMessages';

const POPULAR_SMOOTHIES = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, image: '/products/strawberry-peach/gallery-1.png', hoverImage: '/products/strawberry-peach/gallery-2.png', badge: 'BEST SELLER', rating: 4.5, reviews: 4619 },
  { id: '9', name: 'Pink Piyata', price: 8.99, image: '/products/pink-piyata/gallery-1.jpg', hoverImage: '/products/pink-piyata/gallery-2.jpg', badge: 'NEW', rating: 4.7, reviews: 127 },
  { id: '10', name: 'Matcha', price: 9.49, image: '/products/matcha/gallery-1.jpg', hoverImage: '/products/matcha/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.8, reviews: 312 },
  { id: '11', name: 'Mocha', price: 9.49, image: '/products/mocha/gallery-1.jpg', hoverImage: '/products/mocha/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.6, reviews: 245 },
  { id: '12', name: 'Nutty Monkey', price: 8.99, image: '/products/nutty-monkey/gallery-1.jpg', hoverImage: '/products/nutty-monkey/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.7, reviews: 389 },
  { id: '13', name: 'Mango Jackfruit', price: 8.99, image: '/products/mango-jackfruit/gallery-1.jpg', hoverImage: '/products/mango-jackfruit/gallery-2.jpg', badge: 'NEW', rating: 4.8, reviews: 156 },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, image: '/products/coffee-mushroom/gallery-1.jpg', hoverImage: '/products/coffee-mushroom/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.8, reviews: 203 },
  { id: '15', name: 'Chocolate Berry', price: 8.99, image: '/products/chocolate-berry/gallery-1.jpg', hoverImage: '/products/chocolate-berry/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.8, reviews: 278 },
  { id: '16', name: 'Almond', price: 8.99, image: '/products/almond/gallery-1.jpg', hoverImage: '/products/almond/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.7, reviews: 187 },
  { id: '17', name: 'Acai', price: 9.49, image: '/products/acai/gallery-1.jpg', hoverImage: '/products/acai/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.9, reviews: 487 },
];

const CATEGORY_LINKS = {
  left: [
    { name: 'Energy Blends', href: '/collections/smoothies' },
    { name: 'Immunity Boost', href: '/collections/smoothies' },
    { name: 'Green Detox', href: '/collections/smoothies' },
    { name: 'Protein Power', href: '/products/high-protein' },
  ],
  right: [
    { name: 'Daily Essentials', href: '/collections/smoothies' },
    { name: 'Morning Rituals', href: '/collections/smoothies' },
    { name: 'Bundles', href: '/collections/smoothie-boxes' },
    { name: 'Gift Sets', href: '/collections/gift-guide' },
  ],
};

const SERVICES = [
  {
    title: 'Subscription',
    image: '/products/strawberry-peach/gallery-3.png',
    links: [
      { name: 'Subscribe & Save', href: '/products' },
      { name: 'View All Plans', href: '/products' },
    ],
  },
  {
    title: 'Gift Options',
    image: '/products/pink-piyata/gallery-3.jpg',
    links: [
      { name: 'Gifts for Her', href: '/collections/gift-guide' },
      { name: 'Gifts for Him', href: '/collections/gift-guide' },
    ],
  },
  {
    title: 'Support',
    image: '/products/matcha/gallery-3.jpg',
    links: [
      { name: 'Contact Us', href: '/contact' },
    ],
  },
];

export default function Home() {
  const collection1Ref = useRef<HTMLDivElement>(null);
  const collection2Ref = useRef<HTMLDivElement>(null);
  const collection3Ref = useRef<HTMLDivElement>(null);

  const scrollCollection = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const bestSellers = POPULAR_SMOOTHIES.slice(0, 4);
  const morningEssentials = POPULAR_SMOOTHIES.slice(4, 8);
  const giftPicks = POPULAR_SMOOTHIES.slice(2, 6);

  return (
    <>
      <Navbar />

      {/* 1. HERO SECTION - Full Screen */}
      <section className="lv-hero">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="lv-hero-video"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="lv-hero-overlay"></div>
        
        <div className="lv-hero-content">
          <Link href="/products" className="lv-hero-discover">
            Discover
          </Link>
          
          <h1 className="lv-hero-headline">
            The Smoothie Season with Drizzl
          </h1>
          
          <div className="lv-hero-ctas">
            <Link href="/products" className="lv-hero-cta-link">
              Shop Smoothies
            </Link>
            <span className="lv-hero-cta-divider">|</span>
            <Link href="/collections/smoothie-boxes" className="lv-hero-cta-link">
              Shop Bundles
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE ART OF WELLNESS SECTION */}
      <section className="lv-categories">
        <div className="lv-categories-header">
          <p className="lv-categories-tagline">
            Order today for fresh delivery and eco-friendly packaging.
          </p>
        </div>
        
        <div className="lv-categories-grid">
          <div className="lv-categories-column">
            {CATEGORY_LINKS.left.map((link, index) => (
              <Link key={index} href={link.href} className="lv-categories-link">
                {link.name}
              </Link>
            ))}
          </div>
          <div className="lv-categories-column">
            {CATEGORY_LINKS.right.map((link, index) => (
              <Link key={index} href={link.href} className="lv-categories-link">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="lv-section-divider"></div>
      </section>

      {/* 3. FEATURED COLLECTION 1 - Popular Picks: Best Sellers */}
      <section className="lv-collection">
        <div className="lv-collection-header">
          <span className="lv-collection-label">Smoothies</span>
          <h2 className="lv-collection-title">Popular Picks: Best Sellers</h2>
        </div>
        
        <div className="lv-collection-carousel-wrapper">
          <button 
            className="lv-collection-arrow lv-collection-arrow-left"
            onClick={() => scrollCollection(collection1Ref, 'left')}
            aria-label="Scroll left"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          
          <div className="lv-collection-row" ref={collection1Ref}>
            {bestSellers.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="lv-collection-card">
                <div className="lv-collection-card-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <h3 className="lv-collection-card-name">{product.name}</h3>
                <p className="lv-collection-card-price">${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
          
          <button 
            className="lv-collection-arrow lv-collection-arrow-right"
            onClick={() => scrollCollection(collection1Ref, 'right')}
            aria-label="Scroll right"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        
        <div className="lv-collection-footer">
          <Link href="/collections/best-sellers" className="lv-collection-shop-link">
            Shop the Selection
          </Link>
        </div>
        
        <div className="lv-section-divider"></div>
      </section>

      {/* 4. FEATURED COLLECTION 2 - Morning Essentials */}
      <section className="lv-collection">
        <div className="lv-collection-header">
          <span className="lv-collection-label">Smoothies</span>
          <h2 className="lv-collection-title">Morning Essentials</h2>
        </div>
        
        <div className="lv-collection-carousel-wrapper">
          <button 
            className="lv-collection-arrow lv-collection-arrow-left"
            onClick={() => scrollCollection(collection2Ref, 'left')}
            aria-label="Scroll left"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          
          <div className="lv-collection-row" ref={collection2Ref}>
            {morningEssentials.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="lv-collection-card">
                <div className="lv-collection-card-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <h3 className="lv-collection-card-name">{product.name}</h3>
                <p className="lv-collection-card-price">${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
          
          <button 
            className="lv-collection-arrow lv-collection-arrow-right"
            onClick={() => scrollCollection(collection2Ref, 'right')}
            aria-label="Scroll right"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        
        <div className="lv-collection-footer">
          <Link href="/products" className="lv-collection-shop-link">
            Shop the Selection
          </Link>
        </div>
        
        <div className="lv-section-divider"></div>
      </section>

      {/* 5. FEATURED COLLECTION 3 - Gifts for Wellness Lovers */}
      <section className="lv-collection">
        <div className="lv-collection-header">
          <span className="lv-collection-label">Gifts</span>
          <h2 className="lv-collection-title">Gifts for Wellness Lovers</h2>
        </div>
        
        <div className="lv-collection-carousel-wrapper">
          <button 
            className="lv-collection-arrow lv-collection-arrow-left"
            onClick={() => scrollCollection(collection3Ref, 'left')}
            aria-label="Scroll left"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          
          <div className="lv-collection-row" ref={collection3Ref}>
            {giftPicks.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="lv-collection-card">
                <div className="lv-collection-card-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <h3 className="lv-collection-card-name">{product.name}</h3>
                <p className="lv-collection-card-price">${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
          
          <button 
            className="lv-collection-arrow lv-collection-arrow-right"
            onClick={() => scrollCollection(collection3Ref, 'right')}
            aria-label="Scroll right"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        
        <div className="lv-collection-footer">
          <Link href="/collections/gift-guide" className="lv-collection-shop-link">
            Shop Now
          </Link>
        </div>
        
        <div className="lv-section-divider"></div>
      </section>

      {/* 6. SERVICES SECTION - Drizzl Services */}
      <section className="lv-services">
        <div className="lv-services-header">
          <h2 className="lv-services-title">Drizzl Services</h2>
          <p className="lv-services-subtitle">
            Personalized wellness support, sustainable packaging, and subscription options.
          </p>
        </div>
        
        <div className="lv-services-grid">
          {SERVICES.map((service, index) => (
            <div key={index} className="lv-services-card">
              <div className="lv-services-card-image">
                <img src={service.image} alt={service.title} />
              </div>
              <h3 className="lv-services-card-title">{service.title}</h3>
              <div className="lv-services-card-links">
                {service.links.map((link, linkIndex) => (
                  <Link key={linkIndex} href={link.href} className="lv-services-card-link">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: await getMessages(locale || 'en'),
    },
  };
}
