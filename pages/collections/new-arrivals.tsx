import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

const newArrivals = [
  { id: '10', name: 'Pumpkin Spice Latte', price: 8.99, category: 'Smoothie', isNew: true },
  { id: '11', name: 'Tropical Greens Protein', price: 9.49, category: 'Protein Smoothie', isNew: true },
  { id: '12', name: 'Strawberry Banana Protein', price: 9.49, category: 'Protein Smoothie', isNew: true },
];

export default function NewArrivals() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '16px' }}>New Arrivals</h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
            Discover our latest and greatest blends, crafted with fresh organic ingredients.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px',
          }}>
            {newArrivals.map(product => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div style={{
                  cursor: 'pointer',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  padding: '20px',
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
                    height: '200px',
                    borderRadius: '4px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {product.isNew && (
                      <span style={{
                        background: '#000',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#999', marginBottom: '12px' }}>
                    {product.category}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600' }}>${product.price}</span>
                    <button style={{
                      padding: '8px 16px',
                      background: '#000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}>
                      Add
                    </button>
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
