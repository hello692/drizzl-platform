import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export default function Products() {
  const router = useRouter();
  const { category } = router.query;
  const { user } = useAuth();
  const { addItem } = useCart(user?.id);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchProducts = async () => {
      try {
        const url = category ? `/api/products?category=${category}` : '/api/products';
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, router.isReady]);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      router.push('/auth');
      return;
    }
    await addItem(product.id, 1);
    alert('Added to cart!');
  };

  const categoryName = category ? category.toString().replace('-', ' ') : 'All Products';

  return (
    <>
      <Navbar />
      <div className="products-page">
        <div className="products-container">
          <h1 className="products-title">
            {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
          </h1>

          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Loading products...</p>
          ) : products.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>No products found.</p>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  {product.image_url && (
                    <div className="product-image-container">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                  )}
                  <div className="product-info">
                    <h3 className="product-name">
                      {product.name}
                    </h3>
                    <p className="product-description">
                      {product.description}
                    </p>
                    <div className="product-footer">
                      <span className="product-price">${product.price}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="add-to-cart-btn"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .products-page {
          min-height: 60vh;
          padding: clamp(40px, 8vw, 60px) 0;
          background: #000000;
        }

        .products-container {
          max-width: 1400px;
          margin: 0 auto;
          padding-left: clamp(16px, 5vw, 80px);
          padding-right: clamp(16px, 5vw, 80px);
        }

        .products-title {
          font-size: clamp(28px, 6vw, 48px);
          font-weight: 600;
          margin-bottom: clamp(24px, 5vw, 40px);
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(16px, 3vw, 32px);
        }

        .product-card {
          background: #111111;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .product-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          transform: translateY(-4px);
        }

        .product-image-container {
          width: 100%;
          aspect-ratio: 1;
          background: rgba(255,255,255,0.05);
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-info {
          padding: clamp(16px, 3vw, 20px);
        }

        .product-name {
          font-size: clamp(14px, 2vw, 16px);
          font-weight: 600;
          margin-bottom: 8px;
          color: #ffffff;
          letter-spacing: -0.3px;
        }

        .product-description {
          font-size: clamp(12px, 1.5vw, 14px);
          color: rgba(255,255,255,0.6);
          margin-bottom: 12px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .product-price {
          font-weight: 600;
          font-size: clamp(14px, 2vw, 16px);
          color: #ffffff;
        }

        .add-to-cart-btn {
          padding: clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px);
          background: #ffffff;
          color: #000000;
          border: none;
          border-radius: 980px;
          font-size: clamp(12px, 1.5vw, 14px);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 44px;
          min-width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-to-cart-btn:hover {
          background: rgba(255,255,255,0.9);
          transform: scale(1.05);
        }

        .add-to-cart-btn:active {
          transform: scale(0.98);
        }

        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .product-card {
            max-width: 100%;
          }

          .add-to-cart-btn {
            flex: 1;
            min-height: 48px;
          }

          .product-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .product-price {
            text-align: center;
            margin-bottom: 8px;
          }
        }

        @media (max-width: 320px) {
          .products-container {
            padding-left: 12px;
            padding-right: 12px;
          }

          .product-info {
            padding: 12px;
          }
        }
      `}</style>
    </>
  );
}
