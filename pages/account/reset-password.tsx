import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Lock, ArrowRight, AlertCircle, CheckCircle, X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import bcrypt from 'bcryptjs';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: '#EF4444' };
  if (score <= 2) return { score, label: 'Fair', color: '#F59E0B' };
  if (score <= 3) return { score, label: 'Good', color: '#3B82F6' };
  return { score, label: 'Strong', color: NEON_GREEN };
}

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenData, setTokenData] = useState<{ customer_id: string } | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState('');

  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidating(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('password_reset_tokens')
          .select('*')
          .eq('token', token)
          .eq('used', false)
          .gte('expires_at', new Date().toISOString())
          .single();

        if (error || !data) {
          setTokenValid(false);
        } else {
          setTokenValid(true);
          setTokenData({ customer_id: data.customer_id });
        }
      } catch (err) {
        console.error('Token validation error:', err);
        setTokenValid(false);
      }

      setValidating(false);
    };

    if (router.isReady) {
      validateToken();
    }
  }, [token, router.isReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (passwordStrength.score < 2) {
      setError('Please choose a stronger password');
      return;
    }

    setLoading(true);

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const { error: updateError } = await supabase
        .from('customers')
        .update({ password_hash: hashedPassword })
        .eq('id', tokenData?.customer_id);

      if (updateError) throw updateError;

      await supabase
        .from('password_reset_tokens')
        .update({ used: true })
        .eq('token', token);

      setSuccess(true);
      setToast('Password reset successfully!');
      
      setTimeout(() => {
        router.push('/account/login?reset=success');
      }, 2000);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to reset password. Please try again.');
    }

    setLoading(false);
  };

  if (validating) {
    return (
      <>
        <Head>
          <title>Reset Password | DRIZZL Account</title>
        </Head>
        <div style={styles.container}>
          <div style={styles.formContainer}>
            <div style={styles.loadingSection}>
              <div style={styles.spinner} />
              <p style={styles.loadingText}>Validating your reset link...</p>
            </div>
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

  if (!token || !tokenValid) {
    return (
      <>
        <Head>
          <title>Invalid Link | DRIZZL Account</title>
        </Head>
        <div style={styles.container}>
          <div style={styles.formContainer}>
            <div style={styles.logoSection}>
              <Link href="/">
                <img src="/logo.gif" alt="DRIZZL" style={styles.logo} />
              </Link>
              <h1 style={styles.title}>Link Expired</h1>
              <p style={styles.subtitle}>
                This password reset link is invalid or has expired.
              </p>
            </div>
            <div style={styles.invalidSection}>
              <AlertCircle size={48} color="#EF4444" style={{ marginBottom: 20 }} />
              <p style={styles.invalidText}>
                Password reset links expire after 1 hour for security reasons. Please request a new reset link.
              </p>
              <Link href="/account/forgot-password" style={styles.requestNewButton}>
                Request New Link
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Reset Password | DRIZZL Account</title>
      </Head>

      <div style={styles.container}>
        {toast && (
          <div style={styles.toast}>
            <CheckCircle size={18} color={NEON_GREEN} />
            <span>{toast}</span>
            <button onClick={() => setToast('')} style={styles.toastClose}>
              <X size={16} />
            </button>
          </div>
        )}

        <div style={styles.formContainer}>
          <div style={styles.logoSection}>
            <Link href="/">
              <img src="/logo.gif" alt="DRIZZL" style={styles.logo} />
            </Link>
            <h1 style={styles.title}>Create New Password</h1>
            <p style={styles.subtitle}>
              {success 
                ? "Your password has been reset successfully!"
                : "Enter your new password below"
              }
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} style={styles.form}>
              {error && (
                <div style={styles.errorBox}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.label}>New Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} style={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    style={styles.input}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.toggleButton}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && (
                  <div style={styles.strengthContainer}>
                    <div style={styles.strengthBar}>
                      <div
                        style={{
                          ...styles.strengthFill,
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                      />
                    </div>
                    <span style={{ ...styles.strengthLabel, color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
                <ul style={styles.requirements}>
                  <li style={{ color: password.length >= 8 ? NEON_GREEN : '#666666' }}>
                    At least 8 characters
                  </li>
                  <li style={{ color: /[A-Z]/.test(password) && /[a-z]/.test(password) ? NEON_GREEN : '#666666' }}>
                    Upper & lowercase letters
                  </li>
                  <li style={{ color: /\d/.test(password) ? NEON_GREEN : '#666666' }}>
                    At least one number
                  </li>
                  <li style={{ color: /[^a-zA-Z0-9]/.test(password) ? NEON_GREEN : '#666666' }}>
                    Special character (!@#$%...)
                  </li>
                </ul>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} style={styles.inputIcon} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    style={{
                      ...styles.input,
                      borderColor: confirmPassword && password !== confirmPassword 
                        ? '#EF4444' 
                        : confirmPassword && password === confirmPassword 
                        ? NEON_GREEN 
                        : CARD_BORDER,
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.toggleButton}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <span style={styles.mismatchText}>Passwords do not match</span>
                )}
              </div>

              <button 
                type="submit" 
                style={{
                  ...styles.submitButton,
                  opacity: loading || password !== confirmPassword ? 0.5 : 1,
                }} 
                disabled={loading || password !== confirmPassword}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          ) : (
            <div style={styles.successSection}>
              <div style={styles.successIcon}>
                <CheckCircle size={48} color={NEON_GREEN} />
              </div>
              <p style={styles.successText}>
                Your password has been updated. Redirecting to login...
              </p>
            </div>
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
  toast: {
    position: 'fixed',
    top: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#111111',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: '#FFFFFF',
    fontSize: 14,
    zIndex: 1000,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  toastClose: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666666',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
  },
  formContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 40,
  },
  loadingSection: {
    textAlign: 'center',
    padding: '40px 0',
  },
  spinner: {
    width: 40,
    height: 40,
    border: `3px solid ${CARD_BORDER}`,
    borderTopColor: NEON_GREEN,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  loadingText: {
    color: '#666666',
    fontSize: 14,
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: 32,
  },
  logo: {
    height: 40,
    marginBottom: 24,
    filter: 'brightness(0) invert(1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  invalidSection: {
    textAlign: 'center',
    padding: '20px 0',
  },
  invalidText: {
    color: '#999999',
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 24,
  },
  requestNewButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 24px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.2s',
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
    padding: '14px 44px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
  },
  toggleButton: {
    position: 'absolute',
    right: 14,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666666',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
  },
  strengthContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.3s, background-color 0.3s',
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: 500,
    minWidth: 50,
  },
  requirements: {
    listStyle: 'none',
    padding: 0,
    margin: '8px 0 0 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: 12,
  },
  mismatchText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
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
    transition: 'all 0.2s',
    marginTop: 8,
  },
  successSection: {
    textAlign: 'center',
    padding: '20px 0',
  },
  successIcon: {
    marginBottom: 20,
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 1.6,
  },
};
