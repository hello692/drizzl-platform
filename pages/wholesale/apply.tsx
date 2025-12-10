import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AnimatedSection } from '../../components/ScrollAnimations';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', href: '/wholesale' },
  { id: 'pricing', label: 'Pricing', href: '/wholesale/pricing' },
  { id: 'apply', label: 'Apply', href: '/wholesale/apply', isCta: true },
  { id: 'signin', label: 'Sign In', href: '/wholesale/signin' },
];

const BUSINESS_TYPES = ['Restaurant', 'Cafe', 'Gym', 'Grocery', 'Hotel', 'Other'];
const MONTHLY_VOLUMES = ['50-100 units', '100-250 units', '250-500 units', '500-1000 units', '1000+ units'];
const REFERRAL_SOURCES = ['Google Search', 'Social Media', 'Industry Event', 'Referral', 'Sales Rep', 'Other'];

interface FormData {
  accountType: 'customer' | 'retail_partner';
  fullName: string;
  email: string;
  password: string;
  businessName: string;
  dba: string;
  businessType: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  taxId: string;
  numberOfLocations: string;
  yearsInBusiness: string;
  expectedVolume: string;
  website: string;
  referralSource: string;
  agreeToTerms: boolean;
}

const initialFormData: FormData = {
  accountType: 'retail_partner',
  fullName: '',
  email: '',
  password: '',
  businessName: '',
  dba: '',
  businessType: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  taxId: '',
  numberOfLocations: '',
  yearsInBusiness: '',
  expectedVolume: '',
  website: '',
  referralSource: '',
  agreeToTerms: false,
};

const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: '14px 18px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: 'var(--fs-body)',
  outline: 'none',
  transition: 'all 0.2s ease',
};

const labelStyles: React.CSSProperties = {
  display: 'block',
  fontSize: 'var(--fs-small)',
  fontWeight: 500,
  color: 'var(--color-text-secondary)',
  marginBottom: '8px',
};

