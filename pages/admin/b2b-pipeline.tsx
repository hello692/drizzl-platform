import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  DollarSign,
  Users,
  TrendingUp,
  Target,
  Calendar,
  Phone,
  Mail,
  Building2,
  Clock,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  User,
  MessageSquare,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const isDemoMode = true;

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won';

interface Deal {
  id: string;
  company: string;
  value: number;
  daysInStage: number;
  owner: string;
  ownerInitials: string;
  stage: DealStage;
  probability: number;
  contact: string;
  email: string;
  phone: string;
  industry: string;
  nextStep: string;
}

interface HotDeal {
  id: string;
  company: string;
  value: number;
  stage: string;
  actionNeeded: string;
  urgency: 'critical' | 'high';
  daysUntilClose: number;
}

interface Contact {
  id: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  lastContact: string;
  title: string;
}

interface TargetAccount {
  id: string;
  company: string;
  potentialValue: number;
  industry: string;
  decisionMaker: string;
  status: string;
}

interface ActivityItem {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'proposal';
  description: string;
  date: string;
  user: string;
}

const pipelineMetrics = {
  totalValue: 2400000,
  activeDeals: 24,
  winRate: 34,
  avgDealSize: 85000,
  closingThisMonth: 6,
};

const stageConfig: { id: DealStage; label: string; deals: number; value: number; color: string }[] = [
  { id: 'lead', label: 'Lead', deals: 8, value: 420000, color: '#6366f1' },
  { id: 'qualified', label: 'Qualified', deals: 6, value: 580000, color: '#8b5cf6' },
  { id: 'proposal', label: 'Proposal', deals: 5, value: 620000, color: '#f59e0b' },
  { id: 'negotiation', label: 'Negotiation', deals: 3, value: 480000, color: '#ec4899' },
  { id: 'closed_won', label: 'Closed Won', deals: 2, value: 300000, color: NEON_GREEN },
];

