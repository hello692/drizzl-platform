import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { AnimatedSection } from '../components/ScrollAnimations';

const BENEFITS = [
  { title: '15% Off Every Order', description: 'Save on all your favorite smoothies, every single time.' },
  { title: 'Free Shipping', description: 'No more shipping costs on any order, any size.' },
  { title: 'Birthday Surprise', description: 'A special treat delivered on your birthday month.' },
  { title: 'Early Access', description: 'Be the first to try new flavors before anyone else.' },
  { title: 'Exclusive Recipes', description: 'Members-only smoothie recipes and nutrition tips.' },
  { title: 'VIP Events', description: 'Invites to exclusive tastings and wellness workshops.' },
];

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Absolutely. You can cancel your membership at any time with no fees or penalties. Your benefits continue until the end of your billing period.' },
  { q: 'How does the birthday surprise work?', a: 'During your birthday month, we\'ll send you a special gift—usually a free smoothie or exclusive discount code.' },
  { q: 'Do benefits apply to wholesale orders?', a: 'Membership benefits apply to personal orders only. For business orders, check out our wholesale program.' },
  { q: 'Can I gift a membership?', a: 'Yes. Gift memberships are available. The recipient will receive a digital gift card to activate their membership.' },
];

export default function Membership() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 48px)' }}>
              <span style={{
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                EXCLUSIVE CLUB
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Join the Wellness Club
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '480px',
                margin: '0 auto',
              }}>
                Unlock exclusive perks, savings, and VIP treatment.
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
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeUp">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  marginBottom: '24px',
                }}>
                  Choose Your Plan
                </h2>
                
                <div style={{
                  display: 'inline-flex',
                  gap: '8px',
                  padding: '4px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '50px',
                }}>
                  <button
                    onClick={() => setSelectedPlan('monthly')}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '50px',
                      border: 'none',
                      background: selectedPlan === 'monthly' ? '#ffffff' : 'transparent',
                      color: selectedPlan === 'monthly' ? '#000000' : 'var(--color-text-secondary)',
                      fontWeight: 500,
                      fontSize: 'var(--fs-small)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setSelectedPlan('annual')}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '50px',
                      border: 'none',
                      background: selectedPlan === 'annual' ? '#ffffff' : 'transparent',
                      color: selectedPlan === 'annual' ? '#000000' : 'var(--color-text-secondary)',
                      fontWeight: 500,
                      fontSize: 'var(--fs-small)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Annual (Save 17%)
                  </button>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={100}>
              <div style={{
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                padding: '40px 32px',
                textAlign: 'center',
              }}>
                <p style={{
                  fontSize: 'var(--fs-label)',
                  color: 'var(--color-text-tertiary)',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}>
                  {selectedPlan === 'annual' ? 'BEST VALUE' : 'FLEXIBLE'}
                </p>
                <h3 style={{
                  fontSize: 'var(--fs-h3)',
                  fontWeight: 500,
                  color: '#ffffff',
                  marginBottom: '24px',
                }}>
                  Wellness Club {selectedPlan === 'annual' ? 'Annual' : 'Monthly'}
                </h3>
                
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ 
                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
                    fontWeight: 300,
                    color: '#ffffff',
                  }}>
                    ${selectedPlan === 'annual' ? '99' : '9.99'}
                  </span>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--fs-body)' }}>
                    /{selectedPlan === 'annual' ? 'year' : 'month'}
                  </span>
                  {selectedPlan === 'annual' && (
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px', fontSize: 'var(--fs-small)' }}>
                      That's just $8.25/month
                    </p>
                  )}
                </div>

                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: '0 0 32px 0',
                  textAlign: 'left',
                }}>
                  {['15% off all orders', 'Free shipping always', 'Birthday surprise', 'Early access to new flavors', 'Exclusive recipes', 'VIP event invites'].map((item) => (
                    <li key={item} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      padding: '8px 0',
                      fontSize: 'var(--fs-small)',
                      color: 'var(--color-text-secondary)',
                    }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <button
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
                  Join the Club
                </button>
                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--fs-label)', marginTop: '16px' }}>
                  Cancel anytime. No commitment required.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section style={{
          background: '#000000',
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeUp">
              <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 300,
                color: '#ffffff',
                marginBottom: '32px',
                textAlign: 'center',
              }}>
                Frequently Asked Questions
              </h2>
            </AnimatedSection>
            
            {FAQS.map((faq, index) => (
              <AnimatedSection key={index} animation="fadeUp" delay={index * 50}>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
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
                    <span style={{ fontSize: 'var(--fs-body)', fontWeight: 500, color: '#ffffff' }}>{faq.q}</span>
                    <span style={{ 
                      fontSize: '20px', 
                      color: 'var(--color-text-tertiary)',
                      transform: openFaq === index ? 'rotate(45deg)' : 'none',
                      transition: 'transform 0.2s ease',
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
                      fontSize: 'var(--fs-small)', 
                      color: 'var(--color-text-secondary)', 
                      lineHeight: 1.7,
                      paddingBottom: '24px',
                    }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
