import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

const INGREDIENT_CATEGORIES = [
  {
    title: 'The Flavor Heroes',
    subtitle: 'Fruits',
    description: "Nature's candy, but better. Sweet, vibrant, and packed with \"why does this taste so good?\" energy.",
    emoji: '🍓',
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
    title: 'The Glow Crew',
    subtitle: 'Greens',
    description: 'Leafy powerhouses that make your body feel like it just did yoga (without you actually doing yoga).',
    emoji: '🥬',
    ingredients: [
      { name: 'Organic Spinach & Baby Spinach', benefits: 'Iron-rich fatigue fighters to keep you energized.' },
      { name: 'Organic Kale', benefits: 'The ultimate detoxifier, packed with vitamins K, A, and C.' },
    ],
  },
  {
    title: 'The Satisfaction Squad',
    subtitle: 'Grains',
    description: "Slow-burning fuel so you can crush your day without the hunger pangs.",
    emoji: '🌾',
    ingredients: [
      { name: 'Organic Rolled Oats', benefits: 'Complex carbs for steady energy and heart health.' },
      { name: 'Organic Oat Fiber', benefits: 'The secret to feeling full and keeping digestion smooth.' },
    ],
  },
  {
    title: 'The Creamy MVPs',
    subtitle: 'Nuts & Seeds',
    description: 'Healthy fats and velvety textures. The reason your smoothie feels like a meal.',
    emoji: '🥜',
    ingredients: [
      { name: 'Organic Almonds & Almond Butter', benefits: 'Vitamin E for heart health and skin elasticity.' },
      { name: 'Organic Hazelnuts', benefits: 'Decadent flavor matched with brain-boosting nutrients.' },
      { name: 'Organic Coconut Meat', benefits: 'MCTs for a metabolism boost and instant hydration.' },
      { name: 'Organic Chia Seeds', benefits: 'Omega-3 powerhouses for hydration and endurance.' },
      { name: 'Organic Pumpkin Seeds', benefits: 'Zinc and magnesium for mood balance and immunity.' },
    ],
  },
  {
    title: 'The Mood Lifters',
    subtitle: 'Cacao & Coffee',
    description: 'Focus, flavor, and just enough edge to feel productive without the panic.',
    emoji: '🍫',
    ingredients: [
      { name: 'Organic Cacao Powder & Nibs', benefits: 'Flavonoids for bliss, focus, and a natural mood boost.' },
      { name: 'Organic Brewed Coffee & Extract', benefits: 'Clean caffeine for clarity without the jitters.' },
    ],
  },
  {
    title: 'The Secret Weapons',
    subtitle: 'Mushrooms',
    description: 'Ancient wisdom for a modern glow. Brain support, immune strength, and calm energy.',
    emoji: '🍄',
    ingredients: [
      { name: "Organic Lion's Mane", benefits: 'The brain mushroom—for razor-sharp mental clarity.' },
      { name: 'Organic Chaga', benefits: 'A powerhouse shield for your immune system.' },
      { name: 'Organic Reishi', benefits: 'The chill pill of nature for stress relief and balance.' },
    ],
  },
  {
    title: 'The Wellness Flex',
    subtitle: 'Botanicals',
    description: 'Adaptogenic balance and warming spices to set the vibe.',
    emoji: '🌿',
    ingredients: [
      { name: 'Organic Maca Root', benefits: 'An adaptogen for hormone balance, energy, and libido.' },
      { name: 'Organic Ginger', benefits: 'A spicy kick to soothe digestion and boost immunity.' },
      { name: 'Organic Cinnamon', benefits: 'Warming spice that helps balance blood sugar.' },
      { name: 'Organic Vanilla Extract', benefits: 'Aromatic calm that soothes the senses.' },
    ],
  },
  {
    title: 'The Finish',
    subtitle: 'Enhancers',
    description: 'Small touches, massive impact.',
    emoji: '🍋',
    ingredients: [
      { name: 'Organic Lemon Juice', benefits: 'Alkaline balance to detoxify and brighten.' },
      { name: 'Organic Sea Salt', benefits: 'Essential minerals for superior hydration.' },
    ],
  },
  {
    title: 'The Canvas',
    subtitle: 'Base Liquids',
    description: 'Choose your vibe—creamy, light, or tropical.',
    emoji: '🥛',
    ingredients: [
      { name: 'Organic Almond, Oat, or Coconut Milk', benefits: 'Dairy-free creaminess.' },
      { name: 'Filtered Water', benefits: 'Clean, pure hydration.' },
    ],
  },
  {
    title: 'The Power Source',
    subtitle: 'Protein',
    description: 'Lean, clean, and mean. Build muscle and stay satisfied.',
    emoji: '🧬',
    ingredients: [
      { name: 'Organic Pea Protein', benefits: 'Complete plant-based amino acids for recovery.' },
      { name: 'Organic Chia Protein', benefits: 'Fiber-dense protein to keep you full for hours.' },
    ],
  },
];

