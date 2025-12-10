import {
  COMPANY_NAMES,
  PRODUCT_NAMES,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  generateId,
  randomBetween,
  randomFromArray,
  generatePersonName,
  generateEmail,
  generatePhone,
  type B2BDeal,
} from './mockData';

export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface PipelineOverview {
  totalPipelineValue: number;
  totalDeals: number;
  averageDealSize: number;
  winRate: number;
  avgSalesCycle: number;
  dealsClosedThisMonth: number;
  revenueClosedThisMonth: number;
  stageBreakdown: {
    stage: DealStage;
    label: string;
    count: number;
    value: number;
    color: string;
  }[];
}

export interface Deal {
  id: string;
  companyName: string;
  companyLogo?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactTitle: string;
  dealValue: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  createdAt: string;
  lastActivityAt: string;
  nextFollowUp?: string;
  notes: string;
  products: string[];
  volumePerMonth: number;
  storeCount?: number;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
  tags: string[];
}

export interface HotDeal {
  id: string;
  companyName: string;
  dealValue: number;
  stage: DealStage;
  daysUntilClose: number;
  actionRequired: string;
  urgency: 'high' | 'critical';
  lastContact: string;
  nextStep: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  companyName: string;
  companyId: string;
  isPrimary: boolean;
  lastContactedAt?: string;
  notes?: string;
  linkedIn?: string;
  tags: string[];
}

const STAGE_CONFIG: { id: DealStage; label: string; color: string; probability: number }[] = [
  { id: 'lead', label: 'Lead', color: '#6366f1', probability: 10 },
  { id: 'qualified', label: 'Qualified', color: '#8b5cf6', probability: 25 },
  { id: 'proposal', label: 'Proposal', color: '#f59e0b', probability: 50 },
  { id: 'negotiation', label: 'Negotiation', color: '#ec4899', probability: 75 },
  { id: 'closed_won', label: 'Closed Won', color: '#22c55e', probability: 100 },
  { id: 'closed_lost', label: 'Closed Lost', color: '#ef4444', probability: 0 },
];

const TITLES = [
  'Procurement Manager',
  'Category Buyer',
  'VP of Merchandising',
  'Director of Purchasing',
  'Store Manager',
  'Regional Director',
  'Chief Procurement Officer',
  'Buyer',
  'Supply Chain Manager',
  'Operations Director',
];

const SOURCES = [
  'Trade Show',
  'Referral',
  'Website Inquiry',
  'Cold Outreach',
  'LinkedIn',
  'Industry Event',
  'Partner Referral',
  'Inbound Marketing',
];

const SALES_REPS = [
  'Alex Thompson',
  'Jordan Lee',
  'Casey Martinez',
  'Morgan Williams',
  'Taylor Johnson',
];

let cachedDeals: Deal[] | null = null;

function generateDeals(): Deal[] {
  if (cachedDeals) return cachedDeals;
  
  const deals: Deal[] = [];
  const now = new Date();
  
  const activeStages: DealStage[] = ['lead', 'qualified', 'proposal', 'negotiation'];
  const closedStages: DealStage[] = ['closed_won', 'closed_lost'];
  
  COMPANY_NAMES.forEach((company, index) => {
    const isActive = index < 14;
    const stage = isActive 
      ? activeStages[index % activeStages.length]
      : closedStages[index % closedStages.length];
    
    const stageConfig = STAGE_CONFIG.find(s => s.id === stage)!;
    const person = generatePersonName();
    
    const daysAgo = randomBetween(10, 120);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);
    
    const lastActivityDays = randomBetween(0, Math.min(7, daysAgo));
    const lastActivity = new Date(now);
    lastActivity.setDate(lastActivity.getDate() - lastActivityDays);
    
    const closeDate = new Date(now);
    if (stage === 'closed_won' || stage === 'closed_lost') {
      closeDate.setDate(closeDate.getDate() - randomBetween(1, 30));
    } else {
      closeDate.setDate(closeDate.getDate() + randomBetween(7, 60));
    }
    
    const nextFollowUp = stage !== 'closed_won' && stage !== 'closed_lost'
      ? new Date(now.getTime() + randomBetween(1, 7) * 86400000).toISOString()
      : undefined;
    
    const storeCount = randomBetween(5, 200);
    const volumePerMonth = storeCount * randomBetween(10, 50);
    const unitPrice = 6.50;
    const dealValue = volumePerMonth * unitPrice * 12;
    
    const products = [...PRODUCT_NAMES]
      .sort(() => Math.random() - 0.5)
      .slice(0, randomBetween(3, 8));
    
    deals.push({
      id: `deal-${index + 1}`,
      companyName: company,
      contactName: person.fullName,
      contactEmail: generateEmail(person.firstName, person.lastName, company),
      contactPhone: generatePhone(),
      contactTitle: randomFromArray(TITLES),
      dealValue: Math.round(dealValue),
      stage,
      probability: stageConfig.probability,
      expectedCloseDate: closeDate.toISOString(),
      createdAt: createdAt.toISOString(),
      lastActivityAt: lastActivity.toISOString(),
      nextFollowUp,
      notes: `Initial discussion about carrying our smoothie line in ${storeCount} locations. ${person.firstName} expressed interest in health-focused products for their wellness section.`,
      products: products as unknown as string[],
      volumePerMonth,
      storeCount,
      assignedTo: randomFromArray(SALES_REPS),
      priority: stage === 'negotiation' ? 'high' : stage === 'proposal' ? 'medium' : 'low',
      source: randomFromArray(SOURCES),
      tags: [
        randomFromArray(['Enterprise', 'Mid-Market', 'SMB']),
        randomFromArray(['West Coast', 'East Coast', 'Midwest', 'National']),
      ],
    });
  });
  
  cachedDeals = deals;
  return deals;
}

