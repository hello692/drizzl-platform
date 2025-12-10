import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PartnerLayout from '../../components/partner/PartnerLayout';
import {
  FileText,
  Download,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Eye,
  Loader2,
} from 'lucide-react';
import { getPartnerInvoices } from '../../lib/api/partners';
import type { Invoice as DBInvoice } from '../../types/database';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface DisplayInvoice {
  id: string;
  invoice_number: string;
  order_id: string | null;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

const mockInvoices: DisplayInvoice[] = [
  { id: 'inv-1', invoice_number: 'INV-1847', order_id: 'ORD-2847', date: 'Dec 8, 2025', dueDate: 'Dec 22, 2025', amount: 245000, status: 'pending' },
  { id: 'inv-2', invoice_number: 'INV-1831', order_id: 'ORD-2831', date: 'Dec 5, 2025', dueDate: 'Dec 19, 2025', amount: 168000, status: 'pending' },
  { id: 'inv-3', invoice_number: 'INV-1819', order_id: 'ORD-2819', date: 'Dec 1, 2025', dueDate: 'Dec 15, 2025', amount: 312000, status: 'overdue' },
  { id: 'inv-4', invoice_number: 'INV-1805', order_id: 'ORD-2805', date: 'Nov 28, 2025', dueDate: 'Dec 12, 2025', amount: 124000, status: 'paid' },
  { id: 'inv-5', invoice_number: 'INV-1791', order_id: 'ORD-2791', date: 'Nov 24, 2025', dueDate: 'Dec 8, 2025', amount: 208000, status: 'paid' },
  { id: 'inv-6', invoice_number: 'INV-1778', order_id: 'ORD-2778', date: 'Nov 20, 2025', dueDate: 'Dec 4, 2025', amount: 306000, status: 'paid' },
];

const statusConfig = {
  paid: { icon: CheckCircle, color: NEON_GREEN, bg: 'rgba(0, 255, 133, 0.1)' },
  pending: { icon: Clock, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  overdue: { icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch {
    return dateStr;
  }
}

export default function PartnerInvoices() {
  const router = useRouter();
  const [partnerName, setPartnerName] = useState('Partner');
  const [partnerId, setPartnerId] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState<DisplayInvoice | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [invoiceList, setInvoiceList] = useState<DisplayInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const session = localStorage.getItem('partnerSession');
      if (!session) {
        router.push('/partner/login');
        return;
      }
      const data = JSON.parse(session);
      setPartnerName(data.businessName);
      setPartnerId(data.id);

      try {
        if (data.id && data.id !== 'demo-partner') {
          const invoicesData = await getPartnerInvoices(data.id);
          if (invoicesData.length > 0) {
            setInvoiceList(invoicesData.map(inv => ({
              id: inv.id,
              invoice_number: inv.invoice_number,
              order_id: inv.order_id,
              date: inv.created_at,
              dueDate: inv.due_date,
              amount: inv.total,
              status: inv.status as 'paid' | 'pending' | 'overdue',
            })));
          } else {
            setInvoiceList(mockInvoices);
          }
        } else {
          setInvoiceList(mockInvoices);
        }
      } catch (error) {
        console.error('Error loading invoices:', error);
        setInvoiceList(mockInvoices);
      }

      setLoading(false);
    };

    loadData();
  }, [router]);

  const filteredInvoices = invoiceList.filter(inv => {
    return statusFilter === 'All' || inv.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const totalOutstanding = invoiceList
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const handlePayInvoice = (invoice: DisplayInvoice) => {
    setInvoiceList(prev =>
      prev.map(inv =>
        inv.id === invoice.id ? { ...inv, status: 'paid' as const } : inv
      )
    );
    setShowPayModal(false);
    setSelectedInvoice(null);
  };

  if (loading) {
    return (
      <PartnerLayout title="Invoices" partnerName={partnerName}>
        <div style={styles.loadingPage}>
          <Loader2 size={32} color={NEON_GREEN} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={styles.loadingText}>Loading invoices...</p>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout title="Invoices" partnerName={partnerName}>
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Invoices</h1>
            <p style={styles.subtitle}>View and pay your invoices</p>
          </div>
          <div style={styles.outstandingCard}>
            <span style={styles.outstandingLabel}>Outstanding Balance</span>
            <span style={styles.outstandingValue}>${(totalOutstanding / 100).toLocaleString()}</span>
          </div>
        </div>

        <div style={styles.statusTabs}>
          {['All', 'pending', 'overdue', 'paid'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                ...styles.statusTab,
                ...(statusFilter === status ? styles.statusTabActive : {}),
              }}
            >
              {status === 'All' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              <span style={styles.tabCount}>
                {status === 'All'
                  ? invoiceList.length
                  : invoiceList.filter(inv => inv.status === status).length}
              </span>
            </button>
          ))}
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Invoice</th>
                <th style={styles.th}>Order</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Due Date</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const StatusIcon = statusConfig[invoice.status].icon;
                return (
                  <tr key={invoice.id}>
                    <td style={styles.td}>
                      <span style={styles.invoiceId}>{invoice.invoice_number}</span>
                    </td>
                    <td style={styles.td}>{invoice.order_id || '-'}</td>
                    <td style={styles.td}>{formatDate(invoice.date)}</td>
                    <td style={styles.td}>{formatDate(invoice.dueDate)}</td>
                    <td style={styles.td}>
                      <span style={styles.amount}>${(invoice.amount / 100).toLocaleString()}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: statusConfig[invoice.status].bg,
                        color: statusConfig[invoice.status].color,
                      }}>
                        <StatusIcon size={14} />
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          style={styles.actionButton}
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button style={styles.actionButton} title="Download">
                          <Download size={16} />
                        </button>
                        {invoice.status !== 'paid' && (
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowPayModal(true);
                            }}
                            style={styles.payButton}
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selectedInvoice && !showPayModal && (
          <div style={styles.modalOverlay} onClick={() => setSelectedInvoice(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Invoice {selectedInvoice.invoice_number}</h2>
                <button onClick={() => setSelectedInvoice(null)} style={styles.closeButton}>
                  <X size={20} />
                </button>
              </div>
              <div style={styles.modalContent}>
                <div style={styles.invoiceDetails}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Order</span>
                    <span style={styles.detailValue}>{selectedInvoice.order_id || '-'}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Invoice Date</span>
                    <span style={styles.detailValue}>{formatDate(selectedInvoice.date)}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Due Date</span>
                    <span style={styles.detailValue}>{formatDate(selectedInvoice.dueDate)}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Status</span>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: statusConfig[selectedInvoice.status].bg,
                      color: statusConfig[selectedInvoice.status].color,
                    }}>
                      {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div style={styles.totalSection}>
                  <span>Total Amount</span>
                  <span style={styles.totalAmount}>${(selectedInvoice.amount / 100).toLocaleString()}</span>
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button style={styles.downloadButton}>
                  <Download size={16} />
                  Download PDF
                </button>
                {selectedInvoice.status !== 'paid' && (
                  <button
                    onClick={() => setShowPayModal(true)}
                    style={styles.payNowButton}
                  >
                    <CreditCard size={16} />
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {showPayModal && selectedInvoice && (
          <div style={styles.modalOverlay} onClick={() => setShowPayModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Pay Invoice</h2>
                <button onClick={() => setShowPayModal(false)} style={styles.closeButton}>
                  <X size={20} />
                </button>
              </div>
              <div style={styles.modalContent}>
                <div style={styles.paymentSummary}>
                  <p style={styles.paymentLabel}>Invoice: {selectedInvoice.invoice_number}</p>
                  <p style={styles.paymentAmount}>${(selectedInvoice.amount / 100).toLocaleString()}</p>
                </div>

                <div style={styles.paymentMethod}>
                  <h3 style={styles.methodTitle}>Payment Method</h3>
                  <div style={styles.methodOption}>
                    <input type="radio" name="method" defaultChecked />
                    <span>Net 30 Credit Account</span>
                  </div>
                  <div style={styles.methodOption}>
                    <input type="radio" name="method" />
                    <span>Credit Card ending in 4242</span>
                  </div>
                  <div style={styles.methodOption}>
                    <input type="radio" name="method" />
                    <span>ACH Bank Transfer</span>
                  </div>
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button onClick={() => setShowPayModal(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button
                  onClick={() => handlePayInvoice(selectedInvoice)}
                  style={styles.confirmPayButton}
                >
                  <CheckCircle size={16} />
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}
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
    marginBottom: 24,
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
  outstandingCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: '16px 24px',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    borderRadius: 10,
  },
  outstandingLabel: {
    fontSize: 12,
    color: '#F59E0B',
    textTransform: 'uppercase',
  },
  outstandingValue: {
    fontSize: 24,
    fontWeight: 600,
    color: '#F59E0B',
  },
  statusTabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  statusTab: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#999999',
    fontSize: 14,
    cursor: 'pointer',
  },
  statusTabActive: {
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderColor: 'rgba(0, 255, 133, 0.3)',
    color: NEON_GREEN,
  },
  tabCount: {
    padding: '2px 8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    fontSize: 12,
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
  invoiceId: {
    fontFamily: 'monospace',
    color: NEON_GREEN,
    fontWeight: 500,
  },
  amount: {
    fontWeight: 600,
    color: '#FFFFFF',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 500,
  },
  actions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 6,
    color: '#999999',
    cursor: 'pointer',
  },
  payButton: {
    padding: '6px 14px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    border: `1px solid rgba(0, 255, 133, 0.2)`,
    borderRadius: 6,
    color: NEON_GREEN,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#111111',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  closeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666666',
    cursor: 'pointer',
  },
  modalContent: {
    padding: 24,
  },
  invoiceDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  totalSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTop: `1px solid ${CARD_BORDER}`,
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  totalAmount: {
    color: NEON_GREEN,
  },
  modalFooter: {
    display: 'flex',
    gap: 12,
    padding: '16px 24px',
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  downloadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#999999',
    fontSize: 14,
    cursor: 'pointer',
  },
  payNowButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 16px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  paymentSummary: {
    textAlign: 'center',
    padding: '24px',
    backgroundColor: 'rgba(0, 255, 133, 0.05)',
    borderRadius: 12,
    marginBottom: 24,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#999999',
    margin: 0,
  },
  paymentAmount: {
    fontSize: 32,
    fontWeight: 600,
    color: NEON_GREEN,
    margin: '8px 0 0 0',
  },
  paymentMethod: {
    marginBottom: 16,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 12px 0',
  },
  methodOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    marginBottom: 8,
    color: '#CCCCCC',
    fontSize: 14,
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#999999',
    fontSize: 14,
    cursor: 'pointer',
  },
  confirmPayButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 16px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
