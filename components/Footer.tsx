import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: '#f9f9f9',
      borderTop: '1px solid #e8e8e8',
      padding: '80px 40px 40px 40px',
    }}>
      <div style={{
        maxWidth: '1280px',
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
              fontSize: '11px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              marginBottom: '20px',
              color: '#000',
            }}>
              Shop
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/products/smoothies" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Smoothies
              </Link>
              <Link href="/products/high-protein" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                High protein smoothies
              </Link>
              <Link href="/products/bowls" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Breakfast bowls
              </Link>
              <Link href="/products/bites" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Bites
              </Link>
              <Link href="/products/protein" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Protein shop
              </Link>
              <Link href="/products/boxes" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Smoothie boxes
              </Link>
              <Link href="/products/gift" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
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
              letterSpacing: '1px',
              marginBottom: '20px',
              color: '#000',
            }}>
              Learn
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/contact" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Contact us
              </Link>
              <Link href="/faq" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                FAQs
              </Link>
              <Link href="/our-story" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Our story
              </Link>
              <Link href="#" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Our theory of change
              </Link>
              <Link href="/blog" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Blog & recipes
              </Link>
              <Link href="/careers" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Careers
              </Link>
              <Link href="#" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
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
              letterSpacing: '1px',
              marginBottom: '20px',
              color: '#000',
            }}>
              Share
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/refer" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Refer a friend
              </Link>
              <Link href="#" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Corporate partnerships
              </Link>
              <Link href="/affiliates" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Affiliates
              </Link>
              <Link href="#" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Gift cards
              </Link>
              <Link href="/student-discount" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Student + educator discount
              </Link>
              <Link href="#" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Government discount
              </Link>
              <Link href="#" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>
                Store locator
              </Link>
            </div>
          </div>

          {/* LET'S STAY IN TOUCH */}
          <div>
            <h4 style={{ 
              fontSize: '11px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              marginBottom: '20px',
              color: '#000',
            }}>
              Let's stay in touch
            </h4>
            <p style={{
              fontSize: '13px',
              color: '#666',
              marginBottom: '20px',
              lineHeight: '1.6',
            }}>
              We'll tell you first when we launch something new—and you can keep an eye out for unexpected offers, surprise merch, fun stuff and emails that will make you laugh.
            </p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="Email"
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '4px',
                    fontSize: '13px',
                    background: '#ffffff',
                  }}
                />
                <button
                  style={{
                    padding: '10px 16px',
                    background: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  SIGN UP
                </button>
              </div>
              <p style={{
                fontSize: '11px',
                color: '#999',
                margin: '0',
                lineHeight: '1.5',
              }}>
                By clicking 'sign up', you agree to our Terms of Service and consent to our Privacy Policy
              </p>
            </form>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
              <a href="#" style={{ fontSize: '16px' }}>f</a>
              <a href="#" style={{ fontSize: '16px' }}>📷</a>
              <a href="#" style={{ fontSize: '16px' }}>𝕏</a>
            </div>

            {/* App Store Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <img src="https://via.placeholder.com/120x40?text=Google+Play" alt="Google Play" style={{ height: '32px' }} />
              <img src="https://via.placeholder.com/120x40?text=App+Store" alt="App Store" style={{ height: '32px' }} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '40px', marginBottom: '40px' }} />

        {/* Bottom Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          {/* Logo */}
          <div style={{
            fontSize: '18px',
            fontWeight: '700',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            DRIZZL WELLNESS
          </div>

          {/* Legal Links */}
          <div style={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}>
            <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>
              © 2025 Drizzl Wellness
            </p>
            <Link href="/privacy" style={{ fontSize: '11px', color: '#666', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link href="/terms" style={{ fontSize: '11px', color: '#666', textDecoration: 'none' }}>
              Terms of Service
            </Link>
            <Link href="#" style={{ fontSize: '11px', color: '#666', textDecoration: 'none' }}>
              Supply Chain Transparency
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