export function getPipelineOverview(): PipelineOverview {
  const deals = generateDeals();
  const activeDeals = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost');
  const closedWon = deals.filter(d => d.stage === 'closed_won');
  const closedLost = deals.filter(d => d.stage === 'closed_lost');
  
  const totalPipelineValue = activeDeals.reduce((sum, d) => sum + d.dealValue, 0);
  const wonValue = closedWon.reduce((sum, d) => sum + d.dealValue, 0);
  const winRate = closedWon.length / (closedWon.length + closedLost.length) * 100;
  
  const stageBreakdown = STAGE_CONFIG.filter(s => s.id !== 'closed_won' && s.id !== 'closed_lost').map(stage => {
    const stageDeals = activeDeals.filter(d => d.stage === stage.id);
    return {
      stage: stage.id,
      label: stage.label,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + d.dealValue, 0),
      color: stage.color,
    };
  });
  
  return {
    totalPipelineValue,
    totalDeals: activeDeals.length,
    averageDealSize: Math.round(totalPipelineValue / activeDeals.length),
    winRate: Math.round(winRate * 10) / 10,
    avgSalesCycle: 42,
    dealsClosedThisMonth: closedWon.length,
    revenueClosedThisMonth: wonValue,
    stageBreakdown,
  };
}

export function getDeals(stage?: DealStage): Deal[] {
  const deals = generateDeals();
  if (stage) {
    return deals.filter(d => d.stage === stage);
  }
  return deals;
}

export function getDealsByStage(): Record<DealStage, Deal[]> {
  const deals = generateDeals();
  const grouped: Record<DealStage, Deal[]> = {
    lead: [],
    qualified: [],
    proposal: [],
    negotiation: [],
    closed_won: [],
    closed_lost: [],
  };
  
  deals.forEach(deal => {
    grouped[deal.stage].push(deal);
  });
  
  return grouped;
}

export function getHotDeals(): HotDeal[] {
  const deals = generateDeals();
  const now = new Date();
  
  const activeDeals = deals
    .filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
    .filter(d => {
      const closeDate = new Date(d.expectedCloseDate);
      const daysUntilClose = Math.ceil((closeDate.getTime() - now.getTime()) / 86400000);
      return daysUntilClose <= 14 || d.priority === 'high' || d.priority === 'urgent';
    });
  
  return activeDeals.slice(0, 8).map(deal => {
    const closeDate = new Date(deal.expectedCloseDate);
    const daysUntilClose = Math.ceil((closeDate.getTime() - now.getTime()) / 86400000);
    
    let actionRequired = '';
    let nextStep = '';
    
    switch (deal.stage) {
      case 'lead':
        actionRequired = 'Schedule discovery call';
        nextStep = 'Send introduction email and calendar invite';
        break;
      case 'qualified':
        actionRequired = 'Send product samples';
        nextStep = 'Follow up after sample delivery';
        break;
      case 'proposal':
        actionRequired = 'Follow up on proposal';
        nextStep = 'Schedule pricing discussion call';
        break;
      case 'negotiation':
        actionRequired = 'Finalize contract terms';
        nextStep = 'Send final contract for signature';
        break;
    }
    
    return {
      id: deal.id,
      companyName: deal.companyName,
      dealValue: deal.dealValue,
      stage: deal.stage,
      daysUntilClose,
      actionRequired,
      urgency: (daysUntilClose <= 7 ? 'critical' : 'high') as 'high' | 'critical',
      lastContact: formatRelativeTime(deal.lastActivityAt),
      nextStep,
    };
  }).sort((a, b) => a.daysUntilClose - b.daysUntilClose);
}

