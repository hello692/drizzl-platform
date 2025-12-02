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
        <div style={{ minHeight: '60vh', padding: '60px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '16px' }}>Your cart is empty</h1>
            <p style={{ color: '#666', marginBottom: '24px' }}>Add some products to your cart before checking out.</p>
            <button
              onClick={() => router.push('/products')}
              style={{ padding: '14px 32px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
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
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' }}>
            <div>
              <h1 style={{ marginBottom: '32px' }}>Checkout</h1>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', justifyContent: 'space-between' }}>
                <div style={{ padding: '12px 24px', background: step === 1 ? '#000' : '#f9f9f9', color: step === 1 ? 'white' : '#666', borderRadius: '4px', fontSize: '14px', fontWeight: '600' }}>
                  1. Shipping
                </div>
                <div style={{ padding: '12px 24px', background: step === 2 ? '#000' : '#f9f9f9', color: step === 2 ? 'white' : '#666', borderRadius: '4px', fontSize: '14px', fontWeight: '600' }}>
                  2. Payment
                </div>
              </div>

              {step === 1 && (
                <form onSubmit={handleShippingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Shipping Address</h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input type="text" placeholder="First Name" value={shippingData.firstName} onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })} required style={{ padding: '12px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '14px' }} />
                    <input type="text" placeholder="Last Name" value={shippingData.lastName} onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })} required style={{ padding: '12px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '14px' }} />
                  </div>

                  <input type="email" placeholder="Email" value={shippingData.email} onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })} required style={{ padding: '12px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '14px' }} />
                  <input type="text" placeholder="Street Address" value={shippingData.address} onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })} required style={{ padding: '12px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '14px' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                    <input type="text" placeholder="City" value={shippingData.city} onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })} required style={{ padding: '12px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '14px' }} />
                    <input type="text" placeholder="State" value={shippingData.state} onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })} required style={{ padding: '12px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '14px' }} />
                    <input type="text" placeholder="ZIP" value={shippingData.zip} onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })} required style={{ padding: '12px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '14px' }} />
                  </div>

                  <button type="submit" style={{ padding: '14px 24px', background: '#000', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' }}>
                    Continue to Payment
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Payment Method</h2>
                  <p style={{ color: '#666', marginBottom: '16px' }}>
                    Stripe integration coming in Phase 2. For now, this is a demo checkout - orders will be saved to the database.
                  </p>

                  <input type="text" placeholder="Card Number" defaultValue="4242 4242 4242 4242" style={{ padding: '12px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '14px' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input type="text" placeholder="MM/YY" defaultValue="12/25" style={{ padding: '12px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '14px' }} />
                    <input type="text" placeholder="CVC" defaultValue="123" style={{ padding: '12px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '14px' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button type="button" onClick={() => setStep(1)} style={{ padding: '14px 24px', background: '#f5f5f5', color: '#000', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
                      Back
                    </button>
                    <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '14px 24px', background: '#000', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '600', cursor: isSubmitting ? 'default' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
                      {isSubmitting ? 'Processing...' : 'Complete Purchase'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div style={{ background: '#f9f9f9', padding: '24px', borderRadius: '4px', height: 'fit-content' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Order Summary</h3>
              
              <div style={{ marginBottom: '16px' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                    <span>{item.product?.name || 'Product'} x {item.quantity}</span>
                    <span style={{ fontWeight: '600' }}>${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>Subtotal</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>${total.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>Shipping</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>FREE</span>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>Total</span>
                  <span style={{ fontSize: '20px', fontWeight: '700' }}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
