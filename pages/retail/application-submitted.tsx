import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ApplicationSubmitted() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '70vh', padding: '80px 40px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: '#e6f4ea',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1e7e34" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22,4 12,14.01 9,11.01" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Application Submitted
          </h1>
          
          <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.7', marginBottom: '32px' }}>
            Thank you for applying to become a Drizzl Wellness wholesale partner. Our team will review your application and get back to you within 1-2 business days.
          </p>

          <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '24px', marginBottom: '32px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>What happens next?</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', lineHeight: '2' }}>
              <li>Our wholesale team will review your application</li>
              <li>We may contact you for additional verification</li>
              <li>Once approved, you'll receive an email notification</li>
              <li>You'll gain access to wholesale pricing and ordering</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{
              padding: '14px 32px',
              background: '#000',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              Return to Homepage
            </Link>
            <Link href="/retail" style={{
              padding: '14px 32px',
              background: '#f5f5f5',
              color: '#000',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              Check Application Status
            </Link>
          </div>

          <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #e8e8e8' }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Questions about your application?</p>
            <a href="mailto:wholesale@drizzlwellness.com" style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
              wholesale@drizzlwellness.com
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