const pipelineDeals: Deal[] = [
  { id: '1', company: 'Walmart', value: 125000, daysInStage: 5, owner: 'Alex Thompson', ownerInitials: 'AT', stage: 'negotiation', probability: 75, contact: 'Sarah Chen', email: 'sarah.chen@walmart.com', phone: '+1 (479) 555-0101', industry: 'Retail', nextStep: 'Send revised pricing proposal' },
  { id: '2', company: 'Target', value: 98000, daysInStage: 3, owner: 'Jordan Lee', ownerInitials: 'JL', stage: 'negotiation', probability: 70, contact: 'Michael Park', email: 'mpark@target.com', phone: '+1 (612) 555-0102', industry: 'Retail', nextStep: 'Schedule contract review call' },
  { id: '3', company: 'Whole Foods', value: 156000, daysInStage: 7, owner: 'Casey Martinez', ownerInitials: 'CM', stage: 'proposal', probability: 50, contact: 'Emily Watson', email: 'ewatson@wholefoods.com', phone: '+1 (512) 555-0103', industry: 'Grocery', nextStep: 'Follow up on proposal sent last week' },
  { id: '4', company: 'Costco', value: 180000, daysInStage: 12, owner: 'Alex Thompson', ownerInitials: 'AT', stage: 'proposal', probability: 45, contact: 'James Rodriguez', email: 'jrodriguez@costco.com', phone: '+1 (425) 555-0104', industry: 'Wholesale', nextStep: 'Present to buying committee' },
  { id: '5', company: "Trader Joe's", value: 92000, daysInStage: 4, owner: 'Morgan Williams', ownerInitials: 'MW', stage: 'proposal', probability: 55, contact: 'Amanda Foster', email: 'afoster@traderjoes.com', phone: '+1 (626) 555-0105', industry: 'Grocery', nextStep: 'Send product samples' },
  { id: '6', company: 'Sprouts', value: 78000, daysInStage: 8, owner: 'Jordan Lee', ownerInitials: 'JL', stage: 'proposal', probability: 40, contact: 'David Kim', email: 'dkim@sprouts.com', phone: '+1 (480) 555-0106', industry: 'Grocery', nextStep: 'Demo scheduling' },
  { id: '7', company: 'Kroger', value: 145000, daysInStage: 2, owner: 'Taylor Johnson', ownerInitials: 'TJ', stage: 'proposal', probability: 60, contact: 'Lisa Thompson', email: 'lthompson@kroger.com', phone: '+1 (513) 555-0107', industry: 'Grocery', nextStep: 'Negotiate volume discounts' },
  { id: '8', company: 'Safeway', value: 115000, daysInStage: 6, owner: 'Casey Martinez', ownerInitials: 'CM', stage: 'qualified', probability: 25, contact: 'Robert Martinez', email: 'rmartinez@safeway.com', phone: '+1 (925) 555-0108', industry: 'Grocery', nextStep: 'Schedule discovery call' },
  { id: '9', company: 'Publix', value: 88000, daysInStage: 9, owner: 'Alex Thompson', ownerInitials: 'AT', stage: 'qualified', probability: 30, contact: 'Jennifer Lee', email: 'jlee@publix.com', phone: '+1 (863) 555-0109', industry: 'Grocery', nextStep: 'Send case study' },
  { id: '10', company: 'Albertsons', value: 95000, daysInStage: 4, owner: 'Morgan Williams', ownerInitials: 'MW', stage: 'qualified', probability: 25, contact: 'Christopher Brown', email: 'cbrown@albertsons.com', phone: '+1 (208) 555-0110', industry: 'Grocery', nextStep: 'Qualify budget' },
  { id: '11', company: 'Wegmans', value: 72000, daysInStage: 11, owner: 'Jordan Lee', ownerInitials: 'JL', stage: 'qualified', probability: 20, contact: 'Patricia Davis', email: 'pdavis@wegmans.com', phone: '+1 (585) 555-0111', industry: 'Grocery', nextStep: 'Initial needs assessment' },
  { id: '12', company: 'HEB', value: 110000, daysInStage: 3, owner: 'Taylor Johnson', ownerInitials: 'TJ', stage: 'qualified', probability: 35, contact: 'Daniel Wilson', email: 'dwilson@heb.com', phone: '+1 (210) 555-0112', industry: 'Grocery', nextStep: 'Product presentation' },
  { id: '13', company: 'Aldi', value: 68000, daysInStage: 5, owner: 'Casey Martinez', ownerInitials: 'CM', stage: 'qualified', probability: 20, contact: 'Michelle Taylor', email: 'mtaylor@aldi.com', phone: '+1 (630) 555-0113', industry: 'Discount Retail', nextStep: 'Budget qualification' },
  { id: '14', company: 'Giant Eagle', value: 54000, daysInStage: 7, owner: 'Alex Thompson', ownerInitials: 'AT', stage: 'lead', probability: 10, contact: 'Kevin Anderson', email: 'kanderson@gianteagle.com', phone: '+1 (412) 555-0114', industry: 'Grocery', nextStep: 'Send intro materials' },
  { id: '15', company: 'Meijer', value: 62000, daysInStage: 3, owner: 'Morgan Williams', ownerInitials: 'MW', stage: 'lead', probability: 15, contact: 'Nancy Thomas', email: 'nthomas@meijer.com', phone: '+1 (616) 555-0115', industry: 'Supercenter', nextStep: 'Schedule intro call' },
  { id: '16', company: 'Food Lion', value: 48000, daysInStage: 10, owner: 'Jordan Lee', ownerInitials: 'JL', stage: 'lead', probability: 10, contact: 'Steven Jackson', email: 'sjackson@foodlion.com', phone: '+1 (704) 555-0116', industry: 'Grocery', nextStep: 'Research company needs' },
  { id: '17', company: 'Winn-Dixie', value: 42000, daysInStage: 6, owner: 'Taylor Johnson', ownerInitials: 'TJ', stage: 'lead', probability: 10, contact: 'Karen White', email: 'kwhite@winndixie.com', phone: '+1 (904) 555-0117', industry: 'Grocery', nextStep: 'Initial outreach' },
  { id: '18', company: 'ShopRite', value: 56000, daysInStage: 8, owner: 'Casey Martinez', ownerInitials: 'CM', stage: 'lead', probability: 15, contact: 'Brian Harris', email: 'bharris@shoprite.com', phone: '+1 (973) 555-0118', industry: 'Grocery', nextStep: 'Connect on LinkedIn' },
  { id: '19', company: 'Stop & Shop', value: 51000, daysInStage: 4, owner: 'Alex Thompson', ownerInitials: 'AT', stage: 'lead', probability: 10, contact: 'Susan Martin', email: 'smartin@stopandshop.com', phone: '+1 (617) 555-0119', industry: 'Grocery', nextStep: 'Cold email sequence' },
  { id: '20', company: 'Hy-Vee', value: 58000, daysInStage: 2, owner: 'Morgan Williams', ownerInitials: 'MW', stage: 'lead', probability: 15, contact: 'Richard Garcia', email: 'rgarcia@hyvee.com', phone: '+1 (515) 555-0120', industry: 'Grocery', nextStep: 'Identify key stakeholders' },
  { id: '21', company: 'Harris Teeter', value: 49000, daysInStage: 9, owner: 'Jordan Lee', ownerInitials: 'JL', stage: 'lead', probability: 10, contact: 'Elizabeth Moore', email: 'emoore@harristeeter.com', phone: '+1 (704) 555-0121', industry: 'Grocery', nextStep: 'Market research' },
  { id: '22', company: 'Sprouts Regional', value: 165000, daysInStage: 1, owner: 'Taylor Johnson', ownerInitials: 'TJ', stage: 'negotiation', probability: 80, contact: 'Mark Johnson', email: 'mjohnson@sprouts.com', phone: '+1 (480) 555-0122', industry: 'Grocery', nextStep: 'Final contract review' },
  { id: '23', company: 'Fresh Market', value: 142000, daysInStage: 15, owner: 'Casey Martinez', ownerInitials: 'CM', stage: 'closed_won', probability: 100, contact: 'Laura Williams', email: 'lwilliams@freshmarket.com', phone: '+1 (336) 555-0123', industry: 'Specialty Grocery', nextStep: 'Onboarding kickoff' },
  { id: '24', company: 'Natural Grocers', value: 158000, daysInStage: 20, owner: 'Alex Thompson', ownerInitials: 'AT', stage: 'closed_won', probability: 100, contact: 'John Smith', email: 'jsmith@naturalgrocers.com', phone: '+1 (303) 555-0124', industry: 'Natural Foods', nextStep: 'First order processing' },
];

