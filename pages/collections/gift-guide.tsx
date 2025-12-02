import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const gifts = [
  { id: 'gift1', name: 'Smoothie Lover Gift Box', price: 49.99, description: 'Perfect for smoothie enthusiasts' },
  { id: 'gift2', name: 'Health-Conscious Gift Box', price: 59.99, description: 'High protein and nutritious blends' },
  { id: 'gift3', name: 'The Ultimate Gift Box', price: 89.99, description: 'Our best-selling combination' },
];

export default function GiftGuide() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '16px' }}>Gift Guide</h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
            Give the gift of health and wellness with our carefully curated gift boxes.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '32px',
          }}>
            {gifts.map(gift => (
              <div key={gift.id} style={{
                border: '1px solid #e8e8e8',
                borderRadius: '4px',
                padding: '24px',
                textAlign: 'center',
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                }}>
                  🎁
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  {gift.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                  {gift.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px', fontWeight: '600' }}>${gift.price}</span>
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
