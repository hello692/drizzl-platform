import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useState } from 'react';

const products = [
  { id: '1', name: 'Strawberry + Peach', type: 'Smoothie', price: 8.49, reviews: 4619, rating: 4.5, badge: 'BEST SELLER', image: '/products/strawberry-peach/gallery-1.jpg' },
  { id: '9', name: 'Pink Piyata', type: 'Smoothie', price: 8.99, reviews: 127, rating: 4.8, badge: 'NEW', image: '/products/pink-piyata/gallery-1.jpg' },
  { id: '10', name: 'Matcha', type: 'Smoothie', price: 9.49, reviews: 312, rating: 4.7, badge: 'NEW', image: '/products/matcha/gallery-1.jpg' },
  { id: '11', name: 'Mocha', type: 'Smoothie', price: 9.49, reviews: 245, rating: 4.8, badge: 'NEW', image: '/products/mocha/gallery-1.jpg' },
  { id: '12', name: 'Nutty Monkey', type: 'Smoothie', price: 8.99, reviews: 389, rating: 4.9, badge: 'BEST SELLER', image: '/products/nutty-monkey/gallery-1.jpg' },
  { id: '13', name: 'Mango Jackfruit', type: 'Smoothie', price: 8.99, reviews: 156, rating: 4.8, badge: 'NEW', image: '/products/mango-jackfruit/gallery-1.jpg' },
  { id: '14', name: 'Coffee Mushroom', type: 'Smoothie', price: 9.99, reviews: 203, rating: 4.8, badge: 'NEW', image: '/products/coffee-mushroom/gallery-1.jpg' },
  { id: '15', name: 'Chocolate Berry', type: 'Smoothie', price: 8.99, reviews: 278, rating: 4.8, badge: 'NEW', image: '/products/chocolate-berry/gallery-1.jpg' },
  { id: '16', name: 'Almond', type: 'Smoothie', price: 8.99, reviews: 187, rating: 4.7, badge: 'NEW', image: '/products/almond/gallery-1.jpg' },
  { id: '17', name: 'Acai', type: 'Smoothie', price: 9.49, reviews: 487, rating: 4.9, badge: 'BEST SELLER', image: '/products/acai/Acai-TG-1.jpg' },
];

