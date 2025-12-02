import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

const bestSellers = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, category: 'Smoothie', reviews: 4619 },
  { id: '2', name: 'Mint + Cacao', price: 8.49, category: 'Smoothie', reviews: 4559 },
  { id: '3', name: 'Mixed Berry Protein', price: 9.49, category: 'Protein Smoothie', reviews: 185 },
  { id: '4', name: 'Dark Chocolate Protein', price: 9.49, category: 'Protein Smoothie', reviews: 199 },
  { id: '5', name: 'Tropical Greens', price: 8.49, category: 'Smoothie', reviews: 2100 },
  { id: '6', name: 'Blueberry + Cacao', price: 8.49, category: 'Smoothie', reviews: 1850 },
];

export default function BestSellers() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '16px' }}>Best Sellers</h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
            Take the guesswork out of eating and try our all-time greats, built on organic fruits + vegetables.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px',
          }}>
            {bestSellers.map(product => (
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
                  }} />
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
                    {product.category}
                  </p>
                  <p style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>
                    ⭐ {product.reviews.toLocaleString()} reviews
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
