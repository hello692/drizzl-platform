import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { AnimatedSection } from '../../components/ScrollAnimations';

const BENEFITS = [
  { title: 'Competitive Margins', description: 'Attractive wholesale pricing designed to maximize your profit potential.' },
  { title: 'Reliable Delivery', description: 'Consistent, on-time delivery to keep your shelves stocked.' },
  { title: 'Marketing Support', description: 'Free POS materials, samples, and co-marketing opportunities.' },
  { title: 'Dedicated Rep', description: 'Personal account manager for all your partnership needs.' },
  { title: 'Training & Support', description: 'Staff training and product knowledge sessions.' },
  { title: 'Exclusive Products', description: 'Access to partner-only SKUs and limited editions.' },
];

export default function Wholesale() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    locations: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Wholesale inquiry:', formData);
    setSubmitted(true);
  };

  const inputStyles = {
    width: '100%',
    padding: '14px 16px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    fontSize: 'var(--fs-body)',
    color: '#ffffff',
    outline: 'none',
  };

  const labelStyles = {
    display: 'block',
    fontSize: 'var(--fs-small)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    marginBottom: '8px',
  };

  return (
    <>
      <Navbar hideCart hideSearch />
      
      <main style={{ background: '#000000', minHeight: '100vh', paddingTop: '120px' }}>
        <section style={{
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ marginBottom: 'clamp(32px, 5vw, 48px)' }}>
              <span style={{
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                PARTNER WITH US
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Big Ideas? Let's Collaborate
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
              }}>
                Join the Drizzl family and bring wellness to your customers. We make it easy to succeed together.
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '16px',
            marginBottom: 'clamp(48px, 8vw, 80px)',
          }}>
            {BENEFITS.map((benefit, index) => (
              <AnimatedSection key={benefit.title} animation="fadeUp" delay={index * 80}>
                <div style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '24px 20px',
                }}>
                  <h3 style={{
                    fontSize: 'var(--fs-h4)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}>
                    {benefit.title}
                  </h3>
                  <p style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--color-text-tertiary)',
                    lineHeight: 1.6,
                  }}>
                    {benefit.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section style={{
          background: '#0a0a0a',
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            gap: 'clamp(32px, 5vw, 60px)',
            alignItems: 'start',
          }}>
            <AnimatedSection animation="fadeUp">
              <div>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  marginBottom: '16px',
                }}>
                  Ready to Get Started?
                </h2>
                <p style={{
                  fontSize: 'var(--fs-body)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '32px',
                }}>
                  Fill out the form and our team will reach out within 48 hours.
                </p>
                
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>Email</p>
                  <p style={{ fontSize: 'var(--fs-body)', color: '#ffffff' }}>wholesale@drizzlwellness.com</p>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>Phone</p>
                  <p style={{ fontSize: 'var(--fs-body)', color: '#ffffff' }}>1-800-DRIZZL-1</p>
                </div>
                <Link 
                  href="/wholesale/pricing"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#ffffff',
                    fontSize: 'var(--fs-body)',
                    fontWeight: 500,
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.3)',
                    paddingBottom: '4px',
                  }}
                >
                  View Wholesale Pricing
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fadeUp" delay={100}>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                padding: 'clamp(24px, 4vw, 32px)',
              }}>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 500, color: '#ffffff', marginBottom: '12px' }}>Thank You</h3>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      We've received your inquiry and will be in touch within 48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyles}>Business Name</label>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        style={inputStyles}
                        placeholder="Your store or company name"
                      />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyles}>Contact Name</label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                        style={inputStyles}
                        placeholder="Your full name"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <label style={labelStyles}>Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          style={inputStyles}
                          placeholder="you@company.com"
                        />
                      </div>
                      <div>
                        <label style={labelStyles}>Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          style={inputStyles}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <label style={labelStyles}>Business Type</label>
                        <select
                          required
                          value={formData.businessType}
                          onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                          style={{ ...inputStyles, cursor: 'pointer' }}
                        >
                          <option value="" style={{ background: '#1a1a1a' }}>Select type...</option>
                          <option value="grocery" style={{ background: '#1a1a1a' }}>Grocery Store</option>
                          <option value="cafe" style={{ background: '#1a1a1a' }}>Cafe / Coffee Shop</option>
                          <option value="gym" style={{ background: '#1a1a1a' }}>Gym / Fitness Center</option>
                          <option value="restaurant" style={{ background: '#1a1a1a' }}>Restaurant</option>
                          <option value="hotel" style={{ background: '#1a1a1a' }}>Hotel / Hospitality</option>
                          <option value="corporate" style={{ background: '#1a1a1a' }}>Corporate / Office</option>
                          <option value="other" style={{ background: '#1a1a1a' }}>Other</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyles}>Number of Locations</label>
                        <select
                          value={formData.locations}
                          onChange={(e) => setFormData({...formData, locations: e.target.value})}
                          style={{ ...inputStyles, cursor: 'pointer' }}
                        >
                          <option value="" style={{ background: '#1a1a1a' }}>Select...</option>
                          <option value="1" style={{ background: '#1a1a1a' }}>1 location</option>
                          <option value="2-5" style={{ background: '#1a1a1a' }}>2-5 locations</option>
                          <option value="6-10" style={{ background: '#1a1a1a' }}>6-10 locations</option>
                          <option value="11-25" style={{ background: '#1a1a1a' }}>11-25 locations</option>
                          <option value="25+" style={{ background: '#1a1a1a' }}>25+ locations</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={labelStyles}>Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows={4}
                        style={{ ...inputStyles, resize: 'vertical' }}
                        placeholder="Tell us about your business..."
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: '#ffffff',
                        color: '#000000',
                        border: 'none',
                        borderRadius: '50px',
                        fontSize: 'var(--fs-body)',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      Submit Inquiry
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
