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
        background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
        color: 'white',
        padding: '80px 40px',
        textAlign: 'center',
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h1 style={{
          fontSize: '56px',
          fontWeight: '700',
          margin: '0 0 20px 0',
          letterSpacing: '-1px',
          lineHeight: '1.1',
        }}>
          Fresh Smoothies
          <br />
          Delivered Daily
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#ddd',
          margin: '0 0 40px 0',
          maxWidth: '600px',
          lineHeight: '1.6',
          fontWeight: '500',
        }}>
          Nutrient-packed, delicious smoothies crafted from the finest organic ingredients. Join thousands of health-conscious customers enjoying the Drizzl lifestyle.
        </p>
        <Link href="/products" style={{
          display: 'inline-block',
          padding: '15px 48px',
          background: 'white',
          color: '#111',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '700',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Shop Now
        </Link>
      </section>

      {/* Featured Products */}
      <section style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '80px 40px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: '700',
            margin: '0 0 16px 0',
            letterSpacing: '-0.5px',
          }}>
            Our Smoothies
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#666',
            margin: 0,
            fontWeight: '500',
          }}>
            Handcrafted blends with organic superfoods
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#999' }}>Loading products...</p>
        ) : featuredProducts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>No smoothies available. Check back soon!</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
          }}>
            {featuredProducts.map(product => (
              <div
                key={product.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #f0f0f0',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.transform = 'translateY(-8px)';
                  target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
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
                    height: '280px',
                    overflow: 'hidden',
                    background: '#f5f5f5',
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
                <div style={{ padding: '24px' }}>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#111',
                  }}>
                    {product.name}
                  </h3>
                  <p style={{
                    margin: '0 0 16px 0',
                    color: '#666',
                    fontSize: '14px',
                    lineHeight: '1.5',
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
                      color: '#111',
                    }}>
                      ${product.price}
                    </span>
                    <Link href="/products" style={{
                      padding: '10px 20px',
                      background: '#111',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      textDecoration: 'none',
                    }}>
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
        background: '#f5f5f5',
        padding: '60px 40px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          margin: '0 0 16px 0',
        }}>
          Ready to Start Your Journey?
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: '0 0 32px 0',
        }}>
          Join thousands of customers living the Drizzl lifestyle.
        </p>
        <Link href="/auth" style={{
          display: 'inline-block',
          padding: '13px 40px',
          background: '#111',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '15px',
          fontWeight: '700',
        }}>
          Create Your Account
        </Link>
      </section>
    </>
  );
}
