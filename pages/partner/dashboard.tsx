import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PartnerLayout from '../../components/partner/PartnerLayout';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock,
  ArrowRight,
  Package,
  FileText,
  Phone,
  Mail,
  User,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface PartnerSession {
  id: string;
  email: string;
  businessName: string;
  tier: string;
  discount: number;
  creditLimit: number;
  accountManager: string;
  accountManagerEmail: string;
  accountManagerPhone: string;
}

const recentOrders = [
  { id: 'ORD-2847', date: 'Dec 8, 2025', items: 12, total: 2450.00, status: 'Delivered' },
  { id: 'ORD-2831', date: 'Dec 5, 2025', items: 8, total: 1680.00, status: 'Shipped' },
  { id: 'ORD-2819', date: 'Dec 1, 2025', items: 15, total: 3120.00, status: 'Delivered' },
  { id: 'ORD-2805', date: 'Nov 28, 2025', items: 6, total: 1240.00, status: 'Delivered' },
  { id: 'ORD-2791', date: 'Nov 24, 2025', items: 10, total: 2080.00, status: 'Delivered' },
];

const pendingInvoices = [
  { id: 'INV-1847', date: 'Dec 8, 2025', amount: 2450.00, due: 'Dec 22, 2025', status: 'Pending' },
  { id: 'INV-1831', date: 'Dec 5, 2025', amount: 1680.00, due: 'Dec 19, 2025', status: 'Pending' },
];

export default function PartnerDashboard() {
  const router = useRouter();
  const [partner, setPartner] = useState<PartnerSession | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('partnerSession');
    if (!session) {
      router.push('/partner/login');
      return;
    }
    setPartner(JSON.parse(session));
  }, [router]);

  if (!partner) {
    return null;
  }

  const totalOutstanding = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const availableCredit = partner.creditLimit - totalOutstanding;

  return (
    <PartnerLayout title="Dashboard" partnerName={partner.businessName}>
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Welcome back, {partner.businessName}</h1>
            <p style={styles.subtitle}>{partner.tier} Partner • {partner.discount}% wholesale discount</p>
          </div>
          <Link href="/partner/orders/new" style={styles.primaryButton}>
            <ShoppingCart size={18} />
            Place New Order
          </Link>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <TrendingUp size={20} color={NEON_GREEN} />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Account Status</span>
              <span style={styles.statValue}>{partner.tier}</span>
              <span style={styles.statMeta}>{partner.discount}% discount</span>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <CreditCard size={20} color="#8B5CF6" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Credit Limit</span>
              <span style={styles.statValue}>${partner.creditLimit.toLocaleString()}</span>
              <span style={styles.statMeta}>${availableCredit.toLocaleString()} available</span>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <DollarSign size={20} color="#F59E0B" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Outstanding Balance</span>
              <span style={styles.statValue}>${totalOutstanding.toLocaleString()}</span>
              <span style={styles.statMeta}>{pendingInvoices.length} pending invoices</span>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <Package size={20} color="#06B6D4" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Orders This Month</span>
              <span style={styles.statValue}>5</span>
              <span style={styles.statMeta}>$10,570 total</span>
            </div>
          </div>
        </div>

        <div style={styles.contentGrid}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Recent Orders</h2>
              <Link href="/partner/orders" style={styles.viewAllLink}>
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Order ID</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Items</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={styles.td}>
                        <span style={styles.orderId}>{order.id}</span>
                      </td>
                      <td style={styles.td}>{order.date}</td>
                      <td style={styles.td}>{order.items} items</td>
                      <td style={styles.td}>${order.total.toLocaleString()}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: order.status === 'Delivered' 
                            ? 'rgba(0, 255, 133, 0.1)' 
                            : 'rgba(59, 130, 246, 0.1)',
                          color: order.status === 'Delivered' ? NEON_GREEN : '#3B82F6',
                        }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Pending Invoices</h2>
                <Link href="/partner/invoices" style={styles.viewAllLink}>
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div style={styles.invoiceList}>
                {pendingInvoices.map((invoice) => (
                  <div key={invoice.id} style={styles.invoiceCard}>
                    <div style={styles.invoiceMain}>
                      <div style={styles.invoiceId}>{invoice.id}</div>
                      <div style={styles.invoiceAmount}>${invoice.amount.toLocaleString()}</div>
                    </div>
                    <div style={styles.invoiceMeta}>
                      <span>Due: {invoice.due}</span>
                      <span style={styles.pendingBadge}>Pending</span>
                    </div>
                    <Link href="/partner/invoices" style={styles.payButton}>
                      Pay Now
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Your Account Manager</h2>
              <div style={styles.managerCard}>
                <div style={styles.managerAvatar}>
                  <User size={24} color="#666666" />
                </div>
                <div style={styles.managerInfo}>
                  <div style={styles.managerName}>{partner.accountManager}</div>
                  <div style={styles.managerRole}>Account Manager</div>
                </div>
                <div style={styles.managerContact}>
                  <a href={`mailto:${partner.accountManagerEmail}`} style={styles.contactLink}>
                    <Mail size={16} />
                    <span>{partner.accountManagerEmail}</span>
                  </a>
                  <a href={`tel:${partner.accountManagerPhone}`} style={styles.contactLink}>
                    <Phone size={16} />
                    <span>{partner.accountManagerPhone}</span>
                  </a>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Quick Actions</h2>
              <div style={styles.quickActions}>
                <Link href="/partner/orders/new" style={styles.quickAction}>
                  <ShoppingCart size={18} />
                  <span>New Order</span>
                </Link>
                <Link href="/partner/pricing" style={styles.quickAction}>
                  <DollarSign size={18} />
                  <span>View Pricing</span>
                </Link>
                <Link href="/partner/invoices" style={styles.quickAction}>
                  <FileText size={18} />
                  <span>Pay Invoice</span>
                </Link>
                <Link href="/partner/support" style={styles.quickAction}>
                  <Phone size={18} />
                  <span>Contact Support</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 32,
    maxWidth: 1400,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
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
    marginTop: 4,
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'opacity 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20,
    marginBottom: 32,
  },
  statCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  statIcon: {
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    flexShrink: 0,
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  statMeta: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: 24,
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  section: {
    marginBottom: 0,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  viewAllLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    color: NEON_GREEN,
    textDecoration: 'none',
  },
  tableCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 500,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  td: {
    padding: '14px 16px',
    fontSize: 14,
    color: '#CCCCCC',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  orderId: {
    fontFamily: 'monospace',
    color: NEON_GREEN,
  },
  badge: {
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 500,
  },
  invoiceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  invoiceCard: {
    padding: 16,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 10,
  },
  invoiceMain: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invoiceId: {
    fontFamily: 'monospace',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 500,
  },
  invoiceAmount: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  invoiceMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
  pendingBadge: {
    padding: '2px 8px',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: '#F59E0B',
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 500,
  },
  payButton: {
    display: 'block',
    width: '100%',
    padding: '10px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    color: NEON_GREEN,
    border: `1px solid rgba(0, 255, 133, 0.2)`,
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    textAlign: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  managerCard: {
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  managerAvatar: {
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    marginBottom: 12,
  },
  managerInfo: {
    marginBottom: 16,
  },
  managerName: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  managerRole: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  managerContact: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  contactLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 13,
    color: '#999999',
    textDecoration: 'none',
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  quickAction: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 16px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#CCCCCC',
    fontSize: 13,
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  },
};
