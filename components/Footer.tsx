import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: 'clamp(24px, 4vw, 48px) 0 clamp(20px, 3vw, 32px) 0',
      background: '#000',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        paddingLeft: 'clamp(24px, 5vw, 80px)',
        paddingRight: 'clamp(24px, 5vw, 80px)',
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(150px, 35vw, 280px), 1fr))',
          gap: 'clamp(20px, 4vw, 40px)',
          marginBottom: 'clamp(24px, 4vw, 40px)',
        }}>
          {/* PRODUCTS */}
          <div>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em',
              marginBottom: '16px',
              color: '#f5f5f7',
            }}>
              Products
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.5vw, 8px)' }}>
              <Link href="/collections/smoothies" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                Smoothies
              </Link>
              <Link href="/collections/high-protein" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                High Protein
              </Link>
              <Link href="/collections/best-sellers" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                Best Sellers
              </Link>
            </div>
          </div>

          {/* COLLECTIONS */}
          <div>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em',
              marginBottom: '16px',
              color: '#f5f5f7',
            }}>
              Collections
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.5vw, 8px)' }}>
              <Link href="/collections/new-arrivals" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                New Arrivals
              </Link>
              <Link href="/collections/smoothie-boxes" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                Smoothie Boxes
              </Link>
              <Link href="/collections/gift-guide" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                Gift Guide
              </Link>
              <Link href="/shop-all" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                Shop All
              </Link>
            </div>
          </div>

          {/* LEARN */}
          <div>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em',
              marginBottom: '16px',
              color: '#f5f5f7',
            }}>
              Learn
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.5vw, 8px)' }}>
              <Link href="/our-story" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                Our Story
              </Link>
              <Link href="/blog" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                Blog & Recipes
              </Link>
              <Link href="/contact" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                Contact
              </Link>
              <Link href="/faq" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                FAQ
              </Link>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em',
              marginBottom: '16px',
              color: '#f5f5f7',
            }}>
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.5vw, 8px)' }}>
              <Link href="/careers" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                Careers
              </Link>
              <Link href="/refer" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                Referral Program
              </Link>
              <Link href="/student-discount" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
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
              letterSpacing: '0.08em',
              marginBottom: '16px',
              color: '#f5f5f7',
            }}>
              Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.5vw, 8px)' }}>
              <Link href="/privacy" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                Privacy Policy
              </Link>
              <Link href="/terms" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div style={{
          maxWidth: '560px',
          margin: '0 auto clamp(24px, 5vw, 40px)',
          paddingBottom: 'clamp(24px, 5vw, 40px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          textAlign: 'center',
        }}>
          <h3 style={{
            fontSize: 'clamp(21px, 4vw, 28px)',
            fontWeight: '600',
            marginBottom: '8px',
            letterSpacing: '-0.016em',
            color: '#f5f5f7',
            lineHeight: '1.14',
          }}>
            Stay in the Loop
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#86868b',
            marginBottom: '20px',
            lineHeight: '1.5',
            letterSpacing: '-0.016em',
          }}>
            Get wellness updates and exclusive offers.
          </p>
          <div className="footer-newsletter" style={{
            display: 'flex',
            gap: 'clamp(6px, 2vw, 8px)',
            flexDirection: 'row',
          }}>
            <input
              type="email"
              placeholder="Email"
              style={{
                flex: 1,
                padding: '12px 20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '980px',
                fontSize: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; }}
            />
            <button style={{
              padding: '12px 24px',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '980px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright" style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'clamp(12px, 2vw, 16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 'clamp(10px, 2vw, 16px)',
        }}>
          <p style={{
            fontSize: 'clamp(11px, 2.5vw, 13px)',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '-0.2px',
            textAlign: 'left',
          }}>
            © 2025 Drizzl Wellness. All rights reserved.
          </p>
          <div className="footer-social" style={{
            display: 'flex',
            gap: 'clamp(16px, 4vw, 24px)',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}>
            <Link href="#" style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'rgba(255,255,255,0.5)', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              Facebook
            </Link>
            <Link href="#" style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'rgba(255,255,255,0.5)', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              Instagram
            </Link>
            <Link href="#" style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'rgba(255,255,255,0.5)', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
