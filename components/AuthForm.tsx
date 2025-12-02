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
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '12px',
        padding: '32px 28px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      }}>
        <h1 style={{ margin: 0, marginBottom: '8px', fontSize: '24px' }}>
          Drizzl Account
        </h1>
        <p style={{ marginTop: 0, marginBottom: '24px', color: '#555' }}>
          {mode === 'login' ? 'Log in to your account' : mode === 'signup' ? 'Create your account' : 'Get a magic login link'}
        </p>

        {/* Mode toggle */}
        <div style={{
          display: 'flex',
          marginBottom: '20px',
          borderRadius: '999px',
          background: '#f0f0f0',
          padding: '4px',
        }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              border: 'none',
              borderRadius: '999px',
              padding: '8px 0',
              cursor: 'pointer',
              background: mode === 'login' ? '#111' : 'transparent',
              color: mode === 'login' ? 'white' : '#333',
              fontWeight: 500,
            }}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            style={{
              flex: 1,
              border: 'none',
              borderRadius: '999px',
              padding: '8px 0',
              cursor: 'pointer',
              background: mode === 'signup' ? '#111' : 'transparent',
              color: mode === 'signup' ? 'white' : '#333',
              fontWeight: 500,
            }}
          >
            Sign up
          </button>
          <button
            type="button"
            onClick={() => setMode('magic')}
            style={{
              flex: 1,
              border: 'none',
              borderRadius: '999px',
              padding: '8px 0',
              cursor: 'pointer',
              background: mode === 'magic' ? '#111' : 'transparent',
              color: mode === 'magic' ? 'white' : '#333',
              fontWeight: 500,
              fontSize: '12px',
            }}
          >
            Magic Link
          </button>
        </div>

        <form onSubmit={mode === 'login' ? handleSignIn : mode === 'signup' ? handleSignUp : handleMagicLink} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '14px',
              }}
            />
          </div>

          {mode !== 'magic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '14px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={mode !== 'magic'}
                placeholder="••••••••"
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '4px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: 'none',
              background: '#111',
              color: 'white',
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send magic link'}
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: '16px',
            padding: '10px 12px',
            borderRadius: '8px',
            background: '#e6ffed',
            color: '#126b34',
            fontSize: '13px',
          }}>
            {message}
          </div>
        )}
        {error && (
          <div style={{
            marginTop: '16px',
            padding: '10px 12px',
            borderRadius: '8px',
            background: '#ffe6e6',
            color: '#a11a1a',
            fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        <p style={{ marginTop: '18px', fontSize: '12px', color: '#888' }}>
          Secure authentication powered by Supabase.
        </p>
      </div>
    </div>
  );
}
