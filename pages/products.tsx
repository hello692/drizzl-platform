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
      <div style={{ minHeight: '60vh', padding: '60px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: 'clamp(24px, 5vw, 80px)', paddingRight: 'clamp(24px, 5vw, 80px)' }}>
          <h1 style={{ marginBottom: '40px' }}>
            {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
          </h1>

          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '32px',
            }}>
              {products.map(product => (
                <div key={product.id} style={{
                  background: 'white',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {product.image_url && (
                    <div style={{
                      width: '100%',
                      height: '240px',
                      background: '#f9f9f9',
                      overflow: 'hidden',
                    }}>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#999', marginBottom: '12px' }}>
                      {product.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600' }}>${product.price}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        style={{
                          padding: '8px 16px',
                          background: '#000',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '14px',
                        }}
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
    </>
  );
}
