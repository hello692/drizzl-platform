import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AnimatedSection, AnimatedText, StaggeredGrid } from '../components/ScrollAnimations';
import { getMessages } from '../lib/getMessages';

const AppleArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AppleArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
  { id: '17', name: 'Acai', price: 9.49, image: '/products/acai/Acai-TG-1.jpg', badge: 'Best Seller' },
];

const EXPERTS = [
  { id: '1', name: 'Elizabeth Russano', video: 'https://media.coverr.co/videos/coverr-woman-drinking-smoothie-juice-7481/preview', quote: 'I do is make a' },
  { id: '2', name: 'Morgan Rackley', video: 'https://media.coverr.co/videos/coverr-healthy-lifestyle-eating-smoothie-bowl-7543/preview', quote: 'Oh, yeah... poof!' },
  { id: '3', name: 'Nurse Lila', video: 'https://media.coverr.co/videos/coverr-woman-with-smoothie-glass-8234/preview', quote: 'my energy level' },
  { id: '4', name: 'Dr. Gabriella', video: 'https://media.coverr.co/videos/coverr-person-making-smoothie-juice-1200/preview', quote: 'I just really love this' },
  { id: '5', name: 'Dr. Sarah', video: 'https://media.coverr.co/videos/coverr-fitness-girl-making-protein-smoothie-7821/preview', quote: 'I do is make a' },
  { id: '6', name: 'Dr. Michael', video: 'https://media.coverr.co/videos/coverr-woman-drinking-smoothie-juice-7481/preview', quote: 'perfect for morning' },
];

