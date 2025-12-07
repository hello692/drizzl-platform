import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothieCard from '../components/SmoothieCard';
import { AnimatedSection, AnimatedText, StaggeredGrid } from '../components/ScrollAnimations';
import { getMessages } from '../lib/getMessages';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

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

const ROTATING_WORDS = [
  'Good',
  'Flavor',
  'Alive',
  'Happy',
  'Better',
  'Me',
];

const BENEFITS = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: 'Energy & Focus',
    description: 'Sustained energy without the crash. Natural ingredients that fuel your mind and body throughout the day.'
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Immune Support',
    description: 'Packed with vitamins, antioxidants, and superfoods that strengthen your body\'s natural defenses.'
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 12h8"/>
        <path d="M12 8v8"/>
      </svg>
    ),
    title: 'Gut Health',
    description: 'Fiber-rich blends with prebiotics that promote digestive wellness and a healthy microbiome.'
  }
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose your flavors',
    description: 'Pick from our menu of chef-crafted, dietitian-approved smoothie flavors.'
  },
  {
    step: '02',
    title: 'Blend in seconds',
    description: 'Add your liquid of choice, blend for 30 seconds, and you\'re done.'
  },
  {
    step: '03',
    title: 'Feel the difference',
    description: 'Experience the boost of real nutrition with every delicious sip.'
  }
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
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
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

  useEffect(() => {
    const interval = setInterval(() => {
      setExpertPosition(prev => (prev + 1) % EXPERTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCustomerPosition(prev => (prev + 1) % CUSTOMERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentWord = ROTATING_WORDS[currentWordIndex];
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (charIndex <= currentWord.length) {
        setDisplayedText(currentWord.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        
        setTimeout(() => {
          let deleteIndex = currentWord.length;
          const deleteInterval = setInterval(() => {
            if (deleteIndex >= 0) {
              setDisplayedText(currentWord.slice(0, deleteIndex));
              deleteIndex--;
            } else {
              clearInterval(deleteInterval);
              setCurrentWordIndex(prev => (prev + 1) % ROTATING_WORDS.length);
              setIsTyping(true);
            }
          }, 80);
        }, 2500);
      }
    }, 150);
    
    return () => clearInterval(typeInterval);
  }, [currentWordIndex]);

  const sectionStyles = {
    padding: 'clamp(80px, 12vw, 140px) clamp(24px, 6vw, 100px)',
    maxWidth: '1280px',
    margin: '0 auto',
  };

  const headingStyles = {
    fontSize: 'clamp(32px, 6vw, 56px)',
    fontWeight: 600,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    color: '#ffffff',
    marginBottom: '24px',
  };

  const subheadingStyles = {
    fontSize: 'clamp(16px, 2vw, 18px)',
    fontWeight: 400,
    lineHeight: 1.6,
    color: '#a1a1a6',
    maxWidth: '600px',
  };

  return (
    <>
      <Navbar />

      {/* 1. Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        overflow: 'hidden',
      }}>
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
            opacity: 0.6,
          }}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
          zIndex: 1,
        }}></div>
        
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: '960px',
        }}>
          <AnimatedSection animation="fadeUp">
            <h1 style={{
              fontSize: 'clamp(48px, 12vw, 96px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '24px',
            }}>
              <span>I Feel </span>
              <span style={{
                display: 'inline-block',
                minWidth: '2ch',
                borderRight: '3px solid #ffffff',
                animation: 'blink 1s step-end infinite',
              }}>
                {displayedText}
              </span>
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={100}>
            <p style={{
              fontSize: 'clamp(18px, 3vw, 24px)',
              fontWeight: 400,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '40px',
            }}>
              Fresh. Frozen. Fantastic.<br />
              Smoothies that make you feel good.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={200}>
            <Link href="/products" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#ffffff',
              color: '#000000',
              padding: '18px 40px',
              borderRadius: '980px',
              fontSize: '16px',
              fontWeight: 500,
              letterSpacing: '0.02em',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}>
              Shop Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* 2. Feature Banner - Scrolling Marquee */}
      <div style={{
        background: '#000000',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        padding: '18px 0',
      }}>
        <div 
          style={{
            display: 'flex',
            animation: 'marqueeScroll 25s linear infinite',
            width: 'max-content',
          }}
        >
          {[...Array(3)].map((_, repeatIndex) => (
            <div key={repeatIndex} style={{ display: 'flex', alignItems: 'center' }}>
              {['GLUTEN FREE', 'BUILT ON ORGANIC', 'DAIRY FREE', 'NO ADDED SUGAR', 'NON-GMO', 'VEGAN'].map((text, idx) => (
                <span 
                  key={`${repeatIndex}-${idx}`}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.5)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '0 48px',
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

      {/* 3. Why Drizzl Section */}
      <section style={{
        background: '#000000',
        padding: 'clamp(80px, 12vw, 140px) clamp(24px, 6vw, 100px)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
          gap: 'clamp(48px, 8vw, 80px)',
          alignItems: 'center',
        }}>
          <AnimatedSection animation="fadeUp">
            <div style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              aspectRatio: '4/3',
            }}>
              <img 
                src="/products/strawberry-peach/lifestyle-1.jpg" 
                alt="Drizzl Smoothie"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fadeUp" delay={100}>
            <div>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#6e6e73',
                marginBottom: '16px',
                display: 'block',
              }}>
                WHY DRIZZL
              </span>
              <h2 style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '24px',
              }}>
                The smoothie that changed everything
              </h2>
              <p style={{
                fontSize: 'clamp(16px, 2vw, 18px)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: '#a1a1a6',
                marginBottom: '32px',
              }}>
                We believe wellness should be simple, delicious, and accessible. Our chef-crafted blends 
                use only premium organic ingredients — flash-frozen at peak freshness to lock in nutrients 
                and flavor. No prep, no waste, no compromise.
              </p>
              <Link href="/our-story" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 500,
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.3)',
                paddingBottom: '4px',
                transition: 'all 0.2s ease',
              }}>
                Learn more about us
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 4. Benefits Grid */}
      <section style={{
        background: '#0a0a0a',
        padding: 'clamp(80px, 12vw, 140px) clamp(24px, 6vw, 100px)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 80px)' }}>
              <h2 style={{
                ...headingStyles,
                marginBottom: '16px',
              }}>
                Fuel your best self
              </h2>
              <p style={{
                ...subheadingStyles,
                margin: '0 auto',
              }}>
                Every sip delivers real nutrition designed for how you live.
              </p>
            </div>
          </AnimatedSection>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '32px',
          }}>
            {BENEFITS.map((benefit, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={index * 100}>
                <div style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '40px 32px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: '#ffffff',
                  }}>
                    {benefit.icon}
                  </div>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '12px',
                  }}>
                    {benefit.title}
                  </h3>
                  <p style={{
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: '#a1a1a6',
                  }}>
                    {benefit.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section style={{
        background: '#000000',
        padding: 'clamp(80px, 12vw, 140px) clamp(24px, 6vw, 100px)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 80px)' }}>
              <h2 style={{
                ...headingStyles,
                marginBottom: '16px',
              }}>
                How it works
              </h2>
              <p style={{
                ...subheadingStyles,
                margin: '0 auto',
              }}>
                From freezer to table in under a minute.
              </p>
            </div>
          </AnimatedSection>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '48px',
          }}>
            {HOW_IT_WORKS.map((item, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={index * 100}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '64px',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.1)',
                    lineHeight: 1,
                    marginBottom: '24px',
                    fontFamily: 'var(--font-display)',
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '12px',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    lineHeight: 1.6,
                    color: '#a1a1a6',
                    maxWidth: '280px',
                    margin: '0 auto',
                  }}>
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Product Carousel */}
      <section className="video-section" style={{ background: '#0a0a0a' }}>
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
                <SmoothieCard
                  key={`${product.id}-${index}`}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  badge={product.badge || 'BEST SELLER'}
                />
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

      {/* 7. Comparison Table */}
      <section style={{
        background: '#000000',
        padding: 'clamp(80px, 12vw, 140px) clamp(24px, 6vw, 100px)',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 64px)' }}>
              <h2 style={{
                ...headingStyles,
                marginBottom: '16px',
              }}>
                Why choose Drizzl?
              </h2>
              <p style={{
                ...subheadingStyles,
                margin: '0 auto',
              }}>
                The smarter way to get your daily nutrition.
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="fadeUp" delay={100}>
            <div style={{
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr repeat(4, 1fr)',
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{ padding: '20px 24px' }}></div>
                <div style={{ padding: '20px 16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#a1a1a6' }}>Juice Bars</div>
                <div style={{ padding: '20px 16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#a1a1a6' }}>Bottled</div>
                <div style={{ padding: '20px 16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#a1a1a6' }}>DIY</div>
                <div style={{ padding: '20px 16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#ffffff', background: 'rgba(255,255,255,0.05)' }}>Drizzl</div>
              </div>
              
              {[
                { feature: 'Price per serving', values: ['$12+', '$6-8', '$5-10', '$4.99'] },
                { feature: 'Fresh ingredients', values: ['✓', '✗', '✓', '✓'] },
                { feature: 'No preservatives', values: ['✓', '✗', '✓', '✓'] },
                { feature: 'Ready in seconds', values: ['✗', '✓', '✗', '✓'] },
                { feature: 'No prep or cleanup', values: ['✓', '✓', '✗', '✓'] },
                { feature: 'Consistent quality', values: ['Varies', '✓', 'Varies', '✓'] },
              ].map((row, rowIndex) => (
                <div key={rowIndex} style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr repeat(4, 1fr)',
                  borderBottom: rowIndex < 5 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div style={{ padding: '16px 24px', fontSize: '15px', color: '#ffffff' }}>{row.feature}</div>
                  {row.values.map((value, colIndex) => (
                    <div key={colIndex} style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontSize: '14px',
                      color: value === '✓' ? '#22c55e' : value === '✗' ? '#ef4444' : '#a1a1a6',
                      background: colIndex === 3 ? 'rgba(255,255,255,0.03)' : 'transparent',
                    }}>
                      {value}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 8. Social Proof - Experts Section */}
      <section className="video-section">
        <div className="video-section-container">
          <p className="video-section-eyebrow">
            OVER 50K FIVE STAR REVIEWS
          </p>
          <h2 className="video-section-title">
            Trusted by Experts
          </h2>
          <p className="video-section-subtitle">
            See what healthcare professionals are saying.
          </p>

          <div className="video-carousel-wrapper">
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
                  <div className="video-card-video-container">
                    <video
                      src={expert.video}
                      className="video-card-video"
                      loop
                      autoPlay
                      muted={unMutedExpert !== expert.id}
                      playsInline
                    />
                    <div className="video-card-play-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <polygon points="8 5 19 12 8 19 8 5" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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

      {/* Customer Reviews Section */}
      <section className="video-section">
        <div className="video-section-container">
          <h2 className="video-section-title" style={{ marginBottom: 'clamp(32px, 5vw, 56px)' }}>
            Loved by Customers
          </h2>

          <div className="video-carousel-wrapper">
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
                  <div className="video-card-video-container">
                    <video
                      src={customer.video}
                      className="video-card-video"
                      loop
                      autoPlay
                      muted={unMutedCustomer !== customer.id}
                      playsInline
                    />
                    <div className="video-card-play-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <polygon points="8 5 19 12 8 19 8 5" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCustomerPosition(prev => (prev + 1) % CUSTOMERS.length)}
              className="carousel-arrow carousel-arrow-right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 9. CTA Banner */}
      <section style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
        padding: 'clamp(80px, 12vw, 140px) clamp(24px, 6vw, 100px)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <AnimatedSection animation="fadeUp">
            <h2 style={{
              fontSize: 'clamp(36px, 7vw, 64px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '24px',
            }}>
              Ready to feel better?
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={100}>
            <p style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              fontWeight: 400,
              lineHeight: 1.6,
              color: '#a1a1a6',
              marginBottom: '40px',
            }}>
              Join thousands who have made wellness a daily habit.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={200}>
            <Link href="/products" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#ffffff',
              color: '#000000',
              padding: '18px 48px',
              borderRadius: '980px',
              fontSize: '16px',
              fontWeight: 500,
              letterSpacing: '0.02em',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}>
              Shop Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* 10. Footer */}
      <Footer />

      <style jsx>{`
        @keyframes blink {
          0%, 100% { border-color: #ffffff; }
          50% { border-color: transparent; }
        }
      `}</style>
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
