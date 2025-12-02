import PageLayout, { PageHero, PageSection, SectionHeader, AnimatedSection } from '../components/PageLayout';
import Link from 'next/link';

const VALUES = [
  { emoji: '❤️', title: 'Human First', description: 'We believe in real connections. Every smoothie is crafted with love for real people.' },
  { emoji: '🍓', title: 'Flavor Obsessed', description: 'Life is too short for boring food. We make every sip an explosion of natural taste.' },
  { emoji: '💪', title: 'Health Driven', description: 'Clean ingredients, no compromises. Your body deserves the best nature has to offer.' },
  { emoji: '⚡', title: 'Energy Packed', description: 'Power your day with nutrients that actually work. Feel the difference in every blend.' },
  { emoji: '🎉', title: 'Fun Always', description: 'Wellness should be joyful. We bring the party to your daily nutrition routine.' },
  { emoji: '🌈', title: 'Color Forward', description: 'We celebrate the vibrant colors of real fruits and vegetables in everything we do.' },
];

const TEAM = [
  { name: 'Sarah Chen', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300', quote: 'Wellness should feel good.' },
  { name: 'Marcus Johnson', role: 'Head of Product', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', quote: 'Every flavor tells a story.' },
  { name: 'Emily Rodriguez', role: 'Nutrition Lead', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300', quote: 'Science meets delicious.' },
];

export default function About() {
  return (
    <PageLayout>
      <PageHero
        badge="Our Story"
        badgeColor="linear-gradient(135deg, #6B5CE7, #FF4F7B)"
        title="We're Drizzl"
        subtitle="On a mission to make wellness feel as good as it tastes."
      />
      
      <PageSection background="white">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <AnimatedSection animation="slideRight">
            <h2 className="tiktok-heading" style={{ marginBottom: '24px' }}>
              It started with a <span className="tiktok-heading-gradient">question</span>
            </h2>
            <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#444', marginBottom: '20px' }}>
              Why does healthy food have to taste like cardboard? We refused to accept that trade-off.
            </p>
            <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#444', marginBottom: '20px' }}>
              In 2020, we set out to prove that you can have it all: vibrant flavors, clean ingredients, and real convenience. No more choosing between what's good for you and what tastes good.
            </p>
            <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#444' }}>
              Today, we're proud to serve thousands of happy customers who've discovered that wellness can be delicious.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="slideLeft">
            <div className="tiktok-image-reveal" style={{ borderRadius: '24px', overflow: 'hidden' }}>
              <img 
                src="https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600" 
                alt="Fresh fruits and smoothies"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </div>
          </AnimatedSection>
        </div>
      </PageSection>
      
      <PageSection background="cream">
        <SectionHeader
          centered
          title="Our Values"
          subtitle="The principles that guide everything we do"
        />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {VALUES.map((value, index) => (
            <AnimatedSection key={value.title} animation="fadeUp" delay={index * 100}>
              <div className="tiktok-card" style={{ textAlign: 'center', height: '100%' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>{value.emoji}</span>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{value.title}</h3>
                <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6' }}>{value.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </PageSection>

      <PageSection background="light">
        <AnimatedSection animation="fadeUp">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '40px',
            textAlign: 'center',
            padding: '40px 0'
          }}>
            <div className="tiktok-stat">
              <div className="tiktok-stat-number">50K+</div>
              <div className="tiktok-stat-label">Happy Customers</div>
            </div>
            <div className="tiktok-stat">
              <div className="tiktok-stat-number">1M+</div>
              <div className="tiktok-stat-label">Smoothies Shipped</div>
            </div>
            <div className="tiktok-stat">
              <div className="tiktok-stat-number">100%</div>
              <div className="tiktok-stat-label">Organic Ingredients</div>
            </div>
            <div className="tiktok-stat">
              <div className="tiktok-stat-number">4.9★</div>
              <div className="tiktok-stat-label">Average Rating</div>
            </div>
          </div>
        </AnimatedSection>
      </PageSection>
      
      <PageSection background="white">
        <SectionHeader
          centered
          emoji="👋"
          title="Meet the Team"
          subtitle="The humans behind Drizzl"
        />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px',
        }}>
          {TEAM.map((member, index) => (
            <AnimatedSection key={member.name} animation="fadeUp" delay={index * 120}>
              <div style={{ textAlign: 'center' }}>
                <div className="tiktok-image-reveal" style={{ 
                  borderRadius: '50%', 
                  overflow: 'hidden',
                  width: '200px',
                  height: '200px',
                  margin: '0 auto 24px',
                }}>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{member.name}</h3>
                <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>{member.role}</p>
                <p style={{ 
                  fontSize: '15px', 
                  color: '#666', 
                  fontStyle: 'italic',
                  background: 'linear-gradient(135deg, #FF8A4B, #FF4F7B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  "{member.quote}"
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </PageSection>
      
      <PageSection background="cream">
        <AnimatedSection animation="fadeUp" style={{ textAlign: 'center', padding: '60px 0' }}>
          <h2 className="tiktok-heading" style={{ marginBottom: '16px' }}>
            Ready to join the <span className="tiktok-heading-gradient">movement</span>?
          </h2>
          <p className="tiktok-subheading" style={{ margin: '0 auto 32px' }}>
            Try your first smoothie and feel the Drizzl difference
          </p>
          <Link href="/products" className="tiktok-button tiktok-button-gradient">
            Start Shopping
          </Link>
        </AnimatedSection>
      </PageSection>
    </PageLayout>
  );
}
