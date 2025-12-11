import React from 'react';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
import {
  DollarSign,
  Send,
  FileText,
  Receipt,
  Download,
  RefreshCw,
  Building2,
  Wallet,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface BankAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
  isPrimary?: boolean;
  icon: React.ReactNode;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  balance: number;
  type: 'credit' | 'debit';
}

interface ReceivableItem {
  id: string;
  customer: string;
  invoiceNumber: string;
  amount: number;
  daysOverdue: number;
}

interface PayableItem {
  id: string;
  vendor: string;
  dueDate: string;
  amount: number;
  status: 'due' | 'overdue' | 'pending';
}

const bankAccounts: BankAccount[] = [
  {
    id: 'operating',
    name: 'Operating Account',
    type: 'Primary',
    balance: 284392.45,
    isPrimary: true,
    icon: <Building2 size={20} color={NEON_GREEN} />,
  },
  {
    id: 'payroll',
    name: 'Payroll Account',
    type: 'Checking',
    balance: 142850.00,
    icon: <Wallet size={20} color={NEON_GREEN} />,
  },
  {
    id: 'savings',
    name: 'Savings/Reserve',
    type: 'Savings',
    balance: 500000.00,
    icon: <PiggyBank size={20} color={NEON_GREEN} />,
  },
];

const totalBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);

const recentTransactions: Transaction[] = [
  { id: 'tx-001', date: 'Dec 10, 2025', description: 'Shopify Payout - Weekly', category: 'Revenue', amount: 24500, balance: 927242.45, type: 'credit' },
  { id: 'tx-002', date: 'Dec 9, 2025', description: 'Bi-weekly Payroll', category: 'Payroll', amount: 42000, balance: 902742.45, type: 'debit' },
  { id: 'tx-003', date: 'Dec 8, 2025', description: 'Whole Foods - B2B Order', category: 'Revenue', amount: 38500, balance: 944742.45, type: 'credit' },
  { id: 'tx-004', date: 'Dec 7, 2025', description: 'Fresh Farms Co - Ingredients', category: 'Supplies', amount: 12800, balance: 906242.45, type: 'debit' },
  { id: 'tx-005', date: 'Dec 6, 2025', description: 'Meta Ads - December', category: 'Marketing', amount: 8500, balance: 919042.45, type: 'debit' },
  { id: 'tx-006', date: 'Dec 5, 2025', description: 'Target Corp - B2B Order', category: 'Revenue', amount: 52000, balance: 927542.45, type: 'credit' },
  { id: 'tx-007', date: 'Dec 4, 2025', description: 'WeWork - Office Rent', category: 'Rent', amount: 4500, balance: 875542.45, type: 'debit' },
  { id: 'tx-008', date: 'Dec 3, 2025', description: 'Stripe Transfer - D2C', category: 'Revenue', amount: 18200, balance: 880042.45, type: 'credit' },
  { id: 'tx-009', date: 'Dec 2, 2025', description: 'ShipStation - Shipping', category: 'Shipping', amount: 3400, balance: 861842.45, type: 'debit' },
  { id: 'tx-010', date: 'Dec 1, 2025', description: 'Costco - B2B Order', category: 'Revenue', amount: 65000, balance: 865242.45, type: 'credit' },
];

const cashFlowData = [
  { date: 'Dec 10', income: 24500, expenses: 8200, netPosition: 927242 },
  { date: 'Dec 17', income: 32000, expenses: 45000, netPosition: 914242 },
  { date: 'Dec 24', income: 28000, expenses: 12000, netPosition: 930242 },
  { date: 'Dec 31', income: 38000, expenses: 48000, netPosition: 920242 },
  { date: 'Jan 7', income: 42000, expenses: 18000, netPosition: 944242 },
  { date: 'Jan 14', income: 35000, expenses: 42000, netPosition: 937242 },
  { date: 'Jan 21', income: 48000, expenses: 15000, netPosition: 970242 },
  { date: 'Jan 28', income: 32000, expenses: 22000, netPosition: 980242 },
  { date: 'Feb 4', income: 45000, expenses: 48000, netPosition: 977242 },
  { date: 'Feb 11', income: 52000, expenses: 18000, netPosition: 1011242 },
  { date: 'Feb 18', income: 38000, expenses: 25000, netPosition: 1024242 },
  { date: 'Feb 25', income: 42000, expenses: 16000, netPosition: 1050242 },
  { date: 'Mar 4', income: 48000, expenses: 45000, netPosition: 1053242 },
];

