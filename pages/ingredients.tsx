import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

const INGREDIENTS = [
  { name: 'Organic Spinach', source: 'California, USA', benefits: 'Rich in iron, vitamins A & K, and antioxidants for energy and immunity.' },
  { name: 'Wild Blueberries', source: 'Maine, USA', benefits: 'Packed with anthocyanins for brain health and anti-aging properties.' },
  { name: 'Grass-Fed Whey', source: 'New Zealand', benefits: 'Premium protein for muscle recovery with no artificial hormones.' },
  { name: 'Coconut Water', source: 'Thailand', benefits: 'Natural electrolytes for hydration without added sugars.' },
  { name: 'Chia Seeds', source: 'Peru', benefits: 'Omega-3 fatty acids, fiber, and protein for sustained energy.' },
  { name: 'Organic Mango', source: 'Mexico', benefits: 'Vitamin C and digestive enzymes for gut health.' },
  { name: 'Almond Butter', source: 'California, USA', benefits: 'Healthy fats and vitamin E for heart health and satiety.' },
  { name: 'Acai Berries', source: 'Brazil', benefits: 'Super antioxidant for skin health and cellular protection.' },
  { name: 'Raw Cacao', source: 'Ecuador', benefits: 'Mood-boosting flavonoids and natural energy without the crash.' },
  { name: 'Turmeric', source: 'India', benefits: 'Anti-inflammatory curcumin for joint health and recovery.' },
  { name: 'Organic Banana', source: 'Costa Rica', benefits: 'Natural potassium and prebiotics for digestive health.' },
  { name: 'Greek Yogurt', source: 'Vermont, USA', benefits: 'Probiotics and protein for gut health and muscle building.' },
];

const PROMISES = [
  { title: 'No Artificial Flavors', description: 'Only real ingredients that you can pronounce.' },
  { title: 'No Added Sugars', description: 'Natural sweetness from real fruits only.' },
  { title: 'No Preservatives', description: 'Flash-frozen to lock in freshness naturally.' },
  { title: 'Non-GMO Verified', description: 'All ingredients are certified non-GMO.' },
];

export default function Ingredients() {
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
                PURE & SIMPLE
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                What Goes in Every Cup
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
              }}>
                We believe you deserve to know exactly what you're putting in your body. Every Drizzl smoothie starts with ingredients we'd serve to our own families.
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '16px',
          }}>
            {INGREDIENTS.map((ingredient, index) => (
              <AnimatedSection key={ingredient.name} animation="fadeUp" delay={index * 40}>
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
                    marginBottom: '4px',
                  }}>
                    {ingredient.name}
                  </h3>
                  <p style={{
                    fontSize: 'var(--fs-label)',
                    color: 'var(--color-text-tertiary)',
                    letterSpacing: '0.05em',
                    marginBottom: '12px',
                  }}>
                    Sourced from {ingredient.source}
                  </p>
                  <p style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                  }}>
                    {ingredient.benefits}
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
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeUp">
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  marginBottom: '12px',
                }}>
                  Our Promise to You
                </h2>
                <p style={{
                  fontSize: 'var(--fs-body)',
                  color: 'var(--color-text-secondary)',
                }}>
                  The Drizzl commitment
                </p>
              </div>
            </AnimatedSection>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
            }}>
              {PROMISES.map((promise, index) => (
                <AnimatedSection key={promise.title} animation="fadeUp" delay={index * 100}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '20px',
                      color: '#ffffff',
                    }}>
                      ✓
                    </div>
                    <h3 style={{
                      fontSize: 'var(--fs-body)',
                      fontWeight: 500,
                      color: '#ffffff',
                      marginBottom: '8px',
                    }}>
                      {promise.title}
                    </h3>
                    <p style={{
                      fontSize: 'var(--fs-small)',
                      color: 'var(--color-text-tertiary)',
                      lineHeight: 1.5,
                    }}>
                      {promise.description}
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
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeUp">
              <div style={{
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                padding: '32px',
              }}>
                <h2 style={{
                  fontSize: 'var(--fs-h3)',
                  fontWeight: 500,
                  color: '#ffffff',
                  marginBottom: '16px',
                  textAlign: 'center',
                }}>
                  Allergen Information
                </h2>
                <div style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                  <p style={{ marginBottom: '12px' }}><strong style={{ color: '#ffffff' }}>May Contain:</strong> Tree nuts (almonds, cashews), dairy (whey protein, Greek yogurt), soy</p>
                  <p style={{ marginBottom: '12px' }}><strong style={{ color: '#ffffff' }}>Gluten-Free Options:</strong> All smoothies except Coffee Kick are certified gluten-free.</p>
                  <p style={{ marginBottom: '20px' }}><strong style={{ color: '#ffffff' }}>Vegan Options:</strong> Green Machine, Tropical Paradise, Dragon Fruit Dream, and Pineapple Express are 100% plant-based.</p>
                  <p>
                    Questions about specific allergens?{' '}
                    <Link href="/contact" style={{ color: '#ffffff', textDecoration: 'underline' }}>Contact us</Link>
                    {' '}and we'll help you find the perfect smoothie for your needs.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section style={{
          background: '#0a0a0a',
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <AnimatedSection animation="fadeUp">
              <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 300,
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Taste the Difference
              </h2>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
                marginBottom: '24px',
              }}>
                Ready to fuel your day with real ingredients?
              </p>
              <Link 
                href="/collections/smoothies"
                style={{
                  display: 'inline-block',
                  padding: '16px 40px',
                  background: '#ffffff',
                  color: '#000000',
                  borderRadius: '50px',
                  fontWeight: 500,
                  fontSize: 'var(--fs-body)',
                  textDecoration: 'none',
                }}
              >
                Shop Smoothies
              </Link>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
