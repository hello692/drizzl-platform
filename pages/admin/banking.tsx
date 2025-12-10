import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  Building2,
  Wallet,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Send,
  ArrowRightLeft,
  FileText,
  Link2,
  DollarSign,
  Receipt,
  Users,
  Package,
  Megaphone,
  Zap,
  Home,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const isDemoMode = true;

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface MercuryAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'money_market';
  balance: number;
  accountNumber: string;
  icon: React.ReactNode;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'credit' | 'debit';
}

interface CashFlowDataPoint {
  date: string;
  inflows: number;
  outflows: number;
  balance: number;
  event?: string;
}

interface PayableItem {
  id: string;
  vendor: string;
  description: string;
  amount: number;
  dueDate: string;
  daysUntilDue: number;
  isOverdue: boolean;
}

interface ReceivableItem {
  id: string;
  partner: string;
  invoiceNumber: string;
  amount: number;
  issueDate: string;
  daysOutstanding: number;
}

const mercuryAccounts: MercuryAccount[] = [
  {
    id: 'operating',
    name: 'Operating Account',
    type: 'checking',
    balance: 284392,
    accountNumber: '****4521',
    icon: <Building2 size={20} color={NEON_GREEN} />,
  },
  {
    id: 'savings',
    name: 'Savings Reserve',
    type: 'savings',
    balance: 150000,
    accountNumber: '****4522',
    icon: <PiggyBank size={20} color={NEON_GREEN} />,
  },
  {
    id: 'treasury',
    name: 'Treasury',
    type: 'money_market',
    balance: 500000,
    accountNumber: '****4523',
    icon: <Wallet size={20} color={NEON_GREEN} />,
  },
];

const totalAvailable = mercuryAccounts.reduce((sum, acc) => sum + acc.balance, 0);

const recentTransactions: Transaction[] = [
  { id: 'tx-001', date: 'Dec 10, 2025', description: 'Shopify Payout - Weekly', category: 'Revenue', amount: 18420, type: 'credit' },
  { id: 'tx-002', date: 'Dec 9, 2025', description: 'Stripe Transfer - D2C Orders', category: 'Revenue', amount: 12340, type: 'credit' },
  { id: 'tx-003', date: 'Dec 9, 2025', description: 'Bi-weekly Payroll', category: 'Payroll', amount: 28500, type: 'debit' },
  { id: 'tx-004', date: 'Dec 8, 2025', description: 'Whole Foods Market - B2B', category: 'Revenue', amount: 24500, type: 'credit' },
  { id: 'tx-005', date: 'Dec 8, 2025', description: 'Fresh Farms Co - Ingredients', category: 'Supplies', amount: 8750, type: 'debit' },
  { id: 'tx-006', date: 'Dec 7, 2025', description: 'AWS Infrastructure', category: 'Utilities', amount: 1847, type: 'debit' },
  { id: 'tx-007', date: 'Dec 7, 2025', description: 'Sprouts Farmers Market - B2B', category: 'Revenue', amount: 15800, type: 'credit' },
  { id: 'tx-008', date: 'Dec 6, 2025', description: 'Meta Platforms - Ads', category: 'Marketing', amount: 3200, type: 'debit' },
  { id: 'tx-009', date: 'Dec 6, 2025', description: 'WeWork - Office Rent', category: 'Rent', amount: 4500, type: 'debit' },
  { id: 'tx-010', date: 'Dec 5, 2025', description: 'Target Corporation - B2B', category: 'Revenue', amount: 32500, type: 'credit' },
  { id: 'tx-011', date: 'Dec 5, 2025', description: 'ShipStation - Shipping', category: 'Supplies', amount: 2340, type: 'debit' },
  { id: 'tx-012', date: 'Dec 4, 2025', description: 'Organic Produce Direct', category: 'Supplies', amount: 12400, type: 'debit' },
  { id: 'tx-013', date: 'Dec 4, 2025', description: 'Costco Wholesale - B2B', category: 'Revenue', amount: 45000, type: 'credit' },
  { id: 'tx-014', date: 'Dec 3, 2025', description: 'Google Workspace', category: 'Utilities', amount: 432, type: 'debit' },
  { id: 'tx-015', date: 'Dec 3, 2025', description: 'Hartford Insurance - Premium', category: 'Insurance', amount: 2100, type: 'debit' },
];

