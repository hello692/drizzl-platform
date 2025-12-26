import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AnimatedSection } from '../components/ScrollAnimations';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit contact form');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
      
      <main style={{ background: '#000000', minHeight: '100vh', paddingTop: '120px' }}>
        <section style={{
          padding: 'clamp(40px, 6vw, 64px) clamp(20px, 4vw, 48px)',
          maxWidth: '600px',
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
                CONTACT
              </span>
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                We're Here to Help
              </h1>
              <p style={{
                fontSize: 'var(--fs-body)',
                color: 'var(--color-text-secondary)',
              }}>
                Have a question? We'd love to hear from you.
              </p>
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
                    We've received your message and will get back to you within 24-48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div style={{
                      background: 'rgba(255, 59, 48, 0.1)',
                      border: '1px solid rgba(255, 59, 48, 0.3)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      marginBottom: '20px',
                      color: '#ff3b30',
                      fontSize: 'var(--fs-small)',
                    }}>
                      {error}
                    </div>
                  )}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyles}>Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={inputStyles}
                      placeholder="Your name"
                      disabled={isLoading}
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyles}>Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      style={inputStyles}
                      placeholder="you@email.com"
                      disabled={isLoading}
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyles}>Subject</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      style={{ ...inputStyles, cursor: 'pointer' }}
                      disabled={isLoading}
                    >
                      <option value="" style={{ background: '#1a1a1a' }}>Select a topic...</option>
                      <option value="order" style={{ background: '#1a1a1a' }}>Order Question</option>
                      <option value="product" style={{ background: '#1a1a1a' }}>Product Question</option>
                      <option value="wholesale" style={{ background: '#1a1a1a' }}>Wholesale Inquiry</option>
                      <option value="feedback" style={{ background: '#1a1a1a' }}>Feedback</option>
                      <option value="other" style={{ background: '#1a1a1a' }}>Other</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyles}>Message</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={5}
                      style={{ ...inputStyles, resize: 'vertical' }}
                      placeholder="How can we help?"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: isLoading ? 'rgba(255,255,255,0.5)' : '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: 'var(--fs-body)',
                      fontWeight: 500,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={150}>
            <div style={{ marginTop: '48px', textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>
                Email us directly
              </p>
              <p style={{ fontSize: 'var(--fs-body)', color: '#ffffff' }}>
                hello@drizzlwellness.com
              </p>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </>
  );
}
