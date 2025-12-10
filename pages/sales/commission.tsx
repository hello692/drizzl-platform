import React from 'react';
import SalesLayout from '../../components/sales/SalesLayout';
import {
  DollarSign,
  Calendar,
  TrendingUp,
  ChevronRight,
  Building2,
  ShoppingCart,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';
const AMBER = '#F59E0B';

const repName = 'Sarah Johnson';

const earningsOverview = {
  thisMonth: {
    amount: 3845.00,
    sales: 38450,
    status: 'Pending',
    payoutDate: 'Jan 5, 2025',
  },
  yearToDate: {
    amount: 48250.00,
    months: 11,
  },
  commissionRate: {
    total: 10,
    base: 5,
    bonus: 5,
  },
};

const newPartners = [
  { id: 1, name: 'Whole Foods', amount: 850.00, type: 'New Partner Bonus' },
  { id: 2, name: "Trader Joe's", amount: 620.00, type: 'New Partner Bonus' },
  { id: 3, name: 'Sprouts', amount: 420.00, type: 'New Partner Bonus' },
];

const partnerOrders = [
  { id: 1, name: 'Walmart', amount: 385.00, type: 'Recurring Order' },
  { id: 2, name: 'Target', amount: 290.00, type: 'Recurring Order' },
  { id: 3, name: 'Kroger', amount: 450.00, type: 'Recurring Order' },
];

const moreOrdersAmount = 830.00;
const moreOrdersCount = 5;

const payoutHistory = [
  { month: 'Dec 2024', amount: 3845.00, status: 'pending' },
  { month: 'Nov 2024', amount: 4120.00, status: 'paid' },
  { month: 'Oct 2024', amount: 3850.00, status: 'paid' },
  { month: 'Sep 2024', amount: 4990.00, status: 'paid' },
  { month: 'Aug 2024', amount: 3200.00, status: 'paid' },
];

const monthlyEarnings = [
  { month: 'Jan', amount: 3200 },
  { month: 'Feb', amount: 3850 },
  { month: 'Mar', amount: 4200 },
  { month: 'Apr', amount: 4500 },
  { month: 'May', amount: 4800 },
  { month: 'Jun', amount: 4200 },
  { month: 'Jul', amount: 4600 },
  { month: 'Aug', amount: 3200 },
  { month: 'Sep', amount: 4990 },
  { month: 'Oct', amount: 3850 },
  { month: 'Nov', amount: 4120 },
  { month: 'Dec', amount: 3845 },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

const newPartnersSubtotal = newPartners.reduce((sum, p) => sum + p.amount, 0);
const partnerOrdersSubtotal = partnerOrders.reduce((sum, p) => sum + p.amount, 0) + moreOrdersAmount;
const totalCommission = newPartnersSubtotal + partnerOrdersSubtotal;

export default function CommissionPage() {
  return (
    <SalesLayout title="Commission" repName={repName}>
      <div style={styles.page}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Earnings Overview</h2>
          <div style={styles.overviewGrid}>
            <div style={styles.overviewCard}>
              <div style={styles.overviewIcon}>
                <DollarSign size={24} color={NEON_GREEN} />
              </div>
              <div style={styles.overviewContent}>
                <span style={styles.overviewLabel}>This Month</span>
                <span style={styles.overviewAmount}>{formatCurrency(earningsOverview.thisMonth.amount)}</span>
                <span style={styles.overviewSubtext}>on {formatCurrency(earningsOverview.thisMonth.sales)} sales</span>
              </div>
              <div style={styles.overviewMeta}>
                <span style={styles.pendingBadge}>
                  <Clock size={12} />
                  {earningsOverview.thisMonth.status}
                </span>
                <span style={styles.payoutDate}>Payout: {earningsOverview.thisMonth.payoutDate}</span>
              </div>
            </div>

            <div style={styles.overviewCard}>
              <div style={styles.overviewIcon}>
                <TrendingUp size={24} color="#60A5FA" />
              </div>
              <div style={styles.overviewContent}>
                <span style={styles.overviewLabel}>Year to Date</span>
                <span style={styles.overviewAmount}>{formatCurrency(earningsOverview.yearToDate.amount)}</span>
                <span style={styles.overviewSubtext}>{earningsOverview.yearToDate.months} months</span>
              </div>
            </div>

            <div style={styles.overviewCard}>
              <div style={styles.overviewIcon}>
                <Calendar size={24} color="#A78BFA" />
              </div>
              <div style={styles.overviewContent}>
                <span style={styles.overviewLabel}>Commission Rate</span>
                <span style={styles.overviewAmount}>{earningsOverview.commissionRate.total}%</span>
                <span style={styles.overviewSubtext}>
                  {earningsOverview.commissionRate.base}% base + {earningsOverview.commissionRate.bonus}% bonus for quota
                </span>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>This Month's Commission</h2>
          <div style={styles.breakdownCard}>
            <div style={styles.breakdownSection}>
              <div style={styles.breakdownHeader}>
                <Building2 size={18} color={NEON_GREEN} />
                <span style={styles.breakdownTitle}>New Partners</span>
              </div>
              <div style={styles.breakdownList}>
                {newPartners.map((partner) => (
                  <div key={partner.id} style={styles.breakdownItem}>
                    <div style={styles.breakdownItemLeft}>
                      <span style={styles.breakdownItemName}>{partner.name}</span>
                      <span style={styles.breakdownItemType}>{partner.type}</span>
                    </div>
                    <span style={styles.breakdownItemAmount}>{formatCurrency(partner.amount)}</span>
                  </div>
                ))}
              </div>
              <div style={styles.subtotalRow}>
                <span style={styles.subtotalLabel}>Subtotal</span>
                <span style={styles.subtotalAmount}>{formatCurrency(newPartnersSubtotal)}</span>
              </div>
            </div>

            <div style={styles.breakdownDivider} />

            <div style={styles.breakdownSection}>
              <div style={styles.breakdownHeader}>
                <ShoppingCart size={18} color="#60A5FA" />
                <span style={styles.breakdownTitle}>Partner Orders</span>
              </div>
              <div style={styles.breakdownList}>
                {partnerOrders.map((order) => (
                  <div key={order.id} style={styles.breakdownItem}>
                    <div style={styles.breakdownItemLeft}>
                      <span style={styles.breakdownItemName}>{order.name}</span>
                      <span style={styles.breakdownItemType}>{order.type}</span>
                    </div>
                    <span style={styles.breakdownItemAmount}>{formatCurrency(order.amount)}</span>
                  </div>
                ))}
                <div style={styles.breakdownItem}>
                  <div style={styles.breakdownItemLeft}>
                    <span style={styles.breakdownItemMore}>{moreOrdersCount} more...</span>
                  </div>
                  <span style={styles.breakdownItemAmount}>{formatCurrency(moreOrdersAmount)}</span>
                </div>
              </div>
              <div style={styles.subtotalRow}>
                <span style={styles.subtotalLabel}>Subtotal</span>
                <span style={styles.subtotalAmount}>{formatCurrency(partnerOrdersSubtotal)}</span>
              </div>
            </div>

            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalAmount}>{formatCurrency(totalCommission)}</span>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Payout History</h2>
          <div style={styles.historyCard}>
            <div style={styles.historyTable}>
              <div style={styles.historyHeader}>
                <span style={styles.historyHeaderCell}>Month</span>
                <span style={styles.historyHeaderCell}>Amount</span>
                <span style={styles.historyHeaderCell}>Status</span>
              </div>
              {payoutHistory.map((payout, index) => (
                <div key={index} style={styles.historyRow}>
                  <span style={styles.historyCell}>{payout.month}</span>
                  <span style={styles.historyAmountCell}>{formatCurrency(payout.amount)}</span>
                  <span style={styles.historyCell}>
                    {payout.status === 'paid' ? (
                      <span style={styles.paidBadge}>
                        <CheckCircle size={14} />
                        Paid
                      </span>
                    ) : (
                      <span style={styles.pendingStatusBadge}>
                        <Clock size={14} />
                        Pending
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div style={styles.viewAllContainer}>
              <button style={styles.viewAllButton}>
                View All
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Annual Earnings</h2>
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <span style={styles.chartYTD}>
                YTD Total: <strong style={{ color: NEON_GREEN }}>{formatCurrency(earningsOverview.yearToDate.amount)}</strong>
              </span>
            </div>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyEarnings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: `1px solid ${CARD_BORDER}`,
                      borderRadius: 8,
                      color: '#FFFFFF',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Earnings']}
                    labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill={NEON_GREEN} 
                    radius={[4, 4, 0, 0]}
                    opacity={0.9}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </SalesLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 800,
    margin: '0 auto',
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 12,
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
  },
  overviewCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  overviewIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  overviewAmount: {
    fontSize: 28,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  overviewSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  overviewMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginTop: 4,
  },
  pendingBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${AMBER}20`,
    color: AMBER,
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 6,
    width: 'fit-content',
  },
  payoutDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  breakdownCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  breakdownSection: {
    padding: 20,
  },
  breakdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  breakdownList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  breakdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownItemLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  breakdownItemName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 500,
  },
  breakdownItemType: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  breakdownItemMore: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontStyle: 'italic',
  },
  breakdownItemAmount: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 500,
  },
  subtotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  subtotalLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 500,
  },
  subtotalAmount: {
    fontSize: 14,
    color: NEON_GREEN,
    fontWeight: 600,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: CARD_BORDER,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 255, 133, 0.05)',
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  totalLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 600,
  },
  totalAmount: {
    fontSize: 24,
    color: NEON_GREEN,
    fontWeight: 700,
  },
  historyCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  historyTable: {
    width: '100%',
  },
  historyHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    padding: '14px 20px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  historyHeaderCell: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: 600,
  },
  historyRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    padding: '14px 20px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  historyCell: {
    fontSize: 14,
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
  },
  historyAmountCell: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 500,
  },
  paidBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${NEON_GREEN}20`,
    color: NEON_GREEN,
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 6,
  },
  pendingStatusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${AMBER}20`,
    color: AMBER,
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 6,
  },
  viewAllContainer: {
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'center',
  },
  viewAllButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    padding: '10px 20px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  chartCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 20,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartYTD: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  chartContainer: {
    width: '100%',
    height: 200,
  },
};
