import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const products = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, reviews: 4619, badge: 'Best Seller', isFeatured: true },
  { id: '2', name: 'Strawberry Banana Protein', price: 9.49, reviews: 48, badge: 'New' },
  { id: '3', name: 'Tropical Greens Protein', price: 9.49, reviews: 43, badge: 'New' },
  { id: '4', name: 'Mixed Berry Protein', price: 9.49, reviews: 185, badge: 'Best Seller' },
  { id: '5', name: 'Acai + Cherry', price: 8.49, reviews: 2686, badge: 'Best Seller' },
  { id: '6', name: 'Vanilla Bean Protein', price: 9.49, reviews: 207, badge: 'Best Seller' },
  { id: '7', name: 'Dark Chocolate Protein', price: 9.49, reviews: 199, badge: 'Best Seller' },
  { id: '8', name: 'Blueberry + Cacao', price: 8.49, reviews: 1850 },
];

export default function Smoothies() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#ffffff' }}>
        {/* Banner/Alert Section */}
        <div style={{
          background: '#f9f9f9',
          padding: '16px 40px',
          borderBottom: '1px solid #e8e8e8',
          textAlign: 'center',
          fontSize: '14px',
          color: '#333',
        }}>
          <p style={{ margin: 0 }}>
            ⭐ Receive the value of 2 smoothies free. <a href="#" style={{ color: '#000', fontWeight: '600', textDecoration: 'underline' }}>Shop Smoothie Sale</a>
          </p>
        </div>

        <div style={{ padding: '60px 40px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {/* Hero Image Section */}
            <div style={{
              background: '#f0f0f0',
              borderRadius: '4px',
              height: '300px',
              marginBottom: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: '#999',
            }}>
              <img
                src="https://daily-harvest.com/cdn/shop/files/ModelSmoothieHeaderwAttributes.jpg?v=1755195930&width=1580"
                alt="Smoothies Hero"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
              />
            </div>

            {/* Title and Description */}
            <h1 style={{ fontSize: '52px', fontWeight: '600', marginBottom: '12px' }}>Smoothies</h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '32px', maxWidth: '800px', lineHeight: '1.6' }}>
              It's never been easier—or healthier—to build a delicious daily routine.
            </p>

            {/* Features List */}
            <ul style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '32px',
              marginBottom: '60px',
              listStyle: 'none',
              padding: 0,
            }}>
              <li style={{ fontSize: '15px', color: '#333', lineHeight: '1.6' }}>
                <strong>Gluten-free + dairy-free</strong>
              </li>
              <li style={{ fontSize: '15px', color: '#333', lineHeight: '1.6' }}>
                <strong>A plentiful array of fruits + vegetables in each</strong>
              </li>
              <li style={{ fontSize: '15px', color: '#333', lineHeight: '1.6' }}>
                <strong>Comes frozen, pre-portioned + ready to blend</strong>
              </li>
              <li style={{ fontSize: '15px', color: '#333', lineHeight: '1.6' }}>
                <strong>As easy as it gets</strong>
              </li>
            </ul>

            {/* Filter Section Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '40px',
              paddingBottom: '20px',
              borderBottom: '1px solid #e8e8e8',
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>FILTER & SORT</h2>
              <select style={{
                padding: '8px 12px',
                border: '1px solid #e8e8e8',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
              }}>
                <option>Featured</option>
                <option>Best selling</option>
                <option>Price, low to high</option>
                <option>Price, high to low</option>
              </select>
            </div>

            {/* Products Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '32px',
            }}>
              {products.map(product => (
                <div key={product.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {/* Product Image */}
                  <div style={{
                    background: '#f5f5f5',
                    borderRadius: '4px',
                    aspectRatio: '1',
                    marginBottom: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {product.badge && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: '#000',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        zIndex: 10,
                      }}>
                        {product.badge}
                      </span>
                    )}
                    <div style={{ fontSize: '24px', color: '#ccc' }}>🥤</div>
                  </div>

                  {/* Product Name */}
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    marginBottom: '4px',
                    lineHeight: '1.4',
                    minHeight: '32px',
                  }}>
                    {product.name}
                  </h3>

                  {/* Product Type */}
                  <p style={{
                    fontSize: '13px',
                    color: '#999',
                    marginBottom: '8px',
                  }}>
                    Smoothie
                  </p>

                  {/* Reviews */}
                  <p style={{
                    fontSize: '12px',
                    color: '#999',
                    marginBottom: '16px',
                  }}>
                    ⭐ {product.reviews.toLocaleString()} reviews
                  </p>

                  {/* Price and Button Container */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '600',
                    }}>
                      ${product.price.toFixed(2)}
                    </span>
                    <button style={{
                      padding: '8px 16px',
                      background: '#000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                    >
                      Add to cart
                    </button>
                  </div>

                  {/* Restart Plan Link */}
                  <a href="#" style={{
                    fontSize: '12px',
                    color: '#000',
                    textDecoration: 'underline',
                    marginBottom: '12px',
                  }}>
                    Restart Plan
                  </a>

                  {/* Promo Text */}
                  <p style={{
                    fontSize: '12px',
                    color: '#999',
                    margin: 0,
                    lineHeight: '1.4',
                  }}>
                    Get $35 off your next order over $100*
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
