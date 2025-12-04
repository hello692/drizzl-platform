import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AnimatedSection, AnimatedText, StaggeredGrid } from '../components/ScrollAnimations';
import { getMessages } from '../lib/getMessages';

const ModernArrowLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ModernArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

const CATEGORIES = [
  { name: 'Smoothies', slug: 'smoothies' },
  { name: 'High Protein', slug: 'high-protein' },
  { name: 'Smoothie Boxes', slug: 'boxes' },
  { name: 'Gift Guide', slug: 'gift' },
];

const POPULAR_SMOOTHIES = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, image: '/products/strawberry-peach/transparent-glass-1.png', badge: 'Best Seller' },
  { id: '9', name: 'Pink Piyata', price: 8.99, image: '/products/pink-piyata/transparent-glass-1.png', badge: 'New' },
  { id: '10', name: 'Matcha', price: 9.49, image: '/products/matcha/transparent-glass-1.png', badge: 'Best Seller' },
  { id: '11', name: 'Mocha', price: 9.49, image: '/products/mocha/transparent-glass-1.png', badge: 'Best Seller' },
  { id: '12', name: 'Nutty Monkey', price: 8.99, image: '/products/nutty-monkey/transparent-glass-1.png', badge: 'Best Seller' },
  { id: '13', name: 'Mango Jackfruit', price: 8.99, image: '/products/mango-jackfruit/transparent-glass-1.png', badge: 'Best Seller' },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, image: '/products/coffee-mushroom/transparent-glass-1.png', badge: 'Best Seller' },
  { id: '15', name: 'Chocolate Berry', price: 8.99, image: '/products/chocolate-berry/transparent-glass-1.png', badge: 'Best Seller' },
  { id: '16', name: 'Almond', price: 8.99, image: '/products/almond/transparent-glass-1.png', badge: 'Best Seller' },
  { id: '17', name: 'Acai', price: 9.49, image: '/products/acai/transparent-glass-1.png', badge: 'Best Seller' },
];

const EXPERTS = [
  { id: '1', name: 'Elizabeth Russano, FNP-C, AFSM', video: 'https://media.coverr.co/videos/coverr-woman-drinking-smoothie-juice-7481/preview', product: 'Strawberry + Peach', productImage: '/products/strawberry-peach/main-product.png' },
  { id: '2', name: 'Morgan Rackley, LE', video: 'https://media.coverr.co/videos/coverr-healthy-lifestyle-eating-smoothie-bowl-7543/preview', product: 'Matcha', productImage: '/products/matcha/transparent-glass-1.png' },
  { id: '3', name: 'Nurse Lila, RM', video: 'https://media.coverr.co/videos/coverr-woman-with-smoothie-glass-8234/preview', product: 'Acai', productImage: '/products/acai/transparent-glass-1.png' },
  { id: '4', name: 'Dr. Gabriella Veals', video: 'https://media.coverr.co/videos/coverr-person-making-smoothie-juice-1200/preview', product: 'Pink Piyata', productImage: '/products/pink-piyata/transparent-glass-1.png' },
  { id: '5', name: 'Dr. Sarah Martinez', video: 'https://media.coverr.co/videos/coverr-fitness-girl-making-protein-smoothie-7821/preview', product: 'Coffee Mushroom', productImage: '/products/coffee-mushroom/transparent-glass-1.png' },
];

