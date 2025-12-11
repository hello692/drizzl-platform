import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AnimatedSection } from '../components/ScrollAnimations';

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      
      <main style={{ background: '#000000', minHeight: '100vh', paddingTop: '120px' }}>
        <section style={{
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ marginBottom: '48px' }}>
              <span style={{
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                LEGAL
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Terms of Service
              </h1>
              <p style={{
                fontSize: 'var(--fs-small)',
                color: 'var(--color-text-tertiary)',
              }}>
                Effective Date: December 2, 2025
              </p>
            </div>
          </AnimatedSection>

          <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            <AnimatedSection animation="fadeUp" delay={100}>
              <div style={{ marginBottom: '32px' }}>
                <p style={{ marginBottom: '16px' }}>
                  These Terms of Service ("Terms") govern your access to and use of the websites, mobile applications, digital platforms, content, products, subscriptions, and services operated by Drizzl Wellness, Inc., a brand operated by Plantonica Inc., together with its subsidiaries and affiliates (collectively, "Drizzl Wellness," "we," "us," or "our").
                </p>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}>
                  <p style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#ffffff' }}>Corporate Address:</strong><br />
                    Plantonica Inc.<br />
                    1395 Brickell Avenue<br />
                    Miami, FL 33131 USA
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: '#ffffff' }}>Official Support Contacts:</strong><br />
                    hello@drizzlwellness.com<br />
                    hello@plantonica.com
                  </p>
                </div>
                <p style={{ fontStyle: 'italic' }}>
                  By accessing, browsing, purchasing from, or using any part of the Services, you legally agree to be bound by these Terms.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={150}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  1. Legal Age, Capacity & Household Use
                </h2>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '8px' }}>You must be at least 18 years of age to use the Services or purchase any Products.</li>
                  <li style={{ marginBottom: '8px' }}>If you purchase Products for others in your household, you confirm that you have authority to accept these Terms on their behalf, including the binding arbitration and class-action waiver.</li>
                  <li>If you use the Services on behalf of a business entity, you represent that you are authorized to bind that entity.</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={200}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  2. Age-Restricted Supplement Commerce
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  Certain Products offered by Drizzl Wellness may be classified as dietary supplements. By purchasing supplements, you expressly certify:
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '8px' }}>You are at least 18 years old</li>
                  <li style={{ marginBottom: '8px' }}>You are not pregnant or nursing</li>
                  <li style={{ marginBottom: '8px' }}>You have no medical condition that would make consumption unsafe</li>
                  <li style={{ marginBottom: '8px' }}>You understand supplements are not intended to diagnose, treat, cure, or prevent disease</li>
                  <li>You have consulted a licensed healthcare professional if you have any uncertainty</li>
                </ul>
                <p>
                  Drizzl Wellness reserves the right to refuse, cancel, or restrict supplement sales at its sole discretion.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={250}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  3. Incorporated Policies
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  These Terms incorporate by reference:
                </p>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>Our Privacy Policy</li>
                  <li style={{ marginBottom: '8px' }}>Our Cookie Policy</li>
                  <li style={{ marginBottom: '8px' }}>Subscription, referral, promotional, loyalty, and gift card terms</li>
                  <li>Any policies displayed during checkout or digital use</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={300}>
              <div style={{
                marginBottom: '32px',
                background: 'rgba(255, 200, 100, 0.05)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 200, 100, 0.1)',
              }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  4. Binding Arbitration & Class Action Waiver
                </h2>
                <p style={{ marginBottom: '16px', fontWeight: 600, color: '#ffffff' }}>
                  ALL DISPUTES MUST BE RESOLVED BY INDIVIDUAL BINDING ARBITRATION, NOT IN COURT.
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '8px' }}>Administered by JAMS</li>
                  <li style={{ marginBottom: '8px' }}>Governed by the Federal Arbitration Act</li>
                  <li style={{ marginBottom: '8px' }}>No class actions</li>
                  <li style={{ marginBottom: '8px' }}>No jury trials</li>
                  <li>30-day right to opt-out by mailing written notice to: Plantonica Inc., 1395 Brickell Avenue, Miami, FL 33131 USA</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={350}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  5. Modifications
                </h2>
                <p>
                  We may update these Terms at any time. Continued use constitutes acceptance. If you do not agree, you must discontinue use immediately.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={400}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  6. Description of Services
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  Drizzl Wellness provides:
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '8px' }}>Frozen plant-based smoothies</li>
                  <li style={{ marginBottom: '8px' }}>Functional wellness beverages</li>
                  <li style={{ marginBottom: '8px' }}>Dietary supplements</li>
                  <li style={{ marginBottom: '8px' }}>One-time and subscription purchases</li>
                  <li style={{ marginBottom: '8px' }}>Digital nutritional content and education</li>
                  <li>Home delivery fulfillment</li>
                </ul>
                <p>
                  We may modify, substitute, or discontinue Products or Services at any time.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={450}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  7. Account Responsibility & Security
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  You are responsible for:
                </p>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>Safeguarding login credentials</li>
                  <li style={{ marginBottom: '8px' }}>All account activity</li>
                  <li>Immediately reporting unauthorized use</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={500}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  8. Electronic & SMS Communications
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  You consent to receive:
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '8px' }}>Transactional emails</li>
                  <li style={{ marginBottom: '8px' }}>Account notices</li>
                  <li style={{ marginBottom: '8px' }}>Support communications</li>
                  <li style={{ marginBottom: '8px' }}>Promotional communications (opt-out available)</li>
                  <li>SMS alerts (message rates may apply)</li>
                </ul>
                <p>
                  Reply STOP at any time to opt-out of SMS.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={550}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  9. Purchases, Subscriptions & Billing
                </h2>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>Subscriptions renew automatically unless canceled</li>
                  <li style={{ marginBottom: '8px' }}>You authorize recurring billing</li>
                  <li style={{ marginBottom: '8px' }}>Prices, taxes, shipping, and availability may change</li>
                  <li>Failed payments may result in suspension or cancellation</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={600}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  10. Shipping, Delivery & Food Safety
                </h2>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>Products ship frozen</li>
                  <li style={{ marginBottom: '8px' }}>Must be stored below 0°F immediately upon delivery</li>
                  <li style={{ marginBottom: '8px' }}>Products may contain allergens and cross-contact may occur</li>
                  <li style={{ marginBottom: '8px' }}>Dry ice is hazardous and must not be handled directly</li>
                  <li>You assume full responsibility for preparation, storage, and consumption</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={650}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  11. No Resale
                </h2>
                <p>
                  Products are for personal use only. Commercial resale is prohibited.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={700}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  12. Returns & Accommodations
                </h2>
                <p>
                  All accommodations are issued at our sole discretion. Contact: hello@drizzlwellness.com
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={750}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  13. Intellectual Property
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  All branding, logos, designs, recipes, software, visuals, text, and trademarks are the exclusive property of Drizzl Wellness or its licensors.
                </p>
                <p>
                  Unauthorized use is prohibited.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={800}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  14. User Content & Feedback
                </h2>
                <p>
                  You grant Drizzl Wellness a perpetual, irrevocable, royalty-free, fully sublicensable worldwide license to use all content and feedback you submit for any purpose.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={850}>
              <div style={{
                marginBottom: '32px',
                background: 'rgba(255, 200, 100, 0.05)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 200, 100, 0.1)',
              }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  15. Global Disclaimers (Food + Supplements)
                </h2>
                <p style={{ marginBottom: '16px', fontWeight: 600, color: '#ffffff' }}>
                  ALL PRODUCTS AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE."
                </p>
                <p style={{ marginBottom: '12px' }}>
                  We disclaim all warranties including:
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '8px' }}>MERCHANTABILITY</li>
                  <li style={{ marginBottom: '8px' }}>FITNESS FOR A PARTICULAR PURPOSE</li>
                  <li>NON-INFRINGEMENT</li>
                </ul>
                <p>
                  Nutritional and supplement information is for informational purposes only and does not constitute medical advice.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={900}>
              <div style={{
                marginBottom: '32px',
                background: 'rgba(255, 200, 100, 0.05)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 200, 100, 0.1)',
              }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  16. Limitation of Liability
                </h2>
                <p style={{ marginBottom: '12px', fontWeight: 600, color: '#ffffff' }}>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                </p>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>We are not liable for any indirect, incidental, consequential, special, exemplary, or punitive damages</li>
                  <li style={{ marginBottom: '8px' }}>Total liability shall not exceed the greater of $250 or the amount paid in the prior 30 days</li>
                  <li>You waive all rights under California Civil Code §1542</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={950}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  17. Indemnification
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  You agree to indemnify and hold harmless Drizzl Wellness and Plantonica Inc. from all claims arising from:
                </p>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>Product misuse</li>
                  <li style={{ marginBottom: '8px' }}>Account use</li>
                  <li style={{ marginBottom: '8px' }}>Violations of law</li>
                  <li>User content submissions</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={1000}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  18. Governing Law & Venue
                </h2>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>Governed by the Federal Arbitration Act</li>
                  <li style={{ marginBottom: '8px' }}>Substantive law: State of New York</li>
                  <li>Venue for non-arbitrable claims: New York County, NY</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={1050}>
              <div style={{
                marginBottom: '32px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '32px',
              }}>
                <h2 style={{ fontSize: 'var(--fs-h3)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  Cookie Policy
                </h2>
                <p style={{ marginBottom: '12px' }}>
                  Drizzl Wellness uses cookies and similar technologies to:
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '8px' }}>Operate and secure the website</li>
                  <li style={{ marginBottom: '8px' }}>Enhance user experience</li>
                  <li style={{ marginBottom: '8px' }}>Perform analytics and performance tracking</li>
                  <li>Support marketing and personalization</li>
                </ul>
                <p>
                  You can manage cookie preferences through your browser settings. Note that disabling certain cookies may limit functionality.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={1100}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  Contact Us
                </h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at hello@drizzlwellness.com.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
