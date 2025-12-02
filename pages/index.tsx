import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AnimatedSection, AnimatedText, StaggeredGrid } from '../components/ScrollAnimations';

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
  { name: 'Breakfast Bowls', slug: 'bowls' },
  { name: 'Bites', slug: 'bites' },
  { name: 'Smoothie Boxes', slug: 'boxes' },
  { name: 'Protein Shop', slug: 'protein' },
  { name: 'Gift Guide', slug: 'gift' },
];

const POPULAR_SMOOTHIES = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, image: 'https://daily-harvest.com/cdn/shop/files/strawberry-peach-smoothie-daily-harvest-3657974.jpg?v=1760509351&width=500', description: 'Creamy strawberry bliss' },
  { id: '2', name: 'Acai + Cherry', price: 8.49, image: 'https://daily-harvest.com/cdn/shop/files/acai-cherry-smoothie-daily-harvest-8004331.jpg?v=1760509351&width=500', description: 'Antioxidant powerhouse' },
  { id: '3', name: 'Mixed Berry Protein', price: 9.49, image: 'https://daily-harvest.com/cdn/shop/files/mixed-berry-protein-smoothie-daily-harvest-3950952.jpg?v=1760509317&width=500', description: 'Protein-packed berries' },
  { id: '4', name: 'Dark Chocolate Protein', price: 9.49, image: 'https://daily-harvest.com/cdn/shop/files/dark-chocolate-protein-smoothie-daily-harvest-4692961.jpg?v=1760509316&width=500', description: 'Indulgent chocolate' },
  { id: '5', name: 'Vanilla Bean Protein', price: 9.49, image: 'https://daily-harvest.com/cdn/shop/files/vanilla-bean-protein-smoothie-daily-harvest-1407106.jpg?v=1760509317&width=500', description: 'Smooth vanilla goodness' },
  { id: '6', name: 'Tropical Greens Protein', price: 9.49, image: 'https://daily-harvest.com/cdn/shop/files/tropical-greens-protein-smoothie-daily-harvest-8021323.jpg?v=1760509314&width=500', description: 'Tropical & green' },
];

const EXPERTS = [
  { id: '1', name: 'Elizabeth Russano, FNP-C, AFSM', video: 'https://media.coverr.co/videos/coverr-woman-drinking-smoothie-juice-7481/preview', product: 'Strawberry + Peach', productImage: 'https://daily-harvest.com/cdn/shop/files/strawberry-peach-smoothie-daily-harvest-3657974.jpg?v=1760509351&width=400' },
  { id: '2', name: 'Morgan Rackley, LE', video: 'https://media.coverr.co/videos/coverr-healthy-lifestyle-eating-smoothie-bowl-7543/preview', product: 'Mixed Berry Protein', productImage: 'https://daily-harvest.com/cdn/shop/files/mixed-berry-protein-smoothie-daily-harvest-3950952.jpg?v=1760509317&width=400' },
  { id: '3', name: 'Nurse Lila, RM', video: 'https://media.coverr.co/videos/coverr-woman-with-smoothie-glass-8234/preview', product: 'Acai + Cherry', productImage: 'https://daily-harvest.com/cdn/shop/files/acai-cherry-smoothie-daily-harvest-8004331.jpg?v=1760509351&width=400' },
  { id: '4', name: 'Dr. Gabriella Veals', video: 'https://media.coverr.co/videos/coverr-person-making-smoothie-juice-1200/preview', product: 'Tropical Greens Protein', productImage: 'https://daily-harvest.com/cdn/shop/files/tropical-greens-protein-smoothie-daily-harvest-8021323.jpg?v=1760509314&width=400' },
  { id: '5', name: 'Dr. Sarah Martinez', video: 'https://media.coverr.co/videos/coverr-fitness-girl-making-protein-smoothie-7821/preview', product: 'Strawberry + Peach', productImage: 'https://daily-harvest.com/cdn/shop/files/strawberry-peach-smoothie-daily-harvest-3657974.jpg?v=1760509351&width=400' },
];

