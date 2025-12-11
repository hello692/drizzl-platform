import React, { useState } from 'react';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
import {
  Handshake,
  DollarSign,
  Users,
  TrendingUp,
  Target,
  Calendar,
  Phone,
  Mail,
  Building2,
  Clock,
  Plus,
  FileText,
  BarChart3,
  Flame,
  Thermometer,
  Snowflake,
  Activity,
  MessageSquare,
  Video,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
type DealTemperature = 'hot' | 'warm' | 'cold';

interface Deal {
  id: string;
  company: string;
  value: number;
  contact: string;
  daysInStage: number;
  stage: DealStage;
  temperature: DealTemperature;
  probability: number;
  expectedClose: string;
}

interface Contact {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  lastContact: string;
  dealValue: number;
}

interface ActivityItem {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  description: string;
  timestamp: string;
  contact: string;
  company: string;
}

interface TargetAccount {
  id: string;
  company: string;
  status: 'researching' | 'outreach' | 'engaged' | 'qualified';
  potentialValue: number;
}

const pipelineDeals: Deal[] = [
  { id: '1', company: 'Walmart Regional', value: 180000, contact: 'Sarah Chen', daysInStage: 3, stage: 'negotiation', temperature: 'hot', probability: 85, expectedClose: 'Dec 15, 2025' },
  { id: '2', company: 'Whole Foods NYC', value: 95000, contact: 'Michael Park', daysInStage: 5, stage: 'negotiation', temperature: 'hot', probability: 75, expectedClose: 'Dec 18, 2025' },
  { id: '3', company: 'Target Express', value: 75000, contact: 'Emily Watson', daysInStage: 7, stage: 'proposal', temperature: 'warm', probability: 60, expectedClose: 'Dec 22, 2025' },
  { id: '4', company: 'Costco West', value: 120000, contact: 'James Rodriguez', daysInStage: 4, stage: 'proposal', temperature: 'hot', probability: 70, expectedClose: 'Dec 20, 2025' },
  { id: '5', company: "Trader Joe's", value: 65000, contact: 'Amanda Foster', daysInStage: 8, stage: 'proposal', temperature: 'warm', probability: 55, expectedClose: 'Jan 5, 2026' },
  { id: '6', company: 'Sprouts', value: 45000, contact: 'David Kim', daysInStage: 6, stage: 'qualified', temperature: 'warm', probability: 40, expectedClose: 'Jan 10, 2026' },
  { id: '7', company: 'Kroger', value: 85000, contact: 'Lisa Thompson', daysInStage: 2, stage: 'qualified', temperature: 'hot', probability: 50, expectedClose: 'Jan 8, 2026' },
  { id: '8', company: 'Safeway', value: 55000, contact: 'Robert Martinez', daysInStage: 10, stage: 'qualified', temperature: 'cold', probability: 30, expectedClose: 'Jan 15, 2026' },
  { id: '9', company: 'Giant Eagle', value: 42000, contact: 'Kevin Anderson', daysInStage: 5, stage: 'lead', temperature: 'warm', probability: 20, expectedClose: 'Feb 1, 2026' },
  { id: '10', company: 'Meijer', value: 38000, contact: 'Nancy Thomas', daysInStage: 3, stage: 'lead', temperature: 'cold', probability: 15, expectedClose: 'Feb 10, 2026' },
  { id: '11', company: 'Food Lion', value: 48000, contact: 'Steven Jackson', daysInStage: 7, stage: 'lead', temperature: 'cold', probability: 10, expectedClose: 'Feb 15, 2026' },
  { id: '12', company: 'Fresh Market', value: 92000, contact: 'Laura Williams', daysInStage: 1, stage: 'closed', temperature: 'hot', probability: 100, expectedClose: 'Dec 8, 2025' },
  { id: '13', company: 'Natural Grocers', value: 88000, contact: 'John Smith', daysInStage: 2, stage: 'closed', temperature: 'hot', probability: 100, expectedClose: 'Dec 5, 2025' },
];

const contacts: Contact[] = [
  { id: '1', name: 'Sarah Chen', company: 'Walmart Regional', title: 'VP of Merchandising', email: 'sarah.chen@walmart.com', phone: '+1 (479) 555-0101', lastContact: 'Dec 8, 2025', dealValue: 180000 },
  { id: '2', name: 'Michael Park', company: 'Whole Foods NYC', title: 'Category Buyer', email: 'mpark@wholefoods.com', phone: '+1 (212) 555-0102', lastContact: 'Dec 7, 2025', dealValue: 95000 },
  { id: '3', name: 'Emily Watson', company: 'Target Express', title: 'Procurement Manager', email: 'ewatson@target.com', phone: '+1 (612) 555-0103', lastContact: 'Dec 5, 2025', dealValue: 75000 },
  { id: '4', name: 'James Rodriguez', company: 'Costco West', title: 'Regional Director', email: 'jrodriguez@costco.com', phone: '+1 (425) 555-0104', lastContact: 'Dec 6, 2025', dealValue: 120000 },
  { id: '5', name: 'Amanda Foster', company: "Trader Joe's", title: 'Product Buyer', email: 'afoster@traderjoes.com', phone: '+1 (626) 555-0105', lastContact: 'Dec 4, 2025', dealValue: 65000 },
  { id: '6', name: 'David Kim', company: 'Sprouts', title: 'Category Manager', email: 'dkim@sprouts.com', phone: '+1 (480) 555-0106', lastContact: 'Dec 3, 2025', dealValue: 45000 },
  { id: '7', name: 'Lisa Thompson', company: 'Kroger', title: 'Senior Buyer', email: 'lthompson@kroger.com', phone: '+1 (513) 555-0107', lastContact: 'Dec 8, 2025', dealValue: 85000 },
  { id: '8', name: 'Robert Martinez', company: 'Safeway', title: 'Procurement Lead', email: 'rmartinez@safeway.com', phone: '+1 (925) 555-0108', lastContact: 'Nov 30, 2025', dealValue: 55000 },
  { id: '9', name: 'Kevin Anderson', company: 'Giant Eagle', title: 'Wellness Category Mgr', email: 'kanderson@gianteagle.com', phone: '+1 (412) 555-0109', lastContact: 'Dec 5, 2025', dealValue: 42000 },
  { id: '10', name: 'Nancy Thomas', company: 'Meijer', title: 'Division Buyer', email: 'nthomas@meijer.com', phone: '+1 (616) 555-0110', lastContact: 'Dec 7, 2025', dealValue: 38000 },
];

const activityTimeline: ActivityItem[] = [
  { id: '1', type: 'call', description: 'Pricing negotiation call - agreed on volume discounts', timestamp: 'Dec 10, 2025 10:30 AM', contact: 'Sarah Chen', company: 'Walmart Regional' },
  { id: '2', type: 'email', description: 'Sent revised contract with updated terms', timestamp: 'Dec 10, 2025 9:15 AM', contact: 'Michael Park', company: 'Whole Foods NYC' },
  { id: '3', type: 'meeting', description: 'Product demo with buying committee (4 attendees)', timestamp: 'Dec 9, 2025 2:00 PM', contact: 'James Rodriguez', company: 'Costco West' },
  { id: '4', type: 'call', description: 'Follow-up on proposal - positive feedback received', timestamp: 'Dec 9, 2025 11:00 AM', contact: 'Emily Watson', company: 'Target Express' },
  { id: '5', type: 'email', description: 'Sent product samples tracking information', timestamp: 'Dec 8, 2025 4:45 PM', contact: 'Amanda Foster', company: "Trader Joe's" },
  { id: '6', type: 'meeting', description: 'Initial discovery meeting - identified key requirements', timestamp: 'Dec 8, 2025 10:00 AM', contact: 'Lisa Thompson', company: 'Kroger' },
  { id: '7', type: 'call', description: 'Cold outreach - scheduled follow-up for next week', timestamp: 'Dec 7, 2025 3:30 PM', contact: 'Kevin Anderson', company: 'Giant Eagle' },
  { id: '8', type: 'note', description: 'Competitor analysis completed - they currently use Brand X', timestamp: 'Dec 7, 2025 2:00 PM', contact: 'David Kim', company: 'Sprouts' },
  { id: '9', type: 'email', description: 'Sent case study and testimonials package', timestamp: 'Dec 6, 2025 11:30 AM', contact: 'Robert Martinez', company: 'Safeway' },
  { id: '10', type: 'meeting', description: 'Contract signing ceremony - deal closed!', timestamp: 'Dec 5, 2025 3:00 PM', contact: 'John Smith', company: 'Natural Grocers' },
];

const targetAccounts: TargetAccount[] = [
  { id: '1', company: 'Amazon', status: 'researching', potentialValue: 450000 },
  { id: '2', company: 'Albertsons', status: 'outreach', potentialValue: 185000 },
  { id: '3', company: 'Publix', status: 'engaged', potentialValue: 165000 },
  { id: '4', company: 'HEB', status: 'qualified', potentialValue: 140000 },
  { id: '5', company: 'Wegmans', status: 'outreach', potentialValue: 125000 },
  { id: '6', company: 'Aldi', status: 'researching', potentialValue: 110000 },
];

const monthlySalesData = [
  { month: 'Jul', won: 145000 },
  { month: 'Aug', won: 198000 },
  { month: 'Sep', won: 156000 },
  { month: 'Oct', won: 212000 },
  { month: 'Nov', won: 178000 },
  { month: 'Dec', won: 180000 },
];

const stageConfig: { id: DealStage; label: string; color: string }[] = [
  { id: 'lead', label: 'Lead', color: '#6366f1' },
  { id: 'qualified', label: 'Qualified', color: '#8b5cf6' },
  { id: 'proposal', label: 'Proposal', color: '#f59e0b' },
  { id: 'negotiation', label: 'Negotiation', color: '#ec4899' },
  { id: 'closed', label: 'Closed', color: NEON_GREEN },
];

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

function getTemperatureIcon(temp: DealTemperature) {
  switch (temp) {
    case 'hot': return <Flame size={12} color="#ef4444" />;
    case 'warm': return <Thermometer size={12} color="#f59e0b" />;
    case 'cold': return <Snowflake size={12} color="#3b82f6" />;
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'call': return <Phone size={14} color={NEON_GREEN} />;
    case 'email': return <Mail size={14} color="#8b5cf6" />;
    case 'meeting': return <Video size={14} color="#f59e0b" />;
    case 'note': return <MessageSquare size={14} color="#6366f1" />;
    default: return <Activity size={14} />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'researching': return { bg: 'rgba(99,102,241,0.2)', color: '#818cf8' };
    case 'outreach': return { bg: 'rgba(245,158,11,0.2)', color: '#fbbf24' };
    case 'engaged': return { bg: 'rgba(139,92,246,0.2)', color: '#a78bfa' };
    case 'qualified': return { bg: 'rgba(0,255,133,0.2)', color: NEON_GREEN };
    default: return { bg: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' };
  }
}

export default function B2BPipelinePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const getDealsForStage = (stage: DealStage) => {
    return pipelineDeals.filter((d) => d.stage === stage);
  };

  const hotDeals = pipelineDeals
    .filter(d => d.stage !== 'closed')
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);

  const filteredContacts = contacts.filter(
    (c) =>
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CommandCenterLayout title="B2B Pipeline">
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.iconWrapper}>
            <Handshake size={24} color={NEON_GREEN} />
          </div>
          <div>
            <h1 style={styles.title}>B2B Pipeline</h1>
            <p style={styles.subtitle}>Wholesale deals, contacts, and sales funnel</p>
          </div>
        </header>

        {/* Quick Actions Bar */}
        <div style={styles.quickActionsBar}>
          <button style={styles.actionBtn}>
            <Plus size={16} /> Add New Deal
          </button>
          <button style={styles.actionBtn}>
            <Users size={16} /> Add Contact
          </button>
          <button style={styles.actionBtn}>
            <Calendar size={16} /> Schedule Meeting
          </button>
          <button style={styles.actionBtn}>
            <FileText size={16} /> View Reports
          </button>
        </div>

        {/* Pipeline KPIs */}
        <div style={styles.kpiGrid}>
          <div style={styles.kpiCard}>
            <DollarSign size={20} color={NEON_GREEN} />
            <span style={styles.kpiLabel}>Total Pipeline Value</span>
            <span style={styles.kpiValue}>$1.2M</span>
          </div>
          <div style={styles.kpiCard}>
            <Target size={20} color={NEON_GREEN} />
            <span style={styles.kpiLabel}>Active Deals</span>
            <span style={styles.kpiValue}>14</span>
          </div>
          <div style={styles.kpiCard}>
            <CheckCircle2 size={20} color={NEON_GREEN} />
            <span style={styles.kpiLabel}>Won This Month</span>
            <span style={styles.kpiValue}>$180K</span>
            <span style={styles.kpiSubtext}>3 deals</span>
          </div>
          <div style={styles.kpiCard}>
            <BarChart3 size={20} color={NEON_GREEN} />
            <span style={styles.kpiLabel}>Avg Deal Size</span>
            <span style={styles.kpiValue}>$85K</span>
          </div>
          <div style={styles.kpiCard}>
            <TrendingUp size={20} color={NEON_GREEN} />
            <span style={styles.kpiLabel}>Win Rate</span>
            <span style={styles.kpiValue}>32%</span>
          </div>
        </div>

        {/* Visual Pipeline (Kanban) */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Pipeline Stages</h2>
          <div style={styles.kanbanContainer}>
            {stageConfig.map((stage) => {
              const deals = getDealsForStage(stage.id);
              const stageValue = deals.reduce((sum, d) => sum + d.value, 0);
              return (
                <div key={stage.id} style={styles.kanbanColumn}>
                  <div style={styles.kanbanHeader}>
                    <div style={{ ...styles.stageDot, background: stage.color }} />
                    <span style={styles.stageName}>{stage.label}</span>
                    <span style={styles.stageCount}>{deals.length}</span>
                  </div>
                  <div style={styles.stageValue}>{formatCurrency(stageValue)}</div>
                  <div style={styles.kanbanCards}>
                    {deals.slice(0, 3).map((deal) => (
                      <div key={deal.id} style={styles.dealCard}>
                        <div style={styles.dealCardHeader}>
                          <span style={styles.dealCompany}>{deal.company}</span>
                          {getTemperatureIcon(deal.temperature)}
                        </div>
                        <div style={styles.dealValue}>{formatCurrency(deal.value)}</div>
                        <div style={styles.dealContact}>{deal.contact}</div>
                        <div style={styles.dealMeta}>
                          <Clock size={11} style={{ opacity: 0.5 }} />
                          <span>{deal.daysInStage}d in stage</span>
                        </div>
                      </div>
                    ))}
                    {deals.length > 3 && (
                      <div style={styles.moreDeals}>+{deals.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Hot Deals Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Flame size={20} color="#ef4444" style={{ marginRight: 8 }} />
            Hot Deals - Most Likely to Close
          </h2>
          <div style={styles.hotDealsTable}>
            <div style={styles.tableHeader}>
              <span style={{ flex: 2 }}>Company</span>
              <span style={{ flex: 1 }}>Value</span>
              <span style={{ flex: 1 }}>Stage</span>
              <span style={{ flex: 1 }}>Probability</span>
              <span style={{ flex: 1.5 }}>Expected Close</span>
            </div>
            {hotDeals.map((deal) => (
              <div key={deal.id} style={styles.tableRow}>
                <span style={{ flex: 2, fontWeight: 500, color: '#fff' }}>{deal.company}</span>
                <span style={{ flex: 1, color: NEON_GREEN }}>{formatCurrency(deal.value)}</span>
                <span style={{ flex: 1, textTransform: 'capitalize' }}>{deal.stage}</span>
                <span style={{ flex: 1 }}>
                  <span style={{
                    ...styles.probabilityBadge,
                    background: deal.probability >= 70 ? 'rgba(0,255,133,0.2)' : 'rgba(245,158,11,0.2)',
                    color: deal.probability >= 70 ? NEON_GREEN : '#f59e0b',
                  }}>
                    {deal.probability}%
                  </span>
                </span>
                <span style={{ flex: 1.5 }}>{deal.expectedClose}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Database Table */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              <Users size={20} color={NEON_GREEN} style={{ marginRight: 8 }} />
              Contact Database
            </h2>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Last Contact</th>
                  <th style={styles.th}>Deal Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: 500, color: '#fff' }}>{contact.name}</td>
                    <td style={styles.td}>{contact.company}</td>
                    <td style={styles.td}>{contact.title}</td>
                    <td style={{ ...styles.td, color: NEON_GREEN }}>{contact.email}</td>
                    <td style={styles.td}>{contact.phone}</td>
                    <td style={styles.td}>{contact.lastContact}</td>
                    <td style={{ ...styles.td, color: NEON_GREEN }}>{formatCurrency(contact.dealValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div style={styles.twoColumnGrid}>
          {/* Sales Activity Timeline */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <Activity size={20} color={NEON_GREEN} style={{ marginRight: 8 }} />
              Sales Activity Timeline
            </h2>
            <div style={styles.activityList}>
              {activityTimeline.map((activity) => (
                <div key={activity.id} style={styles.activityItem}>
                  <div style={styles.activityIcon}>{getActivityIcon(activity.type)}</div>
                  <div style={styles.activityContent}>
                    <div style={styles.activityHeader}>
                      <span style={styles.activityCompany}>{activity.company}</span>
                      <span style={styles.activityTime}>{activity.timestamp}</span>
                    </div>
                    <p style={styles.activityDesc}>{activity.description}</p>
                    <span style={styles.activityContact}>{activity.contact}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Target Accounts */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <Target size={20} color={NEON_GREEN} style={{ marginRight: 8 }} />
              Target Accounts
            </h2>
            <div style={styles.targetAccountsList}>
              {targetAccounts.map((account) => {
                const statusStyle = getStatusColor(account.status);
                return (
                  <div key={account.id} style={styles.targetAccountCard}>
                    <div style={styles.targetAccountHeader}>
                      <Building2 size={18} color="rgba(255,255,255,0.5)" />
                      <span style={styles.targetAccountCompany}>{account.company}</span>
                    </div>
                    <div style={styles.targetAccountDetails}>
                      <span style={styles.targetAccountValue}>
                        {formatCurrency(account.potentialValue)}
                      </span>
                      <span style={{
                        ...styles.statusBadge,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                      }}>
                        {account.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Monthly Sales Performance Chart */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <BarChart3 size={20} color={NEON_GREEN} style={{ marginRight: 8 }} />
            Monthly Sales Performance
          </h2>
          <div style={styles.chartCard}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlySalesData}>
                <XAxis 
                  dataKey="month" 
                  stroke="rgba(255,255,255,0.4)" 
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.4)" 
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#fff',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Won Deals']}
                />
                <Bar 
                  dataKey="won" 
                  fill={NEON_GREEN} 
                  radius={[4, 4, 0, 0]}
                />
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
    marginBottom: 24,
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
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#fff',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    marginBottom: 32,
  },
  kpiCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  kpiLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  kpiValue: {
    fontSize: 26,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  kpiSubtext: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  kanbanContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
    overflowX: 'auto',
  },
  kanbanColumn: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
  },
  kanbanHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  stageName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
  },
  stageCount: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 'auto',
  },
  stageValue: {
    fontSize: 14,
    fontWeight: 600,
    color: NEON_GREEN,
    marginBottom: 12,
  },
  kanbanCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  dealCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: 12,
  },
  dealCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dealCompany: {
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
  },
  dealValue: {
    fontSize: 15,
    fontWeight: 700,
    color: NEON_GREEN,
    marginBottom: 4,
  },
  dealContact: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
  },
  dealMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  moreDeals: {
    textAlign: 'center',
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    padding: 8,
  },
  hotDealsTable: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex',
    padding: '14px 16px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    display: 'flex',
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
  },
  probabilityBadge: {
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 600,
  },
  searchInput: {
    padding: '10px 14px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#fff',
    fontSize: 13,
    width: 220,
    outline: 'none',
  },
  tableContainer: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 900,
  },
  th: {
    textAlign: 'left',
    padding: '14px 16px',
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  td: {
    padding: '12px 16px',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    whiteSpace: 'nowrap',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: 24,
  },
  activityList: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 16,
    maxHeight: 480,
    overflowY: 'auto',
  },
  activityItem: {
    display: 'flex',
    gap: 12,
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  activityIcon: {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityCompany: {
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
  },
  activityTime: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  activityDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    margin: '0 0 4px 0',
    lineHeight: 1.4,
  },
  activityContact: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  targetAccountsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  targetAccountCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 10,
    padding: 16,
  },
  targetAccountHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  targetAccountCompany: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  },
  targetAccountDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetAccountValue: {
    fontSize: 16,
    fontWeight: 700,
    color: NEON_GREEN,
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  chartCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 24,
  },
};
