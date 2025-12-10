import PageLayout, { PageHero, PageSection, SectionHeader, AnimatedSection } from '../components/PageLayout';
import Link from 'next/link';

const INGREDIENTS = [
  { name: 'Organic Spinach', source: 'California, USA', benefits: 'Rich in iron, vitamins A & K, and antioxidants for energy and immunity.', icon: '🥬', color: '#22c55e' },
  { name: 'Wild Blueberries', source: 'Maine, USA', benefits: 'Packed with anthocyanins for brain health and anti-aging properties.', icon: '🫐', color: '#6366f1' },
  { name: 'Grass-Fed Whey', source: 'New Zealand', benefits: 'Premium protein for muscle recovery with no artificial hormones.', icon: '💪', color: '#f59e0b' },
  { name: 'Coconut Water', source: 'Thailand', benefits: 'Natural electrolytes for hydration without added sugars.', icon: '🥥', color: '#84cc16' },
  { name: 'Chia Seeds', source: 'Peru', benefits: 'Omega-3 fatty acids, fiber, and protein for sustained energy.', icon: '🌱', color: '#14b8a6' },
  { name: 'Organic Mango', source: 'Mexico', benefits: 'Vitamin C and digestive enzymes for gut health.', icon: '🥭', color: '#f97316' },
  { name: 'Almond Butter', source: 'California, USA', benefits: 'Healthy fats and vitamin E for heart health and satiety.', icon: '🌰', color: '#a3a3a3' },
  { name: 'Acai Berries', source: 'Brazil', benefits: 'Super antioxidant for skin health and cellular protection.', icon: '🍇', color: '#7c3aed' },
  { name: 'Raw Cacao', source: 'Ecuador', benefits: 'Mood-boosting flavonoids and natural energy without the crash.', icon: '🍫', color: '#78350f' },
  { name: 'Turmeric', source: 'India', benefits: 'Anti-inflammatory curcumin for joint health and recovery.', icon: '✨', color: '#eab308' },
  { name: 'Organic Banana', source: 'Costa Rica', benefits: 'Natural potassium and prebiotics for digestive health.', icon: '🍌', color: '#fde047' },
  { name: 'Greek Yogurt', source: 'Vermont, USA', benefits: 'Probiotics and protein for gut health and muscle building.', icon: '🥛', color: '#e5e7eb' },
];

const PROMISES = [
  { title: 'No Artificial Flavors', description: 'Only real ingredients that you can pronounce.' },
  { title: 'No Added Sugars', description: 'Natural sweetness from real fruits only.' },
  { title: 'No Preservatives', description: 'Flash-frozen to lock in freshness naturally.' },
  { title: 'Non-GMO Verified', description: 'All ingredients are certified non-GMO.' },
];

export default function Ingredients() {
  return (
    <PageLayout>
      <PageHero
        badge="Pure & Simple"
        badgeColor="linear-gradient(135deg, #22c55e, #14b8a6)"
        title="What Goes in Every Cup"
        subtitle="We believe you deserve to know exactly what you're putting in your body."
      />
      
      <PageSection background="white">
        <SectionHeader
          centered
          title="Our Ingredient Philosophy"
          subtitle="Quality you can taste, transparency you can trust"
        />
        
        <div style={{ maxWidth: '800px', margin: '0 auto 48px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#444' }}>
            Every Drizzl smoothie starts with ingredients we'd serve to our own families. We source directly from trusted farms around the world, prioritizing organic and sustainable practices. No shortcuts, no compromises—just pure, delicious nutrition.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {INGREDIENTS.map((ingredient, index) => (
            <AnimatedSection key={ingredient.name} animation="fadeUp" delay={index * 50}>
              <div className="tiktok-card" style={{ height: '100%' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px',
                  marginBottom: '16px',
                }}>
                  <span style={{ 
                    fontSize: '36px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: `${ingredient.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {ingredient.icon}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{ingredient.name}</h3>
                    <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Sourced from {ingredient.source}</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', margin: 0 }}>
                  {ingredient.benefits}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </PageSection>

      <PageSection background="cream">
        <SectionHeader
          centered
          title="Our Promise to You"
          subtitle="The Drizzl commitment"
        />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {PROMISES.map((promise, index) => (
            <AnimatedSection key={promise.title} animation="fadeUp" delay={index * 100}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e, #14b8a6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '32px',
                  color: '#fff',
                }}>
                  ✓
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{promise.title}</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>{promise.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </PageSection>

      <PageSection background="white">
        <div style={{ 
          background: '#fef3c7', 
          borderRadius: '24px', 
          padding: '40px',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <SectionHeader
            centered
            title="Allergen Information"
            subtitle="We care about your dietary needs"
          />
          <div style={{ fontSize: '15px', color: '#444', lineHeight: '1.8' }}>
            <p><strong>May Contain:</strong> Tree nuts (almonds, cashews), dairy (whey protein, Greek yogurt), soy</p>
            <p><strong>Gluten-Free Options:</strong> All smoothies except Coffee Kick are certified gluten-free.</p>
            <p><strong>Vegan Options:</strong> Green Machine, Tropical Paradise, Dragon Fruit Dream, and Pineapple Express are 100% plant-based.</p>
            <p style={{ marginTop: '20px' }}>
              Questions about specific allergens? <Link href="/contact" style={{ color: '#16a34a', fontWeight: '600' }}>Contact us</Link> and we'll help you find the perfect smoothie for your needs.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection background="black">
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
            Taste the Difference
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>
            Ready to fuel your day with real ingredients?
          </p>
          <Link 
            href="/collections/smoothies"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #22c55e, #14b8a6)',
              color: '#fff',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '16px',
              textDecoration: 'none',
            }}
          >
            Shop Smoothies
          </Link>
        </div>
      </PageSection>
    </PageLayout>
  );
}
