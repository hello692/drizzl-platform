import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

const INGREDIENT_CATEGORIES = [
  {
    title: 'Fruits',
    tagline: 'The Flavor Heroes',
    description: "Nature's candy, but better. Sweet, vibrant, and packed with \"why does this taste so good?\" energy.",
    ingredients: [
      { name: 'Organic Banana', benefits: 'Creamy texture and potassium for natural muscle recovery.' },
      { name: 'Organic Strawberry', benefits: 'A Vitamin C kiss for radiant, glowing skin.' },
      { name: 'Organic Orange', benefits: 'Bright citrus energy to wake up your immunity.' },
      { name: 'Organic Raspberry', benefits: 'Fiber-rich tartness to keep digestion happy.' },
      { name: 'Organic Blueberry', benefits: 'Tiny antioxidants for brain health and sharp focus.' },
      { name: 'Organic Mango', benefits: 'Digestive enzymes wrapped in tropical sunshine.' },
      { name: 'Organic Pineapple', benefits: 'Anti-inflammatory sweetness that fights bloat.' },
      { name: 'Organic Passion Fruit', benefits: 'Exotic flavor loaded with vitamins A & C.' },
      { name: 'Organic Acai Berry', benefits: 'The beauty berry—cellular protection for deep health.' },
      { name: 'Organic Dates', benefits: 'Natural caramel sweetness for sustained, crash-free energy.' },
    ],
  },
  {
    title: 'Greens',
    tagline: 'The Glow Crew',
    description: 'Leafy powerhouses that make your body feel like it just did yoga.',
    ingredients: [
      { name: 'Organic Spinach & Baby Spinach', benefits: 'Iron-rich fatigue fighters to keep you energized.' },
      { name: 'Organic Kale', benefits: 'The ultimate detoxifier, packed with vitamins K, A, and C.' },
    ],
  },
  {
    title: 'Grains',
    tagline: 'The Satisfaction Squad',
    description: "Slow-burning fuel so you can crush your day without the hunger pangs.",
    ingredients: [
      { name: 'Organic Rolled Oats', benefits: 'Complex carbs for steady energy and heart health.' },
      { name: 'Organic Oat Fiber', benefits: 'The secret to feeling full and keeping digestion smooth.' },
    ],
  },
  {
    title: 'Nuts & Seeds',
    tagline: 'The Creamy MVPs',
    description: 'Healthy fats and velvety textures. The reason your smoothie feels like a meal.',
    ingredients: [
      { name: 'Organic Almonds & Almond Butter', benefits: 'Vitamin E for heart health and skin elasticity.' },
      { name: 'Organic Hazelnuts', benefits: 'Decadent flavor matched with brain-boosting nutrients.' },
      { name: 'Organic Coconut Meat', benefits: 'MCTs for a metabolism boost and instant hydration.' },
      { name: 'Organic Chia Seeds', benefits: 'Omega-3 powerhouses for hydration and endurance.' },
      { name: 'Organic Pumpkin Seeds', benefits: 'Zinc and magnesium for mood balance and immunity.' },
    ],
  },
  {
    title: 'Cacao & Coffee',
    tagline: 'The Mood Lifters',
    description: 'Focus, flavor, and just enough edge to feel productive without the panic.',
    ingredients: [
      { name: 'Organic Cacao Powder & Nibs', benefits: 'Flavonoids for bliss, focus, and a natural mood boost.' },
      { name: 'Organic Brewed Coffee & Extract', benefits: 'Clean caffeine for clarity without the jitters.' },
    ],
  },
  {
    title: 'Mushrooms',
    tagline: 'The Secret Weapons',
    description: 'Ancient wisdom for a modern glow. Brain support, immune strength, and calm energy.',
    ingredients: [
      { name: "Organic Lion's Mane", benefits: 'The brain mushroom—for razor-sharp mental clarity.' },
      { name: 'Organic Chaga', benefits: 'A powerhouse shield for your immune system.' },
      { name: 'Organic Reishi', benefits: 'The chill pill of nature for stress relief and balance.' },
    ],
  },
  {
    title: 'Botanicals',
    tagline: 'The Wellness Flex',
    description: 'Adaptogenic balance and warming spices to set the vibe.',
    ingredients: [
      { name: 'Organic Maca Root', benefits: 'An adaptogen for hormone balance, energy, and libido.' },
      { name: 'Organic Ginger', benefits: 'A spicy kick to soothe digestion and boost immunity.' },
      { name: 'Organic Cinnamon', benefits: 'Warming spice that helps balance blood sugar.' },
      { name: 'Organic Vanilla Extract', benefits: 'Aromatic calm that soothes the senses.' },
    ],
  },
  {
    title: 'Enhancers',
    tagline: 'The Finish',
    description: 'Small touches, massive impact.',
    ingredients: [
      { name: 'Organic Lemon Juice', benefits: 'Alkaline balance to detoxify and brighten.' },
      { name: 'Organic Sea Salt', benefits: 'Essential minerals for superior hydration.' },
    ],
  },
  {
    title: 'Base Liquids',
    tagline: 'The Canvas',
    description: 'Choose your vibe—creamy, light, or tropical.',
    ingredients: [
      { name: 'Organic Almond, Oat, or Coconut Milk', benefits: 'Dairy-free creaminess.' },
      { name: 'Filtered Water', benefits: 'Clean, pure hydration.' },
    ],
  },
  {
    title: 'Protein',
    tagline: 'The Power Source',
    description: 'Lean, clean, and mean. Build muscle and stay satisfied.',
    ingredients: [
      { name: 'Organic Pea Protein', benefits: 'Complete plant-based amino acids for recovery.' },
      { name: 'Organic Chia Protein', benefits: 'Fiber-dense protein to keep you full for hours.' },
    ],
  },
];

