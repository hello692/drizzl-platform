import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(0, 0, 0, 0.06)',
      padding: '120px 60px 60px 60px',
      background: '#ffffff',
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '60px',
          marginBottom: '80px',
        }}>
          {/* SHOP */}
          <div>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.8px',
              marginBottom: '20px',
              color: '#000',
            }}>
              Shop
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/products/smoothies" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#000'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; }}>
                Smoothies
              </Link>
              <Link href="/products/high-protein" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                High Protein
              </Link>
              <Link href="/products/bowls" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Bowls
              </Link>
              <Link href="/products/bites" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Bites
              </Link>
            </div>
          </div>

          {/* LEARN */}
          <div>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.8px',
              marginBottom: '20px',
              color: '#000',
            }}>
              Learn
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/contact" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Contact
              </Link>
              <Link href="/faq" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                FAQ
              </Link>
              <Link href="/our-story" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Our Story
              </Link>
              <Link href="/blog" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Blog
              </Link>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.8px',
              marginBottom: '20px',
              color: '#000',
            }}>
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/careers" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Careers
              </Link>
              <Link href="/refer" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Refer
              </Link>
              <Link href="/student-discount" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Student Discount
              </Link>
            </div>
          </div>

          {/* LEGAL */}
          <div>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.8px',
              marginBottom: '20px',
              color: '#000',
            }}>
              Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/privacy" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Privacy
              </Link>
              <Link href="/terms" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Terms
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto 60px',
          paddingBottom: '60px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          textAlign: 'center',
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '600',
            marginBottom: '12px',
            letterSpacing: '-0.4px',
          }}>
            Subscribe
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '24px',
            lineHeight: '1.7',
          }}>
            Get wellness updates and exclusive offers
          </p>
          <div style={{
            display: 'flex',
            gap: '8px',
          }}>
            <input
              type="email"
              placeholder="Email"
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#fff',
                transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.3)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)'; }}
            />
            <button style={{
              padding: '12px 24px',
              background: '#000',
              color: '#fff',
              border: '1px solid #000',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#333';
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.borderColor = '#000';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
              }}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          paddingTop: '20px',
        }}>
          <p style={{
            fontSize: '13px',
            color: '#999',
            letterSpacing: '-0.2px',
          }}>
            © 2025 Drizzl Wellness. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            gap: '24px',
          }}>
            <Link href="#" style={{ fontSize: '13px', color: '#999', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
              Facebook
            </Link>
            <Link href="#" style={{ fontSize: '13px', color: '#999', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
              Instagram
            </Link>
            <Link href="#" style={{ fontSize: '13px', color: '#999', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
