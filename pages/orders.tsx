import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRequireAuth } from '../hooks/useAuth';

export default function Orders() {
  const { user } = useRequireAuth();

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '40px' }}>Order History</h1>

          <div style={{
            border: '1px solid #e8e8e8',
            borderRadius: '4px',
            padding: '40px',
            textAlign: 'center',
            color: '#999',
          }}>
            <p>You haven't placed any orders yet.</p>
            <p style={{ margin: '12px 0 0 0' }}>Start shopping to see your orders here.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
