import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function CheckoutCancel() {
  return (
    <>
      <Navbar />
      <div className="cancel-page">
        <div className="cancel-container">
          <div className="cancel-icon">
            <XCircle size={64} strokeWidth={1.5} />
          </div>
          
          <h1>Payment Cancelled</h1>
          <p className="cancel-subtitle">
            Your payment was cancelled. No charges were made.
          </p>
          <p className="cancel-description">
            Your cart items are still saved. You can return to checkout when ready.
          </p>

          <div className="actions">
            <Link href="/cart" className="btn-primary">
              <ShoppingCart size={18} />
              Return to Cart
            </Link>
            <Link href="/shop-all" className="btn-secondary">
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .cancel-page {
          min-height: 60vh;
          padding: 80px 20px;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cancel-container {
          max-width: 480px;
          text-align: center;
        }

        .cancel-icon {
          color: #ff6b6b;
          margin-bottom: 24px;
        }

        h1 {
          font-size: 2rem;
          font-weight: 600;
          color: #f5f5f7;
          margin-bottom: 12px;
        }

        .cancel-subtitle {
          color: #86868b;
          font-size: 1.125rem;
          margin-bottom: 8px;
        }

        .cancel-description {
          color: #636366;
          font-size: 0.9375rem;
          margin-bottom: 40px;
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
