import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';

interface Account {
  id: string;
  name: string;
  accountNumber: string;
  type: string;
  status: string;
  currentBalance: number;
  availableBalance: number;
}

interface Transaction {
  id: string;
  amount: number;
  bankDescription: string;
  counterpartyName: string;
  createdAt: string;
  kind: string;
  status: string;
  externalMemo: string | null;
}

interface BankingData {
  accounts: Account[];
  totalBalance: number;
  recentTransactions: Transaction[];
  incomingLast30Days: number;
  outgoingLast30Days: number;
  netProfitLoss: number;
  monthlyBurn: number;
  cashRunway: number | null;
  isDemo: boolean;
  error?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const BankIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="bankGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d4aa" />
        <stop offset="100%" stopColor="#00b4d8" />
      </linearGradient>
    </defs>
    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" stroke="url(#bankGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrendUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="trendUpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d4aa" />
        <stop offset="100%" stopColor="#00ff88" />
      </linearGradient>
    </defs>
    <path d="M23 6l-9.5 9.5-5-5L1 18" stroke="url(#trendUpGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 6h6v6" stroke="url(#trendUpGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrendDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="trendDownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6b6b" />
        <stop offset="100%" stopColor="#ff4757" />
      </linearGradient>
    </defs>
    <path d="M23 18l-9.5-9.5-5 5L1 6" stroke="url(#trendDownGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 18h6v-6" stroke="url(#trendDownGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    <path d="M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="url(#walletGrad)" strokeWidth="2"/>
    <circle cx="16" cy="12" r="2" fill="url(#walletGrad)"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f093fb" />
        <stop offset="100%" stopColor="#f5576c" />
      </linearGradient>
    </defs>
    <path d="M18 20V10M12 20V4M6 20v-6" stroke="url(#chartGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="clockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4facfe" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#clockGrad)" strokeWidth="2"/>
    <path d="M12 6v6l4 2" stroke="url(#clockGrad)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f093fb" />
        <stop offset="100%" stopColor="#f5576c" />
      </linearGradient>
    </defs>
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" stroke="url(#sparkleGrad)" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
    <path d="M12 8v4M12 16h.01" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function BankingDashboard() {
  const { user, loading, authorized } = useRequireAdmin();
  const [data, setData] = useState<BankingData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBankingData() {
      try {
        const response = await fetch('/api/admin/banking');
        if (!response.ok) {
          throw new Error('Failed to fetch banking data');
        }
        const bankingData = await response.json();
        setData(bankingData);
        if (bankingData.error) {
          setError(bankingData.error);
        }
      } catch (err) {
        console.error('Error loading banking data:', err);
        setError('Unable to load banking data');
      } finally {
        setLoadingData(false);
      }
    }

    if (authorized) {
      loadBankingData();
    }
  }, [authorized]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Initializing</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Authenticating</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.meshGradient} />
      <div style={styles.orbOne} />
      <div style={styles.orbTwo} />
      <div style={styles.orbThree} />
      <div style={styles.orbFour} />

      <nav style={styles.nav}>
        <Link href="/admin" style={styles.logo}>
          <span style={styles.logoIcon}>D</span>
          <span style={styles.logoText}>DRIZZL</span>
        </Link>
        <div style={styles.navLinks}>
          <Link href="/admin/command-center" style={styles.navLink}>Command Center</Link>
          <Link href="/admin/products" style={styles.navLink}>Products</Link>
          <Link href="/admin/product-intel" style={styles.navLink}>Product Intel</Link>
          <Link href="/admin/orders" style={styles.navLink}>Orders</Link>
          <Link href="/admin/partners" style={styles.navLink}>Partners</Link>
          <Link href="/admin/banking" style={styles.navLinkActive}>Banking</Link>
          <Link href="/admin/analytics" style={styles.navLink}>Analytics</Link>
          <Link href="/admin/ai-assistant" style={styles.navLink}>AI Assistant</Link>
          <Link href="/" style={styles.exitLink}>Exit</Link>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <div style={styles.headerIconRow}>
              <BankIcon />
              <p style={styles.greeting}>Financial Intelligence</p>
            </div>
            <h1 style={styles.title}>Banking</h1>
            <p style={styles.subtitle}>Cash flow analysis and financial overview</p>
          </div>
          {data?.isDemo && (
            <div style={styles.demoTag}>
              <InfoIcon />
              <span>Demo Mode - Connect Mercury API for live data</span>
            </div>
          )}
        </div>

        {error && (
          <div style={styles.errorCard}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {loadingData ? (
          <div style={styles.loadingDataContainer}>
            <div style={styles.loadingOrb} />
            <p style={styles.loadingText}>Loading financial data...</p>
          </div>
        ) : (
          <>
            <div style={styles.kpiGrid}>
              <KPICard
                title="Total Cash"
                value={formatCurrency(data?.totalBalance || 0)}
                subtitle="All accounts"
                icon={<WalletIcon />}
                accent="purple"
              />
              <KPICard
                title="Income (30d)"
                value={formatCurrency(data?.incomingLast30Days || 0)}
                subtitle="Deposits & transfers"
                icon={<TrendUpIcon />}
                accent="green"
                positive
              />
              <KPICard
                title="Expenses (30d)"
                value={formatCurrency(data?.outgoingLast30Days || 0)}
                subtitle="Payments & withdrawals"
                icon={<TrendDownIcon />}
                accent="red"
                negative
              />
              <KPICard
                title="Net P/L (30d)"
                value={formatCurrency(data?.netProfitLoss || 0)}
                subtitle="Income - Expenses"
                icon={<ChartIcon />}
                accent={(data?.netProfitLoss || 0) >= 0 ? "green" : "red"}
                positive={(data?.netProfitLoss || 0) >= 0}
                negative={(data?.netProfitLoss || 0) < 0}
              />
            </div>

            <div style={styles.secondaryGrid}>
              <div style={styles.glassCard}>
                <div style={styles.cardHeader}>
                  <ClockIcon />
                  <h2 style={styles.cardTitle}>Burn Rate & Runway</h2>
                </div>
                <div style={styles.burnRateContent}>
                  <div style={styles.burnMetric}>
                    <p style={styles.burnValue}>{formatCurrency(data?.monthlyBurn || 0)}</p>
                    <p style={styles.burnLabel}>Monthly burn</p>
                  </div>
                  <div style={styles.burnMetric}>
                    <p style={styles.runwayValue}>
                      {data?.cashRunway !== null ? `${data?.cashRunway} mo` : 'N/A'}
                    </p>
                    <p style={styles.burnLabel}>Cash runway</p>
                  </div>
                </div>
                {data?.cashRunway !== null && (
                  <div style={styles.runwayProgress}>
                    <div style={styles.progressTrack}>
                      <div style={{
                        ...styles.progressFill,
                        width: `${Math.min((data?.cashRunway || 0) / 24 * 100, 100)}%`,
                        background: (data?.cashRunway || 0) > 12 
                          ? 'linear-gradient(90deg, #00d4aa 0%, #00ff88 100%)' 
                          : (data?.cashRunway || 0) > 6 
                            ? 'linear-gradient(90deg, #f0c419 0%, #f5a623 100%)' 
                            : 'linear-gradient(90deg, #ff6b6b 0%, #ff4757 100%)',
                      }} />
                    </div>
                    <p style={styles.runwayStatus}>
                      {(data?.cashRunway || 0) > 12 ? 'Healthy runway' : (data?.cashRunway || 0) > 6 ? 'Moderate runway' : 'Low runway - monitor closely'}
                    </p>
                  </div>
                )}
              </div>

              <div style={styles.glassCard}>
                <div style={styles.cardHeader}>
                  <SparkleIcon />
                  <h2 style={styles.cardTitle}>AI Insights</h2>
                </div>
                <div style={styles.aiInsightsPlaceholder}>
                  <div style={styles.aiIconContainer}>
                    <SparkleIcon />
                  </div>
                  <p style={styles.aiTitle}>AI-powered insights coming soon</p>
                  <p style={styles.aiSubtitle}>Anomaly detection, spending patterns, and forecasting</p>
                </div>
              </div>
            </div>

            <div style={styles.tertiaryGrid}>
              <div style={styles.glassCard}>
                <div style={styles.cardHeader}>
                  <WalletIcon />
                  <h2 style={styles.cardTitle}>Account Balances</h2>
                </div>
                {data?.accounts && data.accounts.length > 0 ? (
                  <div style={styles.accountsList}>
                    {data.accounts.map((account) => (
                      <div key={account.id} style={styles.accountCard}>
                        <div style={styles.accountInfo}>
                          <p style={styles.accountName}>{account.name}</p>
                          <p style={styles.accountType}>
                            {account.type.charAt(0).toUpperCase() + account.type.slice(1)} {account.accountNumber}
                          </p>
                        </div>
                        <div style={styles.accountBalance}>
                          <p style={styles.balanceValue}>{formatCurrency(account.currentBalance)}</p>
                          <p style={styles.availableBalance}>
                            Available: {formatCurrency(account.availableBalance)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={styles.emptyState}>No accounts found</p>
                )}
              </div>

              <div style={styles.glassCard}>
                <div style={styles.cardHeader}>
                  <ChartIcon />
                  <h2 style={styles.cardTitle}>Recent Transactions</h2>
                </div>
                {data?.recentTransactions && data.recentTransactions.length > 0 ? (
                  <div style={styles.transactionsList}>
                    {data.recentTransactions.slice(0, 10).map((tx) => (
                      <div key={tx.id} style={styles.transactionRow}>
                        <div style={styles.transactionLeft}>
                          <span style={{
                            ...styles.transactionBadge,
                            background: tx.amount > 0 
                              ? 'linear-gradient(135deg, rgba(0, 212, 170, 0.2) 0%, rgba(0, 255, 136, 0.1) 100%)'
                              : 'linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 71, 87, 0.1) 100%)',
                            color: tx.amount > 0 ? '#00d4aa' : '#ff6b6b',
                          }}>
                            {tx.amount > 0 ? 'Income' : 'Expense'}
                          </span>
                          <div>
                            <p style={styles.transactionName}>
                              {tx.counterpartyName || tx.bankDescription}
                            </p>
                            <p style={styles.transactionDate}>{formatDate(tx.createdAt)}</p>
                          </div>
                        </div>
                        <p style={{
                          ...styles.transactionAmount,
                          background: tx.amount > 0 
                            ? 'linear-gradient(135deg, #00d4aa 0%, #00ff88 100%)'
                            : 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>
                          {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={styles.emptyState}>No recent transactions</p>
                )}
              </div>
            </div>

            <div style={styles.cashFlowSection}>
              <div style={styles.glassCard}>
                <div style={styles.cardHeader}>
                  <ChartIcon />
                  <h2 style={styles.cardTitle}>Cash Flow Overview</h2>
                </div>
                <div style={styles.cashFlowVisual}>
                  <div style={styles.flowBar}>
                    <div style={styles.flowLabel}>Income</div>
                    <div style={styles.flowTrack}>
                      <div style={{
                        ...styles.flowFill,
                        width: `${Math.min(((data?.incomingLast30Days || 0) / Math.max(data?.incomingLast30Days || 1, Math.abs(data?.outgoingLast30Days || 1))) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #00d4aa 0%, #00ff88 50%, #00d4aa 100%)',
                        boxShadow: '0 0 20px rgba(0, 212, 170, 0.4)',
                      }} />
                    </div>
                    <div style={styles.flowValue}>{formatCurrency(data?.incomingLast30Days || 0)}</div>
                  </div>
                  <div style={styles.flowBar}>
                    <div style={styles.flowLabel}>Expenses</div>
                    <div style={styles.flowTrack}>
                      <div style={{
                        ...styles.flowFill,
                        width: `${Math.min((Math.abs(data?.outgoingLast30Days || 0) / Math.max(data?.incomingLast30Days || 1, Math.abs(data?.outgoingLast30Days || 1))) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #ff6b6b 0%, #ff4757 50%, #ff6b6b 100%)',
                        boxShadow: '0 0 20px rgba(255, 107, 107, 0.4)',
                      }} />
                    </div>
                    <div style={styles.flowValue}>{formatCurrency(Math.abs(data?.outgoingLast30Days || 0))}</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(3deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 170, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 212, 170, 0.6); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}

function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon,
  accent,
  positive, 
  negative 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: React.ReactNode;
  accent: 'green' | 'red' | 'purple' | 'blue';
  positive?: boolean; 
  negative?: boolean; 
}) {
  const accentColors = {
    green: 'linear-gradient(135deg, #00d4aa 0%, #00ff88 100%)',
    red: 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)',
    purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    blue: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  };

  const accentGlow = {
    green: 'rgba(0, 212, 170, 0.15)',
    red: 'rgba(255, 107, 107, 0.15)',
    purple: 'rgba(102, 126, 234, 0.15)',
    blue: 'rgba(79, 172, 254, 0.15)',
  };

  return (
    <div style={{
      ...styles.kpiCard,
      boxShadow: `0 0 40px ${accentGlow[accent]}`,
    }}>
      <div style={{ ...styles.kpiAccent, background: accentColors[accent] }} />
      <div style={styles.kpiIconWrapper}>{icon}</div>
      <p style={styles.kpiLabel}>{title}</p>
      <p style={{
        ...styles.kpiValue,
        background: positive ? accentColors.green : negative ? accentColors.red : accentColors[accent],
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {value}
      </p>
      <p style={styles.kpiSubtitle}>{subtitle}</p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: '#050505',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  meshGradient: {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(ellipse at 20% 20%, rgba(0, 212, 170, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(102, 126, 234, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(240, 147, 251, 0.04) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  orbOne: {
    position: 'fixed',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 212, 170, 0.12) 0%, transparent 70%)',
    top: '-200px',
    right: '-200px',
    animation: 'float 20s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orbTwo: {
    position: 'fixed',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
    bottom: '-100px',
    left: '-100px',
    animation: 'float 15s ease-in-out infinite reverse',
    pointerEvents: 'none',
  },
  orbThree: {
    position: 'fixed',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(240, 147, 251, 0.08) 0%, transparent 70%)',
    top: '40%',
    left: '20%',
    animation: 'float 25s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orbFour: {
    position: 'fixed',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 255, 136, 0.06) 0%, transparent 70%)',
    top: '60%',
    right: '15%',
    animation: 'float 18s ease-in-out infinite reverse',
    pointerEvents: 'none',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#050505',
    gap: '24px',
  },
  loadingOrb: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00d4aa 0%, #00ff88 100%)',
    animation: 'pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  loadingDataContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    gap: '24px',
  },
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: 'rgba(5, 5, 5, 0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: '#fff',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #00d4aa 0%, #00ff88 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
  },
  logoText: {
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '2px',
  },
  navLinks: {
    display: 'flex',
    gap: '28px',
    alignItems: 'center',
  },
  navLink: {
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  navLinkActive: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #00d4aa 0%, #00ff88 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  exitLink: {
    color: 'rgba(255,255,255,0.4)',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
    padding: '8px 16px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  main: {
    position: 'relative',
    zIndex: 1,
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '48px',
  },
  headerIconRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  greeting: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '48px',
    fontWeight: '700',
    letterSpacing: '-2px',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.5px',
  },
  demoTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '12px 18px',
    backdropFilter: 'blur(10px)',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
  },
  errorCard: {
    background: 'rgba(255, 107, 107, 0.08)',
    border: '1px solid rgba(255, 107, 107, 0.2)',
    borderRadius: '16px',
    padding: '16px 24px',
    marginBottom: '24px',
    backdropFilter: 'blur(10px)',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: '14px',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },
  kpiCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  kpiAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
  },
  kpiIconWrapper: {
    marginBottom: '16px',
  },
  kpiLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '10px',
  },
  kpiValue: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-1px',
    marginBottom: '6px',
  },
  kpiSubtitle: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
  },
  secondaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    marginBottom: '32px',
  },
  glassCard: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '24px',
    padding: '28px',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: 'rgba(255,255,255,0.7)',
  },
  burnRateContent: {
    display: 'flex',
    gap: '48px',
    marginBottom: '24px',
  },
  burnMetric: {
    flex: 1,
  },
  burnValue: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-1px',
    marginBottom: '6px',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  runwayValue: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-1px',
    marginBottom: '6px',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  burnLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
  },
  runwayProgress: {
    marginTop: '8px',
  },
  progressTrack: {
    height: '10px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '5px',
    transition: 'width 0.5s ease',
  },
  runwayStatus: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '12px',
  },
  aiInsightsPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    background: 'radial-gradient(ellipse at center, rgba(240, 147, 251, 0.05) 0%, transparent 70%)',
    borderRadius: '16px',
    border: '1px dashed rgba(255,255,255,0.1)',
  },
  aiIconContainer: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(245, 87, 108, 0.1) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  aiTitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '8px',
  },
  aiSubtitle: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
  },
  tertiaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    marginBottom: '32px',
  },
  accountsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  accountCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.04)',
    transition: 'all 0.2s ease',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '4px',
    color: '#fff',
  },
  accountType: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
  },
  accountBalance: {
    textAlign: 'right' as const,
  },
  balanceValue: {
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '4px',
  },
  availableBalance: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.35)',
  },
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '400px',
    overflowY: 'auto' as const,
  },
  transactionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.03)',
    transition: 'all 0.2s ease',
  },
  transactionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  transactionBadge: {
    display: 'inline-block',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  transactionName: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#fff',
    marginBottom: '2px',
  },
  transactionDate: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.35)',
  },
  transactionAmount: {
    fontSize: '15px',
    fontWeight: '700',
  },
  emptyState: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    padding: '40px 20px',
  },
  cashFlowSection: {
    marginTop: '8px',
  },
  cashFlowVisual: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  flowBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  flowLabel: {
    width: '80px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  flowTrack: {
    flex: 1,
    height: '12px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  flowFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 0.6s ease',
  },
  flowValue: {
    width: '100px',
    textAlign: 'right' as const,
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
};
