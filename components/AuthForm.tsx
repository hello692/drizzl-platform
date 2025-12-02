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
      background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
      padding: '40px 20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'white',
        borderRadius: '16px',
        padding: '48px 40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            margin: '0 0 12px 0',
            fontSize: '28px',
            fontWeight: '700',
            letterSpacing: '-0.5px',
            color: '#111',
          }}>
            Welcome to Drizzl
          </h1>
          <p style={{
            margin: 0,
            fontSize: '15px',
            color: '#666',
            fontWeight: '500',
          }}>
            Fresh, healthy smoothies delivered daily
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '28px',
          background: '#f5f5f5',
          padding: '6px',
          borderRadius: '10px',
        }}>
          {(['login', 'signup', 'magic'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                border: 'none',
                borderRadius: '8px',
                padding: '10px 0',
                cursor: 'pointer',
                background: mode === m ? '#111' : 'transparent',
                color: mode === m ? 'white' : '#666',
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
              color: '#333',
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
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '15px',
                background: '#fafafa',
                transition: 'border 0.2s',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#111'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {mode !== 'magic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#333',
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
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '15px',
                  background: '#fafafa',
                  transition: 'border 0.2s',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#111'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '13px 14px',
              borderRadius: '8px',
              border: 'none',
              background: '#111',
              color: 'white',
              fontWeight: '700',
              fontSize: '15px',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send magic link'}
          </button>
        </form>

        {/* Messages */}
        {message && (
          <div style={{
            marginTop: '16px',
            padding: '12px 14px',
            borderRadius: '8px',
            background: '#e6ffed',
            color: '#126b34',
            fontSize: '14px',
            border: '1px solid #b3ffb3',
          }}>
            ✓ {message}
          </div>
        )}
        {error && (
          <div style={{
            marginTop: '16px',
            padding: '12px 14px',
            borderRadius: '8px',
            background: '#ffe6e6',
            color: '#a11a1a',
            fontSize: '14px',
            border: '1px solid #ffb3b3',
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
          fontWeight: '500',
        }}>
          Secure authentication powered by Supabase
        </p>
      </div>
    </div>
  );
}
