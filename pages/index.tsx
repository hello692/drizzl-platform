import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SmoothieCard from '../components/SmoothieCard';
import HomeHero from '../components/HomeHero';
import { AnimatedSection, AnimatedText, StaggeredGrid } from '../components/ScrollAnimations';
import { getMessages } from '../lib/getMessages';
import { useAutoScroll } from '../hooks/useAutoScroll';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

const POPULAR_SMOOTHIES = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, image: '/products/strawberry-peach/1.png', hoverImage: '/products/strawberry-peach/2.png', badge: 'BEST SELLER', rating: 4.5, reviews: 4619 },
  { id: '9', name: 'Pink Piyata', price: 8.99, image: '/products/pink-piyata/gallery-1.jpg', hoverImage: '/products/pink-piyata/gallery-2.jpg', badge: 'NEW', rating: 4.7, reviews: 127 },
  { id: '10', name: 'Matcha', price: 9.49, image: '/products/matcha/gallery-1.jpg', hoverImage: '/products/matcha/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.8, reviews: 312 },
  { id: '11', name: 'Mocha', price: 9.49, image: '/products/mocha/gallery-1.jpg', hoverImage: '/products/mocha/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.6, reviews: 245 },
  { id: '12', name: 'Nutty Monkey', price: 8.99, image: '/products/nutty-monkey/gallery-1.jpg', hoverImage: '/products/nutty-monkey/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.7, reviews: 389 },
  { id: '13', name: 'Mango Jackfruit', price: 8.99, image: '/products/mango-jackfruit/Mango Jackfruit-1.png', hoverImage: '/products/mango-jackfruit/Mango Jackfruit-2.png', badge: 'NEW', rating: 4.8, reviews: 156 },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, image: '/products/coffee-mushroom/gallery-1.jpg', hoverImage: '/products/coffee-mushroom/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.8, reviews: 203 },
  { id: '15', name: 'Chocolate Berry', price: 8.99, image: '/products/chocolate-berry/gallery-1.jpg', hoverImage: '/products/chocolate-berry/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.8, reviews: 278 },
  { id: '16', name: 'Almond', price: 8.99, image: '/products/almond/gallery-1.jpg', hoverImage: '/products/almond/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.7, reviews: 187 },
  { id: '17', name: 'Acai', price: 9.49, image: '/products/acai/gallery-1.jpg', hoverImage: '/products/acai/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.9, reviews: 487 },
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
    description: 'Pure, sustained power—no crashes, no compromises. Every sip is a masterfully crafted blend of natural ingredients designed to fuel your body and sharpen your mind.'
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
    description: 'A fortress for your health. Bursting with vitamins, antioxidants, and superfoods, our smoothies elevate your body\'s natural defenses to their peak.'
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
    description: 'Wellness starts within. Our fiber-rich blends, infused with prebiotics, nurture your microbiome and keep your digestion running like a dream.'
  }
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose Your Moment',
    description: 'Energy that lasts? A gut reset? Or just a flavor so good it feels like a cheat day? With 10+ chef-crafted blends, there\'s a Drizzl for every vibe.'
  },
  {
    step: '02',
    title: 'Pour. Blend. Elevate.',
    description: 'Add oat milk, almond milk, or just water. Blend for 30 seconds. That\'s it—perfection in a glass, no effort required.'
  },
  {
    step: '03',
    title: 'Sip. Savor. Shine.',
    description: 'This isn\'t just a smoothie—it\'s your daily glow-up. No mess, no compromises, just pure, feel-good luxury on repeat.'
  }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expertPosition, setExpertPosition] = useState(0);
  const [unMutedExpert, setUnMutedExpert] = useState<string | null>(null);
  const [unMutedCustomer, setUnMutedCustomer] = useState<string | null>(null);
  
  const { trackRef: productTrackRef, pauseScroll: pauseProductScroll, resumeScroll: resumeProductScroll } = useAutoScroll({
    speed: 35,
    pauseOnInteraction: true,
    resumeDelay: 1500,
    direction: 'left',
  });
  
  const { trackRef: customerTrackRef, pauseScroll: pauseCustomerScroll, resumeScroll: resumeCustomerScroll } = useAutoScroll({
    speed: 35,
    pauseOnInteraction: true,
    resumeDelay: 1500,
    direction: 'left',
  });
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
          const products = Array.isArray(data) ? data : (data?.products || []);
          setFeaturedProducts(products.slice(0, 3));
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
    padding: 'var(--section-gap) clamp(24px, 5vw, 60px)',
    maxWidth: '1320px',
    margin: '0 auto',
  };

  const headingStyles = {
    fontSize: 'var(--fs-section-header)',
    fontWeight: 300,
    lineHeight: 1.15,
    letterSpacing: '-0.025em',
    color: '#ffffff',
    marginBottom: 'var(--heading-gap)',
  };

  const subheadingStyles = {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 'var(--line-height-body)',
    color: 'rgba(255,255,255,0.88)',
    maxWidth: 'var(--max-paragraph-width)',
  };

  return (
    <>
      {/* LV Header is built into HomeHero */}

      {/* 1. Hero Section - LV Inspired */}
      <HomeHero />

      {/* 2. Feature Banner - Scrolling Marquee */}
      <div style={{
        background: '#000000',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        padding: '12px 0',
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
                    fontSize: '11px',
                    fontWeight: 400,
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
        padding: '16px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
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
                loading="lazy"
              />
            </div>
            <div className="drizzl-kiss-text">
              <h2 className="drizzl-kiss-title">
                One Sip. Pure Bliss.
              </h2>
              <p className="drizzl-kiss-subtitle">
                Close your eyes. Take a sip. Feel it. That luscious burst of flavor, the velvety calm, the quiet thrill that says, "This is exactly what I've been craving." This isn't just a smoothie—it's your escape. Your glow-up. Your daily dose of indulgence, served with a wink.
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
        padding: 'var(--section-gap) clamp(20px, 4vw, 48px)',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: 'clamp(32px, 5vw, 48px)',
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
                loading="lazy"
                width="800"
                height="600"
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
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: 'var(--space-after-h2)',
              }}>
                We were over the fake promises.
              </h2>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-after-p)',
              }}>
                "Healthy" smoothies packed with hidden sugars. Wellness brands chasing profits over people. Powdered mixes that taste like regret. Drizzl was born because we couldn't find a single smoothie brand that actually cared.
              </p>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 500,
                lineHeight: 1.7,
                color: '#ffffff',
                marginBottom: '24px',
              }}>
                So, we made one. Chef-crafted recipes. Real, organic ingredients. Flash-frozen at their absolute peak. No shortcuts, no compromises, no BS.
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
        padding: 'var(--section-gap) clamp(20px, 4vw, 40px)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: 'var(--block-gap)' }}>
              <h2 style={{
                ...headingStyles,
                marginBottom: 'var(--heading-gap)',
              }}>
                What's Inside Matters
              </h2>
              <p style={{
                ...subheadingStyles,
                margin: '0 auto',
              }}>
                Not all smoothies are created equal. Ours? They're in a league of their own. Here's why they hit different:
              </p>
            </div>
          </AnimatedSection>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '16px',
            alignItems: 'stretch',
          }}>
            {BENEFITS.map((benefit, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={index * 80} style={{ height: '100%' }}>
                <div style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '24px 20px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  height: '100%',
                  minHeight: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                }}>
                  <div style={{
                    width: '56px',
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
        padding: 'var(--section-gap) var(--section-padding-x)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: 'var(--block-gap)' }}>
              <h2 style={{
                ...headingStyles,
                marginBottom: 'var(--heading-gap)',
              }}>
                How It Works
              </h2>
              <p style={{
                ...subheadingStyles,
                margin: '0 auto',
              }}>
                From freezer to flawless in under a minute.
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
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.1)',
                    lineHeight: 1,
                    marginBottom: '24px',
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
            The blends everyone's hooked on. These are the ones they keep coming back for.
          </p>

          <div className="video-carousel-wrapper">
            <button
              onClick={() => {
                pauseProductScroll();
                if (productTrackRef.current) {
                  productTrackRef.current.scrollBy({ left: -280, behavior: 'smooth' });
                }
                resumeProductScroll();
              }}
              className="carousel-arrow carousel-arrow-left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="video-carousel-track" ref={productTrackRef}>
              {POPULAR_SMOOTHIES.map((product, index) => (
                <SmoothieCard
                  key={`${product.id}-${index}`}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  hoverImage={product.hoverImage}
                  badge={product.badge}
                  price={product.price}
                  rating={product.rating}
                  reviews={product.reviews}
                />
              ))}
            </div>

            <button
              onClick={() => {
                pauseProductScroll();
                if (productTrackRef.current) {
                  productTrackRef.current.scrollBy({ left: 280, behavior: 'smooth' });
                }
                resumeProductScroll();
              }}
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
            Over 50K Five-Star Reviews
          </p>
          <h2 className="video-section-title">
            Trusted by Experts and Wellness Leaders
          </h2>
          <p className="video-section-subtitle">
            Discover why healthcare pros, fitness coaches, and wellness enthusiasts swear by us.
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
          <h2 className="video-section-title">
            A Fan Favorite
          </h2>
          <p className="video-section-subtitle">
            Because being loved this much should be illegal.
          </p>

          <div className="video-carousel-wrapper">
            <button
              onClick={() => {
                pauseCustomerScroll();
                if (customerTrackRef.current) {
                  customerTrackRef.current.scrollBy({ left: -280, behavior: 'smooth' });
                }
                resumeCustomerScroll();
              }}
              className="carousel-arrow carousel-arrow-left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="video-carousel-track" ref={customerTrackRef}>
              {CUSTOMERS.map((customer, idx) => (
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
              onClick={() => {
                pauseCustomerScroll();
                if (customerTrackRef.current) {
                  customerTrackRef.current.scrollBy({ left: 280, behavior: 'smooth' });
                }
                resumeCustomerScroll();
              }}
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
