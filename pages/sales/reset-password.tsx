import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader, ArrowLeft } from 'lucide-react';

const NEON_GREEN = '#00FF85';

export default function SalesResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber;

  useEffect(() => {
    if (router.isReady) {
      validateToken();
    }
  }, [router.isReady, token]);

  const validateToken = async () => {
    setValidating(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (token && typeof token === 'string' && token.length > 0) {
      setTokenValid(true);
    } else if (!token) {
      setTokenValid(false);
      setError('No reset token provided. Please use the link from your email.');
    } else {
      setTokenValid(false);
      setError('This reset link is invalid or has expired.');
    }
    
    setValidating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);

      setTimeout(() => {
        router.push('/sales/login');
      }, 3000);
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
          <title>Reset Password | DRIZZL Sales Portal</title>
        </Head>
        <div style={styles.container}>
          <div style={styles.formContainer}>
            <div style={styles.loadingState}>
              <Loader size={32} color={NEON_GREEN} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={styles.loadingText}>Validating reset link...</p>
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

  if (!tokenValid) {
    return (
      <>
        <Head>
          <title>Invalid Link | DRIZZL Sales Portal</title>
        </Head>
        <div style={styles.container}>
          <div style={styles.formContainer}>
            <div style={styles.logoSection}>
              <img
                src="/logo.gif"
                alt="DRIZZL"
                style={styles.logo}
              />
            </div>
            <div style={styles.errorState}>
              <AlertCircle size={48} color="#EF4444" />
              <h2 style={styles.errorTitle}>Invalid Reset Link</h2>
              <p style={styles.errorText}>{error}</p>
              <Link href="/sales/forgot-password" style={styles.actionButton}>
                Request New Link
              </Link>
              <Link href="/sales/login" style={styles.backLink}>
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <Head>
          <title>Password Reset | DRIZZL Sales Portal</title>
        </Head>
        <div style={styles.container}>
          <div style={styles.formContainer}>
            <div style={styles.logoSection}>
              <img
                src="/logo.gif"
                alt="DRIZZL"
                style={styles.logo}
              />
            </div>
            <div style={styles.successState}>
              <CheckCircle size={48} color={NEON_GREEN} />
              <h2 style={styles.successTitle}>Password Reset Successfully!</h2>
              <p style={styles.successText}>
                Your password has been updated. Redirecting to login in 3 seconds...
              </p>
              <Link href="/sales/login" style={styles.actionButton}>
                Go to Login Now
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
        <title>Reset Password | DRIZZL Sales Portal</title>
      </Head>

      <div style={styles.container}>
        <div style={styles.formContainer}>
          <div style={styles.logoSection}>
            <img
              src="/logo.gif"
              alt="DRIZZL"
              style={styles.logo}
            />
            <h1 style={styles.title}>Reset Your Password</h1>
            <p style={styles.subtitle}>Enter your new password below</p>
          </div>

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
                  style={{ ...styles.input, paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.togglePassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
                  style={{ ...styles.input, paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.togglePassword}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <span style={styles.matchError}>Passwords do not match</span>
              )}
              {passwordsMatch && (
                <span style={styles.matchSuccess}>Passwords match</span>
              )}
            </div>

            <div style={styles.requirements}>
              <p style={styles.requirementsTitle}>Password requirements:</p>
              <ul style={styles.requirementsList}>
                <li style={{ color: hasMinLength ? NEON_GREEN : '#666666' }}>
                  {hasMinLength ? '✓' : '○'} At least 8 characters
                </li>
                <li style={{ color: hasUppercase ? NEON_GREEN : '#666666' }}>
                  {hasUppercase ? '✓' : '○'} One uppercase letter
                </li>
                <li style={{ color: hasNumber ? NEON_GREEN : '#666666' }}>
                  {hasNumber ? '✓' : '○'} One number
                </li>
              </ul>
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                opacity: loading || !passwordsMatch || !isPasswordValid ? 0.6 : 1,
                cursor: loading || !passwordsMatch || !isPasswordValid ? 'not-allowed' : 'pointer',
              }}
              disabled={loading || !passwordsMatch || !isPasswordValid}
            >
              {loading ? (
                <>
                  <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>

            <Link href="/sales/login" style={styles.backLink}>
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </form>

          <div style={styles.demoNotice}>
            <strong>Demo Mode:</strong> Any token will work for testing
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

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
    minHeight: 44,
  },
  togglePassword: {
    position: 'absolute',
    right: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666666',
    cursor: 'pointer',
    borderRadius: 6,
    transition: 'color 0.2s',
  },
  matchError: {
    fontSize: 12,
    color: '#EF4444',
  },
  matchSuccess: {
    fontSize: 12,
    color: NEON_GREEN,
  },
  requirements: {
    padding: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 8,
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  requirementsTitle: {
    fontSize: 12,
    color: '#999999',
    margin: '0 0 8px 0',
    fontWeight: 500,
  },
  requirementsList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    fontSize: 12,
    lineHeight: 1.8,
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
    minHeight: 48,
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
    minHeight: 44,
  },
  demoNotice: {
    marginTop: 24,
    padding: '12px 16px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    border: '1px solid rgba(0, 255, 133, 0.2)',
    borderRadius: 8,
    color: NEON_GREEN,
    fontSize: 13,
    textAlign: 'center',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  loadingText: {
    color: '#666666',
    fontSize: 14,
    margin: 0,
  },
  errorState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  errorText: {
    fontSize: 14,
    color: '#666666',
    margin: 0,
    lineHeight: 1.6,
  },
  actionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    textDecoration: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    marginTop: 8,
  },
  successState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: 20,
    gap: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  successText: {
    fontSize: 14,
    color: '#666666',
    margin: 0,
    lineHeight: 1.6,
  },
};
