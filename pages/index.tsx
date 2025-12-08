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
  { word: 'nourished', color: '#22c55e' },  // Matcha green
  { word: 'fueled', color: '#f97316' },     // Mango orange
  { word: 'strong', color: '#ec4899' },     // Pink Piyata
  { word: 'happy', color: '#facc15' },      // Banana yellow
  { word: 'relaxed', color: '#8b5cf6' },    // Acai purple
  { word: 'glowing', color: '#ef4444' },    // Strawberry red
  { word: 'balanced', color: '#06b6d4' },   // Cyan
];

const BENEFITS = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="23" stroke="url(#grad1)" strokeWidth="2"/>
        <path d="M24 12v8l6 4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 28c0 4.4 3.6 8 8 8s8-3.6 8-8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="3" fill="#ffffff"/>
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'Energy & Focus',
    description: 'Sustained energy without the crash. Natural ingredients that fuel your mind and body throughout the day.'
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 4L8 14v12c0 10.5 6.8 20.3 16 24 9.2-3.7 16-13.5 16-24V14L24 4z" stroke="url(#grad2)" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M17 24l5 5 9-9" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="grad2" x1="8" y1="4" x2="40" y2="40">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'Immune Support',
    description: 'Packed with vitamins, antioxidants, and superfoods that strengthen your body\'s natural defenses.'
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="24" rx="18" ry="10" stroke="url(#grad3)" strokeWidth="2"/>
        <ellipse cx="24" cy="24" rx="10" ry="18" stroke="url(#grad3)" strokeWidth="2"/>
        <circle cx="24" cy="24" r="6" stroke="#ffffff" strokeWidth="2"/>
        <circle cx="24" cy="24" r="2" fill="#ffffff"/>
        <defs>
          <linearGradient id="grad3" x1="6" y1="6" x2="42" y2="42">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'Gut Health',
    description: 'Fiber-rich blends with prebiotics that promote digestive wellness and a healthy microbiome.'
  }
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Pick your vibe',
    description: 'Choose from 10+ chef-crafted flavors. Energy boost? Gut reset? We\'ve got you.'
  },
  {
    step: '02',
    title: 'Blend. Done.',
    description: 'Add oat milk, almond milk, or just water. Blend 30 seconds. That\'s literally it.'
  },
  {
    step: '03',
    title: 'Sip. Smile. Repeat.',
    description: 'Your new morning ritual starts now. No cleanup, no regrets, just good vibes.'
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
    const currentItem = ROTATING_WORDS[currentWordIndex];
    const currentWord = currentItem.word;
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
          }, 60);
        }, 1800);
      }
    }, 120);
    
    return () => clearInterval(typeInterval);
  }, [currentWordIndex]);

  const sectionStyles = {
    padding: 'var(--section-padding-y) var(--section-padding-x)',
    maxWidth: '1280px',
    margin: '0 auto',
  };

  const headingStyles = {
    fontSize: 'var(--fs-h2)',
    fontWeight: 600,
    lineHeight: 1.15,
    letterSpacing: '-0.015em',
    color: '#ffffff',
    marginBottom: 'var(--space-after-h2)',
  };

  const subheadingStyles = {
    fontSize: 'var(--fs-body)',
    fontWeight: 400,
    lineHeight: 1.6,
    color: '#86868b',
    maxWidth: 'var(--text-max-width)',
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
              fontSize: 'var(--fs-h1)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              marginBottom: 'var(--space-after-h1)',
            }}>
              <span>i am </span>
              <span style={{
                display: 'inline-block',
                minWidth: '2ch',
                borderRight: `3px solid ${ROTATING_WORDS[currentWordIndex].color}`,
                animation: 'blink 1s step-end infinite',
                color: ROTATING_WORDS[currentWordIndex].color,
                transition: 'color 0.3s ease',
              }}>
                {displayedText}
              </span>
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={100}>
            <p style={{
              fontSize: 'var(--fs-lead)',
              fontWeight: 400,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '32px',
              maxWidth: 'var(--text-max-width)',
              margin: '0 auto 32px',
            }}>
              Fresh. Frozen. Fantastic.<br />
              Smoothies for people who want to feel their best.
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
              fontSize: 'var(--fs-body)',
              fontWeight: 500,
              letterSpacing: '0.02em',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}>
              Feel Your Best
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <p style={{
              fontSize: 'var(--fs-small)',
              color: 'rgba(255,255,255,0.5)',
              marginTop: '16px',
            }}>
              Free shipping on orders $50+ · 100% money-back guarantee
            </p>
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

      {/* Press Logos Marquee */}
      <div style={{
        background: '#000000',
        padding: '24px 0',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
      }}>
        <div 
          style={{
            display: 'flex',
            animation: 'marqueeScroll 30s linear infinite',
            width: 'max-content',
          }}
        >
          {[...Array(4)].map((_, repeatIndex) => (
            <div key={repeatIndex} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 48px' }}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="white" strokeWidth="2"/>
                  <circle cx="16" cy="10" r="3" fill="white"/>
                  <path d="M16 14v10M12 18h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>TODAY</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1, padding: '0 48px' }}>
                <span style={{ fontSize: '10px', fontWeight: 400, color: '#ffffff', letterSpacing: '1px', whiteSpace: 'nowrap' }}>BUSINESS</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>INSIDER</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 400, color: '#ffffff', fontStyle: 'italic', letterSpacing: '1px', padding: '0 48px', whiteSpace: 'nowrap' }}>Forbes</span>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 48px' }}>
                <span style={{ fontSize: '12px', fontWeight: 400, color: '#ffffff', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>The</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginLeft: '4px', fontStyle: 'italic', whiteSpace: 'nowrap' }}>Guardian</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', padding: '0 48px' }}>
                <span style={{ fontSize: '16px', fontWeight: 400, color: '#ffffff', fontStyle: 'italic', whiteSpace: 'nowrap' }}>Inc.</span>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Best</span>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Workplaces</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drizzl Kiss Section - Brand Signature */}
      <section className="drizzl-kiss-section">
        <div className="drizzl-kiss-container">
          <div className="drizzl-kiss-content">
            <div className="drizzl-kiss-gif-wrapper">
              <img 
                src="/drizzl-lips.gif" 
                alt="Drizzl Wellness Kiss" 
                className="drizzl-kiss-gif"
              />
            </div>
            <div className="drizzl-kiss-text">
              <h2 className="drizzl-kiss-title">
                One Sip. Pure Bliss.
              </h2>
              <p className="drizzl-kiss-subtitle">
                Close your eyes. Take a sip. Feel it. That rush of flavor, that moment of calm, 
                that little voice saying "yes, this is exactly what I needed." This isn't just a smoothie — 
                it's your moment. Your ritual. Your daily act of self-love.
              </p>
              <p className="drizzl-kiss-tagline">
                Kiss boring goodbye. Drizzl on.
              </p>
            </div>
          </div>
        </div>
      </section>

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
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                WHY WE EXIST
              </span>
              <h2 style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: 600,
                lineHeight: 1.15,
                letterSpacing: '-0.015em',
                color: '#ffffff',
                marginBottom: 'var(--space-after-h2)',
              }}>
                We got tired of the lies.
              </h2>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-after-p)',
              }}>
                "Healthy" smoothies loaded with hidden sugars. Wellness brands that care more about margins than your body. 
                Powder mixes that taste like regret. We started Drizzl because we couldn't find a single smoothie brand 
                that actually gave a damn.
              </p>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 500,
                lineHeight: 1.7,
                color: '#ffffff',
                marginBottom: '24px',
              }}>
                So we built one. Chef-crafted recipes. Real organic ingredients. Flash-frozen at peak nutrition. 
                No compromises, no asterisks, no BS.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px',
                marginBottom: '24px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div>
                  <p style={{ fontSize: 'var(--fs-h3)', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>0g</p>
                  <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)' }}>Added sugar</p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--fs-h3)', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>90%+</p>
                  <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)' }}>Organic ingredients</p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--fs-h3)', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>Peak</p>
                  <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)' }}>Frozen for freshness</p>
                </div>
              </div>
              <Link href="/our-story" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#ffffff',
                fontSize: 'var(--fs-body)',
                fontWeight: 500,
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.3)',
                paddingBottom: '4px',
                transition: 'all 0.2s ease',
              }}>
                Read the full story
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
        padding: 'var(--section-padding-y) var(--section-padding-x)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 6vw, 64px)' }}>
              <h2 style={{
                ...headingStyles,
                marginBottom: 'var(--space-after-h2)',
              }}>
                What's inside matters
              </h2>
              <p style={{
                ...subheadingStyles,
                margin: '0 auto',
              }}>
                Not all smoothies are created equal. Here's what makes ours hit different.
              </p>
            </div>
          </AnimatedSection>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '24px',
            alignItems: 'stretch',
          }}>
            {BENEFITS.map((benefit, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={index * 100} style={{ height: '100%' }}>
                <div style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '32px 24px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  height: '100%',
                  minHeight: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    color: '#ffffff',
                    flexShrink: 0,
                  }}>
                    {benefit.icon}
                  </div>
                  <h3 style={{
                    fontSize: 'var(--fs-h3)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: 'var(--space-after-h3)',
                  }}>
                    {benefit.title}
                  </h3>
                  <p style={{
                    fontSize: 'var(--fs-body)',
                    lineHeight: 1.6,
                    color: 'var(--color-text-secondary)',
                    flex: 1,
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
        padding: 'var(--section-padding-y) var(--section-padding-x)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 6vw, 64px)' }}>
              <h2 style={{
                ...headingStyles,
                marginBottom: 'var(--space-after-h2)',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '40px',
          }}>
            {HOW_IT_WORKS.map((item, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={index * 100}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '48px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.1)',
                    lineHeight: 1,
                    marginBottom: '24px',
                    fontFamily: 'var(--font-display)',
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{
                    fontSize: 'var(--fs-h3)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: 'var(--space-after-h3)',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: 'var(--fs-body)',
                    lineHeight: 1.6,
                    color: 'var(--color-text-secondary)',
                    maxWidth: '260px',
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
            The lineup
          </h2>
          <p className="video-section-subtitle">
            These are the ones people can't stop reordering.
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

      {/* 7. Social Proof - Experts Section */}
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

      {/* Footer */}
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
