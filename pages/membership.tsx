import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { AnimatedSection } from '../components/ScrollAnimations';

const BENEFITS = [
  { title: '15% Off Everything', description: 'Because you have expensive taste, and we respect that. Save on every sip, every single time.' },
  { title: 'Free Shipping', description: 'We don\'t do extra baggage. Your order arrives at your door, on the house.' },
  { title: 'Birthday Love', description: 'A little something special during your birthday month. We know how to spoil you.' },
  { title: 'First Taste', description: 'Skip the line. You get early access to our newest flavor drops before the rest of the world even knows they exist.' },
  { title: 'Secret Recipes', description: 'Unlock members-only blends and tips to make your smoothie game as hot as you are.' },
  { title: 'The Guest List', description: 'Invites to exclusive tastings and wellness events. You\'re with us now.' },
];

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Absolutely. We\'re into consensual relationships only.' },
  { q: 'How does the birthday surprise work?', a: 'It\'s a secret. But trust us, it\'s better than a text from your ex.' },
  { q: 'Do benefits apply to wholesale orders?', a: 'Let\'s keep this between us—retail orders only, darling.' },
  { q: 'Can I gift a membership?', a: 'Yes. Give the gift of a glow-up. They\'ll get a digital card to activate their new lifestyle.' },
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
                THE INNER CIRCLE
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Make it Official.
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
                margin: '0 auto',
              }}>
                Why flirt with wellness when you can commit? Unlock the VIP treatment, the secret perks, and the kind of glow that makes people stare.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={50}>
            <h2 style={{
              fontSize: 'var(--fs-h4)',
              fontWeight: 500,
              color: '#ffffff',
              marginBottom: '24px',
              textAlign: 'center',
            }}>
              The Benefits of Being Obsessed:
            </h2>
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
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeUp">
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  marginBottom: '24px',
                }}>
                  Choose Your Level of Commitment
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
                    The Monthly Fling
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
                    The Annual Affair
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
                  {selectedPlan === 'annual' ? 'BEST VALUE' : 'FLEXIBLE, FUN, AND LOW PRESSURE'}
                </p>
                <h3 style={{
                  fontSize: 'var(--fs-h3)',
                  fontWeight: 500,
                  color: '#ffffff',
                  marginBottom: '24px',
                }}>
                  {selectedPlan === 'annual' ? 'The Annual Affair' : 'The Monthly Fling'}
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
                      That's just $8.25/month — Save 17% and lock in a year of pure pleasure.
                    </p>
                  )}
                  {selectedPlan === 'monthly' && (
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px', fontSize: 'var(--fs-small)' }}>
                      Flexible, fun, and low pressure.
                    </p>
                  )}
                </div>

                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: '0 0 32px 0',
                  textAlign: 'left',
                }}>
                  {['15% off everything', 'Free shipping always', 'Birthday surprises', 'Early access & exclusive invites'].map((item) => (
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
                  Ready to join the club? Cancel anytime. No strings attached.
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
