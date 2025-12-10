export const COMPANY_NAMES = [
  'Walmart',
  'Target',
  'Whole Foods Market',
  'Costco',
  "Trader Joe's",
  'Kroger',
  'Sprouts Farmers Market',
  'Safeway',
  'Publix',
  'H-E-B',
  'Wegmans',
  'Aldi',
  'Meijer',
  'Stop & Shop',
  'Giant Eagle',
  'Natural Grocers',
  'Bristol Farms',
  "Raley's",
  'New Seasons Market',
  'PCC Community Markets',
] as const;

export const PRODUCT_NAMES = [
  'Green Detox',
  'Berry Blast',
  'Protein Power',
  'Immune Boost',
  'Tropical Paradise',
  'Chocolate Dream',
  'Mango Jackfruit',
  'Strawberry Peach',
  'Açaí Berry',
  'Coffee Mushroom',
  'Matcha Energy',
  'Nutty Monkey',
] as const;

export const PRODUCT_SKUS: Record<string, string> = {
  'Green Detox': 'SM-GRN-001',
  'Berry Blast': 'SM-BRY-002',
  'Protein Power': 'SM-PRO-003',
  'Immune Boost': 'SM-IMN-004',
  'Tropical Paradise': 'SM-TRP-005',
  'Chocolate Dream': 'SM-CHO-006',
  'Mango Jackfruit': 'SM-MNG-007',
  'Strawberry Peach': 'SM-STP-008',
  'Açaí Berry': 'SM-ACB-009',
  'Coffee Mushroom': 'SM-CFM-010',
  'Matcha Energy': 'SM-MTC-011',
  'Nutty Monkey': 'SM-NTM-012',
};

export const PRODUCT_PRICES: Record<string, number> = {
  'Green Detox': 7.99,
  'Berry Blast': 7.99,
  'Protein Power': 9.99,
  'Immune Boost': 8.99,
  'Tropical Paradise': 7.99,
  'Chocolate Dream': 8.99,
  'Mango Jackfruit': 7.99,
  'Strawberry Peach': 7.99,
  'Açaí Berry': 9.99,
  'Coffee Mushroom': 10.99,
  'Matcha Energy': 9.99,
  'Nutty Monkey': 8.99,
};

export interface FinancialMetrics {
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueThisQuarter: number;
  grossMargin: number;
  netMargin: number;
  operatingExpenses: number;
  cogs: number;
  cashOnHand: number;
  accountsReceivable: number;
  accountsPayable: number;
  inventoryValue: number;
}

export interface B2BDeal {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  dealValue: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  expectedCloseDate: string;
  createdAt: string;
  lastActivity: string;
  notes: string;
  products: string[];
  volumePerMonth: number;
}

export interface ProductionBatch {
  batchId: string;
  productName: string;
  productSku: string;
  units: number;
  stage: 'sourcing' | 'preparation' | 'blending' | 'packaging' | 'quality_check' | 'ready' | 'shipped';
  progress: number;
  status: 'on_track' | 'delayed' | 'at_risk' | 'completed';
  startDate: string;
  expectedCompletion: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyDetailed(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatCompactNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFromArray<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateDateRange(days: number): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }
  return dates;
}

export function getFinancialMetrics(): FinancialMetrics {
  return {
    revenueToday: 12450,
    revenueThisWeek: 78320,
    revenueThisMonth: 324580,
    revenueThisQuarter: 892340,
    grossMargin: 62.4,
    netMargin: 28.3,
    operatingExpenses: 89200,
    cogs: 122150,
    cashOnHand: 487320,
    accountsReceivable: 156780,
    accountsPayable: 67890,
    inventoryValue: 234560,
  };
}

