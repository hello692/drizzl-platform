import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export default function RetailLogin() {
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkRole() {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (data?.role === 'partner' || data?.role === 'admin') {
          router.push('/retail-partner/dashboard');
        }
      }
    }
    checkRole();
  }, [user, router]);

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
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role === 'partner' || profile?.role === 'admin') {
          router.push('/retail-partner/dashboard');
        } else {
          await supabase.auth.signOut();
          setError('Access denied. This portal is for retail partners only.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        await supabase
          .from('profiles')
          .update({ role: 'partner' })
          .eq('id', data.user.id);

        await supabase
          .from('retail_partners')
          .insert([{
            user_id: data.user.id,
            store_name: storeName,
            contact_name: contactName,
            contact_email: email,
            contact_phone: phone,
            status: 'active',
          }]);

        setSuccess('Account created successfully! You can now sign in.');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
        <div style={{
          width: '100%',
          maxWidth: '460px',
        }}>
          <div style={{
            marginBottom: '32px',
            textAlign: 'center',
          }}>
            <h1 style={{
              fontSize: 'clamp(28px, 6vw, 36px)',
              fontWeight: '700',
              marginBottom: '12px',
              letterSpacing: '-0.5px',
            }}>
              Retail Partner Portal
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.6',
            }}>
              Access wholesale pricing, manage orders, and track inventory
            </p>
          </div>

          <div style={{
            display: 'flex',
            marginBottom: '24px',
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '4px',
          }}>
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              style={{
                flex: 1,
                padding: '10px',
                background: mode === 'login' ? '#000' : 'transparent',
                color: mode === 'login' ? '#fff' : '#666',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
              style={{
                flex: 1,
                padding: '10px',
                background: mode === 'signup' ? '#000' : 'transparent',
                color: mode === 'signup' ? '#fff' : '#666',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Apply Now
            </button>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#fce8e6',
              border: '1px solid #f5c6cb',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#c53929',
              lineHeight: '1.5',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '12px 16px',
              background: '#e6f4ea',
              border: '1px solid #a8dab5',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#1e7e34',
              lineHeight: '1.5',
              marginBottom: '20px',
            }}>
              {success}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#000',
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #d0d0d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#000',
                }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #d0d0d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '14px 16px',
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'default' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#000',
                }}>
                  Store / Business Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  placeholder="Your store name"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #d0d0d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#000',
                }}>
                  Contact Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  placeholder="Your full name"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #d0d0d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#000',
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@business.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #d0d0d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#000',
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #d0d0d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#000',
                }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="At least 6 characters"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #d0d0d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#000',
                }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #d0d0d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '14px 16px',
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'default' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  marginTop: '8px',
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Partner Account'}
              </button>

              <p style={{
                fontSize: '12px',
                color: '#666',
                textAlign: 'center',
                lineHeight: '1.6',
              }}>
                By signing up, you agree to our terms of service and will gain immediate access to wholesale pricing.
              </p>
            </form>
          )}

          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e0e0e0',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '13px',
              color: '#666',
              marginBottom: '12px',
              lineHeight: '1.6',
            }}>
              Questions? Contact our wholesale team
            </p>
            <a href="mailto:wholesale@drizzlwellness.com" style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#000',
              textDecoration: 'none',
              borderBottom: '1px solid #000',
            }}>
              wholesale@drizzlwellness.com
            </a>
          </div>

          <div style={{
            marginTop: '24px',
            textAlign: 'center',
          }}>
            <Link href="/admin" style={{
              fontSize: '12px',
              color: '#999',
              textDecoration: 'none',
            }}>
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
