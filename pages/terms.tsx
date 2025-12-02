import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfService() {
  return (
    <div style={{ background: '#ffffff' }}>
      <Navbar />
      
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 40px',
      }}>
        {/* Hero Section */}
        <div style={{
          marginBottom: '60px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '16px',
            fontFamily: "'DM Sans', sans-serif",
            color: '#000',
          }}>
            Terms of Service
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#999',
          }}>
            Effective Date: February 5, 2025
          </p>
        </div>

        {/* Content */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.8',
          color: '#333',
        }}>
          {/* Intro */}
          <p style={{
            fontSize: '16px',
            marginBottom: '24px',
            color: '#666',
          }}>
            These Terms of Service ("Terms") govern your access to and use of the websites, mobile applications, digital platforms, content, products, subscriptions, and services operated by Drizzl Wellness, Inc., a brand operated by Plantonica Inc., together with its subsidiaries and affiliates (collectively, "Drizzl Wellness," "we," "us," or "our").
          </p>

          <div style={{
            background: '#f9f9f9',
            padding: '20px',
            borderRadius: '4px',
            marginBottom: '40px',
            fontSize: '14px',
            color: '#666',
          }}>
            <p style={{ marginBottom: '12px', margin: 0 }}>
              <strong>Corporate Address:</strong><br />
              Plantonica Inc.<br />
              1395 Brickell Avenue<br />
              Miami, FL 33131 USA
            </p>
            <p style={{ marginBottom: '12px', margin: '12px 0 0 0' }}>
              <strong>Official Support Contacts:</strong><br />
              hello@drizzlwellness.com<br />
              hello@plantonica.com
            </p>
          </div>

          <p style={{
            fontSize: '16px',
            marginBottom: '40px',
            color: '#666',
            fontStyle: 'italic',
          }}>
            By accessing, browsing, purchasing from, or using any part of the Services, you legally agree to be bound by these Terms.
          </p>

          {/* 1. Legal Age, Capacity & Household Use */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              1. Legal Age, Capacity & Household Use
            </h2>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
              marginBottom: '16px',
            }}>
              <li style={{ marginBottom: '12px' }}>You must be at least 18 years of age to use the Services or purchase any Products.</li>
              <li style={{ marginBottom: '12px' }}>If you purchase Products for others in your household, you confirm that you have authority to accept these Terms on their behalf, including the binding arbitration and class-action waiver.</li>
              <li>If you use the Services on behalf of a business entity, you represent that you are authorized to bind that entity.</li>
            </ul>
          </div>

          {/* 2. Age-Restricted Supplement Commerce */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              2. Age-Restricted Supplement Commerce (Mandatory)
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#666',
            }}>
              Certain Products offered by Drizzl Wellness may be classified as dietary supplements.
            </p>
            <p style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#666',
              fontWeight: '600',
            }}>
              By purchasing supplements, you expressly certify:
            </p>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
              marginBottom: '16px',
            }}>
              <li style={{ marginBottom: '8px' }}>You are at least 18 years old</li>
              <li style={{ marginBottom: '8px' }}>You are not pregnant or nursing</li>
              <li style={{ marginBottom: '8px' }}>You have no medical condition that would make consumption unsafe</li>
              <li style={{ marginBottom: '8px' }}>You understand supplements are not intended to diagnose, treat, cure, or prevent disease</li>
              <li>You have consulted a licensed healthcare professional if you have any uncertainty</li>
            </ul>
            <p style={{
              fontSize: '16px',
              color: '#666',
            }}>
              Drizzl Wellness reserves the right to refuse, cancel, or restrict supplement sales at its sole discretion.
            </p>
          </div>

          {/* 3. Incorporated Policies */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              3. Incorporated Policies
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#666',
              fontWeight: '600',
            }}>
              These Terms incorporate by reference:
            </p>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
            }}>
              <li style={{ marginBottom: '8px' }}>Our Privacy Policy</li>
              <li style={{ marginBottom: '8px' }}>Our Cookie Policy</li>
              <li style={{ marginBottom: '8px' }}>Subscription, referral, promotional, loyalty, and gift card terms</li>
              <li>Any policies displayed during checkout or digital use</li>
            </ul>
          </div>

          {/* 4. Binding Arbitration */}
          <div style={{ marginBottom: '40px', background: '#fff8f0', padding: '20px', borderRadius: '4px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              4. Binding Arbitration & Class Action Waiver (Global Standard)
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '16px',
              color: '#000',
              fontWeight: '700',
            }}>
              ALL DISPUTES MUST BE RESOLVED BY INDIVIDUAL BINDING ARBITRATION, NOT IN COURT.
            </p>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
              marginBottom: '16px',
            }}>
              <li style={{ marginBottom: '8px' }}>Administered by JAMS</li>
              <li style={{ marginBottom: '8px' }}>Governed by the Federal Arbitration Act</li>
              <li style={{ marginBottom: '8px' }}>No class actions</li>
              <li style={{ marginBottom: '8px' }}>No jury trials</li>
              <li>30-day right to opt-out by mailing written notice to: Plantonica Inc., 1395 Brickell Avenue, Miami, FL 33131 USA</li>
            </ul>
          </div>

          {/* 5. Modifications */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              5. Modifications
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
            }}>
              We may update these Terms at any time. Continued use constitutes acceptance. If you do not agree, you must discontinue use immediately.
            </p>
          </div>

          {/* 6. Description of Services */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              6. Description of Services
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#666',
              fontWeight: '600',
            }}>
              Drizzl Wellness provides:
            </p>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
              marginBottom: '16px',
            }}>
              <li style={{ marginBottom: '8px' }}>Frozen plant-based smoothies</li>
              <li style={{ marginBottom: '8px' }}>Functional wellness beverages</li>
              <li style={{ marginBottom: '8px' }}>Dietary supplements</li>
              <li style={{ marginBottom: '8px' }}>One-time and subscription purchases</li>
              <li style={{ marginBottom: '8px' }}>Digital nutritional content and education</li>
              <li>Home delivery fulfillment</li>
            </ul>
            <p style={{
              fontSize: '16px',
              color: '#666',
            }}>
              We may modify, substitute, or discontinue Products or Services at any time.
            </p>
          </div>

          {/* 7. Account Responsibility */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              7. Account Responsibility & Security
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#666',
              fontWeight: '600',
            }}>
              You are responsible for:
            </p>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
            }}>
              <li style={{ marginBottom: '8px' }}>Safeguarding login credentials</li>
              <li style={{ marginBottom: '8px' }}>All account activity</li>
              <li>Immediately reporting unauthorized use</li>
            </ul>
          </div>

          {/* 8. Electronic & SMS Communications */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              8. Electronic & SMS Communications
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#666',
              fontWeight: '600',
            }}>
              You consent to receive:
            </p>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
              marginBottom: '16px',
            }}>
              <li style={{ marginBottom: '8px' }}>Transactional emails</li>
              <li style={{ marginBottom: '8px' }}>Account notices</li>
              <li style={{ marginBottom: '8px' }}>Support communications</li>
              <li style={{ marginBottom: '8px' }}>Promotional communications (opt-out available)</li>
              <li>SMS alerts (message rates may apply)</li>
            </ul>
            <p style={{
              fontSize: '16px',
              color: '#666',
            }}>
              Reply STOP at any time to opt-out of SMS.
            </p>
          </div>

          {/* 9. Purchases, Subscriptions & Billing */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              9. Purchases, Subscriptions & Billing
            </h2>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
            }}>
              <li style={{ marginBottom: '8px' }}>Subscriptions renew automatically unless canceled</li>
              <li style={{ marginBottom: '8px' }}>You authorize recurring billing</li>
              <li style={{ marginBottom: '8px' }}>Prices, taxes, shipping, and availability may change</li>
              <li>Failed payments may result in suspension or cancellation</li>
            </ul>
          </div>

          {/* 10. Shipping, Delivery & Food Safety */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              10. Shipping, Delivery & Food Safety
            </h2>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
              marginBottom: '16px',
            }}>
              <li style={{ marginBottom: '8px' }}>Products ship frozen</li>
              <li style={{ marginBottom: '8px' }}>Must be stored below 0°F immediately upon delivery</li>
              <li style={{ marginBottom: '8px' }}>Products may contain allergens and cross-contact may occur</li>
              <li style={{ marginBottom: '8px' }}>Dry ice is hazardous and must not be handled directly</li>
              <li>You assume full responsibility for preparation, storage, and consumption</li>
            </ul>
          </div>

          {/* 11. No Resale */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              11. No Resale
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
            }}>
              Products are for personal use only. Commercial resale is prohibited.
            </p>
          </div>

          {/* 12. Returns & Accommodations */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              12. Returns & Accommodations
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
            }}>
              All accommodations are issued at our sole discretion. Contact: hello@drizzlwellness.com
            </p>
          </div>

          {/* 13. Intellectual Property */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              13. Intellectual Property
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#666',
            }}>
              All branding, logos, designs, recipes, software, visuals, text, and trademarks are the exclusive property of Drizzl Wellness or its licensors.
            </p>
            <p style={{
              fontSize: '16px',
              color: '#666',
            }}>
              Unauthorized use is prohibited.
            </p>
          </div>

          {/* 14. User Content & Feedback */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              14. User Content & Feedback
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
            }}>
              You grant Drizzl Wellness a perpetual, irrevocable, royalty-free, fully sublicensable worldwide license to use all content and feedback you submit for any purpose.
            </p>
          </div>

          {/* 15. Global Disclaimers */}
          <div style={{ marginBottom: '40px', background: '#fff8f0', padding: '20px', borderRadius: '4px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              15. Global Disclaimers (Food + Supplements)
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '16px',
              color: '#000',
              fontWeight: '700',
            }}>
              ALL PRODUCTS AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE."
            </p>
            <p style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#666',
              fontWeight: '600',
            }}>
              WE DISCLAIM ALL WARRANTIES INCLUDING:
            </p>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
              marginBottom: '16px',
            }}>
              <li style={{ marginBottom: '8px' }}>MERCHANTABILITY</li>
              <li style={{ marginBottom: '8px' }}>FITNESS FOR A PARTICULAR PURPOSE</li>
              <li>NON-INFRINGEMENT</li>
            </ul>
            <p style={{
              fontSize: '16px',
              color: '#666',
            }}>
              Nutritional and supplement information is for informational purposes only and does not constitute medical advice.
            </p>
          </div>

          {/* 16. Limitation of Liability */}
          <div style={{ marginBottom: '40px', background: '#fff8f0', padding: '20px', borderRadius: '4px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              16. Limitation of Liability
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#000',
              fontWeight: '700',
            }}>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
              marginBottom: '16px',
            }}>
              <li style={{ marginBottom: '8px' }}>WE ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES</li>
              <li style={{ marginBottom: '8px' }}>TOTAL LIABILITY SHALL NOT EXCEED THE GREATER OF $250 OR THE AMOUNT PAID IN THE PRIOR 30 DAYS</li>
              <li>YOU WAIVE ALL RIGHTS UNDER CALIFORNIA CIVIL CODE §1542</li>
            </ul>
          </div>

          {/* 17. Indemnification */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              17. Indemnification
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#666',
            }}>
              You agree to indemnify and hold harmless Drizzl Wellness and Plantonica Inc. from all claims arising from:
            </p>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
            }}>
              <li style={{ marginBottom: '8px' }}>Product misuse</li>
              <li style={{ marginBottom: '8px' }}>Account use</li>
              <li style={{ marginBottom: '8px' }}>Violations of law</li>
              <li>User content submissions</li>
            </ul>
          </div>

          {/* 18. Governing Law & Venue */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              18. Governing Law & Venue
            </h2>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
            }}>
              <li style={{ marginBottom: '8px' }}>Governed by the Federal Arbitration Act</li>
              <li style={{ marginBottom: '8px' }}>Substantive law: State of New York</li>
              <li>Venue for non-arbitrable claims: New York County, NY</li>
            </ul>
          </div>

          {/* Cookie Policy */}
          <div style={{ marginBottom: '40px', borderTop: '2px solid #e8e8e8', paddingTop: '40px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              Cookie Policy (Global)
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#666',
              fontWeight: '600',
            }}>
              Drizzl Wellness uses cookies and similar technologies to:
            </p>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
              marginBottom: '16px',
            }}>
              <li style={{ marginBottom: '8px' }}>Operate and secure the website</li>
              <li style={{ marginBottom: '8px' }}>Enhance user experience</li>
              <li style={{ marginBottom: '8px' }}>Perform analytics and performance tracking</li>
              <li>Support marketing and personalization</li>
            </ul>
            <p style={{
              fontSize: '16px',
              color: '#666',
            }}>
              You may control cookies through your browser settings. Disabling cookies may limit functionality.
            </p>
          </div>

          {/* GDPR & CCPA */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              GDPR & CCPA Data Rights Compliance
            </h2>
            <p style={{
              fontSize: '16px',
              marginBottom: '12px',
              color: '#666',
              fontWeight: '600',
            }}>
              You have the right to:
            </p>
            <ul style={{
              fontSize: '16px',
              color: '#666',
              marginLeft: '20px',
              marginBottom: '16px',
            }}>
              <li style={{ marginBottom: '8px' }}>Access your personal data</li>
              <li style={{ marginBottom: '8px' }}>Correct inaccurate data</li>
              <li style={{ marginBottom: '8px' }}>Delete your data</li>
              <li style={{ marginBottom: '8px' }}>Restrict processing</li>
              <li style={{ marginBottom: '8px' }}>Object to marketing</li>
              <li style={{ marginBottom: '8px' }}>Data portability</li>
              <li style={{ marginBottom: '8px' }}>Know what we collect and how it's used</li>
              <li style={{ marginBottom: '8px' }}>Opt-out of data sale or sharing</li>
              <li>Non-discrimination for exercising rights</li>
            </ul>
            <p style={{
              fontSize: '16px',
              color: '#666',
              marginBottom: '12px',
            }}>
              Requests must be submitted to: hello@plantonica.com
            </p>
            <p style={{
              fontSize: '16px',
              color: '#666',
            }}>
              Verification may be required.
            </p>
          </div>

          {/* 19. Accessibility */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              19. Accessibility
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
            }}>
              If you require accessibility assistance: hello@drizzlwellness.com
            </p>
          </div>

          {/* 20. Entire Agreement */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '16px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#000',
            }}>
              20. Entire Agreement
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
            }}>
              These Terms constitute the entire legal agreement between you and Drizzl Wellness regarding the Services.
            </p>
          </div>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid #e8e8e8',
            paddingTop: '40px',
            marginTop: '60px',
            fontSize: '14px',
            color: '#999',
            textAlign: 'center',
          }}>
            <p>© 2025 Drizzl Wellness, Inc.</p>
            <p>A brand operated by Plantonica Inc.</p>
            <p>1395 Brickell Avenue, Miami, FL 33131 USA</p>
            <p>All Rights Reserved.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
