import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PartnerLayout from '../../components/partner/PartnerLayout';
import {
  CreditCard,
  Clock,
  Percent,
  DollarSign,
  TrendingUp,
  Package,
  FileText,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface PartnerSession {
  id: string;
  email: string;
  businessName: string;
  tier: string;
  creditLimit: number;
  outstandingBalance: number;
}

interface PaymentHistoryItem {
  id: string;
  date: string;
  method: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

const mockPaymentHistory: PaymentHistoryItem[] = [
  { id: 'PAY-001', date: '2025-12-08', method: 'NET 30 Credit', amount: 245000, status: 'completed', reference: 'INV-1847' },
  { id: 'PAY-002', date: '2025-12-05', method: 'Credit Card', amount: 168000, status: 'completed', reference: 'INV-1831' },
  { id: 'PAY-003', date: '2025-12-01', method: 'ACH Transfer', amount: 312000, status: 'completed', reference: 'INV-1819' },
  { id: 'PAY-004', date: '2025-11-28', method: 'NET 30 Credit', amount: 124000, status: 'completed', reference: 'INV-1805' },
  { id: 'PAY-005', date: '2025-11-24', method: 'Credit Card', amount: 208000, status: 'pending', reference: 'INV-1791' },
];

const financingOptions = [
  {
    id: 'net-terms',
    title: 'NET Terms',
    description: 'NET 30, NET 60 options',
    detail: '2% early pay discount',
    icon: Clock,
    color: NEON_GREEN,
    connected: true,
    buttonText: 'Current Plan',
    buttonDisabled: true,
  },
  {
    id: 'afterpay',
    title: 'Afterpay for Business',
    description: 'Split into 4 payments',
    detail: '0% interest',
    icon: CreditCard,
    color: '#00D4AA',
    connected: false,
    buttonText: 'Connect Afterpay Account',
    buttonDisabled: false,
  },
  {
    id: 'klarna',
    title: 'Klarna for Business',
    description: 'Pay in 30 days or split in 3',
    detail: 'Flexible payment options',
    icon: CreditCard,
    color: '#FFB3C7',
    connected: false,
    buttonText: 'Connect Klarna Account',
    buttonDisabled: false,
  },
  {
    id: 'business-loan',
    title: 'Business Loan',
    description: 'Qualify up to $100,000',
    detail: 'Rates from 6.9% APR',
    icon: DollarSign,
    color: '#8B5CF6',
    connected: null,
    buttonText: 'Check Eligibility',
    buttonDisabled: false,
  },
  {
    id: 'equipment',
    title: 'Equipment Financing',
    description: 'Freezer & display equipment',
    detail: '$150/month for 36 months',
    icon: Package,
    color: '#F59E0B',
    connected: null,
    buttonText: 'Browse Equipment',
    buttonDisabled: false,
  },
  {
    id: 'factoring',
    title: 'Invoice Factoring',
    description: 'Get 80-90% upfront',
    detail: 'Fast cash flow solution',
    icon: FileText,
    color: '#06B6D4',
    connected: null,
    buttonText: 'Learn More',
    buttonDisabled: false,
  },
];

const statusConfig = {
  completed: { icon: CheckCircle, color: NEON_GREEN, bg: 'rgba(0, 255, 133, 0.1)' },
  pending: { icon: Clock, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  failed: { icon: XCircle, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PartnerFinancing() {
  const router = useRouter();
  const [partner, setPartner] = useState<PartnerSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('partnerSession');
    if (!session) {
      router.push('/partner/login');
      return;
    }
    const data = JSON.parse(session);
    setPartner(data);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <PartnerLayout title="Financing" partnerName="Loading...">
        <div style={styles.loadingPage}>
          <Loader2 size={32} color={NEON_GREEN} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={styles.loadingText}>Loading financing options...</p>
        </div>
      </PartnerLayout>
    );
  }

  if (!partner) {
    return null;
  }

  const creditLimit = partner.creditLimit ? partner.creditLimit / 100 : 50000;
  const outstandingBalance = partner.outstandingBalance ? partner.outstandingBalance / 100 : 14600;
  const availableCredit = creditLimit - outstandingBalance;

  return (
    <PartnerLayout title="Financing" partnerName={partner.businessName}>
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Flexible Payment Solutions for Your Business</h1>
          <p style={styles.subtitle}>Choose the financing option that works best for your business needs</p>
        </div>

        <div style={styles.currentTermsCard}>
          <div style={styles.termsHeader}>
            <div style={styles.termsIcon}>
              <TrendingUp size={24} color={NEON_GREEN} />
            </div>
            <div>
              <h2 style={styles.termsTitle}>Your Current Terms</h2>
              <span style={styles.termsBadge}>NET 30</span>
            </div>
          </div>
          <div style={styles.termsGrid}>
            <div style={styles.termsStat}>
              <span style={styles.termsLabel}>Credit Limit</span>
              <span style={styles.termsValue}>${creditLimit.toLocaleString()}</span>
            </div>
            <div style={styles.termsStat}>
              <span style={styles.termsLabel}>Available Credit</span>
              <span style={{ ...styles.termsValue, color: NEON_GREEN }}>${availableCredit.toLocaleString()}</span>
            </div>
            <div style={styles.termsStat}>
              <span style={styles.termsLabel}>Outstanding</span>
              <span style={styles.termsValue}>${outstandingBalance.toLocaleString()}</span>
            </div>
          </div>
          <button style={styles.requestButton}>
            <ArrowUpRight size={16} />
            Request Credit Increase
          </button>
        </div>

        <h2 style={styles.sectionTitle}>Financing Options</h2>
        <div style={styles.optionsGrid}>
          {financingOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.id} style={styles.optionCard}>
                <div style={styles.optionHeader}>
                  <div style={{ ...styles.optionIcon, backgroundColor: `${option.color}20` }}>
                    <Icon size={20} color={option.color} />
                  </div>
                  {option.connected !== null && (
                    <span style={{
                      ...styles.connectionBadge,
                      backgroundColor: option.connected ? 'rgba(0, 255, 133, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      color: option.connected ? NEON_GREEN : '#999999',
                    }}>
                      {option.connected ? 'Connected' : 'Not Connected'}
                    </span>
                  )}
                </div>
                <h3 style={styles.optionTitle}>{option.title}</h3>
                <p style={styles.optionDescription}>{option.description}</p>
                <p style={styles.optionDetail}>{option.detail}</p>
                <button
                  style={{
                    ...styles.optionButton,
                    ...(option.buttonDisabled ? styles.optionButtonDisabled : {}),
                  }}
                  disabled={option.buttonDisabled}
                >
                  {option.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        <div style={styles.historySection}>
          <h2 style={styles.sectionTitle}>Payment History</h2>
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Reference</th>
                  <th style={styles.th}>Payment Method</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockPaymentHistory.map((payment) => {
                  const StatusIcon = statusConfig[payment.status].icon;
                  return (
                    <tr key={payment.id}>
                      <td style={styles.td}>{formatDate(payment.date)}</td>
                      <td style={styles.td}>
                        <span style={styles.reference}>{payment.reference}</span>
                      </td>
                      <td style={styles.td}>{payment.method}</td>
                      <td style={styles.td}>
                        <span style={styles.amount}>${(payment.amount / 100).toLocaleString()}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: statusConfig[payment.status].bg,
                          color: statusConfig[payment.status].color,
                        }}>
                          <StatusIcon size={14} />
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </PartnerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '32px 24px',
    maxWidth: 1200,
    margin: '0 auto',
  },
  loadingPage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: 16,
  },
  loadingText: {
    color: '#999999',
    fontSize: 14,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 8,
  },
  subtitle: {
    color: '#999999',
    fontSize: 16,
    margin: 0,
  },
  currentTermsCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
  },
  termsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  termsIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 4,
  },
  termsBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  termsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
    marginBottom: 24,
  },
  termsStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  termsLabel: {
    color: '#999999',
    fontSize: 14,
  },
  termsValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 600,
  },
  requestButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: `1px solid ${NEON_GREEN}`,
    borderRadius: 8,
    color: NEON_GREEN,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 20,
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 20,
    marginBottom: 48,
  },
  optionCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
  },
  optionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectionBadge: {
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 500,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 8,
  },
  optionDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    margin: 0,
    marginBottom: 4,
  },
  optionDetail: {
    color: NEON_GREEN,
    fontSize: 13,
    margin: 0,
    marginBottom: 20,
    fontWeight: 500,
  },
  optionButton: {
    marginTop: 'auto',
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  optionButtonDisabled: {
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderColor: 'transparent',
    color: NEON_GREEN,
    cursor: 'default',
  },
  historySection: {
    marginTop: 20,
  },
  tableCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '16px 20px',
    color: '#999999',
    fontSize: 12,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  td: {
    padding: '16px 20px',
    color: '#CCCCCC',
    fontSize: 14,
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  reference: {
    color: NEON_GREEN,
    fontWeight: 500,
  },
  amount: {
    color: '#FFFFFF',
    fontWeight: 600,
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
  },
};