const hotDeals: HotDeal[] = [
  { id: '1', company: 'Walmart', value: 125000, stage: 'Negotiation', actionNeeded: 'Send revised pricing by EOD', urgency: 'critical', daysUntilClose: 3 },
  { id: '2', company: 'Sprouts Regional', value: 165000, stage: 'Negotiation', actionNeeded: 'Final contract signature pending', urgency: 'critical', daysUntilClose: 2 },
  { id: '3', company: 'Target', value: 98000, stage: 'Negotiation', actionNeeded: 'Schedule exec sponsor call', urgency: 'high', daysUntilClose: 5 },
  { id: '4', company: 'Whole Foods', value: 156000, stage: 'Proposal', actionNeeded: 'Follow up - no response in 5 days', urgency: 'high', daysUntilClose: 8 },
  { id: '5', company: 'Costco', value: 180000, stage: 'Proposal', actionNeeded: 'Prepare committee presentation', urgency: 'high', daysUntilClose: 10 },
  { id: '6', company: 'Kroger', value: 145000, stage: 'Proposal', actionNeeded: 'Volume discount negotiation', urgency: 'high', daysUntilClose: 7 },
];

const contacts: Contact[] = [
  { id: '1', company: 'Walmart', name: 'Sarah Chen', email: 'sarah.chen@walmart.com', phone: '+1 (479) 555-0101', lastContact: 'Dec 8, 2025', title: 'VP of Merchandising' },
  { id: '2', company: 'Target', name: 'Michael Park', email: 'mpark@target.com', phone: '+1 (612) 555-0102', lastContact: 'Dec 7, 2025', title: 'Category Buyer' },
  { id: '3', company: 'Whole Foods', name: 'Emily Watson', email: 'ewatson@wholefoods.com', phone: '+1 (512) 555-0103', lastContact: 'Dec 3, 2025', title: 'Procurement Manager' },
  { id: '4', company: 'Costco', name: 'James Rodriguez', email: 'jrodriguez@costco.com', phone: '+1 (425) 555-0104', lastContact: 'Nov 28, 2025', title: 'Regional Director' },
  { id: '5', company: "Trader Joe's", name: 'Amanda Foster', email: 'afoster@traderjoes.com', phone: '+1 (626) 555-0105', lastContact: 'Dec 6, 2025', title: 'Product Buyer' },
  { id: '6', company: 'Sprouts', name: 'David Kim', email: 'dkim@sprouts.com', phone: '+1 (480) 555-0106', lastContact: 'Dec 2, 2025', title: 'Category Manager' },
  { id: '7', company: 'Kroger', name: 'Lisa Thompson', email: 'lthompson@kroger.com', phone: '+1 (513) 555-0107', lastContact: 'Dec 8, 2025', title: 'Senior Buyer' },
  { id: '8', company: 'Safeway', name: 'Robert Martinez', email: 'rmartinez@safeway.com', phone: '+1 (925) 555-0108', lastContact: 'Dec 4, 2025', title: 'Procurement Lead' },
  { id: '9', company: 'Publix', name: 'Jennifer Lee', email: 'jlee@publix.com', phone: '+1 (863) 555-0109', lastContact: 'Dec 1, 2025', title: 'Wellness Category Mgr' },
  { id: '10', company: 'Albertsons', name: 'Christopher Brown', email: 'cbrown@albertsons.com', phone: '+1 (208) 555-0110', lastContact: 'Dec 6, 2025', title: 'Division Buyer' },
  { id: '11', company: 'Wegmans', name: 'Patricia Davis', email: 'pdavis@wegmans.com', phone: '+1 (585) 555-0111', lastContact: 'Nov 29, 2025', title: 'Natural Foods Buyer' },
  { id: '12', company: 'HEB', name: 'Daniel Wilson', email: 'dwilson@heb.com', phone: '+1 (210) 555-0112', lastContact: 'Dec 7, 2025', title: 'Product Manager' },
];

