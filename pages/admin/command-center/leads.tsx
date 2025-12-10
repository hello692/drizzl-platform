import React, { useState, useEffect, useCallback } from 'react';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
import {
  Users,
  Target,
  TrendingUp,
  Clock,
  DollarSign,
  Calendar,
  Plus,
  Upload,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  X,
  Phone,
  Mail,
  Building2,
  User,
  Globe,
  MessageSquare,
  Video,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Flame,
  Thermometer,
  Snowflake,
  ExternalLink,
  MoreHorizontal,
  Activity,
  Send,
  PhoneCall,
  CalendarPlus,
  StickyNote,
  GripVertical,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

type PipelineStage = 'new' | 'contacted' | 'qualified' | 'demo' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

interface Lead {
  id: string;
  lead_number?: string;
  company_name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  source: string;
  pipeline_stage: PipelineStage;
  score: number;
  assigned_to?: string;
  assigned_user?: { id: string; name: string; email: string };
  notes?: string;
  estimated_value?: number;
  probability?: number;
  expected_close_date?: string;
  last_contacted_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  subject?: string;
  description?: string;
  outcome?: string;
  performed_by?: string;
  created_at: string;
}

const PIPELINE_STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'new', label: 'New', color: '#6366f1' },
  { id: 'contacted', label: 'Contacted', color: '#8b5cf6' },
  { id: 'qualified', label: 'Qualified', color: '#06b6d4' },
  { id: 'demo', label: 'Demo', color: '#14b8a6' },
  { id: 'proposal', label: 'Proposal', color: '#f59e0b' },
  { id: 'negotiation', label: 'Negotiation', color: '#ec4899' },
  { id: 'closed_won', label: 'Closed Won', color: '#22c55e' },
  { id: 'closed_lost', label: 'Closed Lost', color: '#ef4444' },
];

const SOURCES = ['Website', 'Referral', 'Cold Outreach', 'Trade Show', 'LinkedIn', 'Email Campaign', 'Other'];

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    lead_number: 'L-001',
    company_name: 'Whole Foods Market',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sjohnson@wholefoods.com',
    phone: '+1 (512) 477-4455',
    source: 'Trade Show',
    pipeline_stage: 'negotiation',
    score: 92,
    estimated_value: 245000,
    probability: 75,
    expected_close_date: '2025-01-15',
    last_contacted_at: '2024-12-08T14:30:00Z',
    created_at: '2024-11-15T10:00:00Z',
    updated_at: '2024-12-08T14:30:00Z',
  },
  {
    id: '2',
    lead_number: 'L-002',
    company_name: 'Sprouts Farmers Market',
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'mchen@sprouts.com',
    phone: '+1 (480) 814-8016',
    source: 'Referral',
    pipeline_stage: 'proposal',
    score: 78,
    estimated_value: 180000,
    probability: 60,
    expected_close_date: '2025-01-30',
    last_contacted_at: '2024-12-07T11:00:00Z',
    created_at: '2024-11-20T09:00:00Z',
    updated_at: '2024-12-07T11:00:00Z',
  },
  {
    id: '3',
    lead_number: 'L-003',
    company_name: 'Target Corporation',
    first_name: 'Emily',
    last_name: 'Rodriguez',
    email: 'erodriguez@target.com',
    phone: '+1 (612) 304-6073',
    source: 'Cold Outreach',
    pipeline_stage: 'qualified',
    score: 65,
    estimated_value: 420000,
    probability: 40,
    expected_close_date: '2025-03-01',
    last_contacted_at: '2024-12-05T16:00:00Z',
    created_at: '2024-11-25T14:00:00Z',
    updated_at: '2024-12-05T16:00:00Z',
  },
  {
    id: '4',
    lead_number: 'L-004',
    company_name: 'Fresh Thyme Market',
    first_name: 'David',
    last_name: 'Williams',
    email: 'dwilliams@freshthyme.com',
    phone: '+1 (312) 555-0198',
    source: 'Website',
    pipeline_stage: 'contacted',
    score: 45,
    estimated_value: 95000,
    probability: 25,
    expected_close_date: '2025-02-15',
    last_contacted_at: '2024-12-06T10:00:00Z',
    created_at: '2024-12-01T08:00:00Z',
    updated_at: '2024-12-06T10:00:00Z',
  },
  {
    id: '5',
    lead_number: 'L-005',
    company_name: "Trader Joe's",
    first_name: 'Jessica',
    last_name: 'Martinez',
    email: 'jmartinez@traderjoes.com',
    phone: '+1 (626) 599-3700',
    source: 'LinkedIn',
    pipeline_stage: 'demo',
    score: 72,
    estimated_value: 320000,
    probability: 50,
    expected_close_date: '2025-02-01',
    last_contacted_at: '2024-12-09T09:00:00Z',
    created_at: '2024-11-28T11:00:00Z',
    updated_at: '2024-12-09T09:00:00Z',
  },
  {
    id: '6',
    lead_number: 'L-006',
    company_name: 'Costco Wholesale',
    first_name: 'Robert',
    last_name: 'Brown',
    email: 'rbrown@costco.com',
    phone: '+1 (425) 313-8100',
    source: 'Trade Show',
    pipeline_stage: 'new',
    score: 55,
    estimated_value: 650000,
    probability: 20,
    expected_close_date: '2025-04-01',
    created_at: '2024-12-08T15:00:00Z',
    updated_at: '2024-12-08T15:00:00Z',
  },
  {
    id: '7',
    lead_number: 'L-007',
    company_name: 'Publix Super Markets',
    first_name: 'Amanda',
    last_name: 'Taylor',
    email: 'ataylor@publix.com',
    phone: '+1 (863) 688-1188',
    source: 'Email Campaign',
    pipeline_stage: 'closed_won',
    score: 95,
    estimated_value: 275000,
    probability: 100,
    expected_close_date: '2024-12-01',
    last_contacted_at: '2024-12-01T14:00:00Z',
    created_at: '2024-10-15T10:00:00Z',
    updated_at: '2024-12-01T14:00:00Z',
  },
  {
    id: '8',
    lead_number: 'L-008',
    company_name: 'Kroger Co.',
    first_name: 'James',
    last_name: 'Wilson',
    email: 'jwilson@kroger.com',
    phone: '+1 (513) 762-4000',
    source: 'Referral',
    pipeline_stage: 'closed_lost',
    score: 35,
    estimated_value: 380000,
    probability: 0,
    last_contacted_at: '2024-11-28T10:00:00Z',
    created_at: '2024-10-20T09:00:00Z',
    updated_at: '2024-11-28T10:00:00Z',
  },
];

