import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const products = [
  { id: 'bb1', name: 'Mulberry + Dragon Fruit', price: 6.79, reviews: 1491, badge: '' },
  { id: 'bb2', name: 'Strawberry + Goji Berry', price: 6.79, reviews: 258, badge: '' },
  { id: 'bb3', name: 'Cinnamon + Banana', price: 6.79, reviews: 1047, badge: 'Best Seller' },
  { id: 'bb4', name: 'Peach + Cinnamon', price: 6.79, reviews: 142, badge: '' },
  { id: 'bb5', name: 'Chai Spiced Squash + Pecans', price: 6.79, reviews: 1205, badge: '' },
  { id: 'bb6', name: 'Blueberry + Lemon', price: 6.79, reviews: 365, badge: '' },
  { id: 'bb7', name: 'Apple + Cinnamon', price: 6.79, reviews: 867, badge: 'Best Seller' },
];

export default function BreakfastBowls() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '60px' }}>
            <div style={{ background: '#f9f9f9', borderRadius: '4px', padding: '40px', marginBottom: '40px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '24px' }}>Breakfast Bowls Hero</span>
            </div>
            <h1 style={{ marginBottom: '16px', fontSize: '48px' }}>Breakfast Bowls</h1>
            <ul style={{ fontSize: '14px', color: '#666', marginTop: '24px', marginLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>Full of satiating superfoods</li>
              <li style={{ marginBottom: '8px' }}>Easy-prep meals that get you energized fast</li>
              <li style={{ marginBottom: '8px' }}>Built on organic fruits + vegetables</li>
              <li>Eat hot or cold</li>
            </ul>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px',
          }}>
            {products.map(product => (
              <div key={product.id} style={{
                border: '1px solid #e8e8e8',
                borderRadius: '4px',
                overflow: 'hidden',
                transition: 'all 0.2s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
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
                      background: '#000',
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
                  Bowl
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{product.name}</h3>
                  <p style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>⭐ {product.reviews.toLocaleString()} reviews</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', fontSize: '16px' }}>${product.price.toFixed(2)}</span>
                    <button style={{
                      padding: '8px 16px',
                      background: '#000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
