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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Loading...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Checking authorization...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          DRIZZL ADMIN
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/admin/command-center" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Command Center</Link>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Products</Link>
          <Link href="/admin/product-intel" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Product Intel</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Orders</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Partners</Link>
          <Link href="/admin/banking" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Banking</Link>
          <Link href="/admin/analytics" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Analytics</Link>
          <Link href="/admin/ai" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>AI Tools</Link>
          <Link href="/admin/ai-assistant" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>AI Assistant</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.5px' }}>Banking Intelligence</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Financial overview and cash flow analysis</p>
          </div>
          {data?.isDemo && (
            <div style={{ 
              background: '#f0f0f0', 
              border: '1px solid #e0e0e0', 
              borderRadius: '6px', 
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#666" strokeWidth="1.5"/>
                <path d="M8 5V8.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="11" r="1" fill="#666"/>
              </svg>
              <span style={{ fontSize: '12px', color: '#666' }}>Demo Mode - Connect Mercury API for live data</span>
            </div>
          )}
        </div>

        {error && (
          <div style={{ 
            background: '#fafafa', 
            border: '1px solid #e0e0e0', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '24px' 
          }}>
            <p style={{ color: '#666', fontSize: '14px' }}>{error}</p>
          </div>
        )}

        {loadingData ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <p style={{ color: '#666', fontSize: '14px' }}>Loading financial data...</p>
          </div>
        ) : (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px', 
              marginBottom: '32px' 
            }}>
              <KPICard
                title="Total Cash"
                value={formatCurrency(data?.totalBalance || 0)}
                subtitle="All accounts"
              />
              <KPICard
                title="Income (30d)"
                value={formatCurrency(data?.incomingLast30Days || 0)}
                subtitle="Deposits & transfers"
                positive
              />
              <KPICard
                title="Expenses (30d)"
                value={formatCurrency(data?.outgoingLast30Days || 0)}
                subtitle="Payments & withdrawals"
                negative
              />
              <KPICard
                title="Net P/L (30d)"
                value={formatCurrency(data?.netProfitLoss || 0)}
                subtitle="Income - Expenses"
                positive={(data?.netProfitLoss || 0) >= 0}
                negative={(data?.netProfitLoss || 0) < 0}
              />
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '24px', 
              marginBottom: '32px' 
            }}>
              <div style={{ 
                background: '#fff', 
                borderRadius: '12px', 
                padding: '24px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)' 
              }}>
                <h2 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>
                  Burn Rate & Runway
                </h2>
                <div style={{ display: 'flex', gap: '40px' }}>
                  <div>
                    <p style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-1px', marginBottom: '4px' }}>
                      {formatCurrency(data?.monthlyBurn || 0)}
                    </p>
                    <p style={{ fontSize: '13px', color: '#666' }}>Monthly burn</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-1px', marginBottom: '4px' }}>
                      {data?.cashRunway !== null ? `${data?.cashRunway} mo` : 'N/A'}
                    </p>
                    <p style={{ fontSize: '13px', color: '#666' }}>Cash runway</p>
                  </div>
                </div>
                {data?.cashRunway !== null && (
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ 
                      height: '8px', 
                      background: '#f0f0f0', 
                      borderRadius: '4px', 
                      overflow: 'hidden' 
                    }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${Math.min((data?.cashRunway || 0) / 24 * 100, 100)}%`,
                        background: (data?.cashRunway || 0) > 12 ? '#000' : (data?.cashRunway || 0) > 6 ? '#666' : '#999',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <p style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                      {(data?.cashRunway || 0) > 12 ? 'Healthy runway' : (data?.cashRunway || 0) > 6 ? 'Moderate runway' : 'Low runway - monitor closely'}
                    </p>
                  </div>
                )}
              </div>

              <div style={{ 
                background: '#fff', 
                borderRadius: '12px', 
                padding: '24px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)' 
              }}>
                <h2 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>
                  AI Insights
                </h2>
                <div style={{ 
                  background: '#fafafa', 
                  borderRadius: '8px', 
                  padding: '20px',
                  border: '1px dashed #e0e0e0'
                }}>
                  <p style={{ fontSize: '13px', color: '#999', textAlign: 'center' }}>
                    AI-powered financial insights coming soon
                  </p>
                  <p style={{ fontSize: '12px', color: '#bbb', textAlign: 'center', marginTop: '8px' }}>
                    Anomaly detection, spending patterns, and forecasting
                  </p>
                </div>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '24px' 
            }}>
              <div style={{ 
                background: '#fff', 
                borderRadius: '12px', 
                padding: '24px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)' 
              }}>
                <h2 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>
                  Account Balances
                </h2>
                {data?.accounts && data.accounts.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.accounts.map((account) => (
                      <div 
                        key={account.id} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '16px',
                          background: '#fafafa',
                          borderRadius: '8px'
                        }}
                      >
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{account.name}</p>
                          <p style={{ fontSize: '12px', color: '#999' }}>
                            {account.type.charAt(0).toUpperCase() + account.type.slice(1)} {account.accountNumber}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                            {formatCurrency(account.currentBalance)}
                          </p>
                          <p style={{ fontSize: '11px', color: '#999' }}>
                            Available: {formatCurrency(account.availableBalance)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: '#999', textAlign: 'center', padding: '20px' }}>
                    No accounts found
                  </p>
                )}
              </div>

              <div style={{ 
                background: '#fff', 
                borderRadius: '12px', 
                padding: '24px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)' 
              }}>
                <h2 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>
                  Recent Transactions
                </h2>
                {data?.recentTransactions && data.recentTransactions.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.recentTransactions.slice(0, 10).map((tx) => (
                      <div 
                        key={tx.id} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '12px 16px',
                          background: '#fafafa',
                          borderRadius: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ 
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            background: tx.amount > 0 ? '#e8e8e8' : '#f5f5f5',
                            color: tx.amount > 0 ? '#333' : '#666'
                          }}>
                            {tx.amount > 0 ? 'Income' : 'Expense'}
                          </span>
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '2px' }}>
                              {tx.counterpartyName || tx.bankDescription}
                            </p>
                            <p style={{ fontSize: '11px', color: '#999' }}>{formatDate(tx.createdAt)}</p>
                          </div>
                        </div>
                        <p style={{ 
                          fontSize: '14px', 
                          fontWeight: '600',
                          color: tx.amount > 0 ? '#000' : '#666'
                        }}>
                          {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: '#999', textAlign: 'center', padding: '20px' }}>
                    No recent transactions
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function KPICard({ 
  title, 
  value, 
  subtitle, 
  positive, 
  negative 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  positive?: boolean; 
  negative?: boolean; 
}) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }}>
      <p style={{ 
        fontSize: '12px', 
        color: '#666', 
        marginBottom: '8px', 
        textTransform: 'uppercase', 
        letterSpacing: '0.5px' 
      }}>
        {title}
      </p>
      <p style={{ 
        fontSize: '24px', 
        fontWeight: '700', 
        letterSpacing: '-0.5px',
        color: positive ? '#000' : negative ? '#666' : '#000',
        marginBottom: '4px'
      }}>
        {value}
      </p>
      <p style={{ fontSize: '11px', color: '#999' }}>{subtitle}</p>
    </div>
  );
}
