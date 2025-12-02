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

const CATEGORIES = [
  { name: 'Smoothies', slug: 'smoothies' },
  { name: 'High Protein', slug: 'high-protein' },
  { name: 'Breakfast Bowls', slug: 'bowls' },
  { name: 'Bites', slug: 'bites' },
  { name: 'Smoothie Boxes', slug: 'boxes' },
  { name: 'Protein Shop', slug: 'protein' },
  { name: 'Gift Guide', slug: 'gift' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=smoothie');
        if (response.ok) {
          const data = await response.json();
          setFeaturedProducts(data.slice(0, 3));
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
        background: '#ffffff',
        padding: '100px 40px',
        textAlign: 'center',
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h1 style={{
          fontSize: '52px',
          fontWeight: '600',
          marginBottom: '20px',
          letterSpacing: '0.3px',
          maxWidth: '900px',
        }}>
          Frozen smoothies and bowls for a better you
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '40px',
          maxWidth: '700px',
          lineHeight: '1.7',
          fontWeight: '400',
        }}>
          Skip the blender. Embrace the possibilities. Order your first smoothie today.
        </p>
        <Link href="/products" style={{
          display: 'inline-block',
          padding: '16px 48px',
          background: '#1a1a1a',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: '500',
          transition: 'all 0.2s',
        }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Order Now
        </Link>
      </section>

      {/* Category Grid */}
      <section style={{
        background: '#f9f9f9',
        padding: '80px 40px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '60px',
            fontSize: '32px',
          }}>
            Shop by Category
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}>
            {CATEGORIES.map((category) => (
              <Link key={category.slug} href={`/products?category=${category.slug}`} style={{
                padding: '40px 20px',
                textAlign: 'center',
                background: 'white',
                border: '1px solid #e8e8e8',
                borderRadius: '4px',
                textDecoration: 'none',
                color: '#1a1a1a',
                transition: 'all 0.2s',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#999';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e8e8e8';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: 0,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{
        background: '#ffffff',
        padding: '80px 40px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '60px',
            fontSize: '32px',
          }}>
            Our Most Popular
          </h2>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#999' }}>Loading...</p>
          ) : featuredProducts.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999' }}>No products available</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
            }}>
              {featuredProducts.map(product => (
                <div key={product.id} style={{
                  background: 'white',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid #e8e8e8',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {product.image_url && (
                    <div style={{
                      width: '100%',
                      height: '280px',
                      overflow: 'hidden',
                      background: '#f9f9f9',
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
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {product.name}
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      color: '#666',
                      marginBottom: '16px',
                      minHeight: '42px',
                      lineHeight: '1.6',
                    }}>
                      {product.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        ${product.price}
                      </span>
                      <Link href="/products" style={{
                        padding: '10px 20px',
                        background: '#1a1a1a',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                        textDecoration: 'none',
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        Add to Cart
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: '#f9f9f9',
        padding: '80px 40px',
        textAlign: 'center',
        borderTop: '1px solid #e8e8e8',
      }}>
        <h2 style={{
          fontSize: '32px',
          marginBottom: '16px',
        }}>
          Start Your Wellness Journey Today
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '32px',
          maxWidth: '600px',
          margin: '0 auto 32px auto',
        }}>
          Join thousands of people who have made smoothies and bowls their daily habit.
        </p>
        <Link href="/auth" style={{
          display: 'inline-block',
          padding: '14px 40px',
          background: '#1a1a1a',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: '500',
          transition: 'all 0.2s',
        }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Create Your Account
        </Link>
      </section>
    </>
  );
}
