import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const POPULAR_SMOOTHIES = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, image: '/products/strawberry-peach/main-product.png', description: 'Creamy strawberry bliss' },
  { id: '9', name: 'Pink Piyata', price: 8.99, image: '/products/pink-piyata/transparent-glass-1.png', description: 'Tropical dragon fruit' },
  { id: '10', name: 'Matcha', price: 9.49, image: '/products/matcha/transparent-glass-1.png', description: 'Zen in a cup' },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, image: '/products/coffee-mushroom/transparent-glass-1.png', description: 'Adaptogenic energy' },
  { id: '17', name: 'Acai', price: 9.49, image: '/products/acai/transparent-glass-1.png', description: 'Amazonian superfruit' },
  { id: '12', name: 'Nutty Monkey', price: 8.99, image: '/products/nutty-monkey/transparent-glass-1.png', description: 'Creamy peanut butter' },
];

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const product = POPULAR_SMOOTHIES.find(p => p.id === id);

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '120px 60px', textAlign: 'center' }}>
          <p>Product not found</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section style={{
        background: '#ffffff',
        padding: '80px 60px',
        minHeight: '100vh',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'flex-start',
        }}>
          {/* Product Image */}
          <div style={{
            background: '#f8f9fa',
            borderRadius: '16px',
            height: '600px',
            overflow: 'hidden',
            border: '1px solid #e8e8e8',
            position: 'relative',
          }}>
            {/* BEST SELLER Badge */}
            <div style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              zIndex: 10,
              border: '2px solid #000',
              padding: '10px 16px',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: '#ffffff',
            }}>
              BEST SELLER
            </div>

            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Product Details */}
          <div>
            {/* Product Name */}
            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              marginBottom: '12px',
              letterSpacing: '-0.8px',
            }}>
              {product.name}
            </h1>

            {/* Category */}
            <p style={{
              fontSize: '15px',
              color: '#79747e',
              marginBottom: '24px',
              letterSpacing: '-0.2px',
            }}>
              Smoothie
            </p>

            {/* Stars & Reviews */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px',
            }}>
              <span style={{
                fontSize: '16px',
                letterSpacing: '-0.3px',
              }}>
                ★★★★★
              </span>
              <span style={{
                fontSize: '14px',
                color: '#79747e',
                letterSpacing: '-0.2px',
              }}>
                185 reviews
              </span>
            </div>

            {/* Price */}
            <p style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '48px',
              letterSpacing: '-0.6px',
            }}>
              ${product.price.toFixed(2)}
            </p>

            {/* Description */}
            <p style={{
              fontSize: '17px',
              color: '#424245',
              lineHeight: '1.8',
              marginBottom: '48px',
              letterSpacing: '-0.3px',
            }}>
              {product.description}. Our frozen smoothie blends are made with whole fruits, superfoods, and premium ingredients. Blend with your favorite liquid for a delicious, nutritious meal anytime.
            </p>

            {/* Add to Cart Button */}
            <button style={{
              width: '100%',
              padding: '16px 40px',
              background: '#000000',
              color: '#ffffff',
              border: 'none',
              fontSize: '16px',
              fontWeight: '700',
              letterSpacing: '-0.3px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              marginBottom: '28px',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              ADD TO CART ${product.price.toFixed(2)}
            </button>

            {/* Additional Info */}
            <div style={{
              borderTop: '1px solid #e8e8e8',
              paddingTop: '32px',
            }}>
              <div style={{ marginBottom: '24px' }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px',
                }}>
                  Ingredients
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#424245',
                  lineHeight: '1.7',
                  letterSpacing: '-0.2px',
                }}>
                  Whole fruit, superfoods, and plant-based proteins
                </p>
              </div>
              <div>
                <p style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px',
                }}>
                  Storage
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#424245',
                  lineHeight: '1.7',
                  letterSpacing: '-0.2px',
                }}>
                  Keep frozen. Blend and enjoy within 24 hours of thawing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section style={{
        background: '#f8f9fa',
        padding: '140px 60px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '64px',
            letterSpacing: '-0.8px',
          }}>
            You Might Also Like
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
          }}>
            {POPULAR_SMOOTHIES.filter(p => p.id !== id).slice(0, 4).map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e8e8e8',
                  height: '280px',
                  marginBottom: '20px',
                }}>
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  marginBottom: '8px',
                  letterSpacing: '-0.3px',
                }}>
                  {relatedProduct.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#79747e',
                  marginBottom: '8px',
                  letterSpacing: '-0.2px',
                }}>
                  ★★★★★ 185 reviews
                </p>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  letterSpacing: '-0.3px',
                }}>
                  ${relatedProduct.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
