import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const products = [
  { id: 'bite1', name: 'Chocolate Chip Cookie Dough', price: 10.99, reviews: 78 },
  { id: 'bite2', name: 'Nutty Banana Bread', price: 10.99, reviews: 70 },
  { id: 'bite3', name: 'Fudgy Hazelnut Brownie', price: 10.99, reviews: 68 },
  { id: 'bite4', name: 'Peppermint Cacao Truffle', price: 10.99, reviews: 72 },
];

export default function Bites() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '60px' }}>
            <div style={{ background: '#f9f9f9', borderRadius: '4px', padding: '40px', marginBottom: '40px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '24px' }}>Bites Hero</span>
            </div>
            <h1 style={{ marginBottom: '16px', fontSize: '48px' }}>Bites</h1>
            <ul style={{ fontSize: '14px', color: '#666', marginTop: '24px', marginLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>An energizing snack or dessert</li>
              <li style={{ marginBottom: '8px' }}>Sweetened with dates to satisfy cravings</li>
              <li style={{ marginBottom: '8px' }}>Gluten-free + dairy-free</li>
              <li>Eat them right out of the bag</li>
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  Bite
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