const targetAccounts: TargetAccount[] = [
  { id: '1', company: 'Amazon Fresh', potentialValue: 450000, industry: 'E-commerce/Grocery', decisionMaker: 'TBD - Research needed', status: 'Researching' },
  { id: '2', company: 'Instacart', potentialValue: 280000, industry: 'Delivery Platform', decisionMaker: 'TBD - Outreach planned', status: 'Identified' },
  { id: '3', company: 'Thrive Market', potentialValue: 195000, industry: 'Online Natural Foods', decisionMaker: 'TBD - LinkedIn search', status: 'Researching' },
  { id: '4', company: 'Gopuff', potentialValue: 165000, industry: 'Instant Delivery', decisionMaker: 'TBD - Partnership team', status: 'Identified' },
  { id: '5', company: 'Boxed', potentialValue: 120000, industry: 'Wholesale E-commerce', decisionMaker: 'TBD - CPG team contact', status: 'Cold' },
  { id: '6', company: 'Vitacost', potentialValue: 98000, industry: 'Health & Wellness', decisionMaker: 'TBD - Category buyer', status: 'Cold' },
];

const sampleDealActivities: ActivityItem[] = [
  { id: '1', type: 'call', description: 'Discovery call with Sarah Chen - discussed volume requirements', date: 'Dec 8, 2025', user: 'Alex Thompson' },
  { id: '2', type: 'email', description: 'Sent revised pricing proposal with volume discounts', date: 'Dec 7, 2025', user: 'Alex Thompson' },
  { id: '3', type: 'meeting', description: 'Virtual product demo with buying team (4 attendees)', date: 'Dec 5, 2025', user: 'Alex Thompson' },
  { id: '4', type: 'proposal', description: 'Initial proposal submitted - $125K annual contract', date: 'Dec 2, 2025', user: 'Alex Thompson' },
  { id: '5', type: 'note', description: 'Competitor analysis requested - they currently use Brand X', date: 'Nov 28, 2025', user: 'Alex Thompson' },
  { id: '6', type: 'call', description: 'Follow-up call to address pricing concerns', date: 'Nov 25, 2025', user: 'Alex Thompson' },
  { id: '7', type: 'meeting', description: 'Initial discovery meeting - identified key requirements', date: 'Nov 20, 2025', user: 'Alex Thompson' },
  { id: '8', type: 'email', description: 'First outreach email sent with company introduction', date: 'Nov 15, 2025', user: 'Alex Thompson' },
];

