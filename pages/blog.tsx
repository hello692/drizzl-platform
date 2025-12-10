import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

const POSTS = [
  {
    title: '5 Reasons to Start Your Day with a Smoothie',
    excerpt: 'Discover the health benefits of incorporating smoothies into your morning routine.',
    date: '2024-01-15',
    category: 'Wellness',
  },
  {
    title: 'Organic Ingredients: Why They Matter',
    excerpt: 'Learn about the importance of choosing organic foods for your health and the environment.',
    date: '2024-01-10',
    category: 'Ingredients',
  },
  {
    title: 'Quick Breakfast Bowl Recipes',
    excerpt: 'Explore delicious and easy recipes for healthy breakfast bowls.',
    date: '2024-01-05',
    category: 'Recipes',
  },
  {
    title: 'The Science of Superfoods',
    excerpt: 'Understanding what makes certain ingredients so beneficial for your body.',
    date: '2024-01-01',
    category: 'Science',
  },
  {
    title: 'How to Build the Perfect Smoothie',
    excerpt: 'A guide to balancing flavors, textures, and nutrients in every blend.',
    date: '2023-12-28',
    category: 'Tips',
  },
  {
    title: 'Meal Prep Made Easy with Smoothies',
    excerpt: 'Save time and stay healthy with these simple meal prep strategies.',
    date: '2023-12-20',
    category: 'Lifestyle',
  },
];

export default function Blog() {
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
                BLOG & RECIPES
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Sip, Blend, Repeat
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
              }}>
                Tips, recipes, and wellness inspiration to help you live your best life.
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
            gap: '16px',
          }}>
            {POSTS.map((post, index) => (
              <AnimatedSection key={post.title} animation="fadeUp" delay={index * 80}>
                <article style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '24px 20px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: 'var(--fs-label)',
                      color: 'var(--color-text-tertiary)',
                      letterSpacing: '0.05em',
                    }}>
                      {post.category}
                    </span>
                    <span style={{
                      fontSize: 'var(--fs-label)',
                      color: 'var(--color-text-tertiary)',
                    }}>
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 style={{
                    fontSize: 'var(--fs-h4)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: '12px',
                    lineHeight: 1.3,
                  }}>
                    {post.title}
                  </h2>
                  <p style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--color-text-tertiary)',
                    lineHeight: 1.6,
                    flex: 1,
                    marginBottom: '16px',
                  }}>
                    {post.excerpt}
                  </p>
                  <span style={{
                    fontSize: 'var(--fs-small)',
                    fontWeight: 500,
                    color: '#ffffff',
                    borderBottom: '1px solid rgba(255,255,255,0.3)',
                    paddingBottom: '2px',
                    alignSelf: 'flex-start',
                  }}>
                    Read More
                  </span>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