export function generateB2BDeals(): B2BDeal[] {
  const stages: B2BDeal['stage'][] = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
  const contactNames = [
    'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 
    'Jessica Williams', 'Robert Taylor', 'Amanda Martinez', 'Christopher Lee',
    'Nicole Brown', 'Daniel Wilson', 'Stephanie Anderson', 'Matthew Thomas'
  ];

  const deals: B2BDeal[] = [];
  const now = new Date();

  COMPANY_NAMES.slice(0, 12).forEach((company, index) => {
    const stage = stages[index % stages.length];
    const contact = contactNames[index];
    const daysAgo = randomBetween(5, 90);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);
    
    const lastActivityDaysAgo = randomBetween(0, Math.min(5, daysAgo));
    const lastActivity = new Date(now);
    lastActivity.setDate(lastActivity.getDate() - lastActivityDaysAgo);
    
    const expectedClose = new Date(now);
    expectedClose.setDate(expectedClose.getDate() + randomBetween(7, 60));

    deals.push({
      id: `deal-${index + 1}`,
      companyName: company,
      contactName: contact,
      contactEmail: `${contact.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      contactPhone: `(${randomBetween(200, 999)}) ${randomBetween(200, 999)}-${randomBetween(1000, 9999)}`,
      dealValue: randomBetween(15000, 250000),
      stage,
      probability: stage === 'lead' ? 10 : stage === 'qualified' ? 25 : stage === 'proposal' ? 50 : stage === 'negotiation' ? 75 : stage === 'closed_won' ? 100 : 0,
      expectedCloseDate: expectedClose.toISOString(),
      createdAt: createdAt.toISOString(),
      lastActivity: lastActivity.toISOString(),
      notes: `Initial outreach from ${company}'s procurement team. Interested in bulk ordering for ${randomBetween(5, 50)} store locations.`,
      products: PRODUCT_NAMES.slice(0, randomBetween(3, 8)) as unknown as string[],
      volumePerMonth: randomBetween(500, 10000),
    });
  });

  return deals;
}

export function generateProductionBatches(): ProductionBatch[] {
  const stages: ProductionBatch['stage'][] = ['sourcing', 'preparation', 'blending', 'packaging', 'quality_check', 'ready', 'shipped'];
  const statuses: ProductionBatch['status'][] = ['on_track', 'delayed', 'at_risk', 'completed'];
  const priorities: ProductionBatch['priority'][] = ['low', 'medium', 'high', 'urgent'];
  const assignees = ['John Smith', 'Maria Garcia', 'Alex Johnson', 'Sarah Lee', 'Tom Wilson'];

  const batches: ProductionBatch[] = [];
  const now = new Date();

  for (let i = 0; i < 15; i++) {
    const product = randomFromArray(PRODUCT_NAMES);
    const stage = randomFromArray(stages);
    const stageIndex = stages.indexOf(stage);
    const progress = Math.min(100, Math.round((stageIndex / (stages.length - 1)) * 100) + randomBetween(-5, 10));
    
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - randomBetween(1, 14));
    
    const expectedCompletion = new Date(now);
    expectedCompletion.setDate(expectedCompletion.getDate() + randomBetween(1, 10));

    batches.push({
      batchId: `BATCH-${String(2024001 + i).padStart(7, '0')}`,
      productName: product,
      productSku: PRODUCT_SKUS[product],
      units: randomBetween(100, 2000),
      stage,
      progress: Math.max(0, Math.min(100, progress)),
      status: stage === 'shipped' ? 'completed' : randomFromArray(statuses.slice(0, 3)),
      startDate: startDate.toISOString(),
      expectedCompletion: expectedCompletion.toISOString(),
      assignedTo: randomFromArray(assignees),
      priority: randomFromArray(priorities),
    });
  }

  return batches.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export const FIRST_NAMES = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
export const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

export function generatePersonName(): { firstName: string; lastName: string; fullName: string } {
  const firstName = randomFromArray(FIRST_NAMES);
  const lastName = randomFromArray(LAST_NAMES);
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
  };
}

export function generateEmail(firstName: string, lastName: string, company?: string): string {
  const domain = company 
    ? company.toLowerCase().replace(/[^a-z]/g, '') + '.com'
    : randomFromArray(['gmail.com', 'yahoo.com', 'outlook.com', 'company.com']);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

export function generatePhone(): string {
  return `(${randomBetween(200, 999)}) ${randomBetween(200, 999)}-${randomBetween(1000, 9999)}`;
}
