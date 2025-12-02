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
        padding: '100px 40px',
        textAlign: 'center',
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h1 style={{
          fontSize: '52px',
          fontWeight: '600',
          marginBottom: '20px',
          letterSpacing: '0.3px',
          maxWidth: '900px',
        }}>
          Frozen smoothies and bowls for a better you
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '40px',
          maxWidth: '700px',
          lineHeight: '1.7',
          fontWeight: '400',
        }}>
          Skip the blender. Embrace the possibilities. Order your first smoothie today.
        </p>
        <Link href="/products" style={{
          display: 'inline-block',
          padding: '16px 48px',
          background: '#1a1a1a',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: '500',
          transition: 'all 0.2s',
        }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Order Now
        </Link>
      </section>

      {/* Category Grid */}
      <section style={{
        background: '#f9f9f9',
        padding: '80px 40px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '60px',
            fontSize: '32px',
          }}>
            Shop by Category
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}>
            {CATEGORIES.map((category) => (
              <Link key={category.slug} href={`/products?category=${category.slug}`} style={{
                padding: '40px 20px',
                textAlign: 'center',
                background: 'white',
                border: '1px solid #e8e8e8',
                borderRadius: '4px',
                textDecoration: 'none',
                color: '#1a1a1a',
                transition: 'all 0.2s',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#999';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e8e8e8';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: 0,
                  fontFamily: "'DM Sans', sans-serif",
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
        padding: '80px 40px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '42px',
              fontWeight: '700',
              marginBottom: '12px',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Our Most Popular
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
              maxWidth: '500px',
              lineHeight: '1.6',
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
                background: '#000',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                zIndex: 10,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    height: '280px',
                    marginBottom: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'grab',
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
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '4px',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '14px',
                    color: '#999',
                    marginBottom: '12px',
                    minHeight: '20px',
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
                background: '#000',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                zIndex: 10,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: '#f9f9f9',
        padding: '80px 40px',
        textAlign: 'center',
        borderTop: '1px solid #e8e8e8',
      }}>
        <h2 style={{
          fontSize: '32px',
          marginBottom: '16px',
        }}>
          Start Your Wellness Journey Today
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '32px',
          maxWidth: '600px',
          margin: '0 auto 32px auto',
        }}>
          Join thousands of people who have made smoothies and bowls their daily habit.
        </p>
        <Link href="/auth" style={{
          display: 'inline-block',
          padding: '14px 40px',
          background: '#1a1a1a',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: '500',
          transition: 'all 0.2s',
        }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Create Your Account
        </Link>
      </section>
      <Footer />
    </>
  );
}
