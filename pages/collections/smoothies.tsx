import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

const products = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, reviews: 4619, badge: 'Best Seller' },
  { id: '2', name: 'Acai + Cherry', price: 8.49, reviews: 2686, badge: 'Best Seller' },
  { id: '3', name: 'Mint + Cacao', price: 8.49, reviews: 2200, badge: '' },
  { id: '4', name: 'Tropical Greens Protein', price: 9.49, reviews: 43, badge: 'New' },
  { id: '5', name: 'Strawberry Banana Protein', price: 9.49, reviews: 48, badge: 'New' },
  { id: '6', name: 'Mixed Berry Protein', price: 9.49, reviews: 185, badge: 'Best Seller' },
  { id: '7', name: 'Vanilla Bean Protein', price: 9.49, reviews: 207, badge: 'Best Seller' },
  { id: '8', name: 'Dark Chocolate Protein', price: 9.49, reviews: 199, badge: 'Best Seller' },
];

export default function Smoothies() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Header Section */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{ background: '#f9f9f9', borderRadius: '4px', padding: '40px', marginBottom: '40px' }}>
              <img
                src="https://via.placeholder.com/1200x200?text=Smoothies+Hero"
                alt="Smoothies"
                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
              />
            </div>
            <h1 style={{ marginBottom: '16px', fontSize: '48px' }}>Smoothies</h1>
            <p style={{ fontSize: '16px', color: '#666', maxWidth: '600px', lineHeight: '1.6' }}>
              It's never been easier—or healthier—to build a delicious daily routine.
            </p>
            <ul style={{ fontSize: '14px', color: '#666', marginTop: '24px', marginLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>Gluten-free + dairy-free</li>
              <li style={{ marginBottom: '8px' }}>A plentiful array of fruits + vegetables in each</li>
              <li style={{ marginBottom: '8px' }}>Comes frozen, pre-portioned + ready to blend</li>
              <li>As easy as it gets</li>
            </ul>
          </div>

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px',
          }}>
            {products.map(product => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div style={{
                  cursor: 'pointer',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    background: '#f9f9f9',
                    height: '240px',
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {product.badge && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: product.badge === 'Best Seller' ? '#000' : '#373f47',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}>
                        {product.badge}
                      </span>
                    )}
                    <img
                      src="https://via.placeholder.com/240x240?text=Smoothie"
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>
                      ⭐ {product.reviews.toLocaleString()} reviews
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', fontSize: '16px' }}>${product.price.toFixed(2)}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        style={{
                          padding: '8px 16px',
                          background: '#000',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
