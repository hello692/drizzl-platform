import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { AnimatedSection } from '../components/ScrollAnimations';

const LOCATIONS = [
  { city: 'Los Angeles', state: 'CA', store: 'Whole Foods Market', address: '6350 W 3rd St', neighborhood: 'The Grove' },
  { city: 'San Francisco', state: 'CA', store: 'Erewhon Market', address: '1285 Ninth Ave', neighborhood: 'Inner Sunset' },
  { city: 'Austin', state: 'TX', store: 'Central Market', address: '4001 N Lamar Blvd', neighborhood: 'North Loop' },
  { city: 'New York', state: 'NY', store: 'The Vitamin Shoppe', address: '1231 3rd Ave', neighborhood: 'Upper East Side' },
  { city: 'Miami', state: 'FL', store: 'Fresh Market', address: '3401 N Miami Ave', neighborhood: 'Wynwood' },
  { city: 'Seattle', state: 'WA', store: 'PCC Community Markets', address: '600 N 34th St', neighborhood: 'Fremont' },
  { city: 'Denver', state: 'CO', store: 'Natural Grocers', address: '900 E 11th Ave', neighborhood: 'Capitol Hill' },
  { city: 'Chicago', state: 'IL', store: "Mariano's Fresh Market", address: '1500 N Clybourn Ave', neighborhood: 'Lincoln Park' },
  { city: 'Portland', state: 'OR', store: 'New Seasons Market', address: '4034 SE Hawthorne Blvd', neighborhood: 'Hawthorne' },
  { city: 'Boston', state: 'MA', store: 'Wegmans', address: '200 Somerville Ave', neighborhood: 'Somerville' },
];

export default function Locations() {
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
                STORE LOCATOR
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Find Us Near You
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
              }}>
                Pick up your favorite Drizzl smoothies at a retailer near you. Can't find us in your area? Shop online and we'll deliver straight to your door.
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
            gap: '16px',
          }}>
            {LOCATIONS.map((location, index) => (
              <AnimatedSection key={`${location.city}-${location.store}`} animation="fadeUp" delay={index * 50}>
                <div style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '24px 20px',
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <h3 style={{
                      fontSize: 'var(--fs-h4)',
                      fontWeight: 500,
                      color: '#ffffff',
                      marginBottom: '4px',
                    }}>
                      {location.city}, {location.state}
                    </h3>
                    <p style={{
                      fontSize: 'var(--fs-small)',
                      color: 'var(--color-text-tertiary)',
                    }}>
                      {location.neighborhood}
                    </p>
                  </div>
                  <p style={{
                    fontSize: 'var(--fs-body)',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    marginBottom: '4px',
                  }}>
                    {location.store}
                  </p>
                  <p style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--color-text-tertiary)',
                    marginBottom: '16px',
                  }}>
                    {location.address}
                  </p>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${location.store} ${location.address} ${location.city} ${location.state}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: 'var(--fs-small)',
                      fontWeight: 500,
                      color: '#ffffff',
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.3)',
                      paddingBottom: '2px',
                    }}
                  >
                    Get Directions
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </AnimatedSection>
            ))}
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
                lineHeight: 1.2,
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Want to Stock Drizzl?
              </h2>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
                marginBottom: '24px',
                lineHeight: 1.6,
              }}>
                Interested in carrying Drizzl Wellness at your store? We'd love to partner with you.
              </p>
              <Link 
                href="/wholesale"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#ffffff',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.3)',
                  paddingBottom: '4px',
                }}
              >
                Become a Partner
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
