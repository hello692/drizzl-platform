import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import bcrypt from 'bcryptjs';

const NEON_GREEN = '#00FF85';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { score: 1, label: 'Weak', color: '#EF4444' };
  if (score <= 4) return { score: 2, label: 'Fair', color: '#F59E0B' };
  if (score <= 5) return { score: 3, label: 'Good', color: '#10B981' };
  return { score: 4, label: 'Strong', color: NEON_GREEN };
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
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  useEffect(() => {
    if (token && typeof token === 'string') {
      validateToken(token);
    }
  }, [token]);

  const validateToken = async (tokenValue: string) => {
    setValidating(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('token', tokenValue)
        .eq('used', false)
        .single();

      if (fetchError || !data) {
        setTokenValid(false);
        setError('This reset link is invalid or has already been used.');
        setValidating(false);
        return;
      }

      const expiresAt = new Date(data.expires_at);
      if (expiresAt < new Date()) {
        setTokenValid(false);
        setError('This reset link has expired. Please request a new one.');
        setValidating(false);
        return;
      }

      setTokenValid(true);
      setPartnerId(data.partner_id);
    } catch (err) {
      console.error('Token validation error:', err);
      setTokenValid(false);
      setError('Unable to validate reset link. Please try again.');
    }
    setValidating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
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
        .from('partners')
        .update({ password_hash: hashedPassword })
        .eq('id', partnerId);

      if (updateError) throw updateError;

      await supabase
        .from('password_reset_tokens')
        .update({ used: true })
        .eq('token', token);

      setSuccess(true);

      setTimeout(() => {
        router.push('/partner/login?reset=success');
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
          <title>Reset Password | DRIZZL Partner Portal</title>
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
          <title>Invalid Link | DRIZZL Partner Portal</title>
        </Head>
        <div style={styles.container}>
          <div style={styles.formContainer}>
            <div style={styles.errorState}>
              <AlertCircle size={48} color="#EF4444" />
              <h2 style={styles.errorTitle}>Invalid Reset Link</h2>
              <p style={styles.errorText}>{error}</p>
              <Link href="/partner/forgot-password" style={styles.actionButton}>
                Request New Link
              </Link>
              <Link href="/partner/login" style={styles.backLink}>
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
          <title>Password Reset | DRIZZL Partner Portal</title>
        </Head>
        <div style={styles.container}>
          <div style={styles.formContainer}>
            <div style={styles.successState}>
              <CheckCircle size={48} color={NEON_GREEN} />
              <h2 style={styles.successTitle}>Password Reset Successfully!</h2>
              <p style={styles.successText}>
                Your password has been updated. Redirecting to login...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Reset Password | DRIZZL Partner Portal</title>
      </Head>

      <div style={styles.container}>
        <div style={styles.formContainer}>
          <div style={styles.logoSection}>
            <img
              src="/logo.gif"
              alt="DRIZZL"
              style={styles.logo}
            />
            <h1 style={styles.title}>Create New Password</h1>
            <p style={styles.subtitle}>
              Enter your new password below
            </p>
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
                  style={styles.input}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {password.length > 0 && (
                <div style={styles.strengthContainer}>
                  <div style={styles.strengthBar}>
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        style={{
                          ...styles.strengthSegment,
                          backgroundColor: level <= passwordStrength.score 
                            ? passwordStrength.color 
                            : 'rgba(255, 255, 255, 0.1)',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ ...styles.strengthLabel, color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
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
                    borderColor: confirmPassword.length > 0 
                      ? (passwordsMatch ? NEON_GREEN : '#EF4444')
                      : 'rgba(255, 255, 255, 0.1)',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <span style={styles.matchError}>Passwords do not match</span>
              )}
            </div>

            <div style={styles.requirements}>
              <p style={styles.requirementsTitle}>Password requirements:</p>
              <ul style={styles.requirementsList}>
                <li style={{ color: password.length >= 8 ? NEON_GREEN : '#666666' }}>
                  At least 8 characters
                </li>
                <li style={{ color: /[A-Z]/.test(password) ? NEON_GREEN : '#666666' }}>
                  One uppercase letter
                </li>
                <li style={{ color: /[0-9]/.test(password) ? NEON_GREEN : '#666666' }}>
                  One number
                </li>
                <li style={{ color: /[^a-zA-Z0-9]/.test(password) ? NEON_GREEN : '#666666' }}>
                  One special character
                </li>
              </ul>
            </div>

            <button 
              type="submit" 
              style={{
                ...styles.submitButton,
                opacity: loading || !passwordsMatch ? 0.6 : 1,
                cursor: loading || !passwordsMatch ? 'not-allowed' : 'pointer',
              }} 
              disabled={loading || !passwordsMatch}
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
          </form>
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
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666666',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  strengthContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  strengthBar: {
    display: 'flex',
    gap: 4,
    flex: 1,
  },
  strengthSegment: {
    height: 4,
    flex: 1,
    borderRadius: 2,
    transition: 'background-color 0.2s',
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: 500,
    minWidth: 50,
    textAlign: 'right',
  },
  matchError: {
    fontSize: 12,
    color: '#EF4444',
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
    padding: '0 0 0 16px',
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
  backLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#666666',
    textDecoration: 'none',
    fontSize: 14,
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
