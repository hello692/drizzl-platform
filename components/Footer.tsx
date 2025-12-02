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
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
        marginBottom: '60px',
      }}>
        {/* Shop */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '16px' }}>
            Shop
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/products/smoothies" style={{ fontSize: '14px', color: '#666' }}>
              Smoothies
            </Link>
            <Link href="/products/high-protein" style={{ fontSize: '14px', color: '#666' }}>
              High Protein
            </Link>
            <Link href="/products/bowls" style={{ fontSize: '14px', color: '#666' }}>
              Breakfast Bowls
            </Link>
            <Link href="/products/bites" style={{ fontSize: '14px', color: '#666' }}>
              Bites
            </Link>
            <Link href="/products/gift-guide" style={{ fontSize: '14px', color: '#666' }}>
              Gift Guide
            </Link>
          </div>
        </div>

        {/* Learn */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '16px' }}>
            Learn
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/our-story" style={{ fontSize: '14px', color: '#666' }}>
              Our Story
            </Link>
            <Link href="/faq" style={{ fontSize: '14px', color: '#666' }}>
              FAQ
            </Link>
            <Link href="/blog" style={{ fontSize: '14px', color: '#666' }}>
              Blog & Recipes
            </Link>
            <Link href="/contact" style={{ fontSize: '14px', color: '#666' }}>
              Contact Us
            </Link>
            <Link href="/careers" style={{ fontSize: '14px', color: '#666' }}>
              Careers
            </Link>
          </div>
        </div>

        {/* Account */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '16px' }}>
            Account
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/account" style={{ fontSize: '14px', color: '#666' }}>
              My Account
            </Link>
            <Link href="/orders" style={{ fontSize: '14px', color: '#666' }}>
              Order History
            </Link>
            <Link href="/refer" style={{ fontSize: '14px', color: '#666' }}>
              Refer a Friend
            </Link>
            <Link href="/affiliates" style={{ fontSize: '14px', color: '#666' }}>
              Affiliates
            </Link>
            <Link href="/student-discount" style={{ fontSize: '14px', color: '#666' }}>
              Student Discount
            </Link>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '16px' }}>
            Legal
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/privacy" style={{ fontSize: '14px', color: '#666' }}>
              Privacy Policy
            </Link>
            <Link href="/terms" style={{ fontSize: '14px', color: '#666' }}>
              Terms of Service
            </Link>
            <Link href="/shipping" style={{ fontSize: '14px', color: '#666' }}>
              Shipping & Returns
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        borderTop: '1px solid #e8e8e8',
        paddingTop: '40px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#999',
      }}>
        <p style={{ margin: 0 }}>© 2024 Drizzl Wellness. All rights reserved.</p>
      </div>
    </footer>
  );
}
