import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', href: '/wholesale' },
  { id: 'pricing', label: 'Pricing', href: '/wholesale/pricing' },
  { id: 'apply', label: 'Apply', href: '/wholesale/apply', isCta: true },
  { id: 'signin', label: 'Sign In', href: '/wholesale/signin' },
];

export default function WholesaleSignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <Navbar />
      
      <nav style={{
        position: 'sticky',
        top: '72px',
        zIndex: 100,
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 48px)',
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          <span style={{
            fontSize: 'var(--fs-body)',
            fontWeight: 500,
            color: '#ffffff',
            whiteSpace: 'nowrap',
            padding: '16px 0',
          }}>
            Wholesale
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {NAV_ITEMS.map((item) => (
              item.isCta ? (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    background: '#00FF85',
                    color: '#000000',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    fontSize: 'var(--fs-small)',
                    fontWeight: 500,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    background: 'none',
                    padding: '16px 16px',
                    fontSize: 'var(--fs-small)',
                    fontWeight: 400,
                    color: router.pathname === item.href ? '#ffffff' : 'rgba(255,255,255,0.5)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    borderBottom: router.pathname === item.href ? '2px solid #ffffff' : '2px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </div>
      </nav>

      <main style={{ 
        background: '#000000', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px',
          padding: '32px',
          maxWidth: '420px',
          width: '100%',
        }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 300,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            marginBottom: '12px',
            textAlign: 'center',
          }}>
            Partner Sign In
          </h1>
          <p style={{
            fontSize: 'var(--fs-small)',
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'var(--color-text-tertiary)',
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            Access your wholesale account to manage orders and resources.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: 'var(--fs-small)',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '8px',
              }}>
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: 'var(--fs-body)',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                placeholder="partner@company.com"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: 'var(--fs-small)',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '8px',
              }}>
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: 'var(--fs-body)',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px 32px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '50px',
                fontSize: 'var(--fs-body)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '16px',
              }}
            >
              Sign In
            </button>

            <p style={{
              fontSize: 'var(--fs-small)',
              color: 'rgba(255,255,255,0.5)',
              textAlign: 'center',
            }}>
              <a 
                href="mailto:wholesale@drizzlwellness.com"
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
              >
                Forgot password? Contact support
              </a>
            </p>
          </form>

          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
          }}>
            <Link
              href="/wholesale/apply"
              style={{
                fontSize: 'var(--fs-small)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
            >
              Not a partner yet? Apply now →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