const CUSTOMERS = [
  { id: '1', name: 'Taylor Kay', video: 'https://media.coverr.co/videos/coverr-woman-drinking-smoothie-juice-7481/preview', quote: 'I do is make a' },
  { id: '2', name: 'Brittney A.', video: 'https://media.coverr.co/videos/coverr-healthy-lifestyle-eating-smoothie-bowl-7543/preview', quote: 'Oh, yeah... poof!' },
  { id: '3', name: 'Lily S.', video: 'https://media.coverr.co/videos/coverr-woman-with-smoothie-glass-8234/preview', quote: 'my energy level' },
  { id: '4', name: 'Sarah Butler', video: 'https://media.coverr.co/videos/coverr-person-making-smoothie-juice-1200/preview', quote: 'I just really love this' },
  { id: '5', name: 'Jessica Chen', video: 'https://media.coverr.co/videos/coverr-fitness-girl-making-protein-smoothie-7821/preview', quote: 'I do is make a' },
  { id: '6', name: 'Emma Wilson', video: 'https://media.coverr.co/videos/coverr-woman-drinking-smoothie-juice-7481/preview', quote: 'best smoothies ever' },
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
        padding: '0 clamp(16px, 4vw, 60px)',
        paddingTop: 'clamp(120px, 20vh, 200px)',
        paddingBottom: 'clamp(60px, 10vh, 100px)',
        textAlign: 'center',
        minHeight: 'clamp(600px, 85vh, 900px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
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
        
        {/* Subtle gradient overlay - lighter at top to show video, darker at bottom for text */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%)',
          zIndex: 1,
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
          <AnimatedSection animation="fadeUp">
            <h1 style={{
              fontSize: 'clamp(48px, 12vw, 96px)',
              fontWeight: '700',
              textAlign: 'center',
              letterSpacing: '-0.025em',
              color: '#f5f5f7',
              marginBottom: 'clamp(20px, 4vw, 32px)',
              lineHeight: '1.04',
            }}>
              Feel the Flavor
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={100}>
            <p style={{ 
              textAlign: 'center', 
              margin: '0 auto', 
              fontSize: 'clamp(19px, 4vw, 28px)', 
              color: 'rgba(245,245,247,0.8)', 
              maxWidth: '520px', 
              lineHeight: '1.4',
              fontWeight: '400',
              letterSpacing: '-0.016em',
              marginBottom: 'clamp(40px, 8vw, 56px)',
            }}>
              Fresh. Frozen. Fantastic. Smoothies that make you smile.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={200}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <Link href="/products" style={{
                fontSize: '17px',
                fontWeight: '500',
                padding: '18px 44px',
                background: '#ffffff',
                color: '#1d1d1f',
                borderRadius: '980px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                letterSpacing: '-0.022em',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.92)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                Shop Now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <span style={{
                fontSize: '14px',
                color: 'rgba(245,245,247,0.5)',
                letterSpacing: '-0.016em',
                fontWeight: '400',
              }}>
                Free shipping on orders over $50
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Scrolling Marquee Banner */}
      <div style={{
        background: '#000000',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
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
                    color: 'rgba(255,255,255,0.6)',
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

      {/* Featured In Press Logos - Scrolling Marquee */}
      <div style={{
        background: '#000000',
        padding: '24px 0',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
      }}>
        <div 
          className="marquee-track"
          style={{
            display: 'flex',
            animation: 'marqueeScroll 30s linear infinite',
            width: 'max-content',
          }}
        >
          {[...Array(4)].map((_, repeatIndex) => (
            <div key={repeatIndex} style={{ display: 'flex', alignItems: 'center' }}>
              {/* TODAY Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 48px' }}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="white" strokeWidth="2"/>
                  <circle cx="16" cy="10" r="3" fill="white"/>
                  <path d="M16 14v10M12 18h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: '700', 
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                  whiteSpace: 'nowrap',
                }}>TODAY</span>
              </div>
              
              {/* Business Insider */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                lineHeight: '1.1',
                padding: '0 48px',
              }}>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: '400', 
                  color: '#ffffff',
                  letterSpacing: '1px',
                  whiteSpace: 'nowrap',
                }}>BUSINESS</span>
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: '700', 
                  color: '#ffffff',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                }}>INSIDER</span>
              </div>
              
              {/* Forbes */}
              <span style={{ 
                fontSize: '20px', 
                fontWeight: '400', 
                color: '#ffffff',
                fontStyle: 'italic',
                letterSpacing: '1px',
                padding: '0 48px',
                whiteSpace: 'nowrap',
              }}>Forbes</span>
              
              {/* The Guardian */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 48px' }}>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '400', 
                  color: '#ffffff',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                }}>The</span>
                <span style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: '#ffffff',
                  marginLeft: '4px',
                  fontStyle: 'italic',
                  whiteSpace: 'nowrap',
                }}>Guardian</span>
              </div>
              
              {/* Inc. Best Workplaces */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'baseline',
                gap: '4px',
                padding: '0 48px',
              }}>
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: '400', 
                  color: '#ffffff',
                  fontStyle: 'italic',
                  whiteSpace: 'nowrap',
                }}>Inc.</span>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                  <span style={{ 
                    fontSize: '9px', 
                    fontWeight: '700', 
                    color: '#ffffff',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                  }}>Best</span>
                  <span style={{ 
                    fontSize: '9px', 
                    fontWeight: '700', 
                    color: '#ffffff',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                  }}>Workplaces</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Grid */}
      <section style={{ padding: 'clamp(64px, 10vw, 100px) 0', background: '#000000' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: 'clamp(24px, 5vw, 80px)', paddingRight: 'clamp(24px, 5vw, 80px)' }}>
          <AnimatedSection animation="fadeUp" style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 56px)' }}>
            <h2 style={{ 
              fontSize: 'clamp(32px, 6vw, 48px)', 
              fontWeight: '600', 
              marginBottom: '16px', 
              color: '#f5f5f7',
              letterSpacing: '-0.018em',
              lineHeight: '1.08',
            }}>
              Shop by Category
            </h2>
            <p style={{ 
              fontSize: 'clamp(17px, 3vw, 21px)', 
              color: '#86868b', 
              margin: '0 auto', 
              maxWidth: '480px', 
              lineHeight: '1.5',
              letterSpacing: '-0.016em',
            }}>
              Explore our complete collection of wellness products.
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
                background: '#ffffff',
                border: 'none',
                borderRadius: '980px',
                textDecoration: 'none',
                color: '#000000',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.85)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h3 style={{
                  fontSize: '17px',
                  fontWeight: '500',
                  margin: 0,
                  letterSpacing: '-0.022em',
                  color: '#1d1d1f',
                }}>
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) 0', background: '#000000', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: 'clamp(24px, 5vw, 80px)', paddingRight: 'clamp(24px, 5vw, 80px)' }}>
          <AnimatedSection animation="fadeUp" style={{ marginBottom: 'clamp(40px, 6vw, 64px)' }}>
            <h2 style={{ 
              fontSize: 'clamp(32px, 6vw, 48px)', 
              fontWeight: '600', 
              marginBottom: '16px', 
              color: '#f5f5f7',
              letterSpacing: '-0.018em',
              lineHeight: '1.08',
            }}>
              Popular Products
            </h2>
            <p style={{ 
              fontSize: 'clamp(17px, 3vw, 21px)', 
              color: '#86868b', 
              margin: '0', 
              maxWidth: '480px', 
              lineHeight: '1.5',
              letterSpacing: '-0.016em',
            }}>
              Customer favorites crafted for wellness.
            </p>
          </AnimatedSection>

          {/* Carousel Container */}
          <div style={{ position: 'relative', paddingLeft: 'clamp(50px, 8vw, 70px)', paddingRight: 'clamp(50px, 8vw, 70px)' }}>
            {/* Left Arrow - Apple Style White */}
            <button
              onClick={() => scroll('left')}
              style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#ffffff',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                color: '#1d1d1f',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
              }}
            >
              <AppleArrowLeft />
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
                    color: '#ffffff',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Product Image - Apple Style White Box */}
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    height: '300px',
                    marginBottom: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                    }}
                  >
                    {/* Badge */}
                    {product.badge && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: product.badge === 'New' ? '#22c55e' : '#fff',
                        color: product.badge === 'New' ? '#fff' : '#000',
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
                    fontSize: '19px',
                    fontWeight: '600',
                    marginBottom: '6px',
                    letterSpacing: '-0.012em',
                    color: '#f5f5f7',
                    lineHeight: '1.21',
                  }}>
                    {product.name}
                  </h3>

                  {/* Category */}
                  <p style={{
                    fontSize: '14px',
                    color: '#86868b',
                    marginBottom: '0',
                    letterSpacing: '-0.016em',
                    lineHeight: '1.43',
                  }}>
                    Smoothie
                  </p>
                </Link>
              ))}
            </div>

            {/* Right Arrow - Apple Style White */}
            <button
              onClick={() => scroll('right')}
              style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#ffffff',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                color: '#1d1d1f',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
              }}
            >
              <AppleArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Experts Section - Apple Style White Boxes */}
      <section style={{
        background: '#000',
        padding: 'clamp(80px, 10vw, 120px) 0',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
        }}>
          <p style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#6e6e73',
            textAlign: 'center',
            marginBottom: '12px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            OVER 50K FIVE STAR REVIEWS
          </p>
          <h2 style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: '600',
            marginBottom: '16px',
            letterSpacing: '-0.018em',
            textAlign: 'center',
            color: '#f5f5f7',
            lineHeight: '1.08',
          }}>
            Join the Movement
          </h2>
          <p style={{
            fontSize: 'clamp(17px, 3vw, 21px)',
            color: '#86868b',
            textAlign: 'center',
            letterSpacing: '-0.016em',
            maxWidth: '520px',
            margin: '0 auto clamp(40px, 6vw, 56px) auto',
            lineHeight: '1.5',
          }}>
            Trusted by over 2 million wellness enthusiasts worldwide.
          </p>

          {/* Apple Style Card Carousel */}
          <div style={{ position: 'relative', padding: '0 60px' }}>
            {/* Left Arrow - Apple Style */}
            <button
              onClick={() => setExpertPosition(prev => (prev - 1 + EXPERTS.length) % EXPERTS.length)}
              style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#ffffff',
                border: 'none',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                color: '#1d1d1f',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 10,
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'stretch',
              justifyContent: 'center',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              padding: '8px 0',
            }}>
              {[...EXPERTS, ...EXPERTS].slice(expertPosition, expertPosition + 5).map((expert, idx) => (
                <div 
                  key={`${expert.id}-${idx}`} 
                  style={{
                    flexShrink: 0,
                    width: '240px',
                    height: '340px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    background: '#ffffff',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                  onClick={() => {
                    setUnMutedExpert(unMutedExpert === expert.id ? null : expert.id);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Category Label */}
                  <div style={{
                    padding: '20px 20px 0 20px',
                  }}>
                    <p style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#bf4800',
                      margin: 0,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                    }}>
                      EXPERT REVIEW
                    </p>
                    <h3 style={{
                      fontSize: '21px',
                      fontWeight: '600',
                      color: '#1d1d1f',
                      margin: '6px 0 0 0',
                      lineHeight: '1.2',
                      letterSpacing: '-0.01em',
                    }}>
                      {expert.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#86868b',
                      margin: '4px 0 0 0',
                      lineHeight: '1.4',
                    }}>
                      "{expert.quote}"
                    </p>
                  </div>
                  {/* Video Container */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '180px',
                    overflow: 'hidden',
                  }}>
                    <video
                      src={expert.video}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      loop
                      autoPlay
                      muted={unMutedExpert !== expert.id}
                      playsInline
                    />
                    {/* Play Button Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(4px)',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <polygon points="8 5 19 12 8 19 8 5" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow - Apple Style */}
            <button
              onClick={() => setExpertPosition(prev => (prev + 1) % EXPERTS.length)}
              style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#ffffff',
                border: 'none',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                color: '#1d1d1f',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 10,
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Customers Section - Apple Style White Boxes */}
      <section style={{
        background: '#000',
        padding: 'clamp(80px, 10vw, 120px) 0',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: '600',
            marginBottom: 'clamp(40px, 6vw, 56px)',
            letterSpacing: '-0.018em',
            textAlign: 'center',
            color: '#f5f5f7',
            lineHeight: '1.08',
          }}>
            Loved by Customers
          </h2>

          {/* Apple Style Card Carousel */}
          <div style={{ position: 'relative', padding: '0 60px' }}>
            {/* Left Arrow - Apple Style */}
            <button
              onClick={() => setCustomerPosition(prev => (prev - 1 + CUSTOMERS.length) % CUSTOMERS.length)}
              style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#ffffff',
                border: 'none',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                color: '#1d1d1f',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 10,
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'stretch',
              justifyContent: 'center',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              padding: '8px 0',
            }}>
              {[...CUSTOMERS, ...CUSTOMERS].slice(customerPosition, customerPosition + 5).map((customer, idx) => (
                <div 
                  key={`${customer.id}-${idx}`} 
                  style={{
                    flexShrink: 0,
                    width: '240px',
                    height: '340px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    background: '#ffffff',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                  onClick={() => {
                    setUnMutedCustomer(unMutedCustomer === customer.id ? null : customer.id);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Category Label */}
                  <div style={{
                    padding: '20px 20px 0 20px',
                  }}>
                    <p style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#0066cc',
                      margin: 0,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                    }}>
                      CUSTOMER REVIEW
                    </p>
                    <h3 style={{
                      fontSize: '21px',
                      fontWeight: '600',
                      color: '#1d1d1f',
                      margin: '6px 0 0 0',
                      lineHeight: '1.2',
                      letterSpacing: '-0.01em',
                    }}>
                      {customer.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#86868b',
                      margin: '4px 0 0 0',
                      lineHeight: '1.4',
                    }}>
                      "{customer.quote}"
                    </p>
                  </div>
                  {/* Video Container */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '180px',
                    overflow: 'hidden',
                  }}>
                    <video
                      src={customer.video}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      loop
                      autoPlay
                      muted={unMutedCustomer !== customer.id}
                      playsInline
                    />
                    {/* Play Button Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(4px)',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <polygon points="8 5 19 12 8 19 8 5" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow - Apple Style */}
            <button
              onClick={() => setCustomerPosition(prev => (prev + 1) % CUSTOMERS.length)}
              style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#ffffff',
                border: 'none',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                color: '#1d1d1f',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 10,
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', marginTop: '56px' }}>
            <Link href="/collections/smoothies" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 32px',
              background: '#ffffff',
              color: '#1d1d1f',
              textDecoration: 'none',
              borderRadius: '980px',
              fontSize: '17px',
              fontWeight: '500',
              letterSpacing: '-0.022em',
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Shop All Reviews
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: '#000000',
        padding: 'clamp(100px, 14vw, 180px) 0',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
        }}>
        <h2 style={{
          fontSize: 'clamp(32px, 6vw, 56px)',
          marginBottom: '24px',
          fontWeight: '600',
          letterSpacing: '-0.022em',
          color: '#f5f5f7',
          lineHeight: '1.08',
        }}>
          Start Your Wellness Journey
        </h2>
        <p style={{
          fontSize: 'clamp(17px, 3vw, 21px)',
          color: '#86868b',
          maxWidth: '520px',
          margin: '0 auto 48px auto',
          lineHeight: '1.5',
          letterSpacing: '-0.016em',
        }}>
          Join thousands who have made wellness a daily habit.
        </p>
        <Link href="/auth" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '18px 44px',
          background: '#ffffff',
          color: '#1d1d1f',
          textDecoration: 'none',
          borderRadius: '980px',
          fontSize: '17px',
          fontWeight: '500',
          transition: 'all 0.3s ease',
          letterSpacing: '-0.022em',
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Get Started
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
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
