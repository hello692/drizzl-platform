import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import Head from 'next/head';

export default function AdminSetup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/setup`,
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use the admin API to reset/create the admin account
      const response = await fetch('/api/admin/reset-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create admin account');
      }

      // Now sign in with the new credentials
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error('Account created but sign-in failed. Try logging in at /admin/auth');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Setup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Setup | Drizzl Wellness</title>
      </Head>
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
        padding: '20px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '48px 40px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '3px',
              background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '16px',
            }}>
              DRIZZL COMMAND CENTER
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#ffffff',
              margin: '0 0 8px 0',
            }}>
              First-Time Setup
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.5)',
              margin: 0,
            }}>
              Create your admin account
            </p>
          </div>

          {success ? (
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
              <p style={{ color: '#22c55e', margin: 0, fontWeight: '500' }}>
                Admin account created!
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', marginTop: '8px' }}>
                Redirecting to admin...
              </p>
            </div>
          ) : resetSent ? (
            <div style={{
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📧</div>
              <p style={{ color: '#06b6d4', margin: 0, fontWeight: '500' }}>
                Password reset email sent!
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', marginTop: '8px' }}>
                Check your inbox at {email} and click the reset link. Then come back here and try again.
              </p>
              <button
                onClick={() => setResetSent(false)}
                style={{
                  marginTop: '16px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  color: '#06b6d4',
                  background: 'transparent',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Back to Setup
              </button>
            </div>
          ) : (
            <form onSubmit={handleSetup}>
              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '24px',
                  color: '#ef4444',
                  fontSize: '14px',
                }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '8px',
                }}>
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@drizzl.com"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '8px',
                }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '6px',
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    margin: 0,
                  }}>
                    Minimum 6 characters
                  </p>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    style={{
                      fontSize: '12px',
                      color: '#a855f7',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Admin Account'}
              </button>
            </form>
          )}

          <p style={{
            textAlign: 'center',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.3)',
            marginTop: '24px',
          }}>
            This page should be removed after setup
          </p>
        </div>
      </main>
    </>
  );
}
