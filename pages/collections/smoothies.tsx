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
    defaultImage: '/products/strawberry-peach/main-product.png',
    hoverImage: '/products/strawberry-peach/transparent-glass-1.png',
  },
  { 
    id: '2', 
    name: 'Acai + Cherry', 
    price: 8.49, 
    reviews: 2686, 
    badge: 'Best Seller',
    defaultImage: 'https://daily-harvest.com/cdn/shop/files/acai-cherry-smoothie-daily-harvest-8004331.jpg?v=1760509351&width=2048',
    hoverImage: 'https://daily-harvest.com/cdn/shop/files/acai-cherry-smoothie-daily-harvest-2748098.jpg?v=1760509351&width=2048',
  },
  { 
    id: '3', 
    name: 'Mint + Cacao', 
    price: 8.49, 
    reviews: 2200, 
    badge: '',
    defaultImage: 'https://daily-harvest.com/cdn/shop/files/mint-cacao-smoothie-daily-harvest-5348712.jpg?v=1760509343&width=2048',
    hoverImage: 'https://daily-harvest.com/cdn/shop/files/mint-cacao-smoothie-daily-harvest-9561489.jpg?v=1760509343&width=2048',
  },
  { 
    id: '4', 
    name: 'Tropical Greens Protein', 
    price: 9.49, 
    reviews: 43, 
    badge: 'New',
    defaultImage: 'https://daily-harvest.com/cdn/shop/files/tropical-greens-protein-smoothie-daily-harvest-8021323.jpg?v=1760509314&width=2048',
    hoverImage: 'https://daily-harvest.com/cdn/shop/files/tropical-greens-protein-smoothie-daily-harvest-2811664.jpg?v=1760509314&width=2048',
  },
  { 
    id: '5', 
    name: 'Strawberry Banana Protein', 
    price: 9.49, 
    reviews: 48, 
    badge: 'New',
    defaultImage: '/products/strawberry-banana-protein/transparent-glass-1.png',
    hoverImage: '/products/strawberry-banana-protein/transparent-glass-2.png',
  },
  { 
    id: '6', 
    name: 'Mixed Berry Protein', 
    price: 9.49, 
    reviews: 185, 
    badge: 'Best Seller',
    defaultImage: 'https://daily-harvest.com/cdn/shop/files/mixed-berry-protein-smoothie-daily-harvest-3950952.jpg?v=1760509317&width=2048',
    hoverImage: 'https://daily-harvest.com/cdn/shop/files/mixed-berry-protein-smoothie-daily-harvest-5924387.jpg?v=1760509318&width=2048',
  },
  { 
    id: '7', 
    name: 'Vanilla Bean Protein', 
    price: 9.49, 
    reviews: 207, 
    badge: 'Best Seller',
    defaultImage: 'https://daily-harvest.com/cdn/shop/files/vanilla-bean-protein-smoothie-daily-harvest-1407106.jpg?v=1760509317&width=2048',
    hoverImage: 'https://daily-harvest.com/cdn/shop/files/vanilla-bean-protein-smoothie-daily-harvest-8692813.jpg?v=1760509317&width=2048',
  },
  { 
    id: '8', 
    name: 'Dark Chocolate Protein', 
    price: 9.49, 
    reviews: 199, 
    badge: 'Best Seller',
    defaultImage: 'https://daily-harvest.com/cdn/shop/files/dark-chocolate-protein-smoothie-daily-harvest-4692961.jpg?v=1760509316&width=2048',
    hoverImage: 'https://daily-harvest.com/cdn/shop/files/dark-chocolate-protein-smoothie-daily-harvest-3901097.jpg?v=1760509317&width=2048',
  },
  { 
    id: '9', 
    name: 'Pink Piyata', 
    price: 8.99, 
    reviews: 127, 
    badge: 'New',
    defaultImage: '/products/pink-piyata/transparent-glass-1.png',
    hoverImage: '/products/pink-piyata/transparent-glass-2.png',
  },
  { 
    id: '10', 
    name: 'Matcha', 
    price: 9.49, 
    reviews: 312, 
    badge: 'New',
    defaultImage: '/products/matcha/transparent-glass-1.png',
    hoverImage: '/products/matcha/transparent-glass-2.png',
  },
  { 
    id: '11', 
    name: 'Mocha', 
    price: 9.49, 
    reviews: 245, 
    badge: 'New',
    defaultImage: '/products/mocha/transparent-glass-1.png',
    hoverImage: '/products/mocha/transparent-glass-2.png',
  },
  { 
    id: '12', 
    name: 'Nutty Monkey', 
    price: 8.99, 
    reviews: 389, 
    badge: 'Best Seller',
    defaultImage: '/products/nutty-monkey/transparent-glass-1.png',
    hoverImage: '/products/nutty-monkey/transparent-glass-2.png',
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
            <div className="tech-shine" style={{ background: 'linear-gradient(135deg, #f9f9fa 0%, #f0f0f0 100%)', borderRadius: '16px', padding: '40px', marginBottom: '40px', border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: '0 8px 32px rgba(66, 133, 244, 0.08)' }}>
              <img
                src="https://daily-harvest.com/cdn/shop/files/ModelSmoothieHeaderwAttributes.jpg?v=1755195930&width=1580"
                alt="Smoothies"
                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
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
