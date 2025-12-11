import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PartnerLayout from '../../components/partner/PartnerLayout';
import {
  Plug,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Key,
  Webhook,
  FileText,
  RefreshCw,
  Settings,
  Loader2,
  CreditCard,
  Calculator,
  Package,
  Mail,
  Square,
  ShoppingBag,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface PartnerSession {
  id: string;
  email: string;
  businessName: string;
  tier: string;
}

type CategoryKey = 'pos' | 'accounting' | 'inventory' | 'marketing' | 'api';

interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  lastSync?: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
}

interface SyncEvent {
  id: string;
  timestamp: string;
  integration: string;
  type: string;
  status: 'success' | 'error' | 'pending';
  details: string;
}

const categories: { key: CategoryKey; label: string; icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { key: 'pos', label: 'POS Systems', icon: CreditCard },
  { key: 'accounting', label: 'Accounting Software', icon: Calculator },
  { key: 'inventory', label: 'Inventory Management', icon: Package },
  { key: 'marketing', label: 'Marketing & CRM', icon: Mail },
  { key: 'api', label: 'Custom API', icon: Plug },
];

const integrations: Record<CategoryKey, Integration[]> = {
  pos: [
    { id: 'square', name: 'Square', description: 'Sync sales, inventory, and customer data', connected: false, icon: Square, color: '#006AFF' },
    { id: 'clover', name: 'Clover', description: 'Real-time sales and inventory sync', connected: true, lastSync: '2 min ago', icon: ShoppingBag, color: '#4CAF50' },
    { id: 'toast', name: 'Toast POS', description: 'Restaurant POS integration', connected: false, icon: CreditCard, color: '#FF6B35' },
    { id: 'shopify-pos', name: 'Shopify POS', description: 'Unified commerce sync', connected: false, icon: ShoppingBag, color: '#96BF48' },
    { id: 'lightspeed', name: 'Lightspeed', description: 'Retail and restaurant POS', connected: false, icon: CreditCard, color: '#FF5722' },
  ],
  accounting: [
    { id: 'quickbooks', name: 'QuickBooks Online', description: 'Automatic invoice and expense sync', connected: true, lastSync: '1 hour ago', icon: Calculator, color: '#2CA01C' },
    { id: 'xero', name: 'Xero', description: 'Cloud accounting integration', connected: false, icon: Calculator, color: '#13B5EA' },
    { id: 'freshbooks', name: 'FreshBooks', description: 'Invoice and payment tracking', connected: false, icon: Calculator, color: '#0095EB' },
  ],
  inventory: [
    { id: 'cin7', name: 'Cin7', description: 'Multi-channel inventory management', connected: false, icon: Package, color: '#FF6B00' },
    { id: 'tradegecko', name: 'TradeGecko', description: 'Wholesale inventory sync', connected: false, icon: Package, color: '#1ABC9C' },
  ],
  marketing: [
    { id: 'mailchimp', name: 'Mailchimp', description: 'Customer list and campaign sync', connected: true, lastSync: '30 min ago', icon: Mail, color: '#FFE01B' },
    { id: 'hubspot', name: 'HubSpot CRM', description: 'CRM and marketing automation', connected: false, icon: Mail, color: '#FF7A59' },
  ],
  api: [],
};

const mockSyncEvents: SyncEvent[] = [
  { id: 'sync-1', timestamp: '2025-12-10T14:32:00Z', integration: 'Clover', type: 'Sales Data', status: 'success', details: '24 transactions synced' },
  { id: 'sync-2', timestamp: '2025-12-10T14:30:00Z', integration: 'QuickBooks Online', type: 'Invoice', status: 'success', details: 'Invoice INV-1847 created' },
  { id: 'sync-3', timestamp: '2025-12-10T14:15:00Z', integration: 'Mailchimp', type: 'Contact List', status: 'success', details: '3 new contacts added' },
  { id: 'sync-4', timestamp: '2025-12-10T13:45:00Z', integration: 'Clover', type: 'Inventory', status: 'success', details: 'Stock levels updated' },
  { id: 'sync-5', timestamp: '2025-12-10T12:00:00Z', integration: 'Clover', type: 'Sales Data', status: 'error', details: 'Connection timeout - retrying' },
  { id: 'sync-6', timestamp: '2025-12-10T11:30:00Z', integration: 'QuickBooks Online', type: 'Payment', status: 'success', details: 'Payment PAY-2847 recorded' },
];

