import Link from 'next/link';
import { useState } from 'react';

interface SmoothieCardProps {
  id: string;
  name: string;
  image: string;
  hoverImage?: string;
  badge?: string;
  price?: number;
  rating?: number;
  reviews?: number;
  showPrice?: boolean;
}

export default function SmoothieCard({ 
  id, 
  name, 
  image, 
  hoverImage,
  badge = 'BEST SELLER',
  price = 9.49,
  rating = 4.5,
  reviews = 186,
  showPrice = true 
}: SmoothieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="smoothie-card-stars">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} viewBox="0 0 24 24" fill="currentColor" className="star-icon star-filled">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg viewBox="0 0 24 24" className="star-icon star-half">
            <defs>
              <linearGradient id={`half-${id}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path fill={`url(#half-${id})`} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} viewBox="0 0 24 24" fill="#d1d5db" className="star-icon star-empty">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };
  
  return (
    <div 
      className="smoothie-card-dh"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {badge && (
        <div className="smoothie-card-dh-badge">
          {badge}
        </div>
      )}
      
      <Link href={`/products/${id}`} className="smoothie-card-dh-image-link">
        <div className="smoothie-card-dh-image-container">
          <img
            src={isHovered && hoverImage ? hoverImage : image}
            alt={name}
            className="smoothie-card-dh-image"
            loading="lazy"
            draggable={false}
          />
          <button className="smoothie-card-dh-zoom" aria-label="Quick view">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
      </Link>
      
      <div className="smoothie-card-dh-info">
        <Link href={`/products/${id}`}>
          <h3 className="smoothie-card-dh-name">{name}</h3>
        </Link>
        <p className="smoothie-card-dh-type">Smoothie</p>
        <div className="smoothie-card-dh-rating">
          {renderStars(rating)}
          <span className="smoothie-card-dh-reviews">{reviews} reviews</span>
        </div>
      </div>
      
      <Link href={`/products/${id}`} className="smoothie-card-dh-button">
        Add to Cart  ${price.toFixed(2)}
      </Link>
    </div>
  );
}
