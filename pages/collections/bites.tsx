import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

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
          {/* Header Section */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{ background: '#f9f9f9', borderRadius: '4px', padding: '40px', marginBottom: '40px' }}>
              <img
                src="https://via.placeholder.com/1200x200?text=Bites"
                alt="Bites"
                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
              />
            </div>
            <h1 style={{ marginBottom: '16px', fontSize: '48px' }}>Bites</h1>
            <ul style={{ fontSize: '14px', color: '#666', marginTop: '24px', marginLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>An energizing snack or dessert</li>
              <li style={{ marginBottom: '8px' }}>Sweetened with dates to satisfy cravings</li>
              <li style={{ marginBottom: '8px' }}>Gluten-free + dairy-free</li>
              <li>Eat them right out of the bag</li>
            </ul>
          </div>

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px',
          }}>
            {products.map(product => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div style={{
                  cursor: 'pointer',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
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
                    <img
                      src="https://via.placeholder.com/240x240?text=Bite"
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>
                      ⭐ {product.reviews.toLocaleString()} reviews
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', fontSize: '16px' }}>${product.price.toFixed(2)}</span>
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
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* More Collections */}
          <div style={{ marginTop: '80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '40px' }}>More Collections</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '32px',
            }}>
              <Link href="/collections/smoothies">
                <div style={{
                  cursor: 'pointer',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    background: '#f9f9f9',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '20px',
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#000' }}>Cult Favorites for a Reason</h3>
                  </div>
                </div>
              </Link>
              <Link href="/collections/high-protein">
                <div style={{
                  cursor: 'pointer',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    background: '#f9f9f9',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '20px',
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#000' }}>Fuel Your Day</h3>
                  </div>
                </div>
              </Link>
              <Link href="/collections/breakfast-bowls">
                <div style={{
                  cursor: 'pointer',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    background: '#f9f9f9',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '20px',
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#000' }}>Packed with Superfoods</h3>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
