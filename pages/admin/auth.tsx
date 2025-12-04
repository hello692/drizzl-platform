import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';

export default function AdminAuthPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      checkAdminRole();
    }
  }, [user, authLoading]);

  async function checkAdminRole() {
    setCheckingRole(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        setError('Unable to verify admin status. Please try again.');
        return;
      }

      if (profile?.role === 'admin' || profile?.role === 'super_admin') {
        router.push('/admin');
      } else {
        setError('Access denied. You do not have admin privileges.');
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Error checking admin role:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setCheckingRole(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          await supabase.auth.signOut();
          setError('Unable to verify admin status. Please try again.');
          return;
        }

        if (profile?.role === 'admin' || profile?.role === 'super_admin') {
          router.push('/admin');
        } else {
          await supabase.auth.signOut();
          setError('Access denied. You do not have admin privileges.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || checkingRole) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: '#a855f7',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
            Verifying access...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      padding: '20px',
    }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
          top: '-200px',
          right: '-200px',
          animation: 'float 15s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)',
          bottom: '-100px',
          left: '-100px',
          animation: 'float 20s ease-in-out infinite reverse',
        }} />
      </div>

      <div style={{
        maxWidth: '400px',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          background: 'rgba(20, 20, 30, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 10px 30px -10px rgba(168, 85, 247, 0.5)',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#fff',
              marginBottom: '8px',
              letterSpacing: '-0.5px',
            }}>
              Admin Access
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}>
              Sign in to the Command Center
            </p>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#f87171',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <label style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.7)',
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@drizzlwellness.com"
                required
                style={{
                  padding: '14px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#fff',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
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
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.7)',
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  padding: '14px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#fff',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isLoading ? 'default' : 'pointer',
                marginTop: '8px',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s ease',
                boxShadow: '0 10px 30px -10px rgba(168, 85, 247, 0.5)',
              }}
            >
              {isLoading ? 'Signing In...' : 'Access Command Center'}
            </button>
          </form>

          <div style={{
            marginTop: '24px',
            textAlign: 'center',
          }}>
            <a 
              href="/auth" 
              style={{ 
                fontSize: '13px', 
                color: 'rgba(255, 255, 255, 0.4)', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
            >
              Back to Customer Login
            </a>
          </div>
        </div>

        <p style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.3)',
        }}>
          Admin access is by invitation only. Contact support if you need assistance.
        </p>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
