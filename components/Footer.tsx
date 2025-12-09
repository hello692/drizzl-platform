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
                High-Protein Heroes
              </Link>
              <Link href="/collections/best-sellers" className="footer-link">
                Fan Favorites
              </Link>
              <Link href="/collections" className="footer-link">
                Curated Collections
              </Link>
              <Link href="/collections/new-arrivals" className="footer-link">
                Fresh Finds (New Arrivals)
              </Link>
              <Link href="/collections/smoothie-boxes" className="footer-link">
                Smoothie Bundles
              </Link>
              <Link href="/collections/gift-guide" className="footer-link">
                Gifting Made Easy
              </Link>
              <Link href="/shop-all" className="footer-link">
                Shop Everything
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Discover</h4>
            <div className="footer-links">
              <Link href="/our-story" className="footer-link">
                Our Story
              </Link>
              <Link href="/blog" className="footer-link">
                Blog & Recipes
              </Link>
              <Link href="/contact" className="footer-link">
                Get in Touch
              </Link>
              <Link href="/faq" className="footer-link">
                FAQs
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Work With Us</h4>
            <div className="footer-links">
              <Link href="/careers" className="footer-link">
                Careers
              </Link>
              <Link href="/refer" className="footer-link">
                Spread the Love (Referral Program)
              </Link>
              <Link href="/student-discount" className="footer-link">
                Student Perks
              </Link>
              <Link href="/wholesale/apply" className="footer-link">
                Wholesale Opportunities
              </Link>
              <Link href="/auth?type=retail" className="footer-link">
                Partner with Us
              </Link>
              <Link href="/wholesale/contact" className="footer-link">
                B2B Pricing & Contact
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">The Fine Print</h4>
            <div className="footer-links">
              <Link href="/privacy" className="footer-link">
                Privacy Policy
              </Link>
              <Link href="/terms" className="footer-link">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-newsletter-section">
          <div className="footer-newsletter-content">
            <h3 className="footer-newsletter-title">Stay in the Loop</h3>
            <p className="footer-newsletter-text">
              Sip on wellness tips, exclusive deals, and a little smoothie inspiration—straight to your inbox.
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
          <div className="footer-social">
            <Link href="#" className="footer-social-link">
              Facebook
            </Link>
            <Link href="#" className="footer-social-link">
              Instagram
            </Link>
            <Link href="#" className="footer-social-link">
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
