import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const allProducts = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, category: 'Smoothie' },
  { id: '9', name: 'Pink Piyata', price: 8.99, category: 'Smoothie' },
  { id: '10', name: 'Matcha', price: 9.49, category: 'Smoothie' },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, category: 'Smoothie' },
  { id: 'box1', name: 'The Starter Box', price: 59.99, category: 'Box' },
];

export default function ShopAll() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '16px' }}>Shop All</h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
            Browse our complete collection of organic smoothies and wellness products.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px',
          }}>
            {allProducts.map(p => (
              <div key={p.id} style={{
                border: '1px solid #e8e8e8',
                borderRadius: '4px',
                padding: '20px',
              }}>
                <div style={{ background: '#f9f9f9', height: '200px', borderRadius: '4px', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{p.name}</h3>
                <p style={{ fontSize: '14px', color: '#999', marginBottom: '12px' }}>{p.category}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '600' }}>${p.price}</span>
                  <button style={{ padding: '8px 16px', background: '#000', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>Add</button>
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
