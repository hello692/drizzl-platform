import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { AnimatedSection } from '../components/ScrollAnimations';

const LOCATIONS = [
  { city: 'Los Angeles', state: 'CA', store: 'Whole Foods Market', address: '6350 W 3rd St', neighborhood: 'The Grove', lat: 34.0717, lng: -118.3601 },
  { city: 'San Francisco', state: 'CA', store: 'Erewhon Market', address: '1285 Ninth Ave', neighborhood: 'Inner Sunset', lat: 37.7649, lng: -122.4667 },
  { city: 'Austin', state: 'TX', store: 'Central Market', address: '4001 N Lamar Blvd', neighborhood: 'North Loop', lat: 30.3074, lng: -97.7394 },
  { city: 'New York', state: 'NY', store: 'The Vitamin Shoppe', address: '1231 3rd Ave', neighborhood: 'Upper East Side', lat: 40.7685, lng: -73.9604 },
  { city: 'Miami', state: 'FL', store: 'Fresh Market', address: '3401 N Miami Ave', neighborhood: 'Wynwood', lat: 25.8040, lng: -80.1948 },
  { city: 'Seattle', state: 'WA', store: 'PCC Community Markets', address: '600 N 34th St', neighborhood: 'Fremont', lat: 47.6497, lng: -122.3505 },
  { city: 'Denver', state: 'CO', store: 'Natural Grocers', address: '900 E 11th Ave', neighborhood: 'Capitol Hill', lat: 39.7342, lng: -104.9769 },
  { city: 'Chicago', state: 'IL', store: "Mariano's Fresh Market", address: '1500 N Clybourn Ave', neighborhood: 'Lincoln Park', lat: 41.9095, lng: -87.6565 },
  { city: 'Portland', state: 'OR', store: 'New Seasons Market', address: '4034 SE Hawthorne Blvd', neighborhood: 'Hawthorne', lat: 45.5118, lng: -122.6189 },
  { city: 'Boston', state: 'MA', store: 'Wegmans', address: '200 Somerville Ave', neighborhood: 'Somerville', lat: 42.3801, lng: -71.0936 },
];

export default function Locations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS);
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 });
  const [mapZoom, setMapZoom] = useState(4);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredLocations(LOCATIONS);
      setMapCenter({ lat: 39.8283, lng: -98.5795 });
      setMapZoom(4);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = LOCATIONS.filter(loc => 
      loc.city.toLowerCase().includes(query) ||
      loc.state.toLowerCase().includes(query) ||
      loc.neighborhood.toLowerCase().includes(query) ||
      loc.address.toLowerCase().includes(query) ||
      `${loc.city}, ${loc.state}`.toLowerCase().includes(query)
    );

    setFilteredLocations(results);
    
    if (results.length === 1) {
      setMapCenter({ lat: results[0].lat, lng: results[0].lng });
      setMapZoom(14);
    } else if (results.length > 1) {
      const avgLat = results.reduce((sum, loc) => sum + loc.lat, 0) / results.length;
      const avgLng = results.reduce((sum, loc) => sum + loc.lng, 0) / results.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
      setMapZoom(6);
    }
  }, [searchQuery]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const focusLocation = (lat: number, lng: number) => {
    setMapCenter({ lat, lng });
    setMapZoom(14);
  };

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 0.5},${mapCenter.lat - 0.3},${mapCenter.lng + 0.5},${mapCenter.lat + 0.3}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`;

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
            <div style={{ marginBottom: 'clamp(24px, 4vw, 32px)' }}>
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
                Pick up your favorite Drizzl smoothies at a retailer near you.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={50}>
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '32px',
              maxWidth: '500px',
            }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter zip code or city..."
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50px',
                  fontSize: 'var(--fs-body)',
                  color: '#ffffff',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  padding: '14px 28px',
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Search
              </button>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <div style={{
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '32px',
              height: '400px',
            }}>
              <iframe
                src={mapUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  filter: 'invert(90%) hue-rotate(180deg) brightness(0.95) contrast(1.1)',
                }}
                loading="lazy"
              />
            </div>
          </AnimatedSection>

          {filteredLocations.length === 0 ? (
            <AnimatedSection animation="fadeUp">
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
              }}>
                <p style={{ fontSize: 'var(--fs-body)', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                  No locations found for "{searchQuery}"
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilteredLocations(LOCATIONS);
                    setMapCenter({ lat: 39.8283, lng: -98.5795 });
                    setMapZoom(4);
                  }}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50px',
                    fontSize: 'var(--fs-small)',
                    cursor: 'pointer',
                  }}
                >
                  View All Locations
                </button>
              </div>
            </AnimatedSection>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
              gap: '16px',
            }}>
              {filteredLocations.map((location, index) => (
                <AnimatedSection key={`${location.city}-${location.store}`} animation="fadeUp" delay={index * 50}>
                  <div 
                    onClick={() => focusLocation(location.lat, location.lng)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '14px',
                      padding: '24px 20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
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
                      onClick={(e) => e.stopPropagation()}
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
          )}
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
