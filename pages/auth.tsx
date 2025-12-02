import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AuthPage() {
  return (
    <>
      <Navbar />
      <div className="gradient-animated" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 80px',
        background: 'linear-gradient(-45deg, #ffffff, #f8f9fa, #ffffff, #f0f0f0)',
        backgroundSize: '400% 400%',
      }}>
        <div className="glass tech-shine" style={{
          maxWidth: '400px',
          width: '100%',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(66, 133, 244, 0.1), inset 0 0 20px rgba(66, 133, 244, 0.05)',
        }}>
          <h1 className="heading-2100 text-glow" style={{ fontSize: '28px', marginBottom: '32px', textAlign: 'center' }}>LOG IN</h1>
          
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
                  padding: '12px 16px',
                  border: '1px solid rgba(224, 224, 224, 0.6)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: 'rgba(248, 249, 250, 0.8)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'inset 0 0 15px rgba(66, 133, 244, 0.1)'; e.currentTarget.style.borderColor = 'rgba(66, 133, 244, 0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(224, 224, 224, 0.6)'; }}
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
                  padding: '12px 16px',
                  border: '1px solid rgba(224, 224, 224, 0.6)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: 'rgba(248, 249, 250, 0.8)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'inset 0 0 15px rgba(66, 133, 244, 0.1)'; e.currentTarget.style.borderColor = 'rgba(66, 133, 244, 0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(224, 224, 224, 0.6)'; }}
              />
            </div>

            <button
              type="submit"
              className="tech-shine float-animation"
              style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '16px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(66, 133, 244, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
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
