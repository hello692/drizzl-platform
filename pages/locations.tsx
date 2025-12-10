import PageLayout, { PageHero, PageSection, SectionHeader, AnimatedSection } from '../components/PageLayout';
import Link from 'next/link';

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
    <PageLayout>
      <PageHero
        badge="Store Locator"
        badgeColor="linear-gradient(135deg, #00C9A7, #00B4D8)"
        title="Find Us Near You"
        subtitle="Pick up your favorite Drizzl smoothies at a store near you."
      />
      
      <PageSection background="white">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {LOCATIONS.map((location, index) => (
            <AnimatedSection key={`${location.city}-${location.store}`} animation="fadeUp" delay={index * 50}>
              <div className="tiktok-card" style={{ height: '100%' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #00C9A7, #00B4D8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}>
                    📍
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                      {location.city}, {location.state}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                      {location.neighborhood}
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#333' }}>
                  {location.store}
                </p>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
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
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#00B4D8',
                    textDecoration: 'none',
                  }}
                >
                  Get Directions
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </PageSection>

      <PageSection background="black">
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
            Want to Stock Drizzl?
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px', lineHeight: '1.6' }}>
            Interested in carrying Drizzl Wellness at your store? We'd love to partner with you.
          </p>
          <Link 
            href="/wholesale"
            className="cta-button"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #6B5CE7, #FF4F7B)',
              color: '#fff',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '16px',
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            Become a Partner
          </Link>
        </div>
      </PageSection>
    </PageLayout>
  );
}
