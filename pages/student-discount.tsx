import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AnimatedSection } from '../components/ScrollAnimations';
import { useState, useRef } from 'react';

const BENEFITS = [
  { title: '15% Off Every Order', description: 'Student discount applied automatically at checkout.' },
  { title: 'Free Shipping', description: 'On all orders over $50.' },
  { title: 'Exclusive Drops', description: 'Early access to new flavors and limited editions.' },
];

export default function StudentDiscount() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    school: '',
    address: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  return (
    <>
      <Navbar />
      
      <main style={{ background: '#000000', minHeight: '100vh', paddingTop: '120px' }}>
        <section style={{
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <AnimatedSection animation="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 80px)' }}>
              <span style={{
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                display: 'block',
              }}>
                STUDENT PERKS
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                15% Off for Students
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: '480px',
                margin: '0 auto',
              }}>
                Fuel your studies with the good stuff. Students and educators get exclusive savings.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={100}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '16px',
              marginBottom: '48px',
            }}>
              {BENEFITS.map((benefit) => (
                <div 
                  key={benefit.title}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px',
                    padding: '24px 20px',
                    textAlign: 'center',
                  }}
                >
                  <h3 style={{
                    fontSize: 'var(--fs-body)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}>
                    {benefit.title}
                  </h3>
                  <p style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--color-text-tertiary)',
                    lineHeight: 1.5,
                  }}>
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={150}>
            <div style={{
              background: '#0a0a0a',
              borderRadius: '14px',
              padding: '40px',
              textAlign: 'center',
            }}>
              {!showForm && !isSubmitted ? (
                <>
                  <h2 style={{
                    fontSize: 'var(--fs-h3)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: '16px',
                  }}>
                    How to Get Your Discount
                  </h2>
                  <p style={{
                    fontSize: 'var(--fs-body)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '24px',
                    maxWidth: '400px',
                    margin: '0 auto 24px',
                  }}>
                    Verify your student or educator status through SheerID. It only takes a minute.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    style={{
                      display: 'inline-block',
                      padding: '16px 40px',
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: 'var(--fs-body)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Verify Now
                  </button>
                  <p style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--color-text-tertiary)',
                    marginTop: '16px',
                  }}>
                    Works with .edu emails and valid student IDs
                  </p>
                </>
              ) : isSubmitted ? (
                <div style={{ padding: '20px 0' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h2 style={{
                    fontSize: 'var(--fs-h3)',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: '12px',
                  }}>
                    Verification Submitted!
                  </h2>
                  <p style={{
                    fontSize: 'var(--fs-body)',
                    color: 'var(--color-text-secondary)',
                    maxWidth: '400px',
                    margin: '0 auto',
                    lineHeight: 1.6,
                  }}>
                    We'll review your information and send you a confirmation email within 24-48 hours. Get ready for your 15% discount!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{
                      fontSize: 'var(--fs-h3)',
                      fontWeight: 500,
                      color: '#ffffff',
                    }}>
                      Verify Your Status
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.6)',
                        cursor: 'pointer',
                        padding: '8px',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        placeholder="John"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        placeholder="Doe"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john.doe@university.edu"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                      School / University *
                    </label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleInputChange}
                      required
                      placeholder="University of California"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="123 Campus Drive, City, State 12345"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                      Student ID Photo *
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '2px dashed rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        padding: '32px 20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: previewUrl ? 'transparent' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      {previewUrl ? (
                        <div style={{ position: 'relative' }}>
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            style={{ 
                              maxWidth: '200px', 
                              maxHeight: '150px', 
                              borderRadius: '8px',
                              objectFit: 'cover',
                            }} 
                          />
                          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '12px' }}>
                            Click to change photo
                          </p>
                        </div>
                      ) : (
                        <>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" style={{ marginBottom: '12px' }}>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                            Click to upload your student ID
                          </p>
                          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                            JPG, PNG, or PDF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedFile}
                    style={{
                      width: '100%',
                      padding: '16px 40px',
                      background: isSubmitting ? 'rgba(255,255,255,0.5)' : '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: 'var(--fs-body)',
                      fontWeight: 500,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span style={{
                          width: '18px',
                          height: '18px',
                          border: '2px solid transparent',
                          borderTopColor: '#000000',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                        }}></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Verification'
                    )}
                  </button>

                  <p style={{
                    fontSize: 'var(--fs-small)',
                    color: 'var(--color-text-tertiary)',
                    marginTop: '16px',
                    textAlign: 'center',
                  }}>
                    Your information is secure and only used for verification purposes.
                  </p>
                </form>
              )}
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input:focus {
          border-color: rgba(255,255,255,0.4) !important;
          background: rgba(255,255,255,0.08) !important;
        }
        input::placeholder {
          color: rgba(255,255,255,0.3);
        }
      `}</style>
    </>
  );
}
