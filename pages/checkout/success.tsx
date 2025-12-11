import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';

interface OrderDetails {
  id: string;
  customerEmail: string;
  amountTotal: number;
  currency: string;
  lineItems: any[];
}

export default function CheckoutSuccess() {
  const router = useRouter();
  const { session_id } = router.query;
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session_id && typeof session_id === 'string') {
      fetchOrderDetails(session_id);
    }
  }, [session_id]);

  async function fetchOrderDetails(sessionId: string) {
    try {
      const res = await fetch(`/api/stripe/session/${sessionId}`);
      if (!res.ok) throw new Error('Failed to fetch order details');
      const data = await res.json();
      setOrderDetails(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="success-page">
        <div className="success-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading your order details...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>Something went wrong loading your order.</p>
              <Link href="/shop-all" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="success-icon">
                <CheckCircle size={64} strokeWidth={1.5} />
              </div>
              
              <h1>Thank you for your order!</h1>
              <p className="success-subtitle">
                Your order has been confirmed and will be shipped soon.
              </p>

              {orderDetails && (
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Order Total</span>
                    <span className="amount">
                      ${((orderDetails.amountTotal || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                  {orderDetails.customerEmail && (
                    <div className="summary-row">
                      <span>Confirmation sent to</span>
                      <span>{orderDetails.customerEmail}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="next-steps">
                <div className="step">
                  <Mail size={24} />
                  <div>
                    <h3>Check your email</h3>
                    <p>We've sent a confirmation email with your order details.</p>
                  </div>
                </div>
                <div className="step">
                  <Package size={24} />
                  <div>
                    <h3>Track your order</h3>
                    <p>You'll receive tracking information once your order ships.</p>
                  </div>
                </div>
              </div>

              <div className="actions">
                <Link href="/shop-all" className="btn-primary">
                  Continue Shopping
                  <ArrowRight size={18} />
                </Link>
                <Link href="/account/orders" className="btn-secondary">
                  View Orders
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .success-page {
          min-height: 60vh;
          padding: 80px 20px;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-container {
          max-width: 560px;
          text-align: center;
        }

        .loading-state,
        .error-state {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #00FF85;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .success-icon {
          color: #00FF85;
          margin-bottom: 24px;
        }

        h1 {
          font-size: 2rem;
          font-weight: 600;
          color: #f5f5f7;
          margin-bottom: 12px;
        }

        .success-subtitle {
          color: #86868b;
          font-size: 1.125rem;
          margin-bottom: 40px;
        }

        .order-summary {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 40px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: #86868b;
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-row .amount {
          color: #f5f5f7;
          font-weight: 600;
          font-size: 1.25rem;
        }

        .next-steps {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 40px;
          text-align: left;
        }

        .step {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
        }

        .step svg {
          color: #00FF85;
          flex-shrink: 0;
        }

        .step h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #f5f5f7;
          margin-bottom: 4px;
        }

        .step p {
          font-size: 0.875rem;
          color: #86868b;
          margin: 0;
        }

        .actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: #00FF85;
          color: #000;
          font-weight: 600;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: #00cc6a;
          transform: translateY(-1px);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #f5f5f7;
          font-weight: 500;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 1.5rem;
          }

          .actions {
            flex-direction: column;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