const MOCK_ACTIVITIES: LeadActivity[] = [
  { id: '1', lead_id: '1', activity_type: 'email', subject: 'Follow-up on proposal', description: 'Sent revised pricing proposal with volume discounts', created_at: '2024-12-08T14:30:00Z' },
  { id: '2', lead_id: '1', activity_type: 'call', subject: 'Pricing Discussion', description: 'Discussed Q1 rollout timeline and logistics requirements', outcome: 'Positive', created_at: '2024-12-06T11:00:00Z' },
  { id: '3', lead_id: '1', activity_type: 'meeting', subject: 'Product Demo', description: 'Virtual demo of full product line with buyer team', created_at: '2024-12-01T15:00:00Z' },
  { id: '4', lead_id: '1', activity_type: 'note', subject: 'Research', description: 'Contact prefers email communication. Decision expected by mid-January.', created_at: '2024-11-20T10:00:00Z' },
];

function getScoreBadge(score: number): { label: string; color: string; icon: React.ReactNode } {
  if (score >= 70) return { label: 'Hot', color: '#ef4444', icon: <Flame size={12} /> };
  if (score >= 40) return { label: 'Warm', color: '#f59e0b', icon: <Thermometer size={12} /> };
  return { label: 'Cold', color: '#60a5fa', icon: <Snowflake size={12} /> };
}

function getStageColor(stage: PipelineStage): string {
  return PIPELINE_STAGES.find(s => s.id === stage)?.color || '#666';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateString);
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
}

