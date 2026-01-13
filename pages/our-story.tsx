import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';
import { MorphingTextReveal } from '../components/ui/morphing-text-reveal';
import { InfiniteSlider } from '../components/ui/infinite-slider';
import { useRef, useEffect } from 'react';

const VALUES = [
  { title: 'Human First', description: 'Made for you, not some marketing spreadsheet.' },
  { title: 'Flavor Obsessed', description: 'If it\'s not delicious, it\'s dead to us.' },
  { title: 'Clean Ingredients Only', description: 'No shady secrets, just pure goodness.' },
  { title: 'Energy-Packed', description: 'Fuel that makes you feel unstoppable.' },
  { title: 'Fun Always', description: 'Wellness should be a vibe, not a chore.' },
  { title: 'Planet-Loving', description: 'Sustainability is sexy, and we\'re all about it.' },
];

const STATS = [
  { number: '90%+', label: 'Organic', detail: 'Because you\'re a whole snack and deserve the best' },
  { number: '🔥', label: 'Already Turning Heads', detail: 'Hotter than your ex\'s texts (and way more reliable)' },
  { number: '🧑‍🍳', label: 'Crafted', detail: 'By flavor-obsessed perfectionists who live for your glow-up' },
];

export default function OurStory() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  return (
    <>
      <Navbar />
      
      <main style={{ background: '#000000', minHeight: '100vh' }}>
        <section className="about-manifesto">
          <div className="manifesto-content">
            <h1 className="manifesto-title">Crave the Science. Taste the Obsession.</h1>
            <div className="manifesto-morphing">
              <span className="manifesto-prefix">We exist to </span>
              <MorphingTextReveal 
                texts={[
                  "make your biology blush.",
                  "turn wellness into an obsession.",
                  "capture nature at its climax.",
                  "flash-freeze flavor at its peak.",
                  "blend functional foods that flirt with your cells.",
                  "serve vibrancy, not just calories.",
                  "make you feel unstoppable.",
                  "be craved."
                ]}
                interval={3500}
                glitchOnHover={true}
              />
            </div>
          </div>
        </section>

        {/* Press Mentions - Top Slider */}
        <section style={{
          background: '#000000',
          padding: '20px 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            overflow: 'hidden',
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}>
            <InfiniteSlider gap={60} speed={35} speedOnHover={80}>
              {['SUGAR NEEDED', 'NON-GMO, NON-STOP', 'PLANT POWERED, WORLD READY', 'VEGAN AND EXTRA', "GLUTEN? NOT ON THE LIST", 'BORN ORGANIC, BUILT TO SLAY', "DAIRY? WE DON'T KNOW HER"].map((text) => (
                <span key={text} style={{
                  fontSize: 'clamp(11px, 1.5vw, 13px)',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  whiteSpace: 'nowrap',
                }}>
                  {text}
                </span>
              ))}
            </InfiniteSlider>
          </div>
        </section>

        {/* Press Logos - Bottom Slider */}
        <section style={{
          background: '#000000',
          padding: '24px 0',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            overflow: 'hidden',
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}>
            <InfiniteSlider gap={80} speed={45} speedOnHover={90} reverse>
              {[
                { name: 'BUSINESS INSIDER', style: 'serif' },
                { name: 'Forbes', style: 'italic' },
                { name: 'The Guardian', style: 'serif' },
                { name: 'Inc. Best Workplaces', style: 'normal' },
                { name: 'TODAY', style: 'bold' },
                { name: 'BUSINESS INSIDER', style: 'serif' },
                { name: 'Forbes', style: 'italic' },
                { name: 'The Guardian', style: 'serif' },
              ].map((press, i) => (
                <span key={`${press.name}-${i}`} style={{
                  fontSize: 'clamp(14px, 2vw, 18px)',
                  fontWeight: press.style === 'bold' ? 700 : press.style === 'italic' ? 400 : 400,
                  fontStyle: press.style === 'italic' ? 'italic' : 'normal',
                  fontFamily: press.style === 'serif' ? 'Georgia, serif' : 'var(--font-primary)',
                  letterSpacing: press.style === 'serif' ? '0.02em' : '0.05em',
                  color: 'rgba(255,255,255,0.7)',
                  whiteSpace: 'nowrap',
                }}>
                  {press.name}
                </span>
              ))}
            </InfiniteSlider>
          </div>
        </section>

        <section style={{
          background: '#0a0a0a',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeUp">
              <div style={{ marginBottom: 'clamp(48px, 6vw, 72px)' }}>
                <h1 style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 300,
                  lineHeight: 1.2,
                  letterSpacing: '-0.03em',
                  color: '#ffffff',
                  marginBottom: '24px',
                }}>
                  Welcome to Drizzl. Cold, upgraded.
                </h1>
                <p style={{
                  fontSize: 'clamp(16px, 2vw, 18px)',
                  fontWeight: 400,
                  lineHeight: 1.8,
                  color: 'var(--color-text-secondary)',
                }}>
                  We believe wellness should feel like a reward, not a chore. Forget wilting spinach and chalky powders. We're here to prove that "dessert" and "superfood" aren't just compatible—they're soulmates.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={100}>
              <div style={{ marginBottom: 'clamp(48px, 6vw, 72px)' }}>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  marginBottom: '20px',
                  lineHeight: 1.3,
                }}>
                  The Smoothie, Reinvented.
                </h2>
                <p style={{
                  fontSize: 'clamp(16px, 2vw, 18px)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.8,
                  marginBottom: '24px',
                }}>
                  Drizzl is the love child of indulgence and function. Our team of flavor fanatics and wellness rebels flash-freeze plant-based blends at peak deliciousness. Each functional smoothie is packed with vitamins, protein, and superfoods to fuel your fire and calm your chaos. No sad salads, just pure, frozen power.
                </p>
                <p style={{
                  fontSize: 'clamp(18px, 2.5vw, 22px)',
                  color: '#ffffff',
                  fontWeight: 500,
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                  borderLeft: '3px solid rgba(236,72,153,0.6)',
                  paddingLeft: '20px',
                }}>
                  This isn't just a smoothie—it's a flavor bomb that high-fives your brain and body.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={200}>
              <div style={{ marginBottom: 'clamp(48px, 6vw, 72px)' }}>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  marginBottom: '20px',
                  lineHeight: 1.3,
                }}>
                  Why We Exist
                </h2>
                <p style={{
                  fontSize: 'clamp(16px, 2vw, 18px)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.8,
                }}>
                  We got tired of the trade-off between healthy and happy. So we created Drizzl to make you thrive. We exist for the thrill of turning the freezer aisle into your personal wellness playground.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={300}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(139,92,246,0.15))',
                borderRadius: '16px',
                padding: 'clamp(32px, 4vw, 48px)',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <p style={{
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  color: '#ffffff',
                  fontWeight: 400,
                  lineHeight: 1.4,
                  letterSpacing: '-0.01em',
                }}>
                  This is Drizzl. Welcome to the freeze revolution.
                </p>
              </div>
            </AnimatedSection>

          </div>
        </section>

        {/* Video + Text Section */}
        <section style={{
          background: '#000000',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
              gap: 'clamp(40px, 6vw, 80px)',
              alignItems: 'center',
            }}>
              <AnimatedSection animation="fadeUp">
                <div style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      minHeight: '300px',
                      background: '#111',
                    }}
                  >
                    <source src="/videos/bowling-drizzl.mp4" type="video/mp4" />
                    Your browser does not support video.
                  </video>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fadeUp" delay={100}>
                <div>
                  <span style={{
                    fontSize: 'var(--fs-label)',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-tertiary)',
                    marginBottom: '16px',
                    display: 'block',
                  }}>
                    WHY WAIT FOR THE GOOD STUFF?
                  </span>
                  <h2 style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                    fontWeight: 300,
                    color: '#ffffff',
                    marginBottom: '24px',
                    lineHeight: 1.2,
                  }}>
                    We broke up with boring wellness.
                  </h2>
                  <p style={{
                    fontSize: 'clamp(15px, 1.8vw, 17px)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.8,
                    marginBottom: '20px',
                  }}>
                    We're done with bland smoothies and sugar bombs pretending to be healthy. We wanted food that's exciting—something that tastes like a cheat day but fuels like a superfood.
                  </p>
                  <p style={{
                    fontSize: 'clamp(15px, 1.8vw, 17px)',
                    color: '#ffffff',
                    fontWeight: 500,
                    lineHeight: 1.6,
                    marginBottom: '20px',
                  }}>
                    So, we made Drizzl Wellness.
                  </p>
                  <p style={{
                    fontSize: 'clamp(15px, 1.8vw, 17px)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.8,
                    marginBottom: '32px',
                  }}>
                    Your freezer's new go-to. Chef-crafted recipes, packed with real, organic ingredients, and flash-frozen at their best. Pure flavor, no compromises.
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '24px',
                  }}>
                    <div>
                      <p style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 300, color: '#ffffff', marginBottom: '4px' }}>0g</p>
                      <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)' }}>Added Sugar</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 300, color: '#ffffff', marginBottom: '4px' }}>90%+</p>
                      <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)' }}>Organic Ingredients</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 300, color: '#ffffff', marginBottom: '4px' }}>Peak</p>
                      <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)' }}>Frozen for Freshness</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
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
                  The Hype? Oh, It's Very Real.
                </h2>
                <p style={{
                  fontSize: 'var(--fs-body)',
                  color: 'var(--color-text-secondary)',
                }}>
                  We're not just blending fruit; we're blending energy, joy, and a little bit of magic.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fadeUp" delay={100}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px',
                textAlign: 'center',
              }}>
                {STATS.map((stat) => (
                  <div key={stat.label} style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '14px',
                    padding: '32px 20px',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <p style={{
                      fontSize: 'clamp(2rem, 4vw, 3rem)',
                      fontWeight: 300,
                      color: '#ffffff',
                      marginBottom: '8px',
                    }}>
                      {stat.number}
                    </p>
                    <p style={{
                      fontSize: 'var(--fs-body)',
                      fontWeight: 500,
                      color: '#ffffff',
                      marginBottom: '8px',
                    }}>
                      {stat.label}
                    </p>
                    <p style={{
                      fontSize: 'var(--fs-small)',
                      color: 'var(--color-text-tertiary)',
                      lineHeight: 1.5,
                    }}>
                      {stat.detail}
                    </p>
                  </div>
                ))}
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
                  Vibe Check: Our Values
                </h2>
                <p style={{
                  fontSize: 'var(--fs-body)',
                  color: 'var(--color-text-secondary)',
                }}>
                  We don't do basic. We do BOLD.
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
                    transition: 'all 0.2s ease',
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
          background: 'linear-gradient(135deg, #0a0a0a, #1a0a1a)',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <AnimatedSection animation="fadeUp">
              <h2 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 300,
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Ready to ditch the dull?
              </h2>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
                marginBottom: '32px',
                lineHeight: 1.7,
              }}>
                Stop scrolling. Start glowing. Taste the difference, feel the buzz, and let's get this glow-up party started.
              </p>
              <Link 
                href="/collections/smoothies"
                style={{
                  display: 'inline-block',
                  padding: '18px 48px',
                  background: '#ffffff',
                  color: '#000000',
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: 'var(--fs-body)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Start Glowing
              </Link>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