const CUSTOMERS = [
  { id: '1', name: 'Taylor Kay', video: 'https://media.coverr.co/videos/coverr-woman-drinking-smoothie-juice-7481/preview', product: 'Chocolate Berry', productImage: '/products/chocolate-berry/transparent-glass-1.png' },
  { id: '2', name: 'Brittney Adderfly', video: 'https://media.coverr.co/videos/coverr-healthy-lifestyle-eating-smoothie-bowl-7543/preview', product: 'Mocha', productImage: '/products/mocha/transparent-glass-1.png' },
  { id: '3', name: 'Lily Sanchez', video: 'https://media.coverr.co/videos/coverr-woman-with-smoothie-glass-8234/preview', product: 'Almond', productImage: '/products/almond/transparent-glass-1.png' },
  { id: '4', name: 'Sarah Butler', video: 'https://media.coverr.co/videos/coverr-person-making-smoothie-juice-1200/preview', product: 'Mango Jackfruit', productImage: '/products/mango-jackfruit/transparent-glass-1.png' },
  { id: '5', name: 'Jessica Chen', video: 'https://media.coverr.co/videos/coverr-fitness-girl-making-protein-smoothie-7821/preview', product: 'Nutty Monkey', productImage: '/products/nutty-monkey/transparent-glass-1.png' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [expertPosition, setExpertPosition] = useState(0);
  const [customerPosition, setCustomerPosition] = useState(0);
  const [unMutedExpert, setUnMutedExpert] = useState<string | null>(null);
  const [unMutedCustomer, setUnMutedCustomer] = useState<string | null>(null);
  
  let t: ReturnType<typeof useTranslations>;
  try {
    t = useTranslations('home');
  } catch {
    t = ((key: string) => key) as any;
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=smoothie');
        if (response.ok) {
          const data = await response.json();
          setFeaturedProducts(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Touch and drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (carouselRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - carouselRef.current.offsetLeft);
      setScrollLeft(carouselRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (carouselRef.current) {
      setIsDragging(true);
      setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
      setScrollLeft(carouselRef.current.scrollLeft);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Infinite scroll handler
  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const itemWidth = 312; // 280px width + 32px gap
      const totalItems = POPULAR_SMOOTHIES.length;
      const sectionWidth = itemWidth * totalItems;
      
      // When scrolled to end of first section, jump to middle section
      if (scrollLeft <= itemWidth / 2) {
        carouselRef.current.scrollLeft = sectionWidth + scrollLeft;
      }
      // When scrolled past middle section, jump back
      else if (scrollLeft >= sectionWidth * 2 - clientWidth) {
        carouselRef.current.scrollLeft = sectionWidth + (scrollLeft - sectionWidth * 2 + clientWidth);
      }
    }
  };

  // Initialize scroll position to middle section on mount
  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = 312;
      const totalItems = POPULAR_SMOOTHIES.length;
      carouselRef.current.scrollLeft = itemWidth * totalItems;
    }
  }, []);

  // Auto-scroll for Popular Products (3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current && !isDragging) {
        carouselRef.current.scrollBy({ left: 312, behavior: 'smooth' });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isDragging]);

  // Auto-scroll for Experts section (3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setExpertPosition(prev => (prev + 1) % EXPERTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll for Customers section (3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCustomerPosition(prev => (prev + 1) % CUSTOMERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section with Background Video */}
      <section style={{
        padding: 'clamp(40px, 8vw, 100px) clamp(16px, 4vw, 60px)',
        textAlign: 'center',
        minHeight: 'clamp(500px, 75vh, 800px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay for better text readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
          zIndex: 1,
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <AnimatedSection animation="fadeUp">
            <h1 style={{
              fontSize: 'clamp(28px, 8vw, 64px)',
              fontWeight: '700',
              textAlign: 'center',
              letterSpacing: '-1px',
              color: '#fff',
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
              animation: 'subtleFloat 6s ease-in-out infinite',
            }}>
              {t('hero.title')}
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={100}>
            <p style={{ textAlign: 'center', margin: '0 auto clamp(24px, 6vw, 48px)', fontSize: 'clamp(14px, 4vw, 18px)', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', lineHeight: '1.7', animation: 'delicateFade 1.2s cubic-bezier(0.32, 0, 0.67, 0) 0.3s forwards', opacity: 0 }}>
              {t('hero.subtitle')}
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={200}>
            <Link href="/products" className="btn-premium" style={{
              fontSize: '14px',
              padding: '14px 32px',
              background: '#fff',
              color: '#000',
              animation: 'smoothScale 1s cubic-bezier(0.32, 0, 0.67, 0) 0.6s forwards',
            }}>
              {t('hero.cta')}
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Scrolling Marquee Banner */}
      <div style={{
        background: '#ffffff',
        borderTop: '1px solid #f0f0f0',
        borderBottom: '1px solid #f0f0f0',
        overflow: 'hidden',
        padding: '16px 0',
      }}>
        <div 
          className="marquee-track"
          style={{
            display: 'flex',
            animation: 'marqueeScroll 25s linear infinite',
            width: 'max-content',
          }}
        >
          {[...Array(3)].map((_, repeatIndex) => (
            <div key={repeatIndex} style={{ display: 'flex', alignItems: 'center' }}>
              {['GLUTEN FREE', 'BUILT ON ORGANIC', 'DAIRY FREE', 'GLUTEN FREE', 'BUILT ON ORGANIC', 'DAIRY FREE'].map((text, idx) => (
                <span 
                  key={`${repeatIndex}-${idx}`}
                  style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#999',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    padding: '0 40px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Category Grid */}
      <section style={{ padding: 'clamp(32px, 6vw, 80px) clamp(16px, 4vw, 60px)', background: '#ffffff' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <AnimatedSection animation="fadeUp" style={{ textAlign: 'center', marginBottom: 'clamp(20px, 4vw, 40px)' }}>
            <h2 style={{ fontSize: 'clamp(24px, 6vw, 48px)', fontWeight: '600', marginBottom: '8px' }}>
              Shop by Category
            </h2>
            <p style={{ fontSize: 'clamp(13px, 3.5vw, 16px)', color: '#666', margin: '0 auto', maxWidth: '600px', lineHeight: '1.6' }}>
              Explore our full range of products
            </p>
          </AnimatedSection>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(140px, 35vw, 180px), 1fr))',
            gap: 'clamp(12px, 3vw, 16px)',
          }}>
            {CATEGORIES.map((category) => (
              <Link key={category.slug} href={`/products?category=${category.slug}`} style={{
                padding: '28px 20px',
                textAlign: 'center',
                background: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#000',
                transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ececec';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  margin: 0,
                  letterSpacing: '-0.2px',
                }}>
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section style={{ padding: 'clamp(32px, 6vw, 80px) clamp(16px, 4vw, 60px)', background: '#f9f9f9' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <AnimatedSection animation="fadeUp" style={{ marginBottom: 'clamp(20px, 4vw, 40px)' }}>
            <h2 style={{ fontSize: 'clamp(24px, 6vw, 48px)', fontWeight: '600', marginBottom: '8px' }}>
              Popular Products
            </h2>
            <p style={{ fontSize: 'clamp(13px, 3.5vw, 16px)', color: '#666', margin: '0', maxWidth: '600px', lineHeight: '1.6' }}>
              Customer favorites you'll love
            </p>
          </AnimatedSection>

          {/* Carousel Container */}
          <div style={{ position: 'relative', paddingLeft: 'clamp(50px, 8vw, 70px)', paddingRight: 'clamp(50px, 8vw, 70px)' }}>
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                color: '#000',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#000';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
              }}
            >
              <ModernArrowLeft />
            </button>

            {/* Carousel - Infinite Scroll */}
            <div
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onScroll={handleScroll}
              style={{
                display: 'flex',
                gap: '32px',
                overflowX: 'scroll',
                scrollBehavior: isDragging ? 'auto' : 'smooth',
                scrollbarWidth: 'none',
                paddingBottom: '16px',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
              }}
            >
              {/* Triple the products for seamless infinite scroll */}
              {[...POPULAR_SMOOTHIES, ...POPULAR_SMOOTHIES, ...POPULAR_SMOOTHIES].map((product, index) => (
                <Link
                  key={`${product.id}-${index}`}
                  href={`/products/${product.id}`}
                  style={{
                    flexShrink: 0,
                    width: '280px',
                    textAlign: 'center',
                    pointerEvents: isDragging ? 'none' : 'auto',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Product Image */}
                  <div style={{
                    background: '#f5f5f5',
                    borderRadius: '16px',
                    height: '300px',
                    marginBottom: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '1px solid #e8e8e8',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    position: 'relative',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#d0d0d0';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e8e8e8';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                    }}
                  >
                    {/* Badge */}
                    {product.badge && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: product.badge === 'New' ? '#22c55e' : '#000',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: '600',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        zIndex: 5,
                      }}>
                        {product.badge}
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '85%',
                        height: '85%',
                        objectFit: 'contain',
                        userSelect: 'none',
                      }}
                      draggable={false}
                    />
                  </div>
                  
                  {/* Product Name */}
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '6px',
                    letterSpacing: '-0.3px',
                  }}>
                    {product.name}
                  </h3>

                  {/* Category */}
                  <p style={{
                    fontSize: '13px',
                    color: '#86868b',
                    marginBottom: '8px',
                    letterSpacing: '-0.2px',
                  }}>
                    Smoothie
                  </p>
                </Link>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                color: '#000',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#000';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
              }}
            >
              <ModernArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section style={{
        background: '#f8f9fa',
        padding: 'clamp(32px, 6vw, 80px) clamp(16px, 4vw, 60px)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 6vw, 48px)',
            fontWeight: '700',
            marginBottom: '8px',
            letterSpacing: '-0.8px',
            textAlign: 'center',
          }}>
            Powered by AI, Formulated by Data
          </h2>
          <p style={{
            fontSize: 'clamp(12px, 3vw, 14px)',
            color: '#86868b',
            textAlign: 'center',
            marginBottom: 'clamp(24px, 5vw, 40px)',
            letterSpacing: '0.3px',
          }}>
            Approved by Dermatologists & Experts
          </p>

          {/* Carousel Container */}
          <div style={{ position: 'relative', paddingLeft: 'clamp(50px, 8vw, 70px)', paddingRight: 'clamp(50px, 8vw, 70px)' }}>
            {/* Left Arrow */}
            <button
              onClick={() => setExpertPosition(prev => (prev - 1 + EXPERTS.length) % EXPERTS.length)}
              style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                color: '#000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#000';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
              }}
            >
              <ModernArrowLeft />
            </button>

            {/* Carousel - Infinite */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
            }}>
              {[...EXPERTS, ...EXPERTS].slice(expertPosition, expertPosition + 4).map((expert, idx) => (
                <div key={`${expert.id}-${idx}`} style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e8e8e8',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#d0d0d0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = '#e8e8e8';
                  }}
                >
                  <div style={{
                    position: 'relative',
                    background: '#f8f9fa',
                    aspectRatio: '1',
                    overflow: 'hidden',
                  }}>
                    <video
                      src={expert.video}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      loop
                      autoPlay
                      muted={unMutedExpert !== expert.id}
                      onClick={() => {
                        setUnMutedExpert(unMutedExpert === expert.id ? null : expert.id);
                      }}
                    />
                    {unMutedExpert === expert.id && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.2)',
                        pointerEvents: 'none',
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: '#ffffff',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                        }}>
                          🔊
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <p style={{
                      fontSize: '12px',
                      color: '#86868b',
                      margin: '0 0 12px 0',
                      fontWeight: '600',
                      letterSpacing: '0.3px',
                    }}>
                      {expert.name}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '12px',
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#f0f0f0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}>
                        <img
                          src={expert.productImage}
                          alt={expert.product}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                      <p style={{
                        fontSize: '11px',
                        color: '#424245',
                        margin: 0,
                        lineHeight: '1.4',
                        letterSpacing: '-0.2px',
                      }}>
                        {expert.product}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => setExpertPosition(prev => (prev + 1) % EXPERTS.length)}
              style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                color: '#000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#000';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
              }}
            >
              <ModernArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Customers Section */}
      <section style={{
        background: '#ffffff',
        padding: 'clamp(32px, 6vw, 80px) clamp(16px, 4vw, 60px)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 6vw, 48px)',
            fontWeight: '700',
            marginBottom: 'clamp(24px, 5vw, 40px)',
            letterSpacing: '-0.8px',
            textAlign: 'center',
          }}>
            Loved by the Spoiled*
          </h2>

          {/* Carousel Container */}
          <div style={{ position: 'relative', paddingLeft: 'clamp(50px, 8vw, 70px)', paddingRight: 'clamp(50px, 8vw, 70px)' }}>
            {/* Left Arrow */}
            <button
              onClick={() => setCustomerPosition(prev => (prev - 1 + CUSTOMERS.length) % CUSTOMERS.length)}
              style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                color: '#000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#000';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
              }}
            >
              <ModernArrowLeft />
            </button>

            {/* Carousel - Infinite */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
            }}>
              {[...CUSTOMERS, ...CUSTOMERS].slice(customerPosition, customerPosition + 4).map((customer, idx) => (
                <div key={`${customer.id}-${idx}`} style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e8e8e8',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#d0d0d0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = '#e8e8e8';
                  }}
                >
                  <div style={{
                    position: 'relative',
                    background: '#f8f9fa',
                    aspectRatio: '1',
                    overflow: 'hidden',
                  }}>
                    <video
                      src={customer.video}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      loop
                      autoPlay
                      muted={unMutedCustomer !== customer.id}
                      onClick={() => {
                        setUnMutedCustomer(unMutedCustomer === customer.id ? null : customer.id);
                      }}
                    />
                    {unMutedCustomer === customer.id && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.2)',
                        pointerEvents: 'none',
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: '#ffffff',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                        }}>
                          🔊
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <p style={{
                      fontSize: '12px',
                      color: '#86868b',
                      margin: '0 0 12px 0',
                      fontWeight: '600',
                      letterSpacing: '0.3px',
                    }}>
                      {customer.name}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '12px',
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#f0f0f0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}>
                        <img
                          src={customer.productImage}
                          alt={customer.product}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                      <p style={{
                        fontSize: '11px',
                        color: '#424245',
                        margin: 0,
                        lineHeight: '1.4',
                        letterSpacing: '-0.2px',
                      }}>
                        {customer.product}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => setCustomerPosition(prev => (prev + 1) % CUSTOMERS.length)}
              style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                color: '#000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#000';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
              }}
            >
              <ModernArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: '#000000',
        padding: '160px 60px',
        textAlign: 'center',
        borderTop: '1px solid #e8e8e8',
      }}>
        <h2 style={{
          fontSize: '52px',
          marginBottom: '28px',
          fontWeight: '700',
          letterSpacing: '-0.8px',
          color: '#ffffff',
        }}>
          Start Your Wellness Journey Today
        </h2>
        <p style={{
          fontSize: '17px',
          color: '#a0a0a0',
          marginBottom: '56px',
          maxWidth: '720px',
          margin: '0 auto 56px auto',
          lineHeight: '1.8',
          letterSpacing: '-0.3px',
        }}>
          Join thousands of people who have made smoothies and bowls their daily habit.
        </p>
        <Link href="/auth" style={{
          display: 'inline-block',
          padding: '14px 40px',
          background: '#ffffff',
          color: '#000',
          textDecoration: 'none',
          borderRadius: '28px',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          letterSpacing: '-0.3px',
          boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)',
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f0f0f0';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 255, 255, 0.2)';
          }}
        >
          Create Your Account
        </Link>
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
