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
      background: '#f9f9f9',
      padding: '40px 20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '4px',
        padding: '48px 40px',
        border: '1px solid #e8e8e8',
      }}>
        <h2 style={{
          margin: '0 0 12px 0',
          fontSize: '28px',
          fontWeight: '600',
          letterSpacing: '0.2px',
          color: '#1a1a1a',
          textAlign: 'center',
          
        }}>
          Welcome
        </h2>
        <p style={{
          margin: '0 0 32px 0',
          fontSize: '15px',
          color: '#666',
          textAlign: 'center',
        }}>
          Sign in or create an account
        </p>

        {/* Mode toggle */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '28px',
          background: '#f9f9f9',
          padding: '6px',
          borderRadius: '4px',
        }}>
          {(['login', 'signup', 'magic'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                border: 'none',
                borderRadius: '3px',
                padding: '10px 0',
                cursor: 'pointer',
                background: mode === m ? '#1a1a1a' : 'transparent',
                color: mode === m ? 'white' : '#666',
                fontWeight: 500,
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
              fontWeight: '500',
              color: '#1a1a1a',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                padding: '12px 14px',
                borderRadius: '4px',
                border: '1px solid #e8e8e8',
                fontSize: '15px',
                background: '#ffffff',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1a1a1a';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e8e8e8';
              }}
            />
          </div>

          {mode !== 'magic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{
                fontSize: '13px',
                fontWeight: '500',
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
                  borderRadius: '4px',
                  border: '1px solid #e8e8e8',
                  fontSize: '15px',
                  background: '#ffffff',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1a1a1a';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e8e8e8';
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
              borderRadius: '4px',
              border: 'none',
              background: '#1a1a1a',
              color: 'white',
              fontWeight: '600',
              fontSize: '15px',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send magic link'}
          </button>
        </form>

        {/* Messages */}
        {message && (
          <div style={{
            marginTop: '16px',
            padding: '12px 14px',
            borderRadius: '4px',
            background: '#e8f5e9',
            color: '#2e7d32',
            fontSize: '14px',
            border: '1px solid #c8e6c9',
          }}>
            ✓ {message}
          </div>
        )}
        {error && (
          <div style={{
            marginTop: '16px',
            padding: '12px 14px',
            borderRadius: '4px',
            background: '#ffebee',
            color: '#c62828',
            fontSize: '14px',
            border: '1px solid #ffcdd2',
          }}>
            ✕ {error}
          </div>
        )}

        {/* Footer */}
        <p style={{
          marginTop: '24px',
          fontSize: '12px',
          color: '#999',
          textAlign: 'center',
        }}>
          Secure authentication powered by Supabase
        </p>
      </div>
    </div>
  );
}