const PROMISES = [
  { title: 'No Artificial Flavors', description: "Only real ingredients you can pronounce." },
  { title: 'No Added Sugars', description: "All sweetness comes from real fruits." },
  { title: 'No Preservatives', description: 'Flash-frozen at peak freshness.' },
  { title: 'Non-GMO Verified', description: "Every ingredient is certified non-GMO." },
];

export default function Ingredients() {
  return (
    <>
      <Navbar />
      
      <main style={{ background: '#000000', minHeight: '100vh', paddingTop: '120px' }}>
        <section style={{
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ marginBottom: 'clamp(60px, 8vw, 80px)', textAlign: 'center' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '16px',
                display: 'block',
              }}>
                THE INGREDIENT LIST
              </span>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '20px',
              }}>
                Full Transparency.<br />Pure Obsession.
              </h1>
              <p style={{
                fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                fontWeight: 400,
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.6)',
                maxWidth: '540px',
                margin: '0 auto',
              }}>
                We don't do secrets. We do potent, premium ingredients that love your body back.
              </p>
            </div>
          </AnimatedSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {INGREDIENT_CATEGORIES.map((category, categoryIndex) => (
              <AnimatedSection key={category.title} animation="fadeUp" delay={categoryIndex * 30}>
                <div style={{
                  background: categoryIndex % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderRadius: '20px',
                  padding: 'clamp(28px, 4vw, 40px)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    marginBottom: '24px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    paddingBottom: '20px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}>
                      <h2 style={{
                        fontSize: 'clamp(1.5rem, 3vw, 1.75rem)',
                        fontWeight: 500,
                        color: '#ffffff',
                        letterSpacing: '-0.02em',
                      }}>
                        {category.title}
                      </h2>
                      <span style={{
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.35)',
                        fontWeight: 400,
                        fontStyle: 'italic',
                      }}>
                        {category.tagline}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.5)',
                      lineHeight: 1.5,
                      marginTop: '8px',
                    }}>
                      {category.description}
                    </p>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gap: '1px',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}>
                    {category.ingredients.map((ingredient, index) => (
                      <div
                        key={ingredient.name}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(180px, 1fr) 2fr',
                          gap: '24px',
                          padding: '16px 20px',
                          background: '#000000',
                          alignItems: 'center',
                        }}
                      >
                        <h3 style={{
                          fontSize: '15px',
                          fontWeight: 500,
                          color: '#ffffff',
                        }}>
                          {ingredient.name}
                        </h3>
                        <p style={{
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.55)',
                          lineHeight: 1.5,
                        }}>
                          {ingredient.benefits}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section style={{
          background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeUp">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  marginBottom: '12px',
                  letterSpacing: '-0.02em',
                }}>
                  Our Promise to You
                </h2>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  The Drizzl Wellness commitment
                </p>
              </div>
            </AnimatedSection>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '2px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              {PROMISES.map((promise, index) => (
                <AnimatedSection key={promise.title} animation="fadeUp" delay={index * 80}>
                  <div style={{
                    textAlign: 'center',
                    padding: '32px 20px',
                    background: '#0a0a0a',
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '16px',
                      color: '#ffffff',
                    }}>
                      ✓
                    </div>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#ffffff',
                      marginBottom: '8px',
                      letterSpacing: '0.01em',
                    }}>
                      {promise.title}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.45)',
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
          padding: 'clamp(60px, 8vw, 80px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeUp">
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px',
                padding: 'clamp(28px, 4vw, 40px)',
              }}>
                <h2 style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                  fontWeight: 500,
                  color: '#ffffff',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}>
                  Allergen Information
                </h2>
                <div style={{
                  display: 'grid',
                  gap: '16px',
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr',
                    gap: '16px',
                    alignItems: 'start',
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff' }}>May Contain</span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Tree nuts (almonds, cashews, hazelnuts), soy</span>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr',
                    gap: '16px',
                    alignItems: 'start',
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff' }}>Gluten-Free</span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>All smoothies except Coffee Kick are certified gluten-free</span>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr',
                    gap: '16px',
                    alignItems: 'start',
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff' }}>Vegan</span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>All smoothies are 100% plant-based</span>
                  </div>
                </div>
                <div style={{
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                    Questions about allergens?{' '}
                    <Link href="/contact" style={{ color: '#ffffff', textDecoration: 'underline' }}>Contact us</Link>
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section style={{
          background: '#0a0a0a',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <AnimatedSection animation="fadeUp">
              <h2 style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
                fontWeight: 300,
                color: '#ffffff',
                marginBottom: '16px',
                letterSpacing: '-0.02em',
              }}>
                Taste the Difference
              </h2>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '32px',
              }}>
                Ready to fuel your day with ingredients that actually do something?
              </p>
              <Link 
                href="/collections/smoothies"
                style={{
                  display: 'inline-block',
                  padding: '18px 48px',
                  background: '#ffffff',
                  color: '#000000',
                  borderRadius: '50px',
                  fontWeight: 500,
                  fontSize: '15px',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                }}
              >
                Shop Smoothies
              </Link>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 'minmax(180px, 1fr) 2fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
