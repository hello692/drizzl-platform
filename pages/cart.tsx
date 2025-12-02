import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useRequireAuth } from '../hooks/useAuth';

export default function Cart() {
  const { user, loading: authLoading } = useRequireAuth();
  const { items, total, removeItem, updateQuantity, clear } = useCart(user?.id);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    try {
      const session = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.product?.price || 0,
          })),
          total,
        }),
      }).then(r => r.json());

      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (authLoading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '32px' }}>Shopping Cart</h2>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: '#999', marginBottom: '20px' }}>
              Your cart is empty
            </p>
            <Link href="/products" style={{
              padding: '12px 32px',
              background: '#111',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
            }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
            <div>
              {items.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px 0',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {item.product?.image_url && (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        background: '#f5f5f5',
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 8px 0' }}>
                      {item.product?.name}
                    </h3>
                    <p style={{ margin: '0 0 8px 0', color: '#666' }}>
                      ${item.product?.price}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #ddd',
                          background: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #ddd',
                          background: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #ddd',
                          background: '#ffe6e6',
                          color: '#a11a1a',
                          cursor: 'pointer',
                          marginLeft: 'auto',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              height: 'fit-content',
            }}>
              <h3 style={{ margin: '0 0 16px 0' }}>Order Summary</h3>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #ddd',
              }}>
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
                fontSize: '18px',
                fontWeight: 'bold',
              }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isCheckingOut ? 'default' : 'pointer',
                  fontWeight: 'bold',
                  opacity: isCheckingOut ? 0.6 : 1,
                }}
              >
                {isCheckingOut ? 'Processing...' : 'Checkout'}
              </button>
              <button
                onClick={() => clear()}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'white',
                  color: '#111',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
