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
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { getPartnerById, getPartnerOrders, getPartnerInvoices } from '../../lib/api/partners';
import type { B2BOrder, Invoice } from '../../types/database';

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
  accountManager: string;
  contactName?: string;
  phone?: string;
}

const mockRecentOrders = [
  { id: 'ORD-2847', date: 'Dec 8, 2025', items: 12, total: 2450.00, status: 'Delivered' },
  { id: 'ORD-2831', date: 'Dec 5, 2025', items: 8, total: 1680.00, status: 'Shipped' },
  { id: 'ORD-2819', date: 'Dec 1, 2025', items: 15, total: 3120.00, status: 'Delivered' },
  { id: 'ORD-2805', date: 'Nov 28, 2025', items: 6, total: 1240.00, status: 'Delivered' },
  { id: 'ORD-2791', date: 'Nov 24, 2025', items: 10, total: 2080.00, status: 'Delivered' },
];

const mockPendingInvoices = [
  { id: 'INV-1847', date: 'Dec 8, 2025', amount: 2450.00, due: 'Dec 22, 2025', status: 'Pending' },
  { id: 'INV-1831', date: 'Dec 5, 2025', amount: 1680.00, due: 'Dec 19, 2025', status: 'Pending' },
];

function getTierDiscount(tier: string): number {
  switch (tier.toLowerCase()) {
    case 'platinum': return 40;
    case 'gold': return 35;
    case 'silver': return 25;
    case 'bronze': return 15;
    default: return 20;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export default function PartnerDashboard() {
  const router = useRouter();
  const [partner, setPartner] = useState<PartnerSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const session = localStorage.getItem('partnerSession');
      if (!session) {
        router.push('/partner/login');
        return;
      }
      
      const sessionData = JSON.parse(session);
      setPartner(sessionData);

      try {
        if (sessionData.id && sessionData.id !== 'demo-partner') {
          const freshPartner = await getPartnerById(sessionData.id);
          if (freshPartner) {
            const updatedSession = {
              ...sessionData,
              creditLimit: freshPartner.credit_limit,
              outstandingBalance: freshPartner.outstanding_balance,
              tier: freshPartner.tier,
            };
            setPartner(updatedSession);
            localStorage.setItem('partnerSession', JSON.stringify(updatedSession));
          }

          const [ordersData, invoicesData] = await Promise.all([
            getPartnerOrders(sessionData.id),
            getPartnerInvoices(sessionData.id),
          ]);
          setOrders(ordersData);
          setInvoices(invoicesData);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
      
      setLoading(false);
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
      <PartnerLayout title="Dashboard" partnerName="Loading...">
        <div style={styles.loadingPage}>
          <Loader2 size={32} color={NEON_GREEN} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={styles.loadingText}>Loading dashboard...</p>
        </div>
      </PartnerLayout>
    );
  }

  if (!partner) {
    return null;
  }

  const discount = getTierDiscount(partner.tier);
  const displayOrders = orders.length > 0 ? orders.slice(0, 5) : null;
  const displayInvoices = invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue');
  const pendingInvoicesData = displayInvoices.length > 0 ? displayInvoices.slice(0, 3) : null;

  const totalOutstanding = pendingInvoicesData 
    ? pendingInvoicesData.reduce((sum, inv) => sum + inv.total, 0) / 100
    : partner.outstandingBalance / 100 || mockPendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  
  const creditLimit = partner.creditLimit / 100 || 50000;
  const availableCredit = creditLimit - totalOutstanding;

  const monthlyOrders = orders.filter(o => {
    const orderDate = new Date(o.created_at);
    const now = new Date();
    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
  });
  const monthlyTotal = monthlyOrders.reduce((sum, o) => sum + o.total, 0) / 100;

  return (
    <PartnerLayout title="Dashboard" partnerName={partner.businessName}>
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Welcome back, {partner.businessName}</h1>
            <p style={styles.subtitle}>{partner.tier.charAt(0).toUpperCase() + partner.tier.slice(1)} Partner • {discount}% wholesale discount</p>
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
              <span style={styles.statValue}>{partner.tier.charAt(0).toUpperCase() + partner.tier.slice(1)}</span>
              <span style={styles.statMeta}>{discount}% discount</span>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <CreditCard size={20} color="#8B5CF6" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Credit Limit</span>
              <span style={styles.statValue}>${creditLimit.toLocaleString()}</span>
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
              <span style={styles.statMeta}>{pendingInvoicesData?.length || mockPendingInvoices.length} pending invoices</span>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <Package size={20} color="#06B6D4" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Orders This Month</span>
              <span style={styles.statValue}>{monthlyOrders.length || 5}</span>
              <span style={styles.statMeta}>${(monthlyTotal || 10570).toLocaleString()} total</span>
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
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(displayOrders || mockRecentOrders).map((order: any) => (
                    <tr key={order.id || order.order_number}>
                      <td style={styles.td}>
                        <span style={styles.orderId}>{order.order_number || order.id}</span>
                      </td>
                      <td style={styles.td}>{order.created_at ? formatDate(order.created_at) : order.date}</td>
                      <td style={styles.td}>${((order.total || 0) / 100 || order.total || 0).toLocaleString()}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: (order.status === 'delivered' || order.status === 'Delivered')
                            ? 'rgba(0, 255, 133, 0.1)' 
                            : 'rgba(59, 130, 246, 0.1)',
                          color: (order.status === 'delivered' || order.status === 'Delivered') ? NEON_GREEN : '#3B82F6',
                        }}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
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
                {(pendingInvoicesData || mockPendingInvoices).map((invoice: any) => (
                  <div key={invoice.id || invoice.invoice_number} style={styles.invoiceCard}>
                    <div style={styles.invoiceMain}>
                      <div style={styles.invoiceId}>{invoice.invoice_number || invoice.id}</div>
                      <div style={styles.invoiceAmount}>${((invoice.total || 0) / 100 || invoice.amount).toLocaleString()}</div>
                    </div>
                    <div style={styles.invoiceMeta}>
                      <span>Due: {invoice.due_date ? formatDate(invoice.due_date) : invoice.due}</span>
                      <span style={styles.pendingBadge}>
                        {invoice.status === 'overdue' ? 'Overdue' : 'Pending'}
                      </span>
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
                  <div style={styles.managerName}>{partner.accountManager || 'Sarah Johnson'}</div>
                  <div style={styles.managerRole}>Account Manager</div>
                </div>
                <div style={styles.managerContact}>
                  <a href="mailto:partners@drizzl.com" style={styles.contactLink}>
                    <Mail size={16} />
                    <span>partners@drizzl.com</span>
                  </a>
                  <a href="tel:+15551234567" style={styles.contactLink}>
                    <Phone size={16} />
                    <span>(555) 123-4567</span>
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
  loadingPage: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
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
