import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, AlertCircle, X, Check } from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

export default function CustomerSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('customerSession');
    if (session) {
      router.replace('/account/dashboard');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const customerSession = {
      id: 'cust-' + Date.now(),
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      loyaltyPoints: 100,
      memberSince: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem('customerSession', JSON.stringify(customerSession));
    router.push('/account/dashboard');
  };

  const handleSocialSignup = (provider: string) => {
    setToast(`${provider} signup coming soon!`);
    setTimeout(() => setToast(''), 3000);
  };

  const passwordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return { text: '', color: '' };
    if (pwd.length < 6) return { text: 'Too short', color: '#EF4444' };
    if (pwd.length < 8) return { text: 'Fair', color: '#F59E0B' };
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { text: 'Strong', color: NEON_GREEN };
    }
    return { text: 'Good', color: '#3B82F6' };
  };

  const strength = passwordStrength();

  return (
    <>
      <Head>
        <title>Create Account | DRIZZL</title>
      </Head>

      <div style={styles.container}>
        {toast && (
          <div style={styles.toast}>
            <span>{toast}</span>
            <button onClick={() => setToast('')} style={styles.toastClose}>
              <X size={16} />
            </button>
          </div>
        )}

        <div style={styles.formContainer}>
          <div style={styles.logoSection}>
            <Link href="/">
              <img
                src="/logo.gif"
                alt="DRIZZL"
                style={styles.logo}
              />
            </Link>
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>Join DRIZZL and start earning rewards</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && (
              <div style={styles.errorBox}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div style={styles.nameRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>First Name</label>
                <div style={styles.inputWrapper}>
                  <User size={18} style={styles.inputIcon} />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    style={styles.input}
                    required
                  />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Last Name</label>
                <div style={styles.inputWrapper}>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    style={{ ...styles.input, paddingLeft: 14 }}
                    required
                  />
                </div>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.inputIcon} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  style={styles.input}
                  required
                  autoComplete="new-password"
                />
              </div>
              {strength.text && (
                <span style={{ fontSize: 12, color: strength.color, marginTop: 4 }}>
                  Password strength: {strength.text}
                </span>
              )}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.inputIcon} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  style={styles.input}
                  required
                  autoComplete="new-password"
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <Check size={18} style={{ position: 'absolute', right: 14, color: NEON_GREEN }} />
                )}
              </div>
            </div>

            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight size={18} />}
            </button>

            <div style={styles.divider}>
              <span style={styles.dividerLine} />
              <span style={styles.dividerText}>or sign up with</span>
              <span style={styles.dividerLine} />
            </div>

            <div style={styles.socialButtons}>
              <button
                type="button"
                onClick={() => handleSocialSignup('Google')}
                style={styles.socialButton}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialSignup('Apple')}
                style={styles.socialButton}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Apple
              </button>
            </div>

            <div style={styles.benefits}>
              <div style={styles.benefit}>
                <Check size={16} color={NEON_GREEN} />
                <span>Earn 100 points on signup</span>
              </div>
              <div style={styles.benefit}>
                <Check size={16} color={NEON_GREEN} />
                <span>Track orders & manage subscriptions</span>
              </div>
              <div style={styles.benefit}>
                <Check size={16} color={NEON_GREEN} />
                <span>Exclusive member rewards & offers</span>
              </div>
            </div>
          </form>

          <div style={styles.loginSection}>
            Already have an account?{' '}
            <Link href="/account/login" style={styles.loginLink}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
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
    maxWidth: 480,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 40,
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
  nameRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
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
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
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
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    margin: '8px 0',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: CARD_BORDER,
  },
  dividerText: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialButtons: {
    display: 'flex',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  benefits: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 16,
    backgroundColor: 'rgba(0, 255, 133, 0.03)',
    borderRadius: 8,
  },
  benefit: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 13,
    color: '#999999',
  },
  loginSection: {
    textAlign: 'center',
    marginTop: 24,
    paddingTop: 24,
    borderTop: `1px solid ${CARD_BORDER}`,
    color: '#666666',
    fontSize: 14,
  },
  loginLink: {
    color: NEON_GREEN,
    fontWeight: 600,
    textDecoration: 'none',
  },
};
