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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
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
          maxWidth: '420px',
        }}>
          <div style={{
            marginBottom: '48px',
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

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            {error && (
              <div style={{
                padding: '12px 16px',
                background: '#fce8e6',
                border: '1px solid #f5c6cb',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#c53929',
                lineHeight: '1.5',
              }}>
                {error}
              </div>
            )}

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#000',
                letterSpacing: '-0.2px',
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
                  transition: 'all 0.3s cubic-bezier(0.32, 0, 0.67, 0)',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#000';
                  e.currentTarget.style.outline = 'none';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d0d0d0';
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
                letterSpacing: '-0.2px',
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
                  transition: 'all 0.3s cubic-bezier(0.32, 0, 0.67, 0)',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#000';
                  e.currentTarget.style.outline = 'none';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d0d0d0';
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
                transition: 'all 0.3s cubic-bezier(0.32, 0, 0.67, 0)',
                opacity: isLoading ? 0.7 : 1,
                letterSpacing: '-0.2px',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = '#333';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = '#000';
                }
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

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
              Want to become a retail partner? Contact our sales team
            </p>
            <a href="mailto:sales@drizzlwellness.com" style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#000',
              textDecoration: 'none',
              borderBottom: '1px solid #000',
              transition: 'all 0.3s cubic-bezier(0.32, 0, 0.67, 0)',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              sales@drizzlwellness.com
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
