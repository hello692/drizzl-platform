import React, { useState, useEffect, useCallback } from 'react';
import { useRequireAdmin } from '../../hooks/useRole';
import AdminLayout from '../../components/AdminLayout';

type PipelineStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

interface Lead {
  id: string;
  lead_number: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
  company_type?: string;
  website?: string;
  source?: string;
  status: string;
  pipeline_stage: PipelineStage;
  assigned_to?: string;
  assigned_user?: { id: string; name: string; email: string };
  score: number;
  tags: string[];
  notes?: string;
  last_contacted_at?: string;
  converted_at?: string;
  converted_to_partner_id?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  subject?: string;
  description?: string;
  outcome?: string;
  performer?: { id: string; name: string };
  scheduled_at?: string;
  completed_at?: string;
  created_at: string;
}

const PIPELINE_STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'new', label: 'New Leads', color: '#6366f1' },
  { id: 'contacted', label: 'Contacted', color: '#8b5cf6' },
  { id: 'qualified', label: 'Qualified', color: '#06b6d4' },
  { id: 'proposal', label: 'Proposal Sent', color: '#f59e0b' },
  { id: 'negotiation', label: 'Negotiation', color: '#ec4899' },
  { id: 'closed_won', label: 'Closed Won', color: '#22c55e' },
  { id: 'closed_lost', label: 'Closed Lost', color: '#ef4444' }
];

const LEAD_SOURCES = [
  'Website', 'Referral', 'LinkedIn', 'Trade Show', 'Cold Call', 'Email Campaign', 'Partner', 'Other'
];

const COMPANY_TYPES = [
  'Retail Store', 'Cafe / Coffee Shop', 'Gym / Fitness', 'Hotel / Hospitality', 
  'Distributor', 'Restaurant', 'Grocery', 'Other'
];

const ACTIVITY_TYPES = [
  { id: 'call', label: 'Call', icon: 'phone' },
  { id: 'email', label: 'Email', icon: 'mail' },
  { id: 'meeting', label: 'Meeting', icon: 'calendar' },
  { id: 'note', label: 'Note', icon: 'note' }
];

