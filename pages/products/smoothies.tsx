import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

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
      <div className="gradient-animated" style={{ minHeight: '100vh', background: 'linear-gradient(-45deg, #ffffff, #f8f9fa, #ffffff, #f0f0f0)', backgroundSize: '400% 400%' }}>
        {/* Banner */}
        <div className="glass" style={{
          background: 'rgba(248, 249, 250, 0.8)',
          padding: '18px 80px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          fontSize: '14px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 12px rgba(66, 133, 244, 0.05)',
        }}>
          <p style={{ margin: 0 }}>
            ⭐ Receive the value of 2 smoothies free. <a href="#" style={{ color: '#000', fontWeight: '600', textDecoration: 'none', transition: 'all 0.3s', borderBottom: '2px solid transparent', paddingBottom: '2px' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000'; }} 
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}>Shop Smoothie Sale</a>
          </p>
        </div>

        <div style={{ padding: '80px 80px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Hero */}
            <div className="tech-shine" style={{
              background: 'linear-gradient(135deg, #f0f0f0 0%, #f8f9fa 100%)',
              borderRadius: '16px',
              height: '280px',
              marginBottom: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(66, 133, 244, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
            }}>
              <img
                src="https://daily-harvest.com/cdn/shop/files/ModelSmoothieHeaderwAttributes.jpg?v=1755195930&width=1580"
                alt="Smoothies"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Title */}
            <h1 className="heading-2100 text-glow" style={{ fontSize: '48px', marginBottom: '16px', marginTop: 0 }}>Smoothies</h1>
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
              borderBottom: '1px solid rgba(224, 224, 224, 0.4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1px' }}>FILTER & SORT</span>
              <select style={{
                padding: '10px 16px',
                border: '1px solid rgba(224, 224, 224, 0.6)',
                borderRadius: '10px',
                fontSize: '13px',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'inset 0 0 15px rgba(66, 133, 244, 0.1)'; e.currentTarget.style.borderColor = 'rgba(66, 133, 244, 0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(224, 224, 224, 0.6)'; }}
              >
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
                <Link key={product.id} href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="tech-shine" style={{
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    }}
                  >
                    {/* Image Container */}
                    <div className="glass" style={{
                      position: 'relative',
                      marginBottom: '20px',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      boxShadow: 'inset 0 0 20px rgba(66, 133, 244, 0.05)',
                      transition: 'all 0.3s',
                      backdropFilter: 'blur(10px)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'inset 0 0 30px rgba(66, 133, 244, 0.15), 0 0 20px rgba(66, 133, 244, 0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(66, 133, 244, 0.05)'; }}
                    >
                      {/* Badge */}
                      {product.badge && (
                        <div className="tech-shine" style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#fff',
                          padding: '6px 14px',
                          fontSize: '11px',
                          fontWeight: '800',
                          letterSpacing: '1px',
                          zIndex: 10,
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(66, 133, 244, 0.2)',
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

                    {/* Price */}
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      margin: '0 0 16px 0',
                    }}>
                      ${product.price.toFixed(2)}
                    </p>

                    {/* Add to Cart Button */}
                    <button className="tech-shine" style={{
                      width: '100%',
                      padding: '14px 12px',
                      background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(66, 133, 244, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
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
    </>
  );
}
