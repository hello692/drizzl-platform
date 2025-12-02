import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const products = [
  { id: '1', name: 'Strawberry + Peach', type: 'Smoothie', price: 8.49, reviews: 4619, rating: 4.5, badge: 'BEST SELLER', image: 'https://daily-harvest.com/cdn/shop/files/strawberry-peach-smoothie-daily-harvest-3657974.jpg?v=1760509351&width=500' },
  { id: '2', name: 'Strawberry Banana Protein', type: 'Smoothie', price: 9.49, reviews: 48, rating: 4.5, badge: 'NEW', image: 'https://daily-harvest.com/cdn/shop/files/strawberry-banana-protein-smoothie-daily-harvest-3370693.jpg?v=1760509314&width=500' },
  { id: '3', name: 'Tropical Greens Protein', type: 'Smoothie', price: 9.49, reviews: 43, rating: 4.5, badge: 'NEW', image: 'https://daily-harvest.com/cdn/shop/files/tropical-greens-protein-smoothie-daily-harvest-8021323.jpg?v=1760509314&width=500' },
  { id: '4', name: 'Mixed Berry Protein', type: 'Smoothie', price: 9.49, reviews: 185, rating: 5, badge: 'BEST SELLER', image: 'https://daily-harvest.com/cdn/shop/files/mixed-berry-protein-smoothie-daily-harvest-3950952.jpg?v=1760509317&width=500' },
  { id: '5', name: 'Acai + Cherry', type: 'Smoothie', price: 8.49, reviews: 2686, rating: 5, badge: 'BEST SELLER', image: 'https://daily-harvest.com/cdn/shop/files/acai-cherry-smoothie-daily-harvest-8004331.jpg?v=1760509351&width=500' },
  { id: '6', name: 'Vanilla Bean Protein', type: 'Smoothie', price: 9.49, reviews: 207, rating: 5, badge: 'BEST SELLER', image: 'https://daily-harvest.com/cdn/shop/files/vanilla-bean-protein-smoothie-daily-harvest-1407106.jpg?v=1760509317&width=500' },
  { id: '7', name: 'Dark Chocolate Protein', type: 'Smoothie', price: 9.49, reviews: 199, rating: 5, badge: 'BEST SELLER', image: 'https://daily-harvest.com/cdn/shop/files/dark-chocolate-protein-smoothie-daily-harvest-4692961.jpg?v=1760509316&width=500' },
  { id: '8', name: 'Blueberry + Cacao', type: 'Smoothie', price: 8.49, reviews: 1850, rating: 4.5, image: 'https://daily-harvest.com/cdn/shop/files/blueberry-cacao-smoothie-daily-harvest-9149347.jpg?v=1760509349&width=500' },
];

export default function Smoothies() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#ffffff' }}>
        {/* Banner */}
        <div style={{
          background: '#f9f9f9',
          padding: '16px 40px',
          borderBottom: '1px solid #e8e8e8',
          textAlign: 'center',
          fontSize: '14px',
        }}>
          <p style={{ margin: 0 }}>
            ⭐ Receive the value of 2 smoothies free. <a href="#" style={{ color: '#000', fontWeight: '600', textDecoration: 'underline' }}>Shop Smoothie Sale</a>
          </p>
        </div>

        <div style={{ padding: '60px 40px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Hero */}
            <div style={{
              background: '#f0f0f0',
              borderRadius: '0px',
              height: '280px',
              marginBottom: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img
                src="https://daily-harvest.com/cdn/shop/files/ModelSmoothieHeaderwAttributes.jpg?v=1755195930&width=1580"
                alt="Smoothies"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '48px', fontWeight: '600', marginBottom: '16px', marginTop: 0 }}>Smoothies</h1>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px', maxWidth: '800px', lineHeight: '1.6' }}>
              It's never been easier—or healthier—to build a delicious daily routine.
            </p>

            {/* Features */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
              marginBottom: '60px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                <p style={{ margin: '0 0 8px 0' }}>Gluten-free + dairy-free</p>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                <p style={{ margin: '0 0 8px 0' }}>A plentiful array of fruits + vegetables in each</p>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                <p style={{ margin: '0 0 8px 0' }}>Comes frozen, pre-portioned + ready to blend</p>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                <p style={{ margin: '0 0 8px 0' }}>As easy as it gets</p>
              </div>
            </div>

            {/* Filter */}
            <div style={{
              marginBottom: '40px',
              paddingBottom: '20px',
              borderBottom: '1px solid #e8e8e8',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1px' }}>FILTER & SORT</span>
              <select style={{
                padding: '8px 12px',
                border: '1px solid #000',
                borderRadius: '0px',
                fontSize: '13px',
                cursor: 'pointer',
                background: '#ffffff',
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
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '40px',
              marginBottom: '60px',
            }}>
              {products.map(product => (
                <div key={product.id} style={{}}>
                  {/* Image Container */}
                  <div style={{
                    position: 'relative',
                    marginBottom: '20px',
                    background: '#ffffff',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    {/* Badge */}
                    {product.badge && (
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        background: '#ffffff',
                        border: '2px solid #000',
                        padding: '6px 14px',
                        fontSize: '11px',
                        fontWeight: '800',
                        letterSpacing: '1px',
                        zIndex: 10,
                      }}>
                        {product.badge}
                      </div>
                    )}

                    {/* Product Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />

                    {/* Magnifying Glass Icon */}
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      width: '36px',
                      height: '36px',
                      background: '#ffffff',
                      border: '1px solid #999',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}>
                      <span style={{ fontSize: '18px' }}>🔍</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    margin: '0 0 4px 0',
                    lineHeight: '1.3',
                  }}>
                    {product.name}
                  </h3>

                  <p style={{
                    fontSize: '13px',
                    color: '#666',
                    margin: '0 0 8px 0',
                  }}>
                    {product.type}
                  </p>

                  {/* Rating */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                  }}>
                    <span style={{ fontSize: '14px' }}>
                      {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                    </span>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {product.reviews.toLocaleString()} reviews
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button style={{
                    width: '100%',
                    padding: '14px 12px',
                    background: '#000',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0px',
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  >
                    ADD TO CART ${product.price.toFixed(2)}
                  </button>
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