const CUSTOMERS = [
  { id: '1', name: 'Taylor Kay', video: 'https://media.coverr.co/videos/coverr-woman-drinking-smoothie-juice-7481/preview', product: 'Strawberry Banana Protein', productImage: 'https://daily-harvest.com/cdn/shop/files/strawberry-banana-protein-smoothie-daily-harvest-3370693.jpg?v=1760509314&width=400' },
  { id: '2', name: 'Brittney Adderfly', video: 'https://media.coverr.co/videos/coverr-healthy-lifestyle-eating-smoothie-bowl-7543/preview', product: 'Dark Chocolate Protein', productImage: 'https://daily-harvest.com/cdn/shop/files/dark-chocolate-protein-smoothie-daily-harvest-4692961.jpg?v=1760509316&width=400' },
  { id: '3', name: 'Lily Sanchez', video: 'https://media.coverr.co/videos/coverr-woman-with-smoothie-glass-8234/preview', product: 'Mixed Berry Protein', productImage: 'https://daily-harvest.com/cdn/shop/files/mixed-berry-protein-smoothie-daily-harvest-3950952.jpg?v=1760509317&width=400' },
  { id: '4', name: 'Sarah Butler', video: 'https://media.coverr.co/videos/coverr-person-making-smoothie-juice-1200/preview', product: 'Vanilla Bean Protein', productImage: 'https://daily-harvest.com/cdn/shop/files/vanilla-bean-protein-smoothie-daily-harvest-1407106.jpg?v=1760509317&width=400' },
  { id: '5', name: 'Jessica Chen', video: 'https://media.coverr.co/videos/coverr-fitness-girl-making-protein-smoothie-7821/preview', product: 'Tropical Greens Protein', productImage: 'https://daily-harvest.com/cdn/shop/files/tropical-greens-protein-smoothie-daily-harvest-8021323.jpg?v=1760509314&width=400' },
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
      
      // Loop to beginning
      if (scrollLeft < itemWidth) {
        carouselRef.current.scrollLeft = scrollWidth - clientWidth - itemWidth * 2;
      }
      // Loop to end
      else if (scrollLeft >= scrollWidth - clientWidth - itemWidth) {
        carouselRef.current.scrollLeft = itemWidth;
      }
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section - Vibrant & Energetic */}
      <section className="hero-vibrant" style={{
        padding: '140px 60px',
        textAlign: 'center',
        minHeight: '680px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF9F5 0%, #FFE8D6 30%, #FFEEF2 60%, #F0FFF4 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Floating fruit decorations */}
        <div className="floating-fruit" style={{ position: 'absolute', top: '15%', left: '10%', fontSize: '48px', animation: 'floatBounce 4s ease-in-out infinite' }}>🍓</div>
        <div className="floating-fruit" style={{ position: 'absolute', top: '25%', right: '12%', fontSize: '42px', animation: 'floatBounce 4.5s ease-in-out infinite 0.5s' }}>🥭</div>
        <div className="floating-fruit" style={{ position: 'absolute', bottom: '20%', left: '15%', fontSize: '38px', animation: 'floatBounce 5s ease-in-out infinite 1s' }}>🫐</div>
        <div className="floating-fruit" style={{ position: 'absolute', bottom: '30%', right: '8%', fontSize: '44px', animation: 'floatBounce 4.2s ease-in-out infinite 0.3s' }}>🍊</div>
        <div className="floating-fruit" style={{ position: 'absolute', top: '50%', left: '5%', fontSize: '36px', animation: 'floatBounce 5.5s ease-in-out infinite 0.8s' }}>🥝</div>
        <div className="floating-fruit" style={{ position: 'absolute', top: '40%', right: '5%', fontSize: '40px', animation: 'floatBounce 4.8s ease-in-out infinite 1.2s' }}>🍇</div>
        
        <AnimatedSection animation="fadeUp">
          <h1 className="tiktok-heading tiktok-heading-gradient" style={{
            fontFamily: "'Space Mono', monospace",
            textAlign: 'center',
          }}>
            Feel the Flavor
          </h1>
        </AnimatedSection>
        <AnimatedSection animation="fadeUp" delay={100}>
          <p className="tiktok-subheading" style={{ textAlign: 'center', margin: '0 auto 48px' }}>
            Fresh. Frozen. Fantastic. Smoothies that make you smile.
          </p>
        </AnimatedSection>
        <AnimatedSection animation="fadeUp" delay={200}>
          <Link href="/products" className="tiktok-button tiktok-button-gradient" style={{
            fontSize: '18px',
            padding: '20px 44px',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            Let's Blend! 🥤
          </Link>
        </AnimatedSection>
      </section>

      {/* Category Grid - Vibrant */}
      <section className="tiktok-section tiktok-section-white">
        <div className="tiktok-container" style={{ maxWidth: '1320px' }}>
          <AnimatedSection animation="fadeUp" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #3FBF7F, #FFD166)',
              color: '#fff',
              padding: '8px 20px',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Explore Our Menu
            </span>
            <h2 className="tiktok-heading tiktok-heading-gradient">
              What's Your Flavor?
            </h2>
            <p className="tiktok-subheading" style={{ margin: '0 auto' }}>
              From fruity to protein-packed, we've got something for every mood.
            </p>
          </AnimatedSection>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}>
            {CATEGORIES.map((category, index) => {
              const colors = [
                { bg: 'linear-gradient(135deg, #FFE8D6, #FFF9F5)', border: '#FF8A4B', emoji: '🥤' },
                { bg: 'linear-gradient(135deg, #FFE8EE, #FFF0F5)', border: '#FF4F7B', emoji: '💪' },
                { bg: 'linear-gradient(135deg, #E8F5E9, #F0FFF4)', border: '#3FBF7F', emoji: '🥣' },
                { bg: 'linear-gradient(135deg, #FFF3E0, #FFFDE7)', border: '#FFD166', emoji: '🍪' },
                { bg: 'linear-gradient(135deg, #E8EAF6, #F3E5F5)', border: '#6B5CE7', emoji: '📦' },
                { bg: 'linear-gradient(135deg, #FFEBEE, #FCE4EC)', border: '#FF4F7B', emoji: '🏋️' },
                { bg: 'linear-gradient(135deg, #E0F7FA, #E8F5E9)', border: '#3FBF7F', emoji: '🎁' },
              ];
              const colorSet = colors[index % colors.length];
              
              return (
                <Link key={category.slug} href={`/products?category=${category.slug}`} style={{
                  padding: '32px 24px',
                  textAlign: 'center',
                  background: colorSet.bg,
                  border: `2px solid transparent`,
                  borderRadius: '20px',
                  textDecoration: 'none',
                  color: '#000',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colorSet.border;
                    e.currentTarget.style.boxShadow = `0 16px 32px ${colorSet.border}30`;
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <span style={{ fontSize: '36px' }}>{colorSet.emoji}</span>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    margin: 0,
                    letterSpacing: '-0.3px',
                  }}>
                    {category.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Most Popular - Infinite Carousel */}
      <section className="tiktok-section tiktok-section-cream">
        <div className="tiktok-container" style={{ maxWidth: '1320px' }}>
          <AnimatedSection animation="fadeUp" style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '32px' }}>🔥</span>
              <h2 className="tiktok-heading tiktok-heading-gradient" style={{ marginBottom: 0 }}>
                Fan Favorites
              </h2>
            </div>
            <p className="tiktok-subheading">
              The blends everyone's obsessed with. Try what thousands are already loving!
            </p>
          </AnimatedSection>

          {/* Carousel Container */}
          <div style={{ position: 'relative', paddingLeft: '80px', paddingRight: '80px' }}>
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#000000',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#424245';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000000';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
            >
              <ModernArrowLeft />
            </button>

            {/* Carousel */}
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
              {POPULAR_SMOOTHIES.map((product) => (
                <Link
                  key={product.id}
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
                  <div className="tech-shine" style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #f0f0f0 100%)',
                    borderRadius: '16px',
                    height: '300px',
                    marginBottom: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '1px solid rgba(224, 224, 224, 0.6)',
                    boxShadow: 'inset 0 0 20px rgba(66, 133, 244, 0.05)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'inset 0 0 30px rgba(66, 133, 244, 0.15), 0 0 20px rgba(66, 133, 244, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(66, 133, 244, 0.05)';
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        userSelect: 'none',
                      }}
                      draggable={false}
                    />
                  </div>
                  
                  {/* Product Name */}
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '6px',
                    letterSpacing: '-0.3px',
                  }}>
                    {product.name}
                  </h3>

                  {/* Category */}
                  <p style={{
                    fontSize: '13px',
                    color: '#79747e',
                    marginBottom: '8px',
                    letterSpacing: '-0.2px',
                  }}>
                    Smoothie
                  </p>

                  {/* Stars & Reviews */}
                  <p style={{
                    fontSize: '13px',
                    color: '#424245',
                    marginBottom: '12px',
                    letterSpacing: '-0.2px',
                  }}>
                    ★★★★★ 185 reviews
                  </p>

                  {/* Price */}
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    letterSpacing: '-0.3px',
                  }}>
                    ${product.price.toFixed(2)}
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
                background: '#000000',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#424245';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000000';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
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
        padding: '140px 60px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '800',
            marginBottom: '16px',
            letterSpacing: '-0.8px',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}>
            Powered by AI, Formulated by Data
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#424245',
            textAlign: 'center',
            marginBottom: '64px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            Approved by Dermatologists & Experts*
          </p>

          {/* Carousel Container */}
          <div style={{ position: 'relative', paddingLeft: '80px', paddingRight: '80px' }}>
            {/* Left Arrow */}
            <button
              onClick={() => setExpertPosition(Math.max(0, expertPosition - 1))}
              style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#000000',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                color: 'white',
                cursor: expertPosition > 0 ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                opacity: expertPosition > 0 ? 1 : 0.4,
              }}
              onMouseEnter={(e) => {
                if (expertPosition > 0) {
                  e.currentTarget.style.background = '#424245';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000000';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              disabled={expertPosition === 0}
            >
              <ModernArrowLeft />
            </button>

            {/* Carousel */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '32px',
            }}>
              {EXPERTS.slice(expertPosition, expertPosition + 4).map((expert) => (
                <div key={expert.id} style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
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
                      color: '#79747e',
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
                        borderRadius: '6px',
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
              onClick={() => setExpertPosition(Math.min(EXPERTS.length - 4, expertPosition + 1))}
              style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#000000',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                color: 'white',
                cursor: expertPosition < EXPERTS.length - 4 ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                opacity: expertPosition < EXPERTS.length - 4 ? 1 : 0.4,
              }}
              onMouseEnter={(e) => {
                if (expertPosition < EXPERTS.length - 4) {
                  e.currentTarget.style.background = '#424245';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000000';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              disabled={expertPosition >= EXPERTS.length - 4}
            >
              <ModernArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Customers Section */}
      <section style={{
        background: '#ffffff',
        padding: '140px 60px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '800',
            marginBottom: '64px',
            letterSpacing: '-0.8px',
            textAlign: 'center',
          }}>
            Loved by the Spoiled*
          </h2>

          {/* Carousel Container */}
          <div style={{ position: 'relative', paddingLeft: '80px', paddingRight: '80px' }}>
            {/* Left Arrow */}
            <button
              onClick={() => setCustomerPosition(Math.max(0, customerPosition - 1))}
              style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#000000',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                color: 'white',
                cursor: customerPosition > 0 ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                opacity: customerPosition > 0 ? 1 : 0.4,
              }}
              onMouseEnter={(e) => {
                if (customerPosition > 0) {
                  e.currentTarget.style.background = '#424245';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000000';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              disabled={customerPosition === 0}
            >
              <ModernArrowLeft />
            </button>

            {/* Carousel */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '32px',
            }}>
              {CUSTOMERS.slice(customerPosition, customerPosition + 4).map((customer) => (
                <div key={customer.id} style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  border: '1px solid #e8e8e8',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
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
                      color: '#79747e',
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
                        borderRadius: '6px',
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
              onClick={() => setCustomerPosition(Math.min(CUSTOMERS.length - 4, customerPosition + 1))}
              style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#000000',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                color: 'white',
                cursor: customerPosition < CUSTOMERS.length - 4 ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                opacity: customerPosition < CUSTOMERS.length - 4 ? 1 : 0.4,
              }}
              onMouseEnter={(e) => {
                if (customerPosition < CUSTOMERS.length - 4) {
                  e.currentTarget.style.background = '#424245';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000000';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              disabled={customerPosition >= CUSTOMERS.length - 4}
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
