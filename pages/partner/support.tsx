import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PartnerLayout from '../../components/partner/PartnerLayout';
import {
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
  User,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle,
  Clock,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'What are the payment terms for wholesale orders?',
    answer: 'We offer Net 30 payment terms for approved wholesale partners. Invoices are sent upon order shipment and payment is due within 30 days. We also accept credit card and ACH payments for immediate settlement.',
  },
  {
    id: '2',
    question: 'What is the minimum order quantity?',
    answer: 'The minimum order quantity is 12 units per product. There is no minimum order value, though orders over $500 qualify for free shipping.',
  },
  {
    id: '3',
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 2-3 business days for most locations. We ship Monday through Thursday to ensure products arrive fresh. Expedited shipping options are available upon request.',
  },
  {
    id: '4',
    question: 'Can I return or exchange products?',
    answer: 'We accept returns for damaged or defective products within 7 days of delivery. Please contact your account manager immediately upon receipt of any damaged goods with photos for documentation.',
  },
  {
    id: '5',
    question: 'How do I increase my credit limit?',
    answer: 'Credit limit increases are reviewed quarterly based on your order history and payment record. Contact your account manager to request a review or to discuss your credit needs.',
  },
  {
    id: '6',
    question: 'Do you offer marketing materials or displays?',
    answer: 'Yes! We provide point-of-sale materials, product samplers, and display units for qualified partners. Contact your account manager to discuss marketing support options.',
  },
];

export default function PartnerSupport() {
  const router = useRouter();
  const [partnerName, setPartnerName] = useState('Partner');
  const [accountManager, setAccountManager] = useState({
    name: 'Sarah Johnson',
    email: 'sarah@drizzl.com',
    phone: '(555) 123-4567',
  });
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'general',
    message: '',
  });

  useEffect(() => {
    const session = localStorage.getItem('partnerSession');
    if (!session) {
      router.push('/partner/login');
      return;
    }
    const data = JSON.parse(session);
    setPartnerName(data.businessName);
    if (data.accountManager) {
      setAccountManager({
        name: data.accountManager,
        email: data.accountManagerEmail,
        phone: data.accountManagerPhone,
      });
    }
  }, [router]);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTicketForm({ subject: '', category: 'general', message: '' });
    setTimeout(() => setTicketSubmitted(false), 3000);
  };

  return (
    <PartnerLayout title="Support" partnerName={partnerName}>
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Support Center</h1>
          <p style={styles.subtitle}>Get help with your wholesale account</p>
        </div>

        <div style={styles.grid}>
          <div style={styles.mainColumn}>
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <MessageSquare size={20} />
                Submit a Support Request
              </h2>

              {ticketSubmitted ? (
                <div style={styles.successCard}>
                  <CheckCircle size={48} color={NEON_GREEN} />
                  <h3 style={styles.successTitle}>Request Submitted!</h3>
                  <p style={styles.successText}>
                    We'll respond within 24 hours. Check your email for updates.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} style={styles.ticketForm}>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Subject</label>
                      <input
                        type="text"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                        placeholder="Brief description of your issue"
                        style={styles.input}
                        required
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Category</label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                        style={styles.select}
                      >
                        <option value="general">General Inquiry</option>
                        <option value="orders">Orders & Shipping</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="products">Products & Pricing</option>
                        <option value="technical">Technical Issue</option>
                      </select>
                    </div>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Message</label>
                    <textarea
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                      placeholder="Describe your issue or question in detail..."
                      style={styles.textarea}
                      rows={5}
                      required
                    />
                  </div>
                  <button type="submit" style={styles.submitButton}>
                    <Send size={18} />
                    Submit Request
                  </button>
                </form>
              )}
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <HelpCircle size={20} />
                Frequently Asked Questions
              </h2>
              <div style={styles.faqList}>
                {faqs.map((faq) => (
                  <div key={faq.id} style={styles.faqItem}>
                    <button
                      onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                      style={styles.faqQuestion}
                    >
                      <span>{faq.question}</span>
                      {openFaqId === faq.id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                    {openFaqId === faq.id && (
                      <div style={styles.faqAnswer}>{faq.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.sideColumn}>
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <User size={20} />
                Your Account Manager
              </h2>
              <div style={styles.managerCard}>
                <div style={styles.managerAvatar}>
                  <User size={28} color="#666666" />
                </div>
                <div style={styles.managerName}>{accountManager.name}</div>
                <div style={styles.managerRole}>Dedicated Account Manager</div>
                
                <div style={styles.contactMethods}>
                  <a href={`mailto:${accountManager.email}`} style={styles.contactMethod}>
                    <Mail size={18} />
                    <span>{accountManager.email}</span>
                  </a>
                  <a href={`tel:${accountManager.phone}`} style={styles.contactMethod}>
                    <Phone size={18} />
                    <span>{accountManager.phone}</span>
                  </a>
                </div>

                <div style={styles.availability}>
                  <Clock size={14} />
                  <span>Available Mon-Fri, 9am-5pm EST</span>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Quick Contact</h2>
              <div style={styles.quickContactCard}>
                <div style={styles.quickContactItem}>
                  <div style={styles.quickContactLabel}>General Support</div>
                  <a href="mailto:partners@drizzl.com" style={styles.quickContactValue}>
                    partners@drizzl.com
                  </a>
                </div>
                <div style={styles.quickContactItem}>
                  <div style={styles.quickContactLabel}>Order Issues</div>
                  <a href="tel:1-800-DRIZZL" style={styles.quickContactValue}>
                    1-800-DRIZZL
                  </a>
                </div>
                <div style={styles.quickContactItem}>
                  <div style={styles.quickContactLabel}>Business Hours</div>
                  <div style={styles.quickContactValue}>
                    Mon-Fri 9am-6pm EST
                  </div>
                </div>
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
    marginBottom: 32,
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: 32,
  },
  mainColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
  sideColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  section: {},
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 16px 0',
  },
  ticketForm: {
    padding: 24,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 16,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  input: {
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
  },
  select: {
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
  },
  textarea: {
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '14px 24px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 16,
  },
  successCard: {
    padding: 48,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    textAlign: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '16px 0 8px 0',
  },
  successText: {
    fontSize: 14,
    color: '#666666',
    margin: 0,
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  faqItem: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 10,
    overflow: 'hidden',
  },
  faqQuestion: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '16px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'left',
    cursor: 'pointer',
  },
  faqAnswer: {
    padding: '0 20px 16px 20px',
    fontSize: 14,
    color: '#999999',
    lineHeight: 1.6,
  },
  managerCard: {
    padding: 24,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    textAlign: 'center',
  },
  managerAvatar: {
    width: 64,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 32,
    margin: '0 auto 16px',
  },
  managerName: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  managerRole: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    marginBottom: 20,
  },
  contactMethods: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20,
  },
  contactMethod: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    color: '#CCCCCC',
    fontSize: 14,
    textDecoration: 'none',
  },
  availability: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontSize: 12,
    color: '#666666',
  },
  quickContactCard: {
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  quickContactItem: {
    marginBottom: 16,
  },
  quickContactLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  quickContactValue: {
    fontSize: 14,
    color: NEON_GREEN,
    textDecoration: 'none',
  },
};
