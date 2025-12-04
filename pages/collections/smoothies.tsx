import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  reviews: number;
  rating: number;
  badge: string;
  defaultImage: string;
  hoverImage: string;
}

const products: Product[] = [
  { 
    id: '1', 
    name: 'Strawberry + Peach', 
    price: 8.49, 
    reviews: 4619,
    rating: 4.5,
    badge: 'Best Seller',
    defaultImage: '/products/strawberry-peach/transparent-glass-1.png',
    hoverImage: '/products/strawberry-peach/transparent-glass-2.png',
  },
  { 
    id: '9', 
    name: 'Pink Piyata', 
    price: 8.99, 
    reviews: 127,
    rating: 4,
    badge: 'New',
    defaultImage: '/products/pink-piyata/transparent-glass-1.png',
    hoverImage: '/products/pink-piyata/transparent-glass-2.png',
  },
  { 
    id: '10', 
    name: 'Matcha', 
    price: 9.49, 
    reviews: 312,
    rating: 4.5,
    badge: 'Best Seller',
    defaultImage: '/products/matcha/transparent-glass-1.png',
    hoverImage: '/products/matcha/transparent-glass-2.png',
  },
  { 
    id: '11', 
    name: 'Mocha', 
    price: 9.49, 
    reviews: 245,
    rating: 4,
    badge: 'Best Seller',
    defaultImage: '/products/mocha/transparent-glass-1.png',
    hoverImage: '/products/mocha/transparent-glass-2.png',
  },
  { 
    id: '12', 
    name: 'Nutty Monkey', 
    price: 8.99, 
    reviews: 389,
    rating: 4.5,
    badge: 'Best Seller',
    defaultImage: '/products/nutty-monkey/transparent-glass-1.png',
    hoverImage: '/products/nutty-monkey/transparent-glass-2.png',
  },
  { 
    id: '13', 
    name: 'Mango Jackfruit', 
    price: 8.99, 
    reviews: 156,
    rating: 4,
    badge: 'Best Seller',
    defaultImage: '/products/mango-jackfruit/transparent-glass-1.png',
    hoverImage: '/products/mango-jackfruit/transparent-glass-2.png',
  },
  { 
    id: '14', 
    name: 'Coffee Mushroom', 
    price: 9.99, 
    reviews: 203,
    rating: 4.5,
    badge: 'Best Seller',
    defaultImage: '/products/coffee-mushroom/transparent-glass-1.png',
    hoverImage: '/products/coffee-mushroom/transparent-glass-2.png',
  },
  { 
    id: '15', 
    name: 'Chocolate Berry', 
    price: 8.99, 
    reviews: 278,
    rating: 4.5,
    badge: 'Best Seller',
    defaultImage: '/products/chocolate-berry/transparent-glass-1.png',
    hoverImage: '/products/chocolate-berry/transparent-glass-2.png',
  },
  { 
    id: '16', 
    name: 'Almond', 
    price: 8.99, 
    reviews: 312,
    rating: 4,
    badge: 'Best Seller',
    defaultImage: '/products/almond/transparent-glass-1.png',
    hoverImage: '/products/almond/transparent-glass-2.png',
  },
  { 
    id: '17', 
    name: 'Acai', 
    price: 9.49, 
    reviews: 487,
    rating: 4.5,
    badge: 'Best Seller',
    defaultImage: '/products/acai/transparent-glass-1.png',
    hoverImage: '/products/acai/transparent-glass-2.png',
  },
];

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} width="14" height="14" viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      ))}
      {hasHalfStar && (
        <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="#000"/>
              <stop offset="50%" stopColor="#ccc"/>
            </linearGradient>
          </defs>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#halfGradient)"/>
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} width="14" height="14" viewBox="0 0 24 24" fill="#ccc" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      ))}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          position: 'relative',
          background: '#ffffff',
          aspectRatio: '1 / 1.1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          marginBottom: '16px',
        }}>
          {product.badge && (
            <span style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: '#000000',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              zIndex: 10,
            }}>
              {product.badge}
            </span>
          )}
          
          <img
            src={isHovered ? product.hoverImage : product.defaultImage}
            alt={product.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              transition: 'opacity 0.3s ease',
              transform: 'scale(1.1)',
            }}
          />

          <button
            onClick={handleQuickView}
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f5f5f5';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '4px',
            color: '#000000',
            lineHeight: '1.3',
          }}>
            {product.name}
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#666666', 
            marginBottom: '8px',
          }}>
            Smoothie
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
          }}>
            <StarRating rating={product.rating} />
            <span style={{ 
              fontSize: '13px', 
              color: '#666666',
            }}>
              {product.reviews.toLocaleString()} reviews
            </span>
          </div>
        </div>
      </Link>

      <button
        onClick={handleAddToCart}
        style={{
          width: '100%',
          padding: '14px 20px',
          background: '#000000',
          color: '#ffffff',
          border: 'none',
          borderRadius: '0',
          fontSize: '13px',
          fontWeight: '600',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#333333';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#000000';
        }}
      >
        Add to Cart  ${product.price.toFixed(2)}
      </button>
    </div>
  );
}

export default function Smoothies() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '80px 60px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '60px' }}>
            <div style={{ 
              background: '#f5f5f5', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              marginBottom: '40px', 
              width: '100%',
              maxWidth: '1200px',
              height: 'auto',
              aspectRatio: '1200 / 800',
              margin: '0 auto 40px auto' 
            }}>
              <img
                src="/images/smoothies-hero.jpg"
                alt="Smoothies"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <h1 style={{ 
              marginBottom: '16px', 
              fontSize: '42px',
              fontWeight: '600',
              color: '#000000',
              letterSpacing: '-0.5px',
            }}>
              Smoothies
            </h1>
            <p style={{ fontSize: '16px', color: '#666', maxWidth: '600px', lineHeight: '1.6' }}>
              It's never been easier—or healthier—to build a delicious daily routine.
            </p>
            <ul style={{ fontSize: '14px', color: '#666', marginTop: '24px', marginLeft: '20px', lineHeight: '1.8' }}>
              <li style={{ marginBottom: '6px' }}>Gluten-free + dairy-free</li>
              <li style={{ marginBottom: '6px' }}>A plentiful array of fruits + vegetables in each</li>
              <li style={{ marginBottom: '6px' }}>Comes frozen, pre-portioned + ready to blend</li>
              <li>As easy as it gets</li>
            </ul>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px 30px',
          }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      <Footer />

      <style jsx global>{`
        @media (max-width: 1200px) {
          .smoothies-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 900px) {
          .smoothies-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .smoothies-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
