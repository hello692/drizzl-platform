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
  const [productPosition, setProductPosition] = useState(0);
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
      <section className="hero-section">
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
        
        <div className="hero-content">
          <AnimatedSection animation="fadeUp">
            <h1 className="hero-title">
              Feel the Flavor
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={100}>
            <p className="hero-subtitle">
              Fresh. Frozen. Fantastic. Smoothies that make you smile.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={200}>
            <div className="hero-cta-container">
              <Link href="/products" className="hero-btn">
                Shop Now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <span className="hero-shipping-text">
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

      {/* Drizzl Kiss Section */}
      <section className="drizzl-kiss-section">
        <div className="drizzl-kiss-container">
          <div className="drizzl-kiss-content">
            <img 
              src="/drizzl-lips.gif" 
              alt="Drizzl Wellness Kiss" 
              className="drizzl-kiss-gif"
            />
            <div className="drizzl-kiss-text">
              <h2 className="drizzl-kiss-title">
                One Sip. Pure Bliss.
              </h2>
              <p className="drizzl-kiss-subtitle">
                Every Drizzl smoothie is a love letter to your body. Crafted with organic superfoods, 
                zero artificial anything, and enough flavor to make your taste buds fall in love. 
                This isn't just a smoothie — it's self-care you can drink.
              </p>
              <p className="drizzl-kiss-tagline">
                Kiss boring goodbye. Drizzl on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="category-section">
        <div className="category-container">
          <AnimatedSection animation="fadeUp" className="category-header">
            <h2 className="category-title">
              Shop by Category
            </h2>
            <p className="category-subtitle">
              Explore our complete collection of wellness products.
            </p>
          </AnimatedSection>
          <div className="category-grid">
            {CATEGORIES.map((category) => (
              <Link key={category.slug} href={`/products?category=${category.slug}`} className="category-card">
                <h3 className="category-card-title">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products - SAME structure as expert/customer sections */}
      <section className="video-section">
        <div className="video-section-container">
          <h2 className="video-section-title">
            Popular Products
          </h2>
          <p className="video-section-subtitle">
            Customer favorites crafted for wellness.
          </p>

          <div className="video-carousel-wrapper">
            <button
              onClick={() => setProductPosition(prev => (prev - 1 + POPULAR_SMOOTHIES.length) % POPULAR_SMOOTHIES.length)}
              className="carousel-arrow carousel-arrow-left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="video-carousel-track">
              {[...POPULAR_SMOOTHIES, ...POPULAR_SMOOTHIES].slice(productPosition, productPosition + 5).map((product, index) => (
                <div key={`${product.id}-${index}`} className="video-card">
                  <div className="video-card-header">
                    <p className="video-card-label" style={{ color: product.badge === 'New' ? '#22c55e' : '#E85A71' }}>
                      {product.badge || 'SMOOTHIE'}
                    </p>
                    <h3 className="video-card-name">
                      {product.name}
                    </h3>
                    <p className="video-card-quote">
                      Smoothie
                    </p>
                  </div>
                  <div className="video-card-video-container" style={{ background: '#f5f5f7' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      draggable={false}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setProductPosition(prev => (prev + 1) % POPULAR_SMOOTHIES.length)}
              className="carousel-arrow carousel-arrow-right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Experts Section - Apple Style White Boxes */}
      <section className="video-section">
        <div className="video-section-container">
          <p className="video-section-eyebrow">
            OVER 50K FIVE STAR REVIEWS
          </p>
          <h2 className="video-section-title">
            Join the Movement
          </h2>
          <p className="video-section-subtitle">
            Trusted by over 2 million wellness enthusiasts worldwide.
          </p>

          {/* Apple Style Card Carousel */}
          <div className="video-carousel-wrapper">
            {/* Left Arrow - Apple Style (hidden on mobile) */}
            <button
              onClick={() => setExpertPosition(prev => (prev - 1 + EXPERTS.length) % EXPERTS.length)}
              className="carousel-arrow carousel-arrow-left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="video-carousel-track">
              {[...EXPERTS, ...EXPERTS].slice(expertPosition, expertPosition + 5).map((expert, idx) => (
                <div 
                  key={`${expert.id}-${idx}`} 
                  className="video-card"
                  onClick={() => {
                    setUnMutedExpert(unMutedExpert === expert.id ? null : expert.id);
                  }}
                >
                  {/* Category Label */}
                  <div className="video-card-header">
                    <p className="video-card-label video-card-label-expert">
                      EXPERT REVIEW
                    </p>
                    <h3 className="video-card-name">
                      {expert.name}
                    </h3>
                    <p className="video-card-quote">
                      "{expert.quote}"
                    </p>
                  </div>
                  {/* Video Container */}
                  <div className="video-card-video-container">
                    <video
                      src={expert.video}
                      className="video-card-video"
                      loop
                      autoPlay
                      muted={unMutedExpert !== expert.id}
                      playsInline
                    />
                    {/* Play Button Overlay */}
                    <div className="video-card-play-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <polygon points="8 5 19 12 8 19 8 5" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow - Apple Style (hidden on mobile) */}
            <button
              onClick={() => setExpertPosition(prev => (prev + 1) % EXPERTS.length)}
              className="carousel-arrow carousel-arrow-right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Customers Section - Apple Style White Boxes */}
      <section className="video-section">
        <div className="video-section-container">
          <h2 className="video-section-title" style={{ marginBottom: 'clamp(32px, 5vw, 56px)' }}>
            Loved by Customers
          </h2>

          {/* Apple Style Card Carousel */}
          <div className="video-carousel-wrapper">
            {/* Left Arrow - Apple Style (hidden on mobile) */}
            <button
              onClick={() => setCustomerPosition(prev => (prev - 1 + CUSTOMERS.length) % CUSTOMERS.length)}
              className="carousel-arrow carousel-arrow-left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="video-carousel-track">
              {[...CUSTOMERS, ...CUSTOMERS].slice(customerPosition, customerPosition + 5).map((customer, idx) => (
                <div 
                  key={`${customer.id}-${idx}`} 
                  className="video-card"
                  onClick={() => {
                    setUnMutedCustomer(unMutedCustomer === customer.id ? null : customer.id);
                  }}
                >
                  {/* Category Label */}
                  <div className="video-card-header">
                    <p className="video-card-label video-card-label-customer">
                      CUSTOMER REVIEW
                    </p>
                    <h3 className="video-card-name">
                      {customer.name}
                    </h3>
                    <p className="video-card-quote">
                      "{customer.quote}"
                    </p>
                  </div>
                  {/* Video Container */}
                  <div className="video-card-video-container">
                    <video
                      src={customer.video}
                      className="video-card-video"
                      loop
                      autoPlay
                      muted={unMutedCustomer !== customer.id}
                      playsInline
                    />
                    {/* Play Button Overlay */}
                    <div className="video-card-play-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <polygon points="8 5 19 12 8 19 8 5" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow - Apple Style (hidden on mobile) */}
            <button
              onClick={() => setCustomerPosition(prev => (prev + 1) % CUSTOMERS.length)}
              className="carousel-arrow carousel-arrow-right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', marginTop: 'clamp(32px, 5vw, 56px)' }}>
            <Link href="/collections/smoothies" className="cta-btn">
              Shop All Reviews
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">
            Start Your Wellness Journey
          </h2>
          <p className="cta-subtitle">
            Join thousands who have made wellness a daily habit.
          </p>
          <Link href="/auth" className="cta-btn">
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