const cashFlowData: CashFlowDataPoint[] = [
  { date: 'Dec 10', inflows: 18420, outflows: 8200, balance: 934392 },
  { date: 'Dec 15', inflows: 22000, outflows: 32000, balance: 924392, event: 'Payroll' },
  { date: 'Dec 20', inflows: 35000, outflows: 12000, balance: 947392 },
  { date: 'Dec 25', inflows: 15000, outflows: 8000, balance: 954392 },
  { date: 'Jan 1', inflows: 28000, outflows: 42000, balance: 940392, event: 'Rent + Payroll' },
  { date: 'Jan 5', inflows: 42000, outflows: 15000, balance: 967392 },
  { date: 'Jan 10', inflows: 38000, outflows: 18000, balance: 987392 },
  { date: 'Jan 15', inflows: 25000, outflows: 35000, balance: 977392, event: 'Payroll' },
  { date: 'Jan 20', inflows: 48000, outflows: 12000, balance: 1013392 },
  { date: 'Jan 25', inflows: 32000, outflows: 14000, balance: 1031392 },
  { date: 'Feb 1', inflows: 28000, outflows: 45000, balance: 1014392, event: 'Rent + Payroll' },
  { date: 'Feb 5', inflows: 55000, outflows: 18000, balance: 1051392 },
  { date: 'Feb 10', inflows: 42000, outflows: 15000, balance: 1078392 },
  { date: 'Feb 15', inflows: 38000, outflows: 32000, balance: 1084392, event: 'Payroll' },
  { date: 'Feb 20', inflows: 45000, outflows: 12000, balance: 1117392 },
  { date: 'Feb 25', inflows: 35000, outflows: 16000, balance: 1136392 },
  { date: 'Mar 1', inflows: 30000, outflows: 48000, balance: 1118392, event: 'Rent + Payroll' },
  { date: 'Mar 10', inflows: 52000, outflows: 20000, balance: 1150392 },
];

const accountsPayable: PayableItem[] = [
  { id: 'ap-001', vendor: 'Fresh Farms Co', description: 'Ingredient shipment - Q1', amount: 24500, dueDate: 'Dec 15, 2025', daysUntilDue: 5, isOverdue: false },
  { id: 'ap-002', vendor: 'Premium Packaging Ltd', description: 'Custom bottles order', amount: 8750, dueDate: 'Dec 8, 2025', daysUntilDue: -2, isOverdue: true },
  { id: 'ap-003', vendor: 'WeWork', description: 'January office rent', amount: 4500, dueDate: 'Jan 1, 2026', daysUntilDue: 22, isOverdue: false },
  { id: 'ap-004', vendor: 'Industrial Blenders Co', description: 'Equipment maintenance', amount: 3200, dueDate: 'Dec 20, 2025', daysUntilDue: 10, isOverdue: false },
  { id: 'ap-005', vendor: 'Organic Produce Direct', description: 'Açaí bulk order', amount: 18900, dueDate: 'Dec 5, 2025', daysUntilDue: -5, isOverdue: true },
  { id: 'ap-006', vendor: 'ShipStation', description: 'December shipping fees', amount: 4200, dueDate: 'Dec 28, 2025', daysUntilDue: 18, isOverdue: false },
];

const totalPayable = accountsPayable.reduce((sum, item) => sum + item.amount, 0);
const overduePayable = accountsPayable.filter(item => item.isOverdue).reduce((sum, item) => sum + item.amount, 0);