const demoLeads: Record<PipelineStage, Lead[]> = {
  new: [
    { id: 'demo-1', lead_number: 'LD-001', first_name: 'Sarah', last_name: 'Chen', email: 'sarah@healthylife.co', phone: '+1 (415) 555-0101', company_name: 'HealthyLife Grocers', company_type: 'Grocery', website: 'healthylife.co', source: 'Website', status: 'active', pipeline_stage: 'new', score: 72, tags: ['high-volume', 'organic'], notes: 'Interested in organic smoothie line', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
    { id: 'demo-2', lead_number: 'LD-002', first_name: 'Mike', last_name: 'Rodriguez', email: 'mike@fitzone.com', phone: '+1 (310) 555-0102', company_name: 'FitZone Gym', company_type: 'Gym / Fitness', website: 'fitzone.com', source: 'LinkedIn', status: 'active', pipeline_stage: 'new', score: 65, tags: ['fitness', 'protein'], notes: 'Looking for protein smoothie options', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
    { id: 'demo-3', lead_number: 'LD-003', first_name: 'Emily', last_name: 'Watson', email: 'emily@sunrise.cafe', phone: '+1 (512) 555-0103', company_name: 'Sunrise Cafe', company_type: 'Cafe / Coffee Shop', website: 'sunrisecafe.com', source: 'Referral', status: 'active', pipeline_stage: 'new', score: 58, tags: ['cafe'], notes: 'Referred by current partner', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
  ],
  contacted: [
    { id: 'demo-4', lead_number: 'LD-004', first_name: 'James', last_name: 'Park', email: 'james@elitehotel.com', phone: '+1 (212) 555-0104', company_name: 'Elite Hotel Group', company_type: 'Hotel / Hospitality', website: 'elitehotel.com', source: 'Trade Show', status: 'active', pipeline_stage: 'contacted', score: 85, tags: ['hospitality', 'premium'], notes: 'Met at wellness expo, very interested', last_contacted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
    { id: 'demo-5', lead_number: 'LD-005', first_name: 'Lisa', last_name: 'Thompson', email: 'lisa@freshmart.com', phone: '+1 (303) 555-0105', company_name: 'FreshMart Stores', company_type: 'Grocery', website: 'freshmart.com', source: 'Cold Call', status: 'active', pipeline_stage: 'contacted', score: 68, tags: ['retail', 'chain'], notes: 'Initial call completed, sending samples', last_contacted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
    { id: 'demo-6', lead_number: 'LD-006', first_name: 'David', last_name: 'Kim', email: 'david@vitasmoothie.com', phone: '+1 (206) 555-0106', company_name: 'Vita Smoothie Bar', company_type: 'Restaurant', website: 'vitasmoothie.com', source: 'Website', status: 'active', pipeline_stage: 'contacted', score: 75, tags: ['smoothie-bar'], notes: 'Expanding to 3 new locations', last_contacted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
  ],
  qualified: [
    { id: 'demo-7', lead_number: 'LD-007', first_name: 'Amanda', last_name: 'Foster', email: 'amanda@wellnessworld.com', phone: '+1 (858) 555-0107', company_name: 'Wellness World', company_type: 'Retail Store', website: 'wellnessworld.com', source: 'Partner', status: 'active', pipeline_stage: 'qualified', score: 92, tags: ['premium', 'chain'], notes: 'Qualified for 50+ store rollout', last_contacted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
    { id: 'demo-8', lead_number: 'LD-008', first_name: 'Robert', last_name: 'Martinez', email: 'robert@powergyms.net', phone: '+1 (720) 555-0108', company_name: 'Power Gyms Network', company_type: 'Gym / Fitness', website: 'powergyms.net', source: 'Referral', status: 'active', pipeline_stage: 'qualified', score: 88, tags: ['fitness', 'network'], notes: '15 locations interested', last_contacted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
    { id: 'demo-9', lead_number: 'LD-009', first_name: 'Jennifer', last_name: 'Lee', email: 'jennifer@organicmarket.com', phone: '+1 (503) 555-0109', company_name: 'Organic Market Co', company_type: 'Grocery', website: 'organicmarket.com', source: 'Trade Show', status: 'active', pipeline_stage: 'qualified', score: 80, tags: ['organic', 'regional'], notes: 'Budget approved, waiting for contract', last_contacted_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
  ],
  proposal: [
    { id: 'demo-10', lead_number: 'LD-010', first_name: 'Michael', last_name: 'Brown', email: 'michael@luxuryresorts.com', phone: '+1 (305) 555-0110', company_name: 'Luxury Resorts Inc', company_type: 'Hotel / Hospitality', website: 'luxuryresorts.com', source: 'Email Campaign', status: 'active', pipeline_stage: 'proposal', score: 95, tags: ['luxury', 'hospitality'], notes: 'Proposal sent for $150K annual contract', last_contacted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
    { id: 'demo-11', lead_number: 'LD-011', first_name: 'Nicole', last_name: 'Davis', email: 'nicole@greenfitness.io', phone: '+1 (415) 555-0111', company_name: 'Green Fitness Studios', company_type: 'Gym / Fitness', website: 'greenfitness.io', source: 'LinkedIn', status: 'active', pipeline_stage: 'proposal', score: 82, tags: ['boutique', 'fitness'], notes: 'Reviewing proposal for 8 studios', last_contacted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
    { id: 'demo-12', lead_number: 'LD-012', first_name: 'Chris', last_name: 'Wilson', email: 'chris@naturalfoods.com', phone: '+1 (617) 555-0112', company_name: 'Natural Foods Distribution', company_type: 'Distributor', website: 'naturalfoods.com', source: 'Trade Show', status: 'active', pipeline_stage: 'proposal', score: 90, tags: ['distributor', 'regional'], notes: 'Distributor covering Northeast region', last_contacted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
  ],
  negotiation: [
    { id: 'demo-13', lead_number: 'LD-013', first_name: 'Patricia', last_name: 'Anderson', email: 'patricia@healthclub.com', phone: '+1 (702) 555-0113', company_name: 'HealthClub America', company_type: 'Gym / Fitness', website: 'healthclub.com', source: 'Referral', status: 'active', pipeline_stage: 'negotiation', score: 93, tags: ['national', 'premium'], notes: 'Negotiating volume pricing for 200+ clubs', last_contacted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
    { id: 'demo-14', lead_number: 'LD-014', first_name: 'Steven', last_name: 'Taylor', email: 'steven@gourmetmarket.com', phone: '+1 (404) 555-0114', company_name: 'Gourmet Market Group', company_type: 'Grocery', website: 'gourmetmarket.com', source: 'Cold Call', status: 'active', pipeline_stage: 'negotiation', score: 87, tags: ['premium', 'grocery'], notes: 'Final terms discussion scheduled', last_contacted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
  ],
  closed_won: [
    { id: 'demo-15', lead_number: 'LD-015', first_name: 'Karen', last_name: 'White', email: 'karen@vitalife.com', phone: '+1 (312) 555-0115', company_name: 'VitaLife Stores', company_type: 'Retail Store', website: 'vitalife.com', source: 'Website', status: 'converted', pipeline_stage: 'closed_won', score: 98, tags: ['chain', 'midwest'], notes: 'Contract signed - 25 stores', converted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), last_contacted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
    { id: 'demo-16', lead_number: 'LD-016', first_name: 'Daniel', last_name: 'Harris', email: 'daniel@fitpro.gym', phone: '+1 (619) 555-0116', company_name: 'FitPro Gyms', company_type: 'Gym / Fitness', website: 'fitpro.gym', source: 'Partner', status: 'converted', pipeline_stage: 'closed_won', score: 96, tags: ['fitness', 'west-coast'], notes: 'Onboarding complete - 12 locations', converted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), last_contacted_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
    { id: 'demo-17', lead_number: 'LD-017', first_name: 'Michelle', last_name: 'Clark', email: 'michelle@purebowl.com', phone: '+1 (949) 555-0117', company_name: 'Pure Bowl Cafe', company_type: 'Cafe / Coffee Shop', website: 'purebowl.com', source: 'Referral', status: 'converted', pipeline_stage: 'closed_won', score: 94, tags: ['cafe', 'premium'], notes: 'Successfully launched in 5 locations', converted_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), last_contacted_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
  ],
  closed_lost: [
    { id: 'demo-18', lead_number: 'LD-018', first_name: 'Brian', last_name: 'Young', email: 'brian@budgetfitness.com', phone: '+1 (214) 555-0118', company_name: 'Budget Fitness Chain', company_type: 'Gym / Fitness', website: 'budgetfitness.com', source: 'Cold Call', status: 'lost', pipeline_stage: 'closed_lost', score: 45, tags: ['budget'], notes: 'Price point too high for their model', last_contacted_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
    { id: 'demo-19', lead_number: 'LD-019', first_name: 'Rachel', last_name: 'King', email: 'rachel@localcafe.com', phone: '+1 (503) 555-0119', company_name: 'Local Cafe Co', company_type: 'Cafe / Coffee Shop', website: 'localcafe.com', source: 'Website', status: 'lost', pipeline_stage: 'closed_lost', score: 35, tags: ['small-business'], notes: 'Chose competitor due to exclusivity requirements', last_contacted_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date().toISOString(), metadata: {} },
  ]
};

const demoActivities: LeadActivity[] = [
  { id: 'act-1', lead_id: '', activity_type: 'call', subject: 'Discovery Call', description: 'Discussed product line and pricing', outcome: 'positive', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'act-2', lead_id: '', activity_type: 'email', subject: 'Product Catalog Sent', description: 'Sent full product catalog with pricing', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'act-3', lead_id: '', activity_type: 'meeting', subject: 'Product Demo', description: 'In-person product tasting session', outcome: 'positive', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'act-4', lead_id: '', activity_type: 'note', subject: 'Internal Note', description: 'Lead shows high interest, prioritize follow-up', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
];

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#4ade80" />
      </linearGradient>
    </defs>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="url(#phoneGrad)" strokeWidth="2" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="mailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
    </defs>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="url(#mailGrad)" strokeWidth="2" />
    <polyline points="22,6 12,13 2,6" stroke="url(#mailGrad)" strokeWidth="2" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="url(#calGrad)" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" stroke="url(#calGrad)" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" stroke="url(#calGrad)" strokeWidth="2" />
    <line x1="3" y1="10" x2="21" y2="10" stroke="url(#calGrad)" strokeWidth="2" />
  </svg>
);

const NoteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="noteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="url(#noteGrad)" strokeWidth="2" />
    <polyline points="14 2 14 8 20 8" stroke="url(#noteGrad)" strokeWidth="2" />
    <line x1="16" y1="13" x2="8" y2="13" stroke="url(#noteGrad)" strokeWidth="2" />
    <line x1="16" y1="17" x2="8" y2="17" stroke="url(#noteGrad)" strokeWidth="2" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#22d3ee" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#globeGrad)" strokeWidth="2" />
    <line x1="2" y1="12" x2="22" y2="12" stroke="url(#globeGrad)" strokeWidth="2" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="url(#globeGrad)" strokeWidth="2" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="buildGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#f472b6" />
      </linearGradient>
    </defs>
    <path d="M3 21h18" stroke="url(#buildGrad)" strokeWidth="2" />
    <path d="M5 21V7l8-4v18" stroke="url(#buildGrad)" strokeWidth="2" />
    <path d="M19 21V11l-6-4" stroke="url(#buildGrad)" strokeWidth="2" />
    <path d="M9 9v.01M9 13v.01M9 17v.01" stroke="url(#buildGrad)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#818cf8" />
      </linearGradient>
    </defs>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="url(#userGrad)" strokeWidth="2" />
    <circle cx="12" cy="7" r="4" stroke="url(#userGrad)" strokeWidth="2" />
  </svg>
);

const ConvertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="convertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#4ade80" />
      </linearGradient>
    </defs>
    <polyline points="17 1 21 5 17 9" stroke="url(#convertGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 11V9a4 4 0 014-4h14" stroke="url(#convertGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="7 23 3 19 7 15" stroke="url(#convertGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 13v2a4 4 0 01-4 4H3" stroke="url(#convertGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
    <path d="M12 8v4M12 16h.01" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getStageColor(stage: PipelineStage): string {
  return PIPELINE_STAGES.find(s => s.id === stage)?.color || '#6366f1';
}

function getScoreColor(score: number): { bg: string; text: string } {
  if (score >= 80) return { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' };
  if (score >= 60) return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' };
  if (score >= 40) return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' };
  return { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' };
}

export default function LeadsPipeline() {
  const { loading, authorized } = useRequireAdmin();
  const [leadsByStage, setLeadsByStage] = useState<Record<PipelineStage, Lead[]>>({} as any);
  const [loadingData, setLoadingData] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadActivities, setLeadActivities] = useState<LeadActivity[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);
  const [addLeadForm, setAddLeadForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    company_type: '',
    website: '',
    source: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [activityForm, setActivityForm] = useState({
    activity_type: '',
    subject: '',
    description: ''
  });

  const loadPipelineData = useCallback(async () => {
    setLoadingData(true);
    try {
      const response = await fetch('/api/admin/leads?action=pipeline');
      const data = await response.json();
      
      if (data.pipeline && Object.values(data.pipeline).some((arr: any) => arr.length > 0)) {
        setLeadsByStage(data.pipeline);
        setIsDemo(false);
      } else {
        setLeadsByStage(demoLeads);
        setIsDemo(true);
      }
    } catch (error) {
      console.error('Error loading leads:', error);
      setLeadsByStage(demoLeads);
      setIsDemo(true);
    } finally {
      setLoadingData(false);
    }
  }, []);

  const loadLeadActivities = useCallback(async (leadId: string) => {
    if (isDemo) {
      setLeadActivities(demoActivities.map(a => ({ ...a, lead_id: leadId })));
      return;
    }
    try {
      const response = await fetch(`/api/admin/leads?leadId=${leadId}&action=activities`);
      const data = await response.json();
      setLeadActivities(data.activities || []);
    } catch (error) {
      console.error('Error loading activities:', error);
      setLeadActivities([]);
    }
  }, [isDemo]);

  useEffect(() => {
    if (authorized) {
      loadPipelineData();
    }
  }, [authorized, loadPipelineData]);

  useEffect(() => {
    if (selectedLead) {
      loadLeadActivities(selectedLead.id);
    }
  }, [selectedLead, loadLeadActivities]);

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, newStage: PipelineStage) => {
    e.preventDefault();
    setDragOverStage(null);
    
    if (!draggedLead || draggedLead.pipeline_stage === newStage) {
      setDraggedLead(null);
      return;
    }

    const oldStage = draggedLead.pipeline_stage;
    const updatedLead = { ...draggedLead, pipeline_stage: newStage };
    
    setLeadsByStage(prev => {
      const newState = { ...prev };
      newState[oldStage] = prev[oldStage].filter(l => l.id !== draggedLead.id);
      newState[newStage] = [updatedLead, ...prev[newStage]];
      return newState;
    });

    if (!isDemo) {
      try {
        await fetch(`/api/admin/leads?leadId=${draggedLead.id}&action=update-stage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: newStage })
        });
      } catch (error) {
        console.error('Error updating stage:', error);
        setLeadsByStage(prev => {
          const newState = { ...prev };
          newState[newStage] = prev[newStage].filter(l => l.id !== draggedLead.id);
          newState[oldStage] = [draggedLead, ...prev[oldStage]];
          return newState;
        });
      }
    }
    
    setDraggedLead(null);
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isDemo) {
      const newLead: Lead = {
        id: `demo-new-${Date.now()}`,
        lead_number: `LD-${Date.now()}`,
        ...addLeadForm,
        status: 'active',
        pipeline_stage: 'new',
        score: Math.floor(Math.random() * 40) + 50,
        tags: [],
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setLeadsByStage(prev => ({
        ...prev,
        new: [newLead, ...prev.new]
      }));
      setShowAddModal(false);
      setAddLeadForm({ first_name: '', last_name: '', email: '', phone: '', company_name: '', company_type: '', website: '', source: '', notes: '' });
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addLeadForm)
      });
      const data = await response.json();
      if (data.lead) {
        setLeadsByStage(prev => ({
          ...prev,
          new: [data.lead, ...prev.new]
        }));
        setShowAddModal(false);
        setAddLeadForm({ first_name: '', last_name: '', email: '', phone: '', company_name: '', company_type: '', website: '', source: '', notes: '' });
      }
    } catch (error) {
      console.error('Error adding lead:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddActivity = async () => {
    if (!selectedLead || !activityForm.activity_type || !activityForm.subject) return;

    if (isDemo) {
      const newActivity: LeadActivity = {
        id: `act-new-${Date.now()}`,
        lead_id: selectedLead.id,
        activity_type: activityForm.activity_type,
        subject: activityForm.subject,
        description: activityForm.description,
        created_at: new Date().toISOString()
      };
      setLeadActivities(prev => [newActivity, ...prev]);
      setActivityForm({ activity_type: '', subject: '', description: '' });
      setShowActivityDropdown(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/leads?leadId=${selectedLead.id}&action=add-activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityForm)
      });
      const data = await response.json();
      if (data.activity) {
        setLeadActivities(prev => [data.activity, ...prev]);
        setActivityForm({ activity_type: '', subject: '', description: '' });
        setShowActivityDropdown(false);
      }
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const handleConvertToPartner = async () => {
    if (!selectedLead) return;

    if (isDemo) {
      alert('Demo Mode: Lead would be converted to a partner');
      return;
    }

    try {
      const response = await fetch(`/api/admin/leads?leadId=${selectedLead.id}&action=convert`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        loadPipelineData();
        setSelectedLead(null);
      }
    } catch (error) {
      console.error('Error converting lead:', error);
    }
  };

  const handleStageChange = async (newStage: PipelineStage) => {
    if (!selectedLead) return;
    
    const oldStage = selectedLead.pipeline_stage;
    const updatedLead = { ...selectedLead, pipeline_stage: newStage };
    
    setLeadsByStage(prev => {
      const newState = { ...prev };
      newState[oldStage] = prev[oldStage].filter(l => l.id !== selectedLead.id);
      newState[newStage] = [updatedLead, ...prev[newStage]];
      return newState;
    });
    setSelectedLead(updatedLead);

    if (!isDemo) {
      try {
        await fetch(`/api/admin/leads?leadId=${selectedLead.id}&action=update-stage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: newStage })
        });
      } catch (error) {
        console.error('Error updating stage:', error);
      }
    }
  };

  const getFilteredLeads = useCallback((leads: Lead[]) => {
    if (!searchQuery) return leads;
    const query = searchQuery.toLowerCase();
    return leads.filter(lead => 
      lead.company_name?.toLowerCase().includes(query) ||
      lead.first_name?.toLowerCase().includes(query) ||
      lead.last_name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const getPipelineStats = useCallback(() => {
    return PIPELINE_STAGES.map(stage => ({
      ...stage,
      count: leadsByStage[stage.id]?.length || 0
    }));
  }, [leadsByStage]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Initializing</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Authenticating</p>
      </div>
    );
  }

  return (
    <AdminLayout title="Lead Pipeline" subtitle="CRM & Sales Pipeline">
      <div style={styles.headerSection}>
        <div style={styles.headerLeft}>
          {isDemo && (
            <div style={styles.demoBadge}>
              <InfoIcon />
              <span>Demo Mode</span>
            </div>
          )}
          <div style={styles.statsRow}>
            {getPipelineStats().map(stage => (
              <div key={stage.id} style={styles.statBadge}>
                <span style={{ ...styles.statDot, background: stage.color }} />
                <span style={styles.statLabel}>{stage.label}</span>
                <span style={{ ...styles.statCount, color: stage.color }}>{stage.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.searchWrapper}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button onClick={() => setShowAddModal(true)} style={styles.addButton}>
            <PlusIcon />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {loadingData ? (
        <div style={styles.loadingContent}>
          <div style={styles.loadingOrb} />
          <p style={styles.loadingText}>Loading pipeline...</p>
        </div>
      ) : (
        <div style={styles.kanbanContainer}>
          <div style={styles.kanbanBoard}>
            {PIPELINE_STAGES.map(stage => (
              <div 
                key={stage.id} 
                style={{
                  ...styles.kanbanColumn,
                  ...(dragOverStage === stage.id ? styles.kanbanColumnDragOver : {})
                }}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div style={{ ...styles.columnHeader, borderTopColor: stage.color }}>
                  <div style={styles.columnTitleRow}>
                    <span style={{ ...styles.columnDot, background: stage.color }} />
                    <h3 style={styles.columnTitle}>{stage.label}</h3>
                  </div>
                  <span style={{ ...styles.columnCount, background: `${stage.color}20`, color: stage.color }}>
                    {getFilteredLeads(leadsByStage[stage.id] || []).length}
                  </span>
                </div>
                <div style={styles.columnContent}>
                  {getFilteredLeads(leadsByStage[stage.id] || []).map(lead => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      onClick={() => setSelectedLead(lead)}
                      style={{
                        ...styles.leadCard,
                        ...(draggedLead?.id === lead.id ? styles.leadCardDragging : {})
                      }}
                    >
                      <div style={styles.leadCardHeader}>
                        <span style={styles.leadCompany}>{lead.company_name || 'Unknown Company'}</span>
                        <span style={{ 
                          ...styles.leadScore,
                          background: getScoreColor(lead.score).bg,
                          color: getScoreColor(lead.score).text
                        }}>
                          {lead.score}
                        </span>
                      </div>
                      <p style={styles.leadContact}>
                        {lead.first_name} {lead.last_name}
                      </p>
                      <p style={styles.leadEmail}>{lead.email}</p>
                      {lead.assigned_user && (
                        <div style={styles.leadAssigned}>
                          <div style={styles.avatarSmall}>
                            {lead.assigned_user.name?.charAt(0) || 'U'}
                          </div>
                          <span>{lead.assigned_user.name}</span>
                        </div>
                      )}
                      {lead.tags && lead.tags.length > 0 && (
                        <div style={styles.leadTags}>
                          {lead.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} style={styles.leadTag}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {getFilteredLeads(leadsByStage[stage.id] || []).length === 0 && (
                    <div style={styles.emptyColumn}>
                      <p>No leads</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedLead && (
        <div style={styles.modalOverlay} onClick={() => setSelectedLead(null)}>
          <div style={styles.detailModal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>{selectedLead.company_name || 'Lead Details'}</h2>
                <p style={styles.modalSubtitle}>
                  {selectedLead.first_name} {selectedLead.last_name} • {selectedLead.lead_number}
                </p>
              </div>
              <button onClick={() => setSelectedLead(null)} style={styles.closeButton}>
                <CloseIcon />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.detailGrid}>
                <div style={styles.detailSection}>
                  <h4 style={styles.sectionLabel}>Contact Information</h4>
                  <div style={styles.detailRow}>
                    <UserIcon />
                    <span>{selectedLead.first_name} {selectedLead.last_name}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <MailIcon />
                    <span>{selectedLead.email || 'No email'}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <PhoneIcon />
                    <span>{selectedLead.phone || 'No phone'}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <BuildingIcon />
                    <span>{selectedLead.company_type || 'Unknown type'}</span>
                  </div>
                  {selectedLead.website && (
                    <div style={styles.detailRow}>
                      <GlobeIcon />
                      <a href={`https://${selectedLead.website}`} target="_blank" rel="noopener noreferrer" style={styles.websiteLink}>
                        {selectedLead.website}
                      </a>
                    </div>
                  )}
                </div>

                <div style={styles.detailSection}>
                  <h4 style={styles.sectionLabel}>Lead Details</h4>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Source</span>
                    <span style={styles.detailValue}>{selectedLead.source || 'Unknown'}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Score</span>
                    <span style={{
                      ...styles.scoreBadgeLarge,
                      background: getScoreColor(selectedLead.score).bg,
                      color: getScoreColor(selectedLead.score).text
                    }}>{selectedLead.score}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Created</span>
                    <span style={styles.detailValue}>{formatDate(selectedLead.created_at)}</span>
                  </div>
                  {selectedLead.last_contacted_at && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Last Contact</span>
                      <span style={styles.detailValue}>{formatDate(selectedLead.last_contacted_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedLead.notes && (
                <div style={styles.notesSection}>
                  <h4 style={styles.sectionLabel}>Notes</h4>
                  <p style={styles.notesText}>{selectedLead.notes}</p>
                </div>
              )}

              <div style={styles.stageSection}>
                <h4 style={styles.sectionLabel}>Change Stage</h4>
                <div style={styles.stageButtons}>
                  {PIPELINE_STAGES.map(stage => (
                    <button
                      key={stage.id}
                      onClick={() => handleStageChange(stage.id)}
                      style={{
                        ...styles.stageButton,
                        background: selectedLead.pipeline_stage === stage.id 
                          ? stage.color 
                          : 'rgba(255,255,255,0.05)',
                        borderColor: stage.color,
                        color: selectedLead.pipeline_stage === stage.id ? '#fff' : stage.color
                      }}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedLead.pipeline_stage === 'qualified' || 
                selectedLead.pipeline_stage === 'proposal' || 
                selectedLead.pipeline_stage === 'negotiation') && (
                <button onClick={handleConvertToPartner} style={styles.convertButton}>
                  <ConvertIcon />
                  <span>Convert to Partner</span>
                </button>
              )}

              <div style={styles.activitySection}>
                <div style={styles.activityHeader}>
                  <h4 style={styles.sectionLabel}>Activity Timeline</h4>
                  <div style={styles.activityDropdownWrapper}>
                    <button 
                      onClick={() => setShowActivityDropdown(!showActivityDropdown)} 
                      style={{
                        ...styles.addActivityButton,
                        ...(showActivityDropdown ? styles.addActivityButtonActive : {})
                      }}
                    >
                      <PlusIcon />
                      <span>Add Activity</span>
                      <ChevronDownIcon />
                    </button>
                    {showActivityDropdown && (
                      <>
                        <div 
                          style={styles.dropdownBackdrop}
                          onClick={() => setShowActivityDropdown(false)}
                        />
                        <div style={styles.activityDropdown}>
                          <div style={styles.dropdownHeader}>
                            <span style={styles.dropdownTitle}>Log Activity</span>
                            <button 
                              onClick={() => setShowActivityDropdown(false)}
                              style={styles.dropdownClose}
                            >
                              <CloseIcon />
                            </button>
                          </div>
                          <div style={styles.activityTypeGrid}>
                            {ACTIVITY_TYPES.map(type => (
                              <button
                                key={type.id}
                                onClick={() => setActivityForm(prev => ({ ...prev, activity_type: type.id }))}
                                style={{
                                  ...styles.activityTypeCard,
                                  ...(activityForm.activity_type === type.id ? styles.activityTypeCardActive : {})
                                }}
                              >
                                <div style={{
                                  ...styles.activityIconWrapper,
                                  ...(activityForm.activity_type === type.id ? styles.activityIconWrapperActive : {})
                                }}>
                                  {type.id === 'call' && <PhoneIcon />}
                                  {type.id === 'email' && <MailIcon />}
                                  {type.id === 'meeting' && <CalendarIcon />}
                                  {type.id === 'note' && <NoteIcon />}
                                </div>
                                <span style={styles.activityTypeLabel}>{type.label}</span>
                                {activityForm.activity_type === type.id && (
                                  <div style={styles.activityCheckmark}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                          <div style={styles.activityFormSection}>
                            <input
                              type="text"
                              placeholder="Subject (e.g., Discovery Call, Follow-up Email)"
                              value={activityForm.subject}
                              onChange={(e) => setActivityForm(prev => ({ ...prev, subject: e.target.value }))}
                              style={styles.activityInput}
                            />
                            <textarea
                              placeholder="Add notes or details..."
                              value={activityForm.description}
                              onChange={(e) => setActivityForm(prev => ({ ...prev, description: e.target.value }))}
                              style={styles.activityTextarea}
                              rows={3}
                            />
                          </div>
                          <div style={styles.dropdownActions}>
                            <button 
                              onClick={() => {
                                setShowActivityDropdown(false);
                                setActivityForm({ activity_type: '', subject: '', description: '' });
                              }}
                              style={styles.dropdownCancelBtn}
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={handleAddActivity} 
                              disabled={!activityForm.activity_type || !activityForm.subject}
                              style={{
                                ...styles.saveActivityButton,
                                opacity: (!activityForm.activity_type || !activityForm.subject) ? 0.5 : 1,
                                cursor: (!activityForm.activity_type || !activityForm.subject) ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <PlusIcon />
                              <span>Add Activity</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div style={styles.timeline}>
                  {leadActivities.length > 0 ? (
                    leadActivities.map(activity => (
                      <div key={activity.id} style={styles.timelineItem}>
                        <div style={styles.timelineIcon}>
                          {activity.activity_type === 'call' && <PhoneIcon />}
                          {activity.activity_type === 'email' && <MailIcon />}
                          {activity.activity_type === 'meeting' && <CalendarIcon />}
                          {activity.activity_type === 'note' && <NoteIcon />}
                          {!['call', 'email', 'meeting', 'note'].includes(activity.activity_type) && <NoteIcon />}
                        </div>
                        <div style={styles.timelineContent}>
                          <p style={styles.timelineSubject}>{activity.subject}</p>
                          {activity.description && (
                            <p style={styles.timelineDescription}>{activity.description}</p>
                          )}
                          <p style={styles.timelineDate}>
                            {formatDate(activity.created_at)} at {formatTime(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={styles.emptyTimeline}>No activities yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.addModal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Lead</h2>
              <button onClick={() => setShowAddModal(false)} style={styles.closeButton}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleAddLead} style={styles.addForm}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>First Name</label>
                  <input
                    type="text"
                    value={addLeadForm.first_name}
                    onChange={(e) => setAddLeadForm(prev => ({ ...prev, first_name: e.target.value }))}
                    style={styles.formInput}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Last Name</label>
                  <input
                    type="text"
                    value={addLeadForm.last_name}
                    onChange={(e) => setAddLeadForm(prev => ({ ...prev, last_name: e.target.value }))}
                    style={styles.formInput}
                    required
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    value={addLeadForm.email}
                    onChange={(e) => setAddLeadForm(prev => ({ ...prev, email: e.target.value }))}
                    style={styles.formInput}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Phone</label>
                  <input
                    type="tel"
                    value={addLeadForm.phone}
                    onChange={(e) => setAddLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Company Name</label>
                  <input
                    type="text"
                    value={addLeadForm.company_name}
                    onChange={(e) => setAddLeadForm(prev => ({ ...prev, company_name: e.target.value }))}
                    style={styles.formInput}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Company Type</label>
                  <select
                    value={addLeadForm.company_type}
                    onChange={(e) => setAddLeadForm(prev => ({ ...prev, company_type: e.target.value }))}
                    style={styles.formSelect}
                  >
                    <option value="">Select type...</option>
                    {COMPANY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Website</label>
                  <input
                    type="text"
                    value={addLeadForm.website}
                    onChange={(e) => setAddLeadForm(prev => ({ ...prev, website: e.target.value }))}
                    style={styles.formInput}
                    placeholder="example.com"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Source</label>
                  <select
                    value={addLeadForm.source}
                    onChange={(e) => setAddLeadForm(prev => ({ ...prev, source: e.target.value }))}
                    style={styles.formSelect}
                  >
                    <option value="">Select source...</option>
                    {LEAD_SOURCES.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Notes</label>
                <textarea
                  value={addLeadForm.notes}
                  onChange={(e) => setAddLeadForm(prev => ({ ...prev, notes: e.target.value }))}
                  style={styles.formTextarea}
                  placeholder="Add any notes about this lead..."
                />
              </div>
              <div style={styles.formActions}>
                <button type="button" onClick={() => setShowAddModal(false)} style={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={styles.submitButton}>
                  {submitting ? 'Adding...' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#050505',
    gap: '24px',
  },
  loadingOrb: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    gap: '24px',
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  demoBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '12px',
    color: '#818cf8',
  },
  statsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  statBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '12px',
  },
  statDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
  },
  statCount: {
    fontWeight: '600',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '10px 14px',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '14px',
    width: '200px',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 18px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  kanbanContainer: {
    overflowX: 'auto',
    paddingBottom: '20px',
  },
  kanbanBoard: {
    display: 'flex',
    gap: '16px',
    minWidth: 'max-content',
  },
  kanbanColumn: {
    width: '280px',
    flexShrink: 0,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    transition: 'border-color 0.2s, background 0.2s',
  },
  kanbanColumnDragOver: {
    borderColor: 'rgba(99, 102, 241, 0.5)',
    background: 'rgba(99, 102, 241, 0.05)',
  },
  columnHeader: {
    padding: '16px',
    borderTop: '3px solid',
    background: 'rgba(255,255,255,0.02)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  columnDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  columnTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  columnCount: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  columnContent: {
    padding: '12px',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  leadCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '14px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
  },
  leadCardDragging: {
    opacity: 0.5,
    transform: 'rotate(3deg)',
  },
  leadCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  leadCompany: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },
  leadScore: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  leadContact: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '4px',
  },
  leadEmail: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '8px',
  },
  leadAssigned: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '8px',
  },
  avatarSmall: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: '600',
    color: '#fff',
  },
  leadTags: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  leadTag: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.5)',
  },
  emptyColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100px',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '13px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  detailModal: {
    background: 'rgba(20,20,20,0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  addModal: {
    background: 'rgba(20,20,20,0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '24px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '4px',
  },
  modalSubtitle: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
  },
  closeButton: {
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
  },
  modalBody: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  detailSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
  },
  websiteLink: {
    color: '#60a5fa',
    textDecoration: 'none',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
  },
  detailValue: {
    fontSize: '13px',
    color: '#fff',
  },
  scoreBadgeLarge: {
    fontSize: '14px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '8px',
  },
  notesSection: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
  },
  notesText: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.6,
  },
  stageSection: {
    marginBottom: '24px',
  },
  stageButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  stageButton: {
    fontSize: '12px',
    fontWeight: '500',
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  convertButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(74, 222, 128, 0.1) 100%)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '12px',
    color: '#22c55e',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '24px',
    transition: 'all 0.2s',
  },
  activitySection: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
    paddingTop: '24px',
  },
  activityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  activityDropdownWrapper: {
    position: 'relative',
  },
  addActivityButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '10px',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#a5b4fc',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  addActivityButtonActive: {
    background: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366f1',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },
  dropdownBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
  activityDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '12px',
    width: '360px',
    background: 'linear-gradient(180deg, rgba(25,25,30,0.98) 0%, rgba(20,20,25,0.99) 100%)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '16px',
    padding: '0',
    zIndex: 100,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.1)',
    overflow: 'hidden',
  },
  dropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)',
  },
  dropdownTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },
  dropdownClose: {
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    borderRadius: '8px',
    padding: '6px',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTypeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  activityTypeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 8px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
  },
  activityTypeCardActive: {
    background: 'rgba(99, 102, 241, 0.15)',
    borderColor: 'rgba(99, 102, 241, 0.5)',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
  },
  activityIconWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  activityIconWrapperActive: {
    background: 'rgba(99, 102, 241, 0.2)',
  },
  activityTypeLabel: {
    fontSize: '11px',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
  },
  activityCheckmark: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  activityFormSection: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  activityInput: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  activityTextarea: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
    resize: 'none',
    minHeight: '80px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  dropdownActions: {
    display: 'flex',
    gap: '12px',
    padding: '16px 20px',
    background: 'rgba(0,0,0,0.2)',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  dropdownCancelBtn: {
    flex: 1,
    padding: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  saveActivityButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  timelineItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  timelineIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  timelineContent: {
    flex: 1,
  },
  timelineSubject: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#fff',
    marginBottom: '4px',
  },
  timelineDescription: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '6px',
  },
  timelineDate: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
  emptyTimeline: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    padding: '24px',
    fontSize: '13px',
  },
  addForm: {
    padding: '24px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '16px',
  },
  formLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  formInput: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  formSelect: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
    cursor: 'pointer',
  },
  formTextarea: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  cancelButton: {
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  submitButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
