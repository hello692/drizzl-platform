import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export default function AuthPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { redirect } = router.query;

  useEffect(() => {
    if (user) {
      const redirectUrl = typeof redirect === 'string' ? redirect : '/';
      router.push(redirectUrl);
    }
  }, [user, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            },
            emailRedirectTo: undefined,
          },
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // Create profile for the new user
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: email,
              full_name: name,
              role: 'customer',
              account_type: 'customer',
              b2b_status: 'none',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }

          if (data.session) {
            // User is auto-confirmed, redirect directly
            const redirectUrl = typeof redirect === 'string' ? redirect : '/';
            router.push(redirectUrl);
          } else {
            setMessage('Account created! You can now sign in.');
            setMode('signin');
            setPassword('');
          }
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        const redirectUrl = typeof redirect === 'string' ? redirect : '/';
        router.push(redirectUrl);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(20px, 4vw, 40px)',
        background: '#ffffff',
      }}>
        <div style={{
          maxWidth: '420px',
          width: '100%',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            <h1 style={{
              fontSize: 'clamp(28px, 6vw, 36px)',
              fontWeight: '700',
              letterSpacing: '-0.5px',
              marginBottom: '8px',
            }}>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.6',
              margin: 0,
            }}>
              {mode === 'signin' 
                ? 'Access your wellness account securely' 
                : 'Join Drizzl Wellness today'}
            </p>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#fce8e6',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#c53929',
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              padding: '12px 16px',
              background: '#e6f4ea',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#1e7e34',
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            {mode === 'signup' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <label style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#000',
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  style={{
                    padding: '14px 16px',
                    border: '1px solid #d0d0d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    backgroundColor: '#fff',
                    boxSizing: 'border-box',
                    width: '100%',
                  }}
                />
              </div>
            )}

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <label style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#000',
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  padding: '14px 16px',
                  border: '1px solid #d0d0d0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  backgroundColor: '#fff',
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <label style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#000',
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
                  padding: '14px 16px',
                  border: '1px solid #d0d0d0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  backgroundColor: '#fff',
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              />
              {mode === 'signup' && (
                <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '14px 32px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isLoading ? 'default' : 'pointer',
                marginTop: '8px',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading 
                ? (mode === 'signin' ? 'Signing In...' : 'Creating Account...') 
                : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e8e8e8',
          }}>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0,
            }}>
              {mode === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setMode('signup'); setError(''); setMessage(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#000',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: '14px',
                      textDecoration: 'underline',
                    }}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setMode('signin'); setError(''); setMessage(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#000',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: '14px',
                      textDecoration: 'underline',
                    }}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <a href="/retail" style={{ fontSize: '13px', color: '#999', textDecoration: 'none' }}>
              Retail Partner Portal
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
