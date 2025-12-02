import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=smoothie');
        if (response.ok) {
          const data = await response.json();
          setFeaturedProducts(data.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
        color: '#1a1a1a',
        padding: '100px 40px',
        textAlign: 'center',
        minHeight: '700px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <h1 style={{
          fontSize: '64px',
          fontWeight: '700',
          margin: '0 0 24px 0',
          letterSpacing: '-1.5px',
          lineHeight: '1.1',
          color: '#1a1a1a',
        }}>
          Nutrient-Packed
          <br />
          Smoothies
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          margin: '0 0 48px 0',
          maxWidth: '700px',
          lineHeight: '1.7',
          fontWeight: '500',
        }}>
          Delicious, organic smoothies crafted with real fruits and superfoods. Delivered fresh to your door, every single day.
        </p>
        <Link href="/products" style={{
          display: 'inline-block',
          padding: '16px 48px',
          background: '#22c55e',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.3s',
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#15803d';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#22c55e';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Explore Collection
        </Link>
      </section>

      {/* Featured Products */}
      <section style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '100px 40px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '700',
            margin: '0 0 16px 0',
            letterSpacing: '-1px',
            color: '#1a1a1a',
          }}>
            Our Blends
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: '0',
            fontWeight: '500',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Handcrafted with organic ingredients and real superfoods
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>Loading products...</p>
        ) : featuredProducts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>No smoothies available. Check back soon!</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '40px',
          }}>
            {featuredProducts.map(product => (
              <div
                key={product.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.transform = 'translateY(-8px)';
                  target.style.boxShadow = '0 12px 40px rgba(34, 197, 94, 0.08)';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }}
              >
                {product.image_url && (
                  <div style={{
                    width: '100%',
                    height: '300px',
                    overflow: 'hidden',
                    background: '#f3f4f6',
                  }}>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
                <div style={{ padding: '28px' }}>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                  }}>
                    {product.name}
                  </h3>
                  <p style={{
                    margin: '0 0 20px 0',
                    color: '#6b7280',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    minHeight: '42px',
                  }}>
                    {product.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                    }}>
                      ${product.price}
                    </span>
                    <Link href="/products" style={{
                      padding: '10px 20px',
                      background: '#22c55e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'background 0.2s',
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#22c55e'}
                    >
                      Add to Cart
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section style={{
        background: '#f9fafb',
        padding: '80px 40px',
        textAlign: 'center',
        borderTop: '1px solid #e5e7eb',
      }}>
        <h2 style={{
          fontSize: '40px',
          fontWeight: '700',
          margin: '0 0 16px 0',
          letterSpacing: '-0.5px',
        }}>
          Join the Drizzl Community
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: '0 0 32px 0',
          maxWidth: '600px',
          margin: '0 auto 32px auto',
        }}>
          Fresh ingredients. Real results. Every day.
        </p>
        <Link href="/auth" style={{
          display: 'inline-block',
          padding: '14px 40px',
          background: '#22c55e',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontSize: '15px',
          fontWeight: '700',
          transition: 'background 0.2s',
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#22c55e'}
        >
          Create Your Account
        </Link>
      </section>
    </>
  );
}
