import { useState } from 'react';
import { useRouter } from 'next/router';
import { signUp, signIn, signInWithMagicLink } from '../lib/auth';

type Mode = 'login' | 'signup' | 'magic';

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await signUp(email, password);
      setMessage('Signup successful! Check your email to verify your account.');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await signInWithMagicLink(email);
      setMessage('Magic link sent! Check your email to log in.');
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f9fafb',
      padding: '40px 20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'white',
        borderRadius: '12px',
        padding: '48px 40px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f0f0f0',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            margin: '0 0 12px 0',
            fontSize: '28px',
            fontWeight: '700',
            letterSpacing: '-0.5px',
            color: '#1a1a1a',
          }}>
            Welcome to Drizzl
          </h2>
          <p style={{
            margin: 0,
            fontSize: '15px',
            color: '#6b7280',
            fontWeight: '500',
          }}>
            Fresh smoothies delivered to your door
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '28px',
          background: '#f3f4f6',
          padding: '6px',
          borderRadius: '8px',
        }}>
          {(['login', 'signup', 'magic'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                border: 'none',
                borderRadius: '6px',
                padding: '10px 0',
                cursor: 'pointer',
                background: mode === m ? '#22c55e' : 'transparent',
                color: mode === m ? 'white' : '#6b7280',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
            >
              {m === 'login' ? 'Log in' : m === 'signup' ? 'Sign up' : 'Magic Link'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleSignIn : mode === 'signup' ? handleSignUp : handleMagicLink} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#1a1a1a',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                padding: '12px 14px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                fontSize: '15px',
                background: '#f9fafb',
                transition: 'border 0.2s',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#22c55e';
                e.target.style.background = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = '#f9fafb';
              }}
            />
          </div>

          {mode !== 'magic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#1a1a1a',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={mode !== 'magic'}
                placeholder="••••••••"
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  fontSize: '15px',
                  background: '#f9fafb',
                  transition: 'border 0.2s',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#22c55e';
                  e.target.style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.background = '#f9fafb';
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '13px 14px',
              borderRadius: '6px',
              border: 'none',
              background: '#22c55e',
              color: 'white',
              fontWeight: '700',
              fontSize: '15px',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#15803d')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#22c55e')}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send magic link'}
          </button>
        </form>

        {/* Messages */}
        {message && (
          <div style={{
            marginTop: '16px',
            padding: '12px 14px',
            borderRadius: '6px',
            background: '#dcfce7',
            color: '#166534',
            fontSize: '14px',
            border: '1px solid #bbf7d0',
          }}>
            ✓ {message}
          </div>
        )}
        {error && (
          <div style={{
            marginTop: '16px',
            padding: '12px 14px',
            borderRadius: '6px',
            background: '#fee2e2',
            color: '#991b1b',
            fontSize: '14px',
            border: '1px solid #fecaca',
          }}>
            ✕ {error}
          </div>
        )}

        {/* Footer */}
        <p style={{
          marginTop: '24px',
          fontSize: '12px',
          color: '#9ca3af',
          textAlign: 'center',
          fontWeight: '500',
        }}>
          Secure authentication powered by Supabase
        </p>
      </div>
    </div>
  );
}
