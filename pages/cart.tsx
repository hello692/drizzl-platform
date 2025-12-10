import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

export default function Cart() {
  const { user } = useAuth();
  const { items, total, loading, removeItem, updateQuantity, clear } = useCart(user?.id);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (!user) {
      window.location.href = '/auth?redirect=/cart';
      return;
    }

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

  if (loading) return (
    <div style={{ 
      background: '#000000', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#ffffff'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '2px solid rgba(255,255,255,0.1)', 
          borderTopColor: '#ffffff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p style={{ opacity: 0.6 }}>Loading cart...</p>
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h2 className="cart-title">Shopping Cart</h2>

        {items.length === 0 ? (
          <div className="empty-cart-container">
            <div className="empty-cart-glow" />
            <div className="empty-cart-content">
              <div className="empty-cart-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="empty-cart-title">Your cart is empty</h1>
              <p className="empty-cart-tagline">
                Your <span className="highlight">wellness love affair</span> starts with <span className="highlight">one irresistible sip</span>.
              </p>
              <Link href="/smoothies" className="empty-cart-btn">
                <span>Start Shopping</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  {item.product?.image_url && (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="cart-item-image"
                    />
                  )}
                  <div className="cart-item-content">
                    <h3 className="cart-item-name">{item.product?.name}</h3>
                    <p className="cart-item-price">${item.product?.price}</p>
                    <div className="cart-item-controls">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="cart-qty-btn"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="cart-qty-btn"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="cart-remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3 className="cart-summary-title">Order Summary</h3>
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="cart-summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="cart-checkout-btn"
              >
                {isCheckingOut ? 'Processing...' : user ? 'Checkout' : 'Sign in to Checkout'}
              </button>
              <button
                onClick={() => clear()}
                className="cart-clear-btn"
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
