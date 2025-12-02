import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(0, 0, 0, 0.06)',
      padding: 'clamp(40px, 6vw, 120px) clamp(16px, 4vw, 60px) clamp(30px, 4vw, 60px) clamp(16px, 4vw, 60px)',
      background: '#ffffff',
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(150px, 35vw, 280px), 1fr))',
          gap: 'clamp(30px, 6vw, 60px)',
          marginBottom: 'clamp(40px, 6vw, 80px)',
        }}>
          {/* PRODUCTS */}
          <div>
            <h4 style={{ 
              fontSize: 'clamp(11px, 2.5vw, 12px)', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.8px',
              marginBottom: 'clamp(12px, 3vw, 20px)',
              color: '#000',
            }}>
              Products
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 12px)' }}>
              <Link href="/collections/smoothies" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#000'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; }}>
                Smoothies
              </Link>
              <Link href="/collections/high-protein" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                High Protein
              </Link>
              <Link href="/collections/breakfast-bowls" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Breakfast Bowls
              </Link>
              <Link href="/collections/bites" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Bites
              </Link>
              <Link href="/collections/protein-shop" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Protein Shop
              </Link>
              <Link href="/collections/best-sellers" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Best Sellers
              </Link>
            </div>
          </div>

          {/* COLLECTIONS */}
          <div>
            <h4 style={{ 
              fontSize: 'clamp(11px, 2.5vw, 12px)', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.8px',
              marginBottom: 'clamp(12px, 3vw, 20px)',
              color: '#000',
            }}>
              Collections
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 12px)' }}>
              <Link href="/collections/new-arrivals" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                New Arrivals
              </Link>
              <Link href="/collections/smoothie-boxes" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Smoothie Boxes
              </Link>
              <Link href="/collections/gift-guide" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Gift Guide
              </Link>
              <Link href="/shop-all" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Shop All
              </Link>
            </div>
          </div>

          {/* LEARN */}
          <div>
            <h4 style={{ 
              fontSize: 'clamp(11px, 2.5vw, 12px)', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.8px',
              marginBottom: 'clamp(12px, 3vw, 20px)',
              color: '#000',
            }}>
              Learn
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 12px)' }}>
              <Link href="/our-story" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Our Story
              </Link>
              <Link href="/blog" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Blog & Recipes
              </Link>
              <Link href="/contact" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Contact
              </Link>
              <Link href="/faq" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                FAQ
              </Link>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h4 style={{ 
              fontSize: 'clamp(11px, 2.5vw, 12px)', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.8px',
              marginBottom: 'clamp(12px, 3vw, 20px)',
              color: '#000',
            }}>
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 12px)' }}>
              <Link href="/careers" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Careers
              </Link>
              <Link href="/refer" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Referral Program
              </Link>
              <Link href="/student-discount" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Student Discount
              </Link>
            </div>
          </div>

          {/* LEGAL */}
          <div>
            <h4 style={{ 
              fontSize: 'clamp(11px, 2.5vw, 12px)', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.8px',
              marginBottom: 'clamp(12px, 3vw, 20px)',
              color: '#000',
            }}>
              Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 12px)' }}>
              <Link href="/privacy" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Privacy Policy
              </Link>
              <Link href="/terms" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#666', textDecoration: 'none', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto clamp(30px, 6vw, 60px)',
          paddingBottom: 'clamp(30px, 6vw, 60px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          textAlign: 'center',
        }}>
          <h3 style={{
            fontSize: 'clamp(20px, 5vw, 28px)',
            fontWeight: '600',
            marginBottom: 'clamp(8px, 2vw, 12px)',
            letterSpacing: '-0.4px',
          }}>
            Subscribe
          </h3>
          <p style={{
            fontSize: 'clamp(12px, 3vw, 14px)',
            color: '#666',
            marginBottom: 'clamp(16px, 4vw, 24px)',
            lineHeight: '1.7',
          }}>
            Get wellness updates and exclusive offers
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
        <div className="footer-copyright" style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'clamp(16px, 3vw, 24px)',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          paddingTop: 'clamp(12px, 3vw, 20px)',
        }}>
          <p style={{
            fontSize: 'clamp(11px, 2.5vw, 13px)',
            color: '#999',
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
            <Link href="#" style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: '#999', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
              Facebook
            </Link>
            <Link href="#" style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: '#999', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
              Instagram
            </Link>
            <Link href="#" style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: '#999', transition: 'all 1s cubic-bezier(0.32, 0, 0.67, 0)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
