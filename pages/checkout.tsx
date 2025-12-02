import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRequireAuth } from '../hooks/useAuth';

export default function Checkout() {
  const { user } = useRequireAuth();
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      alert('Order placed successfully!');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }}>
            {/* Main Form */}
            <div>
              <h1 style={{ marginBottom: '32px' }}>Checkout</h1>

              {/* Step Indicator */}
              <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '40px',
                justifyContent: 'space-between',
              }}>
                <div style={{
                  padding: '12px 24px',
                  background: step === 1 ? '#000' : '#f9f9f9',
                  color: step === 1 ? 'white' : '#666',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  1. Shipping
                </div>
                <div style={{
                  padding: '12px 24px',
                  background: step === 2 ? '#000' : '#f9f9f9',
                  color: step === 2 ? 'white' : '#666',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  2. Payment
                </div>
              </div>

              {step === 1 && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Shipping Address</h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={shippingData.firstName}
                      onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                      required
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8e8',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={shippingData.lastName}
                      onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                      required
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8e8',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email"
                    value={shippingData.email}
                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                    required
                    style={{
                      padding: '12px',
                      border: '1px solid #e8e8e8',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />

                  <input
                    type="text"
                    placeholder="Street Address"
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                    required
                    style={{
                      padding: '12px',
                      border: '1px solid #e8e8e8',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      required
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8e8',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                      required
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8e8',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="ZIP"
                      value={shippingData.zip}
                      onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })}
                      required
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8e8',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: '14px 24px',
                      background: '#000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '16px',
                    }}
                  >
                    Continue to Payment
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Payment Method</h2>
                  <p style={{ color: '#666', marginBottom: '16px' }}>
                    Stripe integration coming in Phase 2. For now, this is a demo checkout flow.
                  </p>

                  <input
                    type="text"
                    placeholder="Card Number"
                    defaultValue="4242 4242 4242 4242"
                    style={{
                      padding: '12px',
                      border: '1px solid #e8e8e8',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="12/25"
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8e8',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      defaultValue="123"
                      style={{
                        padding: '12px',
                        border: '1px solid #e8e8e8',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: '14px 24px',
                      background: '#000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '16px',
                    }}
                  >
                    Complete Purchase
                  </button>
                </form>
              )}
            </div>

            {/* Order Summary */}
            <div style={{
              background: '#f9f9f9',
              padding: '24px',
              borderRadius: '4px',
              height: 'fit-content',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                Order Summary
              </h3>
              <div style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: '16px', marginBottom: '16px' }}>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                  Subtotal
                </p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>$59.99</p>
              </div>
              <div style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: '16px', marginBottom: '16px' }}>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                  Shipping
                </p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>FREE</p>
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                  Total
                </p>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>$59.99</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
