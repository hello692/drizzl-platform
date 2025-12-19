import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

const products = [
  { id: 'hp1', name: 'High Protein Smoothies Bundle', price: 0, reviews: 0, badge: '', type: 'bundle' },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, reviews: 203, badge: 'New' },
  { id: '12', name: 'Nutty Monkey', price: 8.99, reviews: 389, badge: 'Best Seller' },
  { id: '16', name: 'Almond Luvly', price: 8.99, reviews: 312, badge: 'New' },
  { id: '15', name: 'Chocolate Berry Protein', price: 8.99, reviews: 278, badge: 'New' },
  { id: '17', name: 'Acai Passionfruit', price: 9.49, reviews: 487, badge: 'Best Seller' },
];

export default function HighProtein() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Header Section */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{ background: '#f9f9f9', borderRadius: '4px', padding: '40px', marginBottom: '40px' }}>
              <img
                src="https://via.placeholder.com/1200x200?text=High+Protein"
                alt="High Protein"
                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
              />
            </div>
            <h1 style={{ marginBottom: '16px', fontSize: '48px' }}>High Protein Smoothies</h1>
            <p style={{ fontSize: '24px', color: '#333', fontWeight: '500', marginBottom: '16px' }}>
              Fuel Your Body, Elevate Your Day.
            </p>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px', maxWidth: '700px', lineHeight: '1.7' }}>
              This isn't just protein—it's a game-changer. Each bottle is packed with everything you need to power through your day and feel great doing it.
            </p>
            <ul style={{ fontSize: '15px', color: '#666', marginTop: '24px', marginLeft: '20px', lineHeight: '1.8' }}>
              <li style={{ marginBottom: '12px' }}><strong>20g Pea Protein:</strong> Smooth, plant-based fuel to keep you strong, lean, and satisfied—without the grit.</li>
              <li style={{ marginBottom: '12px' }}><strong>Organic & Clean:</strong> No pesticides, no shortcuts—just pure, wholesome ingredients.</li>
              <li style={{ marginBottom: '12px' }}><strong>Gluten-Free & Dairy-Free:</strong> Easy on your body, free of heaviness. Enjoy without the bloat.</li>
              <li style={{ marginBottom: '12px' }}><strong>No Artificial Additives:</strong> No fake sweeteners or chemicals—only real ingredients that support your health.</li>
            </ul>
            <p style={{ fontSize: '18px', color: '#333', fontWeight: '600', marginTop: '24px' }}>
              Satisfy your hunger. Nourish your glow.
            </p>
          </div>

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px',
          }}>
            {products.map(product => (
              <Link key={product.id} href={product.type === 'bundle' ? '#' : `/product/${product.id}`}>
                <div style={{
                  cursor: product.type === 'bundle' ? 'default' : 'pointer',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => {
                    if (product.type !== 'bundle') {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
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
                      src="https://via.placeholder.com/240x240?text=Protein"
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                      {product.name}
                    </h3>
                    {product.reviews > 0 && (
                      <p style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>
                        ⭐ {product.reviews.toLocaleString()} reviews
                      </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {product.price > 0 && (
                        <span style={{ fontWeight: '600', fontSize: '16px' }}>${product.price.toFixed(2)}</span>
                      )}
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
                        {product.type === 'bundle' ? 'Shop Set' : 'Add'}
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
