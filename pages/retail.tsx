import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export default function RetailLogin() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        checkPartnerStatus();
      } else {
        setCheckingStatus(false);
      }
    }
  }, [user, authLoading]);

  async function checkPartnerStatus() {
    try {
      const response = await fetch(`/api/retail/status?userId=${user?.id}`);
      const data = await response.json();
      
      if (data.hasApplication) {
        setApplicationStatus(data);
        if (data.status === 'approved') {
          router.push('/retail-partner/dashboard');
        }
      } else {
        // No application yet - redirect to application form
        router.push('/retail/apply');
      }
    } catch (err) {
      console.error('Error checking partner status:', err);
    } finally {
      setCheckingStatus(false);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        const statusResponse = await fetch(`/api/retail/status?userId=${data.user.id}`);
        const statusData = await statusResponse.json();

        if (statusData.hasApplication) {
          if (statusData.status === 'approved') {
            router.push('/retail-partner/dashboard');
          } else {
            setApplicationStatus(statusData);
          }
        } else {
          // No application yet - redirect to application form
          router.push('/retail/apply');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (user && applicationStatus) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', padding: '80px 40px' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: applicationStatus.status === 'approved' ? '#e6f4ea' : applicationStatus.status === 'rejected' ? '#fce8e6' : '#fff3e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              {applicationStatus.status === 'pending' && (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e65100" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              )}
              {applicationStatus.status === 'approved' && (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e7e34" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
              )}
              {applicationStatus.status === 'rejected' && (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c53929" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              )}
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
              {applicationStatus.status === 'pending' && 'Application Under Review'}
              {applicationStatus.status === 'approved' && 'Application Approved'}
              {applicationStatus.status === 'rejected' && 'Application Not Approved'}
              {applicationStatus.status === 'suspended' && 'Account Suspended'}
            </h1>

            <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' }}>
              {applicationStatus.status === 'pending' && 'Your wholesale partner application is being reviewed. We typically process applications within 1-2 business days.'}
              {applicationStatus.status === 'approved' && 'Welcome! Your wholesale account is active. You can now access wholesale pricing and place orders.'}
              {applicationStatus.status === 'rejected' && (applicationStatus.rejectionReason || 'Unfortunately, your application was not approved at this time. Please contact our team for more information.')}
              {applicationStatus.status === 'suspended' && 'Your wholesale account has been suspended. Please contact support for assistance.'}
            </p>

            {applicationStatus.status === 'approved' ? (
              <Link href="/retail-partner/dashboard" style={{ display: 'inline-block', padding: '14px 32px', background: '#000', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
                Go to Wholesale Dashboard
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/" style={{ padding: '14px 24px', background: '#f5f5f5', color: '#000', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
                  Return Home
                </Link>
                <a href="mailto:wholesale@drizzlwellness.com" style={{ padding: '14px 24px', background: '#000', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
                  Contact Support
                </a>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <section style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        padding: 'clamp(40px, 8vw, 60px) clamp(16px, 4vw, 60px)',
      }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h1 style={{ fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: '700', marginBottom: '12px', letterSpacing: '-0.5px' }}>
              Retail Partner Portal
            </h1>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              Access wholesale pricing and manage your B2B orders
            </p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: '#fce8e6', border: '1px solid #f5c6cb', borderRadius: '8px', fontSize: '13px', color: '#c53929', lineHeight: '1.5', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '14px 16px', border: '1px solid #d0d0d0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '14px 16px', border: '1px solid #d0d0d0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ padding: '14px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: isLoading ? 'default' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Signing In...' : 'Sign In to Partner Portal'}
            </button>
          </form>

          <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>New to Drizzl Wholesale?</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
              Apply to become a retail partner and unlock exclusive wholesale pricing.
            </p>
            <Link href="/retail/apply" style={{ display: 'inline-block', padding: '12px 28px', background: '#000', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
              Apply Now
            </Link>
          </div>

          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
              Questions about the wholesale program?
            </p>
            <a href="mailto:wholesale@drizzlwellness.com" style={{ fontSize: '13px', fontWeight: '600', color: '#000', textDecoration: 'none', borderBottom: '1px solid #000' }}>
              wholesale@drizzlwellness.com
            </a>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Link href="/admin" style={{ fontSize: '12px', color: '#999', textDecoration: 'none' }}>
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
