import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

const fallbackProducts: Product[] = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, category: 'Smoothie', image: '/products/strawberry-peach/gallery-1.png' },
  { id: '9', name: 'Pink Piyata', price: 8.99, category: 'Smoothie', image: '/products/pink-piyata/gallery-1.jpg' },
  { id: '10', name: 'Matcha', price: 9.49, category: 'Smoothie', image: '/products/matcha/gallery-1.jpg' },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, category: 'Smoothie', image: '/products/coffee-mushroom/gallery-1.jpg' },
  { id: '2', name: 'Acai Berry', price: 9.49, category: 'Smoothie', image: '/products/acai/gallery-1.jpg' },
  { id: '3', name: 'Mango Jackfruit', price: 8.99, category: 'Smoothie', image: '/products/mango-jackfruit/Mango Jackfruit-1.png' },
  { id: '4', name: 'Chocolate Berry', price: 9.49, category: 'Smoothie', image: '/products/chocolate-berry/gallery-1.jpg' },
  { id: 'box1', name: 'The Starter Box', price: 59.99, category: 'Box', image: '/products/acai/gallery-2.jpg' },
];

const categories = ['All', 'Smoothie', 'Box'];
const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Name: A-Z'];

function ProductSkeleton() {
  return (
    <div className="product-card skeleton">
      <div className="product-image-wrapper skeleton-image"></div>
      <div className="product-info">
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-category"></div>
        <div className="product-footer">
          <div className="skeleton-text skeleton-price"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
      <style jsx>{`
        .product-card.skeleton {
          background: #161616;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          overflow: hidden;
        }
        .skeleton-image {
          width: 100%;
          padding-bottom: 100%;
          background: linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .skeleton-text {
          background: linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }
        .skeleton-title {
          height: 20px;
          width: 80%;
          margin-bottom: 8px;
        }
        .skeleton-category {
          height: 14px;
          width: 50%;
          margin-bottom: 12px;
        }
        .skeleton-price {
          height: 20px;
          width: 60px;
        }
        .skeleton-button {
          height: 44px;
          width: 60px;
          background: linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export default function ShopAll() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.error) {
          console.warn('API returned error, using fallback data:', data.error);
          setProducts(fallbackProducts);
          setError(null);
        } else if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts(fallbackProducts);
        setError(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Name: A-Z') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <>
      <Navbar />
      <div className="shop-page">
        <div className="shop-container">
          <header className="shop-header">
            <h1 className="shop-title">Shop All</h1>
            <p className="shop-subtitle">
              Browse our complete collection of organic smoothies and wellness products.
            </p>
          </header>

          <div className="shop-search-bar">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="shop-controls">
            <button 
              className="filter-toggle"
              onClick={() => setFiltersOpen(!filtersOpen)}
              aria-expanded={filtersOpen}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              <span>Filters</span>
            </button>

            <div className="category-scroll">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="sort-wrapper">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {filtersOpen && (
            <div className="filters-panel">
              <div className="filter-group">
                <h4>Category</h4>
                <div className="filter-options">
                  {categories.map(cat => (
                    <label key={cat} className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="products-count">
            {loading ? 'Loading...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
          </div>

          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(p => (
                <div key={p.id} className="product-card">
                  <Link href={`/products/${p.id}`} className="product-image-link">
                    <div className="product-image-wrapper">
                      <img 
                        src={p.image} 
                        alt={p.name}
                        className="product-image"
                        loading="lazy"
                      />
                    </div>
                  </Link>
                  <div className="product-info">
                    <Link href={`/products/${p.id}`}>
                      <h3 className="product-name">{p.name}</h3>
                    </Link>
                    <p className="product-category">{p.category}</p>
                    <div className="product-footer">
                      <span className="product-price">${p.price.toFixed(2)}</span>
                      <button className="add-to-cart-btn">Add</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="no-results">
              <p>No products found matching your criteria.</p>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .shop-page {
          min-height: 60vh;
          padding: clamp(100px, 12vw, 140px) clamp(16px, 4vw, 40px) clamp(40px, 8vw, 60px);
          background: #000;
        }

        .shop-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .shop-header {
          margin-bottom: clamp(24px, 4vw, 40px);
        }

        .shop-title {
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 600;
          color: #f5f5f7;
          margin-bottom: clamp(8px, 2vw, 16px);
          letter-spacing: -0.02em;
        }

        .shop-subtitle {
          font-size: clamp(0.875rem, 2vw, 1rem);
          color: #86868b;
          max-width: 600px;
        }

        .shop-search-bar {
          position: relative;
          margin-bottom: clamp(16px, 3vw, 24px);
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #86868b;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: clamp(12px, 2vw, 14px) 16px clamp(12px, 2vw, 14px) 48px;
          background: #161616;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #f5f5f7;
          font-size: clamp(0.875rem, 2vw, 1rem);
          min-height: 48px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .search-input::placeholder {
          color: #6e6e73;
        }

        .search-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
        }

        .shop-controls {
          display: flex;
          align-items: center;
          gap: clamp(8px, 2vw, 16px);
          margin-bottom: clamp(16px, 3vw, 24px);
          flex-wrap: wrap;
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #161616;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #f5f5f7;
          font-size: clamp(0.75rem, 1.5vw, 0.875rem);
          cursor: pointer;
          min-height: 44px;
          transition: all 0.2s ease;
        }

        .filter-toggle:hover {
          background: #1d1d1f;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .category-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 4px 0;
          flex: 1;
          min-width: 0;
        }

        .category-scroll::-webkit-scrollbar {
          display: none;
        }

        .category-chip {
          flex-shrink: 0;
          padding: 10px 16px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          color: #86868b;
          font-size: clamp(0.75rem, 1.5vw, 0.875rem);
          cursor: pointer;
          min-height: 44px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .category-chip:hover {
          border-color: rgba(255, 255, 255, 0.3);
          color: #f5f5f7;
        }

        .category-chip.active {
          background: #f5f5f7;
          border-color: #f5f5f7;
          color: #000;
        }

        .sort-wrapper {
          position: relative;
        }

        .sort-select {
          padding: 10px 36px 10px 16px;
          background: #161616;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #f5f5f7;
          font-size: clamp(0.75rem, 1.5vw, 0.875rem);
          cursor: pointer;
          min-height: 44px;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%2386868b' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          transition: all 0.2s ease;
        }

        .sort-select:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .sort-select:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.3);
        }

        .filters-panel {
          background: #161616;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: clamp(16px, 3vw, 24px);
          margin-bottom: clamp(16px, 3vw, 24px);
        }

        .filter-group h4 {
          color: #f5f5f7;
          font-size: clamp(0.875rem, 2vw, 1rem);
          font-weight: 500;
          margin-bottom: 12px;
        }

        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #86868b;
          font-size: clamp(0.75rem, 1.5vw, 0.875rem);
          cursor: pointer;
          min-height: 44px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .filter-option:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #f5f5f7;
        }

        .filter-option input {
          width: 18px;
          height: 18px;
          accent-color: #f5f5f7;
        }

        .products-count {
          color: #6e6e73;
          font-size: clamp(0.75rem, 1.5vw, 0.875rem);
          margin-bottom: clamp(12px, 2vw, 16px);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: clamp(0.75rem, 2vw, 1.5rem);
        }

        @media (min-width: 480px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .product-card {
          background: #161616;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .product-card:hover {
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .product-image-link {
          display: block;
        }

        .product-image-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 100%;
          background: #0a0a0a;
          overflow: hidden;
        }

        .product-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-info {
          padding: clamp(12px, 2vw, 16px);
        }

        .product-name {
          font-size: clamp(0.875rem, 2vw, 1rem);
          font-weight: 600;
          color: #f5f5f7;
          margin-bottom: 4px;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .product-category {
          font-size: clamp(0.75rem, 1.5vw, 0.875rem);
          color: #6e6e73;
          margin-bottom: clamp(8px, 1.5vw, 12px);
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .product-price {
          font-size: clamp(0.875rem, 2vw, 1rem);
          font-weight: 600;
          color: #f5f5f7;
        }

        .add-to-cart-btn {
          padding: clamp(10px, 2vw, 12px) clamp(16px, 2.5vw, 20px);
          background: #f5f5f7;
          color: #000;
          border: none;
          border-radius: 8px;
          font-size: clamp(0.75rem, 1.5vw, 0.875rem);
          font-weight: 600;
          cursor: pointer;
          min-height: 44px;
          transition: all 0.2s ease;
        }

        .add-to-cart-btn:hover {
          background: #e8e8e8;
          transform: scale(1.02);
        }

        .add-to-cart-btn:active {
          transform: scale(0.98);
        }

        .no-results {
          text-align: center;
          padding: clamp(40px, 8vw, 80px) 20px;
          color: #86868b;
        }

        .no-results p {
          margin-bottom: 16px;
          font-size: clamp(0.875rem, 2vw, 1rem);
        }

        .no-results button {
          padding: 12px 24px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #f5f5f7;
          font-size: clamp(0.875rem, 2vw, 1rem);
          cursor: pointer;
          min-height: 48px;
          transition: all 0.2s ease;
        }

        .no-results button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 480px) {
          .shop-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-toggle {
            width: 100%;
            justify-content: center;
          }

          .category-scroll {
            width: 100%;
          }

          .sort-wrapper {
            width: 100%;
          }

          .sort-select {
            width: 100%;
          }

          .filter-toggle span {
            display: inline;
          }
        }

        @media (min-width: 481px) and (max-width: 767px) {
          .filter-toggle span {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
