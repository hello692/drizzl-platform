import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid #e8e8e8',
      padding: '140px 60px 60px 60px',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '80px',
          marginBottom: '100px',
        }}>
          {/* SHOP */}
          <div>
            <h4 style={{ 
              fontSize: '11px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '1.2px',
              marginBottom: '28px',
              color: '#000',
            }}>
              Shop
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Link href="/products/smoothies" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Smoothies
              </Link>
              <Link href="/products/high-protein" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                High protein smoothies
              </Link>
              <Link href="/products/bowls" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Breakfast bowls
              </Link>
              <Link href="/products/bites" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Bites
              </Link>
              <Link href="/products/protein" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Protein shop
              </Link>
              <Link href="/products/boxes" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Smoothie boxes
              </Link>
              <Link href="/products/gift" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Gift Guide
              </Link>
            </div>
          </div>

          {/* LEARN */}
          <div>
            <h4 style={{ 
              fontSize: '11px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '1.2px',
              marginBottom: '28px',
              color: '#000',
            }}>
              Learn
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Link href="/contact" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Contact us
              </Link>
              <Link href="/faq" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                FAQs
              </Link>
              <Link href="/our-story" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Our story
              </Link>
              <Link href="#" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Our theory of change
              </Link>
              <Link href="/blog" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Blog & recipes
              </Link>
              <Link href="/careers" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Careers
              </Link>
              <Link href="#" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                HSA/FSA
              </Link>
            </div>
          </div>

          {/* SHARE */}
          <div>
            <h4 style={{ 
              fontSize: '11px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '1.2px',
              marginBottom: '28px',
              color: '#000',
            }}>
              Share
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Link href="/refer" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Refer a friend
              </Link>
              <Link href="#" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Corporate partnerships
              </Link>
              <Link href="/affiliates" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Affiliates
              </Link>
              <Link href="#" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Gift cards
              </Link>
              <Link href="/student-discount" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Student + educator discount
              </Link>
              <Link href="#" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Government discount
              </Link>
            </div>
          </div>

          {/* LEGAL */}
          <div>
            <h4 style={{ 
              fontSize: '11px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '1.2px',
              marginBottom: '28px',
              color: '#000',
            }}>
              Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Link href="/privacy" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Privacy Policy
              </Link>
              <Link href="/terms" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Terms of Service
              </Link>
              <Link href="/supply-chain-transparency" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Supply Chain Transparency
              </Link>
              <Link href="/supplier-code-of-conduct" style={{ fontSize: '14px', color: '#424245', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
                Supplier Code of Conduct
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto 80px',
          paddingBottom: '80px',
          borderBottom: '1px solid #e8e8e8',
          textAlign: 'center',
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '600',
            marginBottom: '16px',
            letterSpacing: '-0.6px',
          }}>
            Get updates
          </h3>
          <p style={{
            fontSize: '15px',
            color: '#424245',
            marginBottom: '32px',
            lineHeight: '1.8',
          }}>
            Subscribe to our newsletter for wellness tips, recipes, and exclusive offers.
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '14px 20px',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#f8f9fa',
              }}
            />
            <button style={{
              padding: '14px 32px',
              background: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Social + Copyright */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0',
        }}>
          <p style={{
            fontSize: '13px',
            color: '#79747e',
            letterSpacing: '-0.2px',
          }}>
            © 2025 Drizzl Wellness. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            gap: '28px',
          }}>
            <Link href="#" style={{ fontSize: '14px', color: '#424245', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
              Facebook
            </Link>
            <Link href="#" style={{ fontSize: '14px', color: '#424245', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
              Instagram
            </Link>
            <Link href="#" style={{ fontSize: '14px', color: '#424245', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
              Twitter
            </Link>
            <Link href="#" style={{ fontSize: '14px', color: '#424245', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = '#424245'}>
              TikTok
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
