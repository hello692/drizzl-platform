import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { AnimatedSection } from '../components/ScrollAnimations';

const BENEFITS = [
  { title: '15% Commission', description: 'Earn on every sale made through your unique referral link.' },
  { title: 'Free Products', description: 'Monthly smoothie drops to keep you fueled and inspired.' },
  { title: 'Exclusive Discount Code', description: 'Your own code to share with your community (they save 20%).' },
  { title: 'Marketing Materials', description: 'Professional photos, graphics, and content to share.' },
  { title: 'Community Access', description: 'Join our private ambassador community for support and tips.' },
  { title: 'Early Access', description: 'Be the first to try and promote new flavors.' },
];

const AMBASSADORS = [
  { name: 'Jessica M.', handle: '@jessicafitness', quote: 'Sharing Drizzl has been so easy—my followers love it.' },
  { name: 'Marcus T.', handle: '@marcustrains', quote: 'The perfect fuel for my workouts. And I earn while I share.' },
  { name: 'Elena R.', handle: '@elenawellness', quote: 'Finally a brand I can authentically promote. Love Drizzl.' },
];

export default function Ambassadors() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instagram: '',
    tiktok: '',
    followers: '',
    why: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <Navbar />
      
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
                JOIN THE TEAM
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Spread the Crave
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
              }}>
                Become a Drizzl Ambassador and turn your passion into profit. Share what you love, earn what you deserve.
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
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
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeUp">
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  marginBottom: '12px',
                }}>
                  Meet Our Ambassadors
                </h2>
                <p style={{
                  fontSize: 'var(--fs-body)',
                  color: 'var(--color-text-secondary)',
                }}>
                  Join an amazing community of wellness advocates
                </p>
              </div>
            </AnimatedSection>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}>
              {AMBASSADORS.map((ambassador, index) => (
                <AnimatedSection key={ambassador.name} animation="fadeUp" delay={index * 100}>
                  <div style={{
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px',
                    padding: '32px 24px',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      margin: '0 auto 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: '#ffffff',
                    }}>
                      {ambassador.name.charAt(0)}
                    </div>
                    <h4 style={{ fontSize: 'var(--fs-body)', fontWeight: 500, color: '#ffffff', marginBottom: '4px' }}>
                      {ambassador.name}
                    </h4>
                    <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)', marginBottom: '16px' }}>
                      {ambassador.handle}
                    </p>
                    <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                      "{ambassador.quote}"
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section style={{
          background: '#000000',
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
                  Ready to Join?
                </h2>
                <p style={{
                  fontSize: 'var(--fs-body)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                }}>
                  We review all applications within 5 business days. If you're a good fit, we'll reach out with next steps.
                </p>
                
                <p style={{ fontSize: 'var(--fs-body)', color: '#ffffff', fontWeight: 500, marginBottom: '12px' }}>
                  Requirements:
                </p>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  fontSize: 'var(--fs-small)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 2,
                }}>
                  <li>• 1,000+ followers on Instagram or TikTok</li>
                  <li>• Passion for wellness and healthy living</li>
                  <li>• Consistent, quality content creation</li>
                  <li>• US-based (international coming soon)</li>
                </ul>
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
                    <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 500, color: '#ffffff', marginBottom: '12px' }}>Application Received</h3>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      We'll review your application and get back to you within 5 business days.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyles}>Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        style={inputStyles}
                        placeholder="Your name"
                      />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyles}>Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={inputStyles}
                        placeholder="you@email.com"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <label style={labelStyles}>Instagram Handle</label>
                        <input
                          type="text"
                          value={formData.instagram}
                          onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                          style={inputStyles}
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <label style={labelStyles}>TikTok Handle</label>
                        <input
                          type="text"
                          value={formData.tiktok}
                          onChange={(e) => setFormData({...formData, tiktok: e.target.value})}
                          style={inputStyles}
                          placeholder="@username"
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyles}>Total Followers</label>
                      <select
                        required
                        value={formData.followers}
                        onChange={(e) => setFormData({...formData, followers: e.target.value})}
                        style={{ ...inputStyles, cursor: 'pointer' }}
                      >
                        <option value="" style={{ background: '#1a1a1a' }}>Select range...</option>
                        <option value="1-5k" style={{ background: '#1a1a1a' }}>1,000 - 5,000</option>
                        <option value="5-10k" style={{ background: '#1a1a1a' }}>5,000 - 10,000</option>
                        <option value="10-50k" style={{ background: '#1a1a1a' }}>10,000 - 50,000</option>
                        <option value="50-100k" style={{ background: '#1a1a1a' }}>50,000 - 100,000</option>
                        <option value="100k+" style={{ background: '#1a1a1a' }}>100,000+</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={labelStyles}>Why Drizzl?</label>
                      <textarea
                        required
                        value={formData.why}
                        onChange={(e) => setFormData({...formData, why: e.target.value})}
                        rows={4}
                        style={{ ...inputStyles, resize: 'vertical' }}
                        placeholder="Tell us why you'd be a great ambassador..."
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
                      }}
                    >
                      Submit Application
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
