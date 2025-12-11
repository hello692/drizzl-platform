import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const boxes = [
  { id: 'box1', name: 'The Starter Box', price: 59.99, items: 12, description: 'Perfect for getting started with Drizzl' },
  { id: 'box2', name: 'The Detox Box', price: 69.99, items: 14, description: 'Green smoothies for a refreshing cleanse' },
  { id: 'box3', name: 'The Holiday Detox Box', price: 79.99, items: 16, description: 'Holiday special with festive flavors' },
];

export default function SmoothieBoxes() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '16px' }}>Smoothie Boxes</h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
            Our curated smoothie collections give you variety and convenience. Choose your box and get started.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '32px',
          }}>
            {boxes.map(box => (
              <div key={box.id} style={{
                border: '1px solid #e8e8e8',
                borderRadius: '4px',
                padding: '24px',
                transition: 'all 0.2s',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  background: '#f9f9f9',
                  height: '240px',
                  borderRadius: '4px',
                  marginBottom: '20px',
                }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  {box.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
                  {box.items} smoothies included
                </p>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                  {box.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: '600' }}>${box.price}</span>
                  <button style={{
                    padding: '10px 20px',
                    background: '#000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}>
                    Add to Cart
                  </button>
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
