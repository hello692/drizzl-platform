import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import { AnimatedSection } from '../../components/ScrollAnimations';

const BENEFITS = [
  { title: 'Competitive Margins', description: 'Attractive wholesale pricing designed to maximize your profit potential.' },
  { title: 'Reliable Delivery', description: 'Consistent, on-time delivery to keep your shelves stocked.' },
  { title: 'Marketing Support', description: 'Free POS materials, samples, and co-marketing opportunities.' },
  { title: 'Dedicated Rep', description: 'Personal account manager for all your partnership needs.' },
  { title: 'Training & Support', description: 'Staff training and product knowledge sessions.' },
  { title: 'Exclusive Products', description: 'Access to partner-only SKUs and limited editions.' },
];

const PRICING_TIERS = [
  {
    name: 'Starter',
    minOrder: '50 units',
    discount: '25%',
    features: ['Standard delivery', 'Basic POS materials', 'Email support', 'Net 30 terms'],
  },
  {
    name: 'Growth',
    minOrder: '200 units',
    discount: '35%',
    features: ['Priority delivery', 'Full marketing kit', 'Dedicated account rep', 'Net 45 terms', 'Staff training'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    minOrder: '500+ units',
    discount: '45%',
    features: ['Same-day delivery', 'Custom marketing', 'Executive support', 'Net 60 terms', 'On-site training', 'Exclusive products'],
  },
];

const NAV_ITEMS = [
  { id: 'partner-with-us', label: 'Partner With Us' },
  { id: 'wholesale-pricing', label: 'Wholesale Pricing' },
  { id: 'partner-portal', label: 'Partner Portal' },
  { id: 'apply', label: 'Apply for Wholesale' },
];

export default function Wholesale() {
  const [activeSection, setActiveSection] = useState('partner-with-us');
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    locations: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 140;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Wholesale inquiry:', formData);
    setSubmitted(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Partner login:', loginData);
  };

  const inputStyles = {
    width: '100%',
    padding: '14px 16px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    fontSize: 'var(--fs-body)',
    color: '#ffffff',
    outline: 'none',
  };

  const labelStyles = {
    display: 'block',
    fontSize: 'var(--fs-small)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    marginBottom: '8px',
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
          gap: '32px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          <span style={{
            fontSize: 'var(--fs-body)',
            fontWeight: 500,
            color: '#ffffff',
            whiteSpace: 'nowrap',
            padding: '16px 0',
          }}>
            Wholesale
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '16px 16px',
                  fontSize: 'var(--fs-small)',
                  fontWeight: 400,
                  color: activeSection === item.id ? '#ffffff' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  borderBottom: activeSection === item.id ? '2px solid #ffffff' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main style={{ background: '#000000', minHeight: '100vh' }}>
        
        <section id="partner-with-us" style={{
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)',
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
                PARTNER WITH US
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Big Ideas? Let's Collaborate
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
              }}>
                Join the Drizzl family and bring wellness to your customers. We make it easy to succeed together.
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '16px',
            marginBottom: '48px',
          }}>
            {BENEFITS.map((benefit, index) => (
              <AnimatedSection key={benefit.title} animation="fadeUp" delay={index * 80}>
                <div style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '24px 20px',
                }}>
                  <h3 style={{
                    fontSize: 'var(--fs-h4)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}>
                    {benefit.title}
                  </h3>
                  <p style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--color-text-tertiary)',
                    lineHeight: 1.6,
                  }}>
                    {benefit.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => scrollToSection('apply')}
              style={{
                padding: '16px 32px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '50px',
                fontSize: 'var(--fs-body)',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Apply Now
            </button>
            <button
              onClick={() => scrollToSection('wholesale-pricing')}
              style={{
                padding: '16px 32px',
                background: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50px',
                fontSize: 'var(--fs-body)',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              View Pricing
            </button>
          </div>
        </section>

        <section id="wholesale-pricing" style={{
          background: '#0a0a0a',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeUp">
              <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 48px)' }}>
                <span style={{
                  fontSize: 'var(--fs-label)',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-tertiary)',
                  marginBottom: '12px',
                  display: 'block',
                }}>
                  B2B PRICING
                </span>
                <h2 style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 300,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: '#ffffff',
                  marginBottom: '16px',
                }}>
                  Wholesale Pricing
                </h2>
                <p style={{
                  fontSize: 'var(--fs-body)',
                  fontWeight: 400,
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                  maxWidth: '560px',
                  margin: '0 auto',
                }}>
                  Competitive margins designed for your business success.
                </p>
              </div>
            </AnimatedSection>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '16px',
            }}>
              {PRICING_TIERS.map((tier, index) => (
                <AnimatedSection key={tier.name} animation="fadeUp" delay={index * 100}>
                  <div style={{
                    background: 'transparent',
                    border: tier.highlighted ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px',
                    padding: '32px 24px',
                    height: '100%',
                    position: 'relative',
                  }}>
                    {tier.highlighted && (
                      <div style={{
                        position: 'absolute',
                        top: '-1px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#ffffff',
                        color: '#000000',
                        padding: '4px 12px',
                        borderRadius: '0 0 8px 8px',
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                      }}>
                        MOST POPULAR
                      </div>
                    )}
                    <h3 style={{
                      fontSize: 'var(--fs-h3)',
                      fontWeight: 500,
                      color: '#ffffff',
                      marginBottom: '8px',
                      marginTop: tier.highlighted ? '16px' : '0',
                    }}>
                      {tier.name}
                    </h3>
                    <p style={{
                      fontSize: 'var(--fs-small)',
                      color: 'var(--color-text-tertiary)',
                      marginBottom: '24px',
                    }}>
                      Min. {tier.minOrder}/order
                    </p>
                    <p style={{
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                      fontWeight: 300,
                      color: '#ffffff',
                      marginBottom: '24px',
                    }}>
                      {tier.discount} <span style={{ fontSize: 'var(--fs-body)', color: 'var(--color-text-tertiary)' }}>off retail</span>
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {tier.features.map((feature) => (
                        <li key={feature} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px',
                          padding: '8px 0',
                          fontSize: 'var(--fs-small)',
                          color: 'var(--color-text-secondary)',
                        }}>
                          <span style={{ color: 'rgba(255,255,255,0.4)' }}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => scrollToSection('apply')}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '14px',
                        marginTop: '24px',
                        background: tier.highlighted ? '#ffffff' : 'transparent',
                        color: tier.highlighted ? '#000000' : '#ffffff',
                        border: tier.highlighted ? 'none' : '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '50px',
                        fontSize: 'var(--fs-small)',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Get Started
                    </button>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section id="partner-portal" style={{
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 48px)' }}>
              <span style={{
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                PARTNER PORTAL
              </span>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Existing Partners
              </h2>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
                margin: '0 auto',
              }}>
                Access your account to place orders, track shipments, and download resources.
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            gap: '32px',
            alignItems: 'start',
          }}>
            <AnimatedSection animation="fadeUp" delay={100}>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                padding: '32px',
              }}>
                <h3 style={{
                  fontSize: 'var(--fs-h4)',
                  fontWeight: 500,
                  color: '#ffffff',
                  marginBottom: '24px',
                }}>
                  Sign In to Your Account
                </h3>
                <form onSubmit={handleLogin}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyles}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      style={inputStyles}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyles}>Password</label>
                    <input
                      type="password"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      style={inputStyles}
                      placeholder="Enter your password"
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: 'var(--fs-body)',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Sign In
                  </button>
                </form>
                <p style={{
                  textAlign: 'center',
                  marginTop: '16px',
                  fontSize: 'var(--fs-small)',
                  color: 'var(--color-text-tertiary)',
                }}>
                  Forgot password? Contact support
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fadeUp" delay={200}>
              <div>
                <h3 style={{
                  fontSize: 'var(--fs-h4)',
                  fontWeight: 500,
                  color: '#ffffff',
                  marginBottom: '24px',
                }}>
                  What You Can Do
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { title: 'Place Orders', desc: 'Quick reorder with saved templates' },
                    { title: 'View Invoices', desc: 'Download and manage billing' },
                    { title: 'Track Orders', desc: 'Real-time shipment tracking' },
                    { title: 'Marketing Assets', desc: 'Download product images & POS materials' },
                  ].map((item) => (
                    <div key={item.title} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      padding: '16px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <h4 style={{ fontSize: 'var(--fs-body)', fontWeight: 500, color: '#ffffff', marginBottom: '4px' }}>
                          {item.title}
                        </h4>
                        <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)' }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{
                  marginTop: '24px',
                  fontSize: 'var(--fs-small)',
                  color: 'var(--color-text-tertiary)',
                }}>
                  Not a partner yet?{' '}
                  <button
                    onClick={() => scrollToSection('apply')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: 'inherit',
                    }}
                  >
                    Apply now
                  </button>
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section id="apply" style={{
          background: '#0a0a0a',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)',
        }}>
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            gap: 'clamp(32px, 5vw, 60px)',
            alignItems: 'start',
          }}>
            <AnimatedSection animation="fadeUp">
              <div>
                <span style={{
                  fontSize: 'var(--fs-label)',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-tertiary)',
                  marginBottom: '12px',
                  display: 'block',
                }}>
                  APPLY FOR WHOLESALE
                </span>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  marginBottom: '16px',
                }}>
                  Ready to Get Started?
                </h2>
                <p style={{
                  fontSize: 'var(--fs-body)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '32px',
                }}>
                  Fill out the form and our team will reach out within 48 hours.
                </p>
                
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>Email</p>
                  <p style={{ fontSize: 'var(--fs-body)', color: '#ffffff' }}>wholesale@drizzlwellness.com</p>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>Phone</p>
                  <p style={{ fontSize: 'var(--fs-body)', color: '#ffffff' }}>1-800-DRIZZL-1</p>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fadeUp" delay={100}>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                padding: 'clamp(24px, 4vw, 32px)',
              }}>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 500, color: '#ffffff', marginBottom: '12px' }}>Thank You</h3>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      We've received your inquiry and will be in touch within 48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyles}>Business Name</label>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        style={inputStyles}
                        placeholder="Your store or company name"
                      />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyles}>Contact Name</label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                        style={inputStyles}
                        placeholder="Your full name"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <label style={labelStyles}>Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          style={inputStyles}
                          placeholder="you@company.com"
                        />
                      </div>
                      <div>
                        <label style={labelStyles}>Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          style={inputStyles}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <label style={labelStyles}>Business Type</label>
                        <select
                          required
                          value={formData.businessType}
                          onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                          style={{ ...inputStyles, cursor: 'pointer' }}
                        >
                          <option value="" style={{ background: '#1a1a1a' }}>Select type...</option>
                          <option value="grocery" style={{ background: '#1a1a1a' }}>Grocery Store</option>
                          <option value="cafe" style={{ background: '#1a1a1a' }}>Cafe / Coffee Shop</option>
                          <option value="gym" style={{ background: '#1a1a1a' }}>Gym / Fitness Center</option>
                          <option value="restaurant" style={{ background: '#1a1a1a' }}>Restaurant</option>
                          <option value="hotel" style={{ background: '#1a1a1a' }}>Hotel / Hospitality</option>
                          <option value="corporate" style={{ background: '#1a1a1a' }}>Corporate / Office</option>
                          <option value="other" style={{ background: '#1a1a1a' }}>Other</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyles}>Number of Locations</label>
                        <select
                          value={formData.locations}
                          onChange={(e) => setFormData({...formData, locations: e.target.value})}
                          style={{ ...inputStyles, cursor: 'pointer' }}
                        >
                          <option value="" style={{ background: '#1a1a1a' }}>Select...</option>
                          <option value="1" style={{ background: '#1a1a1a' }}>1 location</option>
                          <option value="2-5" style={{ background: '#1a1a1a' }}>2-5 locations</option>
                          <option value="6-10" style={{ background: '#1a1a1a' }}>6-10 locations</option>
                          <option value="11-25" style={{ background: '#1a1a1a' }}>11-25 locations</option>
                          <option value="25+" style={{ background: '#1a1a1a' }}>25+ locations</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={labelStyles}>Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows={4}
                        style={{ ...inputStyles, resize: 'vertical' }}
                        placeholder="Tell us about your business..."
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: '#ffffff',
                        color: '#000000',
                        border: 'none',
                        borderRadius: '50px',
                        fontSize: 'var(--fs-body)',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      Submit Application
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
