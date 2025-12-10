import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRequireAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../lib/db';
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

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || items.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderItems = items.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
        unitPriceCents: Math.round((item.product?.price || 0) * 100),
      }));

      const order = await createOrder(user.id, 'd2c', orderItems);

      await logEvent('order_completed', {
        order_id: order.id,
        order_total: total,
        order_type: 'd2c',
        items_count: items.length,
      });

      await clear();
      router.push(`/order-confirmation?orderId=${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
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
                <form onSubmit={handlePaymentSubmit} className="checkout-form">
                  <h2 className="checkout-form-title">Payment Method</h2>
                  <p className="checkout-form-description">
                    Stripe integration coming in Phase 2. For now, this is a demo checkout - orders will be saved to the database.
                  </p>

                  <div className="checkout-field">
                    <label htmlFor="cardNumber" className="checkout-label">Card Number</label>
                    <input
                      id="cardNumber"
                      type="text"
                      placeholder="Card Number"
                      defaultValue="4242 4242 4242 4242"
                      className="checkout-input"
                      inputMode="numeric"
                      autoComplete="cc-number"
                    />
                  </div>

                  <div className="checkout-input-row">
                    <div className="checkout-field">
                      <label htmlFor="cardExpiry" className="checkout-label">Expiry Date</label>
                      <input
                        id="cardExpiry"
                        type="text"
                        placeholder="MM/YY"
                        defaultValue="12/25"
                        className="checkout-input"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                      />
                    </div>
                    <div className="checkout-field">
                      <label htmlFor="cardCvc" className="checkout-label">CVC</label>
                      <input
                        id="cardCvc"
                        type="text"
                        placeholder="CVC"
                        defaultValue="123"
                        className="checkout-input"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                      />
                    </div>
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
                      type="submit"
                      disabled={isSubmitting}
                      className="checkout-btn"
                      style={{ flex: 1 }}
                    >
                      {isSubmitting ? 'Processing...' : 'Complete Purchase'}
                    </button>
                  </div>
                </form>
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
