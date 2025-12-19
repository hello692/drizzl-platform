import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

const INGREDIENT_CATEGORIES = [
  {
    title: 'Fruits & Exotic Fruits',
    tagline: 'The flavor. The antioxidants. The pure joy.',
    ingredients: [
      { name: 'Organic Banana', benefits: 'Creamy comfort fuel for natural energy.' },
      { name: 'Organic Strawberry', benefits: 'A sweet, blushing kiss of Vitamin C.' },
      { name: 'Organic Raspberry', benefits: 'Tangy, fiber-rich love for your gut.' },
      { name: 'Organic Blueberry', benefits: 'Tiny, brilliant antioxidants for a sharp mind.' },
      { name: 'Organic Blackberry', benefits: 'Deep, dark berry power for skin that glows.' },
      { name: 'Organic Mango', benefits: 'Tropical sunshine in every sip.' },
      { name: 'Organic Pineapple', benefits: 'Juicy, golden enzymes to banish the bloat.' },
      { name: 'Organic Orange', benefits: 'A bright citrus wake-up call for your immunity.' },
      { name: 'Organic Passion Fruit', benefits: 'Tart, exotic energy that pops.' },
      { name: 'Organic Acai Berry', benefits: 'Antioxidant royalty for a deep, cellular glow.' },
      { name: 'Organic Dates', benefits: "Nature's caramel. Sweetness without the crash." },
      { name: 'Organic Watermelon', benefits: 'Refreshing, hydrating, and effortlessly cool.' },
      { name: 'Organic Dragon Fruit (Pitaya)', benefits: 'Vibrant pink fiber for a happy belly.' },
      { name: 'Organic Acerola Cherry', benefits: 'A potent Vitamin C powerhouse.' },
      { name: 'Organic Goji Berry', benefits: 'The longevity fruit for bright eyes and skin.' },
      { name: 'Organic Golden Berry', benefits: 'A tart little jewel packed with antioxidants.' },
      { name: 'Organic Pomegranate', benefits: 'Ruby-red gems for serious heart support.' },
      { name: 'Organic Papaya', benefits: 'Tropical ease for a calm, happy digestion.' },
      { name: 'Organic Guava', benefits: 'A tropical overload of fiber and Vitamin C.' },
      { name: 'Organic Fig', benefits: 'Gentle sweetness and deep gut support.' },
      { name: 'Organic Cherry', benefits: 'Your post-workout recovery treat.' },
      { name: 'Organic Apple', benefits: 'Crisp, familiar sweetness and fiber balance.' },
      { name: 'Organic Pear', benefits: 'Soft, juicy, and kind to your system.' },
      { name: 'Organic Lemon', benefits: 'A bright, acidic pop of Vitamin C.' },
      { name: 'Organic Lime', benefits: 'Clean, zesty lift to keep things fresh.' },
    ],
  },
  {
    title: 'Vegetables & Greens',
    tagline: 'The glow crew.',
    ingredients: [
      { name: 'Organic Spinach', benefits: 'Your daily dose of iron-rich strength.' },
      { name: 'Organic Baby Spinach', benefits: 'Gentle greens for easy, invisible nutrition.' },
      { name: 'Organic Kale', benefits: 'The nutrient-dense detox queen.' },
      { name: 'Organic Cauliflower', benefits: 'The secret to a creamy texture and a fiber boost.' },
      { name: 'Organic Zucchini', benefits: 'Light, hydrating body for a smooth sip.' },
      { name: 'Organic Sweet Potato', benefits: 'Complex carbs for energy that stays with you.' },
      { name: 'Organic Carrot', benefits: 'Beta-carotene for a glow that starts within.' },
      { name: 'Organic Beet', benefits: 'Earthy sweetness for better circulation.' },
      { name: 'Organic Celery', benefits: 'Crisp mineral hydration.' },
      { name: 'Organic Cucumber', benefits: 'The ultimate cooling hydrator.' },
    ],
  },
  {
    title: 'Grains, Fiber & Legumes',
    tagline: 'Stay-full fuel.',
    ingredients: [
      { name: 'Organic Rolled Oats', benefits: 'Slow-release energy to power your day.' },
      { name: 'Organic Oat Fiber', benefits: 'The secret to total gut happiness.' },
      { name: 'Organic Quinoa', benefits: 'A complete plant protein for holistic fuel.' },
      { name: 'Organic Brown Rice', benefits: 'Clean, gentle carbs for steady energy.' },
      { name: 'Organic Chickpeas', benefits: 'Creamy protein and fiber that satisfies.' },
    ],
  },
  {
    title: 'Nuts, Seeds & Butters',
    tagline: 'Creamy MVPs.',
    ingredients: [
      { name: 'Organic Almonds', benefits: 'Vitamin E support for skin that shines.' },
      { name: 'Organic Almond Butter', benefits: 'Smooth energy and healthy fats.' },
      { name: 'Organic Cashews', benefits: 'Rich, creamy, and undeniably decadent.' },
      { name: 'Organic Hazelnuts', benefits: 'Heart-friendly fats with a luxe flavor.' },
      { name: 'Organic Coconut Meat', benefits: 'Clean tropical fats for a metabolism boost.' },
      { name: 'Organic Chia Seeds', benefits: 'A tiny powerhouse of fiber and omega-3s.' },
      { name: 'Organic Flax Seeds', benefits: 'Essential support for hormones and digestion.' },
      { name: 'Organic Hemp Seeds', benefits: 'Complete plant protein for effortless strength.' },
      { name: 'Organic Pumpkin Seeds', benefits: 'Zinc and mineral strength for a mood lift.' },
      { name: 'Organic Sunflower Seeds', benefits: 'Simply sunny Vitamin E support.' },
    ],
  },
  {
    title: 'Cacao, Coffee & Tea',
    tagline: 'Mood + Focus.',
    ingredients: [
      { name: 'Organic Cacao Powder', benefits: 'A mood lift that feels like a crush.' },
      { name: 'Organic Cacao Nibs', benefits: 'Crunchy antioxidants for pure heart health.' },
      { name: 'Organic Brewed Coffee', benefits: 'Smooth alertness to get you moving.' },
      { name: 'Organic Coffee Extract', benefits: 'Clean, concentrated energy.' },
      { name: 'Organic Ceremonial Matcha', benefits: 'Calm, steady focus for a zen mind.' },
    ],
  },
  {
    title: 'Functional Mushrooms',
    tagline: 'The Drizzl Stack.',
    ingredients: [
      { name: "Organic Lion's Mane", benefits: 'Razor-sharp focus and clarity.' },
      { name: 'Organic Chaga', benefits: 'Your daily immune defense shield.' },
      { name: 'Organic Reishi', benefits: 'The "chill pill" for calm recovery.' },
      { name: 'Organic Cordyceps', benefits: 'Natural stamina for breathless moments.' },
      { name: 'Organic Turkey Tail', benefits: 'Harmony for your gut and immunity.' },
      { name: 'Organic Maitake', benefits: 'Balance for your metabolism.' },
      { name: 'Organic Shiitake', benefits: 'Support for a happy heart.' },
      { name: 'Organic Tremella (Snow Mushroom)', benefits: 'Deep hydration for dewy skin.' },
      { name: 'Organic Agaricus Blazei', benefits: 'Resilience for your immune system.' },
      { name: 'Organic Enoki', benefits: 'Antioxidant support for a deep detox.' },
    ],
  },
  {
    title: 'Botanicals, Roots & Adaptogens',
    tagline: 'The wellness flex.',
    ingredients: [
      { name: 'Organic Maca Root', benefits: 'Balanced energy and a little fire.' },
      { name: 'Organic Ginger', benefits: 'Spicy warmth to soothe digestion.' },
      { name: 'Organic Cinnamon', benefits: 'Sweet spice for blood sugar balance.' },
      { name: 'Organic Turmeric', benefits: 'Golden support for inflammation balance.' },
      { name: 'Organic Ashwagandha', benefits: 'Stress support for a calmer you.' },
      { name: 'Organic Ginseng', benefits: 'Mental stamina for the long haul.' },
      { name: 'Organic Vanilla Extract', benefits: 'Aromatic comfort and sweetness.' },
      { name: 'Organic Mint', benefits: 'Cooling freshness that lingers.' },
    ],
  },
  {
    title: 'Natural Acids & Minerals',
    tagline: 'The finishing touch.',
    ingredients: [
      { name: 'Organic Lemon Juice', benefits: 'A pop of flavor to brighten the blend.' },
      { name: 'Organic Sea Salt', benefits: 'Essential minerals for balance.' },
    ],
  },
  {
    title: 'Base Liquids',
    tagline: 'The canvas.',
    ingredients: [
      { name: 'Organic Almond Milk', benefits: 'Creamy, dairy-free perfection.' },
      { name: 'Organic Oat Milk', benefits: 'Smooth, mild, and comforting.' },
      { name: 'Organic Coconut Milk', benefits: 'Rich, tropical body.' },
      { name: 'Filtered Water', benefits: 'Pure, clean hydration.' },
    ],
  },
  {
    title: 'Protein & Functional Add-Ins',
    tagline: 'The power source.',
    ingredients: [
      { name: 'Organic Pea Protein', benefits: 'Clean plant fuel for your muscles.' },
      { name: 'Organic Brown Rice Protein', benefits: 'Gentle, complete protein.' },
      { name: 'Organic Chia Protein', benefits: 'Fiber-rich fullness that lasts.' },
      { name: 'Organic Pumpkin Seed Protein', benefits: 'Mineral-dense strength.' },
    ],
  },
  {
    title: 'Superfoods (Full Stack)',
    tagline: 'The extra magic.',
    ingredients: [
      { name: 'Organic Acai', benefits: 'For an antioxidant glow.' },
      { name: 'Organic Matcha', benefits: 'For calm, collected alertness.' },
      { name: 'Organic Maca', benefits: 'For energy that feels balanced.' },
      { name: 'Organic Cacao', benefits: 'To elevate your mood naturally.' },
      { name: 'Organic Chia', benefits: 'For essential omega-3 support.' },
      { name: 'Organic Goji', benefits: 'For longevity and vitality.' },
      { name: 'Organic Acerola', benefits: 'For a massive Vitamin C boost.' },
      { name: 'Organic Dragon Fruit', benefits: 'For gut-friendly fiber and color.' },
      { name: 'Organic Turmeric', benefits: 'For golden, anti-inflammatory balance.' },
      { name: 'Organic Ginger', benefits: 'For digestive comfort.' },
      { name: 'Organic Cinnamon', benefits: 'For metabolic support.' },
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
                THE GLOSSARY OF GLOW
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
                maxWidth: '600px',
                margin: '0 auto',
              }}>
                We're obsessed with what's inside. That's why we've curated a library of the world's most potent, beautiful, and delicious whole-food ingredients. This isn't just a list; it's our love language.
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
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.5)',
                      lineHeight: 1.5,
                      marginTop: '8px',
                      fontStyle: 'italic',
                    }}>
                      {category.tagline}
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
                          gridTemplateColumns: 'minmax(200px, 1fr) 2fr',
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
    </>
  );
}
