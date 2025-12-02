import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AuthPage() {
  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        padding: '40px',
      }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          padding: '40px',
          border: '1px solid #e8e8e8',
          borderRadius: '4px',
        }}>
          <h1 style={{ fontSize: '28px', marginBottom: '32px', textAlign: 'center' }}>Log In</h1>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={{
                  width: '100%',
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
                padding: '12px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '16px',
              }}
            >
              Log In
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#666' }}>
            Don't have an account? <a href="#" style={{ color: '#000', fontWeight: '600' }}>Sign up</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
