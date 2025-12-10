import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

const VALUES = [
  { title: 'Human First', description: 'We believe in real connections. Every smoothie is crafted with love for real people.' },
  { title: 'Flavor Obsessed', description: 'Life is too short for boring food. We make every sip an explosion of natural taste.' },
  { title: 'Health Driven', description: 'Clean ingredients, no compromises. Your body deserves the best nature has to offer.' },
  { title: 'Energy Packed', description: 'Power your day with nutrients that actually work. Feel the difference in every blend.' },
  { title: 'Fun Always', description: 'Wellness should be joyful. We bring the party to your daily nutrition routine.' },
  { title: 'Sustainability', description: 'We care for the planet as much as we care for you. Every choice matters.' },
];

const STATS = [
  { number: '50K+', label: 'Happy Customers' },
  { number: '1M+', label: 'Smoothies Shipped' },
  { number: '100%', label: 'Organic Ingredients' },
  { number: '4.9', label: 'Average Rating' },
];

export default function About() {
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
                ABOUT US
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                We're Drizzl
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
              }}>
                On a mission to make wellness feel as good as it tastes.
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
            gap: 'clamp(32px, 5vw, 60px)',
            alignItems: 'center',
            marginBottom: 'clamp(48px, 8vw, 80px)',
          }}>
            <AnimatedSection animation="fadeUp">
              <div>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  marginBottom: '24px',
                  lineHeight: 1.3,
                }}>
                  It started with a question
                </h2>
                <p style={{
                  fontSize: 'var(--fs-body)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.8,
                  marginBottom: '20px',
                }}>
                  Why does healthy food have to taste like cardboard? We refused to accept that trade-off.
                </p>
                <p style={{
                  fontSize: 'var(--fs-body)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.8,
                  marginBottom: '20px',
                }}>
                  In 2020, our founder was tired of choosing between convenience and nutrition. Every morning was the same struggle—grab something quick that tasted good but wasn't great for you, or spend an hour prepping something healthy that... well, let's just say it was an acquired taste.
                </p>
                <p style={{
                  fontSize: 'var(--fs-body)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.8,
                }}>
                  There had to be a better way. And that's when Drizzl was born.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={100}>
              <div style={{
                aspectRatio: '4/3',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: '64px', opacity: 0.3 }}>🥤</span>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section style={{
          background: '#0a0a0a',
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeUp">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '24px',
                textAlign: 'center',
              }}>
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <p style={{
                      fontSize: 'clamp(2rem, 4vw, 3rem)',
                      fontWeight: 300,
                      color: '#ffffff',
                      marginBottom: '8px',
                    }}>
                      {stat.number}
                    </p>
                    <p style={{
                      fontSize: 'var(--fs-small)',
                      color: 'var(--color-text-tertiary)',
                      letterSpacing: '0.05em',
                    }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section style={{
          background: '#000000',
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeUp">
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '14px',
                padding: '32px',
                marginBottom: '48px',
                border: '1px solid rgba(255,255,255,0.06)',
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

            <AnimatedSection animation="fadeUp" delay={100}>
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
                  Our Values
                </h2>
                <p style={{
                  fontSize: 'var(--fs-body)',
                  color: 'var(--color-text-secondary)',
                }}>
                  The principles that guide everything we do
                </p>
              </div>
            </AnimatedSection>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap: '16px',
            }}>
              {VALUES.map((value, index) => (
                <AnimatedSection key={value.title} animation="fadeUp" delay={index * 80}>
                  <div style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px',
                    padding: '24px 20px',
                    textAlign: 'center',
                  }}>
                    <h3 style={{
                      fontSize: 'var(--fs-h4)',
                      fontWeight: 500,
                      color: '#ffffff',
                      marginBottom: '8px',
                    }}>
                      {value.title}
                    </h3>
                    <p style={{
                      fontSize: 'var(--fs-small)',
                      color: 'var(--color-text-tertiary)',
                      lineHeight: 1.6,
                    }}>
                      {value.description}
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
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <AnimatedSection animation="fadeUp">
              <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 300,
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Join the Journey
              </h2>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
                marginBottom: '24px',
                lineHeight: 1.6,
              }}>
                Ready to taste the difference? Start your wellness journey today.
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
                Taste the Difference
              </Link>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
