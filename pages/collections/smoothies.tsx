import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  reviews: number;
  rating: number;
  badge: string;
  defaultImage: string;
  hoverImage: string;
  ingredients: string[];
  dietaryTags: string[];
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
    ingredients: ['berries', 'banana'],
    dietaryTags: ['diabetes-friendly', 'heart-healthy', 'no-sugar-added'],
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
    ingredients: ['berries', 'coconut', 'banana'],
    dietaryTags: ['paleo', 'plant-based'],
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
    ingredients: ['greens', 'banana', 'coconut'],
    dietaryTags: ['glp-1', 'heart-healthy', 'mediterranean'],
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
    ingredients: ['cacao', 'caffeine', 'banana'],
    dietaryTags: ['heart-healthy'],
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
    ingredients: ['nuts', 'banana', 'cacao'],
    dietaryTags: ['paleo', 'plant-based'],
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
    ingredients: ['coconut', 'banana'],
    dietaryTags: ['diabetes-friendly', 'no-sugar-added', 'low-fat'],
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
    ingredients: ['caffeine', 'cacao', 'coconut'],
    dietaryTags: ['glp-1', 'paleo'],
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
    ingredients: ['cacao', 'berries', 'banana'],
    dietaryTags: ['heart-healthy', 'plant-based'],
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
    ingredients: ['nuts', 'coconut'],
    dietaryTags: ['paleo', 'mediterranean', 'low-fat'],
  },
  { 
    id: '17', 
    name: 'Acai', 
    price: 9.49, 
    reviews: 487,
    rating: 4.5,
    badge: 'Best Seller',
    defaultImage: '/products/acai/Acai-TG-1.jpg',
    hoverImage: '/products/acai/Acai-TG-2.jpg',
    ingredients: ['berries', 'banana', 'greens'],
    dietaryTags: ['diabetes-friendly', 'heart-healthy', 'plant-based'],
  },
];

const LIKES_OPTIONS = [
  { id: 'avocado', label: 'Avocado' },
  { id: 'banana', label: 'Banana' },
  { id: 'berries', label: 'Berries' },
  { id: 'cacao', label: 'Cacao' },
  { id: 'caffeine', label: 'Caffeine' },
  { id: 'coconut', label: 'Coconut' },
  { id: 'greens', label: 'Greens' },
  { id: 'nuts', label: 'Nuts' },
];

const DISLIKES_OPTIONS = [
  { id: 'no-avocado', label: 'No avocado', excludes: 'avocado' },
  { id: 'no-banana', label: 'No banana', excludes: 'banana' },
  { id: 'no-berries', label: 'No berries', excludes: 'berries' },
  { id: 'no-cacao', label: 'No cacao', excludes: 'cacao' },
  { id: 'no-caffeine', label: 'No caffeine', excludes: 'caffeine' },
  { id: 'no-cilantro', label: 'No cilantro', excludes: 'cilantro' },
  { id: 'no-coconut', label: 'No coconut', excludes: 'coconut' },
  { id: 'no-garlic', label: 'No garlic', excludes: 'garlic' },
];

const DIETARY_OPTIONS = [
  { id: 'diabetes-friendly', label: 'Diabetes friendly' },
  { id: 'glp-1', label: 'GLP-1' },
  { id: 'heart-healthy', label: 'Heart healthy' },
  { id: 'mediterranean', label: 'Mediterranean diet' },
  { id: 'no-sugar-added', label: 'No sugar added' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'plant-based', label: 'Plant-based Whole30' },
  { id: 'low-fat', label: '≤10g Fat' },
];

const SORT_OPTIONS = [
  { id: 'featured', label: 'featured' },
  { id: 'best-selling', label: 'best selling' },
  { id: 'alpha-asc', label: 'alphabetically, a-z' },
  { id: 'alpha-desc', label: 'alphabetically, z-a' },
  { id: 'price-asc', label: 'price, low to high' },
  { id: 'price-desc', label: 'price, high to low' },
];

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} width="14" height="14" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      ))}
      {hasHalfStar && (
        <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="halfGradientDark">
              <stop offset="50%" stopColor="#ffffff"/>
              <stop offset="50%" stopColor="rgba(255,255,255,0.3)"/>
            </linearGradient>
          </defs>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#halfGradientDark)"/>
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      ))}
    </span>
  );
}

function FilterChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 16px',
        borderRadius: '24px',
        border: selected ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
        background: selected ? '#ffffff' : 'transparent',
        color: selected ? '#000000' : '#ffffff',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
        minHeight: '44px',
      }}
    >
      {label}
    </button>
  );
}