const wonVsLostData = [
  { month: 'Jul', won: 3, lost: 2 },
  { month: 'Aug', won: 4, lost: 1 },
  { month: 'Sep', won: 2, lost: 3 },
  { month: 'Oct', won: 5, lost: 2 },
  { month: 'Nov', won: 3, lost: 1 },
  { month: 'Dec', won: 2, lost: 0 },
];

const pipelineVelocityData = [
  { month: 'Jul', velocity: 28 },
  { month: 'Aug', velocity: 32 },
  { month: 'Sep', velocity: 25 },
  { month: 'Oct', velocity: 38 },
  { month: 'Nov', velocity: 42 },
  { month: 'Dec', velocity: 45 },
];

const revenueByStageData = [
  { name: 'Lead', value: 420000, color: '#6366f1' },
  { name: 'Qualified', value: 580000, color: '#8b5cf6' },
  { name: 'Proposal', value: 620000, color: '#f59e0b' },
  { name: 'Negotiation', value: 480000, color: '#ec4899' },
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

function DealCard({ deal }: { deal: Deal }) {
  return (
    <div style={styles.dealCard}>
      <div style={styles.dealCardHeader}>
        <span style={styles.dealCompany}>{deal.company}</span>
        <span style={styles.dealOwner}>{deal.ownerInitials}</span>
      </div>
      <div style={styles.dealValue}>{formatCurrency(deal.value)}</div>
      <div style={styles.dealMeta}>
        <Clock size={12} style={{ opacity: 0.5 }} />
        <span>{deal.daysInStage}d in stage</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, subtitle, icon }: { label: string; value: string; subtitle?: string; icon: React.ReactNode }) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricIcon}>{icon}</div>
      <div style={styles.metricContent}>
        <div style={styles.metricValue}>{value}</div>
        <div style={styles.metricLabel}>{label}</div>
        {subtitle && <div style={styles.metricSubtitle}>{subtitle}</div>}
      </div>
    </div>
  );
}