export function getContacts(): Contact[] {
  const deals = generateDeals();
  const contacts: Contact[] = [];
  
  deals.forEach((deal, index) => {
    const nameParts = deal.contactName.split(' ');
    contacts.push({
      id: `contact-${index + 1}`,
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' '),
      email: deal.contactEmail,
      phone: deal.contactPhone,
      title: deal.contactTitle,
      companyName: deal.companyName,
      companyId: deal.id,
      isPrimary: true,
      lastContactedAt: deal.lastActivityAt,
      notes: `Primary contact for ${deal.companyName} account.`,
      linkedIn: `https://linkedin.com/in/${nameParts[0].toLowerCase()}-${nameParts[1]?.toLowerCase() || 'user'}`,
      tags: deal.tags,
    });
    
    if (index % 3 === 0) {
      const secondaryPerson = generatePersonName();
      contacts.push({
        id: `contact-${index + 1}-b`,
        firstName: secondaryPerson.firstName,
        lastName: secondaryPerson.lastName,
        email: generateEmail(secondaryPerson.firstName, secondaryPerson.lastName, deal.companyName),
        phone: generatePhone(),
        title: randomFromArray(['Store Manager', 'Assistant Buyer', 'Category Analyst', 'Supply Chain Coordinator']),
        companyName: deal.companyName,
        companyId: deal.id,
        isPrimary: false,
        tags: [],
      });
    }
  });
  
  return contacts;
}

export function getDealMetrics(): {
  thisMonth: { deals: number; value: number; growth: number };
  thisQuarter: { deals: number; value: number; growth: number };
  thisYear: { deals: number; value: number; growth: number };
  forecast: { conservative: number; expected: number; optimistic: number };
} {
  const overview = getPipelineOverview();
  
  return {
    thisMonth: {
      deals: overview.dealsClosedThisMonth,
      value: overview.revenueClosedThisMonth,
      growth: 12.4,
    },
    thisQuarter: {
      deals: overview.dealsClosedThisMonth * 3,
      value: overview.revenueClosedThisMonth * 3,
      growth: 18.7,
    },
    thisYear: {
      deals: overview.dealsClosedThisMonth * 12,
      value: overview.revenueClosedThisMonth * 12,
      growth: 42.3,
    },
    forecast: {
      conservative: Math.round(overview.totalPipelineValue * 0.25),
      expected: Math.round(overview.totalPipelineValue * 0.4),
      optimistic: Math.round(overview.totalPipelineValue * 0.6),
    },
  };
}

export function getTopPerformers(): {
  name: string;
  deals: number;
  value: number;
  winRate: number;
}[] {
  const deals = generateDeals();
  const byRep: Record<string, { deals: number; value: number; won: number; total: number }> = {};
  
  deals.forEach(deal => {
    if (!byRep[deal.assignedTo]) {
      byRep[deal.assignedTo] = { deals: 0, value: 0, won: 0, total: 0 };
    }
    byRep[deal.assignedTo].deals += 1;
    byRep[deal.assignedTo].value += deal.dealValue;
    if (deal.stage === 'closed_won') {
      byRep[deal.assignedTo].won += 1;
    }
    if (deal.stage === 'closed_won' || deal.stage === 'closed_lost') {
      byRep[deal.assignedTo].total += 1;
    }
  });
  
  return Object.entries(byRep)
    .map(([name, data]) => ({
      name,
      deals: data.deals,
      value: data.value,
      winRate: data.total > 0 ? Math.round((data.won / data.total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

export const STAGE_LABELS = STAGE_CONFIG.reduce((acc, stage) => {
  acc[stage.id] = stage.label;
  return acc;
}, {} as Record<DealStage, string>);

export const STAGE_COLORS = STAGE_CONFIG.reduce((acc, stage) => {
  acc[stage.id] = stage.color;
  return acc;
}, {} as Record<DealStage, string>);
