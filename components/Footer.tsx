import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h4 className="footer-section-title">Shop</h4>
            <div className="footer-links">
              <Link href="/collections/smoothies" className="footer-link">
                Smoothies
              </Link>
              <Link href="/collections/high-protein" className="footer-link">
                Protein Power-Ups
              </Link>
              <Link href="/collections/best-sellers" className="footer-link">
                Fan Favorites
              </Link>
              <Link href="/collections/new-arrivals" className="footer-link">
                Fresh Drops
              </Link>
              <Link href="/collections/smoothie-boxes" className="footer-link">
                Smoothie Kits
              </Link>
              <Link href="/collections/gift-guide" className="footer-link">
                Gifts
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Discover</h4>
            <div className="footer-links">
              <Link href="/about" className="footer-link">
                About Us
              </Link>
              <Link href="/blog" className="footer-link">
                Blog & Recipes
              </Link>
              <Link href="/locations" className="footer-link">
                Store Locator
              </Link>
              <Link href="/sustainability" className="footer-link">
                Sustainability
              </Link>
              <Link href="/ingredients" className="footer-link">
                Ingredients
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Wholesale</h4>
            <div className="footer-links">
              <Link href="/wholesale" className="footer-link">
                Partner With Us
              </Link>
              <Link href="/wholesale/pricing" className="footer-link">
                Wholesale Pricing
              </Link>
              <Link href="/auth?type=retail" className="footer-link">
                Partner Portal
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Community</h4>
            <div className="footer-links">
              <Link href="/membership" className="footer-link">
                Wellness Club
              </Link>
              <Link href="/refer" className="footer-link">
                Referral Program
              </Link>
              <Link href="/ambassadors" className="footer-link">
                Ambassadors
              </Link>
              <Link href="/student-discount" className="footer-link">
                Student Perks
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Careers</h4>
            <div className="footer-links">
              <Link href="/careers" className="footer-link">
                Join Our Team
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Support</h4>
            <div className="footer-links">
              <Link href="/faq" className="footer-link">
                FAQs
              </Link>
              <Link href="/contact" className="footer-link">
                Contact Us
              </Link>
              <Link href="/shipping" className="footer-link">
                Shipping & Returns
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-newsletter-section">
          <div className="footer-newsletter-content">
            <h3 className="footer-newsletter-title">Stay in the Loop</h3>
            <p className="footer-newsletter-text">
              Exclusive offers and wellness tips delivered to your inbox.
            </p>
          </div>
          <div className="footer-newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="footer-newsletter-input"
            />
            <button className="footer-newsletter-btn">
              Subscribe
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 Drizzl Wellness. All rights reserved.
          </p>
          <div className="footer-legal-links">
            <Link href="/privacy" className="footer-legal-link">
              Privacy Policy
            </Link>
            <span className="footer-legal-separator">·</span>
            <Link href="/terms" className="footer-legal-link">
              Terms of Service
            </Link>
          </div>
          <div className="footer-social">
            <Link href="https://facebook.com/drizzlwellness" className="footer-social-link" target="_blank" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </Link>
            <Link href="https://instagram.com/drizzlwellness" className="footer-social-link" target="_blank" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </Link>
            <Link href="https://twitter.com/drizzlwellness" className="footer-social-link" target="_blank" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
