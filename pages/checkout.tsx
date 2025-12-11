import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRequireAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { logEvent } from '../lib/analytics';

export default function Checkout() {
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth();
  const { items, total, clear } = useCart(user?.id);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summaryCollapsed, setSummaryCollapsed] = useState(true);
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  useEffect(() => {
    if (user?.email) {
      setShippingData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStripeCheckout = async () => {
    if (!user || items.length === 0) return;

    setIsSubmitting(true);
    try {
      const checkoutItems = items.map(item => ({
        name: item.product?.name || 'Product',
        price: item.product?.price || 0,
        quantity: item.quantity,
        image: item.product?.image || '',
      }));

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: checkoutItems,
          customerEmail: shippingData.email,
        }),
      });

      const data = await res.json();

      if (data.url) {
        await logEvent('checkout_started', {
          order_total: total,
          items_count: items.length,
        });
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      alert('There was an error starting checkout. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="checkout-container">
          <div className="checkout-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
            <p style={{ color: '#666' }}>Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="checkout-empty">
          <div className="checkout-empty-inner">
            <h1 className="checkout-empty-title">Your cart is empty</h1>
            <p className="checkout-empty-text">Add some products to your cart before checking out.</p>
            <button
              onClick={() => router.push('/products')}
              className="checkout-btn"
              style={{ maxWidth: '280px', margin: '0 auto' }}
            >
              Browse Products
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="checkout-container">
        <div className="checkout-inner">
          <h1 className="checkout-title">Checkout</h1>

          <button
            className="checkout-summary-toggle"
            onClick={() => setSummaryCollapsed(!summaryCollapsed)}
            type="button"
          >
            <span className="checkout-summary-toggle-content">
              <span>Order Summary ({items.length} item{items.length !== 1 ? 's' : ''}) • ${total.toFixed(2)}</span>
              <span className={`checkout-summary-toggle-icon ${!summaryCollapsed ? 'open' : ''}`}>
                ▼
              </span>
            </span>
          </button>

          <div className="checkout-grid">
            <div>
              <div className="checkout-steps">
                <div className={`checkout-step ${step === 1 ? 'active' : ''}`}>
                  1. Shipping
                </div>
                <div className={`checkout-step ${step === 2 ? 'active' : ''}`}>
                  2. Payment
                </div>
              </div>

              {step === 1 && (
                <form onSubmit={handleShippingSubmit} className="checkout-form" noValidate>
                  <h2 className="checkout-form-title">Shipping Address</h2>

                  <div className="checkout-input-row">
                    <div className="checkout-field">
                      <label htmlFor="firstName" className="checkout-label">First Name</label>
                      <input
                        id="firstName"
                        type="text"
                        placeholder="First Name"
                        value={shippingData.firstName}
                        onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                        required
                        className="checkout-input"
                        aria-required="true"
                      />
                    </div>
                    <div className="checkout-field">
                      <label htmlFor="lastName" className="checkout-label">Last Name</label>
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                        required
                        className="checkout-input"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="email" className="checkout-label">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={shippingData.email}
                      onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                      required
                      className="checkout-input"
                      aria-required="true"
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="address" className="checkout-label">Street Address</label>
                    <input
                      id="address"
                      type="text"
                      placeholder="Street Address"
                      value={shippingData.address}
                      onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                      required
                      className="checkout-input"
                      aria-required="true"
                    />
                  </div>

                  <div className="checkout-input-row-3">
                    <div className="checkout-field checkout-field-city">
                      <label htmlFor="city" className="checkout-label">City</label>
                      <input
                        id="city"
                        type="text"
                        placeholder="City"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        required
                        className="checkout-input"
                        aria-required="true"
                      />
                    </div>
                    <div className="checkout-field checkout-field-state">
                      <label htmlFor="state" className="checkout-label">State</label>
                      <input
                        id="state"
                        type="text"
                        placeholder="State"
                        value={shippingData.state}
                        onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                        required
                        className="checkout-input"
                        aria-required="true"
                      />
                    </div>
                    <div className="checkout-field checkout-field-zip">
                      <label htmlFor="zip" className="checkout-label">ZIP</label>
                      <input
                        id="zip"
                        type="text"
                        placeholder="ZIP"
                        value={shippingData.zip}
                        onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })}
                        required
                        className="checkout-input"
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <button type="submit" className="checkout-btn">
                    Continue to Payment
                  </button>
                </form>
              )}

              {step === 2 && (
                <div className="checkout-form">
                  <h2 className="checkout-form-title">Payment</h2>
                  <p className="checkout-form-description">
                    You'll be redirected to Stripe's secure checkout to complete your payment.
                  </p>

                  <div className="stripe-info">
                    <div className="stripe-badge">
                      <svg viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" width="60" height="25">
                        <path fill="#635BFF" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a13.7 13.7 0 0 1-4.56.75c-4.66 0-7.12-2.85-7.12-7.02 0-3.68 2.32-7.08 6.35-7.08 3.85 0 6.18 2.85 6.18 7.08 0 .37-.02 1-.04 1.35zm-4.38-3.35c0-1.55-.72-2.62-1.87-2.62-1.1 0-1.94.87-2.05 2.62h3.92zM38.25 6.11c1.15 0 2.11.16 3.16.56v3.28c-.86-.42-1.81-.63-2.82-.63-1.23 0-1.81.46-1.81 1.04 0 .63.77.87 1.87 1.35 1.84.78 3.06 1.9 3.06 3.87 0 3.25-2.55 4.58-5.73 4.58-1.62 0-3.13-.33-4.22-.87v-3.39c1.09.61 2.5 1.04 3.87 1.04 1.26 0 2-.37 2-.99 0-.65-.65-.94-1.68-1.37-1.75-.72-3.23-1.78-3.23-3.94 0-2.81 2.22-4.53 5.53-4.53zM24.57 20h4.3V6.35h-4.3V20zm2.15-15.55c1.43 0 2.59-.99 2.59-2.21 0-1.23-1.16-2.24-2.59-2.24-1.43 0-2.59 1.01-2.59 2.24 0 1.22 1.16 2.21 2.59 2.21zM17.67 10.14V6.35h-2.74V2.71l-4.24 1.14v2.5H8.66v3.79h2.03v5.27c0 2.85 1.23 4.76 4.56 4.76 1.33 0 2.64-.29 3.52-.75v-3.45c-.65.37-1.45.56-2.24.56-.9 0-1.6-.44-1.6-1.45v-4.94h2.74zm-12.8 9.2c-1.84.75-4.13.83-5.52.83v-3.75c1.04 0 2.43-.1 3.39-.46.48-.18.73-.44.73-.77 0-.27-.16-.52-.63-.77l-2.05-1.1C-.23 12.67 0 11.1 0 10.21c0-2.16 1.41-3.4 3.48-3.94 1.67-.42 3.69-.5 5.39-.42v3.48c-.94-.04-2.38.02-3.39.21-.6.12-.92.4-.92.77 0 .27.16.52.69.81l1.94 1.06c1.87 1.04 2.16 2.43 2.16 3.28 0 1.84-.96 3.14-3.48 3.88z"/>
                      </svg>
                      <span>Secure Payment</span>
                    </div>
                    <p className="payment-methods">We accept all major credit cards</p>
                  </div>

                  <div className="checkout-btn-group">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="checkout-btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleStripeCheckout}
                      disabled={isSubmitting}
                      className="checkout-btn"
                      style={{ flex: 1 }}
                    >
                      {isSubmitting ? 'Redirecting to Stripe...' : 'Pay with Stripe'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className={`checkout-summary ${summaryCollapsed ? 'collapsed' : ''}`}>
              <h3 className="checkout-summary-title">Order Summary</h3>
              
              <div className="checkout-summary-items">
                {items.map(item => (
                  <div key={item.id} className="checkout-summary-item">
                    <span className="checkout-summary-item-name">
                      {item.product?.name || 'Product'} × {item.quantity}
                    </span>
                    <span className="checkout-summary-item-price">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="checkout-summary-divider">
                <div className="checkout-summary-row">
                  <span className="checkout-summary-label">Subtotal</span>
                  <span className="checkout-summary-value">${total.toFixed(2)}</span>
                </div>
                <div className="checkout-summary-row">
                  <span className="checkout-summary-label">Shipping</span>
                  <span className="checkout-summary-value">FREE</span>
                </div>
              </div>
              
              <div className="checkout-summary-total">
                <span className="checkout-summary-total-label">Total</span>
                <span className="checkout-summary-total-value">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        @media (min-width: 769px) {
          .checkout-summary.collapsed {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