function FilterPanel({ 
  isOpen, 
  onClose, 
  likes, 
  dislikes, 
  dietary, 
  onLikesChange, 
  onDislikesChange, 
  onDietaryChange,
  onClearAll,
  onApply 
}: {
  isOpen: boolean;
  onClose: () => void;
  likes: string[];
  dislikes: string[];
  dietary: string[];
  onLikesChange: (id: string) => void;
  onDislikesChange: (id: string) => void;
  onDietaryChange: (id: string) => void;
  onClearAll: () => void;
  onApply: () => void;
}) {
  const [showMoreLikes, setShowMoreLikes] = useState(false);
  const [showMoreDislikes, setShowMoreDislikes] = useState(false);
  const [showMoreDietary, setShowMoreDietary] = useState(false);

  const totalSelected = likes.length + dislikes.length + dietary.length;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'all 0.3s ease',
          zIndex: 999,
        }}
        onClick={onClose}
      />
      <div
        className="filter-panel"
        style={{
          position: 'fixed',
          top: 0,
          left: isOpen ? 0 : '-100%',
          width: 'min(380px, 100vw)',
          height: '100vh',
          background: '#111111',
          zIndex: 1000,
          transition: 'left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="14" y2="12" />
              <line x1="4" y1="18" x2="10" y2="18" />
            </svg>
            <span style={{ fontSize: '16px', fontWeight: '600', letterSpacing: '-0.3px', color: '#ffffff' }}>FILTER</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#ffffff' }}>Likes</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {(showMoreLikes ? LIKES_OPTIONS : LIKES_OPTIONS.slice(0, 8)).map(option => (
                <FilterChip
                  key={option.id}
                  label={option.label}
                  selected={likes.includes(option.id)}
                  onClick={() => onLikesChange(option.id)}
                />
              ))}
            </div>
            {LIKES_OPTIONS.length > 8 && (
              <button
                onClick={() => setShowMoreLikes(!showMoreLikes)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginTop: '12px',
                  padding: '8px 0',
                  minHeight: '44px',
                }}
              >
                {showMoreLikes ? 'show less' : 'show more'}
              </button>
            )}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#ffffff' }}>Dislikes</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {(showMoreDislikes ? DISLIKES_OPTIONS : DISLIKES_OPTIONS.slice(0, 6)).map(option => (
                <FilterChip
                  key={option.id}
                  label={option.label}
                  selected={dislikes.includes(option.id)}
                  onClick={() => onDislikesChange(option.id)}
                />
              ))}
            </div>
            {DISLIKES_OPTIONS.length > 6 && (
              <button
                onClick={() => setShowMoreDislikes(!showMoreDislikes)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginTop: '12px',
                  padding: '8px 0',
                  minHeight: '44px',
                }}
              >
                {showMoreDislikes ? 'show less' : 'show more'}
              </button>
            )}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#ffffff' }}>Dietary Needs</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {(showMoreDietary ? DIETARY_OPTIONS : DIETARY_OPTIONS.slice(0, 6)).map(option => (
                <FilterChip
                  key={option.id}
                  label={option.label}
                  selected={dietary.includes(option.id)}
                  onClick={() => onDietaryChange(option.id)}
                />
              ))}
            </div>
            {DIETARY_OPTIONS.length > 6 && (
              <button
                onClick={() => setShowMoreDietary(!showMoreDietary)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginTop: '12px',
                  padding: '8px 0',
                  minHeight: '44px',
                }}
              >
                {showMoreDietary ? 'show less' : 'show more'}
              </button>
            )}
          </div>
        </div>

        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
        }}>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.6)',
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            {totalSelected === 0 ? 'No filters selected' : `${totalSelected} filter${totalSelected > 1 ? 's' : ''} selected`}
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClearAll}
              style={{
                flex: 1,
                padding: '14px 20px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '980px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '48px',
              }}
            >
              Clear All
            </button>
            <button
              onClick={onApply}
              style={{
                flex: 1,
                padding: '14px 20px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '980px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '48px',
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function SortDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sort-button"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '0',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          minWidth: '120px',
          color: '#ffffff',
          minHeight: '48px',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
          <path d="M7 15l5 5 5-5" />
          <path d="M7 9l5-5 5 5" />
        </svg>
        SORT
      </button>
      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 98,
            }}
            onClick={() => setIsOpen(false)}
          />
          <div
            className="sort-dropdown"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              zIndex: 99,
              minWidth: '200px',
            }}
          >
            {SORT_OPTIONS.map(option => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '14px 16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '13px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  minHeight: '48px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                }}
              >
                <span>{option.label}</span>
                {value === option.id && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
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
      className="product-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#111111',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: 'clamp(8px, 2vw, 12px)',
        transition: 'all 0.3s ease',
        boxShadow: isHovered ? '0 0 20px rgba(255,255,255,0.05)' : 'none',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-image-container" style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          aspectRatio: '1',
          marginBottom: 'clamp(8px, 2vw, 12px)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}>
          {product.badge && (
            <span className="product-badge" style={{
              position: 'absolute',
              top: 'clamp(8px, 2vw, 12px)',
              left: 'clamp(8px, 2vw, 12px)',
              background: product.badge === 'New' ? '#22c55e' : '#ffffff',
              color: product.badge === 'New' ? '#ffffff' : '#000000',
              fontSize: 'clamp(9px, 1.2vw, 10px)',
              fontWeight: '600',
              padding: 'clamp(4px, 1vw, 6px) clamp(6px, 1.5vw, 10px)',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              zIndex: 5,
            }}>
              {product.badge}
            </span>
          )}
          <button
            onClick={handleQuickView}
            className="quick-view-btn"
            style={{
              position: 'absolute',
              bottom: 'clamp(8px, 2vw, 12px)',
              right: 'clamp(8px, 2vw, 12px)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
              zIndex: 5,
              minWidth: '44px',
              minHeight: '44px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <img
            src={isHovered ? product.hoverImage : product.defaultImage}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: 'clamp(12px, 3vw, 20px)',
              transition: 'all 0.4s ease',
            }}
          />
        </div>
        <div style={{ padding: '0 4px', marginBottom: 'clamp(8px, 2vw, 12px)' }}>
          <h3 className="product-name" style={{ 
            fontSize: 'clamp(13px, 2vw, 15px)', 
            fontWeight: '600', 
            marginBottom: '6px',
            color: '#ffffff',
            letterSpacing: '-0.3px',
          }}>
            {product.name}
          </h3>
          <div className="product-rating" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            flexWrap: 'wrap',
          }}>
            <StarRating rating={product.rating} />
            <span style={{
              fontSize: 'clamp(10px, 1.5vw, 12px)',
              color: 'rgba(255,255,255,0.6)',
            }}>
              {product.reviews.toLocaleString()} reviews
            </span>
          </div>
        </div>
      </Link>

      <button
        onClick={handleAddToCart}
        className="add-to-cart-btn"
        style={{
          width: '100%',
          padding: 'clamp(12px, 2vw, 14px) clamp(12px, 2vw, 20px)',
          background: '#ffffff',
          color: '#000000',
          border: 'none',
          borderRadius: '980px',
          fontSize: 'clamp(12px, 1.5vw, 14px)',
          fontWeight: '500',
          letterSpacing: '0',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          minHeight: '48px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#ffffff';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Add to Cart - ${product.price.toFixed(2)}
      </button>
    </div>
  );
}

export default function Smoothies() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [likes, setLikes] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [appliedLikes, setAppliedLikes] = useState<string[]>([]);
  const [appliedDislikes, setAppliedDislikes] = useState<string[]>([]);
  const [appliedDietary, setAppliedDietary] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');

  const toggleFilter = (list: string[], setList: (v: string[]) => void, id: string) => {
    if (list.includes(id)) {
      setList(list.filter(item => item !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleClearAll = () => {
    setLikes([]);
    setDislikes([]);
    setDietary([]);
  };

  const handleApply = () => {
    setAppliedLikes([...likes]);
    setAppliedDislikes([...dislikes]);
    setAppliedDietary([...dietary]);
    setFilterOpen(false);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (appliedLikes.length > 0) {
      result = result.filter(product =>
        appliedLikes.some(like => product.ingredients.includes(like))
      );
    }

    if (appliedDislikes.length > 0) {
      const excludedIngredients = appliedDislikes.map(d => {
        const option = DISLIKES_OPTIONS.find(o => o.id === d);
        return option?.excludes || '';
      }).filter(Boolean);
      result = result.filter(product =>
        !excludedIngredients.some(excluded => product.ingredients.includes(excluded))
      );
    }

    if (appliedDietary.length > 0) {
      result = result.filter(product =>
        appliedDietary.some(tag => product.dietaryTags.includes(tag))
      );
    }

    switch (sortBy) {
      case 'best-selling':
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'alpha-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alpha-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [appliedLikes, appliedDislikes, appliedDietary, sortBy]);

  useEffect(() => {
    if (filterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [filterOpen]);

  const activeFilterCount = appliedLikes.length + appliedDislikes.length + appliedDietary.length;

  return (
    <>
      <Navbar />
      <FilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        likes={likes}
        dislikes={dislikes}
        dietary={dietary}
        onLikesChange={(id) => toggleFilter(likes, setLikes, id)}
        onDislikesChange={(id) => toggleFilter(dislikes, setDislikes, id)}
        onDietaryChange={(id) => toggleFilter(dietary, setDietary, id)}
        onClearAll={handleClearAll}
        onApply={handleApply}
      />
      <div className="smoothies-page" style={{ minHeight: '100vh', background: '#000000' }}>
        <div className="page-container">
          <div className="hero-wrapper">
            <div className="smoothies-hero">
              <img
                src="/images/smoothies-hero.jpg"
                alt="Smoothies"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <h1 className="page-title">
              Smoothies
            </h1>
            <p className="page-description">
              It's never been easier—or healthier—to build a delicious daily routine.
            </p>
            <ul className="features-list">
              <li>Gluten-free + dairy-free</li>
              <li>A plentiful array of fruits + vegetables in each</li>
              <li>Comes frozen, pre-portioned + ready to blend</li>
              <li>As easy as it gets</li>
            </ul>
          </div>

          <div className="filter-bar">
            <button
              onClick={() => {
                setLikes([...appliedLikes]);
                setDislikes([...appliedDislikes]);
                setDietary([...appliedDietary]);
                setFilterOpen(true);
              }}
              className="filter-button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="14" y2="12" />
                <line x1="4" y1="18" x2="10" y2="18" />
              </svg>
              FILTER
              {activeFilterCount > 0 && (
                <span className="filter-count">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          <div className="smoothies-grid">
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredAndSortedProducts.length === 0 && (
            <div className="no-products">
              <p className="no-products-title">No products match your filters</p>
              <p className="no-products-subtitle">Try adjusting your filter selections</p>
            </div>
          )}
        </div>
      </div>
      <Footer />

      <style jsx global>{`
        .smoothies-page {
          padding: clamp(32px, 6vw, 48px) 0;
        }

        .page-container {
          max-width: 1400px;
          margin: 0 auto;
          padding-left: clamp(12px, 4vw, 80px);
          padding-right: clamp(12px, 4vw, 80px);
        }

        .hero-wrapper {
          margin-bottom: clamp(24px, 4vw, 32px);
        }

        .smoothies-hero {
          background: #111111;
          border-radius: clamp(8px, 1.5vw, 12px);
          overflow: hidden;
          margin-bottom: clamp(24px, 4vw, 40px);
          width: 100%;
          max-width: 1200px;
          aspect-ratio: 1200 / 800;
          margin-left: auto;
          margin-right: auto;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .page-title {
          margin-bottom: clamp(12px, 2vw, 16px);
          font-size: clamp(28px, 6vw, 42px);
          font-weight: 600;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .page-description {
          font-size: clamp(14px, 2vw, 16px);
          color: rgba(255,255,255,0.6);
          max-width: 600px;
          line-height: 1.6;
          margin: 0;
        }

        .features-list {
          font-size: clamp(12px, 1.8vw, 14px);
          color: rgba(255,255,255,0.6);
          margin-top: clamp(16px, 3vw, 24px);
          margin-left: 20px;
          line-height: 1.8;
          padding: 0;
        }

        .features-list li {
          margin-bottom: 6px;
        }

        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: clamp(24px, 4vw, 32px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: clamp(16px, 3vw, 24px);
          flex-wrap: wrap;
          gap: 12px;
        }

        .filter-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #111111;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          color: #ffffff;
          min-height: 48px;
        }

        .filter-count {
          background: #ffffff;
          color: #000000;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: 4px;
        }

        .smoothies-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(16px, 3vw, 28px) clamp(12px, 2vw, 24px);
        }

        .no-products {
          text-align: center;
          padding: clamp(40px, 8vw, 60px) 20px;
          color: rgba(255,255,255,0.6);
        }

        .no-products-title {
          font-size: clamp(16px, 2.5vw, 18px);
          margin-bottom: 12px;
          color: #ffffff;
        }

        .no-products-subtitle {
          font-size: clamp(12px, 2vw, 14px);
        }

        @media (max-width: 1024px) {
          .smoothies-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .smoothies-hero {
            aspect-ratio: 16 / 10;
          }
        }

        @media (max-width: 768px) {
          .smoothies-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .filter-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-button,
          .sort-button {
            width: 100%;
            justify-content: center;
          }

          .sort-dropdown {
            left: 0;
            right: 0;
            width: 100%;
          }

          .smoothies-hero {
            aspect-ratio: 4 / 3;
          }
        }

        @media (max-width: 480px) {
          .smoothies-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .smoothies-hero {
            aspect-ratio: 1 / 1;
            border-radius: 8px;
          }

          .features-list {
            margin-left: 16px;
          }
        }

        @media (max-width: 320px) {
          .page-container {
            padding-left: 8px;
            padding-right: 8px;
          }

          .filter-button,
          .sort-button {
            padding: 12px 12px;
            font-size: 12px;
          }

          .add-to-cart-btn {
            font-size: 11px !important;
            padding: 12px 8px !important;
          }
        }
      `}</style>
    </>
  );
}