const accountsReceivable: ReceivableItem[] = [
  { id: 'ar-001', customer: 'Whole Foods Market', invoiceNumber: 'INV-2024-0892', amount: 42500, daysOverdue: 15 },
  { id: 'ar-002', customer: 'Target Corporation', invoiceNumber: 'INV-2024-0885', amount: 38000, daysOverdue: 8 },
  { id: 'ar-003', customer: 'Sprouts Farmers Market', invoiceNumber: 'INV-2024-0901', amount: 28500, daysOverdue: 3 },
  { id: 'ar-004', customer: 'Costco Wholesale', invoiceNumber: 'INV-2024-0912', amount: 65000, daysOverdue: 0 },
  { id: 'ar-005', customer: "Trader Joe's", invoiceNumber: 'INV-2024-0918', amount: 22800, daysOverdue: 12 },
];

const accountsPayable: PayableItem[] = [
  { id: 'ap-001', vendor: 'Fresh Farms Co', dueDate: 'Dec 15, 2025', amount: 24500, status: 'due' },
  { id: 'ap-002', vendor: 'Premium Packaging Ltd', dueDate: 'Dec 8, 2025', amount: 8750, status: 'overdue' },
  { id: 'ap-003', vendor: 'Organic Produce Direct', dueDate: 'Dec 20, 2025', amount: 18900, status: 'pending' },
  { id: 'ap-004', vendor: 'Industrial Blenders Co', dueDate: 'Dec 18, 2025', amount: 3200, status: 'due' },
  { id: 'ap-005', vendor: 'ShipStation', dueDate: 'Dec 28, 2025', amount: 4200, status: 'pending' },
];

const monthlyRevenueExpenses = [
  { month: 'Jan', revenue: 285000, expenses: 198000 },
  { month: 'Feb', revenue: 310000, expenses: 205000 },
  { month: 'Mar', revenue: 342000, expenses: 218000 },
  { month: 'Apr', revenue: 328000, expenses: 212000 },
  { month: 'May', revenue: 365000, expenses: 225000 },
  { month: 'Jun', revenue: 398000, expenses: 248000 },
  { month: 'Jul', revenue: 425000, expenses: 265000 },
  { month: 'Aug', revenue: 412000, expenses: 258000 },
  { month: 'Sep', revenue: 445000, expenses: 275000 },
  { month: 'Oct', revenue: 468000, expenses: 288000 },
  { month: 'Nov', revenue: 475000, expenses: 295000 },
  { month: 'Dec', revenue: 487392, expenses: 340000 },
];

const plSummary = {
  revenueMTD: 487392,
  cogs: 195000,
  grossProfit: 292392,
  grossMargin: 60,
  operatingExpenses: 145000,
  netIncome: 147392,
  netMargin: 30,
};

const quickActions = [
  { label: 'Send Payment', icon: <Send size={16} /> },
  { label: 'Create Invoice', icon: <FileText size={16} /> },
  { label: 'Record Expense', icon: <Receipt size={16} /> },
  { label: 'Export Report', icon: <Download size={16} /> },
  { label: 'Sync Bank', icon: <RefreshCw size={16} />, primary: true },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatCurrencyShort(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function CashFlowTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div style={styles.tooltip}>
        <p style={styles.tooltipLabel}>{label}</p>
        <div style={styles.tooltipRow}>
          <span style={{ color: NEON_GREEN }}>Income:</span>
          <span>{formatCurrencyShort(data?.income || 0)}</span>
        </div>
        <div style={styles.tooltipRow}>
          <span style={{ color: '#FF6B6B' }}>Expenses:</span>
          <span>{formatCurrencyShort(data?.expenses || 0)}</span>
        </div>
        <div style={{ ...styles.tooltipRow, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8, marginTop: 8 }}>
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>Net Position:</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>{formatCurrencyShort(data?.netPosition || 0)}</span>
        </div>
      </div>
    );
  }
  return null;
}

function BarChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={styles.tooltip}>
        <p style={styles.tooltipLabel}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} style={styles.tooltipRow}>
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span>{formatCurrencyShort(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function FinancePage() {
  return (
    <CommandCenterLayout title="Finance">
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.iconWrapper}>
            <DollarSign size={24} color={NEON_GREEN} />
          </div>
          <div>
            <h1 style={styles.title}>Finance</h1>
            <p style={styles.subtitle}>Banking, cash flow, and financial management</p>
          </div>
        </header>

        <div style={styles.quickActionsBar}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              style={{
                ...styles.quickActionBtn,
                ...(action.primary ? styles.quickActionBtnPrimary : {}),
              }}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Building2 size={18} color={NEON_GREEN} />
            Bank Accounts Overview
          </h2>
          <div style={styles.accountsGrid}>
            {bankAccounts.map((account) => (
              <div key={account.id} style={styles.accountCard}>
                <div style={styles.accountHeader}>
                  <div style={styles.accountIcon}>{account.icon}</div>
                  <div>
                    <p style={styles.accountName}>{account.name}</p>
                    <p style={styles.accountType}>{account.type}</p>
                  </div>
                </div>
                <p style={styles.accountBalance}>{formatCurrency(account.balance)}</p>
              </div>
            ))}
            <div style={styles.totalCard}>
              <p style={styles.totalLabel}>Total Balance</p>
              <p style={styles.totalValue}>{formatCurrency(totalBalance)}</p>
              <div style={styles.runwayBadge}>
                <Clock size={12} />
                <span>3 Mercury Accounts</span>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <Receipt size={16} color={NEON_GREEN} />
              Recent Transactions
            </h3>
            <button style={styles.viewAllBtn}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Category</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} style={styles.tr}>
                    <td style={styles.td}>{tx.date}</td>
                    <td style={styles.td}>{tx.description}</td>
                    <td style={styles.td}>
                      <span style={styles.categoryBadge}>{tx.category}</span>
                    </td>
                    <td style={{
                      ...styles.td,
                      textAlign: 'right',
                      color: tx.type === 'credit' ? NEON_GREEN : '#FF6B6B',
                      fontWeight: 600,
                    }}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right', color: '#fff' }}>
                      {formatCurrency(tx.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <TrendingUp size={16} color={NEON_GREEN} />
              Cash Flow Forecast (90 Days)
            </h3>
          </div>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={NEON_GREEN} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={NEON_GREEN} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CashFlowTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{value}</span>}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Projected Income"
                  stroke={NEON_GREEN}
                  strokeWidth={2}
                  fill="url(#incomeGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Projected Expenses"
                  stroke="#FF6B6B"
                  strokeWidth={2}
                  fill="url(#expensesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div style={styles.twoColumnGrid}>
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <TrendingUp size={16} color={NEON_GREEN} />
                Accounts Receivable
              </h3>
              <span style={styles.totalBadge}>
                {formatCurrencyShort(accountsReceivable.reduce((sum, item) => sum + item.amount, 0))}
              </span>
            </div>
            <div style={styles.arApList}>
              {accountsReceivable.map((item) => (
                <div key={item.id} style={styles.arApRow}>
                  <div style={styles.arApInfo}>
                    <p style={styles.arApName}>{item.customer}</p>
                    <p style={styles.arApMeta}>{item.invoiceNumber}</p>
                  </div>
                  <div style={styles.arApRight}>
                    <p style={styles.arApAmount}>{formatCurrency(item.amount)}</p>
                    <p style={{
                      ...styles.arApStatus,
                      color: item.daysOverdue > 10 ? '#FF6B6B' : item.daysOverdue > 0 ? '#FFA500' : NEON_GREEN,
                    }}>
                      {item.daysOverdue === 0 ? 'Current' : `${item.daysOverdue} days overdue`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <TrendingDown size={16} color="#FF6B6B" />
                Accounts Payable
              </h3>
              <span style={styles.totalBadge}>
                {formatCurrencyShort(accountsPayable.reduce((sum, item) => sum + item.amount, 0))}
              </span>
            </div>
            <div style={styles.arApList}>
              {accountsPayable.map((item) => (
                <div key={item.id} style={{
                  ...styles.arApRow,
                  borderLeft: item.status === 'overdue' ? '3px solid #FF6B6B' : '3px solid transparent',
                }}>
                  <div style={styles.arApInfo}>
                    <p style={styles.arApName}>{item.vendor}</p>
                    <p style={styles.arApMeta}>Due: {item.dueDate}</p>
                  </div>
                  <div style={styles.arApRight}>
                    <p style={styles.arApAmount}>{formatCurrency(item.amount)}</p>
                    <p style={{
                      ...styles.arApStatus,
                      color: item.status === 'overdue' ? '#FF6B6B' : item.status === 'due' ? '#FFA500' : 'rgba(255,255,255,0.5)',
                    }}>
                      {item.status === 'overdue' ? 'Overdue' : item.status === 'due' ? 'Due Soon' : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <DollarSign size={16} color={NEON_GREEN} />
              P&L Summary — December 2025
            </h3>
          </div>
          <div style={styles.plGrid}>
            <div style={styles.plItem}>
              <p style={styles.plLabel}>Revenue MTD</p>
              <p style={styles.plValue}>{formatCurrencyShort(plSummary.revenueMTD)}</p>
            </div>
            <div style={styles.plItem}>
              <p style={styles.plLabel}>COGS</p>
              <p style={{ ...styles.plValue, color: '#FF6B6B' }}>-{formatCurrencyShort(plSummary.cogs)}</p>
            </div>
            <div style={styles.plItem}>
              <p style={styles.plLabel}>Gross Profit</p>
              <p style={styles.plValue}>{formatCurrencyShort(plSummary.grossProfit)}</p>
              <span style={styles.plPercent}>{plSummary.grossMargin}%</span>
            </div>
            <div style={styles.plItem}>
              <p style={styles.plLabel}>Operating Expenses</p>
              <p style={{ ...styles.plValue, color: '#FF6B6B' }}>-{formatCurrencyShort(plSummary.operatingExpenses)}</p>
            </div>
            <div style={styles.plItemHighlight}>
              <p style={styles.plLabel}>Net Income</p>
              <p style={styles.plValueLarge}>{formatCurrencyShort(plSummary.netIncome)}</p>
              <div style={styles.healthBadge}>
                <CheckCircle2 size={14} color={NEON_GREEN} />
                <span>{plSummary.netMargin}% margin</span>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <TrendingUp size={16} color={NEON_GREEN} />
              Monthly Revenue vs Expenses
            </h3>
          </div>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenueExpenses} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<BarChartTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{value}</span>}
                />
                <Bar dataKey="revenue" name="Revenue" fill={NEON_GREEN} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </CommandCenterLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1400,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    margin: '4px 0 0 0',
  },
  quickActionsBar: {
    display: 'flex',
    gap: 12,
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'Inter, sans-serif',
  },
  quickActionBtnPrimary: {
    background: NEON_GREEN,
    color: '#000',
    border: 'none',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
  },
  accountsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  accountCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 24,
  },
  accountHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'rgba(0, 255, 133, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 4,
  },
  accountType: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  accountBalance: {
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: -1,
  },
  totalCard: {
    background: `linear-gradient(135deg, rgba(0, 255, 133, 0.1) 0%, rgba(0, 255, 133, 0.02) 100%)`,
    border: `1px solid ${NEON_GREEN}40`,
    borderRadius: 16,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 700,
    color: NEON_GREEN,
    letterSpacing: -1,
    marginBottom: 12,
  },
  runwayBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  card: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  viewAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'none',
    border: 'none',
    color: NEON_GREEN,
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  td: {
    padding: '14px 16px',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 6,
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  chartContainer: {
    marginTop: 16,
  },
  tooltip: {
    background: 'rgba(0,0,0,0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    minWidth: 150,
  },
  tooltipLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 8,
  },
  tooltipRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24,
    marginBottom: 24,
  },
  totalBadge: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    background: 'rgba(255,255,255,0.05)',
    padding: '4px 12px',
    borderRadius: 6,
  },
  arApList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  arApRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
  },
  arApInfo: {
    flex: 1,
  },
  arApName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#fff',
    marginBottom: 2,
  },
  arApMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  arApRight: {
    textAlign: 'right',
  },
  arApAmount: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 2,
  },
  arApStatus: {
    fontSize: 11,
  },
  plGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
  },
  plItem: {
    padding: 20,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    textAlign: 'center',
  },
  plItemHighlight: {
    padding: 20,
    background: `linear-gradient(135deg, rgba(0, 255, 133, 0.1) 0%, rgba(0, 255, 133, 0.02) 100%)`,
    border: `1px solid ${NEON_GREEN}40`,
    borderRadius: 12,
    textAlign: 'center',
  },
  plLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  plValue: {
    fontSize: 20,
    fontWeight: 700,
    color: '#fff',
  },
  plValueLarge: {
    fontSize: 24,
    fontWeight: 700,
    color: NEON_GREEN,
    marginBottom: 8,
  },
  plPercent: {
    display: 'inline-block',
    marginTop: 6,
    padding: '2px 8px',
    background: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 4,
    fontSize: 11,
    color: NEON_GREEN,
  },
  healthBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontSize: 12,
    color: NEON_GREEN,
  },
};
