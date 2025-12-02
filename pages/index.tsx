import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

      {/* Hero Section */}
      <section style={{
        background: '#ffffff',
        padding: '140px 60px',
        textAlign: 'center',
        minHeight: '680px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h1 style={{
          fontSize: '64px',
          fontWeight: '800',
          marginBottom: '32px',
          letterSpacing: '-1.2px',
          maxWidth: '1000px',
          color: '#000000',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        }}>
          Frozen smoothies and bowls for a better you
        </h1>
        <p style={{
          fontSize: '17px',
          color: '#424245',
          marginBottom: '64px',
          maxWidth: '720px',
          lineHeight: '1.8',
          fontWeight: '400',
          letterSpacing: '-0.3px',
        }}>
          Skip the blender. Embrace the possibilities. Order your first smoothie today.
        </p>
        <Link href="/products" style={{
          display: 'inline-block',
          padding: '14px 40px',
          background: '#000000',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '28px',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          letterSpacing: '-0.3px',
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Order Now
        </Link>
      </section>

      {/* Category Grid */}
      <section style={{
        background: '#ffffff',
        padding: '140px 60px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '64px',
            fontSize: '48px',
            fontWeight: '700',
            letterSpacing: '-0.8px',
          }}>
            Shop by Category
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '28px',
          }}>
            {CATEGORIES.map((category) => (
              <Link key={category.slug} href={`/products?category=${category.slug}`} style={{
                padding: '48px 32px',
                textAlign: 'center',
                background: '#f8f9fa',
                border: '1px solid #e8e8e8',
                borderRadius: '16px',
                textDecoration: 'none',
                color: '#000',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d8d8d8';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.background = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e8e8e8';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = '#f8f9fa';
                }}
              >
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: 0,
                  letterSpacing: '-0.4px',
                }}>
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Most Popular - Infinite Carousel */}
      <section style={{
        background: '#ffffff',
        padding: '140px 60px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <div style={{ marginBottom: '72px' }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '20px',
              letterSpacing: '-0.8px',
            }}>
              Our Most Popular
            </h2>
            <p style={{
              fontSize: '17px',
              color: '#424245',
              maxWidth: '720px',
              lineHeight: '1.8',
              letterSpacing: '-0.3px',
            }}>
              Discover our customers' favorite smoothie blends. Each one crafted with whole fruits and superfoods.
            </p>
          </div>

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
              ←
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
                <div
                  key={product.id}
                  style={{
                    flexShrink: 0,
                    width: '280px',
                    textAlign: 'center',
                    pointerEvents: isDragging ? 'none' : 'auto',
                  }}
                >
                  {/* Product Image */}
                  <div style={{
                    background: '#f8f9fa',
                    borderRadius: '16px',
                    height: '300px',
                    marginBottom: '24px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'grab',
                    border: '1px solid #e8e8e8',
                  }}>
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
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: '-0.2px',
                  }}>
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '15px',
                    color: '#888',
                    marginBottom: '16px',
                    minHeight: '20px',
                    letterSpacing: '-0.1px',
                  }}>
                    {product.description}
                  </p>
                </div>
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
              →
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