const accountsReceivable: ReceivableItem[] = [
  { id: 'ar-001', partner: 'Whole Foods Market', invoiceNumber: 'INV-2024-0892', amount: 42500, issueDate: 'Nov 15, 2025', daysOutstanding: 25 },
  { id: 'ar-002', partner: 'Target Corporation', invoiceNumber: 'INV-2024-0885', amount: 38000, issueDate: 'Nov 20, 2025', daysOutstanding: 20 },
  { id: 'ar-003', partner: 'Sprouts Farmers Market', invoiceNumber: 'INV-2024-0901', amount: 28500, issueDate: 'Nov 28, 2025', daysOutstanding: 12 },
  { id: 'ar-004', partner: 'Costco Wholesale', invoiceNumber: 'INV-2024-0912', amount: 65000, issueDate: 'Dec 1, 2025', daysOutstanding: 9 },
  { id: 'ar-005', partner: "Trader Joe's", invoiceNumber: 'INV-2024-0918', amount: 22800, issueDate: 'Dec 5, 2025', daysOutstanding: 5 },
];

const totalReceivable = accountsReceivable.reduce((sum, item) => sum + item.amount, 0);

const plSummary = {
  d2cRevenue: 145820,
  b2bRevenue: 198500,
  totalRevenue: 344320,
  cogs: 112450,
  grossProfit: 231870,
  grossMargin: 67.3,
  payroll: 57000,
  marketing: 18500,
  rent: 4500,
  utilities: 3200,
  shipping: 12400,
  software: 4800,
  insurance: 2100,
  legal: 3500,
  totalOpex: 106000,
  netIncome: 125870,
  netMargin: 36.6,
};

