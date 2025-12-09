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
                Fresh Drops (New Arrivals)
              </Link>
              <Link href="/collections/smoothie-boxes" className="footer-link">
                Smoothie Kits
              </Link>
              <Link href="/collections/gift-guide" className="footer-link">
                Gifts That Blend Joy
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Discover</h4>
            <div className="footer-links">
              <Link href="/our-story" className="footer-link">
                Our Story (Spoiler: It's Delicious)
              </Link>
              <Link href="/blog" className="footer-link">
                Blog & Recipes (Sip, Blend, Repeat)
              </Link>
              <Link href="/store-locator" className="footer-link">
                Store Locator (Find Us Near You)
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Wholesale & Partnerships</h4>
            <div className="footer-links">
              <Link href="/wholesale/apply" className="footer-link">
                Big Ideas? Let's Collaborate
              </Link>
              <Link href="/wholesale/pricing" className="footer-link">
                Wholesale Opportunities
              </Link>
              <Link href="/auth?type=retail" className="footer-link">
                Partner Portal
              </Link>
              <Link href="/wholesale/contact" className="footer-link">
                B2B Pricing
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Join the Squad</h4>
            <div className="footer-links">
              <Link href="/careers" className="footer-link">
                Careers (Blend Your Talents Here)
              </Link>
              <Link href="/ambassadors" className="footer-link">
                Ambassadors & Affiliates (Spread the Crave)
              </Link>
              <Link href="/refer" className="footer-link">
                Referral Program
              </Link>
              <Link href="/student-discount" className="footer-link">
                Student Perks
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Support</h4>
            <div className="footer-links">
              <Link href="/faq" className="footer-link">
                FAQs (We've Got Answers)
              </Link>
              <Link href="/contact" className="footer-link">
                Contact Us (We're Here to Help)
              </Link>
              <Link href="/shipping" className="footer-link">
                Shipping & Returns (No Stress, Just Smoothies)
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
              Pour yourself a glass of wellness, exclusive offers, and smoothie inspo—delivered fresh to your inbox.
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