export default function Smoothies() {
  const [sortValue, setSortValue] = useState('Featured');

  return (
    <>
      <Navbar />
      <div className="smoothies-page">
        <div className="promo-banner">
          <p>
            ⭐ Receive the value of 2 smoothies free.{' '}
            <a href="#" className="promo-link">Shop Smoothie Sale</a>
          </p>
        </div>

        <div className="page-content">
          <div className="container">
            <div className="hero-section">
              <img
                src="https://daily-harvest.com/cdn/shop/files/ModelSmoothieHeaderwAttributes.jpg?v=1755195930&width=1580"
                alt="Smoothies"
                className="hero-image"
              />
            </div>

            <h1 className="page-title">Smoothies</h1>
            <p className="page-description">
              Healthy made simple.
            </p>

            <div className="features-grid">
              <div className="feature-item">
                <p>Always gluten-free + dairy-free</p>
              </div>
              <div className="feature-item">
                <p>Whole fruits + vegetables in every cup</p>
              </div>
              <div className="feature-item">
                <p>Frozen fresh and portioned for you</p>
              </div>
              <div className="feature-item">
                <p>Blend. Enjoy. Done.</p>
              </div>
            </div>

            <div className="filter-bar">
              <span className="filter-label">FILTER & SORT</span>
              <select 
                className="sort-select"
                value={sortValue}
                onChange={(e) => setSortValue(e.target.value)}
              >
                <option>Featured</option>
                <option>Best selling</option>
                <option>Price, low to high</option>
                <option>Price, high to low</option>
              </select>
            </div>

            <div className="products-grid">
              {products.map(product => (
                <Link key={product.id} href={`/product/${product.id}`} className="product-link">
                  <div className="product-card">
                    <div className="image-container">
                      {product.badge && (
                        <div className="product-badge">
                          {product.badge}
                        </div>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>

                    <h3 className="product-name">
                      {product.name}
                    </h3>

                    <p className="product-type">
                      {product.type}
                    </p>

                    <div className="product-rating">
                      <span className="stars">
                        {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                      </span>
                      <span className="review-count">
                        {product.reviews.toLocaleString()} reviews
                      </span>
                    </div>

                    <p className="product-price">
                      ${product.price.toFixed(2)}
                    </p>

                    <button 
                      className="add-to-cart-btn"
                      onClick={(e) => { e.preventDefault(); }}
                    >
                      ADD TO CART ${product.price.toFixed(2)}
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .smoothies-page {
          min-height: 100vh;
          background: #ffffff;
        }

        .promo-banner {
          background: rgba(248, 249, 250, 0.8);
          padding: clamp(12px, 3vw, 18px) clamp(16px, 5vw, 80px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.5);
          text-align: center;
          font-size: clamp(12px, 2vw, 14px);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 12px rgba(66, 133, 244, 0.05);
        }

        .promo-banner p {
          margin: 0;
          color: #000;
        }

        .promo-link {
          color: #000;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
          border-bottom: 2px solid transparent;
          padding-bottom: 2px;
        }

        .promo-link:hover {
          border-color: #000;
        }

        .page-content {
          padding: clamp(40px, 8vw, 80px) 0;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding-left: clamp(16px, 5vw, 80px);
          padding-right: clamp(16px, 5vw, 80px);
        }

        .hero-section {
          background: linear-gradient(135deg, #f0f0f0 0%, #f8f9fa 100%);
          border-radius: clamp(8px, 2vw, 16px);
          height: clamp(180px, 30vw, 280px);
          margin-bottom: clamp(24px, 4vw, 40px);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(66, 133, 244, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .page-title {
          font-size: clamp(32px, 7vw, 48px);
          margin-bottom: clamp(12px, 2vw, 16px);
          margin-top: 0;
          font-weight: 600;
          color: #000;
          letter-spacing: -0.5px;
        }

        .page-description {
          font-size: clamp(14px, 2vw, 16px);
          color: #666;
          margin-bottom: clamp(24px, 4vw, 32px);
          max-width: 800px;
          line-height: 1.6;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(12px, 2vw, 24px);
          margin-bottom: clamp(40px, 6vw, 60px);
        }

        .feature-item {
          font-size: clamp(12px, 1.5vw, 14px);
          font-weight: 600;
          color: #000;
        }

        .feature-item p {
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .filter-bar {
          margin-bottom: clamp(24px, 4vw, 40px);
          padding-bottom: clamp(16px, 2vw, 20px);
          border-bottom: 1px solid rgba(224, 224, 224, 0.4);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .filter-label {
          font-size: clamp(11px, 1.5vw, 13px);
          font-weight: 700;
          letter-spacing: 1px;
        }

        .sort-select {
          padding: clamp(10px, 1.5vw, 12px) clamp(12px, 2vw, 16px);
          border: 1px solid rgba(224, 224, 224, 0.6);
          border-radius: 10px;
          font-size: clamp(12px, 1.5vw, 13px);
          cursor: pointer;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 44px;
          min-width: 120px;
        }

        .sort-select:hover {
          box-shadow: inset 0 0 15px rgba(66, 133, 244, 0.1);
          border-color: rgba(66, 133, 244, 0.3);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(20px, 4vw, 40px);
          margin-bottom: clamp(40px, 6vw, 60px);
        }

        .product-link {
          text-decoration: none;
          color: inherit;
        }

        .product-card {
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .product-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .image-container {
          position: relative;
          margin-bottom: clamp(12px, 2vw, 20px);
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: inset 0 0 20px rgba(66, 133, 244, 0.05);
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .image-container:hover {
          box-shadow: inset 0 0 30px rgba(66, 133, 244, 0.15), 0 0 20px rgba(66, 133, 244, 0.1);
        }

        .product-badge {
          position: absolute;
          top: clamp(10px, 2vw, 16px);
          left: clamp(10px, 2vw, 16px);
          background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: clamp(4px, 1vw, 6px) clamp(8px, 1.5vw, 14px);
          font-size: clamp(9px, 1.2vw, 11px);
          font-weight: 800;
          letter-spacing: 1px;
          z-index: 10;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(66, 133, 244, 0.2);
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-name {
          font-size: clamp(14px, 2vw, 16px);
          font-weight: 700;
          margin: 0 0 4px 0;
          line-height: 1.3;
          color: #000;
        }

        .product-type {
          font-size: clamp(11px, 1.5vw, 13px);
          color: #666;
          margin: 0 0 8px 0;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: clamp(12px, 2vw, 16px);
          flex-wrap: wrap;
        }

        .stars {
          font-size: clamp(12px, 1.5vw, 14px);
          color: #000;
        }

        .review-count {
          font-size: clamp(11px, 1.5vw, 13px);
          color: #666;
        }

        .product-price {
          font-size: clamp(14px, 2vw, 16px);
          font-weight: 700;
          margin: 0 0 clamp(12px, 2vw, 16px) 0;
          color: #000;
        }

        .add-to-cart-btn {
          width: 100%;
          padding: clamp(12px, 2vw, 14px) 12px;
          background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          font-size: clamp(11px, 1.5vw, 13px);
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          min-height: 48px;
        }

        .add-to-cart-btn:hover {
          box-shadow: 0 20px 40px rgba(66, 133, 244, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .add-to-cart-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .filter-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-label {
            text-align: center;
          }

          .sort-select {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .feature-item {
            padding: 12px 0;
            border-bottom: 1px solid rgba(0,0,0,0.05);
          }

          .feature-item:last-child {
            border-bottom: none;
          }

          .product-card {
            max-width: 100%;
          }
        }

        @media (max-width: 320px) {
          .container {
            padding-left: 12px;
            padding-right: 12px;
          }

          .promo-banner {
            padding: 10px 12px;
          }

          .add-to-cart-btn {
            padding: 14px 8px;
            font-size: 11px;
          }
        }
      `}</style>
    </>
  );
}
