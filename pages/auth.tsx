import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

type UserType = 'customer' | 'retail';
type AuthMode = 'signin' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [userType, setUserType] = useState<UserType>('customer');
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { redirect, type } = router.query;

  useEffect(() => {
    if (type === 'retail') {
      setUserType('retail');
    }
  }, [type]);

  useEffect(() => {
    if (!authLoading && user) {
      handleExistingUser();
    }
  }, [user, authLoading]);

  async function handleExistingUser() {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, account_type, b2b_status')
        .eq('id', user?.id)
        .single();

      if (profile) {
        if (profile.role === 'admin') {
          router.push('/admin');
          return;
        }
        if (profile.role === 'partner' || profile.b2b_status === 'approved') {
          router.push('/retail-partner/dashboard');
          return;
        }
        if (profile.account_type === 'b2b' && profile.b2b_status === 'pending') {
          router.push('/retail/apply');
          return;
        }
        const redirectUrl = typeof redirect === 'string' ? redirect : '/dashboard';
        router.push(redirectUrl);
      }
    } catch (err) {
      console.error('Error checking user profile:', err);
    }
  }

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
          const profileData = {
            id: data.user.id,
            email: email,
            full_name: name,
            role: 'customer',
            account_type: userType === 'retail' ? 'b2b' : 'customer',
            b2b_status: userType === 'retail' ? 'pending' : 'none',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { error: profileError } = await supabase
            .from('profiles')
            .upsert(profileData, { onConflict: 'id' });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }

          if (data.session) {
            if (userType === 'retail') {
              router.push('/retail/apply');
            } else {
              const redirectUrl = typeof redirect === 'string' ? redirect : '/dashboard';
              router.push(redirectUrl);
            }
          } else {
            setMessage('Account created! You can now sign in.');
            setMode('signin');
            setPassword('');
          }
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, account_type, b2b_status')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            if (profile.role === 'admin') {
              router.push('/admin');
              return;
            }
            if (profile.role === 'partner' || profile.b2b_status === 'approved') {
              router.push('/retail-partner/dashboard');
              return;
            }
            if (profile.b2b_status === 'pending') {
              router.push('/retail/apply');
              return;
            }
            if (userType === 'retail') {
              if (profile.b2b_status === 'none' || !profile.b2b_status) {
                await supabase
                  .from('profiles')
                  .update({ account_type: 'b2b', b2b_status: 'pending' })
                  .eq('id', data.user.id);
                router.push('/retail/apply');
                return;
              }
            }
          }

          const redirectUrl = typeof redirect === 'string' ? redirect : '/dashboard';
          router.push(redirectUrl);
        }
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
        background: '#000000',
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            <h1 style={{
              fontSize: 'clamp(28px, 6vw, 36px)',
              fontWeight: '700',
              letterSpacing: '-0.5px',
              marginBottom: '8px',
              color: '#ffffff',
            }}>
              Welcome to Drizzl
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: '1.6',
              margin: 0,
            }}>
              {userType === 'customer' 
                ? 'Sign in to your wellness account' 
                : 'Access the wholesale partner portal'}
            </p>
          </div>

          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '28px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <button
              onClick={() => { setUserType('customer'); setError(''); setMessage(''); }}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                background: userType === 'customer' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: userType === 'customer' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.2s ease',
              }}
            >
              Customer
            </button>
            <button
              onClick={() => { setUserType('retail'); setError(''); setMessage(''); }}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                background: userType === 'retail' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: userType === 'retail' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.2s ease',
              }}
            >
              Retail Partner
            </button>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <p style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.6)',
              margin: 0,
              lineHeight: '1.5',
            }}>
              {userType === 'customer' 
                ? 'Access your orders, track deliveries, and manage your wellness journey.' 
                : 'Apply for wholesale pricing and access the B2B partner dashboard. After signing up, you\'ll complete our 4-step application.'}
            </p>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(220, 38, 38, 0.15)',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#ff6b6b',
              border: '1px solid rgba(220, 38, 38, 0.3)',
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(34, 197, 94, 0.15)',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#4ade80',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}>
              {message}
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '0',
            marginBottom: '24px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <button
              onClick={() => { setMode('signin'); setError(''); setMessage(''); }}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                background: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                color: mode === 'signin' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                borderBottom: mode === 'signin' ? '2px solid #ffffff' : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'all 0.2s ease',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setMessage(''); }}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                background: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                color: mode === 'signup' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                borderBottom: mode === 'signup' ? '2px solid #ffffff' : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'all 0.2s ease',
              }}
            >
              Create Account
            </button>
          </div>

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
                  color: '#ffffff',
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  style={{
                    padding: '14px 16px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    boxSizing: 'border-box',
                    width: '100%',
                    color: '#ffffff',
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
                color: '#ffffff',
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
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  boxSizing: 'border-box',
                  width: '100%',
                  color: '#ffffff',
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
                color: '#ffffff',
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
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  boxSizing: 'border-box',
                  width: '100%',
                  color: '#ffffff',
                }}
              />
              {mode === 'signup' && (
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0 0' }}>
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '14px 32px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '980px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: isLoading ? 'default' : 'pointer',
                marginTop: '8px',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading 
                ? (mode === 'signin' ? 'Signing In...' : 'Creating Account...') 
                : (mode === 'signin' 
                    ? (userType === 'customer' ? 'Sign In' : 'Sign In as Partner')
                    : (userType === 'customer' ? 'Create Account' : 'Create Partner Account')
                  )}
            </button>

            {mode === 'signin' && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Link 
                  href={userType === 'customer' ? '/account/forgot-password' : '/partner/forgot-password'}
                  style={{ 
                    fontSize: '14px', 
                    color: 'rgba(255,255,255,0.6)', 
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                >
                  Forgot your password?
                </Link>
              </div>
            )}
          </form>

          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
          }}>
            <Link 
              href="/admin/auth" 
              style={{ 
                fontSize: '13px', 
                color: 'rgba(255,255,255,0.4)', 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="14" height="14" rx="2" />
                <path d="M8 10h4" />
                <path d="M10 8v4" />
              </svg>
              Admin Login
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        input::placeholder {
          color: rgba(255,255,255,0.4);
        }
        input:focus {
          outline: none;
          border-color: rgba(255,255,255,0.4);
        }
      `}</style>

      <Footer />
    </>
  );
}
