import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { authenticatePartner } from '../../lib/api/partners';

const NEON_GREEN = '#00FF85';

export default function PartnerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const partner = await authenticatePartner(email, password);
      
      if (partner) {
        const partnerSession = {
          id: partner.id,
          email: partner.email,
          businessName: partner.business_name,
          tier: partner.tier,
          creditLimit: partner.credit_limit,
          outstandingBalance: partner.outstanding_balance,
          accountManager: partner.account_manager || 'Sarah Johnson',
          contactName: partner.contact_name,
          phone: partner.phone,
          taxId: partner.tax_id,
        };
        localStorage.setItem('partnerSession', JSON.stringify(partnerSession));
        router.push('/partner/dashboard');
      } else {
        if (password === 'partner123' && email.includes('@')) {
          const partnerSession = {
            id: 'demo-partner',
            email: email,
            businessName: 'Fresh Foods Market',
            tier: 'silver',
            creditLimit: 5000000,
            outstandingBalance: 0,
            accountManager: 'Sarah Johnson',
            contactName: 'Demo User',
            phone: '(555) 123-4567',
            taxId: '12-3456789',
          };
          localStorage.setItem('partnerSession', JSON.stringify(partnerSession));
          router.push('/partner/dashboard');
        } else {
          setError('Invalid email or password. For demo: use any email with password "partner123"');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      if (password === 'partner123' && email.includes('@')) {
        const partnerSession = {
          id: 'demo-partner',
          email: email,
          businessName: 'Fresh Foods Market',
          tier: 'silver',
          creditLimit: 5000000,
          outstandingBalance: 0,
          accountManager: 'Sarah Johnson',
          contactName: 'Demo User',
          phone: '(555) 123-4567',
          taxId: '12-3456789',
        };
        localStorage.setItem('partnerSession', JSON.stringify(partnerSession));
        router.push('/partner/dashboard');
      } else {
        setError('Authentication failed. Please try again.');
      }
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Partner Login | DRIZZL</title>
      </Head>

      <div style={styles.container}>
        <div style={styles.formContainer}>
          <div style={styles.logoSection}>
            <img
              src="/logo.gif"
              alt="DRIZZL"
              style={styles.logo}
            />
            <h1 style={styles.title}>Partner Portal</h1>
            <p style={styles.subtitle}>Sign in to access your wholesale account</p>
          </div>

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

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.inputIcon} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={styles.input}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>

            <div style={styles.helpSection}>
              <Link href="/partner/forgot-password" style={styles.helpLink}>
                Forgot your password?
              </Link>
              <span style={styles.helpDivider}>|</span>
              <Link href="/partner/apply" style={styles.helpLink}>
                Become a Partner
              </Link>
            </div>
          </form>

          <div style={styles.demoNotice}>
            <strong>Demo Mode:</strong> Use any email with password "partner123"
          </div>
        </div>

        <div style={styles.infoSection}>
          <h2 style={styles.infoTitle}>Partner Benefits</h2>
          <div style={styles.benefits}>
            <div style={styles.benefit}>
              <div style={styles.benefitIcon}>💰</div>
              <div>
                <h3 style={styles.benefitTitle}>Wholesale Pricing</h3>
                <p style={styles.benefitText}>Up to 40% off retail prices</p>
              </div>
            </div>
            <div style={styles.benefit}>
              <div style={styles.benefitIcon}>📦</div>
              <div>
                <h3 style={styles.benefitTitle}>Flexible Orders</h3>
                <p style={styles.benefitText}>No minimum order requirements</p>
              </div>
            </div>
            <div style={styles.benefit}>
              <div style={styles.benefitIcon}>⚡</div>
              <div>
                <h3 style={styles.benefitTitle}>Fast Delivery</h3>
                <p style={styles.benefitText}>2-3 day shipping nationwide</p>
              </div>
            </div>
            <div style={styles.benefit}>
              <div style={styles.benefitIcon}>🎯</div>
              <div>
                <h3 style={styles.benefitTitle}>Dedicated Support</h3>
                <p style={styles.benefitText}>Personal account manager</p>
              </div>
            </div>
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
    gap: 64,
  },
  formContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 40,
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
  helpSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  helpLink: {
    color: '#666666',
    fontSize: 13,
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  helpDivider: {
    color: '#333333',
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
  infoSection: {
    display: 'none',
    maxWidth: 360,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: 24,
  },
  benefits: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  benefit: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
  },
  benefitIcon: {
    fontSize: 28,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  benefitText: {
    fontSize: 13,
    color: '#666666',
    margin: '4px 0 0 0',
  },
};
