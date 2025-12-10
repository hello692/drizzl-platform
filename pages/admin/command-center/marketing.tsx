import React from 'react';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
import {
  Megaphone,
  Users,
  TrendingUp,
  Target,
  DollarSign,
  Mail,
  Instagram,
  Facebook,
  PlayCircle,
  MousePointerClick,
  Eye,
  Calendar,
  Send,
  BarChart3,
  ArrowUpRight,
  Plus,
  ChevronRight,
  Image,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface KPIMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

interface Campaign {
  id: string;
  name: string;
  channel: 'Email' | 'Social' | 'Paid';
  status: 'Active' | 'Paused' | 'Completed';
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface ChannelData {
  channel: string;
  clicks: number;
  ctr: number;
  convRate: number;
  color: string;
}

interface EmailCampaign {
  id: string;
  subject: string;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  followers: string;
  engagement: string;
  recentPosts: number;
  color: string;
}

interface ScheduledContent {
  id: string;
  title: string;
  type: 'Post' | 'Story' | 'Email' | 'Ad';
  platform: string;
  scheduledDate: string;
  scheduledTime: string;
}

interface ContentTypeData {
  name: string;
  count: number;
  color: string;
  [key: string]: string | number;
}

const kpiMetrics: KPIMetric[] = [
  { id: 'campaigns', label: 'Active Campaigns', value: '12', change: '+3', icon: <Megaphone size={20} /> },
  { id: 'reach', label: 'Total Reach', value: '2.4M', change: '+18%', icon: <Users size={20} /> },
  { id: 'engagement', label: 'Engagement Rate', value: '4.8%', change: '+0.6%', icon: <TrendingUp size={20} /> },
  { id: 'conversion', label: 'Conversion Rate', value: '3.2%', change: '+0.3%', icon: <Target size={20} /> },
  { id: 'roi', label: 'Marketing ROI', value: '324%', change: '+28%', icon: <DollarSign size={20} /> },
];

const campaigns: Campaign[] = [
  { id: '1', name: 'Holiday Sale 2025', channel: 'Email', status: 'Active', budget: 15000, spend: 8420, impressions: 245000, clicks: 12800, conversions: 892 },
  { id: '2', name: 'New Year Wellness', channel: 'Social', status: 'Active', budget: 25000, spend: 18900, impressions: 1200000, clicks: 45600, conversions: 2340 },
  { id: '3', name: 'Google Search - Smoothies', channel: 'Paid', status: 'Active', budget: 30000, spend: 22150, impressions: 890000, clicks: 34200, conversions: 1890 },
  { id: '4', name: 'Instagram Stories', channel: 'Social', status: 'Active', budget: 20000, spend: 12400, impressions: 980000, clicks: 28900, conversions: 1456 },
  { id: '5', name: 'TikTok Challenge', channel: 'Social', status: 'Paused', budget: 18000, spend: 9200, impressions: 750000, clicks: 42000, conversions: 1280 },
  { id: '6', name: 'Email - Welcome Series', channel: 'Email', status: 'Completed', budget: 5000, spend: 4800, impressions: 125000, clicks: 8900, conversions: 567 },
];

const channelData: ChannelData[] = [
  { channel: 'Email', clicks: 21700, ctr: 5.86, convRate: 6.72, color: '#8B5CF6' },
  { channel: 'Instagram', clicks: 52400, ctr: 3.61, convRate: 5.11, color: '#EC4899' },
  { channel: 'TikTok', clicks: 38200, ctr: 4.29, convRate: 5.03, color: '#06B6D4' },
  { channel: 'Facebook', clicks: 24800, ctr: 3.44, convRate: 5.40, color: '#3B82F6' },
  { channel: 'Google Ads', clicks: 42100, ctr: 4.30, convRate: 5.82, color: NEON_GREEN },
];

const emailTrendData = [
  { week: 'Week 1', openRate: 38.2, clickRate: 10.4 },
  { week: 'Week 2', openRate: 41.5, clickRate: 12.8 },
  { week: 'Week 3', openRate: 39.8, clickRate: 11.2 },
  { week: 'Week 4', openRate: 44.2, clickRate: 15.5 },
];

const emailCampaigns: EmailCampaign[] = [
  { id: '1', subject: 'Holiday Flash Sale - 40% Off Everything!', sent: 85420, opened: 32640, clicked: 8920, converted: 567 },
  { id: '2', subject: 'Your Weekly Wellness Digest', sent: 124500, opened: 48960, clicked: 12340, converted: 892 },
  { id: '3', subject: 'New Flavors Just Dropped', sent: 98200, opened: 41580, clicked: 15670, converted: 1234 },
  { id: '4', subject: 'Member Exclusive: Early Access Sale', sent: 45600, opened: 22800, clicked: 6840, converted: 456 },
];

const socialPlatforms: SocialPlatform[] = [
  { id: '1', name: 'Instagram', icon: <Instagram size={24} />, followers: '248K', engagement: '4.2%', recentPosts: 12, color: '#EC4899' },
  { id: '2', name: 'TikTok', icon: <PlayCircle size={24} />, followers: '182K', engagement: '6.8%', recentPosts: 8, color: '#06B6D4' },
  { id: '3', name: 'Facebook', icon: <Facebook size={24} />, followers: '156K', engagement: '2.1%', recentPosts: 6, color: '#3B82F6' },
];

const scheduledContent: ScheduledContent[] = [
  { id: '1', title: 'New Year Wellness Goals Carousel', type: 'Post', platform: 'Instagram', scheduledDate: 'Dec 11', scheduledTime: '9:00 AM' },
  { id: '2', title: 'Flash Sale Announcement', type: 'Story', platform: 'Instagram', scheduledDate: 'Dec 11', scheduledTime: '2:00 PM' },
  { id: '3', title: 'Weekly Newsletter - Issue #48', type: 'Email', platform: 'Email', scheduledDate: 'Dec 12', scheduledTime: '8:00 AM' },
  { id: '4', title: 'Holiday Bundle Promo', type: 'Ad', platform: 'Facebook', scheduledDate: 'Dec 12', scheduledTime: '10:00 AM' },
  { id: '5', title: 'Recipe Tutorial: Winter Smoothie', type: 'Post', platform: 'TikTok', scheduledDate: 'Dec 13', scheduledTime: '6:00 PM' },
  { id: '6', title: 'Customer Testimonial Video', type: 'Story', platform: 'Instagram', scheduledDate: 'Dec 14', scheduledTime: '11:00 AM' },
  { id: '7', title: 'Year-End Sale Reminder', type: 'Email', platform: 'Email', scheduledDate: 'Dec 15', scheduledTime: '9:00 AM' },
];

const contentTypeData: ContentTypeData[] = [
  { name: 'Posts', count: 24, color: NEON_GREEN },
  { name: 'Stories', count: 18, color: '#EC4899' },
  { name: 'Emails', count: 8, color: '#8B5CF6' },
  { name: 'Ads', count: 6, color: '#3B82F6' },
];

const quickActions = [
  { label: 'Create Campaign', icon: <Plus size={16} /> },
  { label: 'Schedule Post', icon: <Calendar size={16} /> },
  { label: 'Send Newsletter', icon: <Send size={16} /> },
  { label: 'View Reports', icon: <BarChart3 size={16} /> },
];

function KPICard({ metric }: { metric: KPIMetric }) {
  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiIcon}>{metric.icon}</div>
      <div style={styles.kpiContent}>
        <span style={styles.kpiLabel}>{metric.label}</span>
        <div style={styles.kpiValueRow}>
          <span style={styles.kpiValue}>{metric.value}</span>
          <span style={styles.kpiChange}>
            <ArrowUpRight size={14} />
            {metric.change}
          </span>
        </div>
      </div>
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = (campaign.spend / campaign.budget) * 100;
  const statusColors: Record<string, string> = {
    Active: NEON_GREEN,
    Paused: '#F59E0B',
    Completed: '#8B5CF6',
  };
  const channelColors: Record<string, string> = {
    Email: '#8B5CF6',
    Social: '#EC4899',
    Paid: '#3B82F6',
  };

  return (
    <div style={styles.campaignCard}>
      <div style={styles.campaignHeader}>
        <h4 style={styles.campaignName}>{campaign.name}</h4>
        <div style={styles.campaignTags}>
          <span style={{ ...styles.tag, background: `${channelColors[campaign.channel]}20`, color: channelColors[campaign.channel] }}>
            {campaign.channel}
          </span>
          <span style={{ ...styles.tag, background: `${statusColors[campaign.status]}20`, color: statusColors[campaign.status] }}>
            {campaign.status}
          </span>
        </div>
      </div>
      <div style={styles.campaignStats}>
        <div style={styles.campaignStat}>
          <Eye size={14} style={{ opacity: 0.5 }} />
          <span>{(campaign.impressions / 1000).toFixed(0)}K</span>
        </div>
        <div style={styles.campaignStat}>
          <MousePointerClick size={14} style={{ opacity: 0.5 }} />
          <span>{(campaign.clicks / 1000).toFixed(1)}K</span>
        </div>
        <div style={styles.campaignStat}>
          <Target size={14} style={{ opacity: 0.5 }} />
          <span>{campaign.conversions}</span>
        </div>
      </div>
      <div style={styles.campaignBudget}>
        <div style={styles.budgetText}>
          <span>Budget: ${campaign.spend.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
          <span style={{ color: NEON_GREEN }}>{progress.toFixed(0)}%</span>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

function SocialPlatformCard({ platform }: { platform: SocialPlatform }) {
  return (
    <div style={styles.platformCard}>
      <div style={{ ...styles.platformIcon, color: platform.color }}>{platform.icon}</div>
      <div style={styles.platformContent}>
        <h4 style={styles.platformName}>{platform.name}</h4>
        <div style={styles.platformStats}>
          <div style={styles.platformStat}>
            <span style={styles.statValue}>{platform.followers}</span>
            <span style={styles.statLabel}>Followers</span>
          </div>
          <div style={styles.platformStat}>
            <span style={styles.statValue}>{platform.engagement}</span>
            <span style={styles.statLabel}>Engagement</span>
          </div>
          <div style={styles.platformStat}>
            <span style={styles.statValue}>{platform.recentPosts}</span>
            <span style={styles.statLabel}>Recent Posts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketingPage() {
  return (
    <CommandCenterLayout title="Marketing">
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.iconWrapper}>
            <Megaphone size={24} color={NEON_GREEN} />
          </div>
          <div>
            <h1 style={styles.title}>Marketing</h1>
            <p style={styles.subtitle}>Campaigns, content, and performance tracking</p>
          </div>
        </header>

        <div style={styles.quickActionsRow}>
          {quickActions.map((action) => (
            <button key={action.label} style={styles.quickActionBtn}>
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Marketing KPIs</h3>
          <div style={styles.kpiGrid}>
            {kpiMetrics.map((metric) => (
              <KPICard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Active Campaigns</h3>
            <button style={styles.viewAllBtn}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div style={styles.campaignsGrid}>
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        <div style={styles.twoColumnGrid}>
          <section style={styles.card}>
            <h3 style={styles.cardTitle}>Channel Performance</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={channelData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="channel" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} width={80} />
                <Tooltip
                  contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                  formatter={(value: number) => [value.toLocaleString(), 'Clicks']}
                />
                <Bar dataKey="clicks" name="Clicks" fill={NEON_GREEN} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={styles.channelTable}>
              <div style={styles.channelTableHeader}>
                <span>Channel</span>
                <span>CTR</span>
                <span>Conv. Rate</span>
              </div>
              {channelData.map((ch) => (
                <div key={ch.channel} style={styles.channelTableRow}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: ch.color }} />
                    {ch.channel}
                  </span>
                  <span>{ch.ctr.toFixed(2)}%</span>
                  <span style={{ color: NEON_GREEN }}>{ch.convRate.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </section>

          <section style={styles.card}>
            <h3 style={styles.cardTitle}>Email Marketing</h3>
            <p style={styles.cardSubtext}>Open Rate and Click Rate Trends (4 Weeks)</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={emailTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="openRate" name="Open Rate" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }} />
                <Line type="monotone" dataKey="clickRate" name="Click Rate" stroke={NEON_GREEN} strokeWidth={2} dot={{ fill: NEON_GREEN }} />
              </LineChart>
            </ResponsiveContainer>
            <div style={styles.emailTable}>
              <div style={styles.emailTableHeader}>
                <span style={{ flex: 2 }}>Subject</span>
                <span>Sent</span>
                <span>Opened</span>
                <span>Clicked</span>
                <span>Conv.</span>
              </div>
              {emailCampaigns.map((email) => (
                <div key={email.id} style={styles.emailTableRow}>
                  <span style={{ flex: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email.subject}</span>
                  <span>{(email.sent / 1000).toFixed(0)}K</span>
                  <span>{((email.opened / email.sent) * 100).toFixed(0)}%</span>
                  <span>{((email.clicked / email.sent) * 100).toFixed(1)}%</span>
                  <span style={{ color: NEON_GREEN }}>{email.converted}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Social Media Overview</h3>
          <div style={styles.socialGrid}>
            {socialPlatforms.map((platform) => (
              <SocialPlatformCard key={platform.id} platform={platform} />
            ))}
          </div>
        </section>

        <div style={styles.twoColumnGrid}>
          <section style={styles.card}>
            <h3 style={styles.cardTitle}>Content Calendar</h3>
            <p style={styles.cardSubtext}>Scheduled content for the next 7 days</p>
            <div style={styles.calendarList}>
              {scheduledContent.map((content) => {
                const typeIcons: Record<string, React.ReactNode> = {
                  Post: <Image size={14} />,
                  Story: <PlayCircle size={14} />,
                  Email: <Mail size={14} />,
                  Ad: <Megaphone size={14} />,
                };
                const typeColors: Record<string, string> = {
                  Post: NEON_GREEN,
                  Story: '#EC4899',
                  Email: '#8B5CF6',
                  Ad: '#3B82F6',
                };
                return (
                  <div key={content.id} style={styles.calendarItem}>
                    <div style={styles.calendarDate}>
                      <span style={styles.calendarDay}>{content.scheduledDate}</span>
                      <span style={styles.calendarTime}>{content.scheduledTime}</span>
                    </div>
                    <div style={styles.calendarContent}>
                      <span style={{ ...styles.calendarType, background: `${typeColors[content.type]}20`, color: typeColors[content.type] }}>
                        {typeIcons[content.type]} {content.type}
                      </span>
                      <span style={styles.calendarTitle}>{content.title}</span>
                      <span style={styles.calendarPlatform}>{content.platform}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section style={styles.card}>
            <h3 style={styles.cardTitle}>Content Type Breakdown</h3>
            <p style={styles.cardSubtext}>Distribution of content this month</p>
            <div style={styles.pieContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="count"
                    strokeWidth={0}
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={styles.pieLegend}>
                {contentTypeData.map((item) => (
                  <div key={item.name} style={styles.pieLegendItem}>
                    <span style={{ ...styles.pieLegendDot, background: item.color }} />
                    <span>{item.name}</span>
                    <span style={styles.pieLegendCount}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.totalContent}>
              <span style={styles.totalLabel}>Total Scheduled</span>
              <span style={styles.totalValue}>{contentTypeData.reduce((sum, item) => sum + item.count, 0)} pieces</span>
            </div>
          </section>
        </div>
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
  quickActionsRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 32,
    flexWrap: 'wrap' as const,
  },
  quickActionBtn: {
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
    transition: 'all 0.2s',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    marginBottom: 16,
  },
  viewAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'transparent',
    border: 'none',
    color: NEON_GREEN,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
  },
  kpiCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 20,
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  kpiIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 10,
    background: `${NEON_GREEN}15`,
    color: NEON_GREEN,
  },
  kpiContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
  },
  kpiLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  kpiValueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
  },
  kpiChange: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    fontSize: 12,
    fontWeight: 500,
    color: NEON_GREEN,
  },
  campaignsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },
  campaignCard: {
    padding: 20,
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  campaignHeader: {
    marginBottom: 16,
  },
  campaignName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    marginBottom: 8,
  },
  campaignTags: {
    display: 'flex',
    gap: 8,
  },
  tag: {
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 500,
  },
  campaignStats: {
    display: 'flex',
    gap: 16,
    marginBottom: 16,
  },
  campaignStat: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  campaignBudget: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: 12,
  },
  budgetText: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${NEON_GREEN}, #00CC6A)`,
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24,
    marginBottom: 32,
  },
  card: {
    padding: 24,
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    marginBottom: 8,
  },
  cardSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
    marginBottom: 16,
  },
  channelTable: {
    marginTop: 16,
  },
  channelTableHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 80px 100px',
    padding: '8px 0',
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  channelTableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 80px 100px',
    padding: '10px 0',
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  emailTable: {
    marginTop: 16,
  },
  emailTableHeader: {
    display: 'flex',
    gap: 16,
    padding: '8px 0',
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  emailTableRow: {
    display: 'flex',
    gap: 16,
    padding: '10px 0',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  socialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },
  platformCard: {
    display: 'flex',
    gap: 16,
    padding: 20,
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  platformIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.05)',
  },
  platformContent: {
    flex: 1,
  },
  platformName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    marginBottom: 12,
  },
  platformStats: {
    display: 'flex',
    gap: 20,
  },
  platformStat: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  calendarList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
    maxHeight: 360,
    overflowY: 'auto' as const,
  },
  calendarItem: {
    display: 'flex',
    gap: 16,
    padding: 12,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.04)',
  },
  calendarDate: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
  },
  calendarDay: {
    fontSize: 12,
    fontWeight: 600,
    color: '#fff',
  },
  calendarTime: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  calendarContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
  },
  calendarType: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 8px',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 500,
    width: 'fit-content',
  },
  calendarTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#fff',
  },
  calendarPlatform: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  pieContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
  },
  pieLegend: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  pieLegendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  pieLegendDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
  pieLegendCount: {
    marginLeft: 'auto',
    fontWeight: 600,
    color: '#fff',
  },
  totalContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  totalLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 700,
    color: NEON_GREEN,
  },
};
