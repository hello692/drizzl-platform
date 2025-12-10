import PageLayout, { PageHero, PageSection, SectionHeader, AnimatedSection } from '../../components/PageLayout';
import Link from 'next/link';
import { useState } from 'react';

const BENEFITS = [
  { icon: '💰', title: 'Competitive Margins', description: 'Attractive wholesale pricing designed to maximize your profit potential.' },
  { icon: '🚚', title: 'Reliable Delivery', description: 'Consistent, on-time delivery to keep your shelves stocked.' },
  { icon: '📈', title: 'Marketing Support', description: 'Free POS materials, samples, and co-marketing opportunities.' },
  { icon: '🤝', title: 'Dedicated Rep', description: 'Personal account manager for all your partnership needs.' },
  { icon: '🎯', title: 'Training & Support', description: 'Staff training and product knowledge sessions.' },
  { icon: '⭐', title: 'Exclusive Products', description: 'Access to partner-only SKUs and limited editions.' },
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

  return (
    <PageLayout>
      <PageHero
        badge="Partner With Us"
        badgeColor="linear-gradient(135deg, #6B5CE7, #00C9A7)"
        title="Big Ideas? Let's Collaborate"
        subtitle="Join the Drizzl family and bring wellness to your customers."
      />
      
      <PageSection background="white">
        <SectionHeader
          centered
          title="Why Partner With Drizzl?"
          subtitle="We make it easy to succeed together"
        />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {BENEFITS.map((benefit, index) => (
            <AnimatedSection key={benefit.title} animation="fadeUp" delay={index * 100}>
              <div className="tiktok-card" style={{ height: '100%' }}>
                <span style={{ fontSize: '40px', display: 'block', marginBottom: '16px' }}>{benefit.icon}</span>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{benefit.title}</h3>
                <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6' }}>{benefit.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </PageSection>

      <PageSection background="cream">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
          <div>
            <SectionHeader
              title="Ready to Get Started?"
              subtitle="Fill out the form and our team will reach out within 48 hours."
            />
            
            <div style={{ marginTop: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#6B5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px' }}>📧</div>
                <div>
                  <p style={{ fontWeight: '600', margin: 0 }}>Email Us</p>
                  <p style={{ color: '#666', margin: 0 }}>wholesale@drizzlwellness.com</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#00C9A7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px' }}>📞</div>
                <div>
                  <p style={{ fontWeight: '600', margin: 0 }}>Call Us</p>
                  <p style={{ color: '#666', margin: 0 }}>1-800-DRIZZL-1</p>
                </div>
              </div>
              <Link 
                href="/wholesale/pricing"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#6B5CE7',
                  fontWeight: '600',
                  textDecoration: 'none',
                  marginTop: '16px',
                }}
              >
                View Wholesale Pricing
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
          
          <AnimatedSection animation="fadeUp">
            <div className="tiktok-card" style={{ padding: '32px' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <span style={{ fontSize: '64px', display: 'block', marginBottom: '24px' }}>🎉</span>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Thank You!</h3>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>
                    We've received your inquiry and will be in touch within 48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Business Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }}
                      placeholder="Your store or company name"
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                      style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }}
                      placeholder="Your full name"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }}
                        placeholder="you@company.com"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Business Type *</label>
                      <select
                        required
                        value={formData.businessType}
                        onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                        style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px', background: '#fff' }}
                      >
                        <option value="">Select type...</option>
                        <option value="grocery">Grocery Store</option>
                        <option value="cafe">Cafe / Coffee Shop</option>
                        <option value="gym">Gym / Fitness Center</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="hotel">Hotel / Hospitality</option>
                        <option value="corporate">Corporate / Office</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Number of Locations</label>
                      <select
                        value={formData.locations}
                        onChange={(e) => setFormData({...formData, locations: e.target.value})}
                        style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px', background: '#fff' }}
                      >
                        <option value="">Select...</option>
                        <option value="1">1 location</option>
                        <option value="2-5">2-5 locations</option>
                        <option value="6-10">6-10 locations</option>
                        <option value="11-25">11-25 locations</option>
                        <option value="25+">25+ locations</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={4}
                      style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px', resize: 'vertical' }}
                      placeholder="Tell us about your business and partnership goals..."
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #6B5CE7, #00C9A7)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </PageSection>
    </PageLayout>
  );
}
