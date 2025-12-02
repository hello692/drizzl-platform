import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const products = [
  { id: 'hp1', name: 'High Protein Smoothies Bundle', price: 0, reviews: 0, badge: '', type: 'bundle' },
  { id: 'hp2', name: 'Strawberry Banana Protein', price: 9.49, reviews: 48, badge: 'New' },
  { id: 'hp3', name: 'Mixed Berry Protein', price: 9.49, reviews: 185, badge: 'Best Seller' },
  { id: 'hp4', name: 'Dark Chocolate Protein', price: 9.49, reviews: 199, badge: 'Best Seller' },
  { id: 'hp5', name: 'Vanilla Bean Protein', price: 9.49, reviews: 207, badge: 'Best Seller' },
  { id: 'hp6', name: 'Tropical Greens Protein', price: 9.49, reviews: 43, badge: 'New' },
];

export default function HighProtein() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '60px' }}>
            <div style={{ background: '#f9f9f9', borderRadius: '4px', padding: '40px', marginBottom: '40px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '24px' }}>High Protein Hero</span>
            </div>
            <h1 style={{ marginBottom: '16px', fontSize: '48px' }}>High Protein Smoothies</h1>
            <ul style={{ fontSize: '14px', color: '#666', marginTop: '24px', marginLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>100% plant-based</li>
              <li style={{ marginBottom: '8px' }}>20g of pea protein—no whey or nuts</li>
              <li style={{ marginBottom: '8px' }}>Gluten-free + USDA certified organic</li>
              <li>No artificial sweeteners or flavors</li>
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
                onMouseEnter={(e) => { if (product.type !== 'bundle') e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; }}
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
                  Protein
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{product.name}</h3>
                  {product.reviews > 0 && <p style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>⭐ {product.reviews.toLocaleString()} reviews</p>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {product.price > 0 && <span style={{ fontWeight: '600', fontSize: '16px' }}>${product.price.toFixed(2)}</span>}
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
                      {product.type === 'bundle' ? 'Shop Set' : 'Add'}
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
