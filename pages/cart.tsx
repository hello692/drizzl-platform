import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';

export default function Cart() {
  const { user } = useAuth();
  const { items, subtotalCents, itemCount, removeItem, setQty, clear, hydrated } = useCart();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [isClearing, setIsClearing] = useState(false);

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    setQty(productId, newQuantity);
    setUpdatingItems(prev => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  };

  const handleRemoveItem = (productId: string) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    removeItem(productId);
    setUpdatingItems(prev => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  };

  const handleClear = () => {
    setIsClearing(true);
    clear();
    setIsClearing(false);
  };

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
            product_id: item.productId,
            quantity: item.qty,
            price: item.priceCents / 100,
          })),
          total: subtotalCents / 100,
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

  if (!hydrated) return (
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

  const total = subtotalCents / 100;

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
              <Link href="/collections/smoothies" className="empty-cart-btn">
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
                <div key={item.productId} className="cart-item">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  )}
                  <div className="cart-item-content">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">${(item.priceCents / 100).toFixed(2)}</p>
                    <div className="cart-item-controls">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.productId, item.qty - 1)}
                        className="cart-qty-btn"
                        aria-label="Decrease quantity"
                        disabled={updatingItems.has(item.productId)}
                        style={{ opacity: updatingItems.has(item.productId) ? 0.5 : 1 }}
                      >
                        −
                      </button>
                      <span className="cart-qty-value">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.productId, item.qty + 1)}
                        className="cart-qty-btn"
                        aria-label="Increase quantity"
                        disabled={updatingItems.has(item.productId)}
                        style={{ opacity: updatingItems.has(item.productId) ? 0.5 : 1 }}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.productId)}
                        className="cart-remove-btn"
                        disabled={updatingItems.has(item.productId)}
                      >
                        {updatingItems.has(item.productId) ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3 className="cart-summary-title">Order Summary</h3>
              <div className="cart-summary-row">
                <span>Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="cart-summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="cart-checkout-btn"
              >
                {isCheckingOut ? 'Processing...' : user ? 'Checkout' : 'Sign in to Checkout'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="cart-clear-btn"
                disabled={isClearing}
              >
                {isClearing ? 'Clearing...' : 'Clear Cart'}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