const quickActions = [
  { label: 'Pay Bills', icon: <CreditCard size={18} />, primary: false },
  { label: 'Send Invoice', icon: <Send size={18} />, primary: false },
  { label: 'Transfer Funds', icon: <ArrowRightLeft size={18} />, primary: false },
  { label: 'Export Report', icon: <FileText size={18} />, primary: false },
  { label: 'Connect Bank', icon: <Link2 size={18} />, primary: true },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'Revenue': return <DollarSign size={14} />;
    case 'Payroll': return <Users size={14} />;
    case 'Supplies': return <Package size={14} />;
    case 'Marketing': return <Megaphone size={14} />;
    case 'Utilities': return <Zap size={14} />;
    case 'Rent': return <Home size={14} />;
    case 'Insurance': return <Receipt size={14} />;
    default: return <Receipt size={14} />;
  }
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div style={styles.tooltip}>
        <p style={styles.tooltipLabel}>{label}</p>
        {data?.event && (
          <p style={styles.tooltipEvent}>{data.event}</p>
        )}
        <div style={styles.tooltipRow}>
          <span style={{ color: NEON_GREEN }}>Inflows:</span>
          <span>{formatCurrency(data?.inflows || 0)}</span>
        </div>
        <div style={styles.tooltipRow}>
          <span style={{ color: '#FF6B6B' }}>Outflows:</span>
          <span>{formatCurrency(data?.outflows || 0)}</span>
        </div>
        <div style={{ ...styles.tooltipRow, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8, marginTop: 8 }}>
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>Balance:</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>{formatCurrency(data?.balance || 0)}</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function FinanceDashboard() {
  const currentRunwayMonths = 12.4;

  return (
    <AdminLayout title="Finance" subtitle="Mercury Banking & Financial Overview">
      {isDemoMode && (
        <div style={styles.demoTag}>
          <AlertCircle size={14} />
          <span>Demo Mode - Connect Mercury API for live data</span>
        </div>
      )}

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
          Mercury Accounts Overview
        </h2>
        <div style={styles.accountsGrid}>
          {mercuryAccounts.map((account) => (
            <div key={account.id} style={styles.accountCard}>
              <div style={styles.accountHeader}>
                <div style={styles.accountIcon}>{account.icon}</div>
                <div>
                  <p style={styles.accountName}>{account.name}</p>
                  <p style={styles.accountType}>
                    {account.type === 'checking' ? 'Checking' : account.type === 'savings' ? 'Savings' : 'Money Market'} • {account.accountNumber}
                  </p>
                </div>
              </div>
              <p style={styles.accountBalance}>{formatCurrency(account.balance)}</p>
            </div>
          ))}
          <div style={styles.totalCard}>
            <p style={styles.totalLabel}>Total Available</p>
            <p style={styles.totalValue}>{formatCurrency(totalAvailable)}</p>
            <div style={styles.runwayBadge}>
              <Clock size={12} />
              <span>{currentRunwayMonths} months runway</span>
            </div>
          </div>
        </div>
      </section>

      <div style={styles.twoColumnGrid}>
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
          <div style={styles.transactionsList}>
            {recentTransactions.map((tx) => (
              <div key={tx.id} style={styles.transactionRow}>
                <div style={styles.txLeft}>
                  <div style={{
                    ...styles.txCategoryIcon,
                    background: tx.type === 'credit' 
                      ? 'rgba(0, 255, 133, 0.1)' 
                      : 'rgba(255, 107, 107, 0.1)',
                    color: tx.type === 'credit' ? NEON_GREEN : '#FF6B6B',
                  }}>
                    {getCategoryIcon(tx.category)}
                  </div>
                  <div>
                    <p style={styles.txDescription}>{tx.description}</p>
                    <p style={styles.txMeta}>{tx.date} • {tx.category}</p>
                  </div>
                </div>
                <p style={{
                  ...styles.txAmount,
                  color: tx.type === 'credit' ? NEON_GREEN : '#FF6B6B',
                }}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
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
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="inflowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={NEON_GREEN} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={NEON_GREEN} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="outflowGradient" x1="0" y1="0" x2="0" y2="1">
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
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{value}</span>}
                />
                <Area
                  type="monotone"
                  dataKey="inflows"
                  name="Inflows"
                  stroke={NEON_GREEN}
                  strokeWidth={2}
                  fill="url(#inflowGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="outflows"
                  name="Outflows"
                  stroke="#FF6B6B"
                  strokeWidth={2}
                  fill="url(#outflowGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.chartLegend}>
            <div style={styles.legendItem}>
              <Calendar size={14} color="rgba(255,255,255,0.5)" />
              <span>Key dates: Payroll (15th, 1st), Rent (1st)</span>
            </div>
          </div>
        </section>
      </div>

      <div style={styles.twoColumnGrid}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <TrendingDown size={16} color="#FF6B6B" />
              Accounts Payable
            </h3>
            <div style={styles.headerBadges}>
              <span style={styles.totalBadge}>Total: {formatCurrency(totalPayable)}</span>
              {overduePayable > 0 && (
                <span style={styles.overdueBadge}>
                  <AlertCircle size={12} />
                  Overdue: {formatCurrency(overduePayable)}
                </span>
              )}
            </div>
          </div>
          <div style={styles.payablesList}>
            {accountsPayable.map((item) => (
              <div key={item.id} style={{
                ...styles.payableRow,
                borderLeft: item.isOverdue ? '3px solid #FF6B6B' : '3px solid transparent',
              }}>
                <div style={styles.payableInfo}>
                  <p style={styles.payableVendor}>{item.vendor}</p>
                  <p style={styles.payableDesc}>{item.description}</p>
                </div>
                <div style={styles.payableRight}>
                  <p style={styles.payableAmount}>{formatCurrency(item.amount)}</p>
                  <p style={{
                    ...styles.payableDue,
                    color: item.isOverdue ? '#FF6B6B' : 'rgba(255,255,255,0.5)',
                  }}>
                    {item.isOverdue 
                      ? `${Math.abs(item.daysUntilDue)} days overdue` 
                      : `Due in ${item.daysUntilDue} days`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <TrendingUp size={16} color={NEON_GREEN} />
              Accounts Receivable
            </h3>
            <span style={styles.totalBadge}>Total: {formatCurrency(totalReceivable)}</span>
          </div>
          <div style={styles.receivablesList}>
            {accountsReceivable.map((item) => (
              <div key={item.id} style={styles.receivableRow}>
                <div style={styles.receivableInfo}>
                  <p style={styles.receivablePartner}>{item.partner}</p>
                  <p style={styles.receivableInvoice}>{item.invoiceNumber}</p>
                </div>
                <div style={styles.receivableRight}>
                  <p style={styles.receivableAmount}>{formatCurrency(item.amount)}</p>
                  <p style={{
                    ...styles.receivableDays,
                    color: item.daysOutstanding > 20 ? '#FFA500' : 'rgba(255,255,255,0.5)',
                  }}>
                    {item.daysOutstanding} days outstanding
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
          <div style={styles.plColumn}>
            <h4 style={styles.plColumnTitle}>Revenue</h4>
            <div style={styles.plRow}>
              <span>D2C Sales</span>
              <span style={styles.plValue}>{formatCurrency(plSummary.d2cRevenue)}</span>
            </div>
            <div style={styles.plRow}>
              <span>B2B Sales</span>
              <span style={styles.plValue}>{formatCurrency(plSummary.b2bRevenue)}</span>
            </div>
            <div style={{ ...styles.plRow, ...styles.plTotalRow }}>
              <span style={styles.plTotalLabel}>Total Revenue</span>
              <span style={styles.plTotalValue}>{formatCurrency(plSummary.totalRevenue)}</span>
            </div>
          </div>

          <div style={styles.plColumn}>
            <h4 style={styles.plColumnTitle}>Cost of Goods Sold</h4>
            <div style={styles.plRow}>
              <span>COGS</span>
              <span style={{ ...styles.plValue, color: '#FF6B6B' }}>-{formatCurrency(plSummary.cogs)}</span>
            </div>
            <div style={{ ...styles.plRow, ...styles.plTotalRow }}>
              <span style={styles.plTotalLabel}>Gross Profit</span>
              <span style={styles.plTotalValue}>{formatCurrency(plSummary.grossProfit)}</span>
            </div>
            <div style={styles.plRow}>
              <span>Gross Margin</span>
              <span style={{ ...styles.plValue, color: NEON_GREEN }}>{plSummary.grossMargin}%</span>
            </div>
          </div>

          <div style={styles.plColumn}>
            <h4 style={styles.plColumnTitle}>Operating Expenses</h4>
            <div style={styles.plRow}>
              <span>Payroll</span>
              <span style={styles.plValue}>-{formatCurrency(plSummary.payroll)}</span>
            </div>
            <div style={styles.plRow}>
              <span>Marketing</span>
              <span style={styles.plValue}>-{formatCurrency(plSummary.marketing)}</span>
            </div>
            <div style={styles.plRow}>
              <span>Rent & Utilities</span>
              <span style={styles.plValue}>-{formatCurrency(plSummary.rent + plSummary.utilities)}</span>
            </div>
            <div style={styles.plRow}>
              <span>Shipping</span>
              <span style={styles.plValue}>-{formatCurrency(plSummary.shipping)}</span>
            </div>
            <div style={styles.plRow}>
              <span>Other</span>
              <span style={styles.plValue}>-{formatCurrency(plSummary.software + plSummary.insurance + plSummary.legal)}</span>
            </div>
            <div style={{ ...styles.plRow, ...styles.plTotalRow }}>
              <span style={styles.plTotalLabel}>Total OpEx</span>
              <span style={{ ...styles.plTotalValue, color: '#FF6B6B' }}>-{formatCurrency(plSummary.totalOpex)}</span>
            </div>
          </div>

          <div style={styles.plColumn}>
            <h4 style={styles.plColumnTitle}>Bottom Line</h4>
            <div style={{ ...styles.plRow, ...styles.plNetRow }}>
              <span style={styles.plNetLabel}>Net Income</span>
              <span style={styles.plNetValue}>{formatCurrency(plSummary.netIncome)}</span>
            </div>
            <div style={styles.plRow}>
              <span>Net Margin</span>
              <span style={{ ...styles.plValue, color: NEON_GREEN }}>{plSummary.netMargin}%</span>
            </div>
            <div style={styles.healthIndicator}>
              <CheckCircle2 size={16} color={NEON_GREEN} />
              <span>Healthy profitability</span>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  demoTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '12px',
    padding: '12px 18px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '24px',
    width: 'fit-content',
  },
  quickActionsBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '13px',
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
    marginBottom: '32px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '20px',
  },
  accountsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  accountCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '16px',
    padding: '24px',
  },
  accountHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '20px',
  },
  accountIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(0, 255, 133, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '4px',
  },
  accountType: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  accountBalance: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-1px',
  },
  totalCard: {
    background: `linear-gradient(135deg, rgba(0, 255, 133, 0.1) 0%, rgba(0, 255, 133, 0.02) 100%)`,
    border: `1px solid ${NEON_GREEN}40`,
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  totalValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: NEON_GREEN,
    letterSpacing: '-1px',
    marginBottom: '12px',
  },
  runwayBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    marginBottom: '24px',
  },
  card: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '16px',
    padding: '24px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  viewAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    color: NEON_GREEN,
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  transactionsList: {
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '8px',
  },
  transactionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  txLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  txCategoryIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txDescription: {
    fontSize: '13px',
    color: '#fff',
    marginBottom: '2px',
  },
  txMeta: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
  txAmount: {
    fontSize: '14px',
    fontWeight: 600,
  },
  chartContainer: {
    marginTop: '16px',
  },
  chartLegend: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
  },
  headerBadges: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  totalBadge: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    background: 'rgba(255,255,255,0.05)',
    padding: '4px 12px',
    borderRadius: '6px',
  },
  overdueBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#FF6B6B',
    background: 'rgba(255, 107, 107, 0.1)',
    padding: '4px 12px',
    borderRadius: '6px',
  },
  payablesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  payableRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
  },
  payableInfo: {
    flex: 1,
  },
  payableVendor: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#fff',
    marginBottom: '2px',
  },
  payableDesc: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
  payableRight: {
    textAlign: 'right',
  },
  payableAmount: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#FF6B6B',
    marginBottom: '2px',
  },
  payableDue: {
    fontSize: '11px',
  },
  receivablesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  receivableRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
  },
  receivableInfo: {
    flex: 1,
  },
  receivablePartner: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#fff',
    marginBottom: '2px',
  },
  receivableInvoice: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
  receivableRight: {
    textAlign: 'right',
  },
  receivableAmount: {
    fontSize: '14px',
    fontWeight: 600,
    color: NEON_GREEN,
    marginBottom: '2px',
  },
  receivableDays: {
    fontSize: '11px',
  },
  plGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px',
  },
  plColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  plColumnTitle: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    marginBottom: '4px',
  },
  plRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
  },
  plValue: {
    fontWeight: 500,
    color: '#fff',
  },
  plTotalRow: {
    paddingTop: '12px',
    marginTop: '8px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  plTotalLabel: {
    fontWeight: 600,
    color: '#fff',
  },
  plTotalValue: {
    fontWeight: 700,
    color: '#fff',
    fontSize: '15px',
  },
  plNetRow: {
    background: `linear-gradient(135deg, rgba(0, 255, 133, 0.1) 0%, rgba(0, 255, 133, 0.02) 100%)`,
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '8px',
  },
  plNetLabel: {
    fontWeight: 600,
    color: '#fff',
  },
  plNetValue: {
    fontWeight: 700,
    fontSize: '20px',
    color: NEON_GREEN,
  },
  healthIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: NEON_GREEN,
    marginTop: '16px',
  },
  tooltip: {
    background: 'rgba(0,0,0,0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '16px',
    minWidth: '180px',
  },
  tooltipLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '4px',
  },
  tooltipEvent: {
    fontSize: '11px',
    color: '#FFA500',
    marginBottom: '12px',
    padding: '4px 8px',
    background: 'rgba(255, 165, 0, 0.1)',
    borderRadius: '4px',
    display: 'inline-block',
  },
  tooltipRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '4px',
  },
};
