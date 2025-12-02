import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const products = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, desc: 'Smoothie' },
  { id: '2', name: 'Mint + Cacao', price: 8.49, desc: 'Smoothie' },
  { id: '5', name: 'Tropical Greens', price: 8.49, desc: 'Smoothie' },
  { id: '6', name: 'Blueberry + Cacao', price: 8.49, desc: 'Smoothie' },
  { id: '7', name: 'Mango + Turmeric', price: 8.49, desc: 'Smoothie' },
  { id: '8', name: 'Acai + Berry', price: 8.49, desc: 'Smoothie' },
];

export default function Smoothies() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '16px' }}>Smoothies</h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
            Our signature organic smoothies. Frozen fresh and crafted for maximum nutrition and taste.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px',
          }}>
            {products.map(p => (
              <div key={p.id} style={{
                border: '1px solid #e8e8e8',
                borderRadius: '4px',
                padding: '20px',
              }}>
                <div style={{ background: '#f9f9f9', height: '200px', borderRadius: '4px', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{p.name}</h3>
                <p style={{ fontSize: '14px', color: '#999', marginBottom: '12px' }}>{p.desc}</p>
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
