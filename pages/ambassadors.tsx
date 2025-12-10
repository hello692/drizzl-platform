import PageLayout, { PageHero, PageSection, SectionHeader, AnimatedSection } from '../components/PageLayout';
import Link from 'next/link';
import { useState } from 'react';

const BENEFITS = [
  { icon: '💵', title: '15% Commission', description: 'Earn on every sale made through your unique referral link.' },
  { icon: '🎁', title: 'Free Products', description: 'Monthly smoothie drops to keep you fueled and inspired.' },
  { icon: '🏷️', title: 'Exclusive Discount Code', description: 'Your own code to share with your community (they save 20%).' },
  { icon: '📸', title: 'Marketing Materials', description: 'Professional photos, graphics, and content to share.' },
  { icon: '🤝', title: 'Community Access', description: 'Join our private ambassador community for support and tips.' },
  { icon: '🚀', title: 'Early Access', description: 'Be the first to try and promote new flavors.' },
];

const AMBASSADORS = [
  { name: 'Jessica M.', handle: '@jessicafitness', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', quote: 'Sharing Drizzl has been so easy—my followers love it!' },
  { name: 'Marcus T.', handle: '@marcustrains', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', quote: 'The perfect fuel for my workouts. And I earn while I share!' },
  { name: 'Elena R.', handle: '@elenawellness', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', quote: 'Finally a brand I can authentically promote. Love Drizzl!' },
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
    console.log('Ambassador application:', formData);
    setSubmitted(true);
  };

  return (
    <PageLayout>
      <PageHero
        badge="Join the Team"
        badgeColor="linear-gradient(135deg, #FF4F7B, #f59e0b)"
        title="Spread the Crave"
        subtitle="Become a Drizzl Ambassador and turn your passion into profit."
      />
      
      <PageSection background="white">
        <SectionHeader
          centered
          title="Ambassador Benefits"
          subtitle="What you get when you join our squad"
        />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
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
        <SectionHeader
          centered
          title="Who We're Looking For"
          subtitle="The perfect fit for our ambassador family"
        />
        
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          textAlign: 'center',
        }}>
          {[
            { emoji: '❤️', title: 'Wellness Enthusiasts', desc: 'You genuinely care about health and nutrition.' },
            { emoji: '📱', title: 'Content Creators', desc: 'You have an engaged following on social media.' },
            { emoji: '✨', title: 'Authentic Voices', desc: 'You only share products you truly believe in.' },
          ].map((item) => (
            <div key={item.title}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>{item.emoji}</span>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection background="white">
        <SectionHeader
          centered
          title="Meet Our Ambassadors"
          subtitle="Join an amazing community of wellness advocates"
        />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {AMBASSADORS.map((ambassador, index) => (
            <AnimatedSection key={ambassador.name} animation="fadeUp" delay={index * 100}>
              <div className="tiktok-card" style={{ textAlign: 'center' }}>
                <img 
                  src={ambassador.image} 
                  alt={ambassador.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '16px',
                  }}
                />
                <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{ambassador.name}</h4>
                <p style={{ fontSize: '14px', color: '#FF4F7B', marginBottom: '16px' }}>{ambassador.handle}</p>
                <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic', lineHeight: '1.5' }}>
                  "{ambassador.quote}"
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </PageSection>

      <PageSection background="cream">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
          <div>
            <SectionHeader
              title="Ready to Join?"
              subtitle="Apply to become a Drizzl Ambassador today."
            />
            <div style={{ marginTop: '24px' }}>
              <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.7', marginBottom: '20px' }}>
                We review all applications within 5 business days. If you're a good fit, we'll reach out with next steps and your welcome package details.
              </p>
              <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.7' }}>
                <strong>Requirements:</strong>
              </p>
              <ul style={{ fontSize: '15px', color: '#666', lineHeight: '2', paddingLeft: '20px' }}>
                <li>1,000+ followers on Instagram or TikTok</li>
                <li>Passion for wellness and healthy living</li>
                <li>Consistent, quality content creation</li>
                <li>US-based (international coming soon!)</li>
              </ul>
            </div>
          </div>
          
          <AnimatedSection animation="fadeUp">
            <div className="tiktok-card" style={{ padding: '32px' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <span style={{ fontSize: '64px', display: 'block', marginBottom: '24px' }}>🎉</span>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Application Received!</h3>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>
                    We'll review your application and get back to you within 5 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }}
                      placeholder="Your name"
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }}
                      placeholder="you@email.com"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Instagram Handle</label>
                      <input
                        type="text"
                        value={formData.instagram}
                        onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                        style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }}
                        placeholder="@username"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>TikTok Handle</label>
                      <input
                        type="text"
                        value={formData.tiktok}
                        onChange={(e) => setFormData({...formData, tiktok: e.target.value})}
                        style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' }}
                        placeholder="@username"
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Total Followers *</label>
                    <select
                      required
                      value={formData.followers}
                      onChange={(e) => setFormData({...formData, followers: e.target.value})}
                      style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px', background: '#fff' }}
                    >
                      <option value="">Select range...</option>
                      <option value="1-5k">1,000 - 5,000</option>
                      <option value="5-10k">5,000 - 10,000</option>
                      <option value="10-50k">10,000 - 50,000</option>
                      <option value="50-100k">50,000 - 100,000</option>
                      <option value="100k+">100,000+</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Why Drizzl? *</label>
                    <textarea
                      required
                      value={formData.why}
                      onChange={(e) => setFormData({...formData, why: e.target.value})}
                      rows={4}
                      style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px', resize: 'vertical' }}
                      placeholder="Tell us why you'd be a great ambassador..."
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #FF4F7B, #f59e0b)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: '16px',
                      fontWeight: '600',
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
      </PageSection>
    </PageLayout>
  );
}
