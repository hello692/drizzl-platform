import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AuthPage() {
  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(20px, 4vw, 40px)',
        background: '#ffffff',
        animation: 'delicateFade 1s cubic-bezier(0.32, 0, 0.67, 0)',
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          animation: 'smoothScale 1s cubic-bezier(0.32, 0, 0.67, 0)',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '48px',
          }}>
            <h1 style={{
              fontSize: 'clamp(32px, 6vw, 48px)',
              fontWeight: '700',
              letterSpacing: '-0.8px',
              marginBottom: '12px',
              animation: 'subtleFloat 6s ease-in-out infinite',
            }}>
              Sign In
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 3vw, 16px)',
              color: '#666',
              lineHeight: '1.7',
              margin: 0,
            }}>
              Access your wellness account securely
            </p>
          </div>

          <form style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              animation: 'delicateFade 1s cubic-bezier(0.32, 0, 0.67, 0) 0.2s forwards',
              opacity: 0,
            }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#000',
                letterSpacing: '-0.2px',
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                style={{
                  padding: '14px 16px',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '8px',
                  fontSize: '15px',
                  transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)',
                  fontFamily: 'inherit',
                  backgroundColor: '#fff',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(0, 0, 0, 0.06)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              animation: 'delicateFade 1s cubic-bezier(0.32, 0, 0.67, 0) 0.4s forwards',
              opacity: 0,
            }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#000',
                letterSpacing: '-0.2px',
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={{
                  padding: '14px 16px',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '8px',
                  fontSize: '15px',
                  transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)',
                  fontFamily: 'inherit',
                  backgroundColor: '#fff',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(0, 0, 0, 0.06)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '14px 32px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)',
                marginTop: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                animation: 'smoothScale 1s cubic-bezier(0.32, 0, 0.67, 0) 0.6s forwards',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#333';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
            >
              Sign In
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: '32px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            animation: 'delicateFade 1s cubic-bezier(0.32, 0, 0.67, 0) 0.8s forwards',
            opacity: 0,
          }}>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0,
              marginBottom: '12px',
            }}>
              Don't have an account?{' '}
              <a href="/signup" style={{
                color: '#000',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)',
              }} onMouseEnter={(e) => e.currentTarget.style.color = '#666'} onMouseLeave={(e) => e.currentTarget.style.color = '#000'}>
                Sign up
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
