import PageLayout, { PageHero, PageSection, SectionHeader, AnimatedSection } from '../components/PageLayout';
import Link from 'next/link';
import { useState } from 'react';

const BENEFITS = [
  { icon: '💰', title: '15% Off Every Order', description: 'Save on all your favorite smoothies, every single time.' },
  { icon: '🚚', title: 'Free Shipping', description: 'No more shipping costs on any order, any size.' },
  { icon: '🎁', title: 'Birthday Surprise', description: 'A special treat delivered on your birthday month.' },
  { icon: '🥤', title: 'Early Access', description: 'Be the first to try new flavors before anyone else.' },
  { icon: '📖', title: 'Exclusive Recipes', description: 'Members-only smoothie recipes and nutrition tips.' },
  { icon: '⭐', title: 'VIP Events', description: 'Invites to exclusive tastings and wellness workshops.' },
];

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Absolutely! You can cancel your membership at any time with no fees or penalties. Your benefits continue until the end of your billing period.' },
  { q: 'How does the birthday surprise work?', a: 'During your birthday month, we\'ll send you a special gift—usually a free smoothie or exclusive discount code!' },
  { q: 'Do benefits apply to wholesale orders?', a: 'Membership benefits apply to personal orders only. For business orders, check out our wholesale program.' },
  { q: 'Can I gift a membership?', a: 'Yes! Gift memberships are available. The recipient will receive a digital gift card to activate their membership.' },
];

export default function Membership() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PageLayout>
      <PageHero
        badge="Exclusive Club"
        badgeColor="linear-gradient(135deg, #FF4F7B, #6B5CE7)"
        title="Join the Wellness Club"
        subtitle="Unlock exclusive perks, savings, and VIP treatment."
      />
      
      <PageSection background="white">
        <SectionHeader
          centered
          title="Member Benefits"
          subtitle="Everything you get when you join the club"
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
          title="Choose Your Plan"
          subtitle="Start saving today"
        />
        
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            marginBottom: '32px',
          }}>
            <button
              onClick={() => setSelectedPlan('monthly')}
              style={{
                padding: '12px 32px',
                borderRadius: '50px',
                border: selectedPlan === 'monthly' ? 'none' : '2px solid #ddd',
                background: selectedPlan === 'monthly' ? 'linear-gradient(135deg, #6B5CE7, #FF4F7B)' : '#fff',
                color: selectedPlan === 'monthly' ? '#fff' : '#333',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan('annual')}
              style={{
                padding: '12px 32px',
                borderRadius: '50px',
                border: selectedPlan === 'annual' ? 'none' : '2px solid #ddd',
                background: selectedPlan === 'annual' ? 'linear-gradient(135deg, #6B5CE7, #FF4F7B)' : '#fff',
                color: selectedPlan === 'annual' ? '#fff' : '#333',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              Annual (Save 17%)
            </button>
          </div>

          <AnimatedSection animation="fadeUp">
            <div 
              className="tiktok-card" 
              style={{ 
                textAlign: 'center', 
                padding: '48px',
                border: '2px solid #6B5CE7',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  background: 'linear-gradient(135deg, #6B5CE7, #FF4F7B)',
                  color: '#fff',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}>
                  {selectedPlan === 'annual' ? 'BEST VALUE' : 'FLEXIBLE'}
                </span>
                <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                  Wellness Club {selectedPlan === 'annual' ? 'Annual' : 'Monthly'}
                </h3>
              </div>
              
              <div style={{ marginBottom: '32px' }}>
                <span style={{ 
                  fontSize: '56px', 
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #6B5CE7, #FF4F7B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  ${selectedPlan === 'annual' ? '99' : '9.99'}
                </span>
                <span style={{ color: '#666', fontSize: '18px' }}>
                  /{selectedPlan === 'annual' ? 'year' : 'month'}
                </span>
                {selectedPlan === 'annual' && (
                  <p style={{ color: '#22c55e', fontWeight: '600', marginTop: '8px' }}>
                    That's just $8.25/month!
                  </p>
                )}
              </div>

              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: '0 auto 32px',
                maxWidth: '300px',
                textAlign: 'left',
              }}>
                {['15% off all orders', 'Free shipping always', 'Birthday surprise', 'Early access to new flavors', 'Exclusive recipes', 'VIP event invites'].map((item) => (
                  <li key={item} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '8px 0',
                    fontSize: '15px',
                  }}>
                    <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  padding: '18px',
                  background: 'linear-gradient(135deg, #6B5CE7, #FF4F7B)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Join the Club
              </button>
              <p style={{ color: '#888', fontSize: '13px', marginTop: '16px' }}>
                Cancel anytime. No commitment required.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </PageSection>

      <PageSection background="white">
        <SectionHeader
          centered
          title="Frequently Asked Questions"
          subtitle="Got questions? We've got answers."
        />
        
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {FAQS.map((faq, index) => (
            <div 
              key={index}
              style={{
                borderBottom: '1px solid #eee',
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '24px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '17px', fontWeight: '600' }}>{faq.q}</span>
                <span style={{ 
                  fontSize: '24px', 
                  color: '#888',
                  transform: openFaq === index ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.2s',
                }}>
                  +
                </span>
              </button>
              <div style={{
                maxHeight: openFaq === index ? '200px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
              }}>
                <p style={{ 
                  fontSize: '15px', 
                  color: '#666', 
                  lineHeight: '1.7',
                  paddingBottom: '24px',
                }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection background="black">
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
            Ready to Join?
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>
            Start saving on every order today.
          </p>
          <button
            style={{
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #FF4F7B, #6B5CE7)',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Become a Member
          </button>
        </div>
      </PageSection>
    </PageLayout>
  );
}
