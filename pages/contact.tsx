import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message. We will get back to you soon.');
    setEmail('');
    setMessage('');
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>Contact Us</h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  fontSize: '15px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Tell us what you think..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e8e8e8',
                  borderRadius: '4px',
                  fontSize: '15px',
                  minHeight: '200px',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
