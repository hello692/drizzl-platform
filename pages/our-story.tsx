import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

export default function OurStory() {
  return (
    <>
      <Navbar />
      
      <main style={{ background: '#000000', minHeight: '100vh', paddingTop: '120px' }}>
        <section style={{
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ marginBottom: 'clamp(48px, 8vw, 80px)' }}>
              <span style={{
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                OUR STORY
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '24px',
              }}>
                Spoiler: It's Delicious
              </h1>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <div style={{ marginBottom: '48px' }}>
              <p style={{
                fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
                marginBottom: '24px',
              }}>
                It all started with a simple question: Why does healthy food have to taste like cardboard?
              </p>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
                marginBottom: '24px',
              }}>
                In 2020, our founder was tired of choosing between convenience and nutrition. Every morning was the same struggle—grab something quick that tasted good but wasn't great for you, or spend an hour prepping something healthy that... well, let's just say it was an acquired taste.
              </p>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
                marginBottom: '24px',
              }}>
                There had to be a better way. And that's when Drizzl was born.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={150}>
            <div style={{
              background: '#0a0a0a',
              borderRadius: '14px',
              padding: '32px',
              marginBottom: '48px',
            }}>
              <h2 style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: 500,
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                The Mission
              </h2>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
              }}>
                We set out to create smoothies that you'd actually crave. Not tolerate. Not choke down because they're "good for you." Actually look forward to drinking. We source the freshest organic ingredients, partner with local farms, and obsess over every flavor profile until it's absolutely perfect.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={200}>
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: 'var(--fs-h3)',
                fontWeight: 500,
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Where We Are Today
              </h2>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
                marginBottom: '24px',
              }}>
                Today, we serve thousands of happy customers across the country. Our smoothies are in gyms, offices, and refrigerators from coast to coast. But we're still that same team of flavor fanatics who refuse to compromise on taste or quality.
              </p>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
              }}>
                Every smoothie we make is still crafted with the same love and attention as day one. Because being healthy shouldn't suck. And neither should your smoothie.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={250}>
            <div style={{ textAlign: 'center', paddingTop: '32px' }}>
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
                Taste the Difference
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