export default function B2BPipelinePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(pipelineDeals[0]);

  const filteredContacts = contacts.filter(
    (c) =>
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDealsForStage = (stage: DealStage) => {
    return pipelineDeals.filter((d) => d.stage === stage);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone size={14} />;
      case 'email': return <Mail size={14} />;
      case 'meeting': return <Users size={14} />;
      case 'proposal': return <FileText size={14} />;
      case 'note': return <MessageSquare size={14} />;
      default: return <Activity size={14} />;
    }
  };

  return (
    <AdminLayout title="B2B Pipeline" subtitle="Sales pipeline management and deal tracking">
      <div style={styles.container}>
        {/* Pipeline Overview Metrics */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Pipeline Overview</h2>
          <div style={styles.metricsGrid}>
            <MetricCard
              label="Total Pipeline Value"
              value={formatCurrency(pipelineMetrics.totalValue)}
              icon={<DollarSign size={20} color={NEON_GREEN} />}
            />
            <MetricCard
              label="Active Deals"
              value={pipelineMetrics.activeDeals.toString()}
              icon={<Briefcase size={20} color={NEON_GREEN} />}
            />
            <MetricCard
              label="Win Rate"
              value={`${pipelineMetrics.winRate}%`}
              icon={<TrendingUp size={20} color={NEON_GREEN} />}
            />
            <MetricCard
              label="Avg Deal Size"
              value={formatCurrency(pipelineMetrics.avgDealSize)}
              icon={<Target size={20} color={NEON_GREEN} />}
            />
            <MetricCard
              label="Closing This Month"
              value={pipelineMetrics.closingThisMonth.toString()}
              subtitle="deals"
              icon={<Calendar size={20} color={NEON_GREEN} />}
            />
          </div>
        </section>

        {/* Visual Pipeline Stages (Kanban) */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Pipeline Stages</h2>
          <div style={styles.kanbanContainer}>
            {stageConfig.map((stage) => (
              <div key={stage.id} style={styles.kanbanColumn}>
                <div style={styles.kanbanHeader}>
                  <div style={{ ...styles.stageDot, background: stage.color }} />
                  <span style={styles.stageName}>{stage.label}</span>
                  <span style={styles.stageCount}>{stage.deals}</span>
                </div>
                <div style={styles.stageValue}>{formatCurrency(stage.value)}</div>
                <div style={styles.kanbanCards}>
                  {getDealsForStage(stage.id).slice(0, 4).map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                  {getDealsForStage(stage.id).length > 4 && (
                    <div style={styles.moreDeals}>
                      +{getDealsForStage(stage.id).length - 4} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hot Deals Requiring Action */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <AlertCircle size={20} color="#ef4444" style={{ marginRight: 8 }} />
            Hot Deals Requiring Action
          </h2>
          <div style={styles.hotDealsGrid}>
            {hotDeals.map((deal) => (
              <div key={deal.id} style={styles.hotDealCard}>
                <div style={styles.hotDealHeader}>
                  <div style={styles.hotDealInfo}>
                    <span style={styles.hotDealCompany}>{deal.company}</span>
                    <span style={styles.hotDealStage}>{deal.stage}</span>
                  </div>
                  <div style={{
                    ...styles.urgencyBadge,
                    background: deal.urgency === 'critical' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                    color: deal.urgency === 'critical' ? '#ef4444' : '#f59e0b',
                  }}>
                    {deal.urgency === 'critical' ? <Zap size={12} /> : <AlertTriangle size={12} />}
                    {deal.urgency}
                  </div>
                </div>
                <div style={styles.hotDealValue}>{formatCurrency(deal.value)}</div>
                <div style={styles.hotDealAction}>{deal.actionNeeded}</div>
                <div style={styles.hotDealFooter}>
                  <span style={styles.daysUntilClose}>
                    <Clock size={12} /> {deal.daysUntilClose}d until close
                  </span>
                  <button style={styles.actionButton}>Take Action</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={styles.twoColumnGrid}>
          {/* Deal Details View */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Deal Details</h2>
            {selectedDeal && (
              <div style={styles.dealDetailsCard}>
                <div style={styles.dealDetailsHeader}>
                  <div>
                    <h3 style={styles.dealDetailsCompany}>{selectedDeal.company}</h3>
                    <p style={styles.dealDetailsContact}>{selectedDeal.contact} • {selectedDeal.industry}</p>
                  </div>
                  <div style={styles.dealDetailsValue}>{formatCurrency(selectedDeal.value)}</div>
                </div>
                
                <div style={styles.dealDetailsGrid}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Stage</span>
                    <span style={styles.detailValue}>{selectedDeal.stage.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Probability</span>
                    <span style={styles.detailValue}>{selectedDeal.probability}%</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Owner</span>
                    <span style={styles.detailValue}>{selectedDeal.owner}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Days in Stage</span>
                    <span style={styles.detailValue}>{selectedDeal.daysInStage} days</span>
                  </div>
                </div>

                <div style={styles.nextStepsBox}>
                  <h4 style={styles.nextStepsTitle}>Next Steps</h4>
                  <p style={styles.nextStepsText}>{selectedDeal.nextStep}</p>
                </div>

                <div style={styles.activityTimeline}>
                  <h4 style={styles.activityTitle}>Recent Activity</h4>
                  {sampleDealActivities.map((activity) => (
                    <div key={activity.id} style={styles.activityItem}>
                      <div style={styles.activityIcon}>{getActivityIcon(activity.type)}</div>
                      <div style={styles.activityContent}>
                        <p style={styles.activityDesc}>{activity.description}</p>
                        <span style={styles.activityMeta}>{activity.date} • {activity.user}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Target Accounts List */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <Target size={20} color={NEON_GREEN} style={{ marginRight: 8 }} />
              Target Accounts
            </h2>
            <div style={styles.targetAccountsList}>
              {targetAccounts.map((account) => (
                <div key={account.id} style={styles.targetAccountCard}>
                  <div style={styles.targetAccountHeader}>
                    <Building2 size={16} color="rgba(255,255,255,0.5)" />
                    <span style={styles.targetAccountCompany}>{account.company}</span>
                  </div>
                  <div style={styles.targetAccountDetails}>
                    <div style={styles.targetAccountRow}>
                      <span style={styles.targetLabel}>Potential Value</span>
                      <span style={styles.targetValue}>{formatCurrency(account.potentialValue)}</span>
                    </div>
                    <div style={styles.targetAccountRow}>
                      <span style={styles.targetLabel}>Industry</span>
                      <span style={styles.targetValue}>{account.industry}</span>
                    </div>
                    <div style={styles.targetAccountRow}>
                      <span style={styles.targetLabel}>Decision Maker</span>
                      <span style={styles.targetValue}>{account.decisionMaker}</span>
                    </div>
                  </div>
                  <div style={styles.targetAccountStatus}>
                    <span style={{
                      ...styles.statusBadge,
                      background: account.status === 'Researching' ? 'rgba(139,92,246,0.2)' : 
                                  account.status === 'Identified' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)',
                      color: account.status === 'Researching' ? '#a78bfa' : 
                             account.status === 'Identified' ? '#4ade80' : 'rgba(255,255,255,0.5)',
                    }}>{account.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Contact Database */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              <Users size={20} color={NEON_GREEN} style={{ marginRight: 8 }} />
              Contact Database
            </h2>
            <div style={styles.searchBox}>
              <Search size={16} color="rgba(255,255,255,0.4)" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Primary Contact</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Last Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} style={styles.tr}>
                    <td style={styles.td}>{contact.company}</td>
                    <td style={styles.td}>{contact.name}</td>
                    <td style={styles.td}>{contact.title}</td>
                    <td style={styles.tdEmail}>{contact.email}</td>
                    <td style={styles.td}>{contact.phone}</td>
                    <td style={styles.td}>{contact.lastContact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sales Analytics */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <BarChart3 size={20} color={NEON_GREEN} style={{ marginRight: 8 }} />
            Sales Analytics
          </h2>
          <div style={styles.chartsGrid}>
            {/* Won vs Lost Chart */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Deals Won vs Lost (6 Months)</h3>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={wonVsLostData}>
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="won" fill={NEON_GREEN} name="Won" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="lost" fill="#ef4444" name="Lost" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={styles.chartLegend}>
                <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: NEON_GREEN }} />Won</span>
                <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: '#ef4444' }} />Lost</span>
              </div>
            </div>

            {/* Pipeline Velocity Chart */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Pipeline Velocity (Days to Close)</h3>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={pipelineVelocityData}>
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="velocity" stroke={NEON_GREEN} strokeWidth={2} dot={{ fill: NEON_GREEN, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue by Stage Chart */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Revenue by Stage</h3>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={revenueByStageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {revenueByStageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={styles.chartLegend}>
                {revenueByStageData.map((item) => (
                  <span key={item.name} style={styles.legendItem}>
                    <span style={{ ...styles.legendDot, background: item.color }} />
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
  },
  metricCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'rgba(0,255,133,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricContent: {
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  metricSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  kanbanContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
  },
  kanbanColumn: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 16,
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
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    flex: 1,
  },
  stageCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    background: 'rgba(255,255,255,0.1)',
    padding: '2px 8px',
    borderRadius: 12,
  },
  stageValue: {
    fontSize: 16,
    fontWeight: 600,
    color: NEON_GREEN,
    marginBottom: 12,
  },
  kanbanCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  dealCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 12,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  dealCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dealCompany: {
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
  },
  dealOwner: {
    fontSize: 10,
    fontWeight: 600,
    color: '#fff',
    background: 'rgba(139,92,246,0.3)',
    padding: '2px 6px',
    borderRadius: 4,
  },
  dealValue: {
    fontSize: 15,
    fontWeight: 700,
    color: NEON_GREEN,
    marginBottom: 4,
  },
  dealMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  moreDeals: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    padding: 8,
  },
  hotDealsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },
  hotDealCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 16,
  },
  hotDealHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  hotDealInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  hotDealCompany: {
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
  },
  hotDealStage: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  urgencyBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  hotDealValue: {
    fontSize: 20,
    fontWeight: 700,
    color: NEON_GREEN,
    marginBottom: 8,
  },
  hotDealAction: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
    lineHeight: 1.4,
  },
  hotDealFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daysUntilClose: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  actionButton: {
    background: NEON_GREEN,
    color: '#000',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
  },
  dealDetailsCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 20,
  },
  dealDetailsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  dealDetailsCompany: {
    fontSize: 20,
    fontWeight: 700,
    color: '#fff',
    margin: 0,
    marginBottom: 4,
  },
  dealDetailsContact: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    margin: 0,
  },
  dealDetailsValue: {
    fontSize: 24,
    fontWeight: 700,
    color: NEON_GREEN,
  },
  dealDetailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    marginBottom: 20,
  },
  detailItem: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: 12,
  },
  detailLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  },
  nextStepsBox: {
    background: 'rgba(0,255,133,0.08)',
    border: '1px solid rgba(0,255,133,0.2)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  nextStepsTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: NEON_GREEN,
    margin: 0,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  nextStepsText: {
    fontSize: 14,
    color: '#fff',
    margin: 0,
    lineHeight: 1.4,
  },
  activityTimeline: {},
  activityTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    marginBottom: 12,
  },
  activityItem: {
    display: 'flex',
    gap: 12,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  activityIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.6)',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityDesc: {
    fontSize: 13,
    color: '#fff',
    margin: 0,
    marginBottom: 4,
    lineHeight: 1.4,
  },
  activityMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  targetAccountsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  targetAccountCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 14,
  },
  targetAccountHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  targetAccountCompany: {
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
  },
  targetAccountDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 10,
  },
  targetAccountRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  targetLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  targetValue: {
    fontSize: 12,
    color: '#fff',
  },
  targetAccountStatus: {
    marginTop: 'auto',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 500,
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '8px 14px',
    width: 280,
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    width: '100%',
  },
  tableContainer: {
    background: CARD_BG,
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
    padding: '14px 16px',
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  td: {
    padding: '14px 16px',
    fontSize: 14,
    color: '#fff',
  },
  tdEmail: {
    padding: '14px 16px',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },
  chartCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    marginBottom: 16,
  },
  chartContainer: {
    marginBottom: 12,
  },
  chartLegend: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
};