const PROMISES = [
  { title: 'No Artificial Flavors', description: "Only real ingredients that you can actually pronounce. If your grandma wouldn't recognize it, neither do we." },
  { title: 'No Added Sugars', description: "All the sweetness comes from real fruits. Mother Nature did the work—we just blended it." },
  { title: 'No Preservatives', description: 'Flash-frozen at peak freshness to lock in nutrients naturally. Science, not chemicals.' },
  { title: 'Non-GMO Verified', description: "Every single ingredient is certified non-GMO. We're picky so you don't have to be." },
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
            <div style={{ marginBottom: 'clamp(48px, 6vw, 64px)', textAlign: 'center' }}>
              <span style={{
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                THE INGREDIENT LIST
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Full Transparency. Pure Obsession.
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '600px',
                margin: '0 auto',
              }}>
                We don't do secrets. We do potent, premium ingredients that love your body back. Here's exactly what's fueling your glow.
              </p>
            </div>
          </AnimatedSection>

          {INGREDIENT_CATEGORIES.map((category, categoryIndex) => (
            <AnimatedSection key={category.title} animation="fadeUp" delay={categoryIndex * 50}>
              <div style={{
                marginBottom: 'clamp(40px, 5vw, 56px)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px',
                }}>
                  <span style={{ fontSize: '24px' }}>{category.emoji}</span>
                  <h2 style={{
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                    fontWeight: 500,
                    color: '#ffffff',
                  }}>
                    {category.title}
                  </h2>
                  <span style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--color-text-tertiary)',
                    fontWeight: 400,
                  }}>
                    ({category.subtitle})
                  </span>
                </div>
                <p style={{
                  fontSize: 'var(--fs-small)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '20px',
                  maxWidth: '600px',
                }}>
                  {category.description}
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                  gap: '12px',
                }}>
                  {category.ingredients.map((ingredient, index) => (
                    <div
                      key={ingredient.name}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '12px',
                        padding: '16px 18px',
                      }}
                    >
                      <h3 style={{
                        fontSize: 'var(--fs-body)',
                        fontWeight: 500,
                        color: '#ffffff',
                        marginBottom: '6px',
                      }}>
                        {ingredient.name}
                      </h3>
                      <p style={{
                        fontSize: 'var(--fs-small)',
                        color: 'var(--color-text-secondary)',
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
                  <p style={{ marginBottom: '12px' }}><strong style={{ color: '#ffffff' }}>May Contain:</strong> Tree nuts (almonds, cashews, hazelnuts), soy</p>
                  <p style={{ marginBottom: '12px' }}><strong style={{ color: '#ffffff' }}>Gluten-Free Options:</strong> All smoothies except Coffee Kick are certified gluten-free.</p>
                  <p style={{ marginBottom: '20px' }}><strong style={{ color: '#ffffff' }}>Vegan Options:</strong> All smoothies are 100% plant-based.</p>
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
