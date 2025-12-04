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

  if (authLoading) return (
    <div style={{ 
      background: '#000000', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#ffffff'
    }}>
      Loading...
    </div>
  );

  return (
    <>
      <Navbar />
      <div style={{ 
        padding: '40px 20px', 
        maxWidth: '1000px', 
        margin: '0 auto',
        background: '#000000',
        minHeight: '100vh',
      }}>
        <h2 style={{ marginBottom: '32px', color: '#ffffff' }}>Shopping Cart</h2>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
              Your cart is empty
            </p>
            <Link href="/products" style={{
              padding: '12px 32px',
              background: '#ffffff',
              color: '#000000',
              textDecoration: 'none',
              borderRadius: '980px',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              display: 'inline-block',
            }}>
              Shop Now
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
                    padding: '16px',
                    marginBottom: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
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
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#ffffff' }}>
                      {item.product?.name}
                    </h3>
                    <p style={{ margin: '0 0 8px 0', color: '#ffffff' }}>
                      ${item.product?.price}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          padding: '4px 12px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(255,255,255,0.05)',
                          color: '#ffffff',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      >
                        -
                      </button>
                      <span style={{ color: '#ffffff', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          padding: '4px 12px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(255,255,255,0.05)',
                          color: '#ffffff',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          padding: '4px 12px',
                          border: '1px solid rgba(255,100,100,0.3)',
                          background: 'rgba(255,100,100,0.1)',
                          color: '#ff6b6b',
                          cursor: 'pointer',
                          marginLeft: 'auto',
                          borderRadius: '6px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
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
              background: 'rgba(255,255,255,0.05)',
              padding: '24px',
              borderRadius: '12px',
              height: 'fit-content',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#ffffff' }}>Order Summary</h3>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                color: '#ffffff',
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
                color: '#ffffff',
              }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '980px',
                  cursor: isCheckingOut ? 'default' : 'pointer',
                  fontWeight: '500',
                  fontSize: '15px',
                  opacity: isCheckingOut ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                }}
              >
                {isCheckingOut ? 'Processing...' : 'Checkout'}
              </button>
              <button
                onClick={() => clear()}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '980px',
                  cursor: 'pointer',
                  marginTop: '8px',
                  fontWeight: '500',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />

      <style jsx>{`
        button:hover {
          opacity: 0.85;
        }
      `}</style>
    </>
  );
}
