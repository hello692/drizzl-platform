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
                THE RULES OF ENGAGEMENT
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
                <p style={{ marginBottom: '16px', fontSize: '1.1em', color: '#ffffff' }}>
                  Welcome to the inner circle.
                </p>
                <p style={{ marginBottom: '16px' }}>
                  These Terms govern your relationship with Drizzl Wellness (operated by Plantonica Inc.). By accessing our site, sipping our smoothies, or joining the club, you're agreeing to do business our way.
                </p>
                <p style={{ fontStyle: 'italic' }}>
                  If you don't agree with these terms, we can't be together. Please discontinue use immediately.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={150}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  1. Who Can Join (The Guest List)
                </h2>
                <p style={{ marginBottom: '16px' }}>
                  To play with us, you must be at least 18 years old.
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li style={{ marginBottom: '8px' }}><strong style={{ color: '#ffffff' }}>Household Use:</strong> If you're buying for your household, you represent that you have the authority to bind everyone under your roof to these terms.</li>
                  <li><strong style={{ color: '#ffffff' }}>Business Use:</strong> If you're buying for a business, you confirm you are authorized to make these decisions for the company.</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={200}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  2. Supplement Safety (Know Your Body)
                </h2>
                <p style={{ marginBottom: '16px' }}>
                  We sell potent wellness products. By purchasing our supplements, you promise us that:
                </p>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>You are 18+.</li>
                  <li style={{ marginBottom: '8px' }}>You are not pregnant or nursing (or have consulted a doctor first).</li>
                  <li style={{ marginBottom: '8px' }}>You don't have medical conditions that make these ingredients unsafe.</li>
                  <li>You understand these products are not intended to diagnose, treat, cure, or prevent disease.</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={250}>
              <div style={{
                marginBottom: '32px',
                background: 'rgba(255, 200, 100, 0.05)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 200, 100, 0.1)',
              }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  3. Binding Arbitration (Let's Keep It Civil)
                </h2>
                <p style={{ marginBottom: '16px', fontWeight: 600, color: '#ffffff' }}>
                  IMPORTANT: We believe in resolving issues efficiently.
                </p>
                <p style={{ marginBottom: '16px' }}>
                  By using Drizzl Wellness, you agree that all disputes will be resolved by individual binding arbitration administered by JAMS, not in court.
                </p>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}><strong style={{ color: '#ffffff' }}>No Judge or Jury:</strong> An arbitrator will decide.</li>
                  <li style={{ marginBottom: '8px' }}><strong style={{ color: '#ffffff' }}>No Class Actions:</strong> We handle things one-on-one.</li>
                  <li><strong style={{ color: '#ffffff' }}>Opt-Out:</strong> You have 30 days to opt-out by writing to us at: Plantonica Inc., 1395 Brickell Avenue, Miami, FL 33131 USA.</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={300}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  4. What We Offer
                </h2>
                <p>
                  We provide premium frozen plant-based smoothies, functional beverages, and wellness content. We deliver them to your door. We reserve the right to change our menu, pricing, or services at any time. Evolution is natural.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={350}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  5. Money Matters (Billing & Subscriptions)
                </h2>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}><strong style={{ color: '#ffffff' }}>Subscriptions:</strong> If you subscribe, you authorize us to charge you automatically until you cancel. It's a relationship, but you can leave anytime.</li>
                  <li><strong style={{ color: '#ffffff' }}>Payments:</strong> Prices, taxes, and shipping are subject to change. If a payment fails, we may pause your shipments.</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={400}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  6. Handle with Care (Shipping & Safety)
                </h2>
                <p style={{ marginBottom: '16px' }}>
                  Our products arrive frozen.
                </p>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}><strong style={{ color: '#ffffff' }}>Dry Ice Warning:</strong> Your box may contain dry ice. It is -109°F. Do not touch it with bare hands.</li>
                  <li style={{ marginBottom: '8px' }}><strong style={{ color: '#ffffff' }}>Storage:</strong> Move your cups to the freezer immediately.</li>
                  <li><strong style={{ color: '#ffffff' }}>Allergens:</strong> We use nuts, seeds, and soy in our facility. Cross-contact may occur. You are responsible for reading labels and managing your own allergies.</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={450}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  7. Intellectual Property (Don't Steal Our Glow)
                </h2>
                <p>
                  Everything you see—our recipes, branding, logos, and vibe—belongs to Drizzl Wellness or our licensors. You can look, buy, and share on social, but you cannot copy or use our assets for commercial purposes without permission.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={500}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  8. User Content
                </h2>
                <p>
                  If you send us feedback, photos, or love letters, you grant us a perpetual, worldwide license to use that content. We love showing you off.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={550}>
              <div style={{
                marginBottom: '32px',
                background: 'rgba(255, 200, 100, 0.05)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 200, 100, 0.1)',
              }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  9. The "As Is" Clause (Disclaimers)
                </h2>
                <p style={{ marginBottom: '16px' }}>
                  We strive for perfection, but legally, we must state:
                </p>
                <p style={{ marginBottom: '16px', fontWeight: 600, color: '#ffffff' }}>
                  Our services and products are provided "As Is" and "As Available."
                </p>
                <p>
                  We disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement. Our content is for educational purposes and is not medical advice.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={600}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  10. Limitation of Liability
                </h2>
                <p>
                  To the maximum extent permitted by law, we are not liable for indirect or consequential damages. Our total liability is limited to the greater of $250 or what you paid us in the last 30 days.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={650}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  11. Indemnification
                </h2>
                <p>
                  You agree to hold Drizzl Wellness and Plantonica Inc. harmless from claims arising from your use of our products, your account activity, or your violation of these terms.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={700}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  12. Governing Law
                </h2>
                <p>
                  These terms are governed by the Federal Arbitration Act and the laws of the State of New York.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={750}>
              <div style={{
                marginBottom: '32px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '32px',
              }}>
                <h2 style={{ fontSize: 'var(--fs-h3)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  Cookie Policy
                </h2>
                <p>
                  We use cookies to make our site work smoothly, remember your preferences, and show you things you actually like. You can manage these in your browser settings, but turning them off might kill the vibe (and site functionality).
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={800}>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
                  Contact Us
                </h2>
                <p style={{ marginBottom: '16px' }}>
                  Questions? We're here for you.
                </p>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}>
                  <p style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#ffffff' }}>Email:</strong>{' '}
                    <a href="mailto:hello@drizzlwellness.com" style={{ color: '#ffffff', textDecoration: 'underline' }}>
                      hello@drizzlwellness.com
                    </a>
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: '#ffffff' }}>Address:</strong> Plantonica Inc., 1395 Brickell Avenue, Miami, FL 33131 USA
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