function getDaysInStage(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'email': return <Mail size={14} />;
    case 'call': return <PhoneCall size={14} />;
    case 'meeting': return <Video size={14} />;
    case 'note': return <StickyNote size={14} />;
    default: return <Activity size={14} />;
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'pipeline'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [activityType, setActivityType] = useState<string>('call');

  const [newLead, setNewLead] = useState({
    company_name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    source: 'Website',
    estimated_value: '',
    notes: '',
  });

  const [newActivity, setNewActivity] = useState({
    subject: '',
    description: '',
    outcome: '',
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        setLeads(data as Lead[]);
      } else {
        setLeads(MOCK_LEADS);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      setLeads(MOCK_LEADS);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActivities = useCallback(async (leadId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('lead_activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        setActivities(data as LeadActivity[]);
      } else {
        setActivities(MOCK_ACTIVITIES.filter(a => a.lead_id === leadId));
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setActivities(MOCK_ACTIVITIES.filter(a => a.lead_id === leadId));
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchQuery === '' ||
      lead.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = stageFilter === 'all' || lead.pipeline_stage === stageFilter;

    let matchesScore = true;
    if (scoreFilter === 'hot') matchesScore = lead.score >= 70;
    else if (scoreFilter === 'warm') matchesScore = lead.score >= 40 && lead.score < 70;
    else if (scoreFilter === 'cold') matchesScore = lead.score < 40;

    return matchesSearch && matchesStage && matchesScore;
  });

  const stats = {
    total: leads.length,
    qualified: leads.filter(l => ['qualified', 'demo', 'proposal', 'negotiation', 'closed_won'].includes(l.pipeline_stage)).length,
    conversionRate: leads.length > 0 ? Math.round((leads.filter(l => l.pipeline_stage === 'closed_won').length / leads.length) * 100) : 0,
    avgDaysToClose: 45,
    pipelineValue: leads.filter(l => !['closed_won', 'closed_lost'].includes(l.pipeline_stage)).reduce((sum, l) => sum + (l.estimated_value || 0), 0),
    thisMonthNew: leads.filter(l => new Date(l.created_at) >= new Date(new Date().setDate(1))).length,
    thisMonthClosed: leads.filter(l => l.pipeline_stage === 'closed_won' && new Date(l.updated_at) >= new Date(new Date().setDate(1))).length,
  };

  const handleAddLead = async () => {
    try {
      const leadData = {
        company_name: newLead.company_name,
        first_name: newLead.first_name,
        last_name: newLead.last_name,
        email: newLead.email,
        phone: newLead.phone,
        source: newLead.source,
        estimated_value: newLead.estimated_value ? parseInt(newLead.estimated_value) : 0,
        notes: newLead.notes,
        pipeline_stage: 'new' as PipelineStage,
        score: 50,
      };

      const { data, error: insertError } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

      if (insertError) throw insertError;

      if (data) {
        setLeads([data as Lead, ...leads]);
      } else {
        const mockLead: Lead = {
          id: Date.now().toString(),
          lead_number: `L-${String(leads.length + 1).padStart(3, '0')}`,
          ...leadData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setLeads([mockLead, ...leads]);
      }

      setShowAddModal(false);
      setNewLead({
        company_name: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        source: 'Website',
        estimated_value: '',
        notes: '',
      });
    } catch (err) {
      console.error('Error adding lead:', err);
      const mockLead: Lead = {
        id: Date.now().toString(),
        lead_number: `L-${String(leads.length + 1).padStart(3, '0')}`,
        company_name: newLead.company_name,
        first_name: newLead.first_name,
        last_name: newLead.last_name,
        email: newLead.email,
        phone: newLead.phone,
        source: newLead.source,
        estimated_value: newLead.estimated_value ? parseInt(newLead.estimated_value) : 0,
        notes: newLead.notes,
        pipeline_stage: 'new',
        score: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLeads([mockLead, ...leads]);
      setShowAddModal(false);
      setNewLead({
        company_name: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        source: 'Website',
        estimated_value: '',
        notes: '',
      });
    }
  };

  const handleUpdateStage = async (leadId: string, newStage: PipelineStage) => {
    try {
      await supabase
        .from('leads')
        .update({ pipeline_stage: newStage, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      setLeads(leads.map(l => l.id === leadId ? { ...l, pipeline_stage: newStage, updated_at: new Date().toISOString() } : l));
    } catch (err) {
      console.error('Error updating stage:', err);
      setLeads(leads.map(l => l.id === leadId ? { ...l, pipeline_stage: newStage, updated_at: new Date().toISOString() } : l));
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      await supabase.from('leads').delete().eq('id', leadId);
      setLeads(leads.filter(l => l.id !== leadId));
    } catch (err) {
      console.error('Error deleting lead:', err);
      setLeads(leads.filter(l => l.id !== leadId));
    }
  };

  const handleAddActivity = async () => {
    if (!selectedLead) return;

    try {
      const activityData = {
        lead_id: selectedLead.id,
        activity_type: activityType,
        subject: newActivity.subject,
        description: newActivity.description,
        outcome: newActivity.outcome,
      };

      const { data, error: insertError } = await supabase
        .from('lead_activities')
        .insert(activityData)
        .select()
        .single();

      if (insertError) throw insertError;

      if (data) {
        setActivities([data as LeadActivity, ...activities]);
      } else {
        const mockActivity: LeadActivity = {
          id: Date.now().toString(),
          ...activityData,
          created_at: new Date().toISOString(),
        };
        setActivities([mockActivity, ...activities]);
      }

      setShowActivityModal(false);
      setNewActivity({ subject: '', description: '', outcome: '' });
    } catch (err) {
      console.error('Error adding activity:', err);
      const mockActivity: LeadActivity = {
        id: Date.now().toString(),
        lead_id: selectedLead.id,
        activity_type: activityType,
        subject: newActivity.subject,
        description: newActivity.description,
        outcome: newActivity.outcome,
        created_at: new Date().toISOString(),
      };
      setActivities([mockActivity, ...activities]);
      setShowActivityModal(false);
      setNewActivity({ subject: '', description: '', outcome: '' });
    }
  };

  const openLeadDetail = (lead: Lead) => {
    setSelectedLead(lead);
    fetchActivities(lead.id);
    setShowDetailModal(true);
  };

  const leadsByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = filteredLeads.filter(l => l.pipeline_stage === stage.id);
    return acc;
  }, {} as Record<PipelineStage, Lead[]>);

  return (
    <CommandCenterLayout title="Leads CRM">
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>LEADS MANAGEMENT</h1>
            <p style={styles.subtitle}>B2B Sales Pipeline & Partner Acquisition</p>
          </div>
          <div style={styles.headerActions}>
            <div style={styles.viewToggle}>
              <button
                onClick={() => setViewMode('table')}
                style={{
                  ...styles.toggleBtn,
                  ...(viewMode === 'table' ? styles.toggleBtnActive : {}),
                }}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('pipeline')}
                style={{
                  ...styles.toggleBtn,
                  ...(viewMode === 'pipeline' ? styles.toggleBtnActive : {}),
                }}
              >
                Pipeline
              </button>
            </div>
            <button style={styles.importBtn} onClick={() => alert('CSV Import coming soon!')}>
              <Upload size={16} />
              Import CSV
            </button>
            <button style={styles.addBtn} onClick={() => setShowAddModal(true)}>
              <Plus size={16} />
              Add Lead
            </button>
          </div>
        </header>

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: 'rgba(99, 102, 241, 0.15)' }}>
              <Users size={20} color="#6366f1" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Total Leads</span>
              <span style={styles.statValue}>{stats.total}</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: 'rgba(6, 182, 212, 0.15)' }}>
              <Target size={20} color="#06b6d4" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Qualified</span>
              <span style={styles.statValue}>{stats.qualified}</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: 'rgba(34, 197, 94, 0.15)' }}>
              <TrendingUp size={20} color="#22c55e" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Conversion Rate</span>
              <span style={styles.statValue}>{stats.conversionRate}%</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
              <Clock size={20} color="#f59e0b" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Avg Days to Close</span>
              <span style={styles.statValue}>{stats.avgDaysToClose}</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: 'rgba(0, 255, 133, 0.15)' }}>
              <DollarSign size={20} color={NEON_GREEN} />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Pipeline Value</span>
              <span style={styles.statValue}>{formatCurrency(stats.pipelineValue)}</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: 'rgba(236, 72, 153, 0.15)' }}>
              <Calendar size={20} color="#ec4899" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>This Month</span>
              <span style={styles.statValue}>{stats.thisMonthNew} new / {stats.thisMonthClosed} closed</span>
            </div>
          </div>
        </section>

        <section style={styles.filtersSection}>
          <div style={styles.searchBox}>
            <Search size={18} color="rgba(255,255,255,0.4)" />
            <input
              type="text"
              placeholder="Search by company or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.filterGroup}>
            <Filter size={16} color="rgba(255,255,255,0.5)" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Stages</option>
              {PIPELINE_STAGES.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.label}</option>
              ))}
            </select>
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Scores</option>
              <option value="hot">🔥 Hot (70+)</option>
              <option value="warm">🌡️ Warm (40-69)</option>
              <option value="cold">❄️ Cold (&lt;40)</option>
            </select>
          </div>
        </section>

        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner} />
            <p>Loading leads...</p>
          </div>
        ) : viewMode === 'table' ? (
          <section style={styles.tableCard}>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Company</th>
                    <th style={styles.th}>Contact</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Source</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Score</th>
                    <th style={styles.th}>Value</th>
                    <th style={styles.th}>Last Activity</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => {
                    const scoreBadge = getScoreBadge(lead.score);
                    return (
                      <tr key={lead.id} style={styles.tr}>
                        <td style={styles.td}>
                          <button
                            onClick={() => openLeadDetail(lead)}
                            style={styles.companyLink}
                          >
                            <Building2 size={14} />
                            {lead.company_name}
                          </button>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.contactName}>
                            {lead.first_name} {lead.last_name}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.emailText}>{lead.email}</span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.sourceBadge}>{lead.source}</span>
                        </td>
                        <td style={styles.td}>
                          <select
                            value={lead.pipeline_stage}
                            onChange={(e) => handleUpdateStage(lead.id, e.target.value as PipelineStage)}
                            style={{
                              ...styles.stageSelect,
                              borderColor: getStageColor(lead.pipeline_stage),
                              color: getStageColor(lead.pipeline_stage),
                            }}
                          >
                            {PIPELINE_STAGES.map(stage => (
                              <option key={stage.id} value={stage.id}>{stage.label}</option>
                            ))}
                          </select>
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.scoreBadge,
                            backgroundColor: `${scoreBadge.color}20`,
                            color: scoreBadge.color,
                          }}>
                            {scoreBadge.icon}
                            {lead.score} - {scoreBadge.label}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.valueText}>
                            {lead.estimated_value ? formatCurrency(lead.estimated_value) : '-'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.dateText}>
                            {lead.last_contacted_at ? formatRelativeDate(lead.last_contacted_at) : 'Never'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionBtns}>
                            <button
                              onClick={() => openLeadDetail(lead)}
                              style={styles.actionBtn}
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => openLeadDetail(lead)}
                              style={styles.actionBtn}
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              style={{ ...styles.actionBtn, color: '#ef4444' }}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section style={styles.pipelineSection}>
            <div style={styles.pipelineContainer}>
              {PIPELINE_STAGES.map((stage) => (
                <div key={stage.id} style={styles.pipelineColumn}>
                  <div style={styles.pipelineHeader}>
                    <span style={{ ...styles.pipelineTitle, color: stage.color }}>{stage.label}</span>
                    <span style={styles.pipelineCount}>{leadsByStage[stage.id]?.length || 0}</span>
                  </div>
                  <div style={styles.pipelineCards}>
                    {leadsByStage[stage.id]?.map((lead) => {
                      const scoreBadge = getScoreBadge(lead.score);
                      return (
                        <div
                          key={lead.id}
                          style={styles.pipelineCard}
                          onClick={() => openLeadDetail(lead)}
                        >
                          <div style={styles.pipelineCardHeader}>
                            <GripVertical size={14} color="rgba(255,255,255,0.3)" />
                            <span style={styles.pipelineCardCompany}>{lead.company_name}</span>
                          </div>
                          <span style={styles.pipelineCardContact}>
                            {lead.first_name} {lead.last_name}
                          </span>
                          <div style={styles.pipelineCardFooter}>
                            <span style={styles.pipelineCardValue}>
                              {lead.estimated_value ? formatCurrency(lead.estimated_value) : '-'}
                            </span>
                            <span style={{
                              ...styles.pipelineCardScore,
                              backgroundColor: `${scoreBadge.color}20`,
                              color: scoreBadge.color,
                            }}>
                              {scoreBadge.icon}
                              {lead.score}
                            </span>
                          </div>
                          <span style={styles.pipelineCardDays}>
                            {getDaysInStage(lead.created_at)} days in stage
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {showAddModal && (
          <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Add New Lead</h2>
                <button onClick={() => setShowAddModal(false)} style={styles.modalClose}>
                  <X size={20} />
                </button>
              </div>
              <div style={styles.modalBody}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Company Name *</label>
                    <input
                      type="text"
                      value={newLead.company_name}
                      onChange={(e) => setNewLead({ ...newLead, company_name: e.target.value })}
                      style={styles.formInput}
                      placeholder="e.g., Whole Foods Market"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Source</label>
                    <select
                      value={newLead.source}
                      onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                      style={styles.formSelect}
                    >
                      {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>First Name</label>
                    <input
                      type="text"
                      value={newLead.first_name}
                      onChange={(e) => setNewLead({ ...newLead, first_name: e.target.value })}
                      style={styles.formInput}
                      placeholder="Contact first name"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Last Name</label>
                    <input
                      type="text"
                      value={newLead.last_name}
                      onChange={(e) => setNewLead({ ...newLead, last_name: e.target.value })}
                      style={styles.formInput}
                      placeholder="Contact last name"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Email</label>
                    <input
                      type="email"
                      value={newLead.email}
                      onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                      style={styles.formInput}
                      placeholder="email@company.com"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Phone</label>
                    <input
                      type="tel"
                      value={newLead.phone}
                      onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                      style={styles.formInput}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Estimated Value ($)</label>
                    <input
                      type="number"
                      value={newLead.estimated_value}
                      onChange={(e) => setNewLead({ ...newLead, estimated_value: e.target.value })}
                      style={styles.formInput}
                      placeholder="150000"
                    />
                  </div>
                  <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                    <label style={styles.formLabel}>Notes</label>
                    <textarea
                      value={newLead.notes}
                      onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                      style={{ ...styles.formInput, minHeight: 80, resize: 'vertical' }}
                      placeholder="Additional notes about this lead..."
                    />
                  </div>
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button onClick={() => setShowAddModal(false)} style={styles.cancelBtn}>Cancel</button>
                <button
                  onClick={handleAddLead}
                  style={styles.submitBtn}
                  disabled={!newLead.company_name}
                >
                  Add Lead
                </button>
              </div>
            </div>
          </div>
        )}

        {showDetailModal && selectedLead && (
          <div style={styles.modalOverlay} onClick={() => setShowDetailModal(false)}>
            <div style={styles.detailModal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <h2 style={styles.modalTitle}>{selectedLead.company_name}</h2>
                  <span style={styles.leadNumber}>{selectedLead.lead_number}</span>
                </div>
                <button onClick={() => setShowDetailModal(false)} style={styles.modalClose}>
                  <X size={20} />
                </button>
              </div>
              <div style={styles.detailBody}>
                <div style={styles.detailLeft}>
                  <div style={styles.detailSection}>
                    <h3 style={styles.detailSectionTitle}>Contact Information</h3>
                    <div style={styles.detailInfo}>
                      <div style={styles.detailRow}>
                        <User size={14} color="rgba(255,255,255,0.5)" />
                        <span>{selectedLead.first_name} {selectedLead.last_name}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <Mail size={14} color="rgba(255,255,255,0.5)" />
                        <span>{selectedLead.email}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <Phone size={14} color="rgba(255,255,255,0.5)" />
                        <span>{selectedLead.phone}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <Globe size={14} color="rgba(255,255,255,0.5)" />
                        <span>Source: {selectedLead.source}</span>
                      </div>
                    </div>
                  </div>
                  <div style={styles.detailSection}>
                    <h3 style={styles.detailSectionTitle}>Deal Information</h3>
                    <div style={styles.detailInfo}>
                      <div style={styles.detailRow}>
                        <DollarSign size={14} color={NEON_GREEN} />
                        <span>Value: {selectedLead.estimated_value ? formatCurrency(selectedLead.estimated_value) : 'Not set'}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <TrendingUp size={14} color="#f59e0b" />
                        <span>Probability: {selectedLead.probability || 0}%</span>
                      </div>
                      <div style={styles.detailRow}>
                        <Calendar size={14} color="#06b6d4" />
                        <span>Expected Close: {selectedLead.expected_close_date ? formatDate(selectedLead.expected_close_date) : 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                  <div style={styles.detailSection}>
                    <h3 style={styles.detailSectionTitle}>Status</h3>
                    <select
                      value={selectedLead.pipeline_stage}
                      onChange={(e) => {
                        handleUpdateStage(selectedLead.id, e.target.value as PipelineStage);
                        setSelectedLead({ ...selectedLead, pipeline_stage: e.target.value as PipelineStage });
                      }}
                      style={{
                        ...styles.stageSelectLarge,
                        borderColor: getStageColor(selectedLead.pipeline_stage),
                        color: getStageColor(selectedLead.pipeline_stage),
                      }}
                    >
                      {PIPELINE_STAGES.map(stage => (
                        <option key={stage.id} value={stage.id}>{stage.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={styles.detailRight}>
                  <div style={styles.activityHeader}>
                    <h3 style={styles.detailSectionTitle}>Activity Timeline</h3>
                    <button
                      onClick={() => setShowActivityModal(true)}
                      style={styles.addActivityBtn}
                    >
                      <Plus size={14} />
                      Add Activity
                    </button>
                  </div>
                  <div style={styles.activityList}>
                    {activities.length > 0 ? activities.map((activity) => (
                      <div key={activity.id} style={styles.activityItem}>
                        <div style={styles.activityIcon}>
                          {getActivityIcon(activity.activity_type)}
                        </div>
                        <div style={styles.activityContent}>
                          <span style={styles.activitySubject}>{activity.subject}</span>
                          <span style={styles.activityDesc}>{activity.description}</span>
                          <span style={styles.activityDate}>{formatRelativeDate(activity.created_at)}</span>
                        </div>
                      </div>
                    )) : (
                      <p style={styles.noActivities}>No activities recorded yet</p>
                    )}
                  </div>
                </div>
              </div>
              <div style={styles.quickActions}>
                <button onClick={() => { setActivityType('call'); setShowActivityModal(true); }} style={styles.quickActionBtn}>
                  <PhoneCall size={16} />
                  Log Call
                </button>
                <button onClick={() => { setActivityType('email'); setShowActivityModal(true); }} style={styles.quickActionBtn}>
                  <Send size={16} />
                  Send Email
                </button>
                <button onClick={() => { setActivityType('note'); setShowActivityModal(true); }} style={styles.quickActionBtn}>
                  <StickyNote size={16} />
                  Add Note
                </button>
                <button onClick={() => { setActivityType('meeting'); setShowActivityModal(true); }} style={styles.quickActionBtn}>
                  <CalendarPlus size={16} />
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        )}

        {showActivityModal && (
          <div style={styles.modalOverlay} onClick={() => setShowActivityModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {activityType === 'call' && 'Log Call'}
                  {activityType === 'email' && 'Log Email'}
                  {activityType === 'note' && 'Add Note'}
                  {activityType === 'meeting' && 'Schedule Meeting'}
                </h2>
                <button onClick={() => setShowActivityModal(false)} style={styles.modalClose}>
                  <X size={20} />
                </button>
              </div>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Type</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    style={styles.formSelect}
                  >
                    <option value="call">Phone Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                    <option value="note">Note</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Subject *</label>
                  <input
                    type="text"
                    value={newActivity.subject}
                    onChange={(e) => setNewActivity({ ...newActivity, subject: e.target.value })}
                    style={styles.formInput}
                    placeholder="Brief summary..."
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Description</label>
                  <textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    style={{ ...styles.formInput, minHeight: 100, resize: 'vertical' }}
                    placeholder="Details about this activity..."
                  />
                </div>
                {(activityType === 'call' || activityType === 'meeting') && (
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Outcome</label>
                    <select
                      value={newActivity.outcome}
                      onChange={(e) => setNewActivity({ ...newActivity, outcome: e.target.value })}
                      style={styles.formSelect}
                    >
                      <option value="">Select outcome...</option>
                      <option value="positive">Positive</option>
                      <option value="neutral">Neutral</option>
                      <option value="negative">Negative</option>
                      <option value="no_answer">No Answer</option>
                      <option value="left_voicemail">Left Voicemail</option>
                    </select>
                  </div>
                )}
              </div>
              <div style={styles.modalFooter}>
                <button onClick={() => setShowActivityModal(false)} style={styles.cancelBtn}>Cancel</button>
                <button
                  onClick={handleAddActivity}
                  style={styles.submitBtn}
                  disabled={!newActivity.subject}
                >
                  Save Activity
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </CommandCenterLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1600,
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
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    margin: '8px 0 0 0',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  viewToggle: {
    display: 'flex',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 4,
  },
  toggleBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 6,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  toggleBtnActive: {
    backgroundColor: NEON_GREEN,
    color: '#000',
  },
  importBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 8,
    color: '#000',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
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
    borderRadius: 10,
    flexShrink: 0,
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  filtersSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    flex: '1 1 300px',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#FFFFFF',
    fontSize: 14,
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  filterSelect: {
    padding: '10px 16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 13,
    outline: 'none',
    cursor: 'pointer',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    color: 'rgba(255,255,255,0.5)',
    gap: 16,
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: NEON_GREEN,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  tableCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left' as const,
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    borderBottom: `1px solid ${CARD_BORDER}`,
    whiteSpace: 'nowrap' as const,
  },
  tr: {
    borderBottom: `1px solid ${CARD_BORDER}`,
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '14px 16px',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    whiteSpace: 'nowrap' as const,
  },
  companyLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: NEON_GREEN,
    fontWeight: 600,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
  },
  contactName: {
    color: 'rgba(255,255,255,0.9)',
  },
  emailText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  sourceBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: '#818cf8',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
  },
  stageSelect: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: '1px solid',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    outline: 'none',
    cursor: 'pointer',
  },
  scoreBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
  },
  valueText: {
    fontWeight: 600,
    color: NEON_GREEN,
  },
  dateText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  actionBtns: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: 'none',
    borderRadius: 6,
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pipelineSection: {
    marginTop: 24,
  },
  pipelineContainer: {
    display: 'flex',
    gap: 16,
    overflowX: 'auto',
    paddingBottom: 16,
  },
  pipelineColumn: {
    flex: '0 0 280px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 16,
  },
  pipelineHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pipelineTitle: {
    fontSize: 14,
    fontWeight: 600,
  },
  pipelineCount: {
    padding: '4px 10px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
  },
  pipelineCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxHeight: 500,
    overflowY: 'auto',
  },
  pipelineCard: {
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pipelineCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  pipelineCardCompany: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  pipelineCardContact: {
    display: 'block',
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
  },
  pipelineCardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pipelineCardValue: {
    fontSize: 14,
    fontWeight: 600,
    color: NEON_GREEN,
  },
  pipelineCardScore: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
  },
  pipelineCardDays: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: 20,
  },
  modal: {
    backgroundColor: '#111111',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    width: '100%',
    maxWidth: 560,
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  detailModal: {
    backgroundColor: '#111111',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    width: '100%',
    maxWidth: 900,
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
  },
  leadNumber: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
    display: 'block',
  },
  modalClose: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: 'none',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
  },
  modalBody: {
    padding: 24,
    overflowY: 'auto',
    flex: 1,
  },
  detailBody: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    padding: 24,
    overflowY: 'auto',
    flex: 1,
  },
  detailLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  detailRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  detailSection: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 10,
    padding: 16,
  },
  detailSectionTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: 12,
    margin: 0,
  },
  detailInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  stageSelectLarge: {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: 'transparent',
    border: '1px solid',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    outline: 'none',
    cursor: 'pointer',
  },
  activityHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addActivityBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    border: `1px solid ${NEON_GREEN}`,
    borderRadius: 6,
    color: NEON_GREEN,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxHeight: 300,
    overflowY: 'auto',
  },
  activityItem: {
    display: 'flex',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
  },
  activityIcon: {
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: 6,
    color: '#818cf8',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  activitySubject: {
    fontSize: 13,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  activityDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  activityDate: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  noActivities: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center' as const,
    padding: 20,
  },
  quickActions: {
    display: 'flex',
    gap: 12,
    padding: '16px 24px',
    borderTop: `1px solid ${CARD_BORDER}`,
    flexWrap: 'wrap',
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.6)',
  },
  formInput: {
    padding: '10px 14px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
  },
  formSelect: {
    padding: '10px 14px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    cursor: 'pointer',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    padding: '16px 24px',
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 24px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 8,
    color: '#000',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