export default function WholesaleApply() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.password;
      case 2:
        return formData.businessName && formData.businessType;
      case 3:
        return true;
      case 4:
        return formData.agreeToTerms;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canContinue() && currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (formData.agreeToTerms) {
      setIsSubmitted(true);
    }
  };

  const steps = [
    { number: 1, title: 'Account' },
    { number: 2, title: 'Business' },
    { number: 3, title: 'Details' },
    { number: 4, title: 'Review' },
  ];

  if (isSubmitted) {
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
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {NAV_ITEMS.map((item) => (
                item.isCta ? (
                  <Link
                    key={item.id}
                    href={item.href}
                    style={{
                      background: '#00FF85',
                      color: '#000000',
                      padding: '10px 20px',
                      borderRadius: '50px',
                      fontSize: 'var(--fs-small)',
                      fontWeight: 500,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    key={item.id}
                    href={item.href}
                    style={{
                      background: 'none',
                      padding: '16px 16px',
                      fontSize: 'var(--fs-small)',
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.5)',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      borderBottom: '2px solid transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        </nav>

        <main style={{ background: '#000000', minHeight: '100vh' }}>
          <section style={{
            padding: 'clamp(100px, 12vw, 160px) clamp(20px, 4vw, 48px)',
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
          }}>
            <AnimatedSection animation="fadeUp">
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(0, 255, 133, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 32px',
              }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M10 20L17 27L30 13" stroke="#00FF85" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <h1 style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 300,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '20px',
              }}>
                Application Submitted!
              </h1>
              
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                marginBottom: '40px',
              }}>
                Thank you! We'll review your application and respond within 48 hours.
              </p>
              
              <Link
                href="/wholesale"
                style={{
                  padding: '16px 32px',
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.2s ease',
                }}
              >
                Return to Wholesale Overview
              </Link>
            </AnimatedSection>
          </section>
        </main>

        <Footer />
      </>
    );
  }

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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {NAV_ITEMS.map((item) => (
              item.isCta ? (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    background: '#00FF85',
                    color: '#000000',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    fontSize: 'var(--fs-small)',
                    fontWeight: 500,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </Link>
              ) : (
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
              )
            ))}
          </div>
        </div>
      </nav>

      <main style={{ background: '#000000', minHeight: '100vh' }}>
        <section style={{
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 48px)',
          maxWidth: '720px',
          margin: '0 auto',
        }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ marginBottom: 'clamp(40px, 6vw, 56px)', textAlign: 'center' }}>
              <span style={{
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                APPLY
              </span>
              <h1 style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 300,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Apply for Wholesale Access
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '480px',
                margin: '0 auto',
              }}>
                Complete the application below. We'll review and respond within 48 hours.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0',
              marginBottom: '48px',
            }}>
              {steps.map((step, index) => (
                <div key={step.number} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: currentStep >= step.number ? '#00FF85' : 'rgba(255,255,255,0.08)',
                      color: currentStep >= step.number ? '#000000' : 'rgba(255,255,255,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                    }}>
                      {currentStep > step.number ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: currentStep >= step.number ? '#ffffff' : 'rgba(255,255,255,0.4)',
                      transition: 'all 0.3s ease',
                    }}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div style={{
                      width: '60px',
                      height: '2px',
                      background: currentStep > step.number ? '#00FF85' : 'rgba(255,255,255,0.1)',
                      margin: '0 12px',
                      marginBottom: '24px',
                      transition: 'all 0.3s ease',
                    }} />
                  )}
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={200}>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              padding: 'clamp(24px, 4vw, 40px)',
            }}>
              {currentStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={labelStyles}>Account Type</label>
                    <div style={{
                      display: 'flex',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: '12px',
                      padding: '4px',
                      gap: '4px',
                    }}>
                      <button
                        type="button"
                        onClick={() => updateFormData('accountType', 'customer')}
                        style={{
                          flex: 1,
                          padding: '12px 20px',
                          background: formData.accountType === 'customer' ? '#00FF85' : 'transparent',
                          color: formData.accountType === 'customer' ? '#000000' : 'rgba(255,255,255,0.6)',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: 'var(--fs-small)',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Customer
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFormData('accountType', 'retail_partner')}
                        style={{
                          flex: 1,
                          padding: '12px 20px',
                          background: formData.accountType === 'retail_partner' ? '#00FF85' : 'transparent',
                          color: formData.accountType === 'retail_partner' ? '#000000' : 'rgba(255,255,255,0.6)',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: 'var(--fs-small)',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Retail Partner
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyles}>Full Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateFormData('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      style={inputStyles}
                    />
                  </div>

                  <div>
                    <label style={labelStyles}>Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="Enter your email"
                      style={inputStyles}
                    />
                  </div>

                  <div>
                    <label style={labelStyles}>Password *</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      placeholder="Create a password"
                      style={inputStyles}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={labelStyles}>Business Name *</label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => updateFormData('businessName', e.target.value)}
                      placeholder="Enter your business name"
                      style={inputStyles}
                    />
                  </div>

                  <div>
                    <label style={labelStyles}>DBA (if different)</label>
                    <input
                      type="text"
                      value={formData.dba}
                      onChange={(e) => updateFormData('dba', e.target.value)}
                      placeholder="Doing business as"
                      style={inputStyles}
                    />
                  </div>

                  <div>
                    <label style={labelStyles}>Business Type *</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => updateFormData('businessType', e.target.value)}
                      style={{
                        ...inputStyles,
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                      }}
                    >
                      <option value="" style={{ background: '#1a1a1a' }}>Select business type</option>
                      {BUSINESS_TYPES.map(type => (
                        <option key={type} value={type} style={{ background: '#1a1a1a' }}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyles}>Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      placeholder="Street address"
                      style={inputStyles}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyles}>City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        placeholder="City"
                        style={inputStyles}
                      />
                    </div>
                    <div>
                      <label style={labelStyles}>State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => updateFormData('state', e.target.value)}
                        placeholder="State"
                        style={inputStyles}
                      />
                    </div>
                    <div>
                      <label style={labelStyles}>ZIP</label>
                      <input
                        type="text"
                        value={formData.zip}
                        onChange={(e) => updateFormData('zip', e.target.value)}
                        placeholder="ZIP"
                        style={inputStyles}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyles}>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      style={inputStyles}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={labelStyles}>Federal Tax ID / EIN</label>
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => updateFormData('taxId', e.target.value)}
                      placeholder="XX-XXXXXXX"
                      style={inputStyles}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyles}>Number of Locations</label>
                      <input
                        type="text"
                        value={formData.numberOfLocations}
                        onChange={(e) => updateFormData('numberOfLocations', e.target.value)}
                        placeholder="e.g., 3"
                        style={inputStyles}
                      />
                    </div>
                    <div>
                      <label style={labelStyles}>Years in Business</label>
                      <input
                        type="text"
                        value={formData.yearsInBusiness}
                        onChange={(e) => updateFormData('yearsInBusiness', e.target.value)}
                        placeholder="e.g., 5"
                        style={inputStyles}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyles}>Expected Monthly Volume</label>
                    <select
                      value={formData.expectedVolume}
                      onChange={(e) => updateFormData('expectedVolume', e.target.value)}
                      style={{
                        ...inputStyles,
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                      }}
                    >
                      <option value="" style={{ background: '#1a1a1a' }}>Select expected volume</option>
                      {MONTHLY_VOLUMES.map(vol => (
                        <option key={vol} value={vol} style={{ background: '#1a1a1a' }}>{vol}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyles}>Website (optional)</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => updateFormData('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      style={inputStyles}
                    />
                  </div>

                  <div>
                    <label style={labelStyles}>How did you hear about us?</label>
                    <select
                      value={formData.referralSource}
                      onChange={(e) => updateFormData('referralSource', e.target.value)}
                      style={{
                        ...inputStyles,
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                      }}
                    >
                      <option value="" style={{ background: '#1a1a1a' }}>Select an option</option>
                      {REFERRAL_SOURCES.map(source => (
                        <option key={source} value={source} style={{ background: '#1a1a1a' }}>{source}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 style={{
                    fontSize: 'var(--fs-h4)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}>
                    Review Your Application
                  </h3>

                  <div style={{
                    display: 'grid',
                    gap: '20px',
                  }}>
                    <div style={{
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '12px',
                      padding: '20px',
                    }}>
                      <h4 style={{
                        fontSize: 'var(--fs-small)',
                        fontWeight: 600,
                        color: '#00FF85',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        Account Information
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-small)' }}>Account Type</span>
                          <span style={{ color: '#ffffff', fontSize: 'var(--fs-small)' }}>{formData.accountType === 'retail_partner' ? 'Retail Partner' : 'Customer'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-small)' }}>Full Name</span>
                          <span style={{ color: '#ffffff', fontSize: 'var(--fs-small)' }}>{formData.fullName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-small)' }}>Email</span>
                          <span style={{ color: '#ffffff', fontSize: 'var(--fs-small)' }}>{formData.email}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '12px',
                      padding: '20px',
                    }}>
                      <h4 style={{
                        fontSize: 'var(--fs-small)',
                        fontWeight: 600,
                        color: '#00FF85',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        Business Information
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-small)' }}>Business Name</span>
                          <span style={{ color: '#ffffff', fontSize: 'var(--fs-small)' }}>{formData.businessName}</span>
                        </div>
                        {formData.dba && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-small)' }}>DBA</span>
                            <span style={{ color: '#ffffff', fontSize: 'var(--fs-small)' }}>{formData.dba}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-small)' }}>Business Type</span>
                          <span style={{ color: '#ffffff', fontSize: 'var(--fs-small)' }}>{formData.businessType}</span>
                        </div>
                        {formData.address && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-small)' }}>Address</span>
                            <span style={{ color: '#ffffff', fontSize: 'var(--fs-small)', textAlign: 'right' }}>
                              {formData.address}{formData.city && `, ${formData.city}`}{formData.state && `, ${formData.state}`} {formData.zip}
                            </span>
                          </div>
                        )}
                        {formData.phone && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-small)' }}>Phone</span>
                            <span style={{ color: '#ffffff', fontSize: 'var(--fs-small)' }}>{formData.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '12px',
                      padding: '20px',
                    }}>
                      <h4 style={{
                        fontSize: 'var(--fs-small)',
                        fontWeight: 600,
                        color: '#00FF85',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        Business Details
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {formData.taxId && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-small)' }}>Tax ID / EIN</span>
                            <span style={{ color: '#ffffff', fontSize: 'var(--fs-small)' }}>{formData.taxId}</span>
                          </div>
                        )}
                        {formData.numberOfLocations && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-small)' }}>Locations</span>
                            <span style={{ color: '#ffffff', fontSize: 'var(--fs-small)' }}>{formData.numberOfLocations}</span>
                          </div>
                        )}
                        {formData.yearsInBusiness && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-small)' }}>Years in Business</span>
                            <span style={{ color: '#ffffff', fontSize: 'var(--fs-small)' }}>{formData.yearsInBusiness}</span>
                          </div>
                        )}
                        {formData.expectedVolume && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-small)' }}>Expected Volume</span>
                            <span style={{ color: '#ffffff', fontSize: 'var(--fs-small)' }}>{formData.expectedVolume}</span>
                          </div>
                        )}
                        {formData.website && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-small)' }}>Website</span>
                            <span style={{ color: '#ffffff', fontSize: 'var(--fs-small)' }}>{formData.website}</span>
                          </div>
                        )}
                        {formData.referralSource && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-small)' }}>Referral Source</span>
                            <span style={{ color: '#ffffff', fontSize: 'var(--fs-small)' }}>{formData.referralSource}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer',
                    marginTop: '8px',
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
                      style={{
                        width: '20px',
                        height: '20px',
                        marginTop: '2px',
                        accentColor: '#00FF85',
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{
                      fontSize: 'var(--fs-small)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                    }}>
                      I agree to the{' '}
                      <Link href="/terms" style={{ color: '#00FF85', textDecoration: 'underline' }}>
                        Terms and Conditions
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" style={{ color: '#00FF85', textDecoration: 'underline' }}>
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: currentStep === 1 ? 'flex-end' : 'space-between',
                gap: '16px',
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    style={{
                      padding: '14px 28px',
                      background: 'transparent',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '50px',
                      fontSize: 'var(--fs-body)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Back
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canContinue()}
                    style={{
                      padding: '14px 32px',
                      background: canContinue() ? '#00FF85' : 'rgba(255,255,255,0.1)',
                      color: canContinue() ? '#000000' : 'rgba(255,255,255,0.3)',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: 'var(--fs-body)',
                      fontWeight: 500,
                      cursor: canContinue() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!formData.agreeToTerms}
                    style={{
                      padding: '14px 32px',
                      background: formData.agreeToTerms ? '#00FF85' : 'rgba(255,255,255,0.1)',
                      color: formData.agreeToTerms ? '#000000' : 'rgba(255,255,255,0.3)',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: 'var(--fs-body)',
                      fontWeight: 500,
                      cursor: formData.agreeToTerms ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={300}>
            <div style={{
              textAlign: 'center',
              marginTop: '32px',
            }}>
              <Link 
                href="/wholesale/signin"
                style={{
                  fontSize: 'var(--fs-small)',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
              >
                Already a partner? Sign In →
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
