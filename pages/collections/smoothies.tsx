import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useState } from 'react';

interface ProductImage {
  src: string;
  alt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  reviews: number;
  badge: string;
  images: ProductImage[];
}

const products: Product[] = [
  { 
    id: '1', 
    name: 'Strawberry + Peach', 
    price: 8.49, 
    reviews: 4619, 
    badge: 'Best Seller',
    images: [
      { src: '/products/strawberry-peach/transparent-glass-1.jpg', alt: 'Strawberry Peach - Transparent Glass' },
      { src: '/products/strawberry-peach/transparent-glass-2.jpg', alt: 'Strawberry Peach - Glass with Fruits' },
      { src: '/products/strawberry-peach/transparent-glass-3.jpg', alt: 'Strawberry Peach - Ingredients' },
      { src: '/products/strawberry-peach/product-1.jpg', alt: 'Strawberry Peach - Product Shot' },
      { src: '/products/strawberry-peach/product-2.jpg', alt: 'Strawberry Peach - Smoothie Ready' },
      { src: '/products/strawberry-peach/product-3.jpg', alt: 'Strawberry Peach - Fresh Blend' },
      { src: '/products/strawberry-peach/lifestyle-1.jpg', alt: 'Strawberry Peach - Lifestyle' },
      { src: '/products/strawberry-peach/detail-1.jpg', alt: 'Strawberry Peach - Detail' },
    ]
  },
  { 
    id: '2', 
    name: 'Acai + Cherry', 
    price: 8.49, 
    reviews: 2686, 
    badge: 'Best Seller',
    images: [{ src: 'https://via.placeholder.com/400x400?text=Acai+Cherry', alt: 'Acai Cherry' }]
  },
  { 
    id: '3', 
    name: 'Mint + Cacao', 
    price: 8.49, 
    reviews: 2200, 
    badge: '',
    images: [{ src: 'https://via.placeholder.com/400x400?text=Mint+Cacao', alt: 'Mint Cacao' }]
  },
  { 
    id: '4', 
    name: 'Tropical Greens Protein', 
    price: 9.49, 
    reviews: 43, 
    badge: 'New',
    images: [{ src: 'https://via.placeholder.com/400x400?text=Tropical+Greens', alt: 'Tropical Greens' }]
  },
  { 
    id: '5', 
    name: 'Strawberry Banana Protein', 
    price: 9.49, 
    reviews: 48, 
    badge: 'New',
    images: [{ src: 'https://via.placeholder.com/400x400?text=Strawberry+Banana', alt: 'Strawberry Banana' }]
  },
  { 
    id: '6', 
    name: 'Mixed Berry Protein', 
    price: 9.49, 
    reviews: 185, 
    badge: 'Best Seller',
    images: [{ src: 'https://via.placeholder.com/400x400?text=Mixed+Berry', alt: 'Mixed Berry' }]
  },
  { 
    id: '7', 
    name: 'Vanilla Bean Protein', 
    price: 9.49, 
    reviews: 207, 
    badge: 'Best Seller',
    images: [{ src: 'https://via.placeholder.com/400x400?text=Vanilla+Bean', alt: 'Vanilla Bean' }]
  },
  { 
    id: '8', 
    name: 'Dark Chocolate Protein', 
    price: 9.49, 
    reviews: 199, 
    badge: 'Best Seller',
    images: [{ src: 'https://via.placeholder.com/400x400?text=Dark+Chocolate', alt: 'Dark Chocolate' }]
  },
];

function ProductCard({ product }: { product: Product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = product.images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const goToImage = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="glass tech-shine" style={{
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '14px',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 24px rgba(66, 133, 244, 0.08)',
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(66, 133, 244, 0.2), inset 0 0 20px rgba(66, 133, 244, 0.05)';
          e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
          e.currentTarget.style.borderColor = 'rgba(66, 133, 244, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(66, 133, 244, 0.08)';
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #f9f9fa 0%, #f0f0f0 100%)',
          height: '280px',
          borderRadius: '14px 14px 0 0',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 0 15px rgba(66, 133, 244, 0.05)',
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
            src={product.images[currentImageIndex].src}
            alt={product.images[currentImageIndex].alt}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'opacity 0.3s ease',
            }}
          />

          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#ffffff',
                  border: '1px solid #e0e0e0',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  color: '#000',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#000';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#000';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#ffffff',
                  border: '1px solid #e0e0e0',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  color: '#000',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#000';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#000';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px',
                zIndex: 10,
              }}>
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => goToImage(e, index)}
                    style={{
                      width: index === currentImageIndex ? '20px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: index === currentImageIndex ? '#000' : 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </div>
            </>
          )}
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
                src="https://via.placeholder.com/1200x200?text=Smoothies+Hero"
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