const webhookEndpoints = [
  { name: 'Order Created', endpoint: '/api/webhooks/orders/created', method: 'POST' },
  { name: 'Order Updated', endpoint: '/api/webhooks/orders/updated', method: 'POST' },
  { name: 'Inventory Changed', endpoint: '/api/webhooks/inventory/changed', method: 'POST' },
  { name: 'Payment Received', endpoint: '/api/webhooks/payments/received', method: 'POST' },
];

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const statusConfig = {
  success: { icon: CheckCircle, color: NEON_GREEN, bg: 'rgba(0, 255, 133, 0.1)', label: 'Success' },
  error: { icon: XCircle, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', label: 'Error' },
  pending: { icon: Clock, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', label: 'Pending' },
};

export default function PartnerIntegrations() {
  const router = useRouter();
  const [partner, setPartner] = useState<PartnerSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('pos');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

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
      <PartnerLayout title="Integrations" partnerName="Loading...">
        <div style={styles.loadingPage}>
          <Loader2 size={32} color={NEON_GREEN} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={styles.loadingText}>Loading integrations...</p>
        </div>
      </PartnerLayout>
    );
  }

  if (!partner) {
    return null;
  }

  const connectedCount = Object.values(integrations).flat().filter(i => i.connected).length;

  return (
    <PartnerLayout title="Integrations" partnerName={partner.businessName}>
      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerIcon}>
              <Plug size={28} color={NEON_GREEN} />
            </div>
            <div>
              <h1 style={styles.title}>Connect Your Systems - Automate Everything</h1>
              <p style={styles.subtitle}>Sync sales data automatically • Automatic inventory updates</p>
            </div>
          </div>
          <div style={styles.headerStats}>
            <div style={styles.connectedBadge}>
              <CheckCircle size={16} color={NEON_GREEN} />
              <span>{connectedCount} Connected</span>
            </div>
          </div>
        </div>

        <div style={styles.categoryTabs}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  ...styles.categoryTab,
                  ...(isActive ? styles.categoryTabActive : {}),
                }}
              >
                <Icon size={18} color={isActive ? NEON_GREEN : '#999999'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {activeCategory === 'api' ? (
          <div style={styles.apiSection}>
            <div style={styles.apiCard}>
              <div style={styles.apiHeader}>
                <div style={styles.apiIcon}>
                  <Key size={24} color={NEON_GREEN} />
                </div>
                <div>
                  <h2 style={styles.apiTitle}>API Access</h2>
                  <p style={styles.apiSubtitle}>Build custom integrations with our REST API</p>
                </div>
              </div>

              <div style={styles.apiKeySection}>
                <label style={styles.apiKeyLabel}>Your API Key</label>
                <div style={styles.apiKeyRow}>
                  <input
                    type={apiKeyVisible ? 'text' : 'password'}
                    value="drz_live_sk_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                    readOnly
                    style={styles.apiKeyInput}
                  />
                  <button
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    style={styles.apiKeyToggle}
                  >
                    {apiKeyVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
                <button style={styles.generateKeyButton}>
                  <RefreshCw size={16} />
                  Generate New API Key
                </button>
              </div>

              <div style={styles.docsLink}>
                <FileText size={18} color={NEON_GREEN} />
                <a href="#" style={styles.docsLinkText}>
                  View API Documentation
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div style={styles.webhooksCard}>
              <div style={styles.webhooksHeader}>
                <Webhook size={20} color="#8B5CF6" />
                <h3 style={styles.webhooksTitle}>Webhook Endpoints</h3>
              </div>
              <div style={styles.webhooksList}>
                {webhookEndpoints.map((webhook, index) => (
                  <div key={index} style={styles.webhookItem}>
                    <div style={styles.webhookInfo}>
                      <span style={styles.webhookName}>{webhook.name}</span>
                      <code style={styles.webhookEndpoint}>{webhook.endpoint}</code>
                    </div>
                    <span style={styles.webhookMethod}>{webhook.method}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.integrationsGrid}>
            {integrations[activeCategory].map((integration) => {
              const Icon = integration.icon;
              return (
                <div key={integration.id} style={styles.integrationCard}>
                  <div style={styles.integrationHeader}>
                    <div style={{ ...styles.integrationIcon, backgroundColor: `${integration.color}20` }}>
                      <Icon size={24} color={integration.color} />
                    </div>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: integration.connected ? 'rgba(0, 255, 133, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      color: integration.connected ? NEON_GREEN : '#999999',
                    }}>
                      {integration.connected ? (
                        <>
                          <CheckCircle size={12} />
                          Connected
                        </>
                      ) : (
                        'Not Connected'
                      )}
                    </span>
                  </div>

                  <h3 style={styles.integrationName}>{integration.name}</h3>
                  <p style={styles.integrationDescription}>{integration.description}</p>

                  {integration.connected && integration.lastSync && (
                    <div style={styles.lastSync}>
                      <Clock size={12} color="#999999" />
                      <span>Last sync: {integration.lastSync}</span>
                    </div>
                  )}

                  <div style={styles.integrationActions}>
                    {integration.connected ? (
                      <>
                        <button style={styles.settingsButton}>
                          <Settings size={14} />
                          View Settings
                        </button>
                        <button style={styles.disconnectButton}>
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button style={styles.connectButton}>
                        Connect {integration.name}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={styles.syncLogSection}>
          <div style={styles.syncLogHeader}>
            <h2 style={styles.syncLogTitle}>Sync Log</h2>
            <button style={styles.refreshButton}>
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Timestamp</th>
                  <th style={styles.th}>Integration</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Details</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockSyncEvents.map((event) => {
                  const StatusIcon = statusConfig[event.status].icon;
                  return (
                    <tr key={event.id}>
                      <td style={styles.td}>{formatTimestamp(event.timestamp)}</td>
                      <td style={styles.td}>
                        <span style={styles.integrationLabel}>{event.integration}</span>
                      </td>
                      <td style={styles.td}>{event.type}</td>
                      <td style={styles.td}>
                        <span style={styles.eventDetails}>{event.details}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.eventStatus,
                          backgroundColor: statusConfig[event.status].bg,
                          color: statusConfig[event.status].color,
                        }}>
                          <StatusIcon size={12} />
                          {statusConfig[event.status].label}
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 4,
  },
  subtitle: {
    color: '#999999',
    fontSize: 14,
    margin: 0,
  },
  headerStats: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  connectedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    border: `1px solid ${NEON_GREEN}`,
    borderRadius: 24,
    color: NEON_GREEN,
    fontSize: 14,
    fontWeight: 500,
  },
  categoryTabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
    borderBottom: `1px solid ${CARD_BORDER}`,
    paddingBottom: 16,
  },
  categoryTab: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#999999',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  categoryTabActive: {
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderColor: NEON_GREEN,
    color: NEON_GREEN,
  },
  integrationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 20,
    marginBottom: 48,
  },
  integrationCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    transition: 'border-color 0.2s',
  },
  integrationHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  integrationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
  },
  integrationName: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 8,
  },
  integrationDescription: {
    color: '#999999',
    fontSize: 14,
    margin: 0,
    marginBottom: 12,
    lineHeight: 1.5,
    flex: 1,
  },
  lastSync: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: '#666666',
    fontSize: 12,
    marginBottom: 16,
  },
  integrationActions: {
    display: 'flex',
    gap: 8,
    marginTop: 'auto',
  },
  connectButton: {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 8,
    color: '#000000',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  settingsButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  disconnectButton: {
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: `1px solid rgba(239, 68, 68, 0.3)`,
    borderRadius: 8,
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  apiSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginBottom: 48,
  },
  apiCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 24,
  },
  apiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  apiIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  apiTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 4,
  },
  apiSubtitle: {
    color: '#999999',
    fontSize: 14,
    margin: 0,
  },
  apiKeySection: {
    marginBottom: 24,
  },
  apiKeyLabel: {
    display: 'block',
    color: '#999999',
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  apiKeyRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 12,
  },
  apiKeyInput: {
    flex: 1,
    padding: '12px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  apiKeyToggle: {
    padding: '12px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    cursor: 'pointer',
  },
  generateKeyButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: `1px solid ${NEON_GREEN}`,
    borderRadius: 8,
    color: NEON_GREEN,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  docsLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px',
    backgroundColor: 'rgba(0, 255, 133, 0.05)',
    borderRadius: 8,
  },
  docsLinkText: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: NEON_GREEN,
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
  },
  webhooksCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 24,
  },
  webhooksHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  webhooksTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  webhooksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  webhookItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
  },
  webhookInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  webhookName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 500,
  },
  webhookEndpoint: {
    color: '#666666',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  webhookMethod: {
    padding: '4px 10px',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    color: '#8B5CF6',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
  },
  syncLogSection: {
    marginTop: 48,
  },
  syncLogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  syncLogTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#999999',
    fontSize: 13,
    cursor: 'pointer',
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
    textAlign: 'left' as const,
    padding: '16px 20px',
    color: '#999999',
    fontSize: 12,
    fontWeight: 500,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  td: {
    padding: '16px 20px',
    color: '#FFFFFF',
    fontSize: 14,
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  integrationLabel: {
    display: 'inline-flex',
    padding: '4px 10px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
    fontSize: 13,
    fontWeight: 500,
  },
  eventDetails: {
    color: '#999999',
  },
  eventStatus: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
  },
};
