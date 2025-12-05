import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h4 className="footer-section-title">Products</h4>
            <div className="footer-links">
              <Link href="/collections/smoothies" className="footer-link">
                Smoothies
              </Link>
              <Link href="/collections/high-protein" className="footer-link">
                High Protein
              </Link>
              <Link href="/collections/best-sellers" className="footer-link">
                Best Sellers
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Collections</h4>
            <div className="footer-links">
              <Link href="/collections/new-arrivals" className="footer-link">
                New Arrivals
              </Link>
              <Link href="/collections/smoothie-boxes" className="footer-link">
                Smoothie Boxes
              </Link>
              <Link href="/collections/gift-guide" className="footer-link">
                Gift Guide
              </Link>
              <Link href="/shop-all" className="footer-link">
                Shop All
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Learn</h4>
            <div className="footer-links">
              <Link href="/our-story" className="footer-link">
                Our Story
              </Link>
              <Link href="/blog" className="footer-link">
                Blog & Recipes
              </Link>
              <Link href="/contact" className="footer-link">
                Contact
              </Link>
              <Link href="/faq" className="footer-link">
                FAQ
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Company</h4>
            <div className="footer-links">
              <Link href="/careers" className="footer-link">
                Careers
              </Link>
              <Link href="/refer" className="footer-link">
                Referral Program
              </Link>
              <Link href="/student-discount" className="footer-link">
                Student Discount
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Legal</h4>
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
          <h3 className="footer-newsletter-title">Stay in the Loop</h3>
          <p className="footer-newsletter-text">
            Get wellness updates and exclusive offers.
          </p>
          <div className="footer-newsletter-form">
            <input
              type="email"
              placeholder="Email"
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
