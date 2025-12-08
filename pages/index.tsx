import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AnimatedSection } from '../components/ScrollAnimations';
import { getMessages } from '../lib/getMessages';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

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
  { word: 'nourished', color: '#22c55e' },
  { word: 'fueled', color: '#f97316' },
  { word: 'strong', color: '#ec4899' },
  { word: 'happy', color: '#facc15' },
  { word: 'relaxed', color: '#8b5cf6' },
  { word: 'glowing', color: '#ef4444' },
  { word: 'balanced', color: '#06b6d4' },
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

const CATEGORY_TILES = [
  { label: 'Collection', title: 'Energy Blends', image: '/products/mint-cacao/lifestyle-1.jpg', link: '/collections/smoothies' },
  { label: 'Collection', title: 'Immunity Boost', image: '/products/pink-piyata/lifestyle-1.jpg', link: '/collections/smoothies' },
  { label: 'Collection', title: 'Daily Essentials', image: '/products/strawberry-banana-protein/lifestyle-1.jpg', link: '/collections/smoothies' },
  { label: 'New Season', title: 'New Arrivals', image: '/products/pink-piyata/lifestyle-2.jpg', link: '/collections/new-arrivals' },
  { label: 'Bestsellers', title: 'Most Loved', image: '/products/strawberry-peach/gallery-3.png', link: '/collections/best-sellers' },
  { label: 'Gift', title: 'Gift Guide', image: '/products/mint-cacao/lifestyle-2.jpg', link: '/collections/gift-guide' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expertPosition, setExpertPosition] = useState(0);
  const [customerPosition, setCustomerPosition] = useState(0);
  const [unMutedExpert, setUnMutedExpert] = useState<string | null>(null);
  const [unMutedCustomer, setUnMutedCustomer] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const expertsRef = useRef<HTMLDivElement>(null);
  const customersRef = useRef<HTMLDivElement>(null);
  
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

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 340;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Navbar />

      {/* 1. Hero Section - LV Style */}
      <section className="lv-home-hero">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="lv-home-hero-video"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        
        <div className="lv-home-hero-overlay"></div>
        
        <div className="lv-home-hero-content">
          <AnimatedSection animation="fadeUp">
            <h1 className="lv-home-hero-title">
              <span>i am </span>
              <span style={{
                display: 'inline-block',
                minWidth: '2ch',
                borderRight: `2px solid ${ROTATING_WORDS[currentWordIndex].color}`,
                animation: 'blink 1s step-end infinite',
                color: ROTATING_WORDS[currentWordIndex].color,
                transition: 'color 0.3s ease',
              }}>
                {displayedText}
              </span>
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={100}>
            <p className="lv-home-hero-subtitle">
              Fresh. Frozen. Fantastic.<br />
              Smoothies for people who want to feel their best.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={200}>
            <Link href="/products" className="lv-home-hero-cta">
              Discover
            </Link>
          </AnimatedSection>
        </div>
        
        <div className="lv-home-hero-line"></div>
      </section>

      {/* 2. Category Tiles Section - LV Style Grid */}
      <section className="lv-home-tiles">
        <div className="lv-home-tiles-grid">
          {CATEGORY_TILES.map((tile, index) => (
            <Link href={tile.link} key={index} className="lv-home-tile">
              <img 
                src={tile.image} 
                alt={tile.title}
                className="lv-home-tile-image"
              />
              <div className="lv-home-tile-overlay">
                <span className="lv-home-tile-label">{tile.label}</span>
                <h3 className="lv-home-tile-title">{tile.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Editorial Section - Why We Exist */}
      <section className="lv-home-editorial">
        <div className="lv-home-editorial-image">
          <img 
            src="/products/strawberry-banana-protein/lifestyle-2.jpg" 
            alt="Drizzl Smoothie"
          />
        </div>
        <div className="lv-home-editorial-content">
          <AnimatedSection animation="fadeUp">
            <span className="lv-home-editorial-label">Why We Exist</span>
            <h2 className="lv-home-editorial-title">
              We got tired of the lies.
            </h2>
            <p className="lv-home-editorial-body">
              "Healthy" smoothies loaded with hidden sugars. Wellness brands that care more about margins than your body. 
              Powder mixes that taste like regret. We started Drizzl because we couldn't find a single smoothie brand 
              that actually gave a damn.
            </p>
            <p className="lv-home-editorial-body">
              So we built one. Chef-crafted recipes. Real organic ingredients. Flash-frozen at peak nutrition. 
              No compromises, no asterisks, no BS.
            </p>
            
            <div className="lv-home-editorial-stats">
              <div>
                <p className="lv-home-editorial-stat-value">0g</p>
                <p className="lv-home-editorial-stat-label">Added sugar</p>
              </div>
              <div>
                <p className="lv-home-editorial-stat-value">90%+</p>
                <p className="lv-home-editorial-stat-label">Organic</p>
              </div>
              <div>
                <p className="lv-home-editorial-stat-value">Peak</p>
                <p className="lv-home-editorial-stat-label">Freshness</p>
              </div>
            </div>
            
            <Link href="/our-story" className="lv-home-editorial-link">
              Read Our Story
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* 4. Product Grid Section - LV Style */}
      <section className="lv-home-products">
        <div className="lv-home-products-header">
          <AnimatedSection animation="fadeUp">
            <h2 className="lv-home-products-title">The Collection</h2>
            <p className="lv-home-products-subtitle">Chef-crafted smoothies for every moment</p>
          </AnimatedSection>
        </div>
        
        <div className="lv-home-products-grid">
          {POPULAR_SMOOTHIES.slice(0, 8).map((product) => (
            <AnimatedSection key={product.id} animation="fadeUp">
              <Link href={`/products/${product.id}`} className="lv-home-product-card">
                <div className="lv-home-product-image-wrap">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="lv-home-product-image"
                  />
                </div>
                <h3 className="lv-home-product-name">{product.name}</h3>
                <p className="lv-home-product-price">${product.price.toFixed(2)}</p>
              </Link>
            </AnimatedSection>
          ))}
        </div>
        
        <div className="lv-home-products-footer">
          <Link href="/products" className="lv-home-products-link">
            Discover the Collection
          </Link>
        </div>
      </section>

      {/* 5. World of Drizzl Section - Drizzl Kiss */}
      <section className="lv-home-world">
        <img 
          src="/products/pink-piyata/lifestyle-3.jpg" 
          alt="Drizzl Lifestyle"
          className="lv-home-world-image"
        />
        <div className="lv-home-world-overlay"></div>
        <div className="lv-home-world-content">
          <AnimatedSection animation="fadeUp">
            <img 
              src="/drizzl-lips.gif" 
              alt="Drizzl Kiss" 
              className="lv-home-world-gif"
            />
            <h2 className="lv-home-world-title">
              One Sip. Pure Bliss.
            </h2>
            <p className="lv-home-world-text">
              Close your eyes. Take a sip. Feel it. That rush of flavor, that moment of calm, 
              that little voice saying "yes, this is exactly what I needed." This isn't just a smoothie — 
              it's your moment. Your ritual. Your daily act of self-love.
            </p>
            <p className="lv-home-world-tagline">
              Kiss boring goodbye. Drizzl on.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* 6. Benefits Strip - Horizontal */}
      <section className="lv-home-benefits">
        <div className="lv-home-benefits-container">
          {BENEFITS.map((benefit, index) => (
            <div key={index} className="lv-home-benefit">
              <div className="lv-home-benefit-icon">
                {benefit.icon}
              </div>
              <h3 className="lv-home-benefit-title">{benefit.title}</h3>
              <p className="lv-home-benefit-text">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. How It Works - Simplified */}
      <section className="lv-home-how">
        <div className="lv-home-how-container">
          <AnimatedSection animation="fadeUp">
            <h2 className="lv-home-how-title">How It Works</h2>
          </AnimatedSection>
          <div className="lv-home-how-steps">
            {HOW_IT_WORKS.map((item, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={index * 100}>
                <div className="lv-home-how-step">
                  <div className="lv-home-how-step-number">{item.step}</div>
                  <h3 className="lv-home-how-step-title">{item.title}</h3>
                  <p className="lv-home-how-step-text">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Expert Testimonials - LV Style */}
      <section className="lv-home-testimonials">
        <div className="lv-home-testimonials-header">
          <AnimatedSection animation="fadeUp">
            <p className="lv-home-testimonials-eyebrow">Over 50K Five Star Reviews</p>
            <h2 className="lv-home-testimonials-title">Trusted by Experts</h2>
          </AnimatedSection>
        </div>
        
        <div className="lv-home-testimonials-carousel">
          <button 
            className="lv-carousel-arrow lv-carousel-arrow-left"
            onClick={() => scrollCarousel(expertsRef, 'left')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          
          <div className="lv-home-testimonials-track" ref={expertsRef}>
            {EXPERTS.map((expert) => (
              <div 
                key={expert.id} 
                className="lv-home-testimonial-card"
                onClick={() => setUnMutedExpert(unMutedExpert === expert.id ? null : expert.id)}
              >
                <span className="lv-home-testimonial-label">Expert Review</span>
                <div className="lv-home-testimonial-quote-mark">"</div>
                <p className="lv-home-testimonial-quote">{expert.quote}</p>
                <p className="lv-home-testimonial-author">{expert.name}</p>
                <div className="lv-home-testimonial-video-wrap">
                  <video
                    src={expert.video}
                    className="lv-home-testimonial-video"
                    loop
                    autoPlay
                    muted={unMutedExpert !== expert.id}
                    playsInline
                  />
                  <div className="lv-home-testimonial-play">
                    <svg viewBox="0 0 24 24">
                      <polygon points="8 5 19 12 8 19 8 5" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="lv-carousel-arrow lv-carousel-arrow-right"
            onClick={() => scrollCarousel(expertsRef, 'right')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </section>

      {/* 9. Customer Testimonials - LV Style */}
      <section className="lv-home-testimonials">
        <div className="lv-home-testimonials-header">
          <AnimatedSection animation="fadeUp">
            <h2 className="lv-home-testimonials-title">Loved by Customers</h2>
          </AnimatedSection>
        </div>
        
        <div className="lv-home-testimonials-carousel">
          <button 
            className="lv-carousel-arrow lv-carousel-arrow-left"
            onClick={() => scrollCarousel(customersRef, 'left')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          
          <div className="lv-home-testimonials-track" ref={customersRef}>
            {CUSTOMERS.map((customer) => (
              <div 
                key={customer.id} 
                className="lv-home-testimonial-card"
                onClick={() => setUnMutedCustomer(unMutedCustomer === customer.id ? null : customer.id)}
              >
                <span className="lv-home-testimonial-label">Customer Review</span>
                <div className="lv-home-testimonial-quote-mark">"</div>
                <p className="lv-home-testimonial-quote">{customer.quote}</p>
                <p className="lv-home-testimonial-author">{customer.name}</p>
                <div className="lv-home-testimonial-video-wrap">
                  <video
                    src={customer.video}
                    className="lv-home-testimonial-video"
                    loop
                    autoPlay
                    muted={unMutedCustomer !== customer.id}
                    playsInline
                  />
                  <div className="lv-home-testimonial-play">
                    <svg viewBox="0 0 24 24">
                      <polygon points="8 5 19 12 8 19 8 5" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="lv-carousel-arrow lv-carousel-arrow-right"
            onClick={() => scrollCarousel(customersRef, 'right')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes blink {
          0%, 100% { border-color: inherit; }
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
