import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

const INGREDIENTS = [
  { name: 'Organic Spinach', source: 'California, USA', benefits: 'Your secret weapon for that lit-from-within glow. Packed with iron, vitamins A & K, and antioxidants that keep your energy high and your immune system unshakable.' },
  { name: 'Wild Blueberries', source: 'Maine, USA', benefits: 'Tiny but mighty brain boosters. These little gems are loaded with anthocyanins that keep your mind sharp and your skin looking ageless.' },
  { name: 'Organic Pea Protein', source: 'Montana, USA', benefits: 'Plant-based muscle fuel. 20g of clean protein per serving for recovery, strength, and that satisfying fullness without any bloat.' },
  { name: 'Coconut Water', source: 'Thailand', benefits: 'Nature\'s sports drink. Pure hydration with natural electrolytes and zero added sugars—just refreshing goodness.' },
  { name: 'Chia Seeds', source: 'Peru', benefits: 'Small seeds, big energy. Omega-3s, fiber, and plant protein team up to keep you fueled and focused all day.' },
  { name: 'Organic Mango', source: 'Mexico', benefits: 'Tropical sunshine in every sip. Vitamin C and digestive enzymes that love your gut as much as you love that sweet, juicy flavor.' },
  { name: 'Almond Butter', source: 'California, USA', benefits: 'Creamy, dreamy, and so satisfying. Healthy fats and vitamin E for heart health and that "I\'m actually full" feeling.' },
  { name: 'Acai Berries', source: 'Brazil', benefits: 'The OG superfood. Antioxidant royalty for glowing skin and cellular protection that fights aging at the source.' },
  { name: 'Raw Cacao', source: 'Ecuador', benefits: 'Chocolate that loves you back. Mood-boosting flavonoids and natural energy without the caffeine crash.' },
  { name: 'Turmeric', source: 'India', benefits: 'Golden magic for your body. Anti-inflammatory curcumin that keeps your joints happy and recovery on point.' },
  { name: 'Organic Banana', source: 'Costa Rica', benefits: 'The MVP of smoothie bases. Natural potassium for muscle function and prebiotics for a happy gut microbiome.' },
  { name: 'Organic Strawberries', source: 'California, USA', benefits: 'Sweet, juicy, and bursting with vitamin C and antioxidants. Your skin will thank you for every sip.' },
  { name: 'Organic Peaches', source: 'Georgia, USA', benefits: 'Summer vibes year-round. Vitamins A and C with natural sweetness that makes every blend taste like sunshine.' },
  { name: 'Organic Raspberries', source: 'Washington, USA', benefits: 'Tiny flavor bombs with fiber for days. Ellagic acid and antioxidants for that youthful, radiant glow.' },
  { name: 'Dragon Fruit', source: 'Vietnam', benefits: 'Insta-worthy AND nutritious. Prebiotic fiber, vitamin C, and that stunning pink color that proves wellness can be gorgeous.' },
  { name: 'Passion Fruit', source: 'Colombia', benefits: 'Tropical tang that hits different. Iron, vitamin C, and potassium with a flavor profile that screams vacation.' },
  { name: 'Organic Pineapple', source: 'Costa Rica', benefits: 'Bromelain-rich and oh-so-tropical. Digestive enzymes that break down protein and reduce inflammation naturally.' },
  { name: 'Goji Berries', source: 'China', benefits: 'Ancient superfood energy. Beta-carotene, amino acids, and adaptogens that help your body handle stress like a boss.' },
  { name: 'Ceremonial Matcha', source: 'Japan', benefits: 'Zen focus in every sip. L-theanine for calm alertness and antioxidants that outshine green tea by 10x.' },
  { name: 'Cold Brew Coffee', source: 'Colombia', benefits: 'Smooth caffeine without the acid. Less bitter, more mellow, with sustained energy that won\'t leave you jittery.' },
  { name: 'Organic Oats', source: 'Montana, USA', benefits: 'Gluten-free whole grains for lasting energy. Beta-glucan fiber keeps you full and your cholesterol in check.' },
  { name: 'Flax Seeds', source: 'Canada', benefits: 'Omega-3 powerhouse for brain and heart health. Ground fresh for maximum absorption of those good fats.' },
  { name: 'Hemp Seeds', source: 'Colorado, USA', benefits: 'Complete plant protein with all essential amino acids. Omega-3s and 6s in the perfect ratio for your body.' },
  { name: 'Organic Dates', source: 'California, USA', benefits: 'Nature\'s candy meets nutrition. Natural caramel sweetness with fiber, potassium, and antioxidants.' },
  { name: 'Jackfruit', source: 'Thailand', benefits: 'The tropical MVP you didn\'t know you needed. Vitamin C, B vitamins, and a unique flavor that\'s part mango, part pineapple, all delicious.' },
  { name: 'Organic Coconut Milk', source: 'Philippines', benefits: 'Creamy, dairy-free perfection. MCTs for quick energy and that luscious texture that makes everything better.' },
  { name: 'Organic Vanilla', source: 'Madagascar', benefits: 'The flavor that ties everything together. Pure vanilla bean adds warmth and depth without any artificial nonsense.' },
  { name: 'Organic Agave', source: 'Mexico', benefits: 'Low-glycemic sweetness when you need a touch more. Gentle on blood sugar, big on flavor.' },
];

const PROMISES = [
  { title: 'No Artificial Flavors', description: 'Only real ingredients that you can actually pronounce. If your grandma wouldn\'t recognize it, neither do we.' },
  { title: 'No Added Sugars', description: 'All the sweetness comes from real fruits. Mother Nature did the work—we just blended it.' },
  { title: 'No Preservatives', description: 'Flash-frozen at peak freshness to lock in nutrients naturally. Science, not chemicals.' },
  { title: 'Non-GMO Verified', description: 'Every single ingredient is certified non-GMO. We\'re picky so you don\'t have to be.' },
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
                maxWidth: '600px',
              }}>
                We believe you deserve to know exactly what you're putting in your body. Every Drizzl Wellness smoothie starts with ingredients we'd serve to our own families—because transparency is the ultimate flex.
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
            gap: '16px',
          }}>
            {INGREDIENTS.map((ingredient, index) => (
              <AnimatedSection key={ingredient.name} animation="fadeUp" delay={index * 30}>
                <div style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '24px 20px',
                  height: '100%',
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
                  The Drizzl Wellness commitment
                </p>
              </div>
            </AnimatedSection>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
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
                Ready to fuel your day with ingredients that actually do something?
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
