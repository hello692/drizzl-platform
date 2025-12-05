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
      <div className="cart-container">
        <h2 className="cart-title">Shopping Cart</h2>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p className="cart-empty-text">Your cart is empty</p>
            <Link href="/products" className="cart-empty-btn">
              Shop Now
            </Link>
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
                {isCheckingOut ? 'Processing...' : 'Checkout'}
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
