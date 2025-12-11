import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const NEON_GREEN = '#00FF85';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const generateToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: partner } = await supabase
        .from('partners')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .single();

      if (partner) {
        const token = generateToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        await supabase
          .from('password_reset_tokens')
          .insert({
            email: partner.email,
            token,
            user_type: 'partner' as const,
            expires_at: expiresAt.toISOString(),
          } as any);
      }

      setSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Forgot Password | DRIZZL Partner Portal</title>
      </Head>

      <div style={styles.container}>
        <div style={styles.formContainer}>
          <div style={styles.logoSection}>
            <img
              src="/logo.gif"
              alt="DRIZZL"
              style={styles.logo}
            />
            <h1 style={styles.title}>Reset Password</h1>
            <p style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {success ? (
            <div style={styles.successContainer}>
              <div style={styles.successIcon}>
                <CheckCircle size={48} color={NEON_GREEN} />
              </div>
              <h2 style={styles.successTitle}>Check Your Email</h2>
              <p style={styles.successText}>
                If an account exists with {email}, we've sent a password reset link.
                Please check your inbox and spam folder.
              </p>
              <Link href="/partner/login" style={styles.backButton}>
                <ArrowLeft size={18} />
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              {error && (
                <div style={styles.errorBox}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} style={styles.inputIcon} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@company.com"
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <button type="submit" style={styles.submitButton} disabled={loading}>
                {loading ? (
                  <>
                    <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <Link href="/partner/login" style={styles.backLink}>
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  formContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 40,
    backdropFilter: 'blur(20px)',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: 32,
  },
  logo: {
    height: 40,
    marginBottom: 16,
    filter: 'brightness(0) invert(1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 8,
    color: '#EF4444',
    fontSize: 14,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    color: '#666666',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '14px 14px 14px 44px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '14px 24px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    marginTop: 8,
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    color: '#666666',
    textDecoration: 'none',
    fontSize: 14,
    transition: 'color 0.2s',
    marginTop: 8,
  },
  successContainer: {
    textAlign: 'center',
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 12px 0',
  },
  successText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 1.6,
    marginBottom: 24,
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#FFFFFF',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    transition: 'background-color 0.2s',
  },
};
