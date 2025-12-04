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
        background: '#ffffff',
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
            }}>
              Welcome to Drizzl
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#666',
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
            background: '#f5f5f5',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '28px',
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
                background: userType === 'customer' ? '#fff' : 'transparent',
                color: userType === 'customer' ? '#000' : '#666',
                boxShadow: userType === 'customer' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
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
                background: userType === 'retail' ? '#fff' : 'transparent',
                color: userType === 'retail' ? '#000' : '#666',
                boxShadow: userType === 'retail' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Retail Partner
            </button>
          </div>

          <div style={{
            background: userType === 'retail' ? '#f0f9ff' : '#f9f9f9',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            border: userType === 'retail' ? '1px solid #bae6fd' : '1px solid #e5e5e5',
          }}>
            <p style={{
              fontSize: '13px',
              color: userType === 'retail' ? '#0369a1' : '#666',
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

          <div style={{
            display: 'flex',
            gap: '0',
            marginBottom: '24px',
            borderBottom: '1px solid #e8e8e8',
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
                color: mode === 'signin' ? '#000' : '#666',
                borderBottom: mode === 'signin' ? '2px solid #000' : '2px solid transparent',
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
                color: mode === 'signup' ? '#000' : '#666',
                borderBottom: mode === 'signup' ? '2px solid #000' : '2px solid transparent',
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
                  color: '#000',
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
                background: '#0071E3',
                color: '#fff',
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
          </form>

          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e8e8e8',
            textAlign: 'center',
          }}>
            <Link 
              href="/admin/auth" 
              style={{ 
                fontSize: '13px', 
                color: '#999', 
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

      <Footer />
    </>
  );
}
