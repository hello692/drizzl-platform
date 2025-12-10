import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AnimatedSection } from '../../components/ScrollAnimations';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', href: '/wholesale' },
  { id: 'pricing', label: 'Pricing', href: '/wholesale/pricing' },
  { id: 'dashboard', label: 'Dashboard', href: '/wholesale/dashboard' },
];

const FEATURE_CARDS = [
  {
    id: 'place-orders',
    title: 'Place Orders',
    description: 'Quick reorder with saved templates',
    buttonText: 'Start Order',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
  {
    id: 'view-invoices',
    title: 'View Invoices',
    description: 'Download and manage billing',
    buttonText: 'View All',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    id: 'track-orders',
    title: 'Track Orders',
    description: 'Real-time shipment tracking',
    buttonText: 'Track Now',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"/>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    id: 'marketing-assets',
    title: 'Marketing Assets',
    description: 'Download product images & POS materials',
    buttonText: 'Browse Assets',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
  },
];

const QUICK_STATS = [
  { label: 'Recent Orders', value: '12', sublabel: 'Last 30 days' },
  { label: 'Pending Invoices', value: '3', sublabel: '$2,450 total' },
  { label: 'Next Delivery', value: 'Dec 15', sublabel: 'Order #1234' },
];

export default function WholesaleDashboard() {
  const router = useRouter();

  const handleSignOut = () => {
    router.push('/wholesale/signin');
  };

  return (
    <>
      <Navbar />
      
      <nav style={{
        position: 'sticky',
        top: '72px',
        zIndex: 100,
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 48px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <span style={{
              fontSize: 'var(--fs-body)',
              fontWeight: 500,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              padding: '16px 0',
            }}>
              Wholesale
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    background: 'none',
                    padding: '16px 16px',
                    fontSize: 'var(--fs-small)',
                    fontWeight: 400,
                    color: router.pathname === item.href ? '#ffffff' : 'rgba(255,255,255,0.5)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    borderBottom: router.pathname === item.href ? '2px solid #ffffff' : '2px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 0',
              fontSize: 'var(--fs-small)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s ease',
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main style={{ background: '#000000', minHeight: '100vh' }}>
        
        <section style={{
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ marginBottom: 'clamp(40px, 6vw, 64px)' }}>
              <span style={{
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                PARTNER DASHBOARD
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Welcome back, Partner
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
              }}>
                Manage your orders, invoices, and resources.
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '20px',
            marginBottom: '64px',
          }}>
            {FEATURE_CARDS.map((card, index) => (
              <AnimatedSection key={card.id} animation="fadeUp" delay={index * 100}>
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
                >
                  <div style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: 'var(--fs-h4)',
                      fontWeight: 500,
                      color: '#ffffff',
                      marginBottom: '8px',
                    }}>
                      {card.title}
                    </h3>
                    <p style={{
                      fontSize: 'var(--fs-small)',
                      color: 'var(--color-text-tertiary)',
                      lineHeight: 1.6,
                    }}>
                      {card.description}
                    </p>
                  </div>
                  <button
                    style={{
                      alignSelf: 'flex-start',
                      padding: '12px 24px',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '50px',
                      fontSize: 'var(--fs-small)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    }}
                  >
                    {card.buttonText}
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="fadeUp" delay={400}>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '32px',
            }}>
              <h2 style={{
                fontSize: 'var(--fs-h4)',
                fontWeight: 500,
                color: '#ffffff',
                marginBottom: '24px',
              }}>
                Quick Stats
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
                gap: '24px',
              }}>
                {QUICK_STATS.map((stat, index) => (
                  <div key={index} style={{
                    textAlign: 'center',
                    padding: '16px',
                  }}>
                    <p style={{
                      fontSize: 'var(--fs-small)',
                      fontWeight: 400,
                      color: 'var(--color-text-tertiary)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {stat.label}
                    </p>
                    <p style={{
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      fontWeight: 300,
                      color: '#ffffff',
                      marginBottom: '4px',
                    }}>
                      {stat.value}
                    </p>
                    <p style={{
                      fontSize: 'var(--fs-small)',
                      fontWeight: 400,
                      color: 'var(--color-text-tertiary)',
                    }}>
                      {stat.sublabel}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </section>

      </main>

      <Footer />
    </>
  );
}
