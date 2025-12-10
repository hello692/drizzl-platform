import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

const FAQS = [
  {
    category: 'Products',
    questions: [
      { q: 'How do I use the smoothies?', a: 'Simply blend with water, milk, or your favorite liquid for 30-45 seconds. Add ice for a colder smoothie.' },
      { q: 'Are the smoothies organic?', a: 'Yes, all our smoothies are made with organic ingredients sourced from trusted suppliers.' },
      { q: 'How long do they stay fresh?', a: 'Our frozen smoothies stay fresh in your freezer for up to 12 months from the date of shipment.' },
      { q: "What's the nutritional info?", a: 'Each smoothie has detailed nutritional information on its product page. All smoothies are high in vitamins and minerals.' },
    ]
  },
  {
    category: 'Orders & Shipping',
    questions: [
      { q: 'How long does shipping take?', a: 'Orders typically ship within 1-2 business days and arrive within 3-5 business days depending on location.' },
      { q: 'Do you ship internationally?', a: 'Currently we only ship within the United States. International shipping coming soon.' },
      { q: 'Is there a minimum order?', a: 'No minimum order required. However, orders over $75 qualify for free shipping.' },
    ]
  },
  {
    category: 'Subscriptions',
    questions: [
      { q: 'Do you offer subscriptions?', a: 'Yes! Sign up for a subscription to get 10% off and automatic deliveries at your preferred frequency.' },
      { q: 'Can I modify my subscription?', a: 'Absolutely. You can pause, skip, or cancel anytime from your account dashboard.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and Apple Pay.' },
    ]
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<{[key: string]: boolean}>({});

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
                SUPPORT
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                FAQs
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
              }}>
                We've got answers
              </p>
            </div>
          </AnimatedSection>

          {FAQS.map((section, sectionIdx) => (
            <AnimatedSection key={section.category} animation="fadeUp" delay={sectionIdx * 100}>
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{
                  fontSize: 'var(--fs-h4)',
                  fontWeight: 500,
                  color: '#ffffff',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}>
                  {section.category}
                </h2>
                {section.questions.map((faq, idx) => {
                  const key = `${sectionIdx}-${idx}`;
                  return (
                    <div key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <button
                        onClick={() => toggleItem(key)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '20px 0',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ fontSize: 'var(--fs-body)', fontWeight: 500, color: '#ffffff', paddingRight: '16px' }}>
                          {faq.q}
                        </span>
                        <span style={{ 
                          fontSize: '20px', 
                          color: 'var(--color-text-tertiary)',
                          transform: openItems[key] ? 'rotate(45deg)' : 'none',
                          transition: 'transform 0.2s ease',
                          flexShrink: 0,
                        }}>
                          +
                        </span>
                      </button>
                      <div style={{
                        maxHeight: openItems[key] ? '200px' : '0',
                        overflow: 'hidden',
                        transition: 'max-height 0.3s ease',
                      }}>
                        <p style={{ 
                          fontSize: 'var(--fs-small)', 
                          color: 'var(--color-text-secondary)', 
                          lineHeight: 1.7,
                          paddingBottom: '20px',
                        }}>
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AnimatedSection>
          ))}

          <AnimatedSection animation="fadeUp" delay={300}>
            <div style={{
              background: '#0a0a0a',
              borderRadius: '14px',
              padding: '32px',
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: 'var(--fs-h4)', fontWeight: 500, color: '#ffffff', marginBottom: '12px' }}>
                Still have questions?
              </h3>
              <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                We're here to help.
              </p>
              <Link
                href="/contact"
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  background: '#ffffff',
                  color: '#000000',
                  borderRadius: '50px',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
