import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  reviews: number;
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
    badge: 'Best Seller',
    defaultImage: '/products/strawberry-peach/transparent-glass-new.jpg',
    hoverImage: '/products/strawberry-peach/product-1.jpg',
  },
  { 
    id: '9', 
    name: 'Pink Piyata', 
    price: 8.99, 
    reviews: 127, 
    badge: 'New',
    defaultImage: '/products/pink-piyata/transparent-glass-1.png',
    hoverImage: '/products/pink-piyata/product-1.jpg',
  },
  { 
    id: '10', 
    name: 'Matcha', 
    price: 9.49, 
    reviews: 312, 
    badge: 'New',
    defaultImage: '/products/matcha/transparent-glass-1.png',
    hoverImage: '/products/matcha/product-1.jpg',
  },
  { 
    id: '11', 
    name: 'Mocha', 
    price: 9.49, 
    reviews: 245, 
    badge: 'New',
    defaultImage: '/products/mocha/transparent-glass-1.png',
    hoverImage: '/products/mocha/product-1.jpg',
  },
  { 
    id: '12', 
    name: 'Nutty Monkey', 
    price: 8.99, 
    reviews: 389, 
    badge: 'Best Seller',
    defaultImage: '/products/nutty-monkey/transparent-glass-1.png',
    hoverImage: '/products/nutty-monkey/product-1.jpg',
  },
  { 
    id: '13', 
    name: 'Mango Jackfruit', 
    price: 8.99, 
    reviews: 156, 
    badge: 'New',
    defaultImage: '/products/mango-jackfruit/transparent-glass-1.png',
    hoverImage: '/products/mango-jackfruit/product-1.jpg',
  },
  { 
    id: '14', 
    name: 'Coffee Mushroom', 
    price: 9.99, 
    reviews: 203, 
    badge: 'New',
    defaultImage: '/products/coffee-mushroom/transparent-glass-1.png',
    hoverImage: '/products/coffee-mushroom/product-1.jpg',
  },
  { 
    id: '15', 
    name: 'Chocolate Berry', 
    price: 8.99, 
    reviews: 278, 
    badge: 'New',
    defaultImage: '/products/chocolate-berry/transparent-glass-1.png',
    hoverImage: '/products/chocolate-berry/product-1.jpg',
  },
  { 
    id: '16', 
    name: 'Almond', 
    price: 8.99, 
    reviews: 312, 
    badge: 'New',
    defaultImage: '/products/almond/transparent-glass-1.png',
    hoverImage: '/products/almond/product-1.jpg',
  },
  { 
    id: '17', 
    name: 'Acai', 
    price: 9.49, 
    reviews: 487, 
    badge: 'Best Seller',
    defaultImage: '/products/acai/transparent-glass-1.png',
    hoverImage: '/products/acai/product-1.jpg',
  },
];

function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/product/${product.id}`}>
      <div 
        className="glass tech-shine" 
        style={{
          cursor: 'pointer',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '14px',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          boxShadow: isHovered 
            ? '0 20px 40px rgba(66, 133, 244, 0.2), inset 0 0 20px rgba(66, 133, 244, 0.05)'
            : '0 8px 24px rgba(66, 133, 244, 0.08)',
          transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
          borderColor: isHovered ? 'rgba(66, 133, 244, 0.4)' : 'rgba(255, 255, 255, 0.5)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{
          background: '#ffffff',
          aspectRatio: '1 / 1',
          borderRadius: '14px 14px 0 0',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {product.badge && (
            <span className="tech-shine" style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: product.badge === 'Best Seller' ? 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)' : 'linear-gradient(135deg, #373f47 0%, #4a5361 100%)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 12px rgba(66, 133, 244, 0.2)',
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
              transition: 'opacity 0.4s ease',
              padding: '20px',
            }}
          />
        </div>
        <div style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            {product.name}
          </h3>
          <p style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>
            ⭐ {product.reviews.toLocaleString()} reviews
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', fontSize: '16px' }}>${product.price.toFixed(2)}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="tech-shine"
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(66, 133, 244, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Smoothies() {
  return (
    <>
      <Navbar />
      <div className="gradient-animated" style={{ minHeight: '100vh', padding: '80px 80px', background: 'linear-gradient(-45deg, #ffffff, #f8f9fa, #ffffff, #f0f0f0)', backgroundSize: '400% 400%' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          {/* Header Section */}
          <div style={{ marginBottom: '60px' }}>
            <div className="tech-shine" style={{ background: 'linear-gradient(135deg, #f9f9fa 0%, #f0f0f0 100%)', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px', border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: '0 8px 32px rgba(66, 133, 244, 0.08)' }}>
              <img
                src="/images/smoothies-hero.jpg"
                alt="Smoothies"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            <h1 className="heading-2100 text-glow" style={{ marginBottom: '16px', fontSize: '48px' }}>Smoothies</h1>
            <p style={{ fontSize: '16px', color: '#666', maxWidth: '600px', lineHeight: '1.6' }}>
              It's never been easier—or healthier—to build a delicious daily routine.
            </p>
            <ul style={{ fontSize: '14px', color: '#666', marginTop: '24px', marginLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>Gluten-free + dairy-free</li>
              <li style={{ marginBottom: '8px' }}>A plentiful array of fruits + vegetables in each</li>
              <li style={{ marginBottom: '8px' }}>Comes frozen, pre-portioned + ready to blend</li>
              <li>As easy as it gets</li>
            </ul>
          </div>

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '32px',
          }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
